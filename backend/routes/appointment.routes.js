import express from 'express';
import Appointment from '../models/Appointment.model.js';
import User from '../models/User.model.js';
import Notification from '../models/Notification.model.js';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import { sendEmail } from '../utils/emailService.js';
import { sendPushNotification } from '../utils/pushNotification.js';
import cron from 'node-cron';
import { recommendAppointmentSlot } from '../utils/aiSlotRecommendation.js';

const router = express.Router();

// Create appointment
router.post('/book', authenticateToken, [
  body('doctorId').notEmpty(),
  body('appointmentDate').isISO8601(),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('duration').optional().isInt({ min: 15, max: 120 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctorId, appointmentDate, appointmentTime, duration = 30, notes } = req.body;
    const patientId = req.user._id;

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingAppointment) {
      return res.status(409).json({ message: 'Time slot already booked' });
    }

    // Check doctor availability
    const appointmentDateTime = new Date(appointmentDate);
    const dayOfWeek = appointmentDateTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const doctorAvailability = doctor.availability?.get(dayOfWeek);

    if (!doctorAvailability || !doctorAvailability.isAvailable) {
      return res.status(400).json({ message: 'Doctor not available on this day' });
    }

    // Check if time is within availability window
    const [appointmentHour, appointmentMinute] = appointmentTime.split(':').map(Number);
    const [startHour, startMinute] = doctorAvailability.start.split(':').map(Number);
    const [endHour, endMinute] = doctorAvailability.end.split(':').map(Number);

    const appointmentTimeMinutes = appointmentHour * 60 + appointmentMinute;
    const startTimeMinutes = startHour * 60 + startMinute;
    const endTimeMinutes = endHour * 60 + endMinute;

    if (appointmentTimeMinutes < startTimeMinutes || appointmentTimeMinutes >= endTimeMinutes) {
      return res.status(400).json({ message: 'Appointment time outside availability window' });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      patientEmail: req.user.email,
      doctorEmail: doctor.email,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      duration,
      notes: notes || '',
      status: 'confirmed'
    });

    await appointment.save();

    // Populate appointment details
    await appointment.populate('patientId', 'username email profilePicture');
    await appointment.populate('doctorId', 'username email profilePicture specialization location');

    // Create notifications
    await Notification.create({
      userId: patientId,
      type: 'appointment_confirmed',
      title: 'Appointment Confirmed',
      message: `Your appointment with Dr. ${doctor.username} is confirmed for ${appointmentDate} at ${appointmentTime}`,
      appointmentId: appointment._id
    });

    await Notification.create({
      userId: doctorId,
      type: 'appointment_confirmed',
      title: 'New Appointment',
      message: `You have a new appointment with ${req.user.username} on ${appointmentDate} at ${appointmentTime}`,
      appointmentId: appointment._id
    });

    // Send email notifications
    try {
      await sendEmail(req.user.email, 'Appointment Confirmed', `
        Your appointment with Dr. ${doctor.username} has been confirmed.
        Date: ${appointmentDate}
        Time: ${appointmentTime}
        Location: ${doctor.location?.address || 'Clinic address'}
      `);

      await sendEmail(doctor.email, 'New Appointment', `
        You have a new appointment with ${req.user.username}.
        Date: ${appointmentDate}
        Time: ${appointmentTime}
      `);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    // Send push notifications
    try {
      await sendPushNotification(patientId, 'Appointment Confirmed', 'Your appointment has been confirmed');
      await sendPushNotification(doctorId, 'New Appointment', 'You have a new appointment');
    } catch (pushError) {
      console.error('Push notification failed:', pushError);
    }

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('appointment:created', {
        appointmentId: appointment._id,
        doctorId,
        patientId
      });
    }

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Appointment slot already booked' });
    }
    res.status(500).json({ message: 'Failed to book appointment', error: error.message });
  }
});

// Get appointment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'username email profilePicture phone')
      .populate('doctorId', 'username email profilePicture specialization location fee');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has access to this appointment
    if (req.user.role !== 'admin' && 
        appointment.patientId._id.toString() !== req.user._id.toString() &&
        appointment.doctorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointment', error: error.message });
  }
});

// Cancel appointment
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has permission to cancel
    if (req.user.role !== 'admin' &&
        appointment.patientId.toString() !== req.user._id.toString() &&
        appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment already cancelled' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Create notifications
    const otherUserId = appointment.patientId.toString() === req.user._id.toString() 
      ? appointment.doctorId 
      : appointment.patientId;

    await Notification.create({
      userId: otherUserId,
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled',
      message: `Appointment on ${appointment.appointmentDate} at ${appointment.appointmentTime} has been cancelled`,
      appointmentId: appointment._id
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('appointment:cancelled', {
        appointmentId: appointment._id,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId
      });
    }

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel appointment', error: error.message });
  }
});

// Update appointment rating
router.put('/:id/rating', authenticateToken, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('review').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, review } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only patients can rate appointments' });
    }

    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed appointments' });
    }

    appointment.rating = rating;
    appointment.review = review || '';
    await appointment.save();

    // Update doctor's rating
    const doctor = await User.findById(appointment.doctorId);
    const totalRatings = await Appointment.countDocuments({ 
      doctorId: appointment.doctorId, 
      rating: { $exists: true } 
    });
    const sumRatings = await Appointment.aggregate([
      { $match: { doctorId: appointment.doctorId, rating: { $exists: true } } },
      { $group: { _id: null, sum: { $sum: '$rating' } } }
    ]);

    if (sumRatings.length > 0) {
      doctor.rating = sumRatings[0].sum / totalRatings;
      doctor.stars = Math.round(doctor.rating);
      await doctor.save();
    }

    res.json({ message: 'Rating updated successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update rating', error: error.message });
  }
});

// Get AI recommended slots
router.get('/recommendations/:doctorId', authenticateToken, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const recommendations = await recommendAppointmentSlot(doctorId, date, Appointment, User);
    
    res.json({ recommendations: recommendations || [] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get AI recommendations', error: error.message });
  }
});

// Get available time slots for a doctor on a specific date
router.get('/availability/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const availability = doctor.availability?.get(dayOfWeek);

    if (!availability || !availability.isAvailable) {
      return res.json({ availableSlots: [] });
    }

    // Get booked appointments for this date
    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['pending', 'confirmed'] }
    }).select('appointmentTime duration');

    // Generate available time slots
    const [startHour, startMinute] = availability.start.split(':').map(Number);
    const [endHour, endMinute] = availability.end.split(':').map(Number);
    const slotDuration = 30; // 30 minutes per slot

    const availableSlots = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Check if this slot is booked
      const isBooked = bookedAppointments.some(apt => {
        const [aptHour, aptMinute] = apt.appointmentTime.split(':').map(Number);
        const aptStart = aptHour * 60 + aptMinute;
        const aptEnd = aptStart + (apt.duration || 30);
        const slotStart = currentHour * 60 + currentMinute;
        const slotEnd = slotStart + slotDuration;
        
        return (slotStart < aptEnd && slotEnd > aptStart);
      });

      if (!isBooked) {
        availableSlots.push(timeString);
      }

      // Move to next slot
      currentMinute += slotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch availability', error: error.message });
  }
});

// Schedule reminder notifications (runs every hour)
cron.schedule('0 * * * *', async () => {
  try {
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: new Date(oneHourFromNow.getFullYear(), oneHourFromNow.getMonth(), oneHourFromNow.getDate(), oneHourFromNow.getHours(), 0, 0),
        $lt: new Date(oneHourFromNow.getFullYear(), oneHourFromNow.getMonth(), oneHourFromNow.getDate(), oneHourFromNow.getHours(), 59, 59)
      },
      status: { $in: ['confirmed'] },
      reminderSent: false
    }).populate('patientId doctorId');

    for (const appointment of appointments) {
      // Send reminder notifications
      await Notification.create({
        userId: appointment.patientId._id,
        type: 'appointment_reminder',
        title: 'Appointment Reminder',
        message: `You have an appointment with Dr. ${appointment.doctorId.username} in 1 hour`,
        appointmentId: appointment._id
      });

      await sendPushNotification(appointment.patientId._id, 'Appointment Reminder', 'Your appointment is in 1 hour');
      await sendEmail(appointment.patientEmail, 'Appointment Reminder', `Your appointment is in 1 hour`);

      appointment.reminderSent = true;
      await appointment.save();
    }
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
});

export default router;

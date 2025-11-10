import express from 'express';
import User from '../models/User.model.js';
import Appointment from '../models/Appointment.model.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Apply admin authorization to all routes
router.use(authorizeRoles('admin'));

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role, limit = 50, skip = 0 } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({ users, total });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Verify doctor
router.put('/doctors/:id/verify', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.verified = true;
    await doctor.save();

    res.json({ message: 'Doctor verified successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify doctor', error: error.message });
  }
});

// Get all appointments
router.get('/appointments', async (req, res) => {
  try {
    const { status, startDate, endDate, limit = 50, skip = 0 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.appointmentDate = {};
      if (startDate) query.appointmentDate.$gte = new Date(startDate);
      if (endDate) query.appointmentDate.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'username email')
      .populate('doctorId', 'username email specialization')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ appointmentDate: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({ appointments, total });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });

    // Get appointments by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const appointmentsByMonth = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      appointmentsByMonth
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
});

export default router;


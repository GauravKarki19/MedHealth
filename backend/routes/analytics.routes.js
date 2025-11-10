import express from 'express';
import Appointment from '../models/Appointment.model.js';
import User from '../models/User.model.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get doctor analytics
router.get('/doctor', authorizeRoles('doctor'), async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { startDate, endDate } = req.query;

    const matchQuery = { doctorId };
    if (startDate || endDate) {
      matchQuery.appointmentDate = {};
      if (startDate) matchQuery.appointmentDate.$gte = new Date(startDate);
      if (endDate) matchQuery.appointmentDate.$lte = new Date(endDate);
    }

    // Total appointments
    const totalAppointments = await Appointment.countDocuments(matchQuery);

    // Appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Appointments by month
    const appointmentsByMonth = await Appointment.aggregate([
      { $match: matchQuery },
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

    // Average rating
    const ratingStats = await Appointment.aggregate([
      {
        $match: {
          ...matchQuery,
          rating: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    // Revenue (if fee is stored)
    const revenueStats = await Appointment.aggregate([
      {
        $match: {
          ...matchQuery,
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      {
        $unwind: '$doctor'
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$doctor.fee' }
        }
      }
    ]);

    res.json({
      totalAppointments,
      appointmentsByStatus,
      appointmentsByMonth,
      averageRating: ratingStats[0]?.avgRating || 0,
      totalRatings: ratingStats[0]?.totalRatings || 0,
      totalRevenue: revenueStats[0]?.totalRevenue || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

// Get patient analytics
router.get('/patient', authorizeRoles('patient'), async (req, res) => {
  try {
    const patientId = req.user._id;
    const { startDate, endDate } = req.query;

    const matchQuery = { patientId };
    if (startDate || endDate) {
      matchQuery.appointmentDate = {};
      if (startDate) matchQuery.appointmentDate.$gte = new Date(startDate);
      if (endDate) matchQuery.appointmentDate.$lte = new Date(endDate);
    }

    const totalAppointments = await Appointment.countDocuments(matchQuery);
    const upcomingAppointments = await Appointment.countDocuments({
      ...matchQuery,
      status: { $in: ['pending', 'confirmed'] },
      appointmentDate: { $gte: new Date() }
    });

    const appointmentsByStatus = await Appointment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalAppointments,
      upcomingAppointments,
      appointmentsByStatus
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

export default router;


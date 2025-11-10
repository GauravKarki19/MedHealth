import express from 'express';
import User from '../models/User.model.js';
import Appointment from '../models/Appointment.model.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get patient profile
router.get('/profile', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  try {
    const patient = await User.findById(req.user._id).select('-password');
    res.json({ patient });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Update patient profile
router.put('/profile', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  try {
    const updates = req.body;
    const patient = await User.findById(req.user._id);

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        patient[key] = updates[key];
      }
    });

    await patient.save();

    res.json({
      message: 'Profile updated successfully',
      patient: patient.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Get patient appointments
router.get('/appointments', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  try {
    const { status } = req.query;
    const query = { patientId: req.user._id };

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'username email profilePicture specialization fee location')
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

// Get patient wallet
router.get('/wallet', authenticateToken, authorizeRoles('patient'), async (req, res) => {
  try {
    const patient = await User.findById(req.user._id).select('wallet walletHistory');
    res.json({
      wallet: patient.wallet,
      walletHistory: patient.walletHistory
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wallet', error: error.message });
  }
});

export default router;


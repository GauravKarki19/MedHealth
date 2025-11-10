import express from 'express';
import User from '../models/User.model.js';
import Appointment from '../models/Appointment.model.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all doctors with filters
router.get('/search', async (req, res) => {
  try {
    const { specialization, latitude, longitude, radius = 10, status = 'online' } = req.query;

    let query = { role: 'doctor', verified: true };

    if (specialization) {
      query.specialization = new RegExp(specialization, 'i');
    }

    if (status) {
      query.status = status;
    }

    let doctors;

    // Location-based search with GeoJSON
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const radiusInMeters = parseFloat(radius) * 1000; // Convert km to meters

      doctors = await User.find({
        ...query,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: radiusInMeters
          }
        }
      }).select('-password -walletHistory -cart -orders');
    } else {
      doctors = await User.find(query).select('-password -walletHistory -cart -orders');
    }

    // Calculate distance for each doctor if coordinates provided
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      doctors = doctors.map(doctor => {
        const doctorLocation = doctor.location?.coordinates;
        if (doctorLocation && doctorLocation.length === 2) {
          const distance = calculateDistance(lat, lng, doctorLocation[1], doctorLocation[0]);
          return {
            ...doctor.toObject(),
            distance: distance.toFixed(2) // Distance in km
          };
        }
        return doctor.toObject();
      });

      // Sort by distance
      doctors.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    res.json({ doctors, count: doctors.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search doctors', error: error.message });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' })
      .select('-password -walletHistory -cart -orders');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch doctor', error: error.message });
  }
});

// Update doctor profile
router.put('/profile', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
  try {
    const updates = req.body;
    const doctor = await User.findById(req.user._id);

    if (doctor.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update location if provided
    if (updates.latitude && updates.longitude) {
      doctor.location = {
        type: 'Point',
        coordinates: [parseFloat(updates.longitude), parseFloat(updates.latitude)],
        address: updates.address || doctor.location?.address || '',
        city: updates.city || doctor.location?.city || '',
        state: updates.state || doctor.location?.state || '',
        zipCode: updates.zipCode || doctor.location?.zipCode || ''
      };
      delete updates.latitude;
      delete updates.longitude;
    }

    // Update availability if provided
    if (updates.availability) {
      doctor.availability = new Map(updates.availability);
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'location' && key !== 'availability') {
        doctor[key] = updates[key];
      }
    });

    await doctor.save();

    res.json({
      message: 'Profile updated successfully',
      doctor: doctor.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Update doctor availability
router.put('/availability', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
  try {
    const { availability } = req.body;
    const doctor = await User.findById(req.user._id);

    if (doctor.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    doctor.availability = new Map(availability);
    await doctor.save();

    res.json({
      message: 'Availability updated successfully',
      availability: Object.fromEntries(doctor.availability)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update availability', error: error.message });
  }
});

// Get doctor appointments
router.get('/appointments/list', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = { doctorId: req.user._id };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.appointmentDate = {};
      if (startDate) query.appointmentDate.$gte = new Date(startDate);
      if (endDate) query.appointmentDate.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'username email profilePicture phone')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

// Update doctor status
router.put('/status', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
  try {
    const { status } = req.body;
    const doctor = await User.findById(req.user._id);

    if (!['online', 'offline', 'busy'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    doctor.status = status;
    await doctor.save();

    res.json({ message: 'Status updated successfully', status: doctor.status });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
});

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default router;


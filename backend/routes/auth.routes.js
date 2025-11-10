import express from 'express';
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { uploadProfilePicture } from '../utils/upload.js';
import admin from 'firebase-admin';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).optional(),
  body('username').trim().notEmpty(),
  body('role').isIn(['patient', 'doctor'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username, role, specialization, age, phone, gender, id_token } = req.body;

    // Firebase Google Auth
    let firebaseEmail = email;
    if (id_token) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(id_token);
        firebaseEmail = decodedToken.email;
      } catch (error) {
        return res.status(401).json({ message: 'Invalid Firebase token' });
      }
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: firebaseEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const userData = {
      email: firebaseEmail,
      username: username || (role === 'doctor' ? `Doctor-${firebaseEmail.split('@')[0]}` : `Patient-${firebaseEmail.split('@')[0]}`),
      role,
      isGoogleAuth: !!id_token,
      phone: phone || '',
      gender: gender || '',
    };

    if (!id_token && password) {
      userData.password = password;
    }

    if (role === 'doctor') {
      userData.specialization = specialization || '';
      userData.doctorId = '';
      userData.verified = false;
      userData.status = 'offline';
      userData.fee = 0;
    } else {
      userData.age = age || null;
    }

    const user = new User(userData);
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        specialization: user.specialization,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, id_token } = req.body;

    // Firebase Google Auth
    let firebaseEmail = email;
    if (id_token) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(id_token);
        firebaseEmail = decodedToken.email;
      } catch (error) {
        return res.status(401).json({ message: 'Invalid Firebase token' });
      }
    }

    const user = await User.findOne({ email: firebaseEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password if not Google Auth
    if (!id_token && password) {
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    // Update doctor status if doctor
    if (user.role === 'doctor') {
      user.status = 'online';
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        specialization: user.specialization,
        doctorId: user.doctorId,
        verified: user.verified,
        profilePicture: user.profilePicture,
        gender: user.gender,
        phone: user.phone,
        age: user.age
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

// Update profile
router.put('/profile', authenticateToken, uploadProfilePicture.single('profilePicture'), async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (req.file) {
      // Upload to Cloudinary if configured, otherwise use a placeholder
      try {
        const { uploadToCloudinary } = await import('../utils/upload.js');
        updates.profilePicture = await uploadToCloudinary(req.file, 'arogyalink/profile');
      } catch (error) {
        console.error('Cloudinary upload failed:', error);
        // Fallback: store file path or use a default
        updates.profilePicture = req.file.originalname;
      }
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'password') {
        user[key] = updates[key];
      }
    });

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send email (implement email service)
    // await sendPasswordResetEmail(user.email, resetToken);

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process request', error: error.message });
  }
});

// Reset password
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.resetToken !== token || user.resetTokenExpiration < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
});

export default router;


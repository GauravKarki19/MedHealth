import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientEmail: {
    type: String,
    required: true
  },
  doctorEmail: {
    type: String,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true // Format: HH:mm
  },
  duration: {
    type: Number,
    default: 30 // minutes
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  meetingLink: {
    type: String,
    default: ''
  },
  prescription: {
    type: String, // URL to prescription file
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    default: ''
  },
  // AI recommended slot
  isAIRecommended: {
    type: Boolean,
    default: false
  },
  // Reminder sent
  reminderSent: {
    type: Boolean,
    default: false
  },
  // Blockchain hash (optional)
  blockchainHash: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
appointmentSchema.index({ patientId: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, appointmentTime: 1 });

// Prevent double booking
appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, appointmentTime: 1, status: 1 },
  { 
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } }
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;


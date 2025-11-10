import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.isGoogleAuth;
    }
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    required: true,
    default: 'patient'
  },
  isGoogleAuth: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: ''
  },
  // Patient-specific fields
  age: {
    type: Number,
    default: null
  },
  // Doctor-specific fields
  specialization: {
    type: String,
    default: ''
  },
  doctorId: {
    type: String,
    default: ''
  },
  fee: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'busy'],
    default: 'offline'
  },
  // Location for GeoJSON
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    zipCode: {
      type: String,
      default: ''
    }
  },
  // Availability schedule
  availability: {
    type: Map,
    of: {
      start: String, // HH:mm format
      end: String,   // HH:mm format
      isAvailable: Boolean
    },
    default: new Map()
  },
  // Statistics
  appointments: {
    type: Number,
    default: 0
  },
  stars: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  // Wallet
  wallet: {
    type: Number,
    default: 0
  },
  walletHistory: [{
    type: {
      type: String,
      enum: ['credit', 'debit']
    },
    amount: Number,
    description: String,
    timestamp: Date
  }],
  // Cart (for medicines)
  cart: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  // Orders
  orders: [{
    key: String,
    items: Array,
    total: Number,
    ordered_on: Date,
    status: String
  }],
  // Reset token
  resetToken: String,
  resetTokenExpiration: Date,
  // Timestamps
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

// Create GeoJSON index for location-based queries
userSchema.index({ location: '2dsphere' });

// Index for common queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ specialization: 1 });
userSchema.index({ status: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetToken;
  delete userObject.resetTokenExpiration;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import patientRoutes from './routes/patient.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';

// Import socket handlers
import { initializeSocket } from './socket/socketHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.DBURL || process.env.MONGODB_URI;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ArogyaLink API Server! 💖',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// MongoDB connection with GeoJSON support
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  
  // Create GeoJSON indexes for location-based search (users collection)
  mongoose.connection.db.collection('users').createIndex({ location: '2dsphere' })
    .then(() => console.log('✅ GeoJSON index created for users'))
    .catch(err => console.log('GeoJSON index creation:', err.message));
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Store io instance in app for use in routes
app.set('io', io);

// Initialize Socket.io
initializeSocket(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 ArogyaLink server running on port ${PORT}`);
  console.log(`📡 Socket.io server initialized`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export for external use if needed
export default app;


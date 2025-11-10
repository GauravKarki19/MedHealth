import Appointment from '../models/Appointment.model.js';

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    // Join room for a specific doctor
    socket.on('join:doctor', (doctorId) => {
      socket.join(`doctor:${doctorId}`);
      console.log(`User ${socket.id} joined doctor room: ${doctorId}`);
    });

    // Join room for a specific patient
    socket.on('join:patient', (patientId) => {
      socket.join(`patient:${patientId}`);
      console.log(`User ${socket.id} joined patient room: ${patientId}`);
    });

    // Listen for appointment booking attempts
    socket.on('appointment:book', async (data) => {
      try {
        const { doctorId, appointmentDate, appointmentTime } = data;

        // Check for conflicts in real-time
        const conflict = await Appointment.findOne({
          doctorId,
          appointmentDate: new Date(appointmentDate),
          appointmentTime,
          status: { $in: ['pending', 'confirmed'] }
        });

        if (conflict) {
          socket.emit('appointment:conflict', {
            message: 'Time slot is no longer available',
            conflict
          });
        } else {
          // Notify others that this slot is being booked
          io.to(`doctor:${doctorId}`).emit('appointment:slot:reserved', {
            appointmentDate,
            appointmentTime,
            reservedBy: socket.id
          });
        }
      } catch (error) {
        socket.emit('appointment:error', {
          message: 'Failed to check availability',
          error: error.message
        });
      }
    });

    // Listen for appointment cancellation
    socket.on('appointment:cancel', async (data) => {
      try {
        const { appointmentId, doctorId, patientId } = data;

        // Notify doctor and patient
        io.to(`doctor:${doctorId}`).emit('appointment:cancelled', {
          appointmentId,
          message: 'An appointment has been cancelled'
        });

        io.to(`patient:${patientId}`).emit('appointment:cancelled', {
          appointmentId,
          message: 'Your appointment has been cancelled'
        });
      } catch (error) {
        socket.emit('appointment:error', {
          message: 'Failed to cancel appointment',
          error: error.message
        });
      }
    });

    // Listen for doctor status updates
    socket.on('doctor:status', (data) => {
      const { doctorId, status } = data;
      io.emit('doctor:status:update', {
        doctorId,
        status
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });

  // Store io instance for use in routes
  return io;
};


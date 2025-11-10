// AI Slot Recommendation System
// Uses simple ML logic based on historical data

export const recommendAppointmentSlot = async (doctorId, preferredDate, Appointment, User) => {
  try {
    // Get doctor's availability
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      throw new Error('Doctor not found');
    }

    const appointmentDate = new Date(preferredDate);
    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const availability = doctor.availability?.get(dayOfWeek);

    if (!availability || !availability.isAvailable) {
      return null;
    }

    // Get historical appointment data
    const historicalAppointments = await Appointment.find({
      doctorId,
      status: 'completed',
      appointmentDate: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    }).select('appointmentTime duration');

    // Calculate average consultation duration
    const avgDuration = historicalAppointments.length > 0
      ? historicalAppointments.reduce((sum, apt) => sum + (apt.duration || 30), 0) / historicalAppointments.length
      : 30; // Default 30 minutes

    // Analyze popular time slots
    const timeSlotFrequency = {};
    historicalAppointments.forEach(apt => {
      const time = apt.appointmentTime;
      timeSlotFrequency[time] = (timeSlotFrequency[time] || 0) + 1;
    });

    // Get booked appointments for the preferred date
    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['pending', 'confirmed'] }
    }).select('appointmentTime duration');

    // Generate recommended slots
    const [startHour, startMinute] = availability.start.split(':').map(Number);
    const [endHour, endMinute] = availability.end.split(':').map(Number);
    const slotDuration = Math.ceil(avgDuration / 30) * 30; // Round to nearest 30 minutes

    const recommendedSlots = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Check if slot is available
      const isBooked = bookedAppointments.some(apt => {
        const [aptHour, aptMinute] = apt.appointmentTime.split(':').map(Number);
        const aptStart = aptHour * 60 + aptMinute;
        const aptEnd = aptStart + (apt.duration || 30);
        const slotStart = currentHour * 60 + currentMinute;
        const slotEnd = slotStart + slotDuration;
        
        return (slotStart < aptEnd && slotEnd > aptStart);
      });

      if (!isBooked) {
        // Calculate recommendation score
        const popularityScore = timeSlotFrequency[timeString] || 0;
        const timeOfDayScore = calculateTimeOfDayScore(currentHour);
        const recommendationScore = popularityScore * 0.6 + timeOfDayScore * 0.4;

        recommendedSlots.push({
          time: timeString,
          score: recommendationScore,
          isAIRecommended: true
        });
      }

      // Move to next slot
      currentMinute += slotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    // Sort by recommendation score
    recommendedSlots.sort((a, b) => b.score - a.score);

    // Return top 3 recommendations
    return recommendedSlots.slice(0, 3);
  } catch (error) {
    console.error('Error in AI slot recommendation:', error);
    return null;
  }
};

// Calculate score based on time of day (morning and afternoon are preferred)
const calculateTimeOfDayScore = (hour) => {
  if (hour >= 9 && hour <= 11) return 1.0; // Morning peak
  if (hour >= 14 && hour <= 16) return 0.9; // Afternoon peak
  if (hour >= 17 && hour <= 19) return 0.7; // Evening
  if (hour >= 8 && hour < 9) return 0.8; // Early morning
  return 0.5; // Other times
};

// Consider traffic patterns (simplified)
export const considerTrafficPatterns = (appointmentTime, location) => {
  // In a real implementation, this would integrate with traffic APIs
  // For now, we use simple heuristics
  const hour = parseInt(appointmentTime.split(':')[0]);
  
  // Rush hours: 8-10 AM and 5-7 PM
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
    return 0.8; // Slightly lower score during rush hours
  }
  
  return 1.0; // Normal score
};


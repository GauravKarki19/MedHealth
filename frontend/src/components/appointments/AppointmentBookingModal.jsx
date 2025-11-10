import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';
import httpClient from '../../httpClient';
import { io } from 'socket.io-client';

const AppointmentBookingModal = ({ isOpen, onClose, doctor, onSuccess }) => {
  const { isDarkMode } = useDarkMode();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isOpen && doctor) {
      // Initialize socket connection
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const newSocket = io(apiUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
      });
      setSocket(newSocket);

      // Listen for real-time updates
      newSocket.on('appointment:conflict', (data) => {
        alert('This time slot is no longer available. Please select another time.');
        if (selectedDate) {
          fetchAvailableSlots(selectedDate);
        }
      });

      newSocket.on('appointment:slot:reserved', (data) => {
        // Update available slots if someone else reserves this slot
        if (data.appointmentDate === selectedDate && selectedDate) {
          fetchAvailableSlots(selectedDate);
        }
      });

      return () => {
        if (newSocket) {
          newSocket.close();
        }
      };
    } else {
      // Clean up socket when modal closes
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [isOpen, doctor]);

  useEffect(() => {
    if (selectedDate && doctor) {
      fetchAvailableSlots(selectedDate);
      fetchAIRecommendations(selectedDate);
    }
  }, [selectedDate, doctor]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await httpClient.get(`/appointments/availability/${doctor._id}`, {
        params: { date }
      });
      setAvailableSlots(response.data.availableSlots || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const fetchAIRecommendations = async (date) => {
    try {
      // Call the AI recommendation endpoint
      const response = await httpClient.get(`/appointments/recommendations/${doctor._id}`, {
        params: { date }
      });
      const recommendations = response.data.recommendations || [];
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      // Fallback to first few available slots
      try {
        const availabilityResponse = await httpClient.get(`/appointments/availability/${doctor._id}`, {
          params: { date }
        });
        const slots = availabilityResponse.data.availableSlots || [];
        setAiRecommendations(slots.slice(0, 3).map(slot => ({ time: slot, isAIRecommended: true })));
      } catch (fallbackError) {
        console.error('Error fetching fallback recommendations:', fallbackError);
      }
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    setIsLoading(true);

    try {
      const response = await httpClient.post('/appointments/book', {
        doctorId: doctor._id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        notes
      });

      if (onSuccess) {
        onSuccess(response.data.appointment);
      }
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Appointment"
      size="lg"
    >
      <div className="space-y-6">
        {/* Doctor Info */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-4">
            <img
              src={doctor.profilePicture || '/doctor-male.png'}
              alt={doctor.username}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Dr. {doctor.username}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {doctor.specialization}
              </p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <Input
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={getMinDate()}
          icon={Calendar}
          required
        />

        {/* AI Recommendations */}
        {aiRecommendations.length > 0 && selectedDate && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-purple-500" />
              <label className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Recommended Times
              </label>
            </div>
            <div className="flex gap-2 flex-wrap">
              {aiRecommendations.map((rec, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTime(rec.time)}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all
                    ${selectedTime === rec.time
                      ? 'border-purple-500 bg-purple-500 text-white'
                      : isDarkMode
                        ? 'border-purple-400/30 bg-purple-500/10 text-purple-400 hover:border-purple-400'
                        : 'border-purple-300 bg-purple-50 text-purple-700 hover:border-purple-400'
                    }
                  `}
                >
                  {rec.time}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Time Slots */}
        {availableSlots.length > 0 && selectedDate && (
          <div>
            <label className={`font-semibold mb-3 block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Available Time Slots
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {availableSlots.map((slot, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTime(slot)}
                  className={`
                    px-3 py-2 rounded-lg border transition-all text-sm
                    ${selectedTime === slot
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : isDarkMode
                        ? 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }
                  `}
                >
                  {slot}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className={`font-semibold mb-2 block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Additional Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={`
              w-full px-4 py-2 rounded-lg border transition-all
              ${isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }
            `}
            placeholder="Any additional information for the doctor..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleBookAppointment}
            isLoading={isLoading}
            disabled={!selectedDate || !selectedTime}
            className="flex-1"
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentBookingModal;


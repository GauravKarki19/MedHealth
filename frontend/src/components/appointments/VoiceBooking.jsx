import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';

const VoiceBooking = ({ onBookingComplete, doctors = [] }) => {
  const { isDarkMode } = useDarkMode();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser');
      return;
    }

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setError('');
    setTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        setError('Failed to start voice recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      processVoiceCommand(transcript);
    }
  };

  const processVoiceCommand = async (command) => {
    setIsProcessing(true);
    setError('');

    try {
      // Parse voice command
      const commandLower = command.toLowerCase();
      
      // Extract doctor name
      const doctorMatch = doctors.find(doctor => 
        commandLower.includes(doctor.username.toLowerCase()) ||
        commandLower.includes(doctor.specialization.toLowerCase())
      );

      if (!doctorMatch) {
        setError('Doctor not found. Please specify a doctor name or specialization.');
        setIsProcessing(false);
        return;
      }

      // Extract time (e.g., "6 PM", "14:00", "2 PM")
      const timePatterns = [
        /(\d{1,2})\s*(pm|am)/i,
        /(\d{1,2}):(\d{2})/,
        /(\d{1,2})\s*o'clock/i
      ];

      let appointmentTime = null;
      for (const pattern of timePatterns) {
        const match = command.match(pattern);
        if (match) {
          if (match[2] && (match[2].toLowerCase() === 'pm' || match[2].toLowerCase() === 'am')) {
            let hour = parseInt(match[1]);
            const ampm = match[2].toLowerCase();
            if (ampm === 'pm' && hour !== 12) hour += 12;
            if (ampm === 'am' && hour === 12) hour = 0;
            appointmentTime = `${hour.toString().padStart(2, '0')}:00`;
          } else if (match[2]) {
            appointmentTime = `${match[1].padStart(2, '0')}:${match[2]}`;
          } else {
            let hour = parseInt(match[1]);
            if (hour < 12) {
              appointmentTime = `${hour.toString().padStart(2, '0')}:00`;
            } else {
              appointmentTime = `${hour.toString().padStart(2, '0')}:00`;
            }
          }
          break;
        }
      }

      if (!appointmentTime) {
        setError('Could not extract appointment time. Please specify a time (e.g., "6 PM", "14:00").');
        setIsProcessing(false);
        return;
      }

      // Extract date (default to today or tomorrow)
      let appointmentDate = new Date();
      if (commandLower.includes('tomorrow')) {
        appointmentDate.setDate(appointmentDate.getDate() + 1);
      } else if (commandLower.includes('today')) {
        // Keep today
      }

      // Format date
      const dateString = appointmentDate.toISOString().split('T')[0];

      // Call booking completion handler
      if (onBookingComplete) {
        await onBookingComplete({
          doctor: doctorMatch,
          appointmentDate: dateString,
          appointmentTime: appointmentTime,
          source: 'voice'
        });
      }

      setTranscript('');
    } catch (error) {
      console.error('Error processing voice command:', error);
      setError('Failed to process voice command. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const exampleCommands = [
    "Book appointment with Dr. Smith for 6 PM",
    "Schedule appointment with cardiologist for 2 PM tomorrow",
    "Book with Dr. Johnson at 14:00"
  ];

  return (
    <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Voice Booking
      </h3>

      <div className="space-y-4">
        {/* Voice Control Button */}
        <div className="flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`
              w-24 h-24 rounded-full flex items-center justify-center
              ${isListening
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600'
              }
              text-white shadow-lg transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isProcessing ? (
              <Loader2 className="animate-spin" size={32} />
            ) : isListening ? (
              <MicOff size={32} />
            ) : (
              <Mic size={32} />
            )}
          </motion.button>
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Click to start voice booking'}
          </p>
        </div>

        {/* Transcript */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {transcript}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 rounded-lg"
          >
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Example Commands */}
        <div>
          <p className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Example commands:
          </p>
          <ul className="space-y-1">
            {exampleCommands.map((cmd, index) => (
              <li key={index} className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                • "{cmd}"
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceBooking;


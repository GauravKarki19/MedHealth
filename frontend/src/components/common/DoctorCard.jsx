import { motion } from 'framer-motion';
import { MapPin, Star, DollarSign, Shield, Clock } from 'lucide-react';
import GlassCard from './GlassCard';
import Button from './Button';
import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';

const DoctorCard = ({ doctor, onBookAppointment, onViewDetails, distance }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <GlassCard
        hover
        className={`h-full flex flex-col border-2 transition-all duration-300 group cursor-pointer ${
          isDarkMode
            ? 'border-gray-700 hover:border-blue-600'
            : 'border-gray-200 hover:border-blue-500'
        }`}
      >
        <div className="flex-1 flex flex-col">
          {/* Doctor Image */}
          <div className={`relative w-full h-56 mb-6 rounded-t-lg overflow-hidden ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-700 to-gray-800'
              : 'bg-gradient-to-br from-blue-50 to-blue-100'
          }`}>
            <img
              src={doctor.profilePicture || '/doctor-male.png'}
              alt={doctor.username}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {doctor.status === 'online' && (
              <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                Available
              </div>
            )}
            {doctor.verified && (
              <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg ${
                isDarkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                <Shield className="w-4 h-4" />
                Verified
              </div>
            )}
          </div>

          {/* Doctor Info */}
          <div className="flex-1 flex flex-col px-2">
            <div className="mb-4">
              <h3 className={`text-2xl font-black mb-2 transition-colors ${
                isDarkMode
                  ? 'text-white group-hover:text-blue-400'
                  : 'text-gray-900 group-hover:text-blue-900'
              }`}>
                Dr. {doctor.username}
              </h3>
              <p className={`text-base font-semibold ${
                isDarkMode ? 'text-blue-400' : 'text-blue-700'
              }`}>
                {doctor.specialization || 'General Medicine'}
              </p>
            </div>

            {/* Rating */}
            <div className={`flex items-center gap-3 mb-5 p-3 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-700/50 group-hover:bg-gray-700'
                : 'bg-gray-50 group-hover:bg-blue-50'
            }`}>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => {
                  const rating = typeof doctor.rating === 'string' ? parseFloat(doctor.rating) : (doctor.rating || 0);
                  return (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(rating) ? 'fill-yellow-500 text-yellow-500' : (isDarkMode ? 'text-gray-600' : 'text-gray-300')}
                    />
                  );
                })}
              </div>
              <span className={`text-base font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {typeof doctor.rating === 'string' ? doctor.rating : (doctor.rating?.toFixed(1) || '0.0')}
              </span>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                ({doctor.appointments || 0} reviews)
              </span>
            </div>

            {/* Location & Distance */}
            {doctor.location && (
              <div className={`flex items-start gap-3 mb-5 p-3 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-700/50 group-hover:bg-gray-700'
                  : 'bg-gray-50 group-hover:bg-blue-50'
              }`}>
                <MapPin size={18} className={`mt-0.5 flex-shrink-0 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <span className={`text-sm block truncate mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {doctor.location.city || doctor.location.address || 'Location not set'}
                  </span>
                  {distance && (
                    <span className={`text-sm font-semibold ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-700'
                    }`}>
                      {distance} km away
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Fee */}
            <div className={`flex items-center justify-between mb-6 p-4 rounded-lg border-2 transition-colors ${
              isDarkMode
                ? 'bg-blue-900/30 border-blue-800 group-hover:bg-blue-900/40 group-hover:border-blue-700'
                : 'bg-blue-50 border-blue-200 group-hover:bg-blue-100 group-hover:border-blue-300'
            }`}>
              <div className="flex items-center gap-2">
                <DollarSign size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-700'} />
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Consultation Fee
                </span>
              </div>
              <span className={`text-2xl font-black ${
                isDarkMode ? 'text-white' : 'text-blue-900'
              }`}>
                ₹{doctor.fee || 0}
              </span>
            </div>

            {/* Actions */}
            <div className={`flex gap-4 mt-auto pt-4 border-t-2 transition-colors ${
              isDarkMode
                ? 'border-gray-700 group-hover:border-gray-600'
                : 'border-gray-200 group-hover:border-blue-200'
            }`}>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(doctor);
                }}
                className="flex-1 text-sm border-2 py-3"
              >
                Details
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookAppointment(doctor);
                }}
                className="flex-1 text-sm font-semibold py-3"
                disabled={doctor.status !== 'online'}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default DoctorCard;

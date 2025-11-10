import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Map, List, Filter, Mic, Shield } from 'lucide-react';
import httpClient from '../httpClient';
import DoctorCard from '../components/common/DoctorCard';
import AppointmentBookingModal from '../components/appointments/AppointmentBookingModal';
import DoctorMapView from '../components/maps/DoctorMapView';
import VoiceBooking from '../components/appointments/VoiceBooking';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import GlassCard from '../components/common/GlassCard';
import { useDarkMode } from '../contexts/DarkMode/DarkModeContext';

const DoctorSearch = () => {
  const { isDarkMode } = useDarkMode();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [showVoiceBooking, setShowVoiceBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(10); // km

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctors.length > 0) {
      filterDoctors();
    } else {
      // If no doctors, set filtered to empty
      setFilteredDoctors([]);
    }
  }, [searchQuery, specialization, doctors, radius, userLocation]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      // Use the Flask backend endpoint /get_status
      const response = await httpClient.get('/get_status');
      console.log('Doctors API Response:', response.data);
      
      // Transform the response to match the expected format
      const doctorsList = (response.data.details || []).map((doctor) => {
        // Calculate rating safely
        const rating = doctor.noOfAppointments > 0 && doctor.noOfStars 
          ? parseFloat((doctor.noOfStars / doctor.noOfAppointments).toFixed(1))
          : 0;
        
        // Parse location if it's a string or ensure it's in the correct format
        let location = null;
        if (doctor.location) {
          if (typeof doctor.location === 'string') {
            try {
              location = JSON.parse(doctor.location);
            } catch (e) {
              console.warn('Failed to parse location:', doctor.location);
            }
          } else if (doctor.location.coordinates) {
            location = doctor.location;
          }
        }
        
        return {
          _id: doctor.id || doctor.email || `doctor-${Math.random()}`,
          username: doctor.username || 'Unknown Doctor',
          specialization: doctor.specialization || 'General Medicine',
          status: doctor.status || 'offline',
          fee: doctor.fee || 199,
          email: doctor.email || '',
          phone: doctor.phone || '',
          gender: doctor.gender || 'male',
          isInMeet: doctor.isInMeet || false,
          rating: rating,
          appointments: doctor.noOfAppointments || 0,
          verified: true, // All doctors from /get_status are verified
          profilePicture: doctor.profilePicture || (doctor.gender === 'female' ? '/doctor-female.png' : '/doctor-male.png'),
          location: location, // Location data for map view
        };
      });
      
      console.log('Processed doctors list:', doctorsList);
      console.log('Total doctors:', doctorsList.length);
      setDoctors(doctorsList);
      
      if (doctorsList.length === 0) {
        console.warn('No doctors found in the response. Make sure doctors are registered and verified.');
      } else {
        console.log('Successfully loaded', doctorsList.length, 'doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      console.error('Error details:', error.response?.data || error.message);
      setDoctors([]);
      // Show user-friendly error message
      alert('Failed to load doctors. Please refresh the page or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterDoctors = () => {
    if (!doctors || doctors.length === 0) {
      setFilteredDoctors([]);
      return;
    }

    let filtered = [...doctors];

    // Filter by specialization
    if (specialization && specialization.trim() !== '') {
      filtered = filtered.filter(
        (doctor) =>
          doctor.specialization?.toLowerCase().includes(specialization.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (doctor) =>
          doctor.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    console.log(`Filtered doctors: ${filtered.length} out of ${doctors.length} total`);
    setFilteredDoctors(filtered);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    // Navigate to doctor details page or show modal
    console.log('View details:', doctor);
  };

  const handleVoiceBookingComplete = async (bookingData) => {
    try {
      const response = await httpClient.post('/appointments/book', {
        doctorId: bookingData.doctor._id,
        appointmentDate: bookingData.appointmentDate,
        appointmentTime: bookingData.appointmentTime,
        source: 'voice',
      });

      alert('Appointment booked successfully via voice!');
      setShowVoiceBooking(false);
      // Refresh appointments or navigate
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'General Medicine',
  ];

  return (
    <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Find Your Doctor
          </h1>
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Search for verified healthcare professionals by specialization, location, and availability
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <GlassCard className={`border-2 p-8 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Search Input */}
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </div>

              {/* Specialization Filter */}
              <div>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Radius Filter */}
              {userLocation && (
                <div>
                  <Input
                    type="number"
                    placeholder="Radius (km)"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value) || 10)}
                    min="1"
                    max="50"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-wrap gap-4 pt-6 border-t-2 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                onClick={() => setViewMode('list')}
                size="sm"
                className="flex items-center px-5 py-2.5"
              >
                <List size={18} className="mr-2" />
                List View
              </Button>
              <Button
                variant={viewMode === 'map' ? 'primary' : 'outline'}
                onClick={() => setViewMode('map')}
                size="sm"
                className="flex items-center px-5 py-2.5"
              >
                <Map size={18} className="mr-2" />
                Map View
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowVoiceBooking(!showVoiceBooking)}
                size="sm"
                className="flex items-center px-5 py-2.5"
              >
                <Mic size={18} className="mr-2" />
                Voice Booking
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Voice Booking Section */}
        {showVoiceBooking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12"
          >
            <VoiceBooking
              onBookingComplete={handleVoiceBookingComplete}
              doctors={doctors}
            />
          </motion.div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className={`inline-block animate-spin rounded-full h-16 w-16 border-b-2 ${
              isDarkMode ? 'border-blue-500' : 'border-blue-600'
            }`}></div>
            <p className={`mt-6 text-lg font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Loading doctors...
            </p>
          </div>
        ) : viewMode === 'map' ? (
          <DoctorMapView
            doctors={filteredDoctors}
            onDoctorSelect={handleBookAppointment}
            userLocation={userLocation}
          />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-10">
              <p className={`text-lg font-semibold ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Found <span className={`font-black text-2xl ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-900'
                }`}>{filteredDoctors.length}</span> doctor(s)
              </p>
            </div>

            {filteredDoctors.length === 0 ? (
              <GlassCard className={`text-center py-16 border-2 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                {doctors.length === 0 ? (
                  <>
                    <p className={`text-xl font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      No doctors available
                    </p>
                    <p className={`text-base ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      There are no verified doctors registered in the system yet. Please check back later.
                    </p>
                  </>
                ) : (
                  <>
                    <p className={`text-xl font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      No doctors match your search
                    </p>
                    <p className={`text-base ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Try adjusting your search criteria or filters to find doctors.
                    </p>
                  </>
                )}
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {filteredDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DoctorCard
                      doctor={doctor}
                      onBookAppointment={handleBookAppointment}
                      onViewDetails={handleViewDetails}
                      distance={doctor.distance}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedDoctor && (
          <AppointmentBookingModal
            isOpen={showBookingModal}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedDoctor(null);
            }}
            doctor={selectedDoctor}
            onSuccess={(appointment) => {
              alert('Appointment booked successfully!');
              setShowBookingModal(false);
              setSelectedDoctor(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, X } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';
import GlassCard from '../common/GlassCard';
import Button from '../common/Button';

const DoctorMapView = ({ doctors = [], onDoctorSelect, userLocation = null }) => {
  const { isDarkMode } = useDarkMode();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    // Load Google Maps script
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key is not set. Map view will not work.');
      setMapError('Google Maps API key is not configured. Please configure VITE_GOOGLE_MAPS_API_KEY to use map view.');
      return;
    }

    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        initializeMap();
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        // Show error in map container
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f3f4f6; color: #6b7280; padding: 20px; text-align: center;">
              <div>
                <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Unable to load map</p>
                <p style="font-size: 14px;">Google Maps could not be loaded. Please check your API key configuration.</p>
              </div>
            </div>
          `;
        }
      };
      document.head.appendChild(script);
    } else if (window.google) {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (map && doctors.length > 0) {
      addMarkers();
    } else if (map && doctors.length === 0) {
      setMapError('No doctors available to display on the map.');
    }
  }, [map, doctors]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const defaultCenter = userLocation 
      ? { lat: userLocation.latitude, lng: userLocation.longitude }
      : { lat: 28.6139, lng: 77.2090 }; // Default to Delhi

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 12,
      styles: isDarkMode ? darkMapStyle : lightMapStyle,
      mapTypeControl: false,
      streetViewControl: false,
    });

    setMap(mapInstance);

    // Initialize directions service
    const directionsServiceInstance = new window.google.maps.DirectionsService();
    const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
      map: mapInstance,
      suppressMarkers: false,
    });

    setDirectionsService(directionsServiceInstance);
    setDirectionsRenderer(directionsRendererInstance);

    // Add user location marker if available
    if (userLocation) {
      new window.google.maps.Marker({
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        map: mapInstance,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        title: 'Your Location',
      });
    }
  };

  const addMarkers = () => {
    if (!map || !window.google) {
      console.warn('Map not initialized or Google Maps not loaded');
      setMapError('Map is not initialized');
      return;
    }

    // Clear existing markers and error
    markers.forEach(marker => marker.setMap(null));
    setMapError(null);
    const newMarkers = [];

    // Filter doctors with valid locations
    const doctorsWithLocations = doctors.filter(doctor => 
      doctor.location && 
      doctor.location.coordinates && 
      Array.isArray(doctor.location.coordinates) &&
      doctor.location.coordinates.length === 2 &&
      typeof doctor.location.coordinates[0] === 'number' &&
      typeof doctor.location.coordinates[1] === 'number' &&
      !isNaN(doctor.location.coordinates[0]) &&
      !isNaN(doctor.location.coordinates[1])
    );

    console.log(`Adding markers for ${doctorsWithLocations.length} doctors with locations out of ${doctors.length} total`);

    if (doctorsWithLocations.length === 0) {
      setMapError('No doctors have location information available. Please use list view to browse doctors.');
      return;
    }

    doctorsWithLocations.forEach(doctor => {
      try {
        const position = {
          lat: doctor.location.coordinates[1],
          lng: doctor.location.coordinates[0],
        };

        const marker = new window.google.maps.Marker({
          position,
          map,
          title: `Dr. ${doctor.username} - ${doctor.specialization}`,
          icon: {
            url: doctor.status === 'online' 
              ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
              : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <h3 style="margin: 0 0 5px 0; font-weight: bold;">Dr. ${doctor.username || 'Unknown'}</h3>
              <p style="margin: 0 0 5px 0; color: #666;">${doctor.specialization || 'General Medicine'}</p>
              <p style="margin: 0 0 5px 0; color: #666;">₹${doctor.fee || 0}</p>
              <p style="margin: 0; color: ${doctor.status === 'online' ? 'green' : 'red'};">
                ${doctor.status === 'online' ? '● Online' : '○ Offline'}
              </p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          setSelectedDoctor(doctor);
          if (onDoctorSelect) {
            onDoctorSelect(doctor);
          }
        });

        newMarkers.push(marker);
      } catch (error) {
        console.error(`Error adding marker for doctor ${doctor.username}:`, error);
      }
    });

    setMarkers(newMarkers);

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      try {
        const bounds = new window.google.maps.LatLngBounds();
        newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
        if (userLocation) {
          bounds.extend(new window.google.maps.LatLng(userLocation.latitude, userLocation.longitude));
        }
        map.fitBounds(bounds);
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    }
  };

  const getDirections = (doctor) => {
    if (!map || !directionsService || !directionsRenderer || !userLocation) {
      alert('Directions not available. Please enable location services.');
      return;
    }

    const doctorLocation = {
      lat: doctor.location.coordinates[1],
      lng: doctor.location.coordinates[0],
    };

    directionsService.route(
      {
        origin: { lat: userLocation.latitude, lng: userLocation.longitude },
        destination: doctorLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        } else {
          console.error('Directions request failed:', status);
          alert('Failed to get directions');
        }
      }
    );
  };

  const clearDirections = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }
  };

  // Dark and light map styles
  const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    // Add more dark theme styles as needed
  ];

  const lightMapStyle = [];

  // Show error if no API key
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <div className="relative w-full h-full">
        <div className="w-full h-[600px] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <p className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Map View Unavailable
            </p>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Google Maps API key is not configured. Please use list view to browse doctors.
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              To enable map view, please configure VITE_GOOGLE_MAPS_API_KEY in your environment variables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-[600px] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800" />
      
      {/* Error Message Overlay */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/95 dark:bg-gray-800/95 rounded-xl z-10">
          <div className="text-center p-8 max-w-md">
            <p className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Map View Unavailable
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {mapError}
            </p>
          </div>
        </div>
      )}
      
      {selectedDoctor && !mapError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 z-10"
        >
          <GlassCard>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dr. {selectedDoctor.username}
                </h3>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedDoctor.specialization}
                </p>
                {selectedDoctor.location?.address && (
                  <p className={`text-sm flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <MapPin size={16} />
                    {selectedDoctor.location.address}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedDoctor(null);
                  clearDirections();
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (onDoctorSelect) {
                    onDoctorSelect(selectedDoctor);
                  }
                }}
                className="flex-1"
              >
                Book Appointment
              </Button>
              {userLocation && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getDirections(selectedDoctor)}
                  className="flex-1"
                >
                  <Navigation size={16} className="mr-2" />
                  Get Directions
                </Button>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorMapView;


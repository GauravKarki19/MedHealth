# ArogyaLink Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

## Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_*` - Cloudinary credentials for image uploads
- `MAIL_*` - Email configuration for notifications
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `FIREBASE_*` - Firebase credentials for push notifications

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key

## Database Setup

1. Create MongoDB database (local or Atlas)
2. The application will automatically create indexes on first run
3. GeoJSON index will be created for location-based search

## Features Configuration

### Google Maps Integration
1. Get API key from Google Cloud Console
2. Enable Maps JavaScript API and Directions API
3. Add API key to environment variables

### Cloudinary Setup
1. Create Cloudinary account
2. Get cloud name, API key, and API secret
3. Add to backend .env file

### Firebase Setup (Optional)
1. Create Firebase project
2. Generate service account key
3. Add credentials to backend .env file

## Running the Application

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Production
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build && npm start
```

## Testing

### Test User Registration
1. Register as patient
2. Register as doctor
3. Login and verify JWT token

### Test Appointment Booking
1. Search for doctors
2. Book appointment
3. Verify real-time conflict prevention
4. Check notifications

## Troubleshooting

### MongoDB Connection Issues
- Check MongoDB URI in .env
- Verify MongoDB is running
- Check network connectivity

### Socket.io Connection Issues
- Verify CORS configuration
- Check frontend URL in backend .env
- Verify Socket.io server is running

### GeoJSON Index Issues
- Verify location data format in User model
- Check MongoDB version (requires 2.4+)
- Manually create index if needed

## Next Steps

1. Configure email service for notifications
2. Set up Firebase for push notifications
3. Add Google Maps API key
4. Configure Cloudinary for image uploads
5. Set up production database
6. Deploy to production


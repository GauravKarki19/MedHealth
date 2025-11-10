# 🏥 ArogyaLink - Modern Healthcare Appointment Platform

ArogyaLink is a next-generation healthcare appointment booking platform built with the MERN stack, featuring real-time booking, AI-powered slot recommendations, voice-based booking, and location-based doctor search.

## 🚀 Features

### Core Features
- **Real-time Appointment Booking** - Socket.io powered conflict-free booking
- **Location-based Search** - Find doctors by shortest distance using GeoJSON
- **AI Slot Recommendations** - ML-powered optimal time slot suggestions
- **Voice Booking** - Book appointments using voice commands (Web Speech API)
- **Google Maps Integration** - View doctor locations and get directions
- **Notification System** - Email, push notifications, and 1-hour reminders
- **Analytics Dashboard** - Real-time insights for doctors and admins
- **Dark/Light Mode** - Modern UI with glassmorphism design

### User Roles
- **Patient Dashboard** - Book appointments, view history, manage profile
- **Doctor Dashboard** - Manage appointments, view analytics, set availability
- **Admin Dashboard** - User management, system analytics, doctor verification

### UI/UX
- **Modern Design** - Glassmorphism and Neumorphism styles
- **Responsive** - Mobile-first design with smooth animations
- **Reusable Components** - Cards, Modals, Tables, and more
- **Framer Motion** - Smooth transitions and animations

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with GeoJSON indexing
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Mongoose** - ODM for MongoDB

### Frontend
- **React** - UI library
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Socket.io Client** - Real-time updates
- **Recharts** - Data visualization
- **Web Speech API** - Voice recognition

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google Maps API Key (for map features)
- Cloudinary Account (for image uploads)
- Firebase Account (for push notifications)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/arogyalink
JWT_SECRET=your-secret-key
# ... other variables
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

5. Start the development server:
```bash
npm run dev
```

## 🗂️ Project Structure

```
arogyalink/
├── backend/
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth and error handling
│   ├── socket/          # Socket.io handlers
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── routes/      # Route configuration
│   │   └── httpClient.js # API client
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Doctors
- `GET /api/doctors/search` - Search doctors with filters
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/profile` - Update doctor profile
- `PUT /api/doctors/availability` - Update availability

### Appointments
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/appointments/availability/:doctorId` - Get available slots

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read

### Analytics
- `GET /api/analytics/doctor` - Doctor analytics
- `GET /api/analytics/patient` - Patient analytics

## 🎯 Key Features Implementation

### Real-time Booking
- Socket.io prevents double-booking
- Real-time slot availability updates
- Conflict detection and resolution

### Location-based Search
- GeoJSON indexing in MongoDB
- Distance calculation using Haversine formula
- Radius-based filtering

### AI Slot Recommendations
- Historical data analysis
- Popular time slot identification
- Traffic pattern consideration
- Optimal slot scoring

### Voice Booking
- Web Speech API integration
- Natural language processing
- Command parsing and validation

## 📱 Usage

### For Patients
1. Register/Login
2. Search for doctors by specialization or location
3. View doctor availability
4. Book appointment (traditional or voice)
5. Receive confirmation and reminders
6. Get directions to clinic

### For Doctors
1. Register and complete profile
2. Set availability schedule
3. Add clinic location
4. Manage appointments
5. View analytics dashboard
6. Receive appointment notifications

## 🔒 Security
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS configuration
- Helmet.js security headers

## 🚀 Deployment

### Backend (Vercel/Heroku)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy
vercel --prod
```

## 📝 License

Apache License 2.0

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## 📧 Support

For support, email support@arogyalink.com or open an issue on GitHub.

## 🎉 Acknowledgments

- Built on top of TelMedSphere
- Uses modern MERN stack best practices
- Implements SOLID and DRY principles
- Component-based architecture


# TelMedSphere - Installation Steps

## Status Check

✅ **Frontend**: Dependencies appear to be installed (node_modules exists)
🔄 **Backend**: Virtual environment created, dependencies installation was in progress
⏳ **Models**: Not yet set up

## Quick Installation Guide

### Option 1: Use the Batch Script (Easiest for Windows)

Simply double-click `install-dependencies.bat` or run:
```cmd
install-dependencies.bat
```

### Option 2: Manual Installation

#### Step 1: Frontend (If not already done)

```powershell
cd frontend
npm install
```

#### Step 2: Backend

```powershell
cd backend

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Note: If flasgger installation fails, you can skip it or install separately:
# pip install flasgger --no-cache-dir
```

#### Step 3: ML Models

```powershell
cd models

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

## Running the Application

### Terminal 1 - Backend Server
```powershell
cd backend
.\venv\Scripts\Activate.ps1
flask run
```
Backend will run on: http://localhost:5000

### Terminal 2 - ML Models Server
```powershell
cd models
.\venv\Scripts\Activate.ps1
flask run --port 5001
```
ML Models will run on: http://localhost:5001

### Terminal 3 - Frontend
```powershell
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000 (or the port shown)

## Environment Variables Needed

### Frontend (.env file in frontend directory)
```
VITE_PUBLICATION_KEY=your_stripe_publication_key
VITE_JAAS_APP_ID=your_jitsi_meet_app_id
VITE_API_KEY=your_api_key
VITE_BACKEND_URL=http://localhost:5000
VITE_MODEL_URL=http://localhost:5001
```

### Backend (.env file in backend directory)
```
DBURL=mongodb://username:password@host:port/database
HOST_EMAIL=your_email@gmail.com
PASSWORD=your_app_password
PORT=587
STRIPE_SECRET_KEY=your_stripe_secret_key
DOMAIN=http://localhost:5000
SECRET=your_secret_key_for_jwt
WHATSAPP=your_whatsapp_api_token
```

### Models
No .env file needed for models (runs on port 5001 by default)

## Troubleshooting

### If pip install fails for backend:
1. Make sure virtual environment is activated
2. Upgrade pip: `python -m pip install --upgrade pip`
3. Try installing packages one by one if needed

### If npm install fails for frontend:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. If issues persist, try `npm install --legacy-peer-deps`

### If flask run fails:
1. Make sure virtual environment is activated
2. Check if port 5000 is already in use
3. Set FLASK_APP environment variable: `$env:FLASK_APP="app.py"`

## Next Steps After Installation

1. ✅ Install all dependencies (you're here)
2. ⬜ Create .env files with your API keys
3. ⬜ Start all three servers (backend, models, frontend)
4. ⬜ Access the application at http://localhost:3000

## Need Help?

- Check the main README.md for more details
- Review SETUP_GUIDE.md for comprehensive setup instructions
- Ensure MongoDB is running or MongoDB Atlas connection is configured


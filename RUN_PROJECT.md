# How to Run TelMedSphere - All Three Servers

## Prerequisites
- ✅ All dependencies installed
- ✅ MongoDB connection configured in `backend/.env`
- ✅ Backend `.env` file configured
- ✅ Frontend `.env` file configured (optional)

---

## Method 1: Three Separate Terminal Windows (Recommended)

### Terminal 1: Backend Server (Port 5000)

1. Open PowerShell
2. Navigate to backend directory:
   ```powershell
   cd D:\VeersaHackathon\TelMedSphere\backend
   ```
3. Activate virtual environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
4. Set Flask app:
   ```powershell
   $env:FLASK_APP="app.py"
   ```
5. Start backend server:
   ```powershell
   flask run
   ```
6. **Keep this terminal open** - You should see:
   ```
   MongoDB connected successfully!
   * Running on http://127.0.0.1:5000
   ```

### Terminal 2: ML Models Server (Port 5001)

1. Open a **NEW** PowerShell window
2. Navigate to models directory:
   ```powershell
   cd D:\VeersaHackathon\TelMedSphere\models
   ```
3. Activate virtual environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
4. Set Flask app:
   ```powershell
   $env:FLASK_APP="app.py"
   ```
5. Start ML models server:
   ```powershell
   flask run --port 5001
   ```
6. **Keep this terminal open** - You should see:
   ```
   * Running on http://127.0.0.1:5001
   ```

### Terminal 3: Frontend Server (Port 5173 or 3000)

1. Open a **NEW** PowerShell window
2. Navigate to frontend directory:
   ```powershell
   cd D:\VeersaHackathon\TelMedSphere\frontend
   ```
3. Start frontend server:
   ```powershell
   npm run dev
   ```
4. **Keep this terminal open** - You should see:
   ```
   VITE v4.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

---

## Method 2: Using PowerShell Script (Alternative)

Create a file `start-all.ps1` in the project root:

```powershell
# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\VeersaHackathon\TelMedSphere\backend; .\venv\Scripts\Activate.ps1; `$env:FLASK_APP='app.py'; flask run"

# Wait a bit
Start-Sleep -Seconds 2

# Start ML Models
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\VeersaHackathon\TelMedSphere\models; .\venv\Scripts\Activate.ps1; `$env:FLASK_APP='app.py'; flask run --port 5001"

# Wait a bit
Start-Sleep -Seconds 2

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\VeersaHackathon\TelMedSphere\frontend; npm run dev"
```

Then run:
```powershell
.\start-all.ps1
```

---

## Quick Start Commands

### Backend (Terminal 1):
```powershell
cd D:\VeersaHackathon\TelMedSphere\backend
.\venv\Scripts\Activate.ps1
$env:FLASK_APP="app.py"
flask run
```

### ML Models (Terminal 2):
```powershell
cd D:\VeersaHackathon\TelMedSphere\models
.\venv\Scripts\Activate.ps1
$env:FLASK_APP="app.py"
flask run --port 5001
```

### Frontend (Terminal 3):
```powershell
cd D:\VeersaHackathon\TelMedSphere\frontend
npm run dev
```

---

## Accessing the Application

Once all three servers are running:

- **Frontend**: http://localhost:5173 (or the port shown in terminal)
- **Backend API**: http://127.0.0.1:5000
- **Backend API Docs (Swagger)**: http://127.0.0.1:5000/api/docs
- **ML Models API**: http://127.0.0.1:5001

---

## Stopping the Servers

To stop each server:
1. Go to each terminal window
2. Press `Ctrl+C`
3. Type `deactivate` to deactivate virtual environments (for backend and models)

---

## Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

**Backend (port 5000):**
```powershell
# Find and kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**ML Models (port 5001):**
```powershell
# Find and kill process using port 5001
netstat -ano | findstr :5001
taskkill /PID <PID_NUMBER> /F
```

**Frontend (port 5173):**
```powershell
# Find and kill process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

### MongoDB Connection Error

Make sure:
1. MongoDB is running (if using local MongoDB)
2. DBURL in `backend/.env` is correct
3. MongoDB Atlas IP whitelist includes your IP (if using Atlas)

### Frontend Can't Connect to Backend

Check:
1. Backend is running on port 5000
2. `VITE_BACKEND_URL` in `frontend/.env` is set to `http://localhost:5000`
3. `VITE_MODEL_URL` in `frontend/.env` is set to `http://localhost:5001`

---

## Environment Variables Checklist

### Backend `.env` (Required):
- ✅ `DBURL` - MongoDB connection string
- ⚠️ `SECRET` - JWT secret key
- ⚠️ `DOMAIN` - Backend domain (e.g., `http://localhost:5000`)
- ⚠️ `HOST_EMAIL` - Email for sending emails
- ⚠️ `PASSWORD` - Email app password
- ⚠️ `STRIPE_SECRET_KEY` - Stripe secret key (for payments)
- ⚠️ Firebase variables (optional)
- ⚠️ Twilio variables (optional)

### Frontend `.env` (Required):
- ⚠️ `VITE_BACKEND_URL` - Backend URL (e.g., `http://localhost:5000`)
- ⚠️ `VITE_MODEL_URL` - ML Models URL (e.g., `http://localhost:5001`)
- ⚠️ `VITE_PUBLICATION_KEY` - Stripe publishable key
- ⚠️ `VITE_JAAS_APP_ID` - Jitsi Meet App ID
- ⚠️ `VITE_API_KEY` - Chatbot API key
- ⚠️ Firebase variables (for authentication)

---

## Notes

- All three servers must be running simultaneously for the application to work
- Backend and ML Models use Python virtual environments
- Frontend uses npm/node
- MongoDB must be accessible (local or cloud)
- Keep all terminal windows open while using the application

---

## Next Steps

1. ✅ Start all three servers
2. ✅ Open http://localhost:5173 in your browser
3. ✅ Test the application
4. ✅ Check API documentation at http://127.0.0.1:5000/api/docs

---

## Need Help?

If you encounter any issues:
1. Check that all three servers are running
2. Verify MongoDB connection
3. Check environment variables
4. Review error messages in each terminal
5. Check the browser console for frontend errors


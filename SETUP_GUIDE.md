# TelMedSphere Setup Guide

This guide will help you set up and run the TelMedSphere project on Windows.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **Python** (v3.8 or higher) - [Download](https://www.python.org/)
3. **MongoDB** - Either MongoDB Atlas (cloud) or local MongoDB installation

## Quick Setup (Using PowerShell Script)

1. Open PowerShell in the project directory
2. Run the setup script:
   ```powershell
   .\setup.ps1
   ```

## Manual Setup

### Step 1: Frontend Setup

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   VITE_PUBLICATION_KEY=your_stripe_publication_key
   VITE_JAAS_APP_ID=your_jitsi_meet_app_id
   VITE_API_KEY=your_api_key
   VITE_BACKEND_URL=http://localhost:5000
   VITE_MODEL_URL=http://localhost:5001
   ```

4. Start the development server:
   ```powershell
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000` (or the port shown in terminal)

### Step 2: Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Create a virtual environment:
   ```powershell
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

4. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the backend directory with the following variables:
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

6. Start the Flask server:
   ```powershell
   flask run
   ```

   The backend will be available at `http://localhost:5000`

### Step 3: ML Models Setup

1. Navigate to the models directory:
   ```powershell
   cd models
   ```

2. Create a virtual environment:
   ```powershell
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

4. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

5. Ensure all model files are present in the models directory:
   - `ExtraTrees`
   - `GradientBoost`
   - `LightGBM`
   - `Random Forest`
   - `XGBoost`
   - `dataset.csv`
   - `symptom_Description.csv`
   - `symptom_precaution.csv`
   - `Symptom-severity.csv`

6. Start the ML models server:
   ```powershell
   flask run --port 5001
   ```

   The ML models server will be available at `http://localhost:5001`

## Running the Application

### Option 1: Run All Services Separately

1. **Terminal 1** - Backend:
   ```powershell
   cd backend
   .\venv\Scripts\Activate.ps1
   flask run
   ```

2. **Terminal 2** - ML Models:
   ```powershell
   cd models
   .\venv\Scripts\Activate.ps1
   flask run --port 5001
   ```

3. **Terminal 3** - Frontend:
   ```powershell
   cd frontend
   npm run dev
   ```

### Option 2: Using Docker (Recommended)

1. Update environment variables in `docker-compose.yml`

2. Build and run with Docker Compose:
   ```powershell
   docker-compose up --build -d
   ```

   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Environment Variables Setup

### Getting API Keys

1. **Stripe Keys**: 
   - Sign up at https://stripe.com/
   - Get your API keys from the Stripe Dashboard

2. **Jitsi Meet App ID**: 
   - Sign up at https://jitsi.com/
   - Create a JaaS app to get your App ID

3. **MongoDB URL**: 
   - Use MongoDB Atlas (free tier available) at https://www.mongodb.com/cloud/atlas
   - Or set up a local MongoDB instance

4. **Email Configuration**:
   - For Gmail, create an App Password: https://support.google.com/accounts/answer/185833

5. **WhatsApp API**: 
   - Sign up with Twilio or another WhatsApp Business API provider

## Troubleshooting

### Frontend Issues

- **Port already in use**: Change the port in `vite.config.js` or kill the process using the port
- **Module not found**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Backend Issues

- **MongoDB connection error**: Check your MongoDB URL in the `.env` file
- **Import errors**: Ensure the virtual environment is activated and all dependencies are installed
- **Port already in use**: Change the port using `flask run --port 5002` or kill the process

### ML Models Issues

- **Model file not found**: Ensure all model files are present in the models directory
- **CSV file errors**: Ensure all CSV files are in the models directory

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:5000/api/docs

## Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Vite Documentation](https://vitejs.dev/)

## Need Help?

If you encounter any issues, please check:
1. All prerequisites are installed
2. All environment variables are set correctly
3. All services are running on the correct ports
4. MongoDB is accessible

For more help, refer to the main README.md file.


# 🚀 MedHealth Deployment Steps - Complete Guide

Step-by-step guide to deploy MedHealth to production with all functionality working.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Repository Setup](#github-repository-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Environment Variables](#environment-variables)
6. [Testing & Verification](#testing--verification)

---

## ✅ Prerequisites

Before starting, ensure you have:

- [x] GitHub account
- [x] Render account (sign up at https://render.com)
- [x] Vercel account (sign up at https://vercel.com)
- [x] MongoDB Atlas account (sign up at https://www.mongodb.com/cloud/atlas)
- [x] Google Cloud account (for Maps API - optional)
- [x] Firebase account (for Google Auth - optional)
- [x] Stripe account (for payments - optional)

---

## 📦 Step 1: GitHub Repository Setup

### 1.1 Initialize Git Repository

```bash
# Navigate to project directory
cd D:\VeersaHackathon\TelMedSphere

# Initialize git (if not already initialized)
git init

# Check current status
git status
```

### 1.2 Create GitHub Repository

1. Go to https://github.com and sign in
2. Click **"New repository"** (green button)
3. Repository name: `MedHealth` (or your preferred name)
4. Description: `Modern healthcare platform for doctor appointments and health services`
5. Visibility: Choose **Public** or **Private**
6. **DO NOT** check "Initialize with README" (we already have files)
7. Click **"Create repository"**

### 1.3 Commit and Push Code

Follow the commit strategy in `GIT_COMMIT_STRATEGY.md`. Here's a quick version:

```bash
# Add all files (excluding .env and node_modules via .gitignore)
git add .

# Create initial commit
git commit -m "feat: initial commit - MedHealth healthcare platform"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/MedHealth.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** If you prefer organized commits, follow the detailed strategy in `GIT_COMMIT_STRATEGY.md`.

---

## 🔧 Step 2: Backend Deployment (Render)

### 2.1 Prepare MongoDB Atlas

1. **Create MongoDB Atlas Cluster:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster (M0)
   - Choose a cloud provider and region
   - Wait for cluster to be created (5-10 minutes)

2. **Create Database User:**
   - Go to **Database Access** → **Add New Database User**
   - Username: `medhealth-user` (or your choice)
   - Password: Generate a strong password (save it!)
   - Database User Privileges: **Read and write to any database**
   - Click **Add User**

3. **Configure Network Access:**
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (adds `0.0.0.0/0`)
   - This allows Render to connect to your database

4. **Get Connection String:**
   - Go to **Database** → **Connect** → **Connect your application**
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/telmedsphere`
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `telmedsphere`

### 2.2 Deploy Backend to Render

1. **Create Web Service:**
   - Go to https://dashboard.render.com
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub account (if not already connected)
   - Select your repository: `MedHealth`
   - Click **"Connect"**

2. **Configure Service:**
   - **Name:** `medhealth-backend`
   - **Region:** Choose closest to your users (e.g., `Oregon (US West)`)
   - **Branch:** `main` (or `master`)
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`

3. **Add Environment Variables:**
   Scroll down to **Environment Variables** section and add:

   ```env
   # REQUIRED - MongoDB Connection
   DBURL=mongodb+srv://username:password@cluster.mongodb.net/telmedsphere
   
   # REQUIRED - JWT Secret (generate a random string)
   SECRET=your-super-secret-jwt-key-min-32-characters-long-random-string
   
   # REQUIRED - Backend Domain (update after deployment)
   DOMAIN=https://medhealth-backend.onrender.com
   
   # REQUIRED - Email Configuration
   HOST_EMAIL=your-email@gmail.com
   PASSWORD=your-gmail-app-password
   PORT=587
   
   # OPTIONAL - Stripe (for payments)
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   
   # OPTIONAL - Firebase Admin (for Google Auth)
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
   FIREBASE_UNIVERSE_DOMAIN=googleapis.com
   
   # OPTIONAL - Twilio (for WhatsApp notifications)
   TWILIO_WHATSAPP_ACCOUNT_SID=your-twilio-sid
   TWILIO_WHATSAPP_AUTH_TOKEN=your-twilio-token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   
   # OPTIONAL - Gemini AI (for chatbot)
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Deploy:**
   - Click **"Create Web Service"**
   - Render will start building and deploying
   - Wait for deployment to complete (5-10 minutes)
   - Note the service URL (e.g., `https://medhealth-backend.onrender.com`)

5. **Update DOMAIN Environment Variable:**
   - After deployment, go to **Environment** tab
   - Update `DOMAIN` to your actual Render URL
   - Save changes (will trigger redeployment)

### 2.3 Verify Backend Deployment

```bash
# Test backend health
curl https://your-backend-url.onrender.com/

# Should return: "WelCome to 💖TelMedSphere server !!!!"
```

### 2.4 Important Notes for Render

- **Free Tier Limitations:**
  - Services sleep after 15 minutes of inactivity
  - First request after sleep takes 30-60 seconds
  - 512 MB RAM limit
  - Limited CPU resources

- **ML Model Files:**
  - Ensure `models/` directory is in the repository
  - Model files should be committed (or use Git LFS for large files)
  - Render will have access to model files in the repo

---

## 🎨 Step 3: Frontend Deployment (Vercel)

### 3.1 Prepare Frontend

1. **Update httpClient.js:**
   - Already updated to use `VITE_API_URL`
   - No changes needed if environment variable is set

2. **Verify vercel.json:**
   - Should be in `frontend/vercel.json`
   - Already configured for SPA routing

### 3.2 Deploy Frontend to Vercel

1. **Create Vercel Project:**
   - Go to https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**
   - Import your GitHub repository: `MedHealth`
   - Click **"Import"**

2. **Configure Project:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend` (click "Edit" and set to `frontend`)
   - **Build Command:** `npm run build` (should auto-detect)
   - **Output Directory:** `dist` (should auto-detect)
   - **Install Command:** `npm install` (should auto-detect)

3. **Add Environment Variables:**
   Click **"Environment Variables"** and add:

   ```env
   # REQUIRED - Backend API URL
   VITE_API_URL=https://your-backend-url.onrender.com
   
   # OPTIONAL - Google Maps API Key
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   
   # OPTIONAL - Firebase Configuration
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   
   # OPTIONAL - Gemini API (for chatbot)
   VITE_API_KEY=your-gemini-api-key
   
   # OPTIONAL - External ML Model URL (leave empty to use backend)
   VITE_MODEL_URL=
   ```

   **Important:** 
   - Set these for **Production**, **Preview**, and **Development** environments
   - Replace `your-backend-url.onrender.com` with your actual Render backend URL

4. **Deploy:**
   - Click **"Deploy"**
   - Wait for deployment to complete (2-5 minutes)
   - Vercel will provide a URL (e.g., `https://medhealth.vercel.app`)

### 3.3 Verify Frontend Deployment

1. Visit your Vercel URL
2. Check browser console for errors
3. Test login/register functionality
4. Verify API calls are working

---

## 🔐 Step 4: Environment Variables Setup

### 4.1 Backend Environment Variables (Render)

**Required Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `DBURL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/telmedsphere` |
| `SECRET` | JWT secret key | Random 32+ character string |
| `DOMAIN` | Backend URL | `https://medhealth-backend.onrender.com` |
| `HOST_EMAIL` | Gmail address | `your-email@gmail.com` |
| `PASSWORD` | Gmail app password | `your-app-password` |
| `PORT` | SMTP port | `587` |

**Optional Variables:**

- `STRIPE_SECRET_KEY` - For payment processing
- `FIREBASE_*` - For Google authentication
- `TWILIO_*` - For WhatsApp notifications
- `GEMINI_API_KEY` - For AI chatbot

### 4.2 Frontend Environment Variables (Vercel)

**Required Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://medhealth-backend.onrender.com` |

**Optional Variables:**

- `VITE_GOOGLE_MAPS_API_KEY` - For map view
- `VITE_FIREBASE_*` - For Google authentication
- `VITE_API_KEY` - For AI chatbot
- `VITE_MODEL_URL` - External ML model URL (leave empty)

### 4.3 How to Get API Keys

**Google Maps API Key:**
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable **Maps JavaScript API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key
6. (Optional) Restrict API key to your Vercel domain

**Firebase Configuration:**
1. Go to https://console.firebase.google.com
2. Create a new project or select existing
3. Go to **Project Settings** → **General**
4. Scroll down to **Your apps** → **Web app** (</> icon)
5. Copy all configuration values
6. For backend, go to **Project Settings** → **Service Accounts**
7. Generate new private key and copy all values

**Stripe API Key:**
1. Go to https://dashboard.stripe.com
2. Go to **Developers** → **API keys**
3. Copy **Secret key** (starts with `sk_test_` for test mode)

**Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Copy the key

---

## ✅ Step 5: Testing & Verification

### 5.1 Backend Tests

```bash
# Test health endpoint
curl https://your-backend-url.onrender.com/

# Test doctors endpoint (after login)
curl https://your-backend-url.onrender.com/get_status
```

### 5.2 Frontend Tests

Visit your Vercel URL and test:

- [ ] **Landing Page** - Loads correctly
- [ ] **Login/Register** - Forms work
- [ ] **User Registration** - Can create account
- [ ] **User Login** - Can login
- [ ] **Google Login** - Works (if Firebase configured)
- [ ] **Doctor Search** - Shows doctors
- [ ] **Doctor List** - Displays correctly
- [ ] **Map View** - Works (if API key configured)
- [ ] **Appointment Booking** - Can book appointments
- [ ] **Disease Prediction** - Works correctly
- [ ] **Medicine Shopping** - Can browse and add to cart
- [ ] **Cart** - Shows items correctly
- [ ] **Payment** - Works (if Stripe configured)
- [ ] **Email Notifications** - Receive emails (if configured)

### 5.3 Common Issues & Solutions

**Issue: Backend returns 503**
- **Solution:** Render free tier services sleep. First request takes 30-60 seconds.

**Issue: CORS errors**
- **Solution:** Verify `VITE_API_URL` is correct. Check backend CORS configuration.

**Issue: MongoDB connection failed**
- **Solution:** 
  - Check IP whitelist in MongoDB Atlas (should include `0.0.0.0/0`)
  - Verify connection string format
  - Check database user credentials

**Issue: Environment variables not working**
- **Solution:**
  - Frontend vars must start with `VITE_`
  - Redeploy after adding env vars
  - Check deployment logs

**Issue: Disease prediction not working**
- **Solution:**
  - Verify model files are in repository
  - Check backend logs for errors
  - Ensure ML dependencies are in requirements.txt

---

## 🎯 Quick Start Commands

### Local Development

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py

# Frontend
cd frontend
npm install
npm run dev
```

### Deployment

```bash
# 1. Commit and push to GitHub
git add .
git commit -m "feat: ready for deployment"
git push origin main

# 2. Render will auto-deploy backend
# 3. Vercel will auto-deploy frontend
```

---

## 📝 Post-Deployment Checklist

- [ ] Backend is accessible
- [ ] Frontend is accessible
- [ ] API calls work
- [ ] Database connections work
- [ ] User registration works
- [ ] User login works
- [ ] Doctor search works
- [ ] Appointment booking works
- [ ] Disease prediction works
- [ ] Medicine shopping works
- [ ] Payment works (if configured)
- [ ] Email notifications work (if configured)
- [ ] No console errors
- [ ] All features functional

---

## 🎉 Deployment Complete!

Your MedHealth application should now be:
- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Render
- ✅ Database on MongoDB Atlas
- ✅ All environment variables configured
- ✅ All features working

**Next Steps:**
1. Test all functionality
2. Set up custom domains (optional)
3. Configure monitoring
4. Set up CI/CD (already enabled)

---

**Happy Deploying! 🚀**


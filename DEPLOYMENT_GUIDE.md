# 🚀 MedHealth Deployment Guide

Complete guide for deploying MedHealth to production (Frontend on Vercel, Backend on Render).

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Repository Setup](#github-repository-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Environment Variables Setup](#environment-variables-setup)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)

---

## 📦 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ Render account (free tier works)
- ✅ MongoDB Atlas account (free tier works)
- ✅ Domain (optional, but recommended)
- ✅ All API keys and credentials ready

---

## 🗂️ GitHub Repository Setup

### Step 1: Initialize Git Repository

```bash
# Navigate to project root
cd D:\VeersaHackathon\TelMedSphere

# Initialize git repository
git init

# Create initial commit structure
```

### Step 2: Create .gitignore

Ensure your `.gitignore` includes:

```
# Environment variables
.env
.env.local
.env.production

# Dependencies
node_modules/
venv/
__pycache__/

# Build files
dist/
build/
*.pyc

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Model files (optional - if too large)
models/ExtraTrees
models/*.pkl
```

### Step 3: Commit Strategy

We'll commit in logical checkpoints:

#### Checkpoint 1: Project Structure
```bash
git add .gitignore
git add README.md
git add LICENSE
git commit -m "chore: initial project setup with gitignore and documentation"
```

#### Checkpoint 2: Backend Core
```bash
git add backend/app.py
git add backend/requirements.txt
git add backend/wsgi.py
git add backend/.env.example
git commit -m "feat: add Flask backend with core functionality"
```

#### Checkpoint 3: Backend Utilities
```bash
git add backend/utils/
git add backend/templates/
git add backend/static/
git commit -m "feat: add backend utilities and templates"
```

#### Checkpoint 4: Frontend Core
```bash
git add frontend/package.json
git add frontend/vite.config.js
git add frontend/tailwind.config.js
git add frontend/index.html
git commit -m "feat: add React frontend with Vite and TailwindCSS"
```

#### Checkpoint 5: Frontend Source
```bash
git add frontend/src/
git add frontend/public/
git add frontend/.env.example
git commit -m "feat: add React components and pages"
```

#### Checkpoint 6: ML Models
```bash
git add models/
git commit -m "feat: add ML models for disease prediction"
```

#### Checkpoint 7: Deployment Config
```bash
git add backend/vercel.json
git add frontend/vercel.json
git add DEPLOYMENT_GUIDE.md
git commit -m "docs: add deployment configuration and guide"
```

#### Checkpoint 8: Documentation
```bash
git add *.md
git commit -m "docs: add project documentation"
```

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend for Render

1. **Update requirements.txt** (already done)
2. **Create render.yaml** (optional but recommended)

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository and branch

### Step 3: Configure Render Service

**Basic Settings:**
- **Name:** `medhealth-backend` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main` (or `master`)
- **Root Directory:** `backend`
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`

**Environment Variables:**
Add all variables from `backend/.env.example` in Render dashboard.

**Advanced Settings:**
- **Auto-Deploy:** `Yes` (deploys on every push)
- **Health Check Path:** `/` (or `/api/health` if you create one)

### Step 4: Get Backend URL

After deployment, Render will provide a URL like:
```
https://medhealth-backend.onrender.com
```

**Important:** Render free tier services sleep after 15 minutes of inactivity. The first request after sleep may take 30-60 seconds.

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Ensure `frontend/vercel.json` exists
2. Update `frontend/src/httpClient.js` with production URL

### Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Select the repository

### Step 3: Configure Vercel Project

**Framework Preset:** `Vite`
**Root Directory:** `frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### Step 4: Add Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

- `VITE_API_URL` = Your Render backend URL
- `VITE_GOOGLE_MAPS_API_KEY` = Your Google Maps API key
- `VITE_FIREBASE_API_KEY` = Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` = Your Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` = Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` = Your Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` = Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` = Your Firebase app ID
- `VITE_FIREBASE_MEASUREMENT_ID` = Your Firebase measurement ID (optional)
- `VITE_API_KEY` = Your Gemini API key (optional, for chatbot)
- `VITE_MODEL_URL` = Leave empty (uses backend /predict endpoint)

### Step 5: Deploy

Click **"Deploy"** and wait for deployment to complete.

---

## 🔐 Environment Variables Setup

### Backend Environment Variables (Render)

Copy these to Render Dashboard → Your Service → Environment:

```env
# REQUIRED
DBURL=mongodb+srv://username:password@cluster.mongodb.net/telmedsphere
SECRET=your-secret-key-here-min-32-characters
DOMAIN=https://your-backend-url.onrender.com

# EMAIL (Required for email features)
HOST_EMAIL=your-email@gmail.com
PASSWORD=your-app-specific-password
PORT=587

# OPTIONAL
STRIPE_SECRET_KEY=sk_test_your_stripe_key
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
TWILIO_WHATSAPP_ACCOUNT_SID=your-twilio-sid
TWILIO_WHATSAPP_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
GEMINI_API_KEY=your-gemini-key
```

### Frontend Environment Variables (Vercel)

Copy these to Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
# REQUIRED
VITE_API_URL=https://your-backend-url.onrender.com

# OPTIONAL
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_API_KEY=your-gemini-api-key
VITE_MODEL_URL=
```

---

## ✅ Post-Deployment Verification

### 1. Backend Health Check

```bash
curl https://your-backend-url.onrender.com/
```

Should return: `"WelCome to 💖TelMedSphere server !!!!"`

### 2. Frontend Check

Visit your Vercel URL and verify:
- ✅ Page loads without errors
- ✅ API calls work (check browser console)
- ✅ Login/Register functionality
- ✅ Doctor search works
- ✅ Disease prediction works

### 3. Test All Features

- [ ] User Registration
- [ ] User Login
- [ ] Google Login (if Firebase configured)
- [ ] Doctor Search
- [ ] Doctor List Display
- [ ] Map View (if API key configured)
- [ ] Appointment Booking
- [ ] Disease Prediction
- [ ] Medicine Shopping
- [ ] Cart Functionality
- [ ] Payment (if Stripe configured)
- [ ] Email Notifications (if configured)

---

## 🐛 Troubleshooting

### Backend Issues

**Issue: Backend returns 503 or timeouts**
- **Solution:** Render free tier services sleep after inactivity. First request may take 30-60 seconds.

**Issue: MongoDB connection failed**
- **Solution:** 
  - Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Render)
  - Verify DBURL format
  - Check MongoDB Atlas cluster is running

**Issue: Module not found errors**
- **Solution:** 
  - Verify all packages in `requirements.txt`
  - Check Python version (Render uses Python 3.11 by default)
  - Check build logs in Render dashboard

**Issue: Disease prediction not working**
- **Solution:**
  - Verify model files are in `models/` directory
  - Check model file paths in `backend/app.py`
  - Ensure numpy, pandas, scikit-learn are in requirements.txt

### Frontend Issues

**Issue: API calls fail with CORS error**
- **Solution:**
  - Verify `VITE_API_URL` is correct in Vercel
  - Check backend CORS configuration
  - Ensure backend allows your Vercel domain

**Issue: Environment variables not working**
- **Solution:**
  - All frontend env vars must start with `VITE_`
  - Redeploy after adding env vars
  - Check Vercel deployment logs

**Issue: Build fails**
- **Solution:**
  - Check Node.js version (Vercel uses Node 18 by default)
  - Verify all dependencies in `package.json`
  - Check build logs in Vercel dashboard

### Common Issues

**Issue: Google Maps not loading**
- **Solution:**
  - Verify `VITE_GOOGLE_MAPS_API_KEY` is set
  - Check Google Maps API billing is enabled
  - Verify API key restrictions allow your domain

**Issue: Firebase authentication not working**
- **Solution:**
  - Verify all Firebase env vars are set
  - Check Firebase console for correct credentials
  - Ensure authorized domains include your Vercel URL

---

## 📝 Additional Notes

### Render Free Tier Limitations

- Services sleep after 15 minutes of inactivity
- 512 MB RAM limit
- Limited CPU resources
- First request after sleep takes 30-60 seconds

### Vercel Free Tier

- Unlimited deployments
- 100 GB bandwidth per month
- Automatic HTTPS
- Global CDN

### MongoDB Atlas Free Tier

- 512 MB storage
- Shared cluster
- Limited connections

### Recommendations

1. **Use MongoDB Atlas** for database (free tier is sufficient for development)
2. **Monitor Render logs** for errors
3. **Set up health checks** for backend
4. **Use environment variables** for all sensitive data
5. **Enable HTTPS** (automatic on Vercel and Render)
6. **Set up custom domains** (optional but recommended)

---

## 🎉 Deployment Complete!

After following this guide, your application should be:
- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Render
- ✅ Database on MongoDB Atlas
- ✅ All environment variables configured
- ✅ All features working

**Next Steps:**
1. Test all functionality
2. Set up custom domains (optional)
3. Configure monitoring and alerts
4. Set up CI/CD (already enabled with auto-deploy)

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review deployment logs
3. Verify environment variables
4. Check API documentation

---

**Happy Deploying! 🚀**


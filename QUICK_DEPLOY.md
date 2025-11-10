# ⚡ Quick Deployment Guide

Fast deployment guide for MedHealth - Frontend (Vercel) + Backend (Render).

## 🚀 Quick Steps

### 1. GitHub Setup (5 minutes)

```bash
# Initialize and push to GitHub
git init
git add .
git commit -m "feat: initial commit - MedHealth platform"
git remote add origin https://github.com/YOUR_USERNAME/MedHealth.git
git branch -M main
git push -u origin main
```

### 2. MongoDB Atlas (5 minutes)

1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Create database user
3. Whitelist IP: `0.0.0.0/0`
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/telmedsphere`

### 3. Backend on Render (10 minutes)

1. Go to https://dashboard.render.com
2. New → Web Service → Connect GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn app:app --bind 0.0.0.0:$PORT`
4. Add env vars (see below)
5. Deploy

### 4. Frontend on Vercel (5 minutes)

1. Go to https://vercel.com
2. New Project → Import GitHub repo
3. Settings:
   - Root Directory: `frontend`
   - Framework: `Vite`
4. Add env vars (see below)
5. Deploy

## 🔐 Environment Variables

### Backend (Render)

```env
DBURL=mongodb+srv://user:pass@cluster.mongodb.net/telmedsphere
SECRET=your-random-secret-key-32-chars-min
DOMAIN=https://your-backend.onrender.com
HOST_EMAIL=your-email@gmail.com
PASSWORD=your-gmail-app-password
PORT=587
```

### Frontend (Vercel)

```env
VITE_API_URL=https://your-backend.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your-maps-key
VITE_FIREBASE_API_KEY=your-firebase-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## ✅ Verify

1. Backend: `https://your-backend.onrender.com/` → Should return welcome message
2. Frontend: Visit Vercel URL → Should load application
3. Test: Login, search doctors, book appointments

## 🎉 Done!

Your app is now live! 🚀


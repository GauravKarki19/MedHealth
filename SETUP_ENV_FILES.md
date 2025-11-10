# 🔐 Environment Variables Setup Guide

Complete guide for setting up environment variables for MedHealth deployment.

## 📋 Overview

MedHealth requires environment variables for:
- **Backend (Render):** Database, JWT, Email, APIs
- **Frontend (Vercel):** Backend URL, Maps API, Firebase

---

## 🔧 Backend Environment Variables (Render)

### Required Variables

#### 1. Database Connection (`DBURL`)
```env
DBURL=mongodb+srv://username:password@cluster.mongodb.net/telmedsphere
```
**How to get:**
- Go to MongoDB Atlas → Database → Connect
- Choose "Connect your application"
- Copy connection string
- Replace `<password>` with your database user password
- Replace `<dbname>` with `telmedsphere`

#### 2. JWT Secret (`SECRET`)
```env
SECRET=your-super-secret-random-string-minimum-32-characters-long
```
**How to generate:**
```bash
# Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Using OpenSSL
openssl rand -hex 32

# Or use any random string generator (minimum 32 characters)
```

#### 3. Backend Domain (`DOMAIN`)
```env
DOMAIN=https://medhealth-backend.onrender.com
```
**Note:** Update this after Render deployment with your actual backend URL.

#### 4. Email Configuration

**Gmail Setup:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate app password for "Mail"
5. Copy the 16-character password

```env
HOST_EMAIL=your-email@gmail.com
PASSWORD=your-16-character-app-password
PORT=587
```

### Optional Variables

#### Stripe (for payments)
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```
Get from: https://dashboard.stripe.com/apikeys

#### Firebase Admin (for Google Authentication)
```env
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40project.iam.gserviceaccount.com
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
```
Get from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key

#### Twilio (for WhatsApp notifications)
```env
TWILIO_WHATSAPP_ACCOUNT_SID=your-account-sid
TWILIO_WHATSAPP_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```
Get from: https://www.twilio.com/console

#### Gemini AI (for chatbot)
```env
GEMINI_API_KEY=your-gemini-api-key
```
Get from: https://makersuite.google.com/app/apikey

---

## 🎨 Frontend Environment Variables (Vercel)

### Required Variables

#### 1. Backend API URL (`VITE_API_URL`)
```env
VITE_API_URL=https://medhealth-backend.onrender.com
```
**Note:** Replace with your actual Render backend URL.

### Optional Variables

#### Google Maps API Key (`VITE_GOOGLE_MAPS_API_KEY`)
```env
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```
**How to get:**
1. Go to https://console.cloud.google.com
2. Create project or select existing
3. Enable "Maps JavaScript API"
4. Go to Credentials → Create Credentials → API Key
5. Copy API key
6. (Optional) Restrict to your Vercel domain

#### Firebase Configuration (for Google Authentication)
```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```
**How to get:**
1. Go to https://console.firebase.google.com
2. Create project or select existing
3. Go to Project Settings → General
4. Scroll to "Your apps" → Web app (</> icon)
5. Copy all configuration values

#### Gemini AI (for chatbot)
```env
VITE_API_KEY=your-gemini-api-key
```
Get from: https://makersuite.google.com/app/apikey

#### External ML Model URL (optional)
```env
VITE_MODEL_URL=
```
Leave empty to use backend `/predict` endpoint.

---

## 📝 Setting Environment Variables

### Render (Backend)

1. Go to Render Dashboard → Your Service
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add each variable:
   - **Key:** Variable name (e.g., `DBURL`)
   - **Value:** Variable value (e.g., `mongodb+srv://...`)
5. Click **"Save Changes"**
6. Service will automatically redeploy

### Vercel (Frontend)

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Environment Variables"**
3. Click **"Add New"**
4. Add each variable:
   - **Key:** Variable name (e.g., `VITE_API_URL`)
   - **Value:** Variable value (e.g., `https://...`)
   - **Environment:** Select Production, Preview, Development (or all)
5. Click **"Save"**
6. Redeploy your project (or it will auto-deploy on next push)

---

## ✅ Verification

### Backend
```bash
# Test if environment variables are loaded
curl https://your-backend.onrender.com/

# Check Render logs for any errors
```

### Frontend
```javascript
// In browser console, check if variables are loaded
console.log(import.meta.env.VITE_API_URL);
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong secrets** - Generate random strings for JWT
3. **Restrict API keys** - Limit to specific domains/IPs
4. **Rotate secrets regularly** - Change passwords periodically
5. **Use environment-specific values** - Different values for dev/prod
6. **Monitor usage** - Check API usage regularly

---

## 🐛 Troubleshooting

### Issue: Environment variable not working

**Backend:**
- Check variable name is correct (case-sensitive)
- Verify value doesn't have extra spaces
- Check Render logs for errors
- Redeploy after adding variables

**Frontend:**
- Variable must start with `VITE_`
- Redeploy after adding variables
- Check Vercel deployment logs
- Clear browser cache

### Issue: API calls failing

- Verify `VITE_API_URL` is correct
- Check backend is accessible
- Verify CORS is configured
- Check browser console for errors

---

## 📋 Quick Reference

### Backend (Render) - Required
```env
DBURL=mongodb+srv://...
SECRET=your-secret-key
DOMAIN=https://your-backend.onrender.com
HOST_EMAIL=your-email@gmail.com
PASSWORD=your-app-password
PORT=587
```

### Frontend (Vercel) - Required
```env
VITE_API_URL=https://your-backend.onrender.com
```

### Frontend (Vercel) - Optional
```env
VITE_GOOGLE_MAPS_API_KEY=...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_API_KEY=...
```

---

**Ready to deploy! 🚀**


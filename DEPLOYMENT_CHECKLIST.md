# ✅ Deployment Checklist

Use this checklist to ensure successful deployment of MedHealth.

## 📦 Pre-Deployment

### Code Preparation
- [ ] All code is tested locally
- [ ] No console errors
- [ ] All dependencies are in requirements.txt and package.json
- [ ] .env files are in .gitignore
- [ ] .env.example files are created
- [ ] Documentation is updated

### GitHub Repository
- [ ] Repository is created on GitHub
- [ ] Code is committed and pushed
- [ ] .gitignore is properly configured
- [ ] No sensitive files are committed

### MongoDB Atlas
- [ ] Cluster is created
- [ ] Database user is created
- [ ] IP whitelist includes 0.0.0.0/0
- [ ] Connection string is ready

### API Keys & Credentials
- [ ] MongoDB connection string
- [ ] JWT secret key (generated)
- [ ] Gmail app password
- [ ] Google Maps API key (optional)
- [ ] Firebase credentials (optional)
- [ ] Stripe API key (optional)
- [ ] Twilio credentials (optional)
- [ ] Gemini API key (optional)

---

## 🔧 Backend Deployment (Render)

### Service Configuration
- [ ] Service is created on Render
- [ ] GitHub repository is connected
- [ ] Root directory is set to `backend`
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `gunicorn app:app --bind 0.0.0.0:$PORT`
- [ ] Python version is set (3.11 recommended)

### Environment Variables
- [ ] `DBURL` - MongoDB connection string
- [ ] `SECRET` - JWT secret key
- [ ] `DOMAIN` - Backend URL (update after deployment)
- [ ] `HOST_EMAIL` - Gmail address
- [ ] `PASSWORD` - Gmail app password
- [ ] `PORT` - SMTP port (587)
- [ ] `STRIPE_SECRET_KEY` - (optional)
- [ ] `FIREBASE_*` - (optional)
- [ ] `TWILIO_*` - (optional)
- [ ] `GEMINI_API_KEY` - (optional)

### Deployment
- [ ] Service is deployed successfully
- [ ] Backend URL is noted
- [ ] Health check passes
- [ ] Logs show no errors
- [ ] `DOMAIN` env var is updated with actual URL

### Verification
- [ ] Backend is accessible
- [ ] `/` endpoint returns welcome message
- [ ] `/get_status` endpoint works (after setup)
- [ ] Database connection is working
- [ ] No errors in Render logs

---

## 🎨 Frontend Deployment (Vercel)

### Project Configuration
- [ ] Project is created on Vercel
- [ ] GitHub repository is connected
- [ ] Root directory is set to `frontend`
- [ ] Framework preset: `Vite`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Environment Variables
- [ ] `VITE_API_URL` - Backend URL (Render URL)
- [ ] `VITE_GOOGLE_MAPS_API_KEY` - (optional)
- [ ] `VITE_FIREBASE_API_KEY` - (optional)
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` - (optional)
- [ ] `VITE_FIREBASE_PROJECT_ID` - (optional)
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` - (optional)
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` - (optional)
- [ ] `VITE_FIREBASE_APP_ID` - (optional)
- [ ] `VITE_API_KEY` - (optional)

### Deployment
- [ ] Project is deployed successfully
- [ ] Frontend URL is noted
- [ ] Build completes without errors
- [ ] No errors in Vercel logs

### Verification
- [ ] Frontend is accessible
- [ ] Page loads without errors
- [ ] No console errors
- [ ] API calls are working
- [ ] Environment variables are loaded

---

## 🧪 Feature Testing

### Authentication
- [ ] User registration works
- [ ] User login works
- [ ] Google login works (if configured)
- [ ] Password reset works (if configured)
- [ ] Logout works

### Doctor Features
- [ ] Doctor search works
- [ ] Doctor list displays correctly
- [ ] Doctor details show correctly
- [ ] Map view works (if API key configured)
- [ ] Appointment booking works
- [ ] Appointment cancellation works

### Health Features
- [ ] Disease prediction works
- [ ] Symptoms selection works
- [ ] Results display correctly
- [ ] Health blogs load correctly

### Shopping Features
- [ ] Medicine browsing works
- [ ] Add to cart works
- [ ] Cart displays correctly
- [ ] Checkout works
- [ ] Payment works (if Stripe configured)
- [ ] Orders display correctly

### Other Features
- [ ] Profile page works
- [ ] Wallet works (if configured)
- [ ] Chatbot works (if API key configured)
- [ ] Email notifications work (if configured)
- [ ] Dark mode works
- [ ] Responsive design works

---

## 🔍 Post-Deployment

### Monitoring
- [ ] Render logs are monitored
- [ ] Vercel logs are monitored
- [ ] Error tracking is set up (optional)
- [ ] Performance is acceptable

### Documentation
- [ ] Deployment guide is updated
- [ ] API documentation is updated
- [ ] README is updated
- [ ] Environment variables are documented

### Security
- [ ] All API keys are secure
- [ ] CORS is properly configured
- [ ] HTTPS is enabled (automatic on Vercel/Render)
- [ ] Sensitive data is not exposed

---

## 🎯 Success Criteria

- [ ] Backend is accessible and responsive
- [ ] Frontend is accessible and loads correctly
- [ ] All core features are working
- [ ] No critical errors in logs
- [ ] Performance is acceptable
- [ ] User can register and login
- [ ] User can search and book doctors
- [ ] User can use disease prediction
- [ ] User can shop for medicines

---

## 🐛 Troubleshooting

If any feature doesn't work:

1. **Check Logs:**
   - Render logs for backend errors
   - Vercel logs for frontend errors
   - Browser console for client errors

2. **Verify Environment Variables:**
   - All required variables are set
   - Variable names are correct
   - Variable values are correct

3. **Check API Endpoints:**
   - Backend is accessible
   - CORS is configured
   - Endpoints return correct data

4. **Test Locally:**
   - Test feature locally first
   - Verify it works in development
   - Then check production

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section in DEPLOYMENT_GUIDE.md
2. Review deployment logs
3. Verify environment variables
4. Test endpoints manually
5. Check MongoDB Atlas connection

---

**Ready to Deploy! 🚀**


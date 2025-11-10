# 🔗 How to Get VITE_API_URL

`VITE_API_URL` is your **backend URL** from Render after deployment.

## 📋 Step-by-Step Process

### Step 1: Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Sign in or create an account

2. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select the `MedHealth` repository
   - Click **"Connect"**

3. **Configure Service**
   - **Name:** `medhealth-backend` (or your preferred name)
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or `master`)
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`

4. **Add Environment Variables**
   - Add all required variables (see `SETUP_ENV_FILES.md`)
   - **Important:** Set `DOMAIN` to your Render URL after deployment

5. **Deploy**
   - Click **"Create Web Service"**
   - Wait for deployment to complete (5-10 minutes)
   - Render will show deployment status

### Step 2: Get Your Backend URL

After deployment is complete:

1. **Find Your Service URL**
   - Go to your service dashboard
   - Look for the URL at the top (e.g., `https://medhealth-backend.onrender.com`)
   - Or check the service details page

2. **Example URLs:**
   ```
   https://medhealth-backend.onrender.com
   https://your-service-name.onrender.com
   ```

3. **Test the URL**
   - Open the URL in your browser
   - Should see: `"WelCome to 💖TelMedSphere server !!!!"`
   - This confirms your backend is working

### Step 3: Use the URL in Frontend

1. **For Local Development (.env file)**
   ```env
   VITE_API_URL=https://medhealth-backend.onrender.com
   ```

2. **For Production (Vercel)**
   - Go to Vercel Dashboard
   - Select your project
   - Go to **Settings** → **Environment Variables**
   - Add: `VITE_API_URL` = `https://medhealth-backend.onrender.com`
   - Select environments: **Production**, **Preview**, **Development**
   - Click **Save**
   - Redeploy your frontend

### Step 4: Update Backend DOMAIN Variable

After getting your Render URL:

1. **Go to Render Dashboard**
   - Select your backend service
   - Go to **Environment** tab
   - Find `DOMAIN` variable
   - Update it to: `https://medhealth-backend.onrender.com`
   - Click **Save Changes**
   - Service will automatically redeploy

## 🔍 How to Find Your Render URL

### Method 1: From Service Dashboard
1. Go to https://dashboard.render.com
2. Click on your service name
3. The URL is displayed at the top of the page

### Method 2: From Service Settings
1. Go to your service
2. Click **Settings** tab
3. Look for **"Service URL"** or **"Custom Domain"**
4. Copy the URL

### Method 3: From Deployments
1. Go to your service
2. Click **"Logs"** or **"Deployments"** tab
3. Look for deployment logs
4. The URL is usually shown in the logs

## 📝 Example Configuration

### Backend (Render)
```env
DOMAIN=https://medhealth-backend.onrender.com
DBURL=mongodb+srv://...
SECRET=your-secret-key
# ... other variables
```

### Frontend (Vercel)
```env
VITE_API_URL=https://medhealth-backend.onrender.com
```

### Frontend (Local Development)
Create `frontend/.env`:
```env
VITE_API_URL=https://medhealth-backend.onrender.com
```

## ✅ Verification

### Test Backend URL
```bash
# Test in browser
https://medhealth-backend.onrender.com/

# Should return:
"WelCome to 💖TelMedSphere server !!!!"
```

### Test Frontend Connection
1. Open browser console
2. Check for API calls
3. Verify requests go to your Render URL
4. Check for CORS errors (should be none)

## ⚠️ Important Notes

1. **Render Free Tier**
   - Services sleep after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds
   - This is normal for free tier

2. **HTTPS**
   - Render provides HTTPS automatically
   - Use `https://` not `http://`

3. **Custom Domain**
   - You can add a custom domain later
   - Update `VITE_API_URL` if you change the domain

4. **Environment Variables**
   - Set `VITE_API_URL` in Vercel for production
   - Set in `.env` file for local development
   - Never commit `.env` files to git

## 🐛 Troubleshooting

### Issue: Backend URL not working
- **Check:** Is the service deployed?
- **Check:** Are there any errors in Render logs?
- **Check:** Is the service sleeping? (free tier)

### Issue: CORS errors
- **Check:** Is `VITE_API_URL` correct?
- **Check:** Backend CORS is configured to allow all origins
- **Check:** Backend is accessible

### Issue: API calls failing
- **Check:** `VITE_API_URL` is set correctly
- **Check:** Backend is running
- **Check:** Network tab in browser console

## 🎯 Quick Reference

1. **Deploy backend to Render** → Get URL
2. **Use URL as `VITE_API_URL`** in frontend
3. **Update `DOMAIN`** in backend environment variables
4. **Set `VITE_API_URL`** in Vercel for production
5. **Test connection** → Verify it works

---

## 📞 Need Help?

If you're having trouble:
1. Check Render deployment logs
2. Verify backend is accessible
3. Check environment variables are set
4. Test backend URL in browser
5. Check browser console for errors

---

**Your VITE_API_URL will be: `https://your-service-name.onrender.com`**

After deploying your backend to Render, you'll get this URL automatically! 🚀


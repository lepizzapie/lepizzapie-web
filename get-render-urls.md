# 🍕 Le Pizza Pie - Render Deployment Guide

## **Step 1: Get Your Render URLs**

1. **Go to [render.com](https://render.com) and log in**
2. **Find your services:**
   - **Backend Service** (Web Service) - Your Node.js/Express server
   - **Frontend Service** (Static Site) - Your React app

3. **Copy the URLs:**
   - Backend URL: `https://your-backend-name.onrender.com`
   - Frontend URL: `https://your-frontend-name.onrender.com`

## **Step 2: Set Backend Environment Variables**

**Go to your Backend service → Environment tab:**

```
MONGODB_URI=mongodb://localhost:27017/lepizzapie-db
JWT_SECRET=lepizzapie-admin-secret-key-2025
GOOGLE_SERVICE_ACCOUNT_KEY=lepizzapieweb-0bbb5492aa73.json
GOOGLE_CALENDAR_ID=your_calendar_id_here
```

**For MongoDB:**
- Use MongoDB Atlas (cloud) or local MongoDB
- Format: `mongodb+srv://username:password@cluster.mongodb.net/lepizzapie-db`

**For Google Calendar:**
- `GOOGLE_CALENDAR_ID`: Your calendar ID (from Google Calendar settings)
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Upload your JSON file to Render as a secret file

## **Step 3: Set Frontend Environment Variables**

**Go to your Frontend service → Environment tab:**

```
REACT_APP_API_URL=https://your-backend-name.onrender.com
```

## **Step 4: Test Your Live Website**

1. **Visit your frontend URL**
2. **Go to "Book Event" page**
3. **Test the booking form**
4. **Check if events appear in your Google Calendar**

## **Troubleshooting:**

- **Backend not deploying:** Check environment variables
- **Frontend can't connect:** Verify `REACT_APP_API_URL` is correct
- **Google Calendar not working:** Check service account setup

## **Need Help?**

- Check Render logs for deployment errors
- Verify all environment variables are set
- Test API endpoints directly 
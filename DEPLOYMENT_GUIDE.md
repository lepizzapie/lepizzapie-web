# Le Pizza Pie - Deployment Guide

## 🚀 Environment Variables

Create a `.env` file in your project root with these variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://lepizzapie:ql50Tiqr9bZYDfDC@lepizzapie-db.pajhwi5.mongodb.net/?retryWrites=true&w=majority&appName=lepizzapie-db

# JWT Secret for Admin Authentication
JWT_SECRET=lepizzapie-admin-secret-key-2025

# Google Calendar API (Optional - for calendar sync)
REACT_APP_GOOGLE_API_KEY=
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_GOOGLE_CALENDAR_ID=

# App Configuration
REACT_APP_NAME=Le Pizza Pie
REACT_APP_VERSION=1.0.0
```

## 📋 Deployment Checklist

### ✅ Completed:
- [x] MongoDB Atlas cluster created: `lepizzapie-db`
- [x] Connection string obtained
- [x] React app built and tested

### 🔄 Next Steps:
- [ ] Push code to GitHub
- [ ] Deploy to Railway/Vercel
- [ ] Add environment variables to hosting platform
- [ ] Test live website

## 🌐 Deployment Options

### Option 1: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Import your repository
4. Add environment variables
5. Deploy automatically

### Option 2: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Import your repository
4. Add environment variables
5. Deploy automatically

## 🔐 Admin Access

**Default Admin Credentials:**
- **Username**: admin
- **Password**: lepizzapie2025

**Admin URL**: `your-domain.com/admin`

## 📞 Support

If you need help with deployment, the environment variables are ready to go! 
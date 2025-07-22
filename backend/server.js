require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes with individual error handling
console.log('Loading routes...');

// Load instagram routes
try {
  app.use('/api', require('./routes/instagram'));
  console.log('Instagram routes loaded');
} catch (error) {
  console.error('Error loading instagram routes:', error);
}

// Load admin routes
try {
  app.use('/api/admin', require('./routes/admin'));
  console.log('Admin routes loaded');
} catch (error) {
  console.error('Error loading admin routes:', error);
}

// Load events routes
try {
  app.use('/api/events', require('./routes/events'));
  console.log('Events routes loaded');
} catch (error) {
  console.error('Error loading events routes:', error);
}

// Health check endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Test Google Calendar environment variables
app.get('/test-calendar-env', (req, res) => {
  const hasServiceAccountKey = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const hasCalendarId = !!process.env.GOOGLE_CALENDAR_ID;
  const serviceAccountKeyLength = process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? process.env.GOOGLE_SERVICE_ACCOUNT_KEY.length : 0;
  
  res.json({
    hasServiceAccountKey,
    hasCalendarId,
    serviceAccountKeyLength,
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'not set'
  });
});

// Test Google Calendar service status
app.get('/test-calendar-service', async (req, res) => {
  try {
    const calendarService = require('./googleCalendarService');
    const isInitialized = calendarService.isInitialized();
    
    res.json({
      isInitialized,
      hasGoogleApis: !!require('googleapis'),
      hasServiceAccountKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      hasCalendarId: !!process.env.GOOGLE_CALENDAR_ID
    });
  } catch (error) {
    res.json({
      error: error.message,
      isInitialized: false,
      hasGoogleApis: false,
      hasServiceAccountKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      hasCalendarId: !!process.env.GOOGLE_CALENDAR_ID
    });
  }
});

// Catch-all for API routes
app.get('*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
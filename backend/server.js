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
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Le Pizza Pie Backend is running' });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Catch-all for API routes
app.get('*', (req, res) => {
  console.log(`404 - Route not found: ${req.path}`);
  res.status(404).json({ error: 'API endpoint not found', path: req.path });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 
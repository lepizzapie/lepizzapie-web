const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();

// MongoDB connection settings
let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lepizzapie-db';

// Ensure Atlas connection string has proper parameters
if (uri.includes('mongodb.net')) {
  const url = new URL(uri);
  url.searchParams.set('retryWrites', 'true');
  url.searchParams.set('w', 'majority');
  url.searchParams.set('maxPoolSize', '10');
  url.searchParams.set('minPoolSize', '1');
  url.searchParams.set('maxIdleTimeMS', '30000');
  url.searchParams.set('connectTimeoutMS', '30000');
  url.searchParams.set('socketTimeoutMS', '45000');
  url.searchParams.set('serverSelectionTimeoutMS', '30000');
  url.searchParams.set('heartbeatFrequencyMS', '10000');
  url.searchParams.set('retryReads', 'true');
  uri = url.toString();
}

const dbName = 'lepizzapie-db';
const collectionName = 'adminUsers';

// MongoDB connection options - simplified since parameters are in URI
const mongoOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
};

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is required');
  process.exit(1);
}

// Helper: get admin user
async function getAdminUser() {
  let client;
  try {
    console.log('🔗 Attempting MongoDB connection for admin user...');
    client = new MongoClient(uri, mongoOptions);
    
    // Add connection timeout
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    console.log('✅ MongoDB connected for admin user');
    
    const db = client.db(dbName);
    const user = await db.collection(collectionName).findOne({ username: 'admin' });
    console.log('✅ Admin user query completed');
    return user;
  } catch (error) {
    console.error('❌ MongoDB connection error for admin user:', error.message);
    throw new Error('Database connection failed');
  } finally {
    if (client) {
      try {
        await client.close();
        console.log('🔌 MongoDB connection closed for admin user');
      } catch (closeError) {
        console.warn('⚠️ Error closing MongoDB connection:', closeError.message);
      }
    }
  }
}

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('🔐 Admin login attempt for username:', username);
    
    // Try MongoDB first (with timeout)
    try {
      const userPromise = getAdminUser();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB timeout')), 5000)
      );
      
      const user = await Promise.race([userPromise, timeoutPromise]);
      if (user) {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (isMatch) {
          const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
          console.log('✅ MongoDB login successful for:', username);
          return res.json({ token });
        }
      }
    } catch (mongoError) {
      console.log('⚠️ MongoDB login failed, using fallback:', mongoError.message);
    }
    
    // Fallback: Check against hardcoded admin credentials
    if (username === 'admin' && password === 'pizza123') {
      const token = jwt.sign({ id: 'admin-fallback', username: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
      console.log('✅ Fallback login successful for:', username);
      res.json({ token });
    } else {
      console.log('❌ Login failed for:', username);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST /api/admin/change-password
router.post('/change-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  try {
    const user = await getAdminUser();
    if (!user) return res.status(401).json({ error: 'Admin user not found' });
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Old password incorrect' });
    const newHash = await bcrypt.hash(newPassword, 10);
    
    let client;
    try {
      client = new MongoClient(uri, mongoOptions);
      await client.connect();
      await client.db(dbName).collection(collectionName).updateOne(
        { _id: user._id },
        { $set: { passwordHash: newHash } }
      );
    } finally {
      if (client) {
        await client.close();
      }
    }
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router; 
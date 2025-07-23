const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();

// MongoDB connection settings
let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lepizzapie-db';

// MongoDB URI is used as-is

const dbName = 'lepizzapie-db';
const collectionName = 'adminUsers';

// MongoDB connection options - minimal for Atlas compatibility
const mongoOptions = {
  retryWrites: true,
  w: 'majority'
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
    client = new MongoClient(uri, mongoOptions);
    await client.connect();
    const db = client.db(dbName);
    const user = await db.collection(collectionName).findOne({ username: 'admin' });
    return user;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Database connection failed');
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Try MongoDB first
    try {
      const user = await getAdminUser();
      if (user) {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (isMatch) {
          const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
          return res.json({ token });
        }
      }
    } catch (mongoError) {
      console.log('⚠️ MongoDB login failed, trying fallback:', mongoError.message);
    }
    
    // Fallback: Check against hardcoded admin credentials
    if (username === 'admin' && password === 'pizza123') {
      const token = jwt.sign({ id: 'admin-fallback', username: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
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
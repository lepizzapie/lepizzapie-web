const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lepizzapie-db';
const dbName = 'lepizzapie-db';
const collectionName = 'adminUsers';

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'lepizzapie-admin-secret-key-2025';

// Helper: get admin user
async function getAdminUser() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const user = await db.collection(collectionName).findOne({ username: 'admin' });
    await client.close();
    return user;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Database connection failed');
  }
}

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getAdminUser();
    if (!user) return res.status(401).json({ error: 'Admin user not found' });
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
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
    
    const client = new MongoClient(uri);
    await client.connect();
    await client.db(dbName).collection(collectionName).updateOne(
      { _id: user._id },
      { $set: { passwordHash: newHash } }
    );
    await client.close();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router; 
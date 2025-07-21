require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
const dbName = 'lepizzapie-db';
const collectionName = 'adminUsers';

async function createAdminUser() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const existing = await db.collection(collectionName).findOne({ username: 'admin' });
    if (existing) {
      console.log('Admin user already exists.');
      return;
    }
    const password = 'pizza123'; // Default password, can be changed later
    const passwordHash = await bcrypt.hash(password, 10);
    await db.collection(collectionName).insertOne({ username: 'admin', passwordHash });
    console.log('Admin user created with username: admin and password: pizza123');
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    await client.close();
  }
}

createAdminUser(); 
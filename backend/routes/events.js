const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection settings
let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lepizzapie-db';

// Add TLS parameters to MongoDB URI if it's an Atlas connection
if (uri.includes('mongodb.net') && !uri.includes('tls=true')) {
  uri += '?tls=true&tlsAllowInvalidCertificates=true&tlsAllowInvalidHostnames=true';
}

const dbName = 'lepizzapie-db';
const collectionName = 'events';

// MongoDB connection options to handle SSL/TLS issues
const mongoOptions = {
  retryWrites: true,
  w: 'majority',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  maxPoolSize: 5,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 15000,
  heartbeatFrequencyMS: 10000,
  retryReads: true
};

// GET /api/events/availability
router.get('/availability', async (req, res) => {
  try {
    const calendarService = require('../googleCalendarService');
    const now = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(now.getMonth() + 6);
    const timeMin = now.toISOString();
    const timeMax = sixMonthsLater.toISOString();
    const events = await calendarService.listEvents(timeMin, timeMax);
    // Build a set of booked/unavailable dates
    const unavailableSet = new Set();
    events.forEach(event => {
      if (event.status !== 'cancelled') {
        const summary = (event.summary || '').trim().toLowerCase();
        // Block if summary is 'unavailable' or if it's a real booking (not 'unavailable')
        if (summary === 'unavailable' || summary.startsWith('pizza event')) {
          const startDate = event.start.date || event.start.dateTime;
          const endDate = event.end.date || event.end.dateTime;
          let current = new Date(startDate);
          let end = new Date(endDate);
          if (event.start.date && event.end.date) {
            end.setDate(end.getDate() - 1);
          }
          while (current <= end) {
            unavailableSet.add(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
          }
        }
      }
    });
    // Build the response for each day in the next 6 months
    const availableDates = [];
    let currentDate = new Date(now);
    while (currentDate <= sixMonthsLater) {
      const dateString = currentDate.toISOString().split('T')[0];
      availableDates.push({
        date: dateString,
        available: !unavailableSet.has(dateString)
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    res.json(availableDates);
  } catch (error) {
    console.error('Failed to fetch availability from Google Calendar:', error);
    // Fallback: return all dates as available if Google Calendar fails
    console.log('⚠️  Falling back to all dates available due to Google Calendar error');
    const now = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(now.getMonth() + 6);
    const availableDates = [];
    let currentDate = new Date(now);
    while (currentDate <= sixMonthsLater) {
      const dateString = currentDate.toISOString().split('T')[0];
      availableDates.push({
        date: dateString,
        available: true
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    res.json(availableDates);
  }
});

// GET /api/events/debug-mongo - Debug MongoDB connection
router.get('/debug-mongo', async (req, res) => {
  let client;
  try {
    console.log('🔍 DEBUG: Testing MongoDB connection...');
    console.log('🔍 DEBUG: URI:', uri.substring(0, 50) + '...');
    console.log('🔍 DEBUG: Options:', JSON.stringify(mongoOptions, null, 2));
    
    client = new MongoClient(uri, mongoOptions);
    
    console.log('🔍 DEBUG: Created MongoClient');
    
    // Add connection timeout and retry logic
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 15000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    console.log('🔍 DEBUG: MongoDB connected successfully');
    
    const db = client.db(dbName);
    console.log('🔍 DEBUG: Got database:', dbName);
    
    // Test the connection with a ping
    await db.admin().ping();
    console.log('🔍 DEBUG: MongoDB ping successful');
    
    // Try to insert a test document
    const testDoc = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Test document for debugging'
    };
    
    const result = await db.collection(collectionName).insertOne(testDoc);
    console.log('🔍 DEBUG: Test document inserted:', result.insertedId);
    
    // Try to find the test document
    const found = await db.collection(collectionName).findOne({ _id: result.insertedId });
    console.log('🔍 DEBUG: Test document found:', found ? 'YES' : 'NO');
    
    // Clean up test document
    await db.collection(collectionName).deleteOne({ _id: result.insertedId });
    console.log('🔍 DEBUG: Test document cleaned up');
    
    res.json({
      success: true,
      message: 'MongoDB connection test successful',
      testInserted: result.insertedId,
      testFound: !!found,
      testCleaned: true
    });
    
  } catch (err) {
    console.error('🔍 DEBUG: MongoDB test failed:', err);
    console.error('🔍 DEBUG: Error details:', {
      name: err.name,
      code: err.code,
      message: err.message,
      stack: err.stack
    });
    
    res.status(500).json({
      success: false,
      error: err.message,
      details: {
        name: err.name,
        code: err.code,
        message: err.message
      }
    });
  } finally {
    if (client) {
      try {
        await client.close();
        console.log('🔍 DEBUG: MongoDB connection closed');
      } catch (closeError) {
        console.warn('🔍 DEBUG: Error closing MongoDB connection:', closeError.message);
      }
    }
  }
});

// GET /api/events
router.get('/', async (req, res) => {
  let client;
  try {
    console.log('🔗 Attempting MongoDB connection for GET events...');
    client = new MongoClient(uri, mongoOptions);
    
    // Add connection timeout and retry logic
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 10000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    console.log('✅ MongoDB connected successfully for GET events');
    
    const db = client.db(dbName);
    console.log('📊 Using database:', dbName);
    
    // Test the connection with a ping
    await db.admin().ping();
    console.log('🏓 MongoDB ping successful for GET events');
    
    const events = await db.collection(collectionName).find({}).toArray();
    console.log(`✅ Found ${events.length} events in MongoDB`);
    res.json(events);
  } catch (err) {
    console.error('❌ Error fetching events from MongoDB:', err);
    console.error('MongoDB error details:', {
      name: err.name,
      code: err.code,
      message: err.message
    });
    console.log('⚠️  Falling back to Google Calendar events due to MongoDB error');
    
    // Fallback: try to get events from Google Calendar
    try {
      const calendarService = require('../googleCalendarService');
      const now = new Date();
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(now.getMonth() + 6);
      
      const calendarEvents = await calendarService.listEvents(now.toISOString(), sixMonthsLater.toISOString());
      
      // Convert Google Calendar events to our format
      const events = calendarEvents.map(event => ({
        _id: event.id,
        title: event.summary || 'Pizza Event',
        date: event.start.dateTime ? event.start.dateTime.split('T')[0] : event.start.date,
        time: event.start.dateTime ? event.start.dateTime.split('T')[1].substring(0, 5) : '18:00',
        eventType: 'Pizza Event',
        guestCount: 10,
        eventLocation: event.location || 'Mobile Pizza Service',
        contactName: 'Customer',
        contactEmail: event.attendees ? event.attendees[0]?.email : 'No email',
        specialRequests: event.description || 'No special requests',
        status: 'confirmed',
        createdAt: event.created || new Date().toISOString(),
        fromGoogleCalendar: true
      }));
      
      console.log(`✅ Found ${events.length} events from Google Calendar fallback`);
      res.json(events);
    } catch (calendarError) {
      console.error('❌ Failed to fetch events from Google Calendar:', calendarError);
      res.status(500).json({ error: 'Failed to fetch events from both MongoDB and Google Calendar' });
    }
  } finally {
    if (client) {
      try {
        await client.close();
        console.log('🔌 MongoDB connection closed for GET events');
      } catch (closeError) {
        console.warn('⚠️ Error closing MongoDB connection:', closeError.message);
      }
    }
  }
});

// POST /api/events
router.post('/', async (req, res) => {
  let client;
  try {
    const eventData = req.body;
    console.log('Received event data:', eventData);
    
    const eventDoc = {
      title: eventData.title || `Pizza Event - ${eventData.name || 'Event'}`,
      date: eventData.date,
      time: eventData.time,
      eventType: eventData.eventType,
      guestCount: eventData.guestCount,
      eventLocation: eventData.eventLocation,
      contactName: eventData.contactName || eventData.name,
      contactPhone: eventData.contactPhone,
      contactEmail: eventData.contactEmail || eventData.email,
      specialRequests: eventData.specialRequests,
      pizzaVarieties: eventData.pizzaVarieties,
      additionalOptions: eventData.additionalOptions,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    // Try to save to MongoDB with improved error handling
    let mongoResult = null;
    try {
      console.log('🔗 Attempting MongoDB connection...');
      client = new MongoClient(uri, mongoOptions);
      
      // Add connection timeout and retry logic
      const connectPromise = client.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      console.log('✅ MongoDB connected successfully');
      
      const db = client.db(dbName);
      console.log('📊 Using database:', dbName);
      
      // Test the connection with a ping
      await db.admin().ping();
      console.log('🏓 MongoDB ping successful');
      
      mongoResult = await db.collection(collectionName).insertOne(eventDoc);
      console.log('✅ Event saved to MongoDB:', mongoResult.insertedId);
      
    } catch (mongoError) {
      console.error('❌ MongoDB save failed:', mongoError.message);
      console.error('MongoDB error details:', {
        name: mongoError.name,
        code: mongoError.code,
        message: mongoError.message
      });
      
      // Try to get more specific error information
      if (mongoError.name === 'MongoServerSelectionError') {
        console.error('🔍 Server selection error - connection issues');
      } else if (mongoError.name === 'MongoNetworkError') {
        console.error('🌐 Network error - connectivity issues');
      } else if (mongoError.name === 'MongoTimeoutError') {
        console.error('⏰ Timeout error - slow connection');
      }
    }
    
    // Try to create Google Calendar event
    let calendarEvent = null;
    try {
      const calendarService = require('../googleCalendarService');
      const googleEvent = {
        summary: eventDoc.title,
        description: `Contact: ${eventDoc.contactEmail || 'No email provided'}\nGuests: ${eventDoc.guestCount || 'Not specified'}\nSpecial Requests: ${eventDoc.specialRequests || 'None'}`,
        start: {
          dateTime: new Date(`${eventDoc.date}T${eventDoc.time || '18:00'}:00`).toISOString(),
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: new Date(new Date(`${eventDoc.date}T${eventDoc.time || '18:00'}:00`).getTime() + 3 * 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Los_Angeles',
        },
        location: eventDoc.eventLocation || 'Mobile Pizza Service',
      };
      calendarEvent = await calendarService.createEvent(googleEvent);
      console.log('✅ Event created in Google Calendar:', calendarEvent.id);
    } catch (calendarError) {
      console.warn('⚠️ Failed to create Google Calendar event:', calendarError.message);
      // Continue without calendar sync
    }
    
    res.json({
      message: 'Event received successfully!',
      event: { ...eventDoc, _id: mongoResult ? mongoResult.insertedId : 'google-calendar-only' },
      calendarEvent: calendarEvent ? { id: calendarEvent.id, synced: true } : { synced: false },
      mongoSaved: !!mongoResult
    });
  } catch (err) {
    console.error('❌ Error creating event:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    if (client) {
      try {
        await client.close();
        console.log('🔌 MongoDB connection closed');
      } catch (closeError) {
        console.warn('⚠️ Error closing MongoDB connection:', closeError.message);
      }
    }
  }
});

// POST /api/events/unavailable - Mark a date as unavailable (create 'UNAVAILABLE' event)
router.post('/unavailable', async (req, res) => {
  try {
    const { date } = req.body; // date in 'YYYY-MM-DD' format
    if (!date) return res.status(400).json({ error: 'Date is required' });
    const calendarService = require('../googleCalendarService');
    // Create an all-day event titled 'UNAVAILABLE'
    const event = {
      summary: 'UNAVAILABLE',
      start: { date },
      end: { date: getNextDay(date) }, // Google Calendar all-day events are exclusive of end date
    };
    const created = await calendarService.createEvent(event);
    res.json({ success: true, eventId: created.id });
  } catch (error) {
    console.error('Failed to create UNAVAILABLE event:', error);
    res.status(500).json({ error: 'Failed to mark date as unavailable' });
  }
});

// DELETE /api/events/unavailable - Remove 'UNAVAILABLE' event for a date (case-insensitive match)
router.delete('/unavailable', async (req, res) => {
  try {
    const { date } = req.body; // date in 'YYYY-MM-DD' format
    if (!date) return res.status(400).json({ error: 'Date is required' });
    const calendarService = require('../googleCalendarService');
    // Find 'UNAVAILABLE' event for this date (case-insensitive)
    const events = await calendarService.listEvents(date, getNextDay(date));
    const unavailableEvent = events.find(e =>
      e.summary && typeof e.summary === 'string' &&
      e.start.date === date &&
      e.summary.trim().toLowerCase() === 'unavailable'
    );
    if (!unavailableEvent) return res.status(404).json({ error: 'No UNAVAILABLE event found for this date' });
    await calendarService.deleteEvent(unavailableEvent.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete UNAVAILABLE event:', error);
    res.status(500).json({ error: 'Failed to mark date as available' });
  }
});

// POST /api/events/confirm - Confirm an event and sync to Google Calendar
router.post('/confirm', async (req, res) => {
  let client;
  try {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ error: 'Event ID is required' });
    
    // Update event status in database
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    
    const event = await db.collection(collectionName).findOne({ _id: new ObjectId(eventId) });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    // Update status to confirmed
    await db.collection(collectionName).updateOne(
      { _id: new ObjectId(eventId) },
      { $set: { status: 'confirmed' } }
    );
    
    // Sync to Google Calendar
    let calendarEvent = null;
    try {
      const calendarService = require('../googleCalendarService');
      const googleEvent = {
        summary: event.title,
        description: `Contact: ${event.contactEmail || 'No email provided'}\nGuests: ${event.guestCount || 'Not specified'}\nSpecial Requests: ${event.specialRequests || 'None'}`,
        start: {
          dateTime: new Date(`${event.date}T${event.time || '18:00'}:00`).toISOString(),
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: new Date(new Date(`${event.date}T${event.time || '18:00'}:00`).getTime() + 3 * 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Los_Angeles',
        },
        location: event.eventLocation || 'Mobile Pizza Service',
        attendees: [
          { email: event.contactEmail, displayName: event.contactName }
        ],
      };
      calendarEvent = await calendarService.createEvent(googleEvent);
      console.log('Event confirmed and synced to Google Calendar:', calendarEvent.id);
    } catch (calendarError) {
      console.warn('Failed to sync confirmed event to Google Calendar:', calendarError.message);
    }
    
    res.json({
      success: true,
      message: 'Event confirmed',
      calendarEvent: calendarEvent ? { id: calendarEvent.id, synced: true } : { synced: false }
    });
  } catch (err) {
    console.error('Error confirming event:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    if (client) await client.close();
  }
});

// POST /api/events/sync-all - Sync all confirmed events to Google Calendar
router.post('/sync-all', async (req, res) => {
  let client;
  try {
    client = new MongoClient(uri, mongoOptions);
    await client.connect();
    const db = client.db(dbName);
    
    // Get all confirmed events
    const confirmedEvents = await db.collection(collectionName)
      .find({ status: 'confirmed' })
      .toArray();
    
    const calendarService = require('../googleCalendarService');
    let success = 0;
    let failed = 0;
    
    for (const event of confirmedEvents) {
      try {
        const googleEvent = {
          summary: event.title,
          description: `Contact: ${event.contactEmail || 'No email provided'}\nGuests: ${event.guestCount || 'Not specified'}\nSpecial Requests: ${event.specialRequests || 'None'}`,
          start: {
            dateTime: new Date(`${event.date}T${event.time || '18:00'}:00`).toISOString(),
            timeZone: 'America/Los_Angeles',
          },
          end: {
            dateTime: new Date(new Date(`${event.date}T${event.time || '18:00'}:00`).getTime() + 3 * 60 * 60 * 1000).toISOString(),
            timeZone: 'America/Los_Angeles',
          },
          location: event.eventLocation || 'Mobile Pizza Service',
          attendees: [
            { email: event.contactEmail, displayName: event.contactName }
          ],
        };
        await calendarService.createEvent(googleEvent);
        success++;
      } catch (error) {
        console.error(`Failed to sync event ${event._id}:`, error);
        failed++;
      }
    }
    
    res.json({
      success: true,
      message: `Synced ${success} events successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      synced: success,
      failed: failed
    });
  } catch (err) {
    console.error('Error syncing events:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    if (client) await client.close();
  }
});

// Helper to get next day in 'YYYY-MM-DD' format
function getNextDay(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}

module.exports = router; 
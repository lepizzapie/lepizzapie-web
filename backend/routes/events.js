const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const calendarService = require('../googleCalendarService');
require('dotenv').config();

const router = express.Router();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lepizzapie-db';
const client = new MongoClient(uri);
const dbName = 'lepizzapie-db';
const collectionName = 'events';

// Helper: get events collection
async function getEventsCollection() {
  try {
    await client.connect();
    return client.db(dbName).collection(collectionName);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Database connection failed');
  }
}

// POST /api/events/confirm
// Confirm an event and sync to Google Calendar
router.post('/confirm', async (req, res) => {
  const { eventId } = req.body;
  try {
    const eventsCol = await getEventsCollection();
    const event = await eventsCol.findOne({ _id: new ObjectId(eventId) });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Update event status to confirmed
    await eventsCol.updateOne(
      { _id: new ObjectId(eventId) },
      { $set: { status: 'confirmed' } }
    );

    // Prepare Google Calendar event
    const googleEvent = {
      summary: event.title,
      description: event.specialRequests || '',
      start: {
        dateTime: new Date(`${event.date}T${event.time}`).toISOString(),
        timeZone: 'America/Los_Angeles', // Change as needed
      },
      end: {
        dateTime: new Date(new Date(`${event.date}T${event.time}`).getTime() + 3 * 60 * 60 * 1000).toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      location: event.eventLocation,
      attendees: [
        { email: event.contactEmail, displayName: event.contactName }
      ],
    };

    // Sync to Google Calendar
    const calendarResult = await calendarService.createEvent(googleEvent);
    res.json({ message: 'Event confirmed and synced to Google Calendar', calendarEvent: calendarResult });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST /api/events/sync-all
// Manually sync all confirmed events to Google Calendar
router.post('/sync-all', async (req, res) => {
  try {
    const eventsCol = await getEventsCollection();
    const confirmedEvents = await eventsCol.find({ status: 'confirmed' }).toArray();
    let success = 0;
    let failed = 0;
    for (const event of confirmedEvents) {
      const googleEvent = {
        summary: event.title,
        description: event.specialRequests || '',
        start: {
          dateTime: new Date(`${event.date}T${event.time}`).toISOString(),
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: new Date(new Date(`${event.date}T${event.time}`).getTime() + 3 * 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Los_Angeles',
        },
        location: event.eventLocation,
        attendees: [
          { email: event.contactEmail, displayName: event.contactName }
        ],
      };
      try {
        await calendarService.createEvent(googleEvent);
        success++;
      } catch (e) {
        failed++;
      }
    }
    res.json({ message: 'Sync complete', success, failed });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST /api/events - create a new event
router.post('/', async (req, res) => {
  try {
    console.log('Received event creation request:', req.body);
    const eventsCol = await getEventsCollection();
    const newEvent = req.body;
    // Optionally set default status if not provided
    if (!newEvent.status) newEvent.status = 'pending';
    console.log('Attempting to insert event:', newEvent);
    const result = await eventsCol.insertOne(newEvent);
    console.log('Event created successfully with ID:', result.insertedId);
    res.status(201).json({ ...newEvent, _id: result.insertedId });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET /api/events - fetch all events
router.get('/', async (req, res) => {
  try {
    const eventsCol = await getEventsCollection();
    const events = await eventsCol.find({}).toArray();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET /api/events/availability - get available dates for booking
router.get('/availability', async (req, res) => {
  try {
    const eventsCol = await getEventsCollection();
    
    // Get booked dates from confirmed events
    const bookedEvents = await eventsCol.find({ status: 'confirmed' }).toArray();
    const bookedDates = bookedEvents.map(event => event.eventDate);
    
    // Generate available dates for next 6 months
    const availableDates = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const isBooked = bookedDates.includes(dateString);
      
      availableDates.push({
        date: dateString,
        available: !isBooked,
        reason: isBooked ? 'Already booked' : undefined
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.json(availableDates);
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router; 
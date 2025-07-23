const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection settings
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lepizzapie-db';
const dbName = 'lepizzapie-db';
const collectionName = 'events';

// GET /api/events/availability
router.get('/availability', async (req, res) => {
  try {
    // Clear module cache to force fresh load
    delete require.cache[require.resolve('../googleCalendarService')];
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
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// GET /api/events
router.get('/', async (req, res) => {
  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const events = await db.collection(collectionName).find({}).toArray();
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  } finally {
    if (client) await client.close();
  }
});

// POST /api/events
router.post('/', async (req, res) => {
  let client;
  try {
    const eventData = req.body;
    console.log('Received event data:', eventData);
    // Save to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
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
    const insertResult = await db.collection(collectionName).insertOne(eventDoc);
    // Try to create Google Calendar event
    let calendarEvent = null;
    try {
      // Clear module cache to force fresh load
      delete require.cache[require.resolve('../googleCalendarService')];
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
        attendees: [
          { email: eventDoc.contactEmail, displayName: eventDoc.contactName }
        ],
      };
      calendarEvent = await calendarService.createEvent(googleEvent);
      console.log('Event created in Google Calendar:', calendarEvent.id);
    } catch (calendarError) {
      console.warn('Failed to create Google Calendar event:', calendarError.message);
      // Continue without calendar sync
    }
    res.json({
      message: 'Event received successfully!',
      event: { ...eventDoc, _id: insertResult.insertedId },
      calendarEvent: calendarEvent ? { id: calendarEvent.id, synced: true } : { synced: false }
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    if (client) await client.close();
  }
});

// POST /api/events/unavailable - Mark a date as unavailable (create 'UNAVAILABLE' event)
router.post('/unavailable', async (req, res) => {
  try {
    const { date } = req.body; // date in 'YYYY-MM-DD' format
    if (!date) return res.status(400).json({ error: 'Date is required' });
    // Clear module cache to force fresh load
    delete require.cache[require.resolve('../googleCalendarService')];
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
    // Clear module cache to force fresh load
    delete require.cache[require.resolve('../googleCalendarService')];
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
      // Clear module cache to force fresh load
      delete require.cache[require.resolve('../googleCalendarService')];
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
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    
    // Get all confirmed events
    const confirmedEvents = await db.collection(collectionName)
      .find({ status: 'confirmed' })
      .toArray();
    
    // Clear module cache to force fresh load
    delete require.cache[require.resolve('../googleCalendarService')];
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
const express = require('express');
const calendarService = require('../googleCalendarService');
const router = express.Router();

// GET /api/events/availability
router.get('/availability', (req, res) => {
  res.json([
    { date: '2025-01-22', available: true },
    { date: '2025-01-23', available: true },
    { date: '2025-01-24', available: true }
  ]);
});

// GET /api/events
router.get('/', (req, res) => {
  res.json({ message: 'Events API is working!' });
});

// POST /api/events
router.post('/', async (req, res) => {
  try {
    const eventData = req.body;
    console.log('Received event data:', eventData);
    
    // Try to create Google Calendar event
    let calendarEvent = null;
    try {
      const googleEvent = {
        summary: `Pizza Event - ${eventData.name || 'Event'}`,
        description: `Contact: ${eventData.email || 'No email provided'}\nGuests: ${eventData.guests || 'Not specified'}\nSpecial Requests: ${eventData.specialRequests || 'None'}`,
        start: {
          dateTime: new Date(`${eventData.date}T${eventData.time || '18:00'}:00`).toISOString(),
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: new Date(new Date(`${eventData.date}T${eventData.time || '18:00'}:00`).getTime() + 3 * 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Los_Angeles',
        },
        location: eventData.eventLocation || 'Mobile Pizza Service',
        attendees: [
          { email: eventData.email, displayName: eventData.name }
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
      event: eventData,
      id: 'event-id-' + Date.now(),
      calendarEvent: calendarEvent ? { id: calendarEvent.id, synced: true } : { synced: false }
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router; 
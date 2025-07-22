const express = require('express');
const router = express.Router();

// GET /api/events/availability
router.get('/availability', async (req, res) => {
  try {
    const calendarService = require('../googleCalendarService');
    const now = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(now.getMonth() + 6);
    // Format as RFC3339 for Google Calendar API
    const timeMin = now.toISOString();
    const timeMax = sixMonthsLater.toISOString();
    const events = await calendarService.listEvents(timeMin, timeMax);
    // Build a set of booked/unavailable dates
    const unavailableSet = new Set();
    events.forEach(event => {
      if (event.status !== 'cancelled') {
        // All-day or timed event
        const startDate = event.start.date || event.start.dateTime;
        const endDate = event.end.date || event.end.dateTime;
        let current = new Date(startDate);
        let end = new Date(endDate);
        // If end is exclusive (all-day), subtract one day
        if (event.start.date && event.end.date) {
          end.setDate(end.getDate() - 1);
        }
        while (current <= end) {
          unavailableSet.add(current.toISOString().split('T')[0]);
          current.setDate(current.getDate() + 1);
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
      // Dynamically import calendar service to avoid loading issues
      const calendarService = require('../googleCalendarService');
      
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

// Helper to get next day in 'YYYY-MM-DD' format
function getNextDay(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}

module.exports = router; 
// Google Calendar Service Account Integration (Node.js backend)
const { google } = require('googleapis');

let calendar = null;
let isInitialized = false;
let calendarId = process.env.GOOGLE_CALENDAR_ID;
let jwtClient = null;

function initializeCalendarService() {
  try {
    const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!key) {
      console.error('GOOGLE_SERVICE_ACCOUNT_KEY env var not set');
      isInitialized = false;
      return false;
    }
    const keyObj = typeof key === 'string' ? JSON.parse(key) : key;
    jwtClient = new google.auth.JWT(
      keyObj.client_email,
      null,
      keyObj.private_key,
      ['https://www.googleapis.com/auth/calendar']
    );
    calendar = google.calendar({ version: 'v3', auth: jwtClient });
    isInitialized = true;
    console.log('✅ Google Calendar service initialized');
    return true;
  } catch (err) {
    console.error('Failed to initialize Google Calendar service:', err);
    isInitialized = false;
    return false;
  }
}

// Initialize on module load
initializeCalendarService();

async function createEvent(event) {
  if (!isInitialized) initializeCalendarService();
  if (!isInitialized) throw new Error('Google Calendar not initialized');
  try {
    const response = await calendar.events.insert({
      calendarId,
      resource: event,
      sendUpdates: 'all',
    });
    return response.data;
  } catch (err) {
    console.error('Error creating Google Calendar event:', err);
    throw err;
  }
}

async function updateEvent(eventId, event) {
  if (!isInitialized) initializeCalendarService();
  if (!isInitialized) throw new Error('Google Calendar not initialized');
  try {
    const response = await calendar.events.update({
      calendarId,
      eventId,
      resource: event,
      sendUpdates: 'all',
    });
    return response.data;
  } catch (err) {
    console.error('Error updating Google Calendar event:', err);
    throw err;
  }
}

async function deleteEvent(eventId) {
  if (!isInitialized) initializeCalendarService();
  if (!isInitialized) throw new Error('Google Calendar not initialized');
  try {
    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: 'all',
    });
    return true;
  } catch (err) {
    console.error('Error deleting Google Calendar event:', err);
    throw err;
  }
}

async function listEvents(timeMin, timeMax) {
  if (!isInitialized) initializeCalendarService();
  if (!isInitialized) throw new Error('Google Calendar not initialized');
  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items;
  } catch (err) {
    console.error('Error listing Google Calendar events:', err);
    throw err;
  }
}

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  listEvents,
  isInitialized: () => isInitialized,
}; 
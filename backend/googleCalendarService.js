// Google Calendar Service Account Integration (Node.js backend)
const { google } = require('googleapis');

let calendar = null;
let isInitialized = false;
let calendarId = process.env.GOOGLE_CALENDAR_ID;
let jwtClient = null;

function initializeCalendarService() {
  try {
    const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const calendarIdEnv = process.env.GOOGLE_CALENDAR_ID;
    
    if (!key) {
      console.error('GOOGLE_SERVICE_ACCOUNT_KEY env var not set');
      isInitialized = false;
      return false;
    }
    
    if (!calendarIdEnv) {
      console.error('GOOGLE_CALENDAR_ID env var not set');
      isInitialized = false;
      return false;
    }
    
    console.log('Initializing Google Calendar service...');
    console.log('Calendar ID:', calendarIdEnv);
    console.log('Key type:', typeof key);
    console.log('Key length:', key.length);
    
    // Parse the service account key
    let keyObj;
    try {
      keyObj = typeof key === 'string' ? JSON.parse(key) : key;
      console.log('✅ Service account key parsed successfully');
      console.log('Service account email:', keyObj.client_email);
      console.log('Has private key:', !!keyObj.private_key);
    } catch (parseError) {
      console.error('❌ Failed to parse service account key:', parseError.message);
      isInitialized = false;
      return false;
    }
    
    // Use JWT authentication directly
    try {
      console.log('Creating JWT client...');
      jwtClient = new google.auth.JWT(
        keyObj.client_email,
        null,
        keyObj.private_key,
        ['https://www.googleapis.com/auth/calendar']
      );
      console.log('✅ JWT client created successfully');
    } catch (jwtError) {
      console.error('❌ Failed to create JWT client:', jwtError.message);
      isInitialized = false;
      return false;
    }
    
    try {
      console.log('Creating calendar client...');
      calendar = google.calendar({ version: 'v3', auth: jwtClient });
      calendarId = calendarIdEnv;
      isInitialized = true;
      console.log('✅ Google Calendar service initialized successfully');
      return true;
    } catch (calendarError) {
      console.error('❌ Failed to create calendar client:', calendarError.message);
      isInitialized = false;
      return false;
    }
  } catch (err) {
    console.error('Failed to initialize Google Calendar service:', err.message);
    console.error('Error details:', err);
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
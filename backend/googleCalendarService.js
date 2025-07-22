// Google Calendar Service Account Integration (Node.js backend)
let auth, calendar;
let isInitialized = false;
let google;

// Wrap the entire module in a try-catch to catch any file system errors
try {
  // Try to load Google APIs, but don't fail if not available
  try {
    const { google: googleApi } = require('googleapis');
    google = googleApi;
    console.log('✅ Google APIs loaded successfully');
  } catch (error) {
    console.warn('❌ Google APIs not available. Calendar sync will be disabled.');
    google = null;
  }

  require('dotenv').config();

  // Get environment variables
  const SERVICE_ACCOUNT_KEY_RAW = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

  console.log('🔍 Google Calendar Service Debug Info:');
  console.log('  - SERVICE_ACCOUNT_KEY exists:', !!SERVICE_ACCOUNT_KEY_RAW);
  console.log('  - CALENDAR_ID exists:', !!CALENDAR_ID);
  console.log('  - SERVICE_ACCOUNT_KEY length:', SERVICE_ACCOUNT_KEY_RAW ? SERVICE_ACCOUNT_KEY_RAW.length : 0);

  // Initialize Google Calendar service
  function initializeCalendarService() {
    console.log('🚀 Initializing Google Calendar service...');
    
    if (!google) {
      console.warn('❌ Google APIs not available. Calendar sync will be disabled.');
      return false;
    }

    if (!SERVICE_ACCOUNT_KEY_RAW) {
      console.warn('❌ GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set. Calendar sync will be disabled.');
      return false;
    }

    if (!CALENDAR_ID) {
      console.warn('❌ GOOGLE_CALENDAR_ID environment variable not set. Calendar sync will be disabled.');
      return false;
    }

    try {
      console.log('📝 Parsing service account key...');
      
      // Clean and parse the service account key
      let cleanedKey = SERVICE_ACCOUNT_KEY_RAW.trim();
      
      // Remove quotes if present
      if (cleanedKey.startsWith('"') && cleanedKey.endsWith('"')) {
        cleanedKey = cleanedKey.slice(1, -1);
      }
      if (cleanedKey.startsWith("'") && cleanedKey.endsWith("'")) {
        cleanedKey = cleanedKey.slice(1, -1);
      }
      
      // Replace escaped newlines
      cleanedKey = cleanedKey.replace(/\\n/g, '\n');
      
      // Parse the JSON
      const key = JSON.parse(cleanedKey);
      console.log('✅ Service account key parsed successfully');
      console.log('   - Client email:', key.client_email);
      console.log('   - Has private key:', !!key.private_key);
      
      console.log('🔐 Creating JWT auth...');
      auth = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        ['https://www.googleapis.com/auth/calendar']
      );
      console.log('✅ JWT auth created successfully');
      
      console.log('📅 Creating calendar service...');
      calendar = google.calendar({ version: 'v3', auth });
      console.log('✅ Calendar service created successfully');
      
      isInitialized = true;
      console.log('🎉 Google Calendar service initialized successfully.');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Calendar service:', error.message);
      console.error('   Error stack:', error.stack);
      console.warn('Calendar sync will be disabled.');
      isInitialized = false;
      return false;
    }
  }

  // Initialize on module load
  console.log('🔄 Calling initializeCalendarService...');
  initializeCalendarService();

  async function createEvent(event) {
    if (!isInitialized) {
      console.warn('Google Calendar service not available. Event not synced to calendar.');
      return { id: 'mock-calendar-id', summary: event.summary };
    }
    
    try {
      const response = await calendar.events.insert({
        calendarId: CALENDAR_ID,
        resource: event,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async function updateEvent(eventId, event) {
    if (!isInitialized) {
      console.warn('Google Calendar service not available. Event not updated in calendar.');
      return { id: eventId, summary: event.summary };
    }
    
    try {
      const response = await calendar.events.update({
        calendarId: CALENDAR_ID,
        eventId,
        resource: event,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async function deleteEvent(eventId) {
    if (!isInitialized) {
      console.warn('Google Calendar service not available. Event not deleted from calendar.');
      return true;
    }
    
    try {
      await calendar.events.delete({
        calendarId: CALENDAR_ID,
        eventId,
      });
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  async function listEvents(timeMin, timeMax) {
    if (!isInitialized) {
      console.warn('Google Calendar service not available. Returning empty event list.');
      return [];
    }
    
    try {
      const response = await calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return response.data.items;
    } catch (error) {
      console.error('Error listing events:', error);
      throw error;
    }
  }

  module.exports = {
    createEvent,
    updateEvent,
    deleteEvent,
    listEvents,
    isInitialized: () => isInitialized,
  };

} catch (error) {
  console.error('❌ Critical error in Google Calendar service module:', error.message);
  console.error('   Error stack:', error.stack);
  
  // Export a mock module that doesn't crash
  module.exports = {
    createEvent: async () => ({ id: 'mock-calendar-id', summary: 'Calendar sync disabled' }),
    updateEvent: async () => ({ id: 'mock-calendar-id', summary: 'Calendar sync disabled' }),
    deleteEvent: async () => true,
    listEvents: async () => [],
    isInitialized: () => false,
  };
} 
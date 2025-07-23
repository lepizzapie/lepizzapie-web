// Google Calendar Service - Real Implementation
// Last updated: 2025-07-23 01:30 UTC - Real Google Calendar API integration
// Using googleapis library for proper Google Calendar integration

const { google } = require('googleapis');

console.log('🔄 Loading Google Calendar service - Real Implementation...');

let isInitialized = false;
let calendarId = process.env.GOOGLE_CALENDAR_ID;
let calendar = null;

function initializeCalendarService() {
  console.log('🚀 Starting Google Calendar service initialization - Real Implementation...');
  
  try {
    const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const calendarIdEnv = process.env.GOOGLE_CALENDAR_ID;
    
    if (!key) {
      console.error('❌ GOOGLE_SERVICE_ACCOUNT_KEY env var not set');
      isInitialized = false;
      return false;
    }
    
    if (!calendarIdEnv) {
      console.error('❌ GOOGLE_CALENDAR_ID env var not set');
      isInitialized = false;
      return false;
    }
    
    console.log('📅 Calendar ID:', calendarIdEnv);
    console.log('🔑 Key length:', key.length);
    
    // Parse the service account key
    let keyObj;
    try {
      keyObj = typeof key === 'string' ? JSON.parse(key) : key;
      console.log('✅ Service account key parsed successfully');
      console.log('📧 Service account email:', keyObj.client_email);
      
      // Create JWT client
      const auth = new google.auth.JWT(
        keyObj.client_email,
        null,
        keyObj.private_key,
        ['https://www.googleapis.com/auth/calendar']
      );
      
      // Create calendar client
      calendar = google.calendar({ version: 'v3', auth });
      calendarId = calendarIdEnv;
      isInitialized = true;
      console.log('🎉 Google Calendar service initialized successfully - Real Implementation!');
      return true;
    } catch (parseError) {
      console.error('❌ Failed to parse service account key:', parseError.message);
      isInitialized = false;
      return false;
    }
  } catch (err) {
    console.error('❌ Failed to initialize Google Calendar service:', err.message);
    console.error('Error details:', err);
    isInitialized = false;
    return false;
  }
}

// Initialize on module load
if (!initializeCalendarService()) {
  console.error('❌ Failed to initialize Google Calendar service. Some features may not work.');
}

// Real Google Calendar API implementation
async function createEvent(event) {
  if (!isInitialized) {
    console.error('❌ Google Calendar service not initialized');
    throw new Error('Google Calendar service not initialized');
  }
  
  try {
    console.log('🎯 Creating Google Calendar event:', event.summary);
    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
    });
    
    console.log('✅ Event created successfully:', response.data.id);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating Google Calendar event:', error.message);
    throw error;
  }
}

async function updateEvent(eventId, event) {
  if (!isInitialized) {
    console.error('❌ Google Calendar service not initialized');
    throw new Error('Google Calendar service not initialized');
  }
  
  try {
    console.log('🎯 Updating Google Calendar event:', eventId);
    const response = await calendar.events.update({
      calendarId: calendarId,
      eventId: eventId,
      resource: event,
    });
    
    console.log('✅ Event updated successfully:', response.data.id);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating Google Calendar event:', error.message);
    throw error;
  }
}

async function deleteEvent(eventId) {
  if (!isInitialized) {
    console.error('❌ Google Calendar service not initialized');
    throw new Error('Google Calendar service not initialized');
  }
  
  try {
    console.log('🎯 Deleting Google Calendar event:', eventId);
    await calendar.events.delete({
      calendarId: calendarId,
      eventId: eventId,
    });
    
    console.log('✅ Event deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting Google Calendar event:', error.message);
    throw error;
  }
}

async function listEvents(timeMin, timeMax) {
  if (!isInitialized) {
    console.error('❌ Google Calendar service not initialized');
    throw new Error('Google Calendar service not initialized');
  }
  
  try {
    console.log('🎯 Listing Google Calendar events from', timeMin, 'to', timeMax);
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: timeMin,
      timeMax: timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    console.log('✅ Found', response.data.items.length, 'events');
    return response.data.items || [];
  } catch (error) {
    console.error('❌ Error listing Google Calendar events:', error.message);
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
// Google Calendar Service Account Integration (Node.js backend)
// Last updated: 2025-07-22 19:45 UTC - Force restart to clear cache
// Using mock implementation to test deployment
const https = require('https');
const crypto = require('crypto');

let isInitialized = false;
let calendarId = process.env.GOOGLE_CALENDAR_ID;
let serviceAccountKey = null;

console.log('🔄 Loading Google Calendar service...');

function initializeCalendarService() {
  console.log('🚀 Starting Google Calendar service initialization...');
  
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
      serviceAccountKey = keyObj;
      calendarId = calendarIdEnv;
      isInitialized = true;
      console.log('🎉 Google Calendar service initialized successfully!');
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
initializeCalendarService();

// Mock implementation for testing
async function createEvent(event) {
  console.log('🎯 Mock createEvent called with:', event.summary);
  return { id: 'mock-event-id', summary: event.summary };
}

async function updateEvent(eventId, event) {
  console.log('🎯 Mock updateEvent called for:', eventId);
  return { id: eventId, summary: event.summary };
}

async function deleteEvent(eventId) {
  console.log('🎯 Mock deleteEvent called for:', eventId);
  return true;
}

async function listEvents(timeMin, timeMax) {
  console.log('🎯 Mock listEvents called from', timeMin, 'to', timeMax);
  return [];
}

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  listEvents,
  isInitialized: () => isInitialized,
}; 
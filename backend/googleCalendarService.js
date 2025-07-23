// Google Calendar Service - FORCE DEPLOYMENT VERSION
// Last updated: 2025-07-23 01:00 UTC - Complete rewrite to force deployment
// This is a clean mock implementation to test deployment

console.log('🔄 Loading Google Calendar service - FORCE DEPLOYMENT VERSION...');

let isInitialized = false;
let calendarId = process.env.GOOGLE_CALENDAR_ID;

function initializeCalendarService() {
  console.log('🚀 Starting Google Calendar service initialization - FORCE DEPLOYMENT VERSION...');
  
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
      calendarId = calendarIdEnv;
      isInitialized = true;
      console.log('🎉 Google Calendar service initialized successfully - FORCE DEPLOYMENT VERSION!');
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

// Clean mock implementation for testing deployment
async function createEvent(event) {
  console.log('🎯 FORCE DEPLOYMENT VERSION - Mock createEvent called with:', event.summary);
  return { id: 'mock-event-id-' + Date.now(), summary: event.summary };
}

async function updateEvent(eventId, event) {
  console.log('🎯 FORCE DEPLOYMENT VERSION - Mock updateEvent called for:', eventId);
  return { id: eventId, summary: event.summary };
}

async function deleteEvent(eventId) {
  console.log('🎯 FORCE DEPLOYMENT VERSION - Mock deleteEvent called for:', eventId);
  return true;
}

async function listEvents(timeMin, timeMax) {
  console.log('🎯 FORCE DEPLOYMENT VERSION - Mock listEvents called from', timeMin, 'to', timeMax);
  return [];
}

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  listEvents,
  isInitialized: () => isInitialized,
}; 
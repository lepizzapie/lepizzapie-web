// Google Calendar Service Account Integration (Node.js backend)
// For now, using a mock service to avoid environment variable issues

console.log('🔍 Google Calendar Service - Using Mock Implementation');

let isInitialized = false;

// Mock Google Calendar service
function initializeCalendarService() {
  console.log('🚀 Initializing Mock Google Calendar service...');
  console.log('⚠️  Google Calendar integration is currently disabled due to environment variable issues');
  console.log('   This is a temporary solution while we troubleshoot the service account key setup');
  isInitialized = false;
  return false;
}

// Initialize on module load
console.log('🔄 Calling initializeCalendarService...');
initializeCalendarService();

async function createEvent(event) {
  console.log('📅 Mock: Would create Google Calendar event:', event.summary || 'Untitled Event');
  return { 
    id: 'mock-calendar-id-' + Date.now(), 
    summary: event.summary || 'Untitled Event',
    htmlLink: 'https://calendar.google.com (mock)',
    status: 'confirmed'
  };
}

async function updateEvent(eventId, event) {
  console.log('📅 Mock: Would update Google Calendar event:', eventId);
  return { 
    id: eventId, 
    summary: event.summary || 'Untitled Event',
    htmlLink: 'https://calendar.google.com (mock)',
    status: 'confirmed'
  };
}

async function deleteEvent(eventId) {
  console.log('📅 Mock: Would delete Google Calendar event:', eventId);
  return true;
}

async function listEvents(timeMin, timeMax) {
  console.log('📅 Mock: Would list Google Calendar events');
  return [];
}

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  listEvents,
  isInitialized: () => isInitialized,
}; 
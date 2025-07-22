// Google Calendar Service Account Integration (Node.js backend)
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || 'lepizzapieweb-0bbb5492aa73.json';
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

let auth, calendar;
let isInitialized = false;

// Initialize Google Calendar service
function initializeCalendarService() {
  try {
    const keyFilePath = path.join(__dirname, SERVICE_ACCOUNT_KEY_PATH);
    
    // Check if the service account key file exists
    if (!fs.existsSync(keyFilePath)) {
      console.warn('Google Calendar service account key file not found. Calendar sync will be disabled.');
      return false;
    }
    
    const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
    const SCOPES = ['https://www.googleapis.com/auth/calendar'];
    
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });
    
    calendar = google.calendar({ version: 'v3', auth });
    isInitialized = true;
    console.log('Google Calendar service initialized successfully.');
    return true;
  } catch (error) {
    console.warn('Failed to initialize Google Calendar service:', error.message);
    console.warn('Calendar sync will be disabled.');
    return false;
  }
}

// Initialize on module load
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
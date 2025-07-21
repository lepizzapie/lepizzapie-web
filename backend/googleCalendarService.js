// Google Calendar Service Account Integration (Node.js backend)
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || 'lepizzapieweb-0bbb5492aa73.json';
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

// Load service account credentials
const keyFilePath = path.join(__dirname, SERVICE_ACCOUNT_KEY_PATH);
const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });

async function createEvent(event) {
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
}; 
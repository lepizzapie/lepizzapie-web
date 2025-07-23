// Google Calendar Service Account Integration (Node.js backend)
// Last updated: 2025-07-22 18:30 UTC - Force redeploy
// Using direct HTTP requests to bypass googleapis library issues
const https = require('https');
const crypto = require('crypto');

let isInitialized = false;
let calendarId = process.env.GOOGLE_CALENDAR_ID;
let accessToken = null;
let serviceAccountKey = null;

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
    
    console.log('Initializing Google Calendar service with direct HTTP...');
    console.log('Calendar ID:', calendarIdEnv);
    
    // Parse the service account key
    let keyObj;
    try {
      keyObj = typeof key === 'string' ? JSON.parse(key) : key;
      console.log('✅ Service account key parsed successfully');
      console.log('Service account email:', keyObj.client_email);
      serviceAccountKey = keyObj;
      calendarId = calendarIdEnv;
      isInitialized = true;
      console.log('✅ Google Calendar service initialized successfully');
      return true;
    } catch (parseError) {
      console.error('❌ Failed to parse service account key:', parseError.message);
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

// Simple JWT signing without external library
function signJWT(payload, privateKey) {
  const header = { alg: 'RS256', typ: 'JWT' };
  
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const data = `${encodedHeader}.${encodedPayload}`;
  
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data);
  const signature = sign.sign(privateKey, 'base64url');
  
  return `${data}.${signature}`;
}

// Helper function to get access token
async function getAccessToken() {
  if (!serviceAccountKey) {
    throw new Error('Service account key not available');
  }
  
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: serviceAccountKey.client_email,
      scope: 'https://www.googleapis.com/auth/calendar',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };
    
    try {
      const token = signJWT(payload, serviceAccountKey.private_key);
      
      const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(token)}`;
      
      const options = {
        hostname: 'oauth2.googleapis.com',
        port: 443,
        path: '/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.access_token) {
              resolve(response.access_token);
            } else {
              reject(new Error('No access token in response'));
            }
          } catch (e) {
            reject(new Error('Failed to parse token response'));
          }
        });
      });
      
      req.on('error', (err) => {
        reject(err);
      });
      
      req.write(postData);
      req.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to make API requests
async function makeCalendarRequest(endpoint, method = 'GET', data = null) {
  const token = await getAccessToken();
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: `/calendar/v3${endpoint}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          resolve(response);
        } catch (e) {
          reject(new Error('Failed to parse API response'));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function createEvent(event) {
  if (!isInitialized) initializeCalendarService();
  if (!isInitialized) throw new Error('Google Calendar not initialized');
  try {
    const response = await makeCalendarRequest(`/calendars/${encodeURIComponent(calendarId)}/events`, 'POST', event);
    return response;
  } catch (err) {
    console.error('Error creating Google Calendar event:', err);
    throw err;
  }
}

async function updateEvent(eventId, event) {
  if (!isInitialized) initializeCalendarService();
  if (!isInitialized) throw new Error('Google Calendar not initialized');
  try {
    const response = await makeCalendarRequest(`/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`, 'PUT', event);
    return response;
  } catch (err) {
    console.error('Error updating Google Calendar event:', err);
    throw err;
  }
}

async function deleteEvent(eventId) {
  if (!isInitialized) initializeCalendarService();
  if (!isInitialized) throw new Error('Google Calendar not initialized');
  try {
    await makeCalendarRequest(`/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`, 'DELETE');
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
    const params = new URLSearchParams({
      timeMin: timeMin,
      timeMax: timeMax,
      singleEvents: 'true',
      orderBy: 'startTime'
    });
    const response = await makeCalendarRequest(`/calendars/${encodeURIComponent(calendarId)}/events?${params}`);
    return response.items || [];
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
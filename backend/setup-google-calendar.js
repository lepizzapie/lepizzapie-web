#!/usr/bin/env node

/**
 * Google Calendar Setup Script for Le Pizza Pie
 * 
 * This script helps you set up Google Calendar integration
 */

const fs = require('fs');
const path = require('path');

console.log('🍕 Le Pizza Pie - Google Calendar Setup\n');

console.log('To set up Google Calendar integration, follow these steps:\n');

console.log('1. GOOGLE CLOUD SETUP:');
console.log('   - Go to https://console.cloud.google.com/');
console.log('   - Create a new project or select existing');
console.log('   - Enable Google Calendar API');
console.log('   - Create a Service Account');
console.log('   - Download the JSON key file\n');

console.log('2. CALENDAR SETUP:');
console.log('   - Create a Google Calendar (or use existing)');
console.log('   - Share it with your service account email');
console.log('   - Give "Make changes to events" permission\n');

console.log('3. ENVIRONMENT VARIABLES:');
console.log('   - Set GOOGLE_SERVICE_ACCOUNT_KEY to your JSON file path');
console.log('   - Set GOOGLE_CALENDAR_ID to your calendar ID\n');

console.log('4. CALENDAR ID:');
console.log('   - Open your Google Calendar');
console.log('   - Go to Settings → Your Calendar → Integrate calendar');
console.log('   - Copy the Calendar ID (looks like: abc123@group.calendar.google.com)\n');

console.log('5. TEST THE INTEGRATION:');
console.log('   - Start your backend server');
console.log('   - Create a test event through your website');
console.log('   - Check if it appears in your Google Calendar\n');

// Check if service account key exists
const keyPath = path.join(__dirname, 'lepizzapieweb-0bbb5492aa73.json');
if (fs.existsSync(keyPath)) {
  console.log('✅ Service account key file found!');
  try {
    const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    console.log(`   Service Account Email: ${keyData.client_email}`);
  } catch (error) {
    console.log('   ⚠️  Key file exists but could not be parsed');
  }
} else {
  console.log('❌ Service account key file not found');
  console.log(`   Expected location: ${keyPath}`);
}

console.log('\nFor more help, visit: https://developers.google.com/calendar/api/guides/auth'); 
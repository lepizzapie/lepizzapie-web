# Google Calendar API Setup Guide

This guide will help you set up Google Calendar API integration for your pizza catering website.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. Basic understanding of APIs

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Le Pizza Pie Calendar")
4. Click "Create"

## Step 2: Enable Google Calendar API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `http://localhost:8080` (for development)
   - Your production domain (e.g., `https://yourdomain.com`)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `http://localhost:8080` (for development)
   - Your production domain
6. Click "Create"
7. Note down your **Client ID**

## Step 4: Create API Key

1. In "Credentials", click "Create Credentials" → "API Key"
2. Note down your **API Key**
3. (Optional) Click "Restrict Key" and limit it to Google Calendar API

## Step 5: Configure Environment Variables

Create a `.env` file in your project root:

```env
REACT_APP_GOOGLE_API_KEY=your_api_key_here
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
REACT_APP_GOOGLE_CALENDAR_ID=primary
```

## Step 6: Install Dependencies

```bash
npm install googleapis
```

## Step 7: Test the Integration

1. Start your development server
2. Go to the admin dashboard
3. Click "Sync to Google Calendar"
4. You'll be prompted to sign in to Google
5. Grant calendar permissions
6. Events should sync to your Google Calendar

## How It Works

### For Business Owners:
- **One-click sync**: Click "Sync to Google Calendar" to sync all confirmed events
- **Automatic iPhone sync**: Google Calendar automatically syncs to iPhone Calendar app
- **Event details**: Each event includes customer contact info, guest count, and special requests
- **Real-time updates**: Events appear immediately in your Google Calendar

### What Gets Synced:
- Event title (e.g., "Birthday Party - Sarah Johnson")
- Date and time
- Location/address
- Customer contact information
- Guest count
- Special requests and dietary restrictions
- Event duration (3 hours by default)

## Troubleshooting

### "Google Calendar not configured"
- Check your environment variables
- Ensure API key and client ID are correct
- Verify Google Calendar API is enabled

### "Authentication required"
- Make sure you're signed into the correct Google account
- Grant calendar permissions when prompted
- Check that your domain is in authorized origins

### "Sync failed"
- Check browser console for detailed error messages
- Verify your Google account has calendar access
- Ensure events have valid dates and times

## Security Notes

- Keep your API keys secure
- Don't commit `.env` files to version control
- Use environment variables in production
- Consider restricting API key usage to specific domains

## Production Deployment

For production, you'll need to:

1. Add your production domain to authorized origins
2. Set up environment variables on your hosting platform
3. Ensure HTTPS is enabled (required for OAuth)
4. Test the integration thoroughly

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Google Cloud Console settings
3. Ensure all environment variables are set correctly
4. Test with a simple event first

---

**Note**: This integration requires users to be signed into their Google account and grant calendar permissions. The first sync may take a few moments as it processes all confirmed events. 
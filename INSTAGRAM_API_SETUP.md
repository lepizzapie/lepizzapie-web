# Instagram API Setup Guide

This guide will help you set up the Instagram Basic Display API to show real Instagram posts from your @lepizzapie account on your website.

## Quick Setup (5 Steps)

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App" → Select "Consumer" → Name it "Le Pizza Pie Website"
3. Complete the app creation

### Step 2: Add Instagram Basic Display
1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" → Click "Set Up"
3. Follow the setup wizard

### Step 3: Configure App Settings
1. Go to "Instagram Basic Display" → "Basic Display"
2. Add your website URL to "Valid OAuth Redirect URIs":
   - Development: `http://localhost:3000/auth/instagram/callback`
   - Production: `https://yourdomain.com/auth/instagram/callback`
3. Save changes

### Step 4: Generate Access Token
1. Go to "Instagram Basic Display" → "Basic Display"
2. Click "Generate Token"
3. Log in with your @lepizzapie Instagram account
4. Grant permissions to your app
5. **Copy the generated access token** (you'll need this!)

### Step 5: Configure Your Website
1. Add the access token to your environment variables:
   ```env
   INSTAGRAM_ACCESS_TOKEN=your_access_token_here
   ```
2. Start your backend server:
   ```bash
   cd backend
   npm install
   npm start
   ```

## Detailed Instructions

### Prerequisites
- A Facebook Developer Account (free)
- Your @lepizzapie Instagram account (must be connected to a Facebook Page)
- Your Instagram account must be public or connected to a Facebook Page

### Step 1: Facebook Developer Account
1. Visit [Facebook Developers](https://developers.facebook.com/)
2. Click "Get Started" or "Log In"
3. Complete the developer verification if prompted

### Step 2: Create App
1. Click "Create App" in the top right
2. Select "Consumer" as the app type
3. Fill in the details:
   - **App Name**: "Le Pizza Pie Website"
   - **App Contact Email**: Your email address
   - **App Purpose**: "I'm building an app for my own business"
4. Click "Create App"

### Step 3: Add Instagram Basic Display
1. In your app dashboard, you'll see "Add Product"
2. Find "Instagram Basic Display" in the list
3. Click "Set Up" next to it
4. Follow the setup wizard (usually just clicking "Next")

### Step 4: Configure Basic Display
1. In the left sidebar, click "Instagram Basic Display" → "Basic Display"
2. You'll see several configuration options
3. **Important**: Add your website URLs to "Valid OAuth Redirect URIs":
   ```
   http://localhost:3000/auth/instagram/callback
   https://yourdomain.com/auth/instagram/callback
   ```
4. Click "Save Changes"

### Step 5: Generate Access Token
1. Still in "Instagram Basic Display" → "Basic Display"
2. Look for "User Token Generator" or "Generate Token"
3. Click "Generate Token"
4. You'll be redirected to Instagram to log in
5. Log in with your @lepizzapie account
6. Grant the requested permissions
7. **Copy the access token** - it will look like: `IGQVJ...` (long string)

### Step 6: Test the Token
1. Open a new browser tab
2. Go to: `https://graph.instagram.com/me?fields=id,username&access_token=YOUR_TOKEN_HERE`
3. Replace `YOUR_TOKEN_HERE` with your actual token
4. You should see JSON like:
   ```json
   {
     "id": "123456789",
     "username": "lepizzapie"
   }
   ```

### Step 7: Configure Your Website
1. Create a `.env` file in your backend folder:
   ```bash
   cd backend
   touch .env
   ```

2. Add your access token to the `.env` file:
   ```env
   INSTAGRAM_ACCESS_TOKEN=IGQVJ...your_actual_token_here
   ```

3. Install backend dependencies:
   ```bash
   npm install
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. Test the API:
   ```bash
   curl http://localhost:5000/api/instagram-posts
   ```

## Troubleshooting

### Common Issues:

**"Invalid access token"**
- Make sure you copied the entire token
- Check that the token hasn't expired
- Regenerate the token if needed

**"Permissions error"**
- Ensure your Instagram account is public or connected to a Facebook Page
- Make sure you granted all requested permissions

**"No posts found"**
- Check that your Instagram account has public posts
- Verify the account username is correct

**"CORS errors"**
- Make sure your backend has CORS enabled (already configured in the code)

### Access Token Expiration:
Instagram access tokens can expire. To handle this:
1. Set up a webhook for token refresh (advanced)
2. Or manually regenerate tokens when needed
3. Check token status in your Facebook App dashboard

## Security Notes

- **Never expose your access token** in client-side code
- **Always use environment variables** for sensitive data
- **Don't commit the .env file** to version control
- **Monitor your API usage** in the Facebook App dashboard

## API Limits

- Instagram Basic Display API has rate limits
- Consider implementing caching (e.g., cache posts for 1 hour)
- Monitor your API usage in the Facebook App dashboard

## Next Steps

Once configured:
1. Your website will automatically fetch the first 6 posts from @lepizzapie
2. Posts will update automatically when you post new content
3. Visitors can click on posts to go to your Instagram profile
4. The gallery will show real photos from your events

## Need Help?

If you encounter issues:
1. Check the Facebook Developer documentation
2. Verify your Instagram account settings
3. Test the API endpoint directly
4. Check the browser console for error messages

The setup should take about 10-15 minutes once you have access to your Instagram account. 
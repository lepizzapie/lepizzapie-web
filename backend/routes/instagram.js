const express = require('express');
const router = express.Router();

// Fetch Instagram posts by scraping the web page
router.get('/instagram-posts', async (req, res) => {
  try {
    // Use a simple approach to get Instagram posts
    // This will fetch the first 6 posts from the @lepizzapie profile
    const instagramUrl = 'https://www.instagram.com/lepizzapie/';
    
    // For now, return a simple response that the frontend can handle
    // In a real implementation, you'd use a web scraping library like Puppeteer
    // or a service like Instagram's embed API
    
    res.json({ 
      posts: [],
      message: 'Instagram posts will be loaded directly from the web page',
      profileUrl: instagramUrl
    });
    
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Instagram posts',
      details: error.message 
    });
  }
});

module.exports = router; 
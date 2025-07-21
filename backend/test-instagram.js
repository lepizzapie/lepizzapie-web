const fetch = require('node-fetch');

// Test Instagram API configuration
async function testInstagramAPI() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.log('❌ INSTAGRAM_ACCESS_TOKEN not found in environment variables');
    console.log('Please add your Instagram access token to the .env file:');
    console.log('INSTAGRAM_ACCESS_TOKEN=your_token_here');
    return;
  }

  console.log('🔍 Testing Instagram API configuration...\n');

  try {
    // Test 1: Get user info
    console.log('1. Testing user info...');
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );
    
    if (!userResponse.ok) {
      throw new Error(`User info failed: ${userResponse.status} ${userResponse.statusText}`);
    }
    
    const userData = await userResponse.json();
    console.log('✅ User info successful:');
    console.log(`   Username: ${userData.username}`);
    console.log(`   User ID: ${userData.id}\n`);

    // Test 2: Get posts
    console.log('2. Testing posts fetch...');
    const postsResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption,timestamp&access_token=${accessToken}&limit=6`
    );
    
    if (!postsResponse.ok) {
      throw new Error(`Posts fetch failed: ${postsResponse.status} ${postsResponse.statusText}`);
    }
    
    const postsData = await postsResponse.json();
    console.log('✅ Posts fetch successful:');
    console.log(`   Found ${postsData.data.length} posts`);
    
    if (postsData.data.length > 0) {
      console.log('   First post:');
      console.log(`   - ID: ${postsData.data[0].id}`);
      console.log(`   - Type: ${postsData.data[0].media_type}`);
      console.log(`   - Has caption: ${!!postsData.data[0].caption}`);
    }
    
    console.log('\n🎉 Instagram API is working correctly!');
    console.log('Your website should now display real Instagram posts.');
    
  } catch (error) {
    console.log('❌ Instagram API test failed:');
    console.log(`   Error: ${error.message}`);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check that your access token is correct');
    console.log('2. Verify your Instagram account has public posts');
    console.log('3. Make sure your app has the correct permissions');
    console.log('4. Check the setup guide in INSTAGRAM_API_SETUP.md');
  }
}

// Run the test
testInstagramAPI(); 
# Instagram Embed Guide (No API Required)

Since Instagram makes it difficult to scrape images without their API, here are the **only** ways to show real Instagram content on your website:

## Option 1: Instagram Profile Embed (Recommended)

Instagram provides an official embed for profiles. However, this may not always work due to Instagram's restrictions.

### How to Use:
1. Go to your Instagram profile: https://instagram.com/lepizzapie
2. Look for an "Embed" option (if available)
3. Copy the embed code
4. Paste it into your website

## Option 2: Manual Post Embeds (Most Reliable)

This is the most reliable way to show real Instagram posts without the API.

### Step 1: Get Embed Codes for Specific Posts
1. Go to any Instagram post you want to show
2. Click the three dots (...) in the top right
3. Select "Embed"
4. Copy the embed code

### Step 2: Add to Your Website
Replace the current Instagram section with this:

```jsx
{/* Instagram Posts - Manual Embeds */}
<div className="grid md:grid-cols-3 gap-6">
  {/* Post 1 */}
  <div className="bg-white rounded-lg overflow-hidden shadow-lg">
    <iframe
      src="https://www.instagram.com/p/POST_ID_1/embed"
      width="100%"
      height="400"
      frameBorder="0"
      scrolling="no"
      allowTransparency={true}
    ></iframe>
  </div>
  
  {/* Post 2 */}
  <div className="bg-white rounded-lg overflow-hidden shadow-lg">
    <iframe
      src="https://www.instagram.com/p/POST_ID_2/embed"
      width="100%"
      height="400"
      frameBorder="0"
      scrolling="no"
      allowTransparency={true}
    ></iframe>
  </div>
  
  {/* Post 3 */}
  <div className="bg-white rounded-lg overflow-hidden shadow-lg">
    <iframe
      src="https://www.instagram.com/p/POST_ID_3/embed"
      width="100%"
      height="400"
      frameBorder="0"
      scrolling="no"
      allowTransparency={true}
    ></iframe>
  </div>
  
  {/* Post 4 */}
  <div className="bg-white rounded-lg overflow-hidden shadow-lg">
    <iframe
      src="https://www.instagram.com/p/POST_ID_4/embed"
      width="100%"
      height="400"
      frameBorder="0"
      scrolling="no"
      allowTransparency={true}
    ></iframe>
  </div>
  
  {/* Post 5 */}
  <div className="bg-white rounded-lg overflow-hidden shadow-lg">
    <iframe
      src="https://www.instagram.com/p/POST_ID_5/embed"
      width="100%"
      height="400"
      frameBorder="0"
      scrolling="no"
      allowTransparency={true}
    ></iframe>
  </div>
  
  {/* Post 6 */}
  <div className="bg-white rounded-lg overflow-hidden shadow-lg">
    <iframe
      src="https://www.instagram.com/p/POST_ID_6/embed"
      width="100%"
      height="400"
      frameBorder="0"
      scrolling="no"
      allowTransparency={true}
    ></iframe>
  </div>
</div>
```

### How to Find Post IDs:
1. Go to any Instagram post
2. Look at the URL: `https://www.instagram.com/p/ABC123xyz/`
3. The part after `/p/` is the post ID (e.g., `ABC123xyz`)

## Option 3: Third-Party Services

Some services can help embed Instagram feeds:

### EmbedSocial
1. Go to [EmbedSocial](https://embedsocial.com/)
2. Connect your Instagram account
3. Get embed code for your feed

### POWR
1. Go to [POWR](https://www.powr.io/)
2. Use their Instagram Feed widget
3. Get embed code

## Option 4: Screenshot Approach (Simplest)

If none of the above work, you can:

1. **Take screenshots** of your 6 best Instagram posts
2. **Save them** to your website's assets folder
3. **Display them** as images with links to the original posts

```jsx
{/* Instagram Posts - Screenshots */}
<div className="grid md:grid-cols-3 gap-6">
  {[1, 2, 3, 4, 5, 6].map((postNum) => (
    <div key={postNum} className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
      <img
        src={`/images/instagram-post-${postNum}.jpg`}
        alt={`Instagram post ${postNum}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
        <a
          href={`https://instagram.com/p/POST_ID_${postNum}`}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-3 shadow-lg"
        >
          <Instagram className="w-6 h-6 text-gray-800" />
        </a>
      </div>
    </div>
  ))}
</div>
```

## Recommendation

**Use Option 2 (Manual Post Embeds)** - it's the most reliable and shows real Instagram content without any API setup.

**Steps:**
1. Pick your 6 best Instagram posts
2. Get the embed code for each one
3. Replace the placeholder code with real embed codes
4. Update the post IDs in the URLs

This gives you real Instagram content without any complex setup! 
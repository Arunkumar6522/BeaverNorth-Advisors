const { JSDOM } = require('jsdom');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('🔍 Fetching blog posts from RSS feed...')
    
    const rssUrl = 'https://beavernorth.blogspot.com/feeds/posts/default?alt=rss'
    const response = await fetch(rssUrl)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const xmlText = await response.text()
    console.log('📊 RSS feed fetched, length:', xmlText.length)
    
    // Parse XML to extract blog posts
    const dom = new JSDOM(xmlText, { contentType: 'text/xml' })
    const xmlDoc = dom.window.document
    const items = xmlDoc.querySelectorAll('item')
    
    console.log('📊 Found', items.length, 'blog posts')
    
    const blogPosts = Array.from(items).map((item) => {
      const title = item.querySelector('title')?.textContent || 'Untitled'
      const description = item.querySelector('description')?.textContent || ''
      const link = item.querySelector('link')?.textContent || ''
      const pubDate = item.querySelector('pubDate')?.textContent || ''
      const author = item.querySelector('author')?.textContent || 'BeaverNorth Advisors'
      
      // Extract thumbnail image - try media:thumbnail first, then img from content
      let thumbnail = null
      
      // Try media:thumbnail first
      const mediaThumbnail = item.querySelector('media\\:thumbnail')
      if (mediaThumbnail) {
        thumbnail = mediaThumbnail.getAttribute('url')
      }
      
      // If no media thumbnail, try to extract from description
      if (!thumbnail && description) {
        const imgMatch = description.match(/<img[^>]+src="([^"]+)"/i)
        if (imgMatch) {
          thumbnail = imgMatch[1]
        }
      }
      
      // Extract categories from RSS feed
      const categories = []
      const categoryElements = item.querySelectorAll('category')
      categoryElements.forEach(cat => {
        const categoryText = cat.textContent?.trim()
        if (categoryText) {
          categories.push(categoryText)
        }
      })
      
      // If no categories found, use default
      const finalCategories = categories.length > 0 ? categories : ['Blog Post']
      
      return {
        title,
        content: description,
        link,
        pubDate,
        author,
        thumbnail,
        categories: finalCategories
      }
    })
    
    console.log('✅ Returning', blogPosts.length, 'blog posts')
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, posts: blogPosts })
    }
    
  } catch (error) {
    console.error('❌ Blog posts fetch error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to fetch blog posts', 
        error: error.message 
      })
    }
  }
}

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
    
    // Use native fetch (available in Node.js 18+)
    const rssUrl = 'https://beavernorth.blogspot.com/feeds/posts/default?alt=rss'
    const response = await fetch(rssUrl)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const xmlText = await response.text()
    console.log('📊 RSS feed fetched, length:', xmlText.length)
    
    // Simple XML parsing without external dependencies
    const blogPosts = []
    
    // Extract items using regex
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1]
      
      // Extract title
      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)
      const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : 'Untitled'
      
      // Extract description
      const descMatch = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/)
      const description = descMatch ? (descMatch[1] || descMatch[2]) : ''
      
      // Extract link
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/)
      const link = linkMatch ? linkMatch[1] : ''
      
      // Extract pubDate
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/)
      const pubDate = pubDateMatch ? pubDateMatch[1] : ''
      
      // Extract author
      const authorMatch = itemContent.match(/<author>(.*?)<\/author>/)
      const author = authorMatch ? authorMatch[1] : 'BeaverNorth Advisors'
      
      // Extract thumbnail from description
      let thumbnail = undefined
      if (description) {
        const imgMatch = description.match(/<img[^>]+src="([^"]+)"/i)
        if (imgMatch) {
          thumbnail = imgMatch[1]
        }
      }
      
      // Extract categories
      const categories = []
      const categoryRegex = /<category>(.*?)<\/category>/g
      let categoryMatch
      while ((categoryMatch = categoryRegex.exec(itemContent)) !== null) {
        categories.push(categoryMatch[1])
      }
      
      const finalCategories = categories.length > 0 ? categories : ['Blog Post']
      
      blogPosts.push({
        title: title.trim(),
        content: description.trim(),
        link: link.trim(),
        pubDate: pubDate.trim(),
        author: author.trim(),
        thumbnail,
        categories: finalCategories
      })
    }
    
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
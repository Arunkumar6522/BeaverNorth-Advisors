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
    console.log('🔍 Test function called')
    
    // Return a simple test response first
    const testPosts = [
      {
        title: "Test Blog Post 1",
        content: "This is a test blog post content.",
        link: "https://beavernorth.blogspot.com/test1.html",
        pubDate: "Tue, 21 Oct 2025 02:41:29 +0000",
        author: "BeaverNorth Advisors",
        thumbnail: undefined,
        categories: ["Blog Post"]
      },
      {
        title: "Test Blog Post 2", 
        content: "This is another test blog post content.",
        link: "https://beavernorth.blogspot.com/test2.html",
        pubDate: "Mon, 20 Oct 2025 15:30:23 +0000",
        author: "BeaverNorth Advisors",
        thumbnail: undefined,
        categories: ["Blog Post"]
      }
    ]
    
    console.log('✅ Returning test posts:', testPosts.length)
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, posts: testPosts })
    }
    
  } catch (error) {
    console.error('❌ Test function error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Test function failed', 
        error: error.message 
      })
    }
  }
}
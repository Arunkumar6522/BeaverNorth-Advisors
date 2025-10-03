import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface BlogPost {
  title: string
  content: string
  link: string
  pubDate: string
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Blogger RSS feed URL
    const rssUrl = 'https://beavernorth.blogspot.com/feeds/posts/default?alt=rss'
    
    // Using RSS2JSON proxy to avoid CORS issues
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
    
    fetch(proxyUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          const blogPosts = data.items?.map((item: any) => ({
            title: item.title,
            content: item.description,
            link: item.link,
            pubDate: new Date(item.pubDate).toLocaleDateString()
          })) || []
          setPosts(blogPosts)
        } else {
          setError('Unable to fetch blog posts')
        }
      })
      .catch(err => {
        console.error('Blog fetch error:', err)
        setError('Failed to load blog posts')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <motion.h1 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        Blog
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ color: 'var(--text-secondary)', marginBottom: 32 }}
      >
        Insights on insurance, risk, and financial protection in Canada from BeaverNorth Advisors.
      </motion.p>

      {loading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p>Loading blog posts...</p>
        </div>
      )}

      {error && (
        <div style={{ 
          background: '#fee2e2', 
          border: '1px solid #fecaca', 
          borderRadius: 8, 
          padding: 16, 
          margin: '16px 0',
          color: '#dc2626'
        }}>
          {error}
          <div style={{ marginTop: 8 }}>
            <a 
              href="https://beavernorth.blogspot.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#dc2626', textDecoration: 'underline' }}
            >
              Visit our blog directly →
            </a>
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <div style={{ display: 'grid', gap: 24 }}>
          {posts.slice(0, 6).map((post, index) => (
            <motion.article
              key={post.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                padding: 24,
                transition: 'transform 0.2s'
              }}
              whileHover={{ y: -4 }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 12 }}>
                <a 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                >
                  {post.title}
                </a>
              </h3>
              
              <div 
                style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: 14,
                  marginBottom: 8,
                  lineHeight: 1.5
                }}
                dangerouslySetInnerHTML={{ 
                  __html: post.content.substring(0, 200) + '...' 
                }} 
              />
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: 16
              }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Published: {post.pubDate}
                </span>
                <a 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--brand-green)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 14
                  }}
                >
                  Read more →
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{ marginTop: 32, textAlign: 'center' }}
      >
        <a 
          href="https://beavernorth.blogspot.com" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            background: 'var(--brand-green)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 700,
            display: 'inline-block'
          }}
        >
          Visit Full Blog
        </a>
      </motion.div>
    </div>
  )
}



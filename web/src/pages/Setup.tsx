import { useState } from 'react'

export default function Setup() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const createTableAndAdmin = async () => {
    setLoading(true)
    setStatus('Creating users table...')

    try {
      // Step 1: Create the table using a database function
      await fetch('https://dkaexqwgaslwfiuiqcml.supabase.co/rest/v1/', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWV4cXdnYXNsd2ZpdWlxY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQ5MjgsImV4cCI6MjA3NTA5MDkyOH0.0d3RiXkPRqhgXCh3V4xtsJ9P5hak84JYR0LQGJz9W9s',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWV4cXdnYXNsd2ZpdWlxY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQ5MjgsImV4cCI6MjA3NTA5MDkyOH0.0d3RiXkPRqhgXCh3V4xtsJ9P5hak84JYR0LQGJz9W9s',
          'Content-Type': 'application/json'
        }
      })

      setStatus('Table creation attempted. Now adding admin user...')

      // Step 2: Insert admin user
      const insertResponse = await fetch('https://dkaexqwgaslwfiuiqcml.supabase.co/rest/v1/users', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWV4cXdnYXNsd2ZpdWlxY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQ5MjgsImV4cCI6MjA3NTA5MDkyOH0.0d3RiXkPRqhgXCh3V4xtsJ9P5hak84JYR0LQGJz9W9s',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWV4cXdnYXNsd2ZpdWlxY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQ5MjgsImV4cCI6MjA3NTA5MDkyOH0.0d3RiXkPRqhgXCh3V4xtsJ9P5hak84JYR0LQGJz9W9s',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin',
          email: 'admin@beavernorth.com',
          full_name: 'Administrator'
        })
      })

      if (insertResponse.ok) {
        setStatus('✅ Success! Table created and admin user added. Username: admin, Password: admin')
      } else {
        const error = await insertResponse.text()
        if (error.includes('users') && error.includes('schema cache')) {
          setStatus('❌ Table creation needed. Please run the SQL script manually.')
        } else {
          setStatus(`❌ Error: ${error}`)
        }
      }
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a2540',
      color: 'white'
    }}>
      <div style={{
        background: 'white',
        color: '#333',
        padding: 32,
        borderRadius: 12,
        width: 500,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      }}>
        <h2>Supabase Database Setup</h2>
        <p>Click the button below to create the users table and add an admin user:</p>
        
        <button
          onClick={createTableAndAdmin}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#6b7280' : '#0a2540',
            color: 'white',
            padding: '12px 16px',
            borderRadius: 8,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 16
          }}
        >
          {loading ? 'Setting up...' : 'Create Table & Admin User'}
        </button>

        {status && (
          <div style={{
            padding: 12,
            borderRadius: 6,
            background: status.includes('✅') ? '#d1fae5' : status.includes('❌') ? '#fee2e2' : '#f3f4f6',
            color: status.includes('✅') ? '#065f46' : status.includes('❌') ? '#dc2626' : '#374151',
            fontSize: 14
          }}>
            {status}
          </div>
        )}

        <div style={{ marginTop: 16, fontSize: 12, color: '#6b7280' }}>
          <p><strong>Manual Setup:</strong></p>
          <p>If automatic setup fails, go to your Supabase Dashboard → SQL Editor and run:</p>
          <pre style={{
            background: '#f6f7fb',
            padding: 8,
            borderRadius: 4,
            fontSize: 11,
            overflow: 'auto'
          }}>
{`CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (username, password, email, full_name, role)
VALUES ('admin', 'admin', 'admin@beavernorth.com', 'Administrator', 'admin');`}
          </pre>
        </div>
      </div>
    </div>
  )
}

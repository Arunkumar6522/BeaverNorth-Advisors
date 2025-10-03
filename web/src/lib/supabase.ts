import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dkaexqwgaslwfiuiqcml.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWV4cXdnYXNsd2ZpdWlxY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQ5MjgsImV4cCI6MjA3NTA5MDkyOH0.0d3RiXkPRqhgXCh3V4xtsJ9P5hak84JYR0LQGJz9W9s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

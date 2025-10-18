import { createClient } from '@supabase/supabase-js'

// Use environment variables or fallback to your actual project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dkaexqwgaslwfiuiqcml.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8tcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE5NTYzNTUyMDB9.demo-key'

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl.includes('supabase.co') && 
                           supabaseAnonKey.startsWith('eyJ') && 
                           supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8tcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE5NTYzNTUyMDB9.demo-key'

// Log configuration status
if (!hasValidCredentials) {
  console.warn('⚠️ Supabase not configured - using mock client. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable database features.')
}

let supabase: any = null

if (hasValidCredentials) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Failed to create Supabase client:', error)
    supabase = createMockClient()
  }
} else {
  supabase = createMockClient()
}

function createMockClient() {
  return {
    from: (_table: string) => ({
      select: (_columns?: string) => ({
        eq: (_column: string, _value: any) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
        }),
        order: (_column: string, _options?: any) => ({
          limit: (_count: number) => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
        }),
        then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
      }),
      insert: (_data: any) => ({
        select: () => Promise.resolve({ data: [], error: null }),
        then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
      }),
      update: (_data: any) => ({
        eq: (_column: string, _value: any) => ({
          select: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
        }),
        then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
      }),
      delete: () => ({
        eq: (_column: string, _value: any) => ({
          then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
        }),
        then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
      }),
      single: () => Promise.resolve({ data: null, error: null })
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  }
}

export { supabase }

export interface CustomUser {
  id: number
  username: string
  password?: string
  email?: string
  full_name?: string
  role: string
  created_at: string
}

export interface LoginResponse {
  success: boolean
  user?: CustomUser
  error?: string
}

export class CustomAuth {
  private async getUserByUsername(username: string): Promise<CustomUser[]> {
    const response = await fetch(`https://dkaexqwgaslwfiuiqcml.supabase.co/rest/v1/users?username=eq.${username}&select=*`, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWV4cXdnYXNsd2ZpdWlxY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQ5MjgsImV4cCI6MjA3NTA5MDkyOH0.0d3RiXkPRqhgXCh3V4xtsJ9P5hak84JYR0LQGJz9W9s',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWV4cXdnYXNsd2ZpdWlxY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQ5MjgsImV4cCI6MjA3NTA5MDkyOH0.0d3RiXkPRqhgXCh3V4xtsJ9P5hak84JYR0LQGJz9W9s',
        'Content-Type': 'application/json'
      }
    })

    return response.json()
  }

  public async login(username: string, password: string): Promise<LoginResponse> {
    try {
      // First try to fetch from database
      try {
        const users = await this.getUserByUsername(username)
        
        if (users.length > 0) {
          const user = users[0]
          
          // Check password matches
          const isValidPassword = user.password === password
          
          if (!isValidPassword) {
            return { success: false, error: 'Invalid username or password' }
          }

          // Store user in localStorage for session persistence
          localStorage.setItem('beavernorth_user', JSON.stringify(user))
          
          return { success: true, user }
        }
      } catch (dbError) {
        // Database table might not exist yet
        console.log('Database not ready, using fallback admin')
      }

      // Fallback: use hardcoded admin credentials
      if (username === 'admin' && password === 'admin') {
        const fallbackUser: CustomUser = {
          id: 1,
          username: 'admin',
          email: 'admin@beavernorth.com',
          full_name: 'Administrator',
          role: 'admin',
          created_at: new Date().toISOString()
        }

        localStorage.setItem('beavernorth_user', JSON.stringify(fallbackUser))
        return { success: true, user: fallbackUser }
      }

      return { success: false, error: 'Invalid username or password' }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  public logout(): void {
    localStorage.removeItem('beavernorth_user')
  }

  public getCurrentUser(): CustomUser | null {
    const userStr = localStorage.getItem('beavernorth_user')
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  public isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

export const customAuth = new CustomAuth()
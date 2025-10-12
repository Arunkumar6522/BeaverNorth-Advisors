export interface CustomUser {
  id: string
  username: string
}

export interface LoginResponse {
  success: boolean
  user?: CustomUser
  error?: string
  errorCode?: 'no_user' | 'bad_password' | 'cooldown' | 'unknown'
  cooldownSeconds?: number
}

export class CustomAuth {
  public async login(loginInput: string, password: string): Promise<LoginResponse> {
    const input = (loginInput || '').trim()
    const p = password || ''
    
    // Basic validation - just check if input and password are not empty
    if (input.length < 1 || p.length < 1) {
      return { success: false, error: 'Please enter username/email and password', errorCode: 'unknown' }
    }

    try {
      const { supabase } = await import('./supabase')
      
      // Check if input looks like an email (contains @)
      const isEmail = input.includes('@')
      
      let query
      if (isEmail) {
        // Search by email
        query = supabase
          .from('users')
          .select('id, username, password, email, full_name, role')
          .eq('email', input)
      } else {
        // Search by username
        query = supabase
          .from('users')
          .select('id, username, password, email, full_name, role')
          .eq('username', input)
      }

      const { data, error } = await query.single()

      if (error) {
        console.error('Database query error:', error)
        if (error.code === 'PGRST116') {
          return { success: false, error: 'No user found', errorCode: 'no_user' }
        }
        return { success: false, error: 'Login failed. Please try again.', errorCode: 'unknown' }
      }

      if (!data) {
        return { success: false, error: 'No user found', errorCode: 'no_user' }
      }

      // Check password (simple comparison)
      if (data.password !== p) {
        return { success: false, error: 'Invalid password', errorCode: 'bad_password' }
      }

      const safeUser: CustomUser = { id: data.id.toString(), username: data.username }
      // Store minimal info in sessionStorage
      sessionStorage.setItem('beavernorth_user', JSON.stringify(safeUser))
      return { success: true, user: safeUser }
    } catch (e) {
      console.error('login fatal error:', e)
      return { success: false, error: 'Login failed. Please try again.', errorCode: 'unknown' }
    }
  }

  public logout(): void {
    sessionStorage.removeItem('beavernorth_user')
  }

  public getCurrentUser(): CustomUser | null {
    const userStr = sessionStorage.getItem('beavernorth_user')
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
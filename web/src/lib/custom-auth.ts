export interface CustomUser {
  id: string
  username: string
  email?: string
  role?: string
}

export interface LoginResponse {
  success: boolean
  user?: CustomUser
  error?: string
  errorCode?: 'no_user' | 'bad_password' | 'cooldown' | 'unknown'
  cooldownSeconds?: number
}

export interface SessionData {
  user: CustomUser
  expiresAt: number
  token: string
}

export class CustomAuth {
  private readonly SESSION_KEY = 'beavernorth_session'
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

  private generateToken(): string {
    // Cryptographically secure token generation
    const crypto = window.crypto || (window as any).msCrypto
    if (crypto && crypto.getRandomValues) {
      const array = new Uint8Array(32)
      crypto.getRandomValues(array)
      return 'bn_' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } else {
      // Fallback for older browsers
      return 'bn_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9)
    }
  }

  private isSessionValid(sessionData: SessionData): boolean {
    return Date.now() < sessionData.expiresAt
  }

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
        // Search by email - only select password_hash column
        query = supabase
          .from('users')
          .select('id, username, password_hash, email, full_name, role')
          .eq('email', input)
      } else {
        // Search by username - only select password_hash column
        query = supabase
          .from('users')
          .select('id, username, password_hash, email, full_name, role')
          .eq('username', input)
      }

      const { data, error } = await query.single()

      if (error) {
        console.error('Database query error:', error)
        if (error.code === 'PGRST116') {
          return { success: false, error: 'No user found with this email/username', errorCode: 'no_user' }
        }
        return { success: false, error: 'Login failed. Please try again.', errorCode: 'unknown' }
      }

      if (!data) {
        return { success: false, error: 'No user found', errorCode: 'no_user' }
      }

      // Check password using bcrypt
      const bcrypt = await import('bcryptjs')
      const isValidPassword = await bcrypt.compare(p, data.password_hash)
      
      if (!isValidPassword) {
        return { success: false, error: 'Invalid password', errorCode: 'bad_password' }
      }

      const user: CustomUser = { 
        id: data.id.toString(), 
        username: data.username,
        email: data.email,
        role: data.role
      }

      // Create session with expiration
      const sessionData: SessionData = {
        user,
        expiresAt: Date.now() + this.SESSION_DURATION,
        token: this.generateToken()
      }

      // Store session in sessionStorage
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData))
      
      return { success: true, user }
    } catch (e) {
      console.error('login fatal error:', e)
      return { success: false, error: 'Login failed. Please try again.', errorCode: 'unknown' }
    }
  }

  public logout(): void {
    sessionStorage.removeItem(this.SESSION_KEY)
    // Also clear any additional localStorage items
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('username')
    localStorage.removeItem('temp_activities')
  }

  public getCurrentUser(): CustomUser | null {
    const sessionStr = sessionStorage.getItem(this.SESSION_KEY)
    if (!sessionStr) return null
    
    try {
      const sessionData: SessionData = JSON.parse(sessionStr)
      
      // Check if session is still valid
      if (!this.isSessionValid(sessionData)) {
        this.logout() // Clear expired session
        return null
      }
      
      return sessionData.user
    } catch {
      this.logout() // Clear invalid session
      return null
    }
  }

  public isAuthenticated(): boolean {
    const user = this.getCurrentUser()
    return user !== null
  }

  public getSessionToken(): string | null {
    const sessionStr = sessionStorage.getItem(this.SESSION_KEY)
    if (!sessionStr) return null
    
    try {
      const sessionData: SessionData = JSON.parse(sessionStr)
      
      if (!this.isSessionValid(sessionData)) {
        this.logout()
        return null
      }
      
      return sessionData.token
    } catch {
      this.logout()
      return null
    }
  }

  public refreshSession(): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    // Refresh the session by extending expiration
    const sessionData: SessionData = {
      user,
      expiresAt: Date.now() + this.SESSION_DURATION,
      token: this.generateToken()
    }

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData))
    return true
  }
}

export const customAuth = new CustomAuth()
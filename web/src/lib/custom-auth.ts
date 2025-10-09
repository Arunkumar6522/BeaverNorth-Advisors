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
  // Get client IP (best-effort, non-blocking fallback)
  private async getClientIp(): Promise<string> {
    try {
      const res = await fetch('https://api.ipify.org?format=json')
      const json = await res.json()
      return json.ip || ''
    } catch {
      return ''
    }
  }

  public async login(username: string, password: string): Promise<LoginResponse> {
    const u = (username || '').trim()
    const p = password || ''
    if (u.length < 3 || p.length < 8) {
      return { success: false, error: 'Invalid username or password', errorCode: 'unknown' }
    }

    try {
      const { supabase } = await import('./supabase')
      const ip = await this.getClientIp()
      const { data, error } = await (supabase.rpc as any)(
        'secure_login',
        { p_username: u, p_password: p, p_ip: ip }
      )

      if (error) {
        console.error('secure_login RPC error:', error)
        return { success: false, error: 'Login failed. Please try again.', errorCode: 'unknown' }
      }

      const row = Array.isArray(data) ? data[0] : data
      if (!row) {
        return { success: false, error: 'Login failed. Please try again.', errorCode: 'unknown' }
      }

      if (!row.success) {
        if (row.error === 'cooldown') {
          return { success: false, error: 'Too many attempts. Try again in 10 minutes.', errorCode: 'cooldown', cooldownSeconds: 600 }
        }
        if (row.error === 'no_user') {
          return { success: false, error: 'No user found', errorCode: 'no_user' }
        }
        if (row.error === 'bad_password') {
          return { success: false, error: 'Invalid password', errorCode: 'bad_password' }
        }
        return { success: false, error: 'Login failed. Please try again.', errorCode: 'unknown' }
      }

      const safeUser: CustomUser = { id: row.user_id, username: row.username }
      // Store minimal info in sessionStorage instead of localStorage
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
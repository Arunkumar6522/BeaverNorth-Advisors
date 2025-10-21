import { useEffect } from 'react'
import { customAuth } from '../lib/custom-auth'

// Session refresh interval (30 minutes)
const SESSION_REFRESH_INTERVAL = 30 * 60 * 1000

export function useSessionRefresh() {
  useEffect(() => {
    // Only set up refresh if user is authenticated
    if (!customAuth.isAuthenticated()) {
      return
    }

    // Set up interval to refresh session
    const refreshInterval = setInterval(() => {
      if (customAuth.isAuthenticated()) {
        customAuth.refreshSession()
        console.log('🔄 Session refreshed')
      } else {
        clearInterval(refreshInterval)
      }
    }, SESSION_REFRESH_INTERVAL)

    // Cleanup interval on unmount
    return () => {
      clearInterval(refreshInterval)
    }
  }, [])
}

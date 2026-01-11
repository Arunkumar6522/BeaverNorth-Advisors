// Email Marketing Service

export interface Unsubscriber {
  id: string
  email: string
  name?: string
  category_id?: string
  category_name?: string
  unsubscribed_at: string
  reason?: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

export const fetchUnsubscribers = async (): Promise<Unsubscriber[]> => {
  try {
    // For now, using localStorage. In production, fetch from API
    const stored = localStorage.getItem('emailUnsubscribers')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error fetching unsubscribers:', error)
    return []
  }
}

export const unsubscribeEmail = async (email: string, reason?: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, reason }),
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error('Error unsubscribing:', error)
    // Fallback to localStorage
    const unsubscribers = await fetchUnsubscribers()
    const newUnsubscriber: Unsubscriber = {
      id: Date.now().toString(),
      email,
      reason,
      unsubscribed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    unsubscribers.push(newUnsubscriber)
    localStorage.setItem('emailUnsubscribers', JSON.stringify(unsubscribers))
    return true
  }
}


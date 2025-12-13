// Email Marketing API Service

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

// Unsubscribe an email
export const unsubscribeEmail = async (email: string, name?: string, categoryId?: string, categoryName?: string, reason?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        category_id: categoryId,
        category_name: categoryName,
        reason
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Unsubscribe error:', error);
    throw error;
  }
};

// Get all unsubscribers
export const getUnsubscribers = async (): Promise<Unsubscriber[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/unsubscribers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Get unsubscribers error:', error);
    return [];
  }
};

// Check if emails are unsubscribed
export const checkUnsubscribed = async (emails: string[]): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/check-unsubscribed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emails })
    });

    const data = await response.json();
    return data.success ? data.unsubscribedEmails : [];
  } catch (error) {
    console.error('Check unsubscribed error:', error);
    return [];
  }
};

// Generate unsubscribe URL
export const getUnsubscribeUrl = (email: string, baseUrl?: string): string => {
  const base = baseUrl || window.location.origin;
  return `${base}/api/unsubscribe?email=${encodeURIComponent(email)}`;
};

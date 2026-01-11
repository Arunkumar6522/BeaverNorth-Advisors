// Email Marketing Helper Functions

export const addUnsubscribeButton = (content: string, baseUrl: string = window.location.origin): string => {
  // Replace {email} placeholder with actual email when sending
  const unsubscribeUrl = `${baseUrl}/api/unsubscribe?email={email}`
  
  const unsubscribeButton = `
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center;">
      <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 12px;">
        Don't want to receive these emails?
      </p>
      <a href="${unsubscribeUrl}" 
         style="display: inline-block; padding: 8px 16px; background-color: #EF4444; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">
        Unsubscribe
      </a>
    </div>
  `
  
  // Check if unsubscribe button already exists
  if (content.includes('unsubscribe') || content.includes('Unsubscribe')) {
    return content
  }
  
  return content + unsubscribeButton
}

export const personalizeEmailContent = (content: string, name: string, email: string): string => {
  return content
    .replace(/{name}/g, name)
    .replace(/{email}/g, email)
}

export const getUnsubscribeUrl = (email: string, baseUrl: string = window.location.origin): string => {
  return `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}`
}


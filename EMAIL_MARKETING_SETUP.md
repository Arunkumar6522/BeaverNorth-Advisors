# Email Marketing Module - Setup Guide

## Database Setup

Run these SQL scripts in your Supabase SQL Editor in order:

1. `database/email_marketing/01_create_unsubscribers_table.sql`
2. `database/email_marketing/02_create_email_campaigns_table.sql`
3. `database/email_marketing/03_create_email_recipients_table.sql`

## Backend Setup

### 1. Add Email Marketing Endpoints to server.js

Copy the contents from `web/server-email-marketing-endpoints.js` and append them to your `web/server.js` file before `app.listen()`.

### 2. Environment Variables

Add these to your `.env` file:

```env
# AWS SES Configuration (when approved)
AWS_SES_ACCESS_KEY_ID=your_access_key
AWS_SES_SECRET_ACCESS_KEY=your_secret_key
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@beavernorth.com

# App URL for unsubscribe links
APP_URL=https://beavernorth.netlify.app
```

## Frontend Updates Needed

### 1. RichTextEditor.tsx - Fix Image Resize

Update `handleResizeImage` function to properly handle image sizing:

```typescript
const handleResizeImage = () => {
  if (!selectedImage) return

  let width = imageWidth
  let height = imageHeight

  // Handle percentage
  if (width && !width.includes('%') && !width.includes('px')) {
    width = width + 'px'
  }
  if (height && !height.includes('%') && !height.includes('px')) {
    height = height + 'px'
  }

  // Set width and height
  if (width) {
    selectedImage.style.width = width
  } else {
    selectedImage.style.width = ''
  }

  if (height) {
    selectedImage.style.height = height
  } else {
    selectedImage.style.height = ''
  }

  // Always maintain max-width for responsive design
  selectedImage.style.maxWidth = '100%'
  
  // If height is auto or empty, let it be auto
  if (!height || height === 'auto') {
    selectedImage.style.height = 'auto'
  }

  // Update link if provided
  if (imageLink) {
    handleAddImageLink()
  }

  updateContent()
  setResizeDialogOpen(false)
  setSelectedImage(null)
  setImageLink('')
}
```

### 2. RichTextEditor.tsx - Update Signature

Update `handleInsertSignature` to include unsubscribe button:

```typescript
const handleInsertSignature = () => {
  if (!editorRef.current) return
  
  const baseUrl = window.location.origin
  const signature = `
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
      <p style="margin: 0; color: #6B7280; font-size: 14px;">Best regards,</p>
      <p style="margin: 5px 0 0 0; color: #111827; font-weight: 600;">BeaverNorth Advisors</p>
      <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 12px;">Email: beavernorthadvisors@gmail.com</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #E5E7EB;">
      <p style="font-size: 12px; color: #6B7280; text-align: center;">
        <a href="${baseUrl}/api/unsubscribe?email={email}" style="color: #6B7280; text-decoration: underline;">Unsubscribe</a> | 
        <a href="${baseUrl}" style="color: #6B7280; text-decoration: underline;">Visit Website</a>
      </p>
      <p style="font-size: 11px; color: #9CA3AF; text-align: center; margin-top: 5px;">
        You are receiving this email because you subscribed to our mailing list. 
        Click <a href="${baseUrl}/api/unsubscribe?email={email}" style="color: #9CA3AF;">here</a> to unsubscribe.
      </p>
    </div>
  `
  
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const div = document.createElement('div')
    div.innerHTML = signature.trim()
    range.insertNode(div)
    updateContent()
    editorRef.current.focus()
  } else {
    editorRef.current.innerHTML += signature
    updateContent()
  }
}
```

### 3. EmailMarketing.tsx - Add Unsubscribers Tab

Add a new tab (index 3) for Unsubscribers. The component should:
- Fetch unsubscribers from API
- Display in a table with columns: Email, Name, Category, Unsubscribed At, Reason
- Show total count
- Allow filtering/searching

## Features Implemented

✅ Database tables for unsubscribers, campaigns, and recipients
✅ Backend API endpoints for unsubscribe functionality
✅ Frontend service for email marketing API calls
✅ Unsubscribe button in email signature
✅ Image resize fixes
✅ Netlify function for unsubscribe

## Next Steps

1. Run database migrations
2. Append email marketing endpoints to server.js
3. Update RichTextEditor signature function
4. Add Unsubscribers tab to EmailMarketing component
5. Test unsubscribe functionality
6. When AWS SES is approved, add credentials and enable email sending

## Testing Unsubscribe

1. Send a test email with unsubscribe link
2. Click unsubscribe link
3. Verify email is added to unsubscribers table
4. Verify email is filtered out from future campaigns
5. Check Unsubscribers tab shows the entry

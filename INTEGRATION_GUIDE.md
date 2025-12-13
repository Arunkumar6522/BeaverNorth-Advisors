# Email Marketing Integration Guide

## Quick Integration Steps

### 1. Database Setup
Run the SQL file to create tables:
```bash
# In Supabase SQL Editor, run:
database/email_marketing/01_create_email_marketing_tables.sql
```

### 2. Update EmailMarketing.tsx

Add import at top:
```typescript
import EmailMarketingUnsubscribers from './EmailMarketingUnsubscribers'
```

Add Unsubscribers tab (around line 943):
```typescript
<Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
  <Tab label="Email Templates" />
  <Tab label="Categories" />
  <Tab label="Tracking" />
  <Tab label="Unsubscribers" />
</Tabs>
```

Add tab content (after Tracking tab, around line 1257):
```typescript
{/* Unsubscribers Tab */}
{activeTab === 3 && (
  <EmailMarketingUnsubscribers />
)}
```

### 3. Update RichTextEditor.tsx

Fix `handleResizeImage` function (around line 212):
```typescript
const handleResizeImage = () => {
  if (!selectedImage) return

  const width = imageWidth ? (imageWidth.includes('%') ? imageWidth : imageWidth + 'px') : 'auto'
  const height = imageHeight ? (imageHeight.includes('%') ? imageHeight : imageHeight + 'px') : 'auto'

  selectedImage.style.width = width
  selectedImage.style.height = height === 'auto' ? 'auto' : height
  selectedImage.style.maxWidth = '100%'
  
  // Ensure image fits in canvas
  if (editorRef.current && selectedImage.width > editorRef.current.clientWidth) {
    selectedImage.style.width = '100%'
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

Update `handleInsertSignature` to include unsubscribe link (around line 250):
```typescript
const handleInsertSignature = () => {
  if (!editorRef.current) return
  
  const signature = `
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
      <p style="margin: 0; color: #6B7280; font-size: 14px;">Best regards,</p>
      <p style="margin: 5px 0 0 0; color: #111827; font-weight: 600;">BeaverNorth Advisors</p>
      <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 12px;">Email: beavernorthadvisors@gmail.com</p>
      <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #6B7280;">
        <p>Don't want to receive these emails? <a href="{unsubscribe_url}" style="color: #1E377C; text-decoration: underline;">Unsubscribe</a></p>
      </div>
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

### 4. Update Email Sending Logic

In `handleSendEmail` function in EmailMarketing.tsx, when creating personalized content:

```typescript
// Replace this line (around line 744):
const personalizedContent = template.content.replace(/{name}/g, contact.name)

// With this:
const unsubscribeUrl = `${window.location.origin}/api/email-marketing/unsubscribe?email=${encodeURIComponent(contact.email)}&campaignId=${campaign.id}`
const personalizedContent = template.content
  .replace(/{name}/g, contact.name)
  .replace(/{unsubscribe_url}/g, unsubscribeUrl)
```

### 5. Add Unsubscribe Route

In your router file (App.tsx or routes file), add:
```typescript
import UnsubscribePage from './components/UnsubscribePage'

// Add route:
<Route path="/unsubscribe" element={<UnsubscribePage />} />
```

### 6. Environment Variables

Add to `web/.env`:
```env
# AWS SES (when approved)
AWS_SES_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key-here
AWS_SECRET_ACCESS_KEY=your-secret-here
AWS_SES_FROM_EMAIL=noreply@beavernorthadvisors.com
AWS_SES_FROM_NAME=BeaverNorth Advisors
```

### 7. Backend Server Updates

The server.js file has been updated with:
- `/api/email-marketing/unsubscribe` - POST endpoint
- `/api/email-marketing/unsubscribers` - GET endpoint  
- `/api/email-marketing/check-unsubscribed` - POST endpoint
- `/api/email-marketing/send-campaign` - POST endpoint

Make sure these are added to your existing server.js file.

## Testing

1. **Test Unsubscribe**: 
   - Send a test email
   - Click unsubscribe link
   - Check Unsubscribers tab

2. **Test Image Resize**:
   - Create template
   - Add image
   - Click image → resize dialog should open
   - Resize and verify it fits in canvas

3. **Test Signature**:
   - Click signature button
   - Verify unsubscribe link is included

## AWS SES Integration (When Approved)

Once AWS SES is approved, update the send-campaign endpoint to use AWS SDK:

```javascript
const AWS = require('aws-sdk');

const ses = new AWS.SES({
  region: process.env.AWS_SES_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// In send-campaign endpoint:
const params = {
  Source: `${fromName} <${fromEmail}>`,
  Destination: {
    ToAddresses: [recipient.email]
  },
  Message: {
    Subject: { Data: subject },
    Body: {
      Html: { Data: emailWithUnsubscribe }
    }
  }
};

await ses.sendEmail(params).promise();
```


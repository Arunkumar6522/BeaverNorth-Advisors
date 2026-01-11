# Email Marketing Unsubscribe System Setup

## Overview
This document outlines the unsubscribe system for email marketing, including database setup, backend API, and frontend integration.

## Database Setup

Run the SQL script:
```sql
database/email_marketing/01_create_unsubscribers_table.sql
```

This creates:
- `email_unsubscribers` table
- Indexes for performance
- RLS policies for security

## Backend API

### Netlify Function: `/netlify/functions/unsubscribe.js`

**Endpoints:**
- `GET /unsubscribe?email=xxx&name=xxx&category=xxx` - Unsubscribe via link
- `POST /unsubscribe` - Unsubscribe via form

**Response:**
```json
{
  "success": true,
  "message": "You have been successfully unsubscribed",
  "data": { ... }
}
```

## Frontend Integration

### 1. Service File: `web/src/services/emailMarketing.ts`
- `getUnsubscribers()` - Fetch all unsubscribers
- `isUnsubscribed(email)` - Check if email is unsubscribed
- `filterUnsubscribed(contacts)` - Filter out unsubscribed emails
- `generateUnsubscribeLink()` - Generate unsubscribe URL
- `addUnsubscribeButtonToTemplate()` - Add unsubscribe button to email

### 2. EmailMarketing Component Updates

**Add Unsubscribers Tab:**
- New tab in the Tabs component
- Table showing: Email, Name, Category, Unsubscribed Date, Reason
- Delete functionality
- Search/filter capability

**Update Email Sending:**
- Filter out unsubscribed emails before sending
- Add unsubscribe button automatically to each email
- Personalize unsubscribe link with recipient info

**Update Template Creation:**
- Automatically add unsubscribe button when saving template
- Unsubscribe button appears at bottom of email

## AWS SES Integration

When AWS SES is approved, update `web/server.js`:

```javascript
// Add to environment variables:
// AWS_SES_REGION=us-east-1
// AWS_SES_ACCESS_KEY_ID=your-key
// AWS_SES_SECRET_ACCESS_KEY=your-secret
// AWS_SES_FROM_EMAIL=noreply@yourdomain.com

const AWS = require('aws-sdk');

const ses = new AWS.SES({
  region: process.env.AWS_SES_REGION,
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY
});

async function sendEmailViaSES(to, subject, htmlContent) {
  const params = {
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: htmlContent, Charset: 'UTF-8' }
      }
    }
  };

  return ses.sendEmail(params).promise();
}
```

## Usage Flow

1. **Email Template Creation:**
   - User creates template
   - Unsubscribe button automatically added to bottom
   - Template saved with unsubscribe link placeholder

2. **Email Sending:**
   - System checks unsubscribers list
   - Filters out unsubscribed emails
   - Personalizes unsubscribe link for each recipient
   - Sends via AWS SES (when configured)

3. **Unsubscribe Process:**
   - User clicks unsubscribe link in email
   - Redirected to unsubscribe page/API
   - Email added to unsubscribers table
   - Confirmation message shown

4. **Unsubscribers Management:**
   - Admin views unsubscribers tab
   - Can see all unsubscribed emails
   - Can delete records if needed
   - Data preserved for reporting

## Testing

1. Create email template
2. Send test email
3. Click unsubscribe link
4. Verify email added to unsubscribers table
5. Try sending email again - should be filtered out


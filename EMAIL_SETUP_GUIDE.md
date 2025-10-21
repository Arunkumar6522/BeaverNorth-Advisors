# 📧 Email Notification Setup Guide

This guide explains how to set up email notifications for new leads in the BeaverNorth Advisors system.

## 🎯 Overview

When a new lead is created through the admin dashboard, the system automatically sends a professional email notification to `beavernorthadvisors@gmail.com` with all the lead details.

## 🔧 Setup Instructions

### 1. Email Service Configuration

The system uses **Gmail SMTP** by default. You'll need to configure your email credentials in the `.env` file.

### 2. Gmail App Password Setup

Since Gmail requires app-specific passwords for SMTP, follow these steps:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Copy the 16-character password

### 3. Environment Variables

Update your `web/.env` file with the following:

```env
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

**⚠️ Important**: 
- Use your actual Gmail address for `EMAIL_USER`
- Use the 16-character app password (not your regular Gmail password) for `EMAIL_PASS`
- Never commit real credentials to version control

### 4. Alternative Email Providers

If you prefer to use a different email service, update the configuration:

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

#### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

#### Custom SMTP Server
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
```

## 📧 Email Template

The system sends a professional HTML email with:

- **Header**: BeaverNorth Advisors branding
- **Lead Details**: Name, email, phone, DOB, province, smoking status, insurance product, notes
- **Next Steps**: Action items for the team
- **Timestamp**: When the lead was created
- **Professional Styling**: Branded colors and layout

## 🚀 Testing

### Demo Mode
If email credentials are not configured, the system runs in demo mode and logs:
```
🔧 Demo mode: Simulating lead notification email
```

### Production Mode
With proper credentials, you'll see:
```
📧 Email transporter initialized
✅ Lead notification email sent: [message-id]
```

## 🔍 Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Verify you're using the app password, not your regular Gmail password
   - Ensure 2FA is enabled on your Gmail account

2. **"Connection timeout"**
   - Check your internet connection
   - Verify the SMTP host and port settings

3. **"Invalid credentials"**
   - Double-check the email and password in `.env`
   - Ensure the app password is exactly 16 characters

### Debug Mode

Check the server console for detailed error messages:
```bash
cd web && npm run dev:full
```

Look for:
- `📧 Email transporter initialized` (success)
- `🔧 Running in demo mode` (demo mode)
- `❌ Email notification error:` (error details)

## 📱 Email Recipients

Currently configured to send to:
- **Primary**: `beavernorthadvisors@gmail.com`

To change the recipient, update the `to` field in `web/server.js`:
```javascript
const mailOptions = {
  from: emailUser,
  to: 'your-email@domain.com', // Change this
  subject: `🎯 New Lead: ${leadData.name || 'Unknown'} - ${leadData.insuranceProduct || 'Insurance Inquiry'}`,
  html: emailTemplate
};
```

## 🔒 Security Notes

- Email credentials are stored in environment variables
- Never commit real credentials to version control
- Use app-specific passwords for Gmail
- Consider using a dedicated email service for production

## 📊 Monitoring

The system logs all email activities:
- Successful sends: `✅ Lead notification email sent`
- Demo mode: `🔧 Demo mode: Simulating lead notification email`
- Errors: `❌ Email notification error: [details]`

Monitor these logs to ensure email notifications are working properly.

---

**Need Help?** Check the server console logs or contact the development team for assistance with email configuration.

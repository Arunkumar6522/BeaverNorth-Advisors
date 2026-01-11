# Google Ads Conversion Tracking Setup Guide

This guide will help you set up Google Ads conversion tracking for BeaverNorth Financials.

## 📋 Prerequisites

1. A Google Ads account
2. Access to Google Ads API (requires approval from Google)
3. Admin access to your Netlify account (for environment variables)

## 🔧 Step 1: Get Your Google Ads Conversion ID

1. Log in to your [Google Ads account](https://ads.google.com)
2. Click on **Tools & Settings** (wrench icon) in the top right
3. Under **Measurement**, click **Conversions**
4. Click the **+** button to create a new conversion action
5. Select **Website** as the conversion source
6. Fill in the conversion details:
   - **Category**: Lead
   - **Conversion name**: "Lead Submission" (or your preferred name)
   - **Value**: Use the same value for each conversion (e.g., $0 or your lead value)
   - **Count**: One
   - **Click-through window**: 30 days (or your preference)
   - **View-through window**: 1 day (or your preference)
7. Click **Create and continue**
8. On the **Tag setup** page, select **Use Google Tag Manager** or **Install the tag yourself**
9. Copy your **Conversion ID** (format: `AW-XXXXXXXXX`) and **Conversion Label** (format: `AbCdEfGhIj`)

## 🔑 Step 2: Set Up Google Ads API Access

### 2.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google Ads API**:
   - Go to **APIs & Services** > **Library**
   - Search for "Google Ads API"
   - Click **Enable**

### 2.2 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3001` (for local development)
   - Your production domain (if needed)
5. Copy the **Client ID** and **Client Secret**

### 2.3 Get Developer Token

1. In Google Ads, go to **Tools & Settings** > **API Center**
2. Apply for a **Developer Token** (if you don't have one)
3. Once approved, copy your **Developer Token**

### 2.4 Get Customer ID

1. In Google Ads, look at the top of the page
2. Your **Customer ID** is displayed (format: `123-456-7890`)
3. Copy this ID

### 2.5 Get Conversion Action ID

1. Go to **Tools & Settings** > **Conversions**
2. Click on your conversion action
3. In the URL, you'll see something like: `.../conversionActions/123456789`
4. The number at the end is your **Conversion Action ID**

## 🔐 Step 3: Configure Environment Variables

### For Netlify (Production):

1. Go to your Netlify dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add the following variables:

```
GOOGLE_ADS_ID=AW-XXXXXXXXX
GOOGLE_ADS_CUSTOMER_ID=123-456-7890
GOOGLE_ADS_CONVERSION_ACTION_ID=123456789
GOOGLE_ADS_ACCESS_TOKEN=your_oauth_access_token
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
```

### For Local Development (.env file):

Add these to your `web/.env` file:

```
GOOGLE_ADS_ID=AW-XXXXXXXXX
GOOGLE_ADS_CUSTOMER_ID=123-456-7890
GOOGLE_ADS_CONVERSION_ACTION_ID=123456789
GOOGLE_ADS_ACCESS_TOKEN=your_oauth_access_token
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
```

## 📝 Step 4: Update Conversion Labels in Code

1. Open `web/index.html`
2. Find the line: `const googleAdsId = 'AW-XXXXXXXXX';`
3. Replace `AW-XXXXXXXXX` with your actual Google Ads Conversion ID

4. Open `web/src/lib/analytics.ts`
5. Find the `GOOGLE_ADS_CONVERSIONS` object
6. Replace the placeholder labels with your actual conversion labels:

```typescript
const GOOGLE_ADS_CONVERSIONS = {
  LEAD_SUBMIT: 'YOUR_LEAD_CONVERSION_LABEL', // Replace with your actual label
  FORM_START: 'YOUR_FORM_START_CONVERSION_LABEL', // Optional: Create separate conversion action
  OTP_VERIFIED: 'YOUR_OTP_VERIFIED_CONVERSION_LABEL', // Optional: Create separate conversion action
  PHONE_CLICK: 'YOUR_PHONE_CLICK_CONVERSION_LABEL', // Optional: Create separate conversion action
  EMAIL_CLICK: 'YOUR_EMAIL_CLICK_CONVERSION_LABEL', // Optional: Create separate conversion action
};
```

**Note**: You can use the same conversion label for all events, or create separate conversion actions for each event type for more detailed tracking.

## 🚀 Step 5: Test the Implementation

### Test Client-Side Tracking:

1. Open your website in a browser
2. Open Developer Tools (F12) > Console
3. Submit a form or trigger a conversion event
4. Look for Google Ads conversion events in the console
5. Check Google Ads > Tools & Settings > Conversions to see if conversions are being recorded

### Test Server-Side Tracking:

1. Check your Netlify function logs:
   - Go to Netlify dashboard > Functions > `google-ads-conversions`
   - Look for success/error messages
2. Check your server logs (if running locally)
3. Verify conversions appear in Google Ads within 24-48 hours

## 📊 Tracked Events

The following events are automatically tracked:

1. **Lead Submit** (`LEAD_SUBMIT`) - When a user successfully submits the enquiry form
2. **Form Start** (`FORM_START`) - When a user starts filling out the form
3. **OTP Verified** (`OTP_VERIFIED`) - When a user successfully verifies their phone number
4. **Phone Click** (`PHONE_CLICK`) - When a user clicks on a phone number
5. **Email Click** (`EMAIL_CLICK`) - When a user clicks on an email address

## 🔍 Troubleshooting

### Conversions Not Showing Up:

1. **Check environment variables**: Ensure all variables are set correctly in Netlify
2. **Verify conversion labels**: Make sure labels match exactly (case-sensitive)
3. **Check API access**: Ensure your OAuth token is valid and not expired
4. **Review logs**: Check Netlify function logs for error messages
5. **Wait time**: Conversions may take 24-48 hours to appear in Google Ads

### Common Errors:

- **"Google Ads Conversions API not configured"**: Environment variables are missing
- **"Authentication failed"**: OAuth token is invalid or expired
- **"Conversion action not found"**: Conversion Action ID is incorrect
- **"Customer ID not found"**: Customer ID format is incorrect (should be `123-456-7890`)

## 📚 Additional Resources

- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [Google Ads Conversion Tracking Guide](https://support.google.com/google-ads/answer/1727054)
- [Google Ads Conversions API](https://developers.google.com/google-ads/api/docs/conversions/upload-conversions)

## ⚠️ Important Notes

1. **OAuth Token Expiration**: OAuth tokens expire. You'll need to refresh them periodically or set up automatic token refresh.
2. **API Quotas**: Google Ads API has rate limits. Monitor your usage to avoid hitting limits.
3. **Privacy**: User data (email, phone) is hashed using SHA-256 before sending to Google Ads API.
4. **Testing**: Use Google Ads' test mode to verify conversions without affecting your actual campaign data.

## 🎯 Next Steps

1. Set up your Google Ads campaigns
2. Link your conversion actions to your campaigns
3. Monitor conversion performance in Google Ads dashboard
4. Optimize your campaigns based on conversion data

---

**Need Help?** If you encounter any issues, check the troubleshooting section above or refer to the Google Ads API documentation.

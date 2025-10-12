# Netlify Deployment Guide

## 🚀 Quick Deploy to Netlify

### Method 1: Connect Repository (Recommended)

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Initial commit - BeaverNorth Advisors website"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Use these build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `web/dist`
     - **Base directory**: `web`

### Method 2: Manual Deploy

1. **Build the project**
   ```bash
   cd web
   npm install
   npm run build
   ```

2. **Deploy dist folder**
   - Drag and drop the `web/dist` folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod --dir=web/dist`

## 🔧 Environment Variables Setup

In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TWILIO_ACCOUNT_SID=your_twilio_account_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token
VITE_TWILIO_SERVICE_SID=your_twilio_service_sid
VITE_TWILIO_FROM_NUMBER=+15551234567
```

## 📋 Build Settings

The `netlify.toml` file is already configured with:

- **Base directory**: `web`
- **Build command**: `npm run build`
- **Publish directory**: `web/dist`
- **Node version**: 18
- **Redirects**: SPA routing support

## 🔍 Troubleshooting

### Build Fails
- Ensure all environment variables are set
- Check Node.js version (18+ required)
- Verify all dependencies are in `web/package.json`

### OTP Not Working
- Verify Twilio credentials are correct
- Check Twilio phone number is verified
- Ensure Twilio Verify Service is active

### Database Issues
- Verify Supabase URL and keys
- Check RLS policies are disabled for leads table
- Ensure database tables exist

## 🚀 Post-Deployment

1. **Test the website**
   - Visit your Netlify URL
   - Test the contact form
   - Verify OTP functionality

2. **Custom Domain** (Optional)
   - Go to Domain settings in Netlify
   - Add your custom domain
   - Configure DNS records

3. **SSL Certificate**
   - Automatically provided by Netlify
   - HTTPS enabled by default

## 📞 Support

For deployment issues:
- Email: beavernorthadvisors@gmail.com
- Phone: (438) 763-5120

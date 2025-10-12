# BeaverNorth Advisors - Insurance Website

A comprehensive insurance advisory website built with React, TypeScript, and modern web technologies.

## 🚀 Features

- **Multi-step Contact Form** with OTP verification
- **Admin Dashboard** with lead management
- **SMS Verification** via Twilio
- **Database Integration** with Supabase
- **Multi-language Support** (English/French)
- **Responsive Design** for all devices
- **Privacy Policy** and legal compliance

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI Library**: Material-UI (MUI)
- **Animations**: Framer Motion
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **SMS Service**: Twilio Verify API
- **Styling**: CSS Variables, Material-UI

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Twilio account
- Supabase account

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BeaverNorth-Advisors
   ```

2. **Install dependencies**
   ```bash
   cd web
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your actual credentials
   ```

4. **Setup database**
   - Create a Supabase project
   - Run the SQL scripts from `SETUP_GUIDE.md`

5. **Run the application**
   ```bash
   npm run dev:full
   ```

## 📁 Project Structure

```
BeaverNorth-Advisors/
├── web/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and configs
│   │   └── assets/        # Images and static files
│   ├── server.js          # Express backend
│   └── package.json
├── SETUP_GUIDE.md         # Detailed setup instructions
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `web/` directory:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_SERVICE_SID=your_twilio_service_sid
VITE_TWILIO_FROM_NUMBER=+15551234567

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 📱 Features Overview

### Public Website
- Landing page with animations
- Multi-step contact form
- OTP verification via SMS
- About Us page
- Privacy Policy modal

### Admin Dashboard
- Lead management (CRUD operations)
- User authentication
- Activity logging
- Analytics and statistics
- Manual lead entry

### OTP Verification
- SMS-based verification via Twilio
- Support for multiple countries
- Secure verification process

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Deploy the `dist/` folder to your hosting provider
   - Set environment variables in your hosting platform
   - Ensure the backend server is running

## 📞 Support

For technical support or questions:
- Email: beavernorthadvisors@gmail.com
- Phone: (438) 763-5120

## 📄 License

This project is proprietary software for BeaverNorth Advisors.

## 🔒 Security

- All sensitive credentials are stored in environment variables
- Database access is secured with Row Level Security (RLS)
- OTP verification ensures phone number validation
- HTTPS encryption for all communications
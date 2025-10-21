#!/bin/bash

# Create .env file for Supabase configuration
echo "Creating .env file..."

cat > web/.env << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Twilio Configuration (Demo Mode)
VITE_TWILIO_ACCOUNT_SID=demo_account_sid
VITE_TWILIO_AUTH_TOKEN=demo_auth_token
VITE_TWILIO_SERVICE_SID=demo_service_sid
VITE_TWILIO_PHONE_NUMBER=demo_phone_number
VITE_TWILIO_IS_DEMO_MODE=true
EOF

echo "✅ .env file created successfully!"
echo "📁 Location: web/.env"
echo ""
echo "⚠️  SECURITY NOTICE: Replace placeholder values with your actual credentials"
echo "🔄 Please restart your development server:"
echo "1. Stop the current server (Ctrl+C)"
echo "2. Run: cd web && npm run dev:full"
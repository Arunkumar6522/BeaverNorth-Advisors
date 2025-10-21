#!/bin/bash

# Deploy Supabase Edge Functions
echo "🚀 Deploying Supabase Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase status &> /dev/null; then
    echo "❌ Please login to Supabase first:"
    echo "supabase login"
    exit 1
fi

# Deploy the testimonials function
echo "📦 Deploying testimonials function..."
supabase functions deploy testimonials

if [ $? -eq 0 ]; then
    echo "✅ Testimonials function deployed successfully!"
    echo ""
    echo "🔗 Function URL: https://your-project-ref.supabase.co/functions/v1/testimonials"
    echo ""
    echo "📝 Next steps:"
    echo "1. Run the SQL script to create the testimonials table"
    echo "2. Test the function endpoints"
    echo "3. Update your frontend to use the new API"
else
    echo "❌ Deployment failed!"
    exit 1
fi

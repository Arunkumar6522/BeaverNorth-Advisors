# 🔧 Automated RLS Fix - Instructions

## Step 1: Get Your Service Role Key

1. Go to: https://supabase.com/dashboard/project/dkaexqwgaslwfiuiqcml/settings/api
2. Scroll down to **"Project API keys"**
3. Find the **`service_role`** key (NOT the `anon` key)
4. Click **"Reveal"** and copy the key
5. It should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long)

⚠️ **IMPORTANT:** This is a SECRET key - don't share it publicly!

---

## Step 2: Run the Automated Script

### Option A: Set Environment Variable (Recommended)

```bash
# In your terminal, run:
export SUPABASE_SERVICE_ROLE_KEY="paste-your-service-role-key-here"
node fix-supabase-rls.js
```

### Option B: Edit the File Directly

1. Open `fix-supabase-rls.js`
2. Find line 13: `const SUPABASE_SERVICE_ROLE_KEY = ...`
3. Replace `YOUR_SERVICE_ROLE_KEY_HERE` with your actual key
4. Save the file
5. Run: `node fix-supabase-rls.js`

---

## Step 3: Test Your Form

After the script runs successfully:

1. Go to: https://beavernorth.netlify.app
2. Click **"Get Your Free Quote"**
3. Fill out the form
4. Click **"Submit Quote Request"**
5. ✅ It should work!

---

## Expected Output

```
🔧 Supabase RLS Fix Script
============================

🔗 Connecting to Supabase...
📡 URL: https://dkaexqwgaslwfiuiqcml.supabase.co
📝 Executing SQL: ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

📊 Response Status: 200

✅ SUCCESS! RLS has been disabled on leads table!
✅ Your form submissions should now work!
```

---

## Troubleshooting

### If you get "Service Role Key not provided"
- Make sure you copied the `service_role` key (not `anon` key)
- Make sure there are no extra spaces

### If you get a connection error
- Check your internet connection
- Verify the Supabase project URL is correct

### Still not working?
- Go manually to: https://supabase.com/dashboard/project/dkaexqwgaslwfiuiqcml/sql
- Paste: `ALTER TABLE leads DISABLE ROW LEVEL SECURITY;`
- Click Run

---

## 🔑 Where to Find Service Role Key

Screenshot location:
- Supabase Dashboard → Settings (gear icon) → API
- Under "Project API keys" section
- Look for "service_role" (secret)
- Click "Reveal" to see the key

---

## After Success

Once the script completes successfully, you can:
- Delete the service role key from the script (security)
- Test form submissions
- Check dashboard for new leads
- Everything should work! 🎉


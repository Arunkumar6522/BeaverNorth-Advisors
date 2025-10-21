# 🏢 BeaverNorth Advisors - Complete System Documentation

## 📋 **System Overview**

BeaverNorth Advisors is a comprehensive financial services website with an integrated admin dashboard for lead management, testimonials, and user authentication.

### 🎯 **Core Features**
- **Public Website**: Landing page, About Us, Services, Blog, Testimonials, Contact
- **Admin Dashboard**: Lead management, user authentication, analytics
- **OTP Verification**: SMS-based phone verification via Twilio
- **Multi-language Support**: English and French
- **Responsive Design**: Mobile-first approach

---

## 🏗️ **Architecture Overview**

### **Frontend Stack**
- **Framework**: React 19.1.1 with TypeScript
- **UI Library**: Material-UI (MUI) v7.3.4
- **Routing**: React Router DOM v7.9.3
- **Animations**: Framer Motion v12.23.22
- **Charts**: Recharts v3.2.1
- **Build Tool**: Vite v7.1.7

### **Backend Stack**
- **Server**: Express.js v5.1.0
- **Database**: Supabase (PostgreSQL)
- **SMS Service**: Twilio v5.10.2
- **Security**: Express Rate Limit, bcryptjs
- **Environment**: Node.js with ES Modules

### **Deployment**
- **Frontend**: Netlify (Static hosting)
- **Backend**: Node.js server (Port 3001)
- **Database**: Supabase Cloud

---

## 📁 **Project Structure**

```
BeaverNorth-Advisors/
├── web/                          # Main application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ContactModal.tsx     # Multi-step enquiry form
│   │   │   ├── DashboardLayout.tsx  # Admin dashboard wrapper
│   │   │   ├── LeadsManagement.tsx  # Lead CRUD operations
│   │   │   ├── TestimonialsManagement.tsx # Testimonials CRUD
│   │   │   ├── ProtectedRoute.tsx   # Authentication guard
│   │   │   └── ...
│   │   ├── pages/               # Route components
│   │   │   ├── Login.tsx            # Admin authentication
│   │   │   ├── NotFound.tsx         # 404 error page
│   │   │   ├── Testimonials.tsx     # Public testimonials
│   │   │   └── ...
│   │   ├── lib/                 # Core utilities
│   │   │   ├── custom-auth.ts       # Authentication system
│   │   │   └── supabase.ts          # Database client
│   │   ├── services/            # API services
│   │   │   ├── testimonialsAPI.ts   # Testimonials CRUD
│   │   │   └── twilioService.ts    # SMS service
│   │   └── hooks/               # Custom React hooks
│   │       └── useSessionRefresh.ts # Session management
│   ├── server.js                # Express server
│   └── package.json
├── supabase/                    # Database functions
│   └── functions/
│       └── testimonials/
│           └── index.ts        # Serverless testimonials API
├── sql/                        # Database schemas
│   └── setup.sql              # Main database setup
└── README.md                   # This file
```

---

## 🔌 **API Endpoints**

### **Public APIs**
| Endpoint | Method | Description | Rate Limit |
|----------|--------|-------------|------------|
| `/api/send-otp` | POST | Send SMS OTP | 5 req/15min |
| `/api/verify-otp` | POST | Verify OTP code | 5 req/15min |
| `/api/blog-posts` | GET | Fetch blog posts | 100 req/15min |
| `/api/health` | GET | Health check | 100 req/15min |

### **Protected APIs** (Require Authentication)
| Endpoint | Method | Description | Access Level |
|----------|--------|-------------|--------------|
| `/api/testimonials` | GET/POST/PUT/DELETE | Testimonials CRUD | Admin |
| `/api/leads` | GET/POST/PUT/DELETE | Leads management | Admin |
| `/api/users` | GET/POST/PUT/DELETE | User management | Admin |

---

## 🗄️ **Database Schema**

### **Core Tables**

#### **users** (Authentication)
```sql
- id: SERIAL PRIMARY KEY
- username: TEXT UNIQUE NOT NULL
- password_hash: TEXT NOT NULL (bcrypt)
- email: TEXT UNIQUE
- full_name: TEXT
- role: TEXT DEFAULT 'user'
- created_at: TIMESTAMP WITH TIME ZONE
- updated_at: TIMESTAMP WITH TIME ZONE
```

#### **leads** (Customer Enquiries)
```sql
- id: SERIAL PRIMARY KEY
- name: TEXT NOT NULL
- email: TEXT
- phone: TEXT
- province: TEXT
- service: TEXT
- gender: TEXT
- smoking_status: TEXT
- country_code: TEXT
- created_at: TIMESTAMP WITH TIME ZONE
- contacted_by: TEXT
- converted_by: TEXT
- created_by: TEXT
```

#### **testimonials** (Client Reviews)
```sql
- id: SERIAL PRIMARY KEY
- name: TEXT NOT NULL
- state: TEXT NOT NULL
- testimony: TEXT NOT NULL
- service: TEXT NOT NULL
- status: TEXT DEFAULT 'active' ('active'|'inactive')
- created_at: TIMESTAMP WITH TIME ZONE
- updated_at: TIMESTAMP WITH TIME ZONE
- created_by: TEXT
- updated_by: TEXT
```

#### **activity_log** (User Actions)
```sql
- id: SERIAL PRIMARY KEY
- user_id: TEXT NOT NULL
- action: TEXT NOT NULL
- table_name: TEXT
- record_id: TEXT
- old_values: JSONB
- new_values: JSONB
- ip_address: TEXT
- user_agent: TEXT
- created_at: TIMESTAMP WITH TIME ZONE
```

---

## 🔐 **Security Implementation**

### **Authentication System**
- **Session Management**: 24-hour expiration with auto-refresh
- **Password Security**: bcrypt hashing with salt
- **Token Generation**: Cryptographically secure random tokens
- **Session Storage**: Browser sessionStorage (cleared on logout)

### **API Security**
- **Rate Limiting**: 
  - OTP endpoints: 5 requests per 15 minutes
  - General APIs: 100 requests per 15 minutes
- **CORS**: Restricted to specific domains
- **Input Validation**: Comprehensive form validation
- **SQL Injection**: Protected by Supabase parameterized queries

### **Data Protection**
- **Row Level Security (RLS)**: Enabled on all tables
- **Environment Variables**: Sensitive data in .env files
- **HTTPS**: Enforced in production
- **Error Handling**: Generic error messages for users

---

## 🎨 **UI Components**

### **Public Components**
- **Nav**: Responsive navigation with scroll effects
- **Footer**: Links and privacy policy
- **ContactModal**: Multi-step enquiry form with OTP
- **PublicLayout**: Wrapper for public pages

### **Admin Components**
- **DashboardLayout**: Sidebar navigation and main content
- **LeadsManagement**: CRUD operations for leads
- **TestimonialsManagement**: CRUD operations for testimonials
- **ProtectedRoute**: Authentication guard
- **NotificationDropdown**: User notifications

### **Shared Components**
- **CountryCodeSelector**: Phone country code dropdown
- **PrivacyPolicyModal**: Privacy policy display
- **SuccessPage**: Form submission confirmation

---

## 🌐 **Routes & Navigation**

### **Public Routes** (No Authentication Required)
- `/` - Landing page
- `/about` - About Us page
- `/services` - Services page
- `/blog` - Blog listing
- `/blog/:postId` - Individual blog post
- `/testimonial` - Public testimonials
- `/contact` - Contact page
- `/login` - Admin login
- `/success` - Form success page

### **Protected Routes** (Authentication Required)
- `/dashboard` - Admin dashboard
- `/leads` - Leads management
- `/testimonials` - Testimonials management
- `/deleted` - Deleted leads
- `/logs` - Activity logs

### **Error Routes**
- `/*` - 404 Not Found page

---

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_SERVICE_SID=your_twilio_service_sid

# Server Configuration
PORT=3001
NODE_ENV=production
```

### **Build Configuration**
- **Frontend**: Vite build to `dist/` folder
- **Backend**: Node.js server with Express
- **Database**: Supabase cloud PostgreSQL

---

## 🚀 **Deployment**

### **Development**
```bash
cd web
npm install
npm run dev:full  # Starts both frontend and backend
```

### **Production**
```bash
cd web
npm run build
npm start
```

### **Netlify Deployment**
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**: Set in Netlify dashboard

---

## 📊 **Features Summary**

### **Public Website Features**
- ✅ Responsive landing page with animations
- ✅ Multi-step contact form with OTP verification
- ✅ About Us page with company information
- ✅ Services page with insurance offerings
- ✅ Blog integration with Blogger RSS feed
- ✅ Public testimonials display
- ✅ Contact page with form and information
- ✅ Multi-language support (EN/FR)
- ✅ Privacy policy modal

### **Admin Dashboard Features**
- ✅ User authentication with session management
- ✅ Lead management (CRUD operations)
- ✅ Testimonials management (CRUD operations)
- ✅ Activity logging and audit trail
- ✅ Analytics and statistics
- ✅ Manual lead entry
- ✅ User activity tracking
- ✅ Responsive sidebar navigation
- ✅ Protected routes with authentication

### **Security Features**
- ✅ Password hashing with bcrypt
- ✅ Session management with expiration
- ✅ Rate limiting on API endpoints
- ✅ CORS security configuration
- ✅ Input validation and sanitization
- ✅ Row Level Security (RLS) on database
- ✅ Environment variable protection
- ✅ Error handling and logging

---

## 🔄 **Recent Security Updates**

### **Critical Fixes Applied**
1. ✅ **Removed hardcoded credentials** from repository
2. ✅ **Implemented bcrypt password hashing**
3. ✅ **Added cryptographically secure token generation**
4. ✅ **Implemented rate limiting** on API endpoints
5. ✅ **Restricted CORS** to specific domains
6. ✅ **Removed debug endpoints** and sensitive information
7. ✅ **Cleaned up unnecessary files** and optimized codebase

### **Security Rating**: 🟢 **SECURE** (All critical vulnerabilities addressed)

---

## 📞 **Support & Maintenance**

### **Technical Support**
- **Email**: beavernorthadvisors@gmail.com
- **Phone**: (438) 763-5120

### **Maintenance Tasks**
- Regular security updates
- Database backup and monitoring
- Performance optimization
- Feature enhancements
- Bug fixes and patches

---

## 📄 **License**

This project is proprietary software for BeaverNorth Advisors. All rights reserved.

---

*Last Updated: $(date)*
*Version: 2.0.0*
*Security Status: ✅ SECURE*

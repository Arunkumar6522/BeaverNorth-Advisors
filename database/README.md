# 📁 Database Scripts - BeaverNorth Advisors

## 📋 **Folder Structure**

```
database/
├── setup/           # Initial database setup
├── users/           # User management scripts
├── security/        # Security and RLS policies
├── maintenance/     # Maintenance and health checks
└── backup/         # Backup and export scripts
```

## 🚀 **Quick Start Guide**

### **1. Initial Setup (Run First)**
```sql
-- Run in Supabase SQL Editor
database/setup/01_initial_setup.sql
```

### **2. Create Users**
```sql
-- Run in Supabase SQL Editor
database/users/01_create_all_users.sql
```

### **3. Verify Setup**
```sql
-- Run in Supabase SQL Editor
database/maintenance/02_verify_database_health.sql
```

## 📁 **Setup Folder**

| File | Purpose | When to Use |
|------|---------|-------------|
| `01_initial_setup.sql` | Create users table, RLS, indexes | First time setup |

## 👥 **Users Folder**

| File | Purpose | When to Use |
|------|---------|-------------|
| `01_create_all_users.sql` | Create all 3 users (Ayyappa, Shini, Arun) | After initial setup |
| `02_add_new_user.sql` | Add a new user | When adding new users |
| `03_update_user_password.sql` | Update user password | When changing passwords |
| `04_delete_user.sql` | Delete user | When removing users |
| `05_list_all_users.sql` | View all users | For checking user data |

## 🔒 **Security Folder**

| File | Purpose | When to Use |
|------|---------|-------------|
| `01_setup_rls_policies.sql` | Set up Row Level Security | After table creation |
| `02_create_secure_login_function.sql` | Create secure login function | For advanced security |

## 🔧 **Maintenance Folder**

| File | Purpose | When to Use |
|------|---------|-------------|
| `01_reset_users_table.sql` | Complete table reset | When starting fresh |
| `02_verify_database_health.sql` | Check database health | Regular maintenance |

## 💾 **Backup Folder**

| File | Purpose | When to Use |
|------|---------|-------------|
| `01_backup_users_data.sql` | Export user data | Before maintenance |

## 👤 **User Credentials**

### **Ayyappa**
- Username: `ayyappa`
- Email: `ayyappa.research@gmail.com`
- Password: `9211027`

### **Shini**
- Username: `shini`
- Email: `shantoshini@gmail.com`
- Password: `7635120`

### **Arun**
- Username: `arun`
- Email: `arunkumark1664@gmail.com`
- Password: `7299981628`

## 🔐 **Login Methods**

Each user can login using **EITHER**:
- **Username** + Password
- **Email** + Password

## 📋 **Common Tasks**

### **Add New User**
1. Edit `database/users/02_add_new_user.sql`
2. Replace placeholder values
3. Run in Supabase SQL Editor

### **Change Password**
1. Edit `database/users/03_update_user_password.sql`
2. Replace username and new password
3. Run in Supabase SQL Editor

### **Delete User**
1. Edit `database/users/04_delete_user.sql`
2. Replace username/email to delete
3. Run in Supabase SQL Editor

### **Reset Everything**
1. Run `database/maintenance/01_reset_users_table.sql`
2. Run `database/users/01_create_all_users.sql`

## ⚠️ **Important Notes**

- **Always backup** before running maintenance scripts
- **Test in development** before production
- **Passwords are hashed** with bcrypt
- **RLS policies** protect sensitive data
- **Run scripts in order** for proper setup

## 🧪 **Testing**

After running scripts, test login with:
- Any username + password combination
- Any email + password combination
- Password eye button should work perfectly

## 📞 **Support**

If you encounter issues:
1. Check the maintenance scripts for diagnostics
2. Verify RLS policies are correct
3. Ensure passwords are properly hashed
4. Check Supabase logs for errors

**All scripts are ready to use! Just copy and paste into Supabase SQL Editor.** 🚀

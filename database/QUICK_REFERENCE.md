# 🚀 QUICK REFERENCE - Database Scripts

## 📋 **Most Common Tasks**

### **🆕 First Time Setup**
```sql
-- 1. Run initial setup
database/setup/01_initial_setup.sql

-- 2. Create all users
database/users/01_create_all_users.sql

-- 3. Verify everything works
database/maintenance/02_verify_database_health.sql
```

### **➕ Add New User**
```sql
-- Edit and run:
database/users/02_add_new_user.sql
-- Replace: new_username, new_password, new_email@example.com, New User Full Name
```

### **🔑 Change Password**
```sql
-- Edit and run:
database/users/03_update_user_password.sql
-- Replace: username_to_update, new_password
```

### **🗑️ Delete User**
```sql
-- Edit and run:
database/users/04_delete_user.sql
-- Replace: username_to_delete or email_to_delete@example.com
```

### **🔄 Reset Everything**
```sql
-- 1. Complete reset
database/maintenance/01_reset_users_table.sql

-- 2. Recreate users
database/users/01_create_all_users.sql
```

## 👥 **Current Users**

| Username | Email | Password |
|----------|-------|----------|
| ayyappa | ayyappa.research@gmail.com | 9211027 |
| shini | shantoshini@gmail.com | 7635120 |
| arun | arunkumark1664@gmail.com | 7299981628 |

## 🔍 **Check Users**
```sql
-- View all users:
database/users/05_list_all_users.sql

-- Backup data:
database/backup/01_backup_users_data.sql
```

## ⚡ **Quick Commands**

### **Test Login Function**
```sql
SELECT * FROM secure_user_login('ayyappa', '9211027', '127.0.0.1');
```

### **Check Table Structure**
```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users';
```

### **Verify RLS**
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';
```

## 🎯 **File Locations**

- **Setup**: `database/setup/`
- **Users**: `database/users/`
- **Security**: `database/security/`
- **Maintenance**: `database/maintenance/`
- **Backup**: `database/backup/`

**All scripts are organized and ready to use!** 📁✨

# MongoDB Setup Guide for BOSE

## ✅ What's Been Completed

### Phase 1: Setup & Configuration
- ✅ Installed `mongoose` and `express-validator` packages
- ✅ Created `.env` file with MongoDB Atlas connection string
- ✅ Created `.env.example` template file
- ✅ Created `backend/config/database.js` - MongoDB connection service

### Phase 2: Database Architecture
- ✅ Created 8 complete Mongoose models with validation, indexes, and methods:
  1. **User** - Authentication, roles (student, employer, institution, verifier, auditor, admin)
  2. **Credential** - Academic/professional credentials with blockchain integration
  3. **Organization** - Universities and companies
  4. **Job** - Job postings with application tracking
  5. **Application** - Job applications with timeline and status
  6. **Message** - Messaging system between users
  7. **Notification** - Notification system
  8. **Profile** - Extended user profiles with education, experience, skills

### Phase 3: Database Seeding
- ✅ Created comprehensive seed data files:
  - `backend/seeders/data/users.seed.js` - 27 users across all roles
  - `backend/seeders/data/organizations.seed.js` - 10 organizations (5 universities, 5 companies)
  - `backend/seeders/data/credentials.seed.js` - 12 credentials (10 verified, 2 pending)
  - `backend/seeders/data/jobs.seed.js` - 9 job postings
  - `backend/seeders/data/applications.seed.js` - 7 applications with various statuses
  - `backend/seeders/data/profiles.seed.js` - 4 detailed student profiles
  - `backend/seeders/data/messages.seed.js` - 10 messages
  - `backend/seeders/data/notifications.seed.js` - 18 notifications

- ✅ Created seeder scripts:
  - `backend/seeders/seedDatabase.js` - Main seeder with relationship mapping
  - `backend/seeders/clearDatabase.js` - Database clearing utility
  - `backend/seeders/README.md` - Complete documentation

- ✅ Updated `package.json` with npm scripts:
  - `npm run seed` - Populate database
  - `npm run seed:clear` - Clear database

- ✅ Updated `backend/server.js` to connect to MongoDB on startup

---

## ⚠️ Current Issue: MongoDB Atlas Connection

The seeder and server cannot connect to MongoDB Atlas due to network/IP whitelisting issues.

### Error Message:
```
MongooseServerSelectionError: Server selection timed out after 5000 ms
Could not connect to any servers in your MongoDB Atlas cluster
```

### Possible Causes:

1. **IP Not Whitelisted** - Your current IP address is not in the MongoDB Atlas Network Access list
2. **Firewall Blocking** - Windows Firewall or antivirus blocking outbound connections on port 27017
3. **Network Restrictions** - ISP or corporate network blocking MongoDB Atlas connections
4. **Cluster Not Ready** - MongoDB Atlas cluster might be paused or not fully provisioned

---

## 🔧 Troubleshooting Steps

### Option 1: Verify MongoDB Atlas Network Access (Recommended)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in with your account
3. Select your cluster: **Cluster0** (cluster0.m5ycvuo.mongodb.net)
4. Click **"Network Access"** in the left sidebar
5. Verify that `0.0.0.0/0` is listed and shows **"ACTIVE"** status (not "PENDING")
6. If it shows "PENDING", wait 2-5 minutes for it to propagate
7. If it's not there, click **"Add IP Address"** → **"Allow Access from Anywhere"** → Enter `0.0.0.0/0`

### Option 2: Check Database User Credentials

1. In MongoDB Atlas, click **"Database Access"** in the left sidebar
2. Verify user **"admin"** exists
3. If password is incorrect, click **"Edit"** → **"Edit Password"** → Set new password
4. Update `.env` file with new password:
   ```env
   MONGODB_URI=mongodb+srv://admin:NEW_PASSWORD@cluster0.m5ycvuo.mongodb.net/bose_db?retryWrites=true&w=majority&appName=Cluster0
   ```

### Option 3: Test Connection with MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Open Compass and paste your connection string:
   ```
   mongodb+srv://admin:mainproject@cluster0.m5ycvuo.mongodb.net/
   ```
3. Click **"Connect"**
4. If Compass connects successfully, the issue is in the Node.js code
5. If Compass fails, the issue is with Atlas configuration or network

### Option 4: Check Windows Firewall

1. Open **Windows Defender Firewall**
2. Click **"Allow an app through firewall"**
3. Find **Node.js** in the list
4. Ensure both **Private** and **Public** are checked
5. If Node.js is not listed, click **"Allow another app"** and add it

### Option 5: Try Different Network

1. Disconnect from current network
2. Connect to mobile hotspot or different WiFi
3. Run `npm run seed` again
4. If it works, your original network is blocking MongoDB Atlas

### Option 6: Check Cluster Status

1. In MongoDB Atlas, go to **"Database"** → **"Clusters"**
2. Verify **Cluster0** shows **"Active"** status (not "Paused")
3. If paused, click **"Resume"**
4. Wait for cluster to become active

---

## 🚀 Once Connected: Running the Seeder

After resolving the connection issue:

### 1. Seed the Database

```bash
npm run seed
```

This will:
- Connect to MongoDB Atlas
- Clear all existing data
- Create 27 users, 10 organizations, 12 credentials, 9 jobs, 7 applications, 4 profiles, 10 messages, 18 notifications
- Link all relationships properly
- Display a summary

### 2. Start the Server

```bash
npm run server
```

The server will:
- Connect to MongoDB on startup
- Load all data from database
- Be ready to handle API requests

### 3. Test Login

Use these credentials to test:

**Admin:**
- Email: `admin@bose.edu`
- Password: `password123`

**Student:**
- Email: `alice.johnson@student.edu`
- Password: `password123`

**Recruiter:**
- Email: `hr@google.com`
- Password: `password123`

**Institution:**
- Email: `registrar@mit.edu`
- Password: `password123`

---

## 📊 Database Schema Overview

### Collections

1. **users** - All user accounts (students, recruiters, institutions, admins, verifiers, auditors)
2. **organizations** - Universities and companies
3. **credentials** - Academic and professional credentials with blockchain integration
4. **jobs** - Job postings from recruiters
5. **applications** - Job applications linking candidates to jobs
6. **profiles** - Extended user profiles with education, experience, skills
7. **messages** - Messages between users
8. **notifications** - System and user notifications

### Key Relationships

```
User ──┬── Profile (1:1)
       ├── Organization (N:1)
       ├── Credentials (1:N) as owner
       ├── Credentials (1:N) as issuer
       ├── Jobs (1:N) as employer
       ├── Applications (1:N) as candidate
       ├── Messages (1:N) as sender/recipient
       └── Notifications (1:N)

Organization ──┬── Users (1:N)
               ├── Credentials (1:N) as institution
               └── Jobs (1:N)

Job ──┬── Applications (1:N)
      └── Organization (N:1)

Application ──┬── Job (N:1)
              ├── User (N:1) as candidate
              └── Credentials (N:M) attached
```

---

## 🔄 Alternative: Use Local MongoDB

If MongoDB Atlas continues to have issues, you can use local MongoDB:

### 1. Install MongoDB Community Server

Download from: https://www.mongodb.com/try/download/community

### 2. Update `.env`

```env
MONGODB_URI=mongodb://localhost:27017/bose_db
```

### 3. Start MongoDB Service

```bash
# Windows
net start MongoDB

# Or use MongoDB Compass to start it
```

### 4. Run Seeder

```bash
npm run seed
```

---

## 📝 Next Steps After Seeding

Once the database is populated:

1. **Update Routes** - Modify backend routes to use MongoDB models instead of mock data
2. **Test API Endpoints** - Verify all CRUD operations work with real database
3. **Implement Search** - Add MongoDB queries for filtering and searching
4. **Add Pagination** - Implement pagination for large datasets
5. **Optimize Queries** - Add indexes and optimize database queries
6. **Integrate Blockchain** - Connect credential verification to Hyperledger Fabric

---

## 🆘 Getting Help

If you continue to have connection issues:

1. **Check MongoDB Atlas Status**: https://status.mongodb.com/
2. **MongoDB Community Forums**: https://www.mongodb.com/community/forums/
3. **Contact MongoDB Support**: If you have a paid tier

---

## 📚 Resources

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Connection String Format](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [Network Access Configuration](https://www.mongodb.com/docs/atlas/security/ip-access-list/)

---

**Created:** January 2024  
**Last Updated:** January 2024  
**Status:** Ready for deployment once MongoDB connection is established


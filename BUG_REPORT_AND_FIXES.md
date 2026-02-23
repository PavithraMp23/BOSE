# 🐛 BOSE System Audit - Bug Report & Missing Features

**Date:** 2024-01-03  
**Status:** Critical Issues Found  
**Priority:** HIGH - System will not work properly without these fixes

---

## 🚨 **CRITICAL ISSUES (Must Fix Immediately)**

### **1. Authentication Routes Still Using Mock Data** ⚠️ **BLOCKER**

**File:** `backend/routes/auth.js`

**Problem:**
- Login endpoint uses hardcoded `mockUsers` object instead of MongoDB
- Password validation is disabled (`validPassword = true`)
- `/me` endpoint queries mock users instead of database
- New MongoDB seeded accounts (alice.johnson@student.edu, hr@google.com, etc.) **WILL NOT WORK**

**Impact:** 🔴 **CRITICAL**
- Users cannot log in with MongoDB seeded accounts
- All demo accounts on login page will fail
- Authentication is completely broken for real database

**Current Code (Lines 16-95):**
```javascript
const mockUsers = {
  'student@example.com': { ... },
  'employer@org1.com': { ... },
  // ... hardcoded users
};

router.post('/login', async (req, res) => {
  const user = mockUsers[email]; // ❌ Uses mock data
  const validPassword = true; // ❌ Password check disabled
});
```

**Fix Required:**
```javascript
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Query MongoDB instead of mock data
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Use bcrypt to verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT with MongoDB user data
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        organization: user.organizationId
      },
      process.env.JWT_SECRET || 'insecure-demo-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organizationId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

**Also Fix `/me` Endpoint (Lines 131-159):**
```javascript
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'insecure-demo-secret';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Query MongoDB instead of mock users
    const user = await User.findById(decoded.userId).lean();
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organizationId
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

---

### **2. Jobs Routes Using Mock Data** ⚠️ **HIGH PRIORITY**

**File:** `backend/routes/jobs.js`

**Problem:**
- All job endpoints use in-memory array instead of MongoDB
- Seeded jobs (9 jobs from Google, Microsoft, Amazon, etc.) are not accessible
- Recruiters cannot see their posted jobs
- Students cannot browse available jobs

**Impact:** 🔴 **HIGH**
- Job posting feature completely broken
- Recruiter dashboard will show wrong data
- Student job search will not work

**Current Code:**
```javascript
let jobs = [
  { id: uuid(), title: 'Senior React Engineer', ... }, // ❌ Mock data
];

router.get('/my', (req, res) => {
  res.json(jobs); // ❌ Returns mock array
});
```

**Fix Required:**
```javascript
import { Job } from '../models/index.js';

router.get('/my', async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    // Get jobs posted by this recruiter
    const jobs = await Job.find({ employerId: userId })
      .populate('companyId', 'name logo')
      .sort({ postedDate: -1 })
      .lean();
    
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { title, description, location, status, ...rest } = req.body;
    
    const job = await Job.create({
      jobId: `JOB-${Date.now()}`,
      title,
      description,
      location,
      status: status || 'draft',
      employerId: userId,
      ...rest
    });
    
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});
```

---

### **3. Applications Routes Using Mock Data** ⚠️ **HIGH PRIORITY**

**File:** `backend/routes/applications.js`

**Problem:**
- Uses hardcoded applications array
- Seeded applications (7 applications with various statuses) not accessible
- Students cannot apply to jobs
- Recruiters cannot see applications

**Impact:** 🔴 **HIGH**
- Job application feature broken
- Student dashboard will be empty
- Recruiter cannot review candidates

**Fix Required:**
```javascript
import { Application } from '../models/index.js';

router.get('/my', async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    const applications = await Application.find({ candidateId: userId })
      .populate('jobId', 'title company location')
      .sort({ appliedDate: -1 })
      .lean();
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.post('/apply/:jobId', async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { jobId } = req.params;
    
    // Check if already applied
    const existing = await Application.findOne({ 
      candidateId: userId, 
      jobId 
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }
    
    const application = await Application.create({
      applicationId: `APP-${Date.now()}`,
      jobId,
      candidateId: userId,
      status: 'submitted',
      appliedDate: new Date(),
      timeline: [{
        status: 'submitted',
        date: new Date(),
        note: 'Application submitted'
      }]
    });
    
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
});
```

---

### **4. Messages Routes Using Mock Data** ⚠️ **MEDIUM PRIORITY**

**File:** `backend/routes/messages.js`

**Problem:**
- Uses hardcoded conversations object
- Seeded messages (10 messages between recruiters and students) not accessible

**Fix Required:**
```javascript
import { Message } from '../models/index.js';

router.get('/:candidateId', async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { candidateId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId: candidateId },
        { senderId: candidateId, recipientId: userId }
      ]
    })
    .populate('senderId', 'name email')
    .populate('recipientId', 'name email')
    .sort({ sentAt: 1 })
    .lean();
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});
```

---

### **5. Notifications Routes Using Mock Data** ⚠️ **MEDIUM PRIORITY**

**File:** `backend/routes/notifications.js`

**Problem:**
- Uses hardcoded notifications array
- Seeded notifications (18 notifications) not accessible

**Fix Required:**
```javascript
import { Notification } from '../models/index.js';

router.get('/', async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.post('/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: new Date() }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});
```

---

## ⚠️ **MEDIUM PRIORITY ISSUES**

### **6. Missing Public Jobs Endpoint**

**Problem:**
- Frontend calls `/api/public/jobs` (see `src/modules/candidate/hooks/useJobs.ts:13`)
- This endpoint doesn't exist in backend
- Students cannot browse jobs without authentication

**Fix Required:**
Add to `backend/routes/jobs.js`:
```javascript
// Public endpoint for browsing jobs (no auth required)
router.get('/public', async (req, res) => {
  try {
    const { status = 'active', limit = 50 } = req.query;
    
    const jobs = await Job.find({ status })
      .populate('companyId', 'name logo')
      .populate('employerId', 'name')
      .sort({ postedDate: -1 })
      .limit(parseInt(limit))
      .lean();
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});
```

Then update `backend/server.js` to allow public access:
```javascript
// Public routes (no authentication)
app.use('/api/public/jobs', jobsRoutes); // Add this BEFORE authenticated routes

// Authenticated routes
app.use('/api/jobs', authenticateToken, jobsRoutes);
```

---

### **7. Credentials Route Partially Fixed**

**Status:** ✅ **PARTIALLY WORKING**

**File:** `backend/routes/credentials.js`

**Good News:**
- Lines 18-30: `/my` endpoint already uses MongoDB ✅
- Lines 33-100: `/upload` endpoint already uses MongoDB ✅

**Potential Issues:**
- Missing GET all credentials endpoint
- Missing GET by ID endpoint
- Missing verify/revoke endpoints

---

## 📝 **MINOR ISSUES & IMPROVEMENTS**

### **8. JWT Token Field Mismatch**

**Problem:**
- Auth route creates token with `userId` field
- Middleware expects `userId` or `id`
- Some routes check `req.user?.userId`, others check `req.user?.id`

**Fix:** Standardize to always use `userId` in JWT payload

---

### **9. Missing Error Handling**

**Problem:**
- Many routes don't have try-catch blocks
- Errors will crash the server

**Fix:** Add error handling to all routes (already shown in fixes above)

---

### **10. Missing Route: Get Organizations**

**Problem:**
- Auth route has `/organizations` endpoint with mock data (lines 162-186)
- Should query MongoDB Organization model

**Fix:**
```javascript
import { Organization } from '../models/index.js';

router.get('/organizations', async (req, res) => {
  try {
    const orgs = await Organization.find({ isApproved: true })
      .select('organizationId name type mspId description logo')
      .lean();
    
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});
```

---

## 🎯 **SUMMARY & ACTION PLAN**

### **Files That MUST Be Updated:**

1. ✅ **`backend/routes/auth.js`** - CRITICAL (login broken)
2. ✅ **`backend/routes/jobs.js`** - HIGH (jobs feature broken)
3. ✅ **`backend/routes/applications.js`** - HIGH (applications broken)
4. ✅ **`backend/routes/messages.js`** - MEDIUM
5. ✅ **`backend/routes/notifications.js`** - MEDIUM

### **Files Already Working:**

- ✅ `backend/routes/credentials.js` - Partially working (needs more endpoints)
- ✅ `backend/models/*` - All models are correct
- ✅ `backend/config/database.js` - Working
- ✅ Database seeding - Working

### **Estimated Fix Time:**

- Auth routes: 15 minutes
- Jobs routes: 20 minutes
- Applications routes: 15 minutes
- Messages routes: 10 minutes
- Notifications routes: 10 minutes
- **Total: ~70 minutes**

---

## 🚀 **RECOMMENDED FIX ORDER:**

1. **Fix Auth Routes First** (BLOCKER - nothing works without this)
2. **Fix Jobs Routes** (Core feature)
3. **Fix Applications Routes** (Core feature)
4. **Fix Messages Routes** (Nice to have)
5. **Fix Notifications Routes** (Nice to have)
6. **Test Everything** (Login → Browse Jobs → Apply → Check Messages)

---

**Would you like me to implement these fixes now?**


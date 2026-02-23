# Frontend MongoDB Integration Guide

## ✅ **What's Already Done**

### 1. Login Page Updated
- ✅ Updated demo accounts to use MongoDB seeded credentials
- ✅ Changed password from `demo` to `password123`
- ✅ Added 6 role-based demo accounts (Student, Recruiter, Institution, Admin, Verifier, Auditor)
- ✅ Improved UI to show account details and descriptions
- ✅ Fixed role-based redirects after login

### 2. Demo Accounts Available

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Student** | `alice.johnson@student.edu` | `password123` | Has 2 verified credentials |
| **Recruiter** | `hr@google.com` | `password123` | Posted 3 active jobs (Google) |
| **Institution** | `registrar@mit.edu` | `password123` | Issued 2 credentials (MIT) |
| **Admin** | `admin@bose.edu` | `password123` | Full system access |
| **Verifier** | `verifier@bose.edu` | `password123` | Verify credentials |
| **Auditor** | `michael.auditor@gov.edu` | `password123` | Audit system activities |

---

## 🔧 **What Needs to Be Done**

### **Phase 1: Backend API Routes (Update to Use MongoDB)**

Currently, the backend routes use **mock data**. They need to be updated to use **MongoDB models**.

#### **Files to Update:**

1. **`backend/routes/auth.js`** - Authentication routes
   - ✅ Already uses MongoDB User model (if implemented)
   - Update login to query MongoDB instead of mock users
   - Update registration to create MongoDB documents

2. **`backend/routes/credentials.js`** - Credential management
   - Replace mock credential data with `Credential.find()`, `Credential.create()`, etc.
   - Update blockchain integration to save `blockchainTxId` and `dataHash` to MongoDB

3. **`backend/routes/jobs.js`** - Job postings
   - Replace mock job data with `Job.find()`, `Job.create()`, etc.
   - Update job application logic to use `Application` model

4. **`backend/routes/applications.js`** - Job applications
   - Replace mock application data with `Application.find()`, `Application.create()`, etc.
   - Update timeline tracking in MongoDB

5. **`backend/routes/messages.js`** - Messaging system
   - Replace mock message data with `Message.find()`, `Message.create()`, etc.

6. **`backend/routes/notifications.js`** - Notifications
   - Replace mock notification data with `Notification.find()`, `Notification.create()`, etc.

7. **`backend/routes/organizations.js`** - Organizations
   - Replace mock organization data with `Organization.find()`, `Organization.create()`, etc.

8. **`backend/routes/profiles.js`** - User profiles
   - Replace mock profile data with `Profile.find()`, `Profile.create()`, etc.

---

### **Phase 2: Frontend API Integration**

The frontend already makes API calls to the backend. Once the backend routes are updated to use MongoDB, the frontend will automatically work with real data.

#### **No Frontend Changes Needed (Mostly)**

The frontend uses:
- `src/lib/api.ts` - Axios instance for API calls
- `src/contexts/AuthContext.tsx` - Authentication context
- Various page components that call backend APIs

These will continue to work as-is once backend routes use MongoDB.

#### **Potential Frontend Updates:**

1. **Update Type Definitions** (if MongoDB schema differs from mock data)
   - Check `src/types/` for TypeScript interfaces
   - Ensure they match MongoDB model schemas

2. **Update Data Transformations** (if needed)
   - MongoDB returns `_id` instead of `id`
   - May need to transform responses in API calls

3. **Add Loading States** (for better UX)
   - Real database queries take longer than mock data
   - Add skeleton loaders and loading indicators

---

### **Phase 3: Testing & Validation**

1. **Test Each Role's Dashboard**
   - Login as each demo account
   - Verify data loads correctly
   - Test CRUD operations (Create, Read, Update, Delete)

2. **Test Relationships**
   - Verify credentials show correct student and institution
   - Verify jobs show correct company and recruiter
   - Verify applications link to correct jobs and candidates

3. **Test Real-Time Features**
   - WebSocket notifications
   - Message updates
   - Application status changes

---

## 📋 **Step-by-Step Integration Checklist**

### **Step 1: Seed the Database** ✅ (Partially Done)

```bash
npm run seed
```

**Status:** Connection issues - need to resolve MongoDB Atlas connectivity

---

### **Step 2: Update Backend Auth Routes**

**File:** `backend/routes/auth.js`

**Current:** Uses mock users array
**Target:** Use MongoDB User model

**Example Changes:**

```javascript
// BEFORE (Mock Data)
const users = [
  { id: '1', email: 'student@example.com', password: 'demo', role: 'student' }
];

router.post('/login', (req, res) => {
  const user = users.find(u => u.email === req.body.email);
  // ...
});

// AFTER (MongoDB)
import { User } from '../models/index.js';

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await user.comparePassword(req.body.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organizationId
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});
```

---

### **Step 3: Update Backend Credential Routes**

**File:** `backend/routes/credentials.js`

**Example Changes:**

```javascript
// BEFORE (Mock Data)
router.get('/credentials', (req, res) => {
  res.json(mockCredentials);
});

// AFTER (MongoDB)
import { Credential } from '../models/index.js';

router.get('/credentials', async (req, res) => {
  try {
    const { userId, status, type } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;
    if (type) query.type = type;
    
    const credentials = await Credential.find(query)
      .populate('userId', 'name email')
      .populate('issuerId', 'name email')
      .populate('institutionId', 'name type')
      .sort({ createdAt: -1 });
    
    res.json(credentials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
});

router.post('/credentials', async (req, res) => {
  try {
    const credential = await Credential.create({
      ...req.body,
      userId: req.user.id, // From JWT middleware
      status: 'pending'
    });
    
    res.status(201).json(credential);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create credential' });
  }
});
```

---

### **Step 4: Update Backend Job Routes**

**File:** `backend/routes/jobs.js`

**Example Changes:**

```javascript
import { Job, Application } from '../models/index.js';

router.get('/jobs', async (req, res) => {
  try {
    const { status, companyId, employerId } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (companyId) query.companyId = companyId;
    if (employerId) query.employerId = employerId;
    
    const jobs = await Job.find(query)
      .populate('companyId', 'name logo')
      .populate('employerId', 'name email')
      .sort({ postedDate: -1 });
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      employerId: req.user.id,
      status: 'active'
    });
    
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});
```

---

### **Step 5: Update Frontend Type Definitions (If Needed)**

**File:** `src/types/index.ts` (or similar)

Ensure TypeScript interfaces match MongoDB schemas:

```typescript
export interface User {
  _id: string; // MongoDB uses _id, not id
  userId: string;
  email: string;
  name: string;
  role: 'student' | 'employer' | 'institution' | 'verifier' | 'auditor' | 'admin';
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Credential {
  _id: string;
  credentialId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  type: string;
  title: string;
  institution: string;
  issuer: string;
  issuerId: string;
  status: 'pending' | 'issued' | 'verified' | 'revoked' | 'expired';
  blockchainTxId?: string;
  dataHash: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### **Step 6: Add API Response Transformers (If Needed)**

If you need to transform MongoDB `_id` to `id` for frontend compatibility:

**File:** `src/lib/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002',
});

// Transform MongoDB _id to id
api.interceptors.response.use((response) => {
  if (response.data) {
    if (Array.isArray(response.data)) {
      response.data = response.data.map(item => ({
        ...item,
        id: item._id || item.id
      }));
    } else if (response.data._id) {
      response.data.id = response.data._id;
    }
  }
  return response;
});

export default api;
```

---

## 🎯 **Priority Order**

1. **✅ Fix MongoDB Connection** (HIGHEST PRIORITY)
   - Resolve Atlas connectivity issues
   - OR switch to local MongoDB

2. **Update Auth Routes** (CRITICAL)
   - Login must work with MongoDB User model
   - Without this, users can't log in

3. **Update Credential Routes** (HIGH)
   - Core feature of the platform
   - Students need to see their credentials

4. **Update Job & Application Routes** (HIGH)
   - Recruiters need to post jobs
   - Students need to apply

5. **Update Message & Notification Routes** (MEDIUM)
   - Important for UX but not critical for MVP

6. **Update Profile & Organization Routes** (LOW)
   - Nice to have, can use seeded data initially

---

## 🚀 **Quick Start After MongoDB Connection**

Once MongoDB is connected and seeded:

1. **Start Backend:**
   ```bash
   npm run server
   ```

2. **Start Frontend:**
   ```bash
   npm run client
   ```

3. **Test Login:**
   - Go to http://localhost:5173/login
   - Click any demo account
   - Click "Sign In"
   - Should redirect to role-specific dashboard

4. **Verify Data:**
   - Check if credentials, jobs, applications load
   - If they don't, backend routes need updating

---

## 📚 **Resources**

- **MongoDB Docs:** https://www.mongodb.com/docs/
- **Mongoose Docs:** https://mongoosejs.com/docs/
- **Express.js Docs:** https://expressjs.com/
- **React Query (for data fetching):** https://tanstack.com/query/latest

---

**Next Steps:** Fix MongoDB connection, then update backend routes one by one!


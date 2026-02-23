# 📄 PDF Upload & Verification Flow - Complete Explanation

## 🔍 **Your Questions Answered**

### **Q1: Where exactly is the document stored?**

**Answer:** Documents are stored in **TWO places**:

1. **File System (Physical Storage):**
   - Location: `backend/uploads/credentials/`
   - Format: `{uuid}-{sanitized-filename}.pdf`
   - Example: `a1b2c3d4-e5f6-7890-abcd-ef1234567890-degree_certificate.pdf`

2. **MongoDB Database (Metadata):**
   - Collection: `credentials`
   - Fields stored:
     - `credentialId` - Unique UUID
     - `userId` - Student who uploaded
     - `studentName`, `studentEmail`
     - `type` - degree/certificate/diploma/etc
     - `title`, `description`
     - `institution` - Name of the university
     - `status` - pending/verified/rejected
     - `dataHash` - SHA-256 hash of the file
     - `attachments` - Array with file path: `[{ filename, url: '/uploads/credentials/...', uploadedAt }]`

---

### **Q2: Is the backend being updated?**

**Answer:** **YES!** The backend is updated in **REAL-TIME** when a PDF is uploaded:

**Step-by-step what happens:**

1. **Student uploads PDF** → Frontend sends to `/api/credentials/upload`
2. **Backend receives file** → Saves to `backend/uploads/credentials/`
3. **Backend creates Credential** → Saves to MongoDB `credentials` collection
4. **Backend auto-creates VerificationRequest** → Saves to MongoDB `verificationrequests` collection
5. **Backend sends WebSocket notification** → University dashboard gets notified in real-time

---

### **Q3: Isn't it the same collection that the institution section is accessing?**

**Answer:** **NO, they access DIFFERENT collections but they are LINKED!**

**Two Collections Working Together:**

1. **`credentials` Collection** (Student's uploaded documents)
   - Stores: PDF metadata, file path, student info, institution name
   - Accessed by: Students (to view their uploads)
   - Created when: Student uploads a PDF

2. **`verificationrequests` Collection** (Verification tasks for universities)
   - Stores: Link to credential, requester ID, verifier ID, status
   - Accessed by: Universities (to see pending verification tasks)
   - Created when: Backend auto-creates after PDF upload

**How They're Linked:**
```javascript
VerificationRequest {
  credentialId: ObjectId("..."),  // ← Links to Credential._id
  requesterId: ObjectId("..."),   // ← Student who uploaded
  verifierId: ObjectId("..."),    // ← University who should verify
  status: 'pending'
}
```

When university views a verification request, the backend **populates** the credential details:
```javascript
const requests = await VerificationRequest.find({ verifierId: userId })
  .populate('credentialId')  // ← Fetches full credential data
  .lean();
```

---

## 📊 **Complete Data Flow Diagram**

```
STUDENT UPLOADS PDF
        ↓
┌───────────────────────────────────────────────────────────┐
│ 1. Frontend: POST /api/credentials/upload                │
│    - FormData with file + metadata                       │
│    - institution: "MIT"                                   │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 2. Backend: Save File to Disk                            │
│    - Location: backend/uploads/credentials/               │
│    - Filename: {uuid}-{sanitized-name}.pdf               │
│    - Compute SHA-256 hash                                │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 3. Backend: Create Credential in MongoDB                 │
│    Collection: credentials                                │
│    {                                                      │
│      credentialId: "uuid-1234",                          │
│      userId: ObjectId("student123"),                     │
│      studentName: "John Doe",                            │
│      institution: "MIT",                                 │
│      status: "pending",                                  │
│      dataHash: "sha256...",                              │
│      attachments: [{ url: "/uploads/..." }]             │
│    }                                                      │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 4. Backend: Find Verifier from Institution Name          │
│    Query: User.findOne({                                 │
│      organization: "MIT",                                │
│      role: "university",                                 │
│      isActive: true                                      │
│    })                                                     │
│    Result: verifier = { _id: ObjectId("uni123"), ... }  │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 5. Backend: Create VerificationRequest in MongoDB        │
│    Collection: verificationrequests                       │
│    {                                                      │
│      credentialId: ObjectId("cred123"),  ← Links to step 3│
│      requesterId: ObjectId("student123"),                │
│      verifierId: ObjectId("uni123"),     ← From step 4   │
│      status: "pending"                                   │
│    }                                                      │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 6. Backend: Send WebSocket Notification                  │
│    To: All connected clients (especially university)     │
│    Message: { type: 'verification.request', ... }       │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 7. University Dashboard: Receives Notification           │
│    - WebSocket triggers refresh                          │
│    - Calls GET /api/credentials/requests                 │
│    - Backend returns VerificationRequests with populated │
│      credential data                                      │
└───────────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────────┐
│ 8. University Reviews & Approves                         │
│    - POST /api/credentials/requests/:id/approve          │
│    - Backend updates:                                    │
│      * VerificationRequest.status = 'approved'           │
│      * Credential.status = 'verified'                    │
│      * Credential.verifiedBy = university._id            │
│      * Pushes to blockchain (Hyperledger Fabric)         │
└───────────────────────────────────────────────────────────┘
```

---

## 🗄️ **Database Collections**

### **1. `credentials` Collection**

**Purpose:** Store uploaded credential metadata and file references

**Schema:**
```javascript
{
  _id: ObjectId("..."),
  credentialId: "uuid-1234",           // Unique identifier
  userId: ObjectId("student123"),      // Who uploaded
  studentName: "John Doe",
  studentEmail: "john@example.com",
  type: "degree",                      // degree/certificate/diploma/etc
  title: "Bachelor of Science",
  description: "Computer Science Degree",
  institution: "MIT",                  // University name
  institutionId: ObjectId("..."),      // Optional
  issuer: "MIT",
  issuerId: ObjectId("..."),
  issueDate: ISODate("2024-01-01"),
  status: "pending",                   // pending/verified/rejected
  dataHash: "sha256hash...",           // File integrity hash
  attachments: [{
    filename: "uuid-degree.pdf",
    url: "/uploads/credentials/uuid-degree.pdf",
    uploadedAt: ISODate("...")
  }],
  verifiedBy: ObjectId("..."),         // Set when approved
  verifiedAt: ISODate("..."),          // Set when approved
  blockchainTxId: "tx123",             // Set when pushed to blockchain
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

**Accessed By:**
- Students: `GET /api/credentials/my` (their own credentials)
- Universities: Via VerificationRequest population
- Recruiters: When viewing candidate profiles

---

### **2. `verificationrequests` Collection**

**Purpose:** Track verification tasks for universities

**Schema:**
```javascript
{
  _id: ObjectId("..."),
  credentialId: ObjectId("cred123"),   // Links to credentials collection
  requesterId: ObjectId("student123"), // Student who requested
  verifierId: ObjectId("uni123"),      // University who should verify
  status: "pending",                   // pending/approved/rejected
  notes: "Looks good",                 // Optional notes from verifier
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

**Accessed By:**
- Universities: `GET /api/credentials/requests` (where verifierId = their ID)
- Students: `GET /api/credentials/requests` (where requesterId = their ID)
- Admin: All requests

---

## 🔧 **Backend Routes**

### **Upload Route**
```javascript
POST /api/credentials/upload
Headers: Authorization: Bearer <token>
Body: FormData {
  file: <PDF file>,
  title: "Bachelor of Science",
  type: "degree",
  institution: "MIT",
  issuedOn: "2024-01-01",
  description: "..."
}

Response: {
  success: true,
  credential: { credentialId, userId, ... }
}
```

### **Get Verification Requests (University)**
```javascript
GET /api/credentials/requests
Headers: Authorization: Bearer <token>
Query: (none - filtered by user role and ID)

Response: [
  {
    _id: "req123",
    credentialId: ObjectId("cred123"),
    requesterId: ObjectId("student123"),
    verifierId: ObjectId("uni123"),
    status: "pending",
    credential: {  // ← Populated!
      title: "Bachelor of Science",
      type: "degree",
      studentName: "John Doe",
      institution: "MIT",
      attachments: [{ url: "/uploads/..." }]
    },
    requester: {  // ← Populated!
      name: "John Doe",
      email: "john@example.com"
    }
  }
]
```

### **Approve Request**
```javascript
POST /api/credentials/requests/:id/approve
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  message: "Verification approved",
  credential: { ... }
}

Side Effects:
1. VerificationRequest.status = 'approved'
2. Credential.status = 'verified'
3. Credential.verifiedBy = university._id
4. Credential.verifiedAt = now
5. Push to blockchain (async)
6. WebSocket notification sent
```

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: University doesn't see verification requests**

**Possible Causes:**
1. ❌ No user with matching `organization` name
2. ❌ User role is not `'university'`
3. ❌ User `isActive` is false
4. ❌ Institution name doesn't match exactly

**Solution:**
```javascript
// Check if verifier exists
db.users.findOne({ 
  organization: "MIT", 
  role: "university", 
  isActive: true 
})

// If not found, update user:
db.users.updateOne(
  { email: "registrar@mit.edu" },
  { $set: { organization: "MIT", role: "university", isActive: true } }
)
```

### **Issue 2: Credential uploaded but no verification request created**

**Check Backend Logs:**
```
Looking for verifier for institution: MIT
Found verifier: John Smith (registrar@mit.edu) for institution: MIT
Verification request created: 507f1f77bcf86cd799439011
```

**If you see "No verifier found":**
- Institution name mismatch
- No university user with that organization

### **Issue 3: File not accessible**

**Check:**
1. File exists: `ls backend/uploads/credentials/`
2. URL is correct: `/uploads/credentials/{filename}`
3. Static file serving is enabled in `server.js`:
   ```javascript
   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
   ```

---

## ✅ **Testing Checklist**

1. **Upload PDF as Student:**
   - [ ] Login as student
   - [ ] Upload PDF with institution name
   - [ ] Check console for "Verification request created"
   - [ ] Check MongoDB: `db.credentials.find().sort({createdAt:-1}).limit(1)`
   - [ ] Check MongoDB: `db.verificationrequests.find().sort({createdAt:-1}).limit(1)`

2. **View Request as University:**
   - [ ] Login as university user
   - [ ] Navigate to "Verification Requests" tab
   - [ ] Should see pending request with student name, credential title
   - [ ] Click "View" to see PDF

3. **Approve Request:**
   - [ ] Click "Approve" button
   - [ ] Check credential status changed to "verified"
   - [ ] Check student dashboard shows "verified" badge

---

## 🎯 **Summary**

**YES, the backend IS being updated!**

- ✅ PDF saved to `backend/uploads/credentials/`
- ✅ Credential metadata saved to MongoDB `credentials` collection
- ✅ VerificationRequest created in MongoDB `verificationrequests` collection
- ✅ University accesses `verificationrequests` collection (NOT `credentials` directly)
- ✅ Backend populates credential data when university fetches requests
- ✅ When approved, BOTH collections are updated

**The system is working as designed!** If you're not seeing requests, it's likely a data issue (user organization name mismatch).


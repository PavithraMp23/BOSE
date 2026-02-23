# 📁 Upload & Verification Flow - Complete Documentation

## 🗂️ **Where Files Are Stored**

### **Storage Location:**
```
backend/uploads/credentials/
```

### **File Naming:**
```
{UUID}-{sanitized-original-filename}
```

**Example:**
```
backend/uploads/credentials/a1b2c3d4-e5f6-7890-abcd-ef1234567890-degree_certificate.pdf
```

### **Code Reference:**

<augment_code_snippet path="backend/routes/credentials.js" mode="EXCERPT">
````javascript
// Line 54-59
const uploadsDir = path.join(process.cwd(), 'backend', 'uploads', 'credentials');
await fs.promises.mkdir(uploadsDir, { recursive: true });
const filename = `${uuidv4()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
const filepath = path.join(uploadsDir, filename);
await fs.promises.writeFile(filepath, req.file.buffer);
````
</augment_code_snippet>

### **Database Storage:**

The file metadata is stored in MongoDB:

```javascript
{
  credentialId: "uuid-v4",
  userId: "student-user-id",
  title: "Bachelor of Computer Science",
  type: "degree",
  institution: "Massachusetts Institute of Technology",
  status: "pending",
  dataHash: "sha256-hash-of-file",
  attachments: [
    {
      filename: "uuid-original-name.pdf",
      url: "/uploads/credentials/uuid-original-name.pdf",
      uploadedAt: "2025-11-04T10:30:00.000Z"
    }
  ]
}
```

---

## 🔔 **How Verification Notifications Work**

### **Current Flow (BROKEN):**

1. ✅ Student uploads credential
2. ✅ File saved to `backend/uploads/credentials/`
3. ✅ Credential saved to MongoDB
4. ❌ **NO verification request created** (missing!)
5. ❌ **NO notification sent to verifier** (missing!)

### **Why It's Broken:**

The frontend is NOT sending the required fields to create a verification request!

**Current Upload Code:**
<augment_code_snippet path="src/pages/StudentDashboard.tsx" mode="EXCERPT">
````typescript
// Line 398-402
formData.append('title', title);
formData.append('type', certificateType === 'degree' ? 'degree' : ...);
formData.append('description', description);
formData.append('institution', verifyingInstitution);
formData.append('issuedOn', new Date().toISOString());
// ❌ MISSING: requestVerification and verifierId
````
</augment_code_snippet>

**Backend Expects:**
<augment_code_snippet path="backend/routes/credentials.js" mode="EXCERPT">
````javascript
// Line 89-113
if (req.body.requestVerification && req.body.verifierId) {
  // Create verification request
  const vr = new VerificationRequest({
    credentialId: newCred._id,
    requesterId: userId,
    verifierId: verifierUserId,
    status: 'pending'
  });
  await vr.save();
  
  // Send WebSocket notification
  if (global.wss) {
    global.wss.clients.forEach(client => {
      client.send(JSON.stringify({
        type: 'verification.request',
        requestId: vr._id,
        credentialId: newCred.credentialId
      }));
    });
  }
}
````
</augment_code_snippet>

---

## 🔧 **What Needs to Be Fixed**

### **Problem:**

The frontend needs to:
1. Find a verifier user from the institution name
2. Send `requestVerification: true` and `verifierId` to backend

### **Challenge:**

- User types institution NAME (e.g., "MIT")
- Backend needs institution USER ID (e.g., `507f1f77bcf86cd799439011`)
- We need to find a user with role `institution` or `verifier` from that institution

---

## 🎯 **Proposed Solution**

### **Option 1: Backend Auto-Creates Verification Request**

**Pros:**
- ✅ Simple frontend
- ✅ No extra API calls
- ✅ Works with typed institution names

**Cons:**
- ❌ Requires institution name to match exactly
- ❌ May not find the right verifier

**Implementation:**

Backend finds verifier by institution name:

```javascript
// In backend/routes/credentials.js upload endpoint
const institutionName = req.body.institution;

// Find a verifier from this institution
const verifier = await User.findOne({
  organization: institutionName,
  role: { $in: ['institution', 'verifier'] },
  isActive: true
}).lean();

if (verifier) {
  const vr = new VerificationRequest({
    credentialId: newCred._id,
    requesterId: userId,
    verifierId: verifier._id,
    status: 'pending'
  });
  await vr.save();
  
  // Send notification
  // ...
}
```

---

### **Option 2: Frontend Selects Specific Verifier**

**Pros:**
- ✅ More accurate
- ✅ User chooses exact verifier
- ✅ Better control

**Cons:**
- ❌ More complex UI
- ❌ Requires loading verifiers list
- ❌ Extra API call

**Implementation:**

1. Load verifiers when modal opens:
```typescript
const [verifiers, setVerifiers] = useState([]);

useEffect(() => {
  const loadVerifiers = async () => {
    const response = await api.get('/api/users?role=institution,verifier');
    setVerifiers(response.data);
  };
  loadVerifiers();
}, [uploadModalOpen]);
```

2. Show dropdown:
```tsx
<select value={selectedVerifier} onChange={...}>
  {verifiers.map(v => (
    <option key={v._id} value={v._id}>
      {v.name} - {v.organization}
    </option>
  ))}
</select>
```

3. Send to backend:
```typescript
formData.append('requestVerification', 'true');
formData.append('verifierId', selectedVerifier);
```

---

### **Option 3: Hybrid Approach (RECOMMENDED)**

**Best of both worlds:**

1. User types institution name (current behavior)
2. Backend tries to auto-find verifier
3. If found, creates verification request
4. If not found, credential still uploaded but no verification request

**Pros:**
- ✅ Simple UX
- ✅ Works even if no verifier found
- ✅ Automatic when possible
- ✅ No breaking changes

**Implementation:**

Backend code (add to upload endpoint):

```javascript
// After saving credential
const institutionName = req.body.institution;

// Try to find a verifier from this institution
const verifier = await User.findOne({
  $or: [
    { organization: institutionName },
    { organization: { $regex: new RegExp(institutionName, 'i') } }
  ],
  role: { $in: ['institution', 'verifier'] },
  isActive: true
}).lean();

if (verifier) {
  console.log(`Found verifier: ${verifier.name} for institution: ${institutionName}`);
  
  const vr = new VerificationRequest({
    credentialId: newCred._id,
    requesterId: userId,
    verifierId: verifier._id,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await vr.save();
  
  // Send WebSocket notification
  if (global.wss) {
    global.wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'verification.request',
          requestId: vr._id,
          credentialId: newCred.credentialId,
          verifierId: verifier._id
        }));
      }
    });
  }
  
  console.log(`Verification request created: ${vr._id}`);
} else {
  console.log(`No verifier found for institution: ${institutionName}`);
}
```

---

## 📊 **Verification Dashboard Flow**

### **How Verifiers See Requests:**

1. **Verifier logs in** (e.g., `registrar@mit.edu`)
2. **Navigates to:** `/dashboard/institution/verifications`
3. **Frontend calls:** `GET /api/credentials/requests`
4. **Backend filters by:** `verifierId: userId`
5. **Returns:** Array of verification requests with populated credential data

### **Code Flow:**

<augment_code_snippet path="backend/routes/credentials.js" mode="EXCERPT">
````javascript
// Line 272-311
router.get('/requests', async (req, res) => {
  const role = req.user?.role;
  const userId = req.user?.userId || req.user?.id;

  let query = {};
  if (role === 'institution' || role === 'verifier') {
    query = { verifierId: userId }; // Only show requests for this verifier
  }

  const requests = await VerificationRequest.find(query)
    .sort({ createdAt: -1 })
    .lean();

  // Populate credential and requester details
  const populatedRequests = await Promise.all(
    requests.map(async (request) => {
      const credential = await Credential.findById(request.credentialId).lean();
      const requester = await User.findById(request.requesterId).select('name email').lean();
      return {
        ...request,
        credential: credential || null,
        requester: requester || null
      };
    })
  );

  res.json(populatedRequests);
});
````
</augment_code_snippet>

### **Frontend Display:**

<augment_code_snippet path="src/modules/institution/components/VerificationRequests.tsx" mode="EXCERPT">
````typescript
// Line 24-37
{requests.map(request => (
  <Card key={request._id} className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">
          {request.credential?.title || 'Untitled Credential'}
        </h3>
        <p className="text-sm text-gray-500">
          {request.credential?.studentName} • {request.credential?.type}
        </p>
        <p className="text-xs text-gray-400">
          Requested {formatDistance(new Date(request.createdAt), new Date())}
        </p>
      </div>
````
</augment_code_snippet>

---

## 🚀 **Next Steps**

### **To Make Verification Work:**

1. **Implement Option 3** (Hybrid Approach)
2. **Update backend upload endpoint** to auto-find verifier
3. **Test with seeded data:**
   - Student: `alice.johnson@student.edu`
   - Institution: `registrar@mit.edu`
   - Upload credential with institution: "Massachusetts Institute of Technology"
   - Check if verification request is created
   - Login as `registrar@mit.edu` and check verifications page

### **Testing Checklist:**

- [ ] Upload credential as student
- [ ] Check backend logs for "Found verifier" message
- [ ] Check MongoDB for VerificationRequest document
- [ ] Login as institution user
- [ ] Navigate to Verifications page
- [ ] See the pending request
- [ ] Click "View Details" to see credential
- [ ] Click "View Document" to download file
- [ ] Click "Approve" to verify credential
- [ ] Check credential status changes to "verified"

---

**Would you like me to implement Option 3 (Hybrid Approach) now?**


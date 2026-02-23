# University Module - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install & Start

```bash
cd bose
npm install
npm run server
```

Server runs on `http://localhost:3002`

### Step 2: Login

```bash
curl -X POST "http://localhost:3002/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "iit@dapcvrn.com",
    "password": "any"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "user_inst",
    "email": "iit@dapcvrn.com",
    "role": "institution"
  }
}
```

Copy the `token` - you'll use it for all requests.

### Step 3: Make Your First Request

```bash
# Replace <token> with your actual token from Step 2
curl -X GET "http://localhost:3002/api/university/verification/requests" \
  -H "Authorization: Bearer <token>"
```

---

## 📍 All Endpoints

### List Verification Requests
```bash
GET /api/university/verification/requests?status=pending&page=1&limit=10
```

### Approve a Credential
```bash
POST /api/university/verification/approve/VR-001
Body: { "fileUrl": "...", "timestamp": "..." }
```

### Reject a Credential
```bash
POST /api/university/verification/reject/VR-001
Body: { "reason": "Document not valid" }
```

### List Issued Credentials
```bash
GET /api/university/credentials/issued?type=Degree
```

### Search Students
```bash
GET /api/university/students/search?name=Sarah
```

### Get Analytics
```bash
GET /api/university/reports/analytics
```

---

## 🧪 Run Tests

```bash
# Run only university tests
npm run test:university

# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode (re-run on file changes)
npm run test:watch
```

Expected: **40+ tests pass** ✅

---

## 📊 Sample Responses

### Verification Requests
```json
{
  "success": true,
  "data": [
    {
      "_id": "VR-001",
      "studentName": "Sarah Chen",
      "credentialTitle": "B.Tech Computer Science",
      "status": "pending",
      "submittedAt": "2024-02-01T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  }
}
```

### Approve Response
```json
{
  "success": true,
  "message": "Credential approved successfully",
  "hash": "3f4a8f9c2e1b7d6a5c4b9e8f7a6d5c4b3a2f9e8d7c6b5a4f3e2d1c0b9a8f7e",
  "issuedCredential": {
    "_id": "IC-001",
    "studentName": "Sarah Chen",
    "status": "verified",
    "verifiedOn": "2024-02-15T14:30:00Z"
  }
}
```

### Analytics Response
```json
{
  "success": true,
  "analytics": {
    "summary": {
      "totalPending": 2,
      "totalApproved": 15,
      "totalRejected": 3,
      "totalIssued": 15,
      "averageVerificationTimeMinutes": 180
    },
    "credentialBreakdown": {
      "byType": { "Degree": 10, "Certificate": 5 },
      "byStatus": { "verified": 15, "pending": 2, "rejected": 3 }
    }
  }
}
```

---

## 🔐 Authentication

**Every request needs:**
```
Authorization: Bearer <your_token>
```

**Token expires in 24 hours** - Login again if needed.

---

## ❌ Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `401: Access token required` | No/invalid token | Login first, copy token |
| `403: Insufficient permissions` | User role is not university | Login with `iit@dapcvrn.com` |
| `400: Invalid input data` | Bad request body | Check JSON format |
| `404: Not found` | Resource doesn't exist | Check ID is correct |

---

## 🗂️ File Locations

- **Routes**: `backend/routes/university.js`
- **Tests**: `backend/routes/university.test.js`
- **API Docs**: `backend/UNIVERSITY_API.md`
- **Middleware**: `backend/middleware/roleMiddleware.js`

---

## 💡 Tips

1. **Test in browser DevTools Console:**
```javascript
const token = "your_token_here";
fetch("http://localhost:3002/api/university/verification/requests", {
  headers: { "Authorization": `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);
```

2. **Use Postman or Insomnia** for easier API testing with saved tokens

3. **Check test file** (`university.test.js`) for more examples

4. **All timestamps** are ISO 8601 format (e.g., `2024-02-15T14:30:00Z`)

---

## 📋 Mock Data Available

**Test Student IDs:**
- student_001: Sarah Chen
- student_002: Michael Rodriguez  
- student_003: Emily Watson
- student_004: James Park
- student_005: Lisa Zhang

**Test Verification Requests:**
- VR-001: pending
- VR-002: pending
- VR-003: approved
- VR-004: rejected

**Use these IDs in API calls for realistic testing!**

---

## 🔄 Typical Workflow

```
1. Login
   POST /api/auth/login
   Get token

2. View pending requests
   GET /api/university/verification/requests?status=pending
   Find request to process

3. Approve or Reject
   POST /api/university/verification/approve/VR-001
   OR
   POST /api/university/verification/reject/VR-001

4. View issued credentials
   GET /api/university/credentials/issued

5. View analytics
   GET /api/university/reports/analytics

6. Search students
   GET /api/university/students/search?name=Sarah
```

---

## 🆘 Troubleshooting

**Server won't start?**
```bash
# Make sure port 3002 is free
# Try a different port: PORT=3002 npm run server
```

**Tests failing?**
```bash
# Make sure dependencies are installed
npm install

# Run tests with verbose output
npm run test -- --verbose
```

**Token errors?**
```bash
# Get new token from login endpoint
# Remember: token expires in 24 hours
```

---

## 📚 Full Documentation

See `UNIVERSITY_API.md` for complete API documentation with all details, examples, and error codes.

---

**Ready? Start testing now!** 🎉

Questions? Check `UNIVERSITY_MODULE_SUMMARY.md` for detailed implementation info.
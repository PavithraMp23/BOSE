# API Testing Debugging Guide

## Problem: Postman API requests hanging infinitely

### Root Cause
The API calls were hanging due to:
1. **Fabric Network Not Running** - The blockchain gateway couldn't connect
2. **No Request Timeouts** - Requests would wait indefinitely
3. **Identity Enrollment Issues** - CA enrollment could fail or hang
4. **Missing Error Handling** - No proper error responses for failures

### Solutions Applied ✅

#### 1. **Added Request Timeouts (30 seconds for writes, 15 for queries)**
- Write operations: `/certificate/approve`, `/skill/add` → 30s timeout
- Query operations: `/certificate/:certId`, `/skill/:skillId` → 15s timeout
- Identity enrollment: 30s timeout
- Returns `504 Gateway Timeout` if network is unreachable

#### 2. **Improved Error Messages**
- Timeout errors now indicate Fabric network may not be running
- Helpful hints in error responses
- Better status codes (503 Service Unavailable, 504 Gateway Timeout)

#### 3. **Added Logging**
- Connection attempts are logged
- Timeout errors are logged to console

#### 4. **Ensured Gateway Disconnection**
- Wrapped blockchain calls in try/finally blocks
- Prevents connection leaks

---

## Before Testing

### 1. Start Fabric Network
```bash
cd /home/pavithra/BOSE/fabric-samples/test-network

# Start the network
./network.sh up createChannel -c mychannel -ca

# Deploy chaincodes
./network.sh deployCC -ccn bose -ccp ../path/to/bose-chaincode -ccl javascript
./network.sh deployCC -ccn skills -ccp ../path/to/skills-chaincode -ccl javascript
```

### 2. Verify Fabric is Running
```bash
# Check running containers
docker ps | grep -E "peer|orderer|ca"

# Check wallet exists
ls -la /home/pavithra/BOSE/wallet/
```

### 3. Start Backend Server
```bash
cd /home/pavithra/BOSE/bose-backend
npm install
node server.js
# Should see: "Server running on port 5000"
```

---

## Testing API Endpoints

### Test 1: Upload Certificate (No Timeout)
```bash
curl -X POST http://localhost:5000/api/certificate/upload \
  -F "certificate=@path/to/file.pdf" \
  -F "studentId=student_001" \
  -F "studentName=John Doe" \
  -F "course=Computer Science" \
  -F "institution=MIT" \
  -F "grade=A+" \
  -F "issueDate=2024-01-15"
```
**Expected Response (Quick - no blockchain):**
```json
{
  "success": true,
  "message": "Certificate uploaded and awaiting verification",
  "certificateId": "CERT_student_001_...",
  "fileHash": "abc123..."
}
```

---

### Test 2: Approve Certificate (With Timeout)
```bash
# Get the certId from Test 1 response
curl -X POST http://localhost:5000/api/certificate/approve/CERT_student_001_1234567890 \
  -H "Content-Type: application/json" \
  -d '{"identity": "college_xyz"}'
```

**Possible Responses:**

✅ **Success (30s or less):**
```json
{
  "success": true,
  "message": "Certificate verified and added to blockchain"
}
```

⏱️ **Timeout (504 after 30s):**
```json
{
  "error": "Blockchain operation timeout - please ensure Fabric network is running",
  "hint": "Fabric network may not be running. Check if test-network is started."
}
```

---

### Test 3: Query Certificate
```bash
curl -X GET "http://localhost:5000/api/certificate/CERT_student_001_1234567890?identity=college_xyz"
```

**Possible Responses:**

✅ **Success:**
```json
{
  "success": true,
  "certificate": {
    "certId": "CERT_student_001_...",
    "studentId": "student_001",
    "status": "VERIFIED",
    ...
  }
}
```

⏱️ **Timeout (504 after 15s):**
```json
{
  "error": "Query timeout - blockchain network may be unavailable"
}
```

---

### Test 4: Add Skill
```bash
curl -X POST http://localhost:5000/api/skill/add \
  -H "Content-Type: application/json" \
  -d '{
    "skillId": "SKILL_001",
    "studentId": "student_001",
    "studentName": "John Doe",
    "skillName": "Python",
    "category": "Programming",
    "level": "Advanced",
    "issuer": "Coursera",
    "identity": "college_xyz"
  }'
```

---

## Troubleshooting

### If you get 504 Timeout:
1. **Check if Fabric network is running:**
   ```bash
   docker ps | grep fabric
   # Should show peer, orderer, ca containers
   ```

2. **Restart the network:**
   ```bash
   cd /home/pavithra/BOSE/fabric-samples/test-network
   ./network.sh down
   ./network.sh up createChannel -c mychannel -ca
   ```

3. **Check server logs for details:**
   ```bash
   # In backend terminal, look for:
   # "Connecting to BOSEChaincode with timeout 15000ms..."
   # "Gateway connection timeout..."
   ```

### If you get other errors:
1. **Check MongoDB connection:**
   ```bash
   # Verify .env file has correct DB_URI
   cat /home/pavithra/BOSE/bose-backend/.env
   ```

2. **Check wallet exists:**
   ```bash
   ls -la /home/pavithra/BOSE/wallet/
   # Should have: admin.id, college_xyz.id, etc.
   ```

3. **Check connection profile:**
   ```bash
   ls /home/pavithra/BOSE/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/
   ```

---

## Expected Behavior

| Endpoint | Timeout | Status | Notes |
|----------|---------|--------|-------|
| POST /certificate/upload | None | 200 | Instant, no blockchain |
| POST /certificate/approve/:id | 30s | 200 or 504 | Blockchain write, may timeout |
| GET /certificate/:id | 15s | 200 or 504 | Blockchain query |
| POST /skill/add | 30s | 200 or 504 | Blockchain write |
| GET /skill/:id | 15s | 200 or 504 | Blockchain query |

**Key Improvement:** Requests now timeout instead of hanging forever! ✅

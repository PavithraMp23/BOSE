# BOSE - Setup & Running Guide

## **Prerequisites**
- Node.js (v14+)
- MongoDB (running locally on `mongodb://localhost:27017`)
- Hyperledger Fabric Test Network (running)
- Fabric CA (running)

---

## **Step 1: Setup Fabric Network**

Before running BOSE, ensure your Fabric test network is running:

```bash
cd fabric-samples/test-network

# Start the network
./network.sh up createChannel -c mychannel -ca

# Deploy chaincode (must have BOSEChaincode and SkillsChaincode deployed)
# Follow Fabric documentation for deploying your chaincodes
```

---

## **Step 2: Install Dependencies**

### Backend
```bash
cd /home/pavithra/BOSE/bose-backend
npm install
```

### Client
```bash
cd /home/pavithra/BOSE/bose-client
npm install
```

---

## **Step 3: Enroll Admin (Required First Step)**

This must be done BEFORE running the backend or registering any users.

```bash
cd /home/pavithra/BOSE/bose-client
node enrollAdmin.js
```

**Expected Output:**
```
Successfully enrolled admin and imported into wallet
```

This creates the `admin` identity in the wallet at `/home/pavithra/BOSE/wallet/admin.id`

---

## **Step 4: Register Users (Optional but Recommended)**

Register predefined users for testing:

```bash
cd /home/pavithra/BOSE/bose-client
node registerUser.js
```

**This registers:**
- `college_xyz` (role: institution)
- `student_001` (role: student)
- `company_abc` (role: company)

**Expected Output:**
```
✅ Successfully enrolled user: college_xyz with role: institution
✅ Successfully enrolled user: student_001 with role: student
✅ Successfully enrolled user: company_abc with role: company
✅ All users registered successfully!
```

---

## **Step 5: Start MongoDB**

Ensure MongoDB is running:

```bash
# On Linux/Mac with MongoDB installed
mongod

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

Verify it's running:
```bash
mongo --version
```

---

## **Step 6: Start the Backend Server**

```bash
cd /home/pavithra/BOSE/bose-backend
npm start
# or
node server.js
```

**Expected Output:**
```
 MongoDB connected
BOSE Backend running on port 3002
```

Backend is now running at: `http://localhost:3002`

---

## **Step 7: Test the System**

### Health Check
```bash
curl http://localhost:3002/health
```

Response:
```json
{ "status": "OK" }
```

---

## **API Usage Examples**

### **1. Register a New User (via API)**

```bash
curl -X POST http://localhost:3002/api/admin/identity/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "new_user_123",
    "role": "institution"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Identity new_user_123 registered with role institution"
}
```

---

### **2. Upload a Certificate**

Create a test certificate file first, then:

```bash
curl -X POST http://localhost:3002/api/certificate/upload \
  -F "certificate=@/path/to/certificate.pdf" \
  -F "studentId=student_001" \
  -F "studentName=John Doe" \
  -F "course=B.Tech CSE" \
  -F "institution=MIT" \
  -F "grade=A+" \
  -F "issueDate=2025-01-18"
```

Response:
```json
{
  "success": true,
  "message": "Certificate uploaded and awaiting verification",
  "certificateId": "CERT_student_001_1705513800000",
  "fileHash": "abc123def456..."
}
```

**Save the `certificateId` for next step!**

---

### **3. Approve Certificate (Write to Blockchain)**

```bash
curl -X POST http://localhost:3002/api/certificate/approve/CERT_student_001_1705513800000 \
  -H "Content-Type: application/json" \
  -d '{
    "identity": "college_xyz"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Certificate verified and added to blockchain"
}
```

**Certificate is now on the blockchain!**

---

### **4. Query Certificate from Blockchain**

```bash
curl http://localhost:3002/api/certificate/CERT_student_001_1705513800000?identity=college_xyz
```

Response:
```json
{
  "success": true,
  "certificate": {
    "certId": "CERT_student_001_1705513800000",
    "studentId": "student_001",
    "studentName": "John Doe",
    "course": "B.Tech CSE",
    "institution": "MIT",
    "grade": "A+",
    "issueDate": "2025-01-18",
    "fileHash": "abc123def456..."
  }
}
```

---

### **5. Verify Certificate by File**

```bash
curl -X POST http://localhost:3002/api/certificate/verify \
  -F "certificate=@/path/to/certificate.pdf" \
  -H "identity: college_xyz"
```

Response:
```json
{
  "success": true,
  "verified": true,
  "certificate": {
    "certId": "CERT_student_001_1705513800000",
    ...
  }
}
```

---

### **6. Add a Skill**

```bash
curl -X POST http://localhost:3002/api/skill/add \
  -H "Content-Type: application/json" \
  -d '{
    "skillId": "SKILL_001",
    "studentId": "student_001",
    "studentName": "John Doe",
    "skillName": "React",
    "category": "Frontend",
    "level": "Advanced",
    "issuer": "Udemy",
    "identity": "college_xyz"
  }'
```

Response:
```json
{
  "success": true,
  "skillId": "SKILL_001"
}
```

---

### **7. Query Skill from Blockchain**

```bash
curl http://localhost:3002/api/skill/SKILL_001?identity=college_xyz
```

Response:
```json
{
  "success": true,
  "skill": {
    "skillId": "SKILL_001",
    "studentId": "student_001",
    "skillName": "React",
    "category": "Frontend",
    "level": "Advanced",
    "issuer": "Udemy"
  }
}
```

---

## **Complete Workflow Example**

```bash
# 1. Enroll admin (one-time)
node bose-client/enrollAdmin.js

# 2. Register users (one-time or as needed)
node bose-client/registerUser.js

# 3. Start MongoDB
mongod &

# 4. Start backend
cd bose-backend && npm start &

# 5. Upload certificate
curl -X POST http://localhost:3002/api/certificate/upload \
  -F "certificate=@cert.pdf" \
  -F "studentId=student_001" \
  -F "studentName=John" \
  -F "course=CS" \
  -F "institution=MIT" \
  -F "grade=A" \
  -F "issueDate=2025-01-18"

# 6. Approve certificate (save certificateId from step 5)
curl -X POST http://localhost:3002/api/certificate/approve/CERT_student_001_1705513800000 \
  -H "Content-Type: application/json" \
  -d '{"identity": "college_xyz"}'

# 7. Query certificate
curl http://localhost:3002/api/certificate/CERT_student_001_1705513800000?identity=college_xyz
```

---

---

## **Step 8: Setup and Run Frontend**

The frontend is a React application built with Vite.

```bash
cd /home/pavithra/BOSE/bose-frontend

# Install dependencies (only need to do this once)
npm install

# Run the development server
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Frontend is now running at: `http://localhost:5173`

---

## **Troubleshooting**

### **MongoDB Connection Error**
```
MongoNetworkError: connect ECONNREFUSED
```
**Solution:** Start MongoDB: `mongod`

### **Fabric Network Error**
```
Error: Cannot connect to peer
```
**Solution:** Ensure Fabric test network is running: `./network.sh up createChannel`

### **Admin Not Enrolled**
```
Error: Admin not enrolled
```
**Solution:** Run `node enrollAdmin.js` first

### **Identity Not Found in Wallet**
```
Error: Identity not found in wallet
```
**Solution:** Register the user first via API or `node registerUser.js`

### **Chaincode Not Deployed**
```
Error: Chaincode not found
```
**Solution:** Deploy BOSEChaincode and SkillsChaincode to the network

---

## **File Structure for Reference**

```
BOSE/
├── bose-backend/        # Express REST API
│   ├── server.js        # Main server
│   ├── routes/          # API endpoints
│   ├── controllers/      # Business logic
│   ├── models/          # MongoDB schemas
│   └── services/        # Hash functions
├── bose-client/         # Fabric SDK wrapper
│   ├── app.js           # Chaincode interaction
│   ├── enrollAdmin.js    # Admin enrollment
│   ├── enrollUser.js     # User enrollment
│   ├── registerUser.js   # Register test users
│   └── services/        # Identity services
├── wallet/              # User identities (created after enrollment)
└── fabric-samples/      # Hyperledger Fabric test network
```

---

## **Environment Variables (.env)**

Located in `bose-backend/.env`:

```
PORT=3002
MONGO_URI=mongodb://localhost:27017/mydatabase
WALLET_PATH=../wallet
CHAINCODE_NAME=bose
CHANNEL_NAME=mychannel
FABRIC_CONNECTION_PROFILE=../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json
```

---

## **Summary**

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `node enrollAdmin.js` | Set up admin (required first) |
| 2 | `node registerUser.js` | Register test users (optional) |
| 3 | `mongod` | Start database |
| 4 | `npm start` | Start backend server |
| 5 | API calls | Upload/Verify/Query certificates & skills |
| 6 | `npm run dev` | Start frontend application (in `bose-frontend`) |

**Your BOSE system is now ready to run!**

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bose_db';

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check verification requests
    const VerificationRequest = mongoose.model('VerificationRequest', new mongoose.Schema({}, { strict: false }));
    const Credential = mongoose.model('Credential', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    console.log('=== VERIFICATION REQUESTS ===');
    const requests = await VerificationRequest.find().lean();
    console.log(`Total verification requests: ${requests.length}\n`);
    
    if (requests.length > 0) {
      for (const req of requests) {
        console.log(`Request ID: ${req._id}`);
        console.log(`  Credential ID: ${req.credentialId}`);
        console.log(`  Requester ID: ${req.requesterId}`);
        console.log(`  Verifier ID: ${req.verifierId}`);
        console.log(`  Status: ${req.status}`);
        console.log(`  Created: ${req.createdAt}`);
        console.log('');
      }
    } else {
      console.log('❌ No verification requests found!\n');
    }

    console.log('=== CREDENTIALS ===');
    const credentials = await Credential.find().sort({ createdAt: -1 }).limit(5).lean();
    console.log(`Total credentials (last 5): ${credentials.length}\n`);
    
    for (const cred of credentials) {
      console.log(`Credential ID: ${cred.credentialId}`);
      console.log(`  Student: ${cred.studentName}`);
      console.log(`  Institution: ${cred.institution}`);
      console.log(`  Type: ${cred.type}`);
      console.log(`  Status: ${cred.status}`);
      console.log(`  Created: ${cred.createdAt}`);
      console.log('');
    }

    console.log('=== UNIVERSITY USERS ===');
    const universities = await User.find({ role: 'university' }).lean();
    console.log(`Total university users: ${universities.length}\n`);
    
    for (const uni of universities) {
      console.log(`User: ${uni.name} (${uni.email})`);
      console.log(`  Organization: ${uni.organization}`);
      console.log(`  Role: ${uni.role}`);
      console.log(`  Active: ${uni.isActive}`);
      console.log('');
    }

    console.log('=== STUDENT USERS ===');
    const students = await User.find({ role: 'student' }).limit(3).lean();
    console.log(`Total student users (showing 3): ${students.length}\n`);
    
    for (const student of students) {
      console.log(`User: ${student.name} (${student.email})`);
      console.log(`  Organization: ${student.organization}`);
      console.log(`  Role: ${student.role}`);
      console.log('');
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkDatabase();


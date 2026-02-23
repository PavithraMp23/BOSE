#!/usr/bin/env node
/**
 * Database Initialization Script
 * 
 * This script initializes the MongoDB database with all required collections
 * and creates indexes for optimal performance.
 * 
 * Usage: node scripts/initDatabase.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const Certificate = require('../models/certificateModel');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const Applicant = require('../models/applicantModel');
const Notification = require('../models/notificationModel');
const Message = require('../models/messageModel');

async function initDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get database instance
        const db = mongoose.connection.db;

        console.log('\n📊 Current Collections:');
        const collections = await db.listCollections().toArray();
        collections.forEach(col => console.log(`  - ${col.name}`));

        console.log('\n🔨 Creating/Updating Collections and Indexes...\n');

        // Initialize each model (this creates collections if they don't exist)
        const models = [
            { name: 'Certificate', model: Certificate },
            { name: 'User', model: User },
            { name: 'Job', model: Job },
            { name: 'Applicant', model: Applicant },
            { name: 'Notification', model: Notification },
            { name: 'Message', model: Message }
        ];

        for (const { name, model } of models) {
            try {
                // Create indexes defined in the schema
                await model.createIndexes();
                console.log(`✅ ${name}: Collection and indexes created/verified`);
            } catch (err) {
                console.error(`❌ ${name}: Error -`, err.message);
            }
        }

        console.log('\n📈 Database Statistics:');
        const stats = await db.stats();
        console.log(`  - Database: ${stats.db}`);
        console.log(`  - Collections: ${stats.collections}`);
        console.log(`  - Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
        console.log(`  - Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`);

        console.log('\n🎯 Verifying Collection Schemas:\n');

        // Verify each collection
        const finalCollections = await db.listCollections().toArray();
        for (const col of finalCollections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`  ${col.name}: ${count} documents`);
        }

        console.log('\n✨ Database initialization complete!');
        console.log('\n📝 Next Steps:');
        console.log('  1. Start your backend: npm start');
        console.log('  2. The models will automatically create documents when you use the API');
        console.log('  3. Check the API docs at: http://localhost:3002/api-docs\n');

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the initialization
initDatabase();

#!/usr/bin/env node
/**
 * Database Seed Script
 * 
 * Populates the database with realistic dummy data for testing and development.
 * 
 * Usage: node scripts/seedDatabase.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import all models
const Certificate = require('../models/certificateModel');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const Applicant = require('../models/applicantModel');
const Notification = require('../models/notificationModel');
const Message = require('../models/messageModel');

// Dummy data
const dummyUsers = [
    {
        name: 'Alice Johnson',
        email: 'alice.johnson@student.edu',
        password: 'password123',
        role: 'student',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
    },
    {
        name: 'Bob Smith',
        email: 'bob.smith@student.edu',
        password: 'password123',
        role: 'student',
        skills: ['Python', 'Django', 'Machine Learning', 'Data Science']
    },
    {
        name: 'Carol White',
        email: 'carol.white@student.edu',
        password: 'password123',
        role: 'student',
        skills: ['Java', 'Spring Boot', 'Microservices', 'Docker']
    },
    {
        name: 'Dr. Robert Williams',
        email: 'registrar@mit.edu',
        password: 'password123',
        role: 'institution',
        organization: 'Massachusetts Institute of Technology'
    },
    {
        name: 'Prof. Emily Davis',
        email: 'admin@stanford.edu',
        password: 'password123',
        role: 'institution',
        organization: 'Stanford University'
    },
    {
        name: 'Jennifer Smith',
        email: 'hr@google.com',
        password: 'password123',
        role: 'recruiter',
        organization: 'Google LLC'
    },
    {
        name: 'Mark Thompson',
        email: 'recruiting@microsoft.com',
        password: 'password123',
        role: 'recruiter',
        organization: 'Microsoft Corporation'
    },
    {
        name: 'Amanda Rodriguez',
        email: 'talent@amazon.com',
        password: 'password123',
        role: 'recruiter',
        organization: 'Amazon.com Inc.'
    },
    {
        name: 'System Administrator',
        email: 'admin@bose.edu',
        password: 'password123',
        role: 'admin',
        organization: 'BOSE System'
    }
];

async function seedDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing data (except certificates which already have data)
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Job.deleteMany({});
        await Applicant.deleteMany({});
        await Notification.deleteMany({});
        await Message.deleteMany({});
        console.log('✅ Cleared existing data\n');

        // Insert Users
        console.log('👥 Creating users...');
        // Hash passwords before inserting (insertMany bypasses pre-save hooks)
        const usersWithHashedPasswords = await Promise.all(
            dummyUsers.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10)
            }))
        );
        const createdUsers = await User.insertMany(usersWithHashedPasswords);
        console.log(`✅ Created ${createdUsers.length} users\n`);

        // Get specific users for reference
        const students = createdUsers.filter(u => u.role === 'student');
        const recruiters = createdUsers.filter(u => u.role === 'recruiter');
        const institutions = createdUsers.filter(u => u.role === 'institution');

        // Insert Jobs
        console.log('💼 Creating jobs...');
        const dummyJobs = [
            {
                recruiterId: recruiters[0]._id,
                title: 'Full Stack Developer',
                description: 'We are looking for a talented Full Stack Developer to join our team. Must have experience with React, Node.js, and MongoDB.',
                location: 'San Francisco, CA',
                status: 'active',
                applicantsCount: 0
            },
            {
                recruiterId: recruiters[0]._id,
                title: 'Senior Backend Engineer',
                description: 'Seeking an experienced backend engineer with expertise in microservices architecture and cloud platforms.',
                location: 'Remote',
                status: 'active',
                applicantsCount: 0
            },
            {
                recruiterId: recruiters[1]._id,
                title: 'Machine Learning Engineer',
                description: 'Join our AI team to build cutting-edge ML models. Experience with Python, TensorFlow, and PyTorch required.',
                location: 'New York, NY',
                status: 'active',
                applicantsCount: 0
            },
            {
                recruiterId: recruiters[1]._id,
                title: 'DevOps Engineer',
                description: 'Looking for a DevOps engineer to manage our cloud infrastructure. AWS/Azure experience preferred.',
                location: 'Austin, TX',
                status: 'active',
                applicantsCount: 0
            },
            {
                recruiterId: recruiters[2]._id,
                title: 'Frontend Developer',
                description: 'Create beautiful, responsive user interfaces using React and modern CSS frameworks.',
                location: 'Remote',
                status: 'active',
                applicantsCount: 0
            },
            {
                recruiterId: recruiters[2]._id,
                title: 'Data Scientist',
                description: 'Analyze complex datasets and build predictive models to drive business decisions.',
                location: 'Boston, MA',
                status: 'closed',
                applicantsCount: 0
            }
        ];

        const createdJobs = await Job.insertMany(dummyJobs);
        console.log(`✅ Created ${createdJobs.length} jobs\n`);

        // Insert Applicants
        console.log('📝 Creating job applications...');
        const dummyApplicants = [
            {
                jobId: createdJobs[0]._id,
                candidateId: students[0]._id,
                name: students[0].name,
                email: students[0].email,
                status: 'applied',
                resumeURL: 'https://example.com/resumes/alice-johnson.pdf'
            },
            {
                jobId: createdJobs[0]._id,
                candidateId: students[1]._id,
                name: students[1].name,
                email: students[1].email,
                status: 'shortlisted',
                resumeURL: 'https://example.com/resumes/bob-smith.pdf'
            },
            {
                jobId: createdJobs[2]._id,
                candidateId: students[1]._id,
                name: students[1].name,
                email: students[1].email,
                status: 'applied',
                resumeURL: 'https://example.com/resumes/bob-smith.pdf'
            },
            {
                jobId: createdJobs[4]._id,
                candidateId: students[0]._id,
                name: students[0].name,
                email: students[0].email,
                status: 'shortlisted',
                resumeURL: 'https://example.com/resumes/alice-johnson.pdf'
            },
            {
                jobId: createdJobs[1]._id,
                candidateId: students[2]._id,
                name: students[2].name,
                email: students[2].email,
                status: 'applied',
                resumeURL: 'https://example.com/resumes/carol-williams.pdf'
            }
        ];

        const createdApplicants = await Applicant.insertMany(dummyApplicants);
        console.log(`✅ Created ${createdApplicants.length} applications\n`);

        // Update job applicant counts
        for (const job of createdJobs) {
            const count = await Applicant.countDocuments({ jobId: job._id });
            await Job.findByIdAndUpdate(job._id, { applicantsCount: count });
        }

        // Insert Notifications
        console.log('🔔 Creating notifications...');
        const dummyNotifications = [
            {
                userId: students[0]._id,
                message: 'Your application for Full Stack Developer has been received',
                read: false
            },
            {
                userId: students[0]._id,
                message: 'You have been shortlisted for Frontend Developer position',
                read: true
            },
            {
                userId: students[1]._id,
                message: 'Your application for Machine Learning Engineer has been received',
                read: false
            },
            {
                userId: students[1]._id,
                message: 'Congratulations! You have been shortlisted for Full Stack Developer',
                read: false
            },
            {
                userId: recruiters[0]._id,
                message: 'New application received for Full Stack Developer position',
                read: true
            },
            {
                userId: recruiters[1]._id,
                message: 'New application received for Machine Learning Engineer position',
                read: false
            }
        ];

        const createdNotifications = await Notification.insertMany(dummyNotifications);
        console.log(`✅ Created ${createdNotifications.length} notifications\n`);

        // Insert Messages
        console.log('💬 Creating messages...');
        const dummyMessages = [
            {
                senderId: recruiters[0]._id,
                receiverId: students[0]._id,
                text: 'Hi Alice, we would like to schedule an interview for the Full Stack Developer position.',
                read: true
            },
            {
                senderId: students[0]._id,
                receiverId: recruiters[0]._id,
                text: 'Thank you! I would be happy to interview. When would be a good time?',
                read: true
            },
            {
                senderId: recruiters[0]._id,
                receiverId: students[0]._id,
                text: 'How about next Tuesday at 2 PM?',
                read: false
            },
            {
                senderId: students[1]._id,
                receiverId: recruiters[1]._id,
                text: 'I have a question about the Machine Learning Engineer role.',
                read: true
            },
            {
                senderId: recruiters[1]._id,
                receiverId: students[1]._id,
                text: 'Sure, feel free to ask!',
                read: false
            },
            {
                senderId: institutions[0]._id,
                receiverId: students[2]._id,
                text: 'Your certificate has been verified and added to the blockchain.',
                read: false
            }
        ];

        const createdMessages = await Message.insertMany(dummyMessages);
        console.log(`✅ Created ${createdMessages.length} messages\n`);

        // Print summary
        console.log('═══════════════════════════════════════════════════════');
        console.log('✨ Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   👥 Users: ${createdUsers.length}`);
        console.log(`      - Students: ${students.length}`);
        console.log(`      - Institutions: ${institutions.length}`);
        console.log(`      - Recruiters: ${recruiters.length}`);
        console.log(`   💼 Jobs: ${createdJobs.length}`);
        console.log(`   📝 Applications: ${createdApplicants.length}`);
        console.log(`   🔔 Notifications: ${createdNotifications.length}`);
        console.log(`   💬 Messages: ${createdMessages.length}`);
        console.log(`   📜 Certificates: 4 (existing data preserved)`);
        console.log('═══════════════════════════════════════════════════════\n');

        console.log('🔑 Test Login Credentials:');
        console.log('   Student: alice.johnson@student.edu / password123');
        console.log('   Recruiter: hr@google.com / password123');
        console.log('   Institution: registrar@mit.edu / password123');
        console.log('   Admin: admin@bose.edu / password123\n');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the seeding
seedDatabase();

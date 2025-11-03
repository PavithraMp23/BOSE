// bose-backend/server.js
'use strict';
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const crypto = require("crypto");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const Certificate = require("./models/certificateModel.js");
const { addCertificate, queryCertificate, addSkill, querySkill } = require("../bose-client/app.js");
const path = require('path');
const fs = require('fs'); // if not already imported
const { Wallets } = require('fabric-network');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ============ Helper: Generate SHA256 hash ============
function generateCertHash(fileBuffer) {
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

// 1️.Student uploads certificate (pending verification)
app.post("/api/certificate/upload", upload.single("certificate"), async (req, res) => {
    try {
        const { studentId, studentName, course, institution, grade, issueDate } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ error: "Certificate file is required" });

        const hash = generateCertHash(file.buffer);
        const certId = `CERT_${studentId}_${Date.now()}`;

        // Store temporarily in MongoDB
        await Certificate.create({
            certId,
            studentId,
            studentName,
            course,
            institution,
            grade,
            issueDate,
            fileHash: hash,
            status: "PENDING",
        });

        res.json({
            success: true,
            message: "Certificate uploaded and awaiting verification.",
            certificateId: certId,
            fileHash: hash,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to upload certificate", details: err.message });
    }
});

// 2. Institution verifies and adds to blockchain
app.post("/api/certificate/approve/:certId", async (req, res) => {
    try {
        const { certId } = req.params;
        const { identity } = req.body;

        const cert = await Certificate.findOne({ certId });
        if (!cert) return res.status(404).json({ error: "Certificate not found" });
        if (cert.status !== "PENDING")
            return res.status(400).json({ error: "Certificate already verified" });

        await addCertificate(
            identity,
            cert.certId,
            cert.studentId,
            cert.studentName,
            cert.course,
            cert.institution,
            cert.grade,
            cert.issueDate,
            cert.fileHash
        );

        cert.status = "VERIFIED";
        await cert.save();

        res.json({ success: true, message: "Certificate verified and added to blockchain." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Verification failed", details: err.message });
    }
});

// 3. Anyone can query certificate from blockchain
app.get("/api/certificate/:certId", async (req, res) => {
    try {
        const { certId } = req.params;
        const identity = req.query.identity || "college_xyz";

        const result = await queryCertificate(identity, certId);
        res.json({ success: true, certificate: JSON.parse(result) });
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: "Certificate not found", details: err.message });
    }
});

// 4️. Third-party verification by uploading the file
app.post("/api/certificate/verify", upload.single("certificate"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: "Certificate file is required" });

        const hash = generateCertHash(file.buffer);
        const identity = req.body.identity || "college_xyz";

        //  Check MongoDB first
        const cert = await Certificate.findOne({ fileHash: hash });

        if (!cert) {
            return res.status(404).json({
                verified: false,
                error: "Certificate not found in the system"
            });
        }

        if (cert.status !== "VERIFIED") {
            return res.status(400).json({
                verified: false,
                error: "Certificate has not been verified by the institution yet"
            });
        }

        //  Query blockchain for authenticity
        const result = await queryCertificate(identity, cert.certId);

        res.json({
            success: true,
            verified: true,
            certificate: JSON.parse(result)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            verified: false,
            error: "Certificate verification failed",
            details: err.message
        });
    }
});


// 5. Skill Endpoints
app.post("/api/skill/add", async (req, res) => {
    try {
        const { skillId, studentId, studentName, skillName, category, level, issuer, identity } = req.body;

        if (!skillId || !studentId || !skillName || !identity)
            return res.status(400).json({ error: "Missing required fields" });

        await addSkill(identity, skillId, studentId, studentName, skillName, category, level, issuer);
        res.json({ success: true, skillId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add skill", details: err.message });
    }
});

app.get("/api/skill/:skillId", async (req, res) => {
    try {
        const { skillId } = req.params;
        const identity = req.query.identity || "college_xyz";

        const result = await querySkill(identity, skillId);
        res.json({ success: true, skill: JSON.parse(result) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Skill not found", details: err.message });
    }
});
async function checkIdentity() {
    try {
        // Load wallet from filesystem
        const walletPath = path.join(__dirname,'..', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get('college_xyz');
        if (!identity) {
            console.log('Identity not found in wallet');
            return;
        }

        console.log('MSP ID:', identity.mspId);
    } catch (err) {
        console.error('Error fetching identity:', err);
    }
}

checkIdentity();

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(` BOSE Backend running on port ${PORT}`));

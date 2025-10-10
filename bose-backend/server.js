// bose-backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');
const { addCertificate, queryCertificate } = require('../bose-client/app');

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: Generate hash of certificate
function generateCertHash(fileBuffer) {
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

// Upload certificate
app.post('/api/certificate/upload', upload.single('certificate'), async (req, res) => {
    try {
        const { studentId, studentName, course, institution, grade, issueDate } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ error: 'Certificate file is required' });

        const hash = generateCertHash(file.buffer);
        const certId = `CERT_${studentId}_${Date.now()}`;

        await addCertificate(certId, studentId, studentName, course, institution, grade, issueDate, hash);

        res.json({ success: true, certificateId: certId, hash });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload certificate' });
    }
});

// Query certificate
app.get('/api/certificate/:certId', async (req, res) => {
    try {
        const { certId } = req.params;
        const result = await queryCertificate(certId);
        res.json({ success: true, certificate: JSON.parse(result) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Certificate not found' });
    }
});

const PORT =3002;
app.listen(PORT, () => console.log(`BOSE Backend running on port ${PORT}`));

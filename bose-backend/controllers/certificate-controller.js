// controllers/certificate-controller.js
const Certificate = require('../models/certificateModel');
const { generateCertHash } = require('../services/hash-services');
const { addCertificate, queryCertificate } = require('../../bose-client/app');
const { identityService } = require('../../bose-client/services/identity-services');

exports.uploadCertificate = async (req, res) => {
  try {
    const { studentId, studentName, course, institution, grade, issueDate } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Certificate file is required' });
    }

    const fileHash = generateCertHash(file.buffer);
    const certId = `CERT_${studentId}_${Date.now()}`;

    await Certificate.create({
      certId,
      studentId,
      studentName,
      course,
      institution,
      grade,
      issueDate,
      fileHash,
      status: 'PENDING'
    });

    res.json({
      success: true,
      message: 'Certificate uploaded and awaiting verification',
      certificateId: certId,
      fileHash
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveCertificate = async (req, res) => {
  try {
    const { certId } = req.params;
    const { identity } = req.body;

    const cert = await Certificate.findOne({ certId });
    if (!cert) return res.status(404).json({ error: 'Certificate not found' });

    if (cert.status !== 'PENDING') {
      return res.status(400).json({ error: 'Certificate already verified' });
    }

    // 🔐 AUTHORIZATION CHECK
    if (identity !== cert.institution) {
      return res.status(403).json({
        error: 'Unauthorized institution'
      });
    }

    await identityService.enrollUser({
      userId: identity,
      role: 'institution'
    });

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

    cert.status = 'VERIFIED';
    await cert.save();

    res.json({ success: true, message: 'Certificate verified and added to blockchain' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getCertificate = async (req, res) => {
  try {
    const identity = req.query.identity || 'college_xyz';
    const result = await queryCertificate(identity, req.params.certId);
    res.json({ success: true, certificate: JSON.parse(result) });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.verifyByFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Certificate file is required' });

    const hash = generateCertHash(file.buffer);
    const cert = await Certificate.findOne({ fileHash: hash });

    if (!cert) {
      return res.status(404).json({ verified: false, error: 'Certificate not found' });
    }

    if (cert.status !== 'VERIFIED') {
      return res.status(400).json({ verified: false, error: 'Not verified yet' });
    }

    const identity = req.body.identity || 'college_xyz';
    const result = await queryCertificate(identity, cert.certId);

    res.json({
      success: true,
      verified: true,
      certificate: JSON.parse(result)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

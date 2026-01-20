// routes/certificate-routes.js
const express = require('express');
const multer = require('multer');
const controller = require('../controllers/certificate-controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('certificate'), controller.uploadCertificate);
router.post('/approve/:certId', controller.approveCertificate);
router.get('/:certId', controller.getCertificate);
router.post('/verify', upload.single('certificate'), controller.verifyByFile);

module.exports = router;

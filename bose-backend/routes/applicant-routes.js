const express = require('express');
const { getApplicants, updateStatus } = require('../controllers/applicantController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:jobId', protect, getApplicants);
router.post('/:id/status', protect, updateStatus);

module.exports = router;

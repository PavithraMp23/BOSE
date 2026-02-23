const express = require('express');
const { searchCandidates, getNotifications, markNotificationRead, getMessages, sendMessage } = require('../controllers/recruiterController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/candidates/search', protect, searchCandidates);
router.get('/notifications', protect, getNotifications);
router.post('/notifications/:id/read', protect, markNotificationRead);
router.get('/messages/:candidateId', protect, getMessages);
router.post('/messages/:candidateId', protect, sendMessage);

module.exports = router;

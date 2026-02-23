const express = require('express');
const { createJob, getMyJobs, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createJob);
router.route('/my').get(protect, getMyJobs);
router.route('/:id').put(protect, updateJob).delete(protect, deleteJob);

module.exports = router;

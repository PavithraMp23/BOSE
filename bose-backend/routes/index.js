// routes/index.js
const express = require('express');
const router = express.Router();

const certificateRoutes = require('./certificate-routes');
const skillRoutes = require('./skill-routes');

router.use('/certificate', certificateRoutes);
router.use('/skill', skillRoutes);
router.use('/admin', require('./admin-routes'));
router.use('/auth', require('./auth-routes'));

router.use('/jobs', require('./job-routes'));
router.use('/applicants', require('./applicant-routes'));
router.use('/', require('./recruiter-routes')); // Root level for recruiter/notification/message paths to match frontend shorthand


module.exports = router;

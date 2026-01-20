const express = require('express');
const controller = require('../controllers/admin-controller');
const router = express.Router();

router.post('/identity/register', controller.registerIdentity);

module.exports = router;

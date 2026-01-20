// routes/skill-routes.js
const express = require('express');
const controller = require('../controllers/skills-controller');

const router = express.Router();

router.post('/add', controller.addSkill);
router.get('/:skillId', controller.getSkill);

module.exports = router;

// controllers/skill.controller.js
const { addSkill, querySkill } = require('../../bose-client/app');
const { identityService } = require('../../bose-client/services/identity-services');

exports.addSkill = async (req, res) => {
  try {
    const { skillId, studentId, studentName, skillName, category, level, issuer, identity } = req.body;

    // ✅ NEW: ensure issuer identity exists
    await identityService.enrollUser({
      userId: identity,
      role: 'institution'
    });

    await addSkill(
      identity,
      skillId,
      studentId,
      studentName,
      skillName,
      category,
      level,
      issuer
    );

    res.json({ success: true, skillId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSkill = async (req, res) => {
  try {
    const identity = req.query.identity || 'college_xyz';
    const result = await querySkill(identity, req.params.skillId);
    res.json({ success: true, skill: JSON.parse(result) });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const { identityService } = require('../../bose-client/services/identity-services');

exports.registerIdentity = async (req, res) => {
  try {
    const { userId, role } = req.body;

    await identityService.enrollUser({ userId, role });

    res.json({
      success: true,
      message: `Identity ${userId} registered with role ${role}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

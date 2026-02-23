const Applicant = require('../models/applicantModel');
const Job = require('../models/jobModel');

exports.getApplicants = async (req, res) => {
    try {
        // Check if job belongs to recruiter
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.recruiterId.toString() !== req.user.id) return res.status(401).json({ error: 'Not authorized' });

        const applicants = await Applicant.find({ jobId: req.params.jobId }).sort({ appliedAt: -1 });
        res.json(applicants);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch applicants' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.params.id);
        if (!applicant) return res.status(404).json({ error: 'Applicant not found' });

        // Verify ownership via job
        const job = await Job.findById(applicant.jobId);
        if (job.recruiterId.toString() !== req.user.id) return res.status(401).json({ error: 'Not authorized' });

        applicant.status = req.body.status;
        await applicant.save();
        res.json(applicant);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update status' });
    }
};

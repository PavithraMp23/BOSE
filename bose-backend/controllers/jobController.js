const Job = require('../models/jobModel');

exports.createJob = async (req, res) => {
    try {
        const { title, description, location, status } = req.body;
        const job = await Job.create({
            recruiterId: req.user.id,
            title,
            description,
            location,
            status,
        });
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create job' });
    }
};

exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiterId: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.recruiterId.toString() !== req.user.id) return res.status(401).json({ error: 'Not authorized' });

        Object.assign(job, req.body);
        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update job' });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.recruiterId.toString() !== req.user.id) return res.status(401).json({ error: 'Not authorized' });

        await Job.deleteOne({ _id: req.params.id });
        res.json({ message: 'Job removed' });
    } catch (err) {
        console.error(err); // Log basic error
        res.status(500).json({ error: 'Failed to delete job' });
    }
};


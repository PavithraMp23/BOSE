const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming candidates are Users
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'hired'], default: 'applied' },
    resumeURL: { type: String },
    appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Applicant', applicantSchema);

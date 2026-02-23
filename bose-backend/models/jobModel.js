const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
    applicantsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);

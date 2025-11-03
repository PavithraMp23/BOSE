// bose-backend/models/certificateModel.js
const mongoose = require("mongoose");
const certificateSchema = new mongoose.Schema(
  {
    certId: { type: String, required: true, unique: true }, // unique internal ID
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    course: { type: String, required: true },
    institution: { type: String, required: true },
    grade: { type: String },
    issueDate: { type: Date, required: true },
    fileHash: { type: String, required: true }, // SHA256 of uploaded file
    blockchainId: { type: String }, // ID in blockchain after verification
    status: { 
      type: String, 
      enum: ['PENDING', 'VERIFIED', 'FAILED'], 
      default: 'PENDING' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Middleware: update `updatedAt` automatically
certificateSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;

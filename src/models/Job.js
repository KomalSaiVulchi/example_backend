const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      trim: true
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary', 'other'],
      default: 'full-time'
    },
    salaryRange: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 }
    },
    skills: {
      type: [String],
      default: []
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text', location: 1 });

module.exports = mongoose.model('Job', jobSchema);

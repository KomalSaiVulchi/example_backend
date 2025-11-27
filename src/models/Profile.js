const mongoose = require('mongoose');
const { ROLE_VALUES } = require('../constants/roles');

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, trim: true },
    title: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String }
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      required: true
    },
    headline: {
      type: String,
      trim: true,
      maxlength: 160
    },
    bio: {
      type: String,
      maxlength: 4000
    },
    location: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    skills: {
      type: [String],
      default: []
    },
    experience: {
      type: [experienceSchema],
      default: []
    },
    socialLinks: {
      type: Map,
      of: String,
      default: {}
    },
    companyDetails: {
      name: { type: String, trim: true },
      industry: { type: String, trim: true },
      companySize: { type: String, trim: true },
      founded: { type: Number, min: 1800 },
      mission: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);

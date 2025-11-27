const mongoose = require('mongoose');
const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');

const listJobs = asyncHandler(async (req, res) => {
  const { search, employmentType, isActive } = req.query;

  const filters = {};

  if (employmentType) {
    filters.employmentType = employmentType;
  }

  if (typeof isActive !== 'undefined') {
    filters.isActive = isActive === 'true';
  }

  if (search) {
    filters.$text = { $search: search };
  }

  const jobs = await Job.find(filters)
    .sort({ createdAt: -1 })
    .populate('company', 'name email role');

  res.json({ jobs });
});

const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid job id' });
  }

  const job = await Job.findById(id).populate('company', 'name email role');

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json({ job });
});

const createJob = asyncHandler(async (req, res) => {
  const { title, description, location, employmentType, salaryRange, skills, isActive } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const job = await Job.create({
    title,
    description,
    location,
    employmentType,
    salaryRange,
    skills,
    isActive,
    company: req.user._id
  });

  res.status(201).json({ job });
});

const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid job id' });
  }

  const job = await Job.findById(id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.company.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Unauthorized to update this job' });
  }

  const updates = req.body;
  Object.assign(job, updates);
  await job.save();

  res.json({ job });
});

const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid job id' });
  }

  const job = await Job.findById(id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.company.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Unauthorized to delete this job' });
  }

  await job.deleteOne();

  res.status(204).send();
});

module.exports = {
  listJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
};

const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');

const createApplication = asyncHandler(async (req, res) => {
  const { jobId, coverLetter, resumeUrl } = req.body;

  if (!jobId) {
    return res.status(400).json({ error: 'jobId is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ error: 'Invalid job id' });
  }

  const job = await Job.findById(jobId);

  if (!job || !job.isActive) {
    return res.status(404).json({ error: 'Job is not available' });
  }

  if (job.company.toString() === req.user._id.toString()) {
    return res.status(400).json({ error: 'Cannot apply to your own job posting' });
  }

  const existing = await Application.findOne({
    job: job._id,
    applicant: req.user._id
  });

  if (existing) {
    return res.status(409).json({ error: 'Application already submitted for this job' });
  }

  const application = await Application.create({
    job: job._id,
    applicant: req.user._id,
    coverLetter,
    resumeUrl
  });

  res.status(201).json({ application });
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate({ path: 'job', populate: { path: 'company', select: 'name email' } })
    .sort({ createdAt: -1 });

  res.json({ applications });
});

const getApplicationsForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ error: 'Invalid job id' });
  }

  const job = await Job.findById(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.company.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Unauthorized to view applications for this job' });
  }

  const applications = await Application.find({ job: jobId })
    .populate('applicant', 'name email role')
    .sort({ createdAt: -1 });

  res.json({ applications });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const allowedStatuses = ['pending', 'review', 'accepted', 'rejected'];
  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid application id' });
  }

  const application = await Application.findById(id).populate('job');

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  if (application.job.company.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Unauthorized to update this application' });
  }

  if (status) {
    application.status = status;
  }

  if (notes) {
    application.notes = notes;
  }

  await application.save();

  res.json({ application });
});

const withdrawApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid application id' });
  }

  const application = await Application.findById(id);

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  if (application.applicant.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Unauthorized to withdraw this application' });
  }

  await application.deleteOne();

  res.status(204).send();
});

module.exports = {
  createApplication,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  withdrawApplication
};

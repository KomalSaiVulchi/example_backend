const express = require('express');
const {
  createApplication,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  withdrawApplication
} = require('../controllers/applicationController');
const { authenticate, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.post('/', authenticate, requireRole(ROLES.APPLICANT), createApplication);
router.get('/me', authenticate, requireRole(ROLES.APPLICANT), getMyApplications);
router.get('/job/:jobId', authenticate, requireRole(ROLES.COMPANY), getApplicationsForJob);
router.patch('/:id/status', authenticate, requireRole(ROLES.COMPANY), updateApplicationStatus);
router.delete('/:id', authenticate, requireRole(ROLES.APPLICANT), withdrawApplication);

module.exports = router;

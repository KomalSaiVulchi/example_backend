const express = require('express');
const {
  listJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { authenticate, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/', listJobs);
router.get('/:id', getJobById);
router.post('/', authenticate, requireRole(ROLES.COMPANY), createJob);
router.patch('/:id', authenticate, requireRole(ROLES.COMPANY), updateJob);
router.delete('/:id', authenticate, requireRole(ROLES.COMPANY), deleteJob);

module.exports = router;

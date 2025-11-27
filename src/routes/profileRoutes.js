const express = require('express');
const { getMyProfile, upsertMyProfile, getProfileByUserId } = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/me', authenticate, getMyProfile);
router.put('/me', authenticate, upsertMyProfile);
router.get('/:userId', authenticate, getProfileByUserId);

module.exports = router;

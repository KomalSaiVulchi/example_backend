const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  res.json({ profile });
});

const upsertMyProfile = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  updates.user = req.user._id;
  updates.role = req.user.role;

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    updates,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({ profile });
});

const getProfileByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  const profile = await Profile.findOne({ user: userId }).populate('user', 'name email role');

  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  res.json({ profile });
});

module.exports = {
  getMyProfile,
  upsertMyProfile,
  getProfileByUserId
};

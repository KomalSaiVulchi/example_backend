const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ROLE_VALUES } = require('../constants/roles');
const asyncHandler = require('../utils/asyncHandler');

const createToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      sub: userId,
      role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!ROLE_VALUES.includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, role });
  const token = createToken(user._id.toString(), user.role);

  res.status(201).json({
    token,
    user: user.toJSON()
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isMatch = await user.isPasswordMatch(password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = createToken(user._id.toString(), user.role);

  res.json({
    token,
    user: user.toJSON()
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = {
  register,
  login,
  getMe
};

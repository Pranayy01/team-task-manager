import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...(name && { name }), ...(avatar !== undefined && { avatar }) },
    { new: true, runValidators: true }
  );

  res.json({ success: true, data: user });
});

export const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(filter).select('name email role avatar').limit(20);

  res.json({ success: true, data: users });
});

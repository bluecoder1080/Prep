import express, { Request, Response } from 'express';
import { requireAuth } from '../middleware/clerkAuth';
import { User } from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// @route   GET /api/clerk-auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const clerkUserId = req.auth?.userId;
  
  if (!clerkUserId) {
    res.status(401).json({
      success: false,
      error: 'User not authenticated'
    });
    return;
  }

  // Find or create user in our database
  let user = await User.findOne({ clerkId: clerkUserId });
  
  if (!user) {
    // Create a new user record if it doesn't exist
    user = new User({
      clerkId: clerkUserId,
      name: 'New User', // This will be updated from Clerk webhook
      email: '', // This will be updated from Clerk webhook
      role: 'student'
    });
    await user.save();
    logger.info(`New user created from Clerk: ${clerkUserId}`);
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    }
  });
}));

// @route   POST /api/clerk-auth/sync-user
// @desc    Sync user data from Clerk
// @access  Private
router.post('/sync-user', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const clerkUserId = req.auth?.userId;
  const { name, email, profileData } = req.body;
  
  if (!clerkUserId) {
    res.status(401).json({
      success: false,
      error: 'User not authenticated'
    });
    return;
  }

  // Find or create user
  let user = await User.findOne({ clerkId: clerkUserId });
  
  if (!user) {
    user = new User({
      clerkId: clerkUserId,
      name: name || 'New User',
      email: email || '',
      role: 'student'
    });
  } else {
    // Update existing user
    if (name) user.name = name;
    if (email) user.email = email;
    user.lastLogin = new Date();
  }

  // Update additional profile data if provided
  if (profileData) {
    Object.assign(user, profileData);
  }

  await user.save();

  logger.info(`User synced from Clerk: ${email || clerkUserId}`);

  res.json({
    success: true,
    message: 'User data synced successfully',
    data: {
      user: {
        id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    }
  });
}));

// @route   DELETE /api/clerk-auth/delete-account
// @desc    Delete user account
// @access  Private
router.delete('/delete-account', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const clerkUserId = req.auth?.userId;
  
  if (!clerkUserId) {
    res.status(401).json({
      success: false,
      error: 'User not authenticated'
    });
    return;
  }

  // Delete user from our database
  const user = await User.findOneAndDelete({ clerkId: clerkUserId });
  
  if (user) {
    logger.info(`User account deleted: ${user.email || clerkUserId}`);
  }

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
}));

export default router;

import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { User } from '../models/User';

const router = express.Router();

// GET /api/users/:id — get user (self or admin)
router.get('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const requester = req.user!;

  if (requester.userId !== id && requester.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  res.json({ success: true, data: user });
}));

// PUT /api/users/:id — update basic user fields
router.put('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const requester = req.user!;

  if (requester.userId !== id && requester.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  const allowed = ['name', 'role'];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }

  const user = await User.findByIdAndUpdate(id, updates, { new: true });
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  res.json({ success: true, data: user });
}));

export default router;

import express, { Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { Resume } from '../models/Resume';

const router = express.Router();

router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const list = await Resume.find({ userId: req.user!.userId }).sort({ createdAt: -1 });
  res.json({ success: true, data: list });
}));

router.delete('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const deleted = await Resume.findOneAndDelete({ _id: id, userId: req.user!.userId });
  if (!deleted) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: deleted });
}));

export default router;

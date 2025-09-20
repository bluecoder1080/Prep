import express, { Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { Project } from '../models/Project';

const router = express.Router();

router.post('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const created = await Project.create({ ...req.body, userId: req.user!.userId });
  res.status(201).json({ success: true, data: created });
}));

router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const list = await Project.find({ userId: req.user!.userId }).sort({ createdAt: -1 });
  res.json({ success: true, data: list });
}));

router.put('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updated = await Project.findOneAndUpdate({ _id: id, userId: req.user!.userId }, req.body, { new: true });
  if (!updated) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: updated });
}));

router.delete('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const deleted = await Project.findOneAndDelete({ _id: id, userId: req.user!.userId });
  if (!deleted) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: deleted });
}));

export default router;

import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { Profile } from '../models/Profile';
import { PsychotestResult } from '../models/PsychotestResult';
import { aiService } from '../services/aiProviders';

const router = express.Router();

// POST /api/profiles — create or update student profile
router.post('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const existing = await Profile.findOne({ userId });
  if (existing) {
    await Profile.updateOne({ userId }, { $set: req.body });
    const updated = await Profile.findOne({ userId });
    return res.json({ success: true, data: updated });
  }
  const created = await Profile.create({ userId, ...req.body });
  res.status(201).json({ success: true, data: created });
}));

// GET /api/profiles/:id — get profile + aggregated recommendations
router.get('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // userId
  if (req.user!.userId !== id && req.user!.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  const profile = await Profile.findOne({ userId: id });
  if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' });

  const latestPsy = await PsychotestResult.findOne({ userId: id }).sort({ createdAt: -1 });
  const context = `Profile: ${JSON.stringify(profile)}\n\nTraits: ${latestPsy ? JSON.stringify(latestPsy.scores) : 'N/A'}`;
  const ai = await aiService.generateResponse('Provide 3 career path recommendations and key skill gaps for this user.', context);

  res.json({ success: true, data: { profile, recommendations: ai.content } });
}));

export default router;

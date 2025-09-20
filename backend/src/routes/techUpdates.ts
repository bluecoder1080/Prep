import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { TechUpdate } from '../models/TechUpdate';

const router = express.Router();

// GET /api/tech-updates — returns latest trends, tags, and matched careers
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(parseInt((req.query.limit as string) || '20'), 100);
  const items = await TechUpdate.find({ isActive: true }).sort({ publishedAt: -1 }).limit(limit);

  res.json({ success: true, data: items });
}));

export default router;

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { Resume } from '../models/Resume';

const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) { cb(null, uploadDir); },
  filename: function (_req, file, cb) { cb(null, `${Date.now()}-${file.originalname}`); }
});
const upload = multer({ storage });

// POST /api/upload/resume — resume file upload + extract text -> auto-fill profile skills
router.post('/resume', authenticate, upload.single('file'), asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
  const userId = req.user!.userId;

  const filePath = path.resolve(req.file.path);
  let extractedText = '';
  if (req.file.mimetype === 'application/pdf') {
    const data = await pdfParse(fs.readFileSync(filePath));
    extractedText = data.text;
  } else {
    extractedText = fs.readFileSync(filePath, 'utf-8');
  }

  // naive skill extraction
  const skillsList = ['python','java','javascript','typescript','react','node','mongodb','sql','aws','gcp','docker','kubernetes','ml','data','cloud'];
  const lower = extractedText.toLowerCase();
  const skills = skillsList.filter(s => lower.includes(s));

  const rec = await Resume.create({ userId, title: req.file.originalname, url: filePath, extractedText, skills });
  res.status(201).json({ success: true, data: rec });
}));

export default router;

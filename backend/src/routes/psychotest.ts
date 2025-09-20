import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { PsychotestResult, IPersonalityScores } from '../models/PsychotestResult';
import { Profile } from '../models/Profile';
import { aiService } from '../services/aiProviders';

const router = express.Router();

// Helper to compute Big Five scores (simple mapping)
const computeScores = (answers: Array<{ questionId: number; answer: number }>): IPersonalityScores => {
  // naive: distribute questions across traits
  const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as const;
  const buckets: Record<string, number[]> = { openness: [], conscientiousness: [], extraversion: [], agreeableness: [], neuroticism: [] };
  for (const a of answers) {
    const t = traits[(a.questionId - 1) % traits.length];
    buckets[t].push(a.answer);
  }
  const avg = (arr: number[]) => arr.length ? (arr.reduce((s, x) => s + x, 0) / arr.length) : 0;
  return {
    openness: Math.round(avg(buckets.openness) * 20),
    conscientiousness: Math.round(avg(buckets.conscientiousness) * 20),
    extraversion: Math.round(avg(buckets.extraversion) * 20),
    agreeableness: Math.round(avg(buckets.agreeableness) * 20),
    neuroticism: Math.round((6 - avg(buckets.neuroticism)) * 20) // invert
  };
};

// POST /api/psychotest — submit answers -> calculate traits -> store -> call model to generate roadmap
router.post('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { answers } = req.body as { answers: Array<{ questionId: number; answer: number; question?: string }> };
  if (!Array.isArray(answers) || answers.length < 5) {
    return res.status(400).json({ success: false, error: 'At least 5 answers required' });
  }

  const scores = computeScores(answers);
  const profile = await Profile.findOne({ userId });

  const context = `Profile: ${profile ? JSON.stringify({ education: profile.education, interests: profile.interests, skills: profile.skills }) : 'N/A'}\nTraits: ${JSON.stringify(scores)}`;
  const ai = await aiService.generateResponse('Create a 6-month personalized learning roadmap with 3 milestones and key resources.', context);

  const created = await PsychotestResult.create({
    userId,
    answers: answers.map(a => ({ questionId: a.questionId, answer: a.answer, question: a.question || '' })),
    scores,
    recommendedCareers: [
      { title: 'Software Engineer', description: 'Build web apps', matchPercentage: 78, requiredSkills: ['JS', 'React', 'Node'], growthProspects: 'High', reasoning: 'Based on traits and profile' },
      { title: 'Data Analyst', description: 'Analyze data', matchPercentage: 72, requiredSkills: ['SQL', 'Python', 'Viz'], growthProspects: 'High', reasoning: 'Profile alignment' }
    ],
    skillGaps: ['System Design', 'Cloud Basics'],
    learningPath: [
      { phase: 'Foundation', duration: '2 months', skills: ['JS', 'TS', 'Git'], resources: ['MDN', 'freeCodeCamp'] },
      { phase: 'Projects', duration: '2 months', skills: ['React', 'APIs'], resources: ['Frontend Mentor', 'Vite docs'] },
      { phase: 'Infra', duration: '2 months', skills: ['Node', 'Cloud'], resources: ['Node docs', 'GCP free tier'] }
    ],
    aiInsights: ai.content
  });

  res.status(201).json({ success: true, data: created });
}));

export default router;

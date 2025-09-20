import express, { Response } from 'express';
import { authenticate, AuthRequest, optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { Chat } from '../models/Chat';
import { retrieveNearest } from '../services/rag';
import { aiService } from '../services/aiProviders';
import { Profile } from '../models/Profile';

const router = express.Router();

// POST /api/chat — send user message -> save -> call model with context & RAG -> save assistant reply
router.post('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { message, sessionId, provider } = req.body as { message: string; sessionId?: string; provider?: 'vertex' | 'huggingface' };
  const userId = req.user!.userId;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  const sid = sessionId || `${userId}-${Date.now()}`;

  // Load user profile for context
  const profile = await Profile.findOne({ userId });
  const profileContext = profile ? `User profile: ${JSON.stringify({ education: profile.education, interests: profile.interests, skills: profile.skills })}` : 'No profile available';

  // Retrieve RAG content
  const ragResults = await retrieveNearest(message, 3);
  const ragContext = ragResults.map(r => `- ${r.doc.title}: ${r.doc.text.substring(0, 300)} (score=${r.score.toFixed(2)})`).join('\n');
  const context = `${profileContext}\n\nRelevant documents:\n${ragContext}`;

  const start = Date.now();
  const ai = await aiService.generateResponse(message, context, provider);

  // Save to DB (upsert chat by sessionId)
  const chat = await Chat.findOneAndUpdate(
    { userId, sessionId: sid },
    {
      $setOnInsert: { userId, sessionId: sid, modelUsed: provider || 'mock' },
      $push: {
        messages: {
          $each: [
            { role: 'user', content: message, timestamp: new Date() },
            { role: 'assistant', content: ai.content, timestamp: new Date(), metadata: { modelUsed: ai.model, processingTime: ai.processingTime } }
          ]
        }
      },
      $set: { context: { profileData: profile, ragContent: ragResults.map(r => r.doc.title) }, modelUsed: provider || 'mock' }
    },
    { upsert: true, new: true }
  );

  const elapsed = Date.now() - start;

  res.json({ success: true, data: { sessionId: sid, reply: ai.content, elapsedMs: elapsed, model: ai.model, chatId: chat._id } });
}));

// GET /api/chat/:userId — fetch conversation history
router.get('/:userId', optionalAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  // Allow owner or admin, or public anonymized titles if not authenticated
  const isOwnerOrAdmin = req.user && (req.user.userId === userId || req.user.role === 'admin');

  const chats = await Chat.find({ userId }).sort({ updatedAt: -1 }).limit(50);
  if (!isOwnerOrAdmin) {
    // redact messages
    return res.json({ success: true, data: chats.map(c => ({ _id: c._id, sessionId: c.sessionId, title: c.title, updatedAt: c.updatedAt })) });
  }
  res.json({ success: true, data: chats });
}));

export default router;

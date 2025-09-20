import { EmbeddingDoc, IEmbeddingDoc } from '../models/EmbeddingDoc';
import { aiService } from './aiProviders';
import { cosineSimilarity } from '../utils/math';

export interface RetrievalResult {
  doc: IEmbeddingDoc;
  score: number;
}

export const embedAndStore = async (payload: {
  docId: string;
  source: 'job' | 'report' | 'blog' | 'manual';
  title: string;
  text: string;
  tags?: string[];
  skills?: string[];
}): Promise<IEmbeddingDoc> => {
  const embedding = (await aiService.generateEmbedding(payload.text)).embedding;
  const created = await EmbeddingDoc.create({
    ...payload,
    tags: payload.tags || [],
    skills: payload.skills || [],
    embedding
  });
  return created;
};

export const retrieveNearest = async (query: string, k = 5): Promise<RetrievalResult[]> => {
  const queryEmbedding = (await aiService.generateEmbedding(query)).embedding;
  const docs = await EmbeddingDoc.find().limit(200); // naive approach
  const scores = docs.map((doc) => ({
    doc,
    score: cosineSimilarity(queryEmbedding, doc.embedding)
  }));
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, k);
};

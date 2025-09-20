import axios from 'axios';
import { connectDB, disconnectDB } from '../config/database';
import { TechUpdate } from '../models/TechUpdate';
import { aiService } from '../services/aiProviders';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const fetchHackerNews = async () => {
  try {
    const top = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids: number[] = top.data.slice(0, 10);
    for (const id of ids) {
      const item = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      const title = item.data.title as string;
      const url = item.data.url as string | undefined;
      if (!url) continue;
      const summary = `HN: ${title}`;
      let embeddingVector: number[] | undefined;
      try {
        embeddingVector = (await aiService.generateEmbedding(`${title}`)).embedding;
      } catch {
        embeddingVector = undefined;
      }
      await TechUpdate.updateOne(
        { url },
        { $set: { source: 'hackernews', title, url, summary, publishedAt: new Date(), fetchedAt: new Date(), tags: [], skills: [], category: 'technology', embeddingVector } },
        { upsert: true }
      );
      await sleep(200);
    }
  } catch (e) {
    // ignore errors
  }
};

export const runWorkerOnce = async () => {
  await connectDB();
  await fetchHackerNews();
  await disconnectDB();
};

if (require.main === module) {
  runWorkerOnce().then(() => process.exit(0));
}

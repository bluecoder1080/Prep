export const cosineSimilarity = (a: number[], b: number[]): number => {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let aMag = 0;
  let bMag = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    aMag += a[i] * a[i];
    bMag += b[i] * b[i];
  }
  const denom = Math.sqrt(aMag) * Math.sqrt(bMag) || 1e-8;
  return dot / denom;
};

export const topKSimilar = (query: number[], vectors: number[][], k = 5): { index: number; score: number }[] => {
  const scores = vectors.map((v, i) => ({ index: i, score: cosineSimilarity(query, v) }));
  scores.sort((x, y) => y.score - x.score);
  return scores.slice(0, k);
};

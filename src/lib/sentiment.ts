import Sentiment from 'sentiment';

export type SentimentResult = {
  polarity: number;
  subjectivity: number;
  classification: 'positive' | 'negative' | 'neutral';
  wordCount: number;
  comparative: number;
};

const SUBJECTIVE_WORDS = new Set([
  'love', 'hate', 'amazing', 'terrible', 'wonderful', 'awful', 'great', 'bad',
  'best', 'worst', 'beautiful', 'ugly', 'fantastic', 'horrible', 'awesome',
  'terrible', 'excellent', 'poor', 'perfect', 'disappointing', 'incredible',
  'superb', 'dreadful', 'delightful', 'miserable', 'brilliant', 'atrocious',
  'fabulous', 'appalling', 'stunning', 'ridiculous', 'outstanding', 'lousy',
  'magnificent', 'pathetic', 'marvelous', 'abysmal', 'gorgeous', 'nasty',
  'charming', 'repulsive', 'elegant', 'vulgar', 'graceful', 'obnoxious',
  'lovely', 'disgusting', 'adore', 'despise', 'enjoy', 'detest', 'like', 'dislike',
  'prefer', 'favor', 'oppose', 'believe', 'think', 'feel', 'seems', 'probably',
  'maybe', 'perhaps', 'possibly', 'definitely', 'absolutely', 'truly', 'really',
  'very', 'extremely', 'incredibly', 'remarkably', 'surprisingly', 'unfortunately',
  'luckily', 'sadly', 'happily', 'thankfully', 'unfortunately', 'strangely',
]);

const OBJECTIVE_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'must', 'can', 'shall', 'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with',
  'about', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'between', 'under', 'over', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'also', 'and', 'or', 'but', 'not', 'no', 'nor', 'if', 'because',
  'while', 'although', 'though', 'unless', 'until', 'since', 'this', 'that',
  'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she',
  'it', 'they', 'them', 'their', 'who', 'which', 'what', 'whom', 'whose',
]);

export function analyzeSentiment(text: string): SentimentResult {
  const analyzer = new Sentiment();
  const result = analyzer.analyze(text);

  const polarity = result.comparative;
  const wordCount = result.words.length || text.trim().split(/\s+/).filter(Boolean).length;

  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  let subjectiveCount = 0;
  let objectiveCount = 0;

  for (const word of words) {
    if (SUBJECTIVE_WORDS.has(word)) subjectiveCount++;
    else if (!OBJECTIVE_WORDS.has(word)) {
      if (result.words.includes(word)) subjectiveCount++;
      else objectiveCount++;
    }
  }

  const totalWords = words.length || 1;
  let subjectivity = subjectiveCount / totalWords;

  if (Math.abs(polarity) > 0.3) subjectivity = Math.max(subjectivity, 0.5 + Math.abs(polarity) * 0.3);
  subjectivity = Math.min(Math.max(subjectivity, 0), 1);

  let classification: 'positive' | 'negative' | 'neutral';
  if (polarity > 0.05) classification = 'positive';
  else if (polarity < -0.05) classification = 'negative';
  else classification = 'neutral';

  return {
    polarity: Math.max(-1, Math.min(1, polarity)),
    subjectivity: Math.round(subjectivity * 100) / 100,
    classification,
    wordCount,
    comparative: result.comparative,
  };
}

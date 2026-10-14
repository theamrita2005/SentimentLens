import { supabase } from './supabase';
import type { SentimentAnalysis } from './supabase';

export async function saveAnalysis(
  text: string,
  result: { polarity: number; subjectivity: number; classification: 'positive' | 'negative' | 'neutral'; wordCount: number }
): Promise<SentimentAnalysis | null> {
  const { data, error } = await supabase
    .from('sentiment_analyses')
    .insert({
      input_text: text,
      polarity: result.polarity,
      subjectivity: result.subjectivity,
      classification: result.classification,
      word_count: result.wordCount,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to save analysis:', error.message);
    return null;
  }

  return data as SentimentAnalysis;
}

export async function fetchRecentAnalyses(limit = 10): Promise<SentimentAnalysis[]> {
  const { data, error } = await supabase
    .from('sentiment_analyses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch analyses:', error.message);
    return [];
  }

  return (data || []) as SentimentAnalysis[];
}

export async function deleteAnalysis(id: string): Promise<boolean> {
  const { error } = await supabase.from('sentiment_analyses').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete analysis:', error.message);
    return false;
  }
  return true;
}

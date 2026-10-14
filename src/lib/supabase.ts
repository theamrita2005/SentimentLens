import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SentimentAnalysis = {
  id: string;
  input_text: string;
  polarity: number;
  subjectivity: number;
  classification: 'positive' | 'negative' | 'neutral';
  word_count: number;
  created_at: string;
};

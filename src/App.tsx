import { useState, useCallback, useEffect } from 'react';
import { analyzeSentiment } from '@/lib/sentiment';
import { saveAnalysis, fetchRecentAnalyses, deleteAnalysis } from '@/lib/api';
import { useTheme } from '@/lib/useTheme';
import type { SentimentAnalysis } from '@/lib/supabase';
import type { SentimentResult } from '@/lib/sentiment';
import { Sparkles, Send, Trash2, Clock, TrendingUp, TrendingDown, Minus, FileText, Brain, Gauge, BarChart3, AlertCircle, Sun, Moon } from 'lucide-react';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState<SentimentAnalysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    const data = await fetchRecentAnalyses(20);
    setHistory(data);
    setLoadingHistory(false);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setError(null);
    try {
      const analysis = analyzeSentiment(text);
      setResult(analysis);
      await saveAnalysis(text, analysis);
      await loadHistory();
    } catch {
      setError('Something went wrong while analyzing the text. Please try again.');
    }
    setAnalyzing(false);
  }, [text, loadHistory]);

  const handleDelete = useCallback(async (id: string) => {
    const ok = await deleteAnalysis(id);
    if (ok) setHistory(prev => prev.filter(h => h.id !== id));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-200/20 dark:bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-sky-200/20 dark:bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/15 dark:bg-emerald-500/8 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-200/60 dark:border-slate-800/60 glass sticky top-0 z-30 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">SentimentLens</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">NLP-powered text analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Brain className="w-4 h-4" />
              <span>Powered by TextBlob-style NLP</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/50 border border-sky-200/60 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4" />
            Real-time sentiment detection
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
            Understand the <span className="gradient-text">emotional tone</span><br />behind any text
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Enter any sentence or paragraph and instantly see its polarity, subjectivity, and sentiment classification.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Input + Results (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Input Card */}
            <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/60 p-6 animate-fade-in-up transition-colors duration-300" style={{ animationDelay: '0.1s' }}>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                Enter your text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type or paste any text here — a product review, a tweet, an email, or just a sentence..."
                className="w-full h-40 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-sky-400 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/50 outline-none transition-all resize-none text-base leading-relaxed"
                maxLength={5000}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-400 dark:text-slate-500">{text.trim().split(/\s+/).filter(Boolean).length} words · {text.length} / 5000 chars</span>
                <button
                  onClick={handleAnalyze}
                  disabled={!text.trim() || analyzing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {analyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Analyze Sentiment
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-3 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-sm animate-scale-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            {/* Results */}
            {result && <ResultDisplay result={result} />}
          </div>

          {/* History (2 cols) */}
          <div className="lg:col-span-2">
            <HistoryPanel history={history} loading={loadingHistory} onDelete={handleDelete} />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 mt-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
          SentimentLens · Polarity ranges from -1 (negative) to +1 (positive) · Subjectivity ranges from 0 (objective) to 1 (subjective)
        </div>
      </footer>
    </div>
  );
}

function ResultDisplay({ result }: { result: SentimentResult }) {
  const config = {
    positive: {
      label: 'Positive',
      icon: TrendingUp,
      bg: 'from-emerald-500 to-teal-500',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-700 dark:text-emerald-400',
      ring: 'shadow-emerald-500/25',
    },
    negative: {
      label: 'Negative',
      icon: TrendingDown,
      bg: 'from-rose-500 to-red-500',
      border: 'border-rose-200 dark:border-rose-800/60',
      text: 'text-rose-700 dark:text-rose-400',
      ring: 'shadow-rose-500/25',
    },
    neutral: {
      label: 'Neutral',
      icon: Minus,
      bg: 'from-slate-500 to-slate-600',
      border: 'border-slate-200 dark:border-slate-700/60',
      text: 'text-slate-700 dark:text-slate-300',
      ring: 'shadow-slate-500/25',
    },
  }[result.classification];

  const Icon = config.icon;
  const polarityPercent = ((result.polarity + 1) / 2) * 100;

  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Main classification card */}
      <div className={`bg-white dark:bg-slate-800/80 rounded-2xl shadow-sm border ${config.border} p-6 overflow-hidden relative transition-colors duration-300`}>
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.bg}`} />
        <div className="flex items-start justify-between mb-6 mt-2">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Sentiment Classification</p>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.bg} flex items-center justify-center shadow-lg ${config.ring}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-3xl font-bold ${config.text}`}>{config.label}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Words analyzed</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{result.wordCount}</p>
          </div>
        </div>

        {/* Polarity gauge */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Polarity Score</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{result.polarity.toFixed(3)}</span>
          </div>
          <div className="relative h-3 rounded-full bg-gradient-to-r from-rose-300 via-amber-200 to-emerald-300 dark:from-rose-700 dark:via-amber-700 dark:to-emerald-700 overflow-hidden">
            <div
              className="absolute top-0 bottom-0 w-1 bg-slate-800 dark:bg-white rounded-full shadow-md transition-all duration-700 ease-out"
              style={{ left: `calc(${polarityPercent}% - 2px)` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            <span>Negative (-1)</span>
            <span>Neutral (0)</span>
            <span>Positive (+1)</span>
          </div>
        </div>

        {/* Subjectivity gauge */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subjectivity Score</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{result.subjectivity.toFixed(2)}</span>
          </div>
          <div className="relative h-3 rounded-full bg-gradient-to-r from-sky-200 to-sky-500 dark:from-sky-800 dark:to-sky-500 overflow-hidden">
            <div
              className="absolute top-0 bottom-0 w-1 bg-white dark:bg-white rounded-full shadow-md transition-all duration-700 ease-out"
              style={{ left: `calc(${result.subjectivity * 100}% - 2px)` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            <span>Objective (0)</span>
            <span>Subjective (1)</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Polarity" value={result.polarity.toFixed(3)} subtext={result.polarity > 0 ? 'Positive lean' : result.polarity < 0 ? 'Negative lean' : 'Balanced'} />
        <StatCard label="Subjectivity" value={result.subjectivity.toFixed(2)} subtext={result.subjectivity > 0.5 ? 'Opinionated' : 'Factual'} />
        <StatCard label="Intensity" value={`${Math.round(Math.abs(result.polarity) * 100)}%`} subtext={Math.abs(result.polarity) > 0.3 ? 'Strong' : 'Mild'} />
      </div>
    </div>
  );
}

function StatCard({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 p-4 text-center transition-colors duration-300">
      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtext}</p>
    </div>
  );
}

function HistoryPanel({ history, loading, onDelete }: { history: SentimentAnalysis[]; loading: boolean; onDelete: (id: string) => void }) {
  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/60 overflow-hidden sticky top-24 transition-colors duration-300">
      <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Recent Analyses</h3>
        </div>
        {history.length > 0 && (
          <span className="text-xs text-slate-400 dark:text-slate-500">{history.length}</span>
        )}
      </div>

      <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-700/50 animate-pulse" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-7 h-7 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No analyses yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Your analyzed texts will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {history.map((item, idx) => (
              <HistoryItem key={item.id} item={item} index={idx} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryItem({ item, index, onDelete }: { item: SentimentAnalysis; index: number; onDelete: (id: string) => void }) {
  const colors = {
    positive: { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
    negative: { dot: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
    neutral: { dot: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-400' },
  }[item.classification];

  return (
    <div
      className="group p-4 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors animate-fade-in"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} mt-1.5 shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-snug">{item.input_text}</p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className={`font-semibold ${colors.text} capitalize`}>{item.classification}</span>
            <span className="text-slate-400 dark:text-slate-500">P: {Number(item.polarity).toFixed(2)}</span>
            <span className="text-slate-400 dark:text-slate-500">S: {Number(item.subjectivity).toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-all shrink-0"
          aria-label="Delete analysis"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

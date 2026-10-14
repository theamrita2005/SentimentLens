# SentimentLens

A clean, real-time text sentiment analysis web app. Paste in a review, tweet, email, or any block of text and instantly see its **polarity**, **subjectivity**, and overall **sentiment classification**. Every analysis is saved to a history panel backed by Supabase.

<!-- Add a screenshot or GIF here, e.g. ![SentimentLens screenshot](docs/screenshot.png) -->

## Features

- **Instant analysis** – runs entirely in the browser, no server round-trip for scoring
- **Polarity score** from -1 (negative) to +1 (positive), shown on a visual gauge
- **Subjectivity score** from 0 (objective) to 1 (subjective)
- **Classification** into Positive, Negative, or Neutral
- **Analysis history** – recent analyses are persisted in Supabase and can be deleted individually
- **Dark / light mode** – respects your system preference and remembers your choice
- **Keyboard shortcut** – press `Ctrl/Cmd + Enter` to analyze
- **Input guardrails** – live word and character count with a 5,000 character limit
- Responsive layout built with Tailwind CSS

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| NLP | [`sentiment`](https://www.npmjs.com/package/sentiment) (AFINN-based lexicon) |
| Backend / DB | Supabase (Postgres + Row Level Security) |

## How It Works

1. **Polarity** is the comparative score from the `sentiment` library (total AFINN word score divided by word count), clamped to [-1, 1].
2. **Classification** uses simple thresholds on polarity:
   - `> 0.05` → Positive
   - `< -0.05` → Negative
   - otherwise → Neutral
3. **Subjectivity** is a lightweight heuristic: the share of words that appear in a built-in list of opinion/intensity words (or that carry sentiment in the lexicon), with a boost when polarity is strong.

> **Note:** The scoring is lexicon-based, so it works best on straightforward English text. It does not understand sarcasm, negation across long spans, or context the way a trained model would. Treat results as a quick signal, not ground truth.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A free [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

### 2. Set up Supabase

1. Create a new project in the Supabase dashboard.
2. Open the **SQL Editor** and run the migration in
   [`supabase/migrations/20261004170037_create_sentiment_analyses_table.sql`](supabase/migrations/20261004170037_create_sentiment_analyses_table.sql).
   This creates the `sentiment_analyses` table and its Row Level Security policies.
3. Go to **Project Settings → API** and copy your **Project URL** and **anon public key**.

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

`.env` is already listed in `.gitignore`, so it won't be committed. Never commit real keys to a public repository.

### 4. Run the app

```bash
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |

## Project Structure

```
.
├── src/
│   ├── App.tsx              # Main UI: input, results, history panel
│   ├── main.tsx             # App entry point
│   ├── index.css            # Global styles and animations
│   └── lib/
│       ├── sentiment.ts     # Sentiment + subjectivity analysis logic
│       ├── api.ts           # Supabase CRUD helpers (save, fetch, delete)
│       ├── supabase.ts      # Supabase client and shared types
│       └── useTheme.ts      # Dark/light theme hook
├── supabase/
│   └── migrations/          # SQL schema for the sentiment_analyses table
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## Database Schema

Table: `sentiment_analyses`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key, auto-generated |
| `input_text` | `text` | The submitted text |
| `polarity` | `numeric` | -1 to 1 |
| `subjectivity` | `numeric` | 0 to 1 |
| `classification` | `text` | `positive`, `negative`, or `neutral` |
| `word_count` | `integer` | Number of words analyzed |
| `created_at` | `timestamptz` | Defaults to `now()` |

### A note on security

This project is intentionally **single-tenant with no authentication**. The included Row Level Security policies allow anyone with the anon key to read, insert, and delete rows. That is fine for a demo or personal project, but if you deploy it publicly you should either add authentication and tighten the policies, or be comfortable with all history being visible and deletable by every visitor.

## Deployment

The app is a static Vite build, so it deploys easily to Vercel, Netlify, Cloudflare Pages, or GitHub Pages:

```bash
npm run build
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in your hosting provider's dashboard before building.

## Roadmap Ideas

- User authentication with per-user history
- Batch analysis from CSV upload
- Highlighting of the words that drove the score
- Multi-language support
- Swapping the lexicon approach for a transformer-based model

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you'd like to change.

## License

Add a license of your choice (for example [MIT](https://choosealicense.com/licenses/mit/)) and reference it here.

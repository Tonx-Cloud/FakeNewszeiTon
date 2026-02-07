# FakeNewsZeiTon

Minimal MVP to analyze possible fake news using OpenAI, Supabase and Resend.

Quickstart

1. Install deps

```bash
npm install
```

2. Create project in Supabase and run SQL: [supabase/sql/001_init.sql](supabase/sql/001_init.sql)

3. Fill `.env.local` from `.env.example` (OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_*, RESEND_API_KEY, FROM_EMAIL, PUBLIC_APP_URL, CRON_SECRET, UNSUB_SECRET)

4. Run locally

```bash
npm run dev
```

5. Git & Deploy (examples)

```bash
git init
git add .
git commit -m "Initial commit: FakeNewsZeiTon MVP"
# create repo (requires gh CLI login)
gh repo create FakeNewsZeiTon --public --source=. --remote=origin --push
# Deploy to Vercel (requires vercel CLI login)
vercel --prod
```

Notes

- The analysis is "assistida por IA (OpenAI)" — não substitui fact-checkers.
- Mode MVP: external sources NOT consulted unless configured.

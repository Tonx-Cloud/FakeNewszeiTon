# FakeNewsZeiTon

Minimal MVP to analyze possible fake news using OpenAI, Supabase and Resend.

Overview

- FakeNewsZeiTon recebe conteúdo (texto, link, imagem, áudio) e gera um relatório assistido por IA que estima risco de desinformação, viés e sinais de golpe.
- Público-alvo: jornalistas, verificadores, usuários que recebem conteúdo via WhatsApp e querem um relatório rápido.
- Limitações: Análise assistida por IA (OpenAI). Não substitui agências de fact-checking. No modo MVP, fontes externas NÃO são consultadas automaticamente.

Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI (Responses API)
- Resend (envio de digest por e-mail)
- Supabase (esquema SQL fornecido para migrations)

Run locally

1. Install dependencies

```bash
npm install
```

2. Create a Supabase project and run the SQL migration: [supabase/sql/001_init.sql](supabase/sql/001_init.sql)

3. Copy `.env.example` to `.env.local` and fill required vars (see Environment Variables section)

4. Run the app in development

```bash
npm run dev
```

Git / GitHub (local steps already executed)

The following commands were executed locally in this workspace:

```bash
git init
git checkout -b main
git add .
git commit -m "Initial: FakeNewsZeiTon MVP (Next.js + OpenAI + Resend)"
```

Note: The GitHub CLI (`gh`) was not available in this environment, so I could not create the remote repository automatically. To create the GitHub repository and push the `main` branch, run the following locally (requires `gh` authenticated):

```bash
gh repo create FakeNewsZeiTon --public --source=. --remote=origin --push
```

After running the above, confirm the repository URL and update this README.

Vercel (deploy)

- Link the project to Vercel (interactive):

```bash
vercel link
```

- Or create and deploy in one step (may prompt for scope/project):

```bash
vercel --prod
```

If you prefer a non-interactive flow, use the Vercel dashboard to create a new project named `FakeNewsZeiTon` and connect the GitHub repository.

Environment variables for Production (Vercel)

Set these in the Vercel Project settings (Environment Variables) before deployment:

- `OPENAI_API_KEY` — API key for OpenAI (server-side only)
- `OPENAI_MODEL` — default `gpt-4o-mini`
- `RESEND_API_KEY` — API key for Resend (used to send digest emails)
- `FROM_EMAIL` — From address for emails (e.g. "FakeNewsZeiTon <onboarding@resend.dev>")
- `PUBLIC_APP_URL` — e.g. `https://your-app.vercel.app`
- `CRON_SECRET` — secret used to protect the digest endpoint
- `UNSUB_SECRET` — secret used to sign unsubscribe tokens

Notes:

- `FROM_EMAIL` can use `onboarding@resend.dev` for testing with Resend. If you use a custom domain, verify it in Resend first.

Cron (digest of trending fakes)

- Endpoint (exists in the app): `/api/cron/digest?key=CRON_SECRET`
- Configure a Vercel cron job (or external scheduler) to call:

```
https://YOUR_VERCEL_DOMAIN.vercel.app/api/cron/digest?key=CRON_SECRET
```

- Frequency: daily (for `daily` users) — document or schedule as needed in Vercel Cron.

Compliance / Transparency

- Always show this text prominently in product UI and emails: "Análise assistida por IA (OpenAI) para estimar risco de desinformação, viés e sinais de golpe. Não substitui agências de fact-checking."
- In the app footer: "Modo: MVP — fontes externas não consultadas por padrão."

Roadmap (short)

- Autenticação Supabase (magic link)
- Persistência de análises (salvar histórico por usuário)
- Trending aggregation avançada e deduplicação de claims
- Integração com provedores externos de fact-checking

Commands executed in this session

```bash
npm install
npm run build
git init
git checkout -b main
git add .
git commit -m "Initial: FakeNewsZeiTon MVP (Next.js + OpenAI + Resend)"
```

To finish (manual steps required locally)

1. Create GitHub repo and push (requires `gh`):

```bash
gh repo create FakeNewsZeiTon --public --source=. --remote=origin --push
```

2. Create a Vercel project (via dashboard or `vercel link`) and set production environment variables listed above.

3. Deploy production:

```bash
vercel --prod
```

After creating the GitHub repo and deploying, update this README with the repository URL and the public app URL.

—
PASSO C status checklist

- [x] Git initialized and initial commit created
- [ ] GitHub repo created (run `gh repo create ...` locally)
- [ ] Push to GitHub (run locally after `gh repo create` completes)
- [ ] Vercel project linked and deployed (run locally or via dashboard)
- [ ] README updated with final URLs (update after steps above)

Next recommended: PASSO B (Auth Supabase)


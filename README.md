# Fake News Verificaton

Ferramenta de análise de desinformação assistida por IA. Recebe conteúdo (texto, link, imagem ou áudio) e gera um relatório estruturado com scores, veredito, avaliação de afirmações, fontes de checagem e recomendações.

**Live:** https://fakenewsverificaton.com.br  
**Repo:** https://github.com/Tonx-Cloud/FakeNewszeiTon.git

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS 3** (dark mode, glassmorphism, animations)
- **Gemini 2.0 Flash** (`@google/generative-ai`) — análise multimodal (texto, imagem, áudio)
- **Supabase** — Auth (magic link), PostgreSQL (profiles, analyses, trending_items, subscribers)
- **Resend** — email digests
- **react-markdown** + remark-gfm + rehype-raw — renderização de relatórios em Markdown
- **Vercel** — deploy automático + cron

## Setup local

```bash
# 1. Instalar dependências
npm install

# 2. Criar projeto Supabase e rodar migration
# Execute o conteúdo de supabase/sql/001_init.sql no SQL Editor do Supabase

# 3. Copiar .env.example para .env.local e preencher as variáveis

# 4. Rodar em dev
npm run dev
```

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `GEMINI_API_KEY` | Chave da API Google Gemini |
| `GEMINI_MODEL` | Modelo (default: `gemini-2.0-flash`) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (anon) do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service_role (server-side) |
| `RESEND_API_KEY` | Chave da API Resend |
| `FROM_EMAIL` | Email remetente dos digests |
| `PUBLIC_APP_URL` | URL pública do app (`https://fakenewsverificaton.com.br`) |
| `CRON_SECRET` | Segredo para proteger endpoint de cron |
| `UNSUB_SECRET` | Segredo para tokens de unsubscribe |

## Banco de dados (Supabase)

Tabelas em `supabase/sql/001_init.sql`:

- **profiles** — perfil de usuário (vinculado a auth.users)
- **analyses** — análises salvas com scores, veredito, markdown
- **trending_items** — agregação de fakes em alta (cron)
- **subscribers** — inscrições para alertas (nome, email, whatsapp, opcionais)

Todas com RLS ativado. Service role gerencia via API routes.

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Página principal — hero, análise, resultado com Markdown, fontes, WhatsApp, PIX |
| `/auth` | Login via magic link (Supabase Auth) |
| `/auth/callback` | Callback — route.ts troca code por sessão e redireciona para HOME (/) |
| `/subscribe` | Inscrição para alertas (nome, email, WhatsApp — campos opcionais) |
| `/alerts` | Página de trending fakes (SSR, force-dynamic) |

## API Routes

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/analyze` | POST | Análise de conteúdo (rate limit 10/min/IP, max 4.5 MB) |
| `/api/subscribe` | POST | Cadastro de subscriber (upsert por email/whatsapp) |
| `/api/cron/digest` | GET | Envia digest por email (protegido por CRON_SECRET) |

## Relatório Markdown

O pipeline de análise (`lib/analyzePipeline.ts`) gera um relatório Markdown estruturado server-side com:

1. **Resultado** — veredito com emoji (❌/✅/⚠️) + resumo
2. **Scores** — tabela markdown com métricas e indicadores visuais
3. **Avaliação das afirmações** — cada claim com assessment e confiança
4. **Fontes externas** — links para agências de checagem relevantes
5. **Recomendações** — passos para o usuário verificar por conta própria
6. **Pesquise você mesmo** — queries sugeridas

O Markdown é renderizado no frontend com `react-markdown` + `remark-gfm` + `rehype-raw` com classes `prose` do Tailwind.

## Cron

Configurado em `vercel.json` — executa diariamente as 09:00 UTC:

```json
{ "crons": [{ "path": "/api/cron/digest?key=CRON_SECRET", "schedule": "0 9 * * *" }] }
```

## Neutralidade

O Fake News Verificaton não apoia candidatos, partidos ou ideologias. A análise avalia afirmações explícitas, nunca pessoas ou grupos. Quando não há base para conclusão, o resultado é "Inconclusivo".

*Análise assistida por IA (Gemini). Não substitui checagem profissional.*


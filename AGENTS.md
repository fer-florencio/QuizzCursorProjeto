# Cursor Quiz — Instruções para Agentes

Quiz web de **Verdadeiro ou Falso** sobre o ecossistema Cursor IDE. Público misto (dev + negócio), workshops de 15–20 min, leaderboard global via Supabase.

**Fonte de verdade:** `prd.md` (v1.2). Em caso de dúvida sobre requisitos, perguntas, scoring ou UX, consulte o PRD antes de improvisar.

---

## Stack e ferramentas

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript (strict) |
| Estilização | Tailwind CSS 4 |
| Animações | Framer Motion |
| Backend / DB | Supabase (PostgreSQL + RLS) |
| Cliente Supabase | `@supabase/supabase-js` + `@supabase/ssr` |
| Estado do quiz | React `useReducer` (em memória) |
| Preferências locais | `localStorage` (nome do jogador, último `entry_id`) |
| Testes | Vitest + Testing Library |
| Deploy | Vercel (frontend) + Supabase (backend) |

**Idioma do produto:** Português (Brasil) em toda a UI, mensagens e conteúdo.

---

## Estrutura de diretórios esperada

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Landing + stats
│   ├── quiz/page.tsx
│   ├── results/page.tsx
│   ├── leaderboard/page.tsx
│   └── api/leaderboard/route.ts    # GET + POST
├── components/
│   ├── ui/
│   ├── quiz/
│   ├── leaderboard/
│   └── layout/
├── data/questions.ts               # 45 perguntas (seed do PRD §3)
├── hooks/
│   ├── useQuiz.ts
│   ├── useTimer.ts
│   └── useLeaderboard.ts
├── lib/
│   ├── supabase/client.ts
│   ├── supabase/server.ts
│   ├── scoring.ts
│   ├── shuffle.ts
│   ├── config.ts
│   └── storage.ts
└── types/
    ├── index.ts
    └── database.ts
supabase/migrations/001_leaderboard.sql
tests/
```

Não invente pastas ou abstrações fora desse layout sem necessidade clara.

---

## Convenções de código

- Componentes funcionais com TypeScript strict; **sem `any`**.
- Commits em **português**.
- Código autoexplicativo; comentários apenas para lógica não óbvia.
- Sem dependências desnecessárias.
- **Não** criar commits, PRs ou arquivos de documentação extra (README, etc.) a menos que o usuário peça explicitamente.
- Minimize o escopo de cada alteração — implemente só o que o PRD ou a tarefa pedem.

---

## Domínio do produto

### Níveis

| Chave | Label | Timer/pergunta | Perguntas/sessão |
|-------|-------|----------------|------------------|
| `beginner` | Iniciante | 30s | 10 de 15 |
| `intermediate` | Intermediário | 25s | 10 de 15 |
| `advanced` | Avançado | 20s | 10 de 15 |
| `mixed` | Misto | 25s | 10 (4+3+3) |

### Pontuação (`src/lib/scoring.ts`)

- Acerto: **+100** base
- Bônus velocidade: até **+50** (proporcional ao tempo restante)
- Streak ≥ 3 acertos: **+25** por pergunta enquanto durar
- Erro ou timeout: **0** (sem penalidade negativa)

### Classificação final

| % | Título |
|---|--------|
| ≥ 90% | Cursor Master |
| ≥ 70% | Cursor Pro |
| ≥ 50% | Cursor Explorer |
| < 50% | Cursor Beginner |

### Banco de perguntas

- Arquivo único: `src/data/questions.ts`
- Schema: `Question` com `id`, `level`, `text`, `answer` (boolean), `explanation`, `tags?`
- Conteúdo completo no PRD §3 — **45 perguntas** (15 por nível)
- Embaralhar com Fisher-Yates a cada sessão; **não** inverter V/F das perguntas
- Balancear ~50% verdadeiro / ~50% falso por nível

---

## Rotas e fluxo

```
/ → /quiz?level=... → /results → /leaderboard
```

| Rota | Responsabilidade |
|------|------------------|
| `/` | Landing, CTA, stats agregadas (melhor score, total de partidas) |
| `/quiz?level=` | Quiz ativo: timer, V/F, feedback, streak, progresso |
| `/results` | Score, %, classificação, submit ao Supabase |
| `/leaderboard` | Top 10 por nível + aba Geral |
| `GET /api/leaderboard` | `?level=beginner&limit=10` ou `level=all` |
| `GET /api/leaderboard/stats` | Melhor score + total de partidas |
| `POST /api/leaderboard` | Salvar score ao finalizar (validação server-side) |

### Comportamentos obrigatórios

- Nome do jogador: opcional, default **"Anônimo"**; persistir em `localStorage`
- Feedback após resposta: mostrar acerto/erro + explicação + resposta correta
- Auto-avanço após **3s** no feedback, com botão "Próxima" imediato
- Timeout = erro automático, exibir explicação, avançar
- Atalhos: `V` = Verdadeiro, `F` = Falso, `Enter` = Próxima
- Submit do score **uma vez** ao concluir; guardar `id` retornado para highlight no leaderboard
- Estados de UI no leaderboard: loading, erro com retry, empty state

---

## Supabase

### Variáveis de ambiente (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- Usar **apenas** anon key no client (com RLS)
- **Nunca** expor `SUPABASE_SERVICE_ROLE_KEY` no frontend

### Schema (`supabase/migrations/001_leaderboard.sql`)

Tabela `leaderboard_entries`: `id`, `player_name` (1–50 chars), `score`, `level`, `correct_answers`, `total_questions`, `percentage`, `created_at`.

RLS: `anon` pode **INSERT** e **SELECT** apenas; sem UPDATE/DELETE público.

### Validação no POST

- Rejeitar payload inválido com 400
- `player_name`: trim, 1–50 caracteres
- `level`: `beginner` | `intermediate` | `advanced` | `mixed`
- `percentage` coerente com `correct_answers / total_questions`

---

## Design e UX

- **Dark theme** por padrão: fundo `#0a0a0f`, cards `#16161f`
- Tipografia: Inter (UI), JetBrains Mono (score/timer)
- Acento primário: `#6c5ce7`; sucesso `#00b894`; erro `#e17055`
- Mobile-first (320px+); botões V/F empilhados em telas < 640px
- WCAG AA: `aria-label` nos botões, `aria-live="polite"` no timer
- Timer pulsa abaixo de 5s; confete sutil em "Cursor Master"

Configuração por nível em `src/lib/config.ts` — ver PRD §5.8.

---

## Ordem de implementação

Siga esta sequência ao construir o projeto do zero:

1. Scaffold Next.js 15 + TypeScript + Tailwind + `src/`
2. Supabase: migration `001_leaderboard.sql` + `.env.local.example`
3. Clientes Supabase (`client.ts`, `server.ts`)
4. Tipos (`src/types/`) + `questions.ts` com as 45 perguntas do PRD
5. API `/api/leaderboard` (GET, GET stats, POST)
6. Lógica: `scoring.ts`, `shuffle.ts`, `config.ts`, hooks
7. Componentes UI (Button, Card, Timer, ProgressBar) + quiz/leaderboard
8. Páginas: Landing → Level Select → Quiz → Results → Leaderboard
9. Dark theme, animações, acessibilidade, responsividade
10. Testes: scoring, shuffle, quiz reducer, API leaderboard (mock Supabase)
11. Verificar `next build` sem erros

---

## Fora de escopo (MVP)

Não implementar sem pedido explícito:

- Autenticação / login
- Perguntas de múltipla escolha
- Admin panel para editar perguntas
- i18n (apenas PT-BR)
- Modo estudo sem timer
- PWA / offline completo
- Integração com API do Cursor
- Multiplayer em tempo real

---

## Testes mínimos

- `tests/scoring.test.ts` — base, speed bonus, streak, erro
- `tests/shuffle.test.ts` — Fisher-Yates, não altera conteúdo
- `tests/useQuiz.test.ts` — reducer (avanço, score, fim de sessão)
- `tests/leaderboard-api.test.ts` — validação POST, mock Supabase

Rodar `npm run test` antes de considerar uma feature concluída.

---

## Critérios de aceite (checklist)

- [ ] 4 níveis selecionáveis; 10 perguntas embaralhadas por sessão
- [ ] Timer por pergunta funcional; timeout tratado como erro
- [ ] Feedback com explicação; pontuação correta
- [ ] Resultado com classificação; score enviado ao Supabase
- [ ] Leaderboard Top 10 por nível + geral; stats na landing
- [ ] 45 perguntas seed; responsivo; atalhos V/F/Enter
- [ ] Build de produção sem erros

---

## Referências

- `prd.md` — requisitos completos, perguntas, SQL, tipos
- [Cursor Docs](https://cursor.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase + Next.js SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)

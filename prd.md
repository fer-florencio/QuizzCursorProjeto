# PRD — Cursor Quiz (Verdadeiro ou Falso)

**Versão:** 1.2  
**Data:** 16 de julho de 2026  
**Status:** Aprovado para desenvolvimento  
**Idioma do produto:** Português (Brasil)  
**Consumidor:** Cursor Agent (implementação automatizada)

---

## 0. Processo de Brainstorm

Esta seção documenta o processo de ideação que fundamentou as decisões deste PRD.

### 0.1 Pergunta Central

> *Como criar uma experiência interativa que ensine o ecossistema Cursor — do negócio ao técnico avançado — de forma gamificada e reutilizável em workshops?*

### 0.2 Mapa de Domínios (O que o quiz deve cobrir)

| Domínio | Exemplos de tópicos | Nível principal |
|---------|---------------------|-----------------|
| **Negócio & Posicionamento** | O que é o Cursor, vs VS Code/Copilot, valor para times | Iniciante |
| **Pricing & Planos** | Hobby, Pro, Pro+, Ultra, Teams, Enterprise | Iniciante |
| **Features Core** | Tab, Inline Edit, Agent, modos (Ask/Plan/Debug) | Intermediário |
| **Configuração** | Rules, Skills, AGENTS.md, `.cursorignore` | Intermediário |
| **Integrações** | MCP, @ mentions, indexação de codebase | Intermediário |
| **Enterprise & Segurança** | Privacy Mode, Team Rules, audit logs, SCIM | Avançado |
| **Automação** | Cloud Agents, Automations, SDK (`@cursor/sdk`) | Avançado |
| **Qualidade** | Bugbot, Auto-review, Cursor Blame | Avançado |

### 0.3 Alternativas Avaliadas

| Decisão | Alternativas consideradas | Escolha | Justificativa |
|---------|--------------------------|---------|---------------|
| **Formato de pergunta** | V/F, múltipla escolha, misto | **V/F no MVP** | Mais rápido de responder; ideal para workshops; 50% de chance reduz frustração em iniciantes |
| **Stack** | React SPA (Vite), Next.js, HTML estático | **Next.js 15 + TS** | SSR/SSG, App Router, deploy fácil na Vercel, padrão moderno para o Cursor implementar |
| **Backend** | Supabase, Firebase, sem backend | **Supabase (leaderboard)** | Ranking global compartilhado entre participantes do workshop; sem necessidade de login |
| **Persistência** | localStorage, IndexedDB, Supabase | **Supabase + localStorage** | Leaderboard no Supabase; localStorage apenas para preferências locais (nome do jogador) |
| **Timer** | Global da sessão, por pergunta, sem timer | **Por pergunta** | Cria urgência sem penalizar sessões longas; bônus de velocidade faz sentido |
| **Idioma** | PT-BR, EN, ambos | **PT-BR apenas** | Público do workshop é brasileiro; i18n fica para v1.2 |
| **Banco de perguntas** | JSON estático, CMS, markdown | **TypeScript (`questions.ts`)** | Type-safe, versionado no git, fácil de revisar em PRs |
| **Tema visual** | Light, dark, ambos | **Dark por padrão** | Alinhado à identidade do Cursor IDE |

### 0.4 Ideias Descartadas (fora do MVP)

- Modo "estudo" sem timer (pode virar v1.1 como toggle)
- Perguntas com imagens/screenshots do Cursor (complexidade de manutenção)
- Integração com API do Cursor para validar respostas em tempo real
- Multiplayer simultâneo (Kahoot-style)
- Certificado PDF ao completar
- Login com GitHub/Google

### 0.5 User Stories Prioritárias

| ID | Como... | Quero... | Para... |
|----|---------|----------|---------|
| US-01 | Gestora de produto | responder perguntas sobre planos e valor do Cursor | decidir se recomendo a ferramenta ao time |
| US-02 | Dev júnior | testar meu conhecimento sobre Tab, Agent e Rules | usar o Cursor com mais confiança |
| US-03 | Dev sênior | ser desafiado com Cloud Agents, SDK e Enterprise | validar conhecimento avançado |
| US-04 | Facilitador de workshop | rodar o quiz em 15–20 minutos | engajar a turma na Jornada de Dados |
| US-05 | Jogador | ver explicação ao errar | aprender com os erros, não só pontuar |
| US-06 | Jogador competitivo | comparar meu score no leaderboard global | me motivar a jogar novamente e competir com a turma |
| US-07 | Facilitador de workshop | ver ranking atualizado em tempo real no telão | criar competição saudável entre participantes |

### 0.6 Princípios de Design do Conteúdo

1. **Perguntas armadilha intencionais** — confundir conceitos comuns (Rules vs Skills, Auto vs plano, Background vs Cloud Agents)
2. **Explicações educativas** — toda resposta errada é oportunidade de aprendizado
3. **Atualização trimestral** — pricing e features do Cursor mudam; tags de versão nas perguntas
4. **Balanceamento V/F** — ~50% verdadeiro e ~50% falso por nível (evitar viés de sempre clicar "Verdadeiro")
5. **Linguagem acessível no Iniciante** — evitar jargão técnico; no Avançado, usar terminologia oficial

### 0.7 Decisões Confirmadas

| Decisão | Escolha |
|---------|---------|
| Stack | **Next.js + TypeScript + Tailwind CSS 4 + Supabase** |
| Backend | **Supabase** (PostgreSQL) para leaderboard global |
| Público | **Misto (devs + negócio)** |
| Funcionalidades MVP | Níveis, pontuação, timer, leaderboard global, explicações, embaralhamento |
| Perguntas por sessão | **10** (de um banco de 15 por nível) |
| Deploy alvo | **Vercel** (frontend) + **Supabase** (backend) |

### 0.8 Decisões em Aberto (para validação futura)

| # | Pergunta | Sugestão default |
|---|----------|------------------|
| D-01 | Nome do jogador é obrigatório? | Não — default "Anônimo" |
| D-02 | Auto-avanço após feedback? | Sim — 3 segundos, com botão "Próxima" imediato |
| D-03 | Permitir pular pergunta? | Não no MVP |
| D-04 | Mostrar resposta correta ao errar? | Sim — sempre, com explicação |
| D-05 | Modo revisão pós-quiz? | Roadmap v1.1 |

---

## 1. Visão e Contexto

### 1.1 Problema

Profissionais de tecnologia e stakeholders de negócio frequentemente confundem conceitos do Cursor IDE — planos de preço, diferenças em relação ao VS Code/Copilot, funcionamento de Rules vs Skills, limites de Privacy Mode, etc. Não existe um recurso interativo e gamificado para validar e consolidar esse conhecimento, especialmente em contextos de treinamento corporativo como a **Jornada de Dados**.

### 1.2 Solução

Um **Quiz Web de Verdadeiro ou Falso** sobre o Cursor IDE, com perguntas organizadas por nível de dificuldade (Iniciante → Intermediário → Avançado), feedback educativo após cada resposta, pontuação, timer e **leaderboard global** persistido no **Supabase**.

### 1.3 Objetivos de Negócio

| Objetivo | Métrica de sucesso |
|----------|-------------------|
| Educar sobre o ecossistema Cursor | ≥ 80% dos usuários leem a explicação após errar |
| Cobrir público misto (dev + negócio) | Perguntas de negócio no Nível 1; técnicas nos Níveis 2–3 |
| Engajar com gamificação | Média de ≥ 15 perguntas respondidas por sessão |
| Servir como material de treinamento | Utilizável em workshops de 15–20 minutos |
| Consolidar aprendizado pós-curso | Jogador retorna ao menos 1x para melhorar score |
| Competir entre participantes do workshop | Leaderboard visível para todos em tempo real via Supabase |

### 1.4 Público-Alvo

| Persona | Perfil | Nível principal | Dor principal |
|---------|--------|-----------------|---------------|
| **Ana — Gestora de Produto** | Conhece IA generativa, não codifica | Iniciante | Não sabe diferenciar Cursor de Copilot |
| **Bruno — Dev Júnior** | Usa VS Code, ouviu falar do Cursor | Iniciante + Intermediário | Confunde Tab, Agent e Inline Edit |
| **Carla — Dev Sênior** | Usa Cursor no dia a dia | Intermediário + Avançado | Quer validar conhecimento de MCP, Rules, Cloud Agents |
| **Diego — Tech Lead** | Avalia ferramentas para o time | Todos os níveis | Precisa entender Enterprise, Privacy, custos |

### 1.5 Contexto de Uso

| Cenário | Duração | Nível sugerido |
|---------|---------|----------------|
| Workshop Jornada de Dados | 15–20 min | Misto |
| Onboarding de time novo no Cursor | 10 min | Iniciante |
| Quiz rápido individual | 5–10 min | Qualquer |
| Avaliação de conhecimento avançado | 10 min | Avançado |

### 1.6 Fora de Escopo (MVP)

- Autenticação / login de usuários (leaderboard anônimo por nome de exibição)
- Edição ou exclusão de scores pelo usuário final
- Perguntas de múltipla escolha (apenas V/F no MVP)
- Admin panel para editar perguntas via UI
- Internacionalização (i18n) — apenas PT-BR no MVP
- Integração com API do Cursor
- Modo offline completo (PWA)

---

## 2. Fluxo e Mecânicas

### 2.1 Fluxo Principal do Usuário

```
[Landing] → [Escolher Nível] → [Quiz em andamento] → [Resultado] → [Leaderboard]
                  ↓                    ↓
           (Iniciante /          V ou F por pergunta
            Intermediário /      + timer por pergunta
            Avançado /           + explicação imediata
            Misto)               + pontuação acumulada
```

### 2.2 Mecânicas de Gamificação

#### Pontuação
- Resposta correta: **+100 pontos base**
- Bônus de velocidade: até **+50 pontos** proporcional ao tempo restante no timer da pergunta
- Resposta errada: **0 pontos** (sem penalidade negativa)
- Streak de 3+ acertos consecutivos: **+25 pontos** por pergunta enquanto a streak durar

#### Timer
- Timer **por pergunta** (não global do quiz inteiro)
- Duração por nível:
  - Iniciante: **30 segundos**
  - Intermediário: **25 segundos**
  - Avançado: **20 segundos**
  - Modo Misto: **25 segundos** (média)
- Ao expirar o tempo: conta como erro, exibe explicação, avança automaticamente

#### Leaderboard (Supabase)
- Armazenamento em **Supabase** (PostgreSQL), acessível globalmente entre todos os jogadores
- Score enviado automaticamente ao finalizar o quiz (tela de resultado)
- Campos persistidos: `player_name`, `score`, `level`, `correct_answers`, `total_questions`, `percentage`, `created_at`
- Exibir **Top 10** scores por nível + Top 10 geral (consulta ao Supabase)
- Jogador informa nome (opcional, default: "Anônimo") antes de iniciar o quiz — nome salvo em localStorage para conveniência
- Estados de UI: loading, erro de rede (com retry), empty state
- Sem autenticação — acesso via `anon key` com RLS restritivo (apenas INSERT e SELECT)

#### Embaralhamento
- Perguntas embaralhadas a cada sessão (Fisher-Yates)
- A ordem V/F de cada pergunta **não muda** — apenas a ordem das perguntas

### 2.3 Estrutura de Níveis

| Nível | Foco | Qtd. perguntas/sessão | Banco total | Público |
|-------|------|----------------------|-------------|---------|
| **Iniciante** | Negócio, pricing, posicionamento, vs concorrentes | 10 de 15 | 15 | Gestores, iniciantes |
| **Intermediário** | Features core: Tab, Agent, Rules, Skills, MCP, indexação | 10 de 15 | 15 | Devs em adoção |
| **Avançado** | Cloud Agents, SDK, Enterprise, Privacy Mode, Bugbot | 10 de 15 | 15 | Devs experientes, leads |
| **Misto** | 4 Iniciante + 3 Intermediário + 3 Avançado | 10 fixas | — | Todos |

### 2.4 Classificação por Performance

| Faixa | Título | Mensagem |
|-------|--------|----------|
| ≥ 90% | **Cursor Master** | "Você domina o ecossistema Cursor!" |
| ≥ 70% | **Cursor Pro** | "Ótimo conhecimento — quase lá!" |
| ≥ 50% | **Cursor Explorer** | "Bom começo — revise as explicações." |
| < 50% | **Cursor Beginner** | "Hora de explorar mais o Cursor!" |

---

## 3. Banco de Perguntas (Seed Data)

> O arquivo `src/data/questions.ts` deve conter todas as perguntas abaixo.  
> Cada pergunta segue o schema definido na seção 5.  
> **Fonte de verdade:** [cursor.com/docs](https://cursor.com/docs) — revisar trimestralmente.

### 3.1 Nível Iniciante (Negócio)

| ID | Pergunta | Resposta | Explicação | Tags |
|----|----------|----------|------------|------|
| `beg-01` | O Cursor é uma extensão do VS Code que você instala no editor existente. | **Falso** | O Cursor é um editor standalone (fork do VS Code). Roda como aplicativo separado. | `posicionamento` |
| `beg-02` | O plano Hobby gratuito permite usar Agent, Chat e Tab com uso limitado. | **Verdadeiro** | O Hobby inclui Agent, Chat e Tab com limites de uso, sem necessidade de cartão de crédito. | `pricing` |
| `beg-03` | O plano Pro ($20/mês) inclui $20 de uso de API por mês. | **Verdadeiro** | Planos individuais incluem crédito de API que renova a cada ciclo de billing. | `pricing` |
| `beg-04` | O Cursor usa o VS Code Marketplace para instalar extensões. | **Falso** | Usa o registro Open VSX; nem todas as extensões do Marketplace da Microsoft estão disponíveis. | `setup` |
| `beg-05` | Planos Enterprise incluem pooled usage, SCIM e audit logs. | **Verdadeiro** | Recursos Enterprise incluem uso compartilhado, provisionamento SCIM e logs de auditoria. | `enterprise` |
| `beg-06` | "Auto" é um plano de assinatura mais barato que o Pro. | **Falso** | Auto é um roteador de modelos que escolhe o modelo automaticamente — não é um plano. | `pricing` |
| `beg-07` | Você pode importar settings, extensões e keybindings do VS Code para o Cursor. | **Verdadeiro** | Em Settings > General > Account > VS Code Import, em um clique. | `setup` |
| `beg-08` | Todos os planos pagos individuais incluem Tab completions ilimitadas. | **Verdadeiro** | Pro, Pro+ e Ultra incluem completions de Tab ilimitadas. | `pricing` |
| `beg-09` | O Cursor só funciona para desenvolvedores que escrevem JavaScript. | **Falso** | Suporta múltiplas linguagens e modelos de vários provedores (OpenAI, Anthropic, Google, etc.). | `posicionamento` |
| `beg-10` | Planos Teams Standard e Premium cobram por usuário por mês. | **Verdadeiro** | Standard: $40/usuário/mês; Premium: $120/usuário/mês com 5x os limites de Agent. | `pricing` |
| `beg-11` | O Cursor substitui completamente a necessidade de um desenvolvedor humano no time. | **Falso** | O Cursor é uma ferramenta de produtividade que amplia capacidades humanas — não substitui julgamento, arquitetura e revisão. | `negócio` |
| `beg-12` | O GitHub Copilot e o Cursor oferecem exatamente a mesma experiência de agente autônomo. | **Falso** | O Cursor oferece agente autônomo com indexação profunda, Rules, MCP, Cloud Agents — experiência mais ampla que autocomplete inline. | `posicionamento` |
| `beg-13` | O plano Ultra ($200/mês) inclui $400 de uso de API por mês. | **Verdadeiro** | O Ultra é o plano individual de maior capacidade, com $400 de crédito API incluído. | `pricing` |
| `beg-14` | Times no plano Teams têm acesso ao Bugbot para revisão de PRs. | **Verdadeiro** | Bugbot está incluído nos planos Teams Standard e Premium para code reviews agenticos. | `pricing` |
| `beg-15` | O Cursor armazena todo o seu código na nuvem permanentemente para treinar modelos de IA. | **Falso** | Com Privacy Mode ativado, o código não é usado para treino. Mesmo sem Privacy Mode, o armazenamento é para operação do serviço, não treino permanente. | `privacidade` |

### 3.2 Nível Intermediário (Features)

| ID | Pergunta | Resposta | Explicação | Tags |
|----|----------|----------|------------|------|
| `int-01` | O Tab pode sugerir edições em múltiplos arquivos ao mesmo tempo. | **Verdadeiro** | Tab prevê edições cross-file quando mudanças em um arquivo exigem updates em outro. | `tab` |
| `int-02` | User Rules se aplicam ao Inline Edit (Ctrl/Cmd+K). | **Falso** | User Rules aplicam-se ao Agent (Chat), não ao Inline Edit — conforme documentação oficial. | `rules` |
| `int-03` | Arquivos de regras de projeto devem usar a extensão `.mdc` em `.cursor/rules/`. | **Verdadeiro** | `.md` sem frontmatter é ignorado pelo sistema de rules; use AGENTS.md para markdown simples. | `rules` |
| `int-04` | Skills ficam em pastas com `SKILL.md` e podem ser invocadas com `/`. | **Verdadeiro** | Carregadas de `.cursor/skills/`, `~/.cursor/skills/` e compatíveis com `.agents/skills/`. | `skills` |
| `int-05` | MCP permite conectar o Cursor a ferramentas externas como Notion, Linear e bancos de dados. | **Verdadeiro** | Model Context Protocol expõe tools, resources e prompts de servidores externos. | `mcp` |
| `int-06` | A indexação do codebase roda manualmente e nunca atualiza sozinha. | **Falso** | Indexa automaticamente ao abrir o projeto e sincroniza periodicamente (~5 minutos). | `indexação` |
| `int-07` | Composer 2.5 é um modelo próprio do Cursor treinado para coding agentic. | **Verdadeiro** | Modelo first-party com pool de uso generoso nos planos individuais. | `modelos` |
| `int-08` | No modo Ask, o Agent pode editar arquivos se você pedir com educação. | **Falso** | Ask é read-only — responde e explora sem fazer edições. | `agent` |
| `int-09` | `.cursorignore` impede que terminal e MCP leiam arquivos ignorados. | **Falso** | Bloqueia indexação e contexto do Agent; terminal e MCP podem acessar arquivos ignorados. | `configuração` |
| `int-10` | Trocar de modo (Agent → Ask → Plan) mantém o mesmo contexto da conversa. | **Falso** | Cada modo usa contexto próprio; trocar de modo inicia janela de contexto fresca. | `agent` |
| `int-11` | O atalho Ctrl/Cmd+I abre o painel do Agent. | **Verdadeiro** | É o atalho padrão para abrir o Agent (Chat) no Cursor. | `atalhos` |
| `int-12` | Rules e Skills são a mesma coisa — apenas nomes diferentes para instruções persistentes. | **Falso** | Rules são instruções de contexto no prompt; Skills são pacotes portáveis com scripts e invocação via `/`. | `rules` |
| `int-13` | O modo Plan cria um plano de implementação antes de escrever código. | **Verdadeiro** | Plan mode foca em planejamento e discussão antes de executar mudanças. | `agent` |
| `int-14` | Você pode referenciar arquivos específicos no chat usando @ mentions. | **Verdadeiro** | @ permite incluir arquivos, pastas, documentação, terminal output e outros contextos. | `contexto` |
| `int-15` | O Cursor suporta apenas modelos da OpenAI. | **Falso** | Suporta modelos de múltiplos provedores: OpenAI, Anthropic, Google, xAI, e modelos próprios (Composer, Auto). | `modelos` |

### 3.3 Nível Avançado

| ID | Pergunta | Resposta | Explicação | Tags |
|----|----------|----------|------------|------|
| `adv-01` | Cloud Agents exigem aprovação manual para cada comando de terminal, como no Agent local. | **Falso** | Run Modes aplicam-se a agentes locais; Cloud Agents rodam em VM dedicada sem prompts de aprovação por comando. | `cloud-agents` |
| `adv-02` | Bugbot pode ser acionado manualmente comentando `cursor review` em um PR. | **Verdadeiro** | Também funciona com `bugbot run`; reviews automáticas rodam a cada update do PR. | `bugbot` |
| `adv-03` | No SDK em modo "local", os modelos de IA rodam inteiramente na sua máquina, offline. | **Falso** | "Local" refere-se ao loop do agente e filesystem; toda inferência usa modelos hospedados pelo Cursor. | `sdk` |
| `adv-04` | Automations sempre rodam em Max Mode e não permitem desligá-lo. | **Verdadeiro** | Automations criam Cloud Agents, que usam Max Mode por padrão, sem toggle para desativar. | `automations` |
| `adv-05` | Privacy Mode impede que Cloud Agents armazenem cópias temporárias do repositório. | **Falso** | Cloud Agents precisam armazenar o repo criptografado temporariamente; Privacy Mode garante que o código não seja usado para treino. | `privacidade` |
| `adv-06` | Team Rules têm precedência sobre Project Rules e User Rules em conflitos. | **Verdadeiro** | Ordem de precedência: Team Rules → Project Rules → User Rules. | `rules` |
| `adv-07` | Side chats funcionam com Cloud Agents da mesma forma que com Agent local. | **Falso** | Side chats são local-only por enquanto; suporte a Cloud Agents está em desenvolvimento. | `cloud-agents` |
| `adv-08` | Enterprise inclui Cursor Blame, que mostra atribuição de código humano vs IA no git blame. | **Verdadeiro** | Recurso exclusivo Enterprise; também há AI Code Tracking API e Conversation Insights. | `enterprise` |
| `adv-09` | O modo Debug gera hipóteses e adiciona logs antes de aplicar um fix direcionado. | **Verdadeiro** | Diferente do Agent normal, Debug investiga com evidência de runtime antes de corrigir. | `agent` |
| `adv-10` | Admins Enterprise podem configurar MCP Allowlist para controlar quais servidores MCP a equipe pode usar. | **Verdadeiro** | Em Team Settings > MCP Configuration; aprova por padrão de command (stdio) ou URL (HTTP/SSE). | `enterprise` |
| `adv-11` | Background Agents e Cloud Agents são produtos diferentes no Cursor. | **Falso** | Background Agents foi renomeado para Cloud Agents — é o mesmo produto. | `cloud-agents` |
| `adv-12` | O pacote npm do Cursor SDK se chama `@cursor/sdk` e requer Node.js 22.13+. | **Verdadeiro** | Também existe `cursor-sdk` para Python. O SDK permite automação programática de agentes. | `sdk` |
| `adv-13` | Auto-review (desde Cursor 3.6) usa um classificador para decidir se comandos precisam de aprovação. | **Verdadeiro** | Modo recomendado que combina classificador de risco com sandbox para comandos. | `segurança` |
| `adv-14` | Grok 4.5 está disponível em todos os países onde o Cursor opera. | **Falso** | Grok 4.5 não está disponível na União Europeia (julho/2026). | `modelos` |
| `adv-15` | Automations podem ser disparadas por eventos do GitHub, Slack, webhooks, Linear, Sentry e PagerDuty. | **Verdadeiro** | Automations são Cloud Agents agendados ou orientados a eventos. | `automations` |

---

## 4. Requisitos Funcionais

### RF-01 — Landing Page
- Exibir título, descrição breve e botão "Começar"
- Mostrar estatísticas do leaderboard via Supabase (melhor score geral, total de partidas)
- Design limpo com identidade visual inspirada no Cursor (dark theme, acentos em azul/roxo)

### RF-02 — Seleção de Nível
- Cards clicáveis para: Iniciante, Intermediário, Avançado, Misto
- Cada card mostra: nome, descrição, quantidade de perguntas, tempo por pergunta
- Campo opcional para nome do jogador (default: "Anônimo")

### RF-03 — Tela de Quiz
- Exibir: número da pergunta (ex: 3/10), timer circular, pontuação atual, streak
- Pergunta em destaque com botões grandes **Verdadeiro** e **Falso**
- Barra de progresso linear
- Animação sutil ao acertar (verde) ou errar (vermelho)

### RF-04 — Feedback por Pergunta
- Após responder (ou timeout): mostrar se acertou/errou + explicação educativa
- Botão "Próxima" para avançar (auto-avanço após 3 segundos se o usuário não clicar)
- Exibir pontos ganhos naquela pergunta

### RF-05 — Tela de Resultado
- Score final, acertos/total, porcentagem, tempo total
- Classificação por performance (ver seção 2.4)
- Botões: "Jogar Novamente", "Ver Leaderboard", "Escolher Outro Nível"

### RF-06 — Leaderboard (Supabase)
- Buscar rankings do Supabase via API Route ou Server Component
- Tabela com Top 10 por nível selecionado + aba "Geral"
- Colunas: posição, nome, score, acertos, nível, data
- Destacar entrada do jogador atual (comparar `id` retornado após submit)
- Indicador de loading durante fetch; mensagem de erro com botão "Tentar novamente"
- Estatísticas na landing: melhor score geral e total de partidas (agregação Supabase)

### RF-09 — Persistência de Score
- Ao concluir o quiz, enviar score para `POST /api/leaderboard`
- Validar payload no servidor (nome ≤ 50 chars, score ≥ 0, level válido)
- Retornar `id` da entrada criada para highlight no leaderboard
- Não reenviar score se o usuário clicar "Jogar Novamente" sem completar novo quiz

### RF-07 — Embaralhamento
- Embaralhar perguntas ao iniciar cada sessão
- No modo Misto, embaralhar também a ordem dentro de cada subconjunto de nível

### RF-08 — Atalhos de Teclado
- `V` = Verdadeiro, `F` = Falso, `Enter` = Próxima pergunta

---

## 5. Especificação Técnica

### 5.1 Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | **Next.js 15** (App Router) |
| Linguagem | **TypeScript** (strict mode) |
| Estilização | **Tailwind CSS 4** |
| Animações | **Framer Motion** (transições de quiz) |
| Backend / DB | **Supabase** (PostgreSQL + Row Level Security) |
| Cliente Supabase | **@supabase/supabase-js** + **@supabase/ssr** (Server Components / Route Handlers) |
| Estado (quiz) | **React useReducer** (em memória durante a sessão) |
| Estado (preferências) | **localStorage** (nome do jogador) |
| Testes | **Vitest** + **Testing Library** |
| Linting | **ESLint** + **Prettier** |
| Deploy | **Vercel** (frontend) + **Supabase** (backend gerenciado) |

### 5.2 Estrutura de Diretórios

```
cursor-quiz/
├── prd.md
├── README.md
├── .env.local.example          # Template de variáveis Supabase
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── supabase/
│   └── migrations/
│       └── 001_leaderboard.sql # Schema + RLS
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── quiz/
│   │   │   └── page.tsx
│   │   ├── results/
│   │   │   └── page.tsx
│   │   ├── leaderboard/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── leaderboard/
│   │           └── route.ts    # GET (listar) + POST (salvar score)
│   ├── components/
│   │   ├── ui/
│   │   ├── quiz/
│   │   ├── leaderboard/
│   │   └── layout/
│   ├── data/
│   │   └── questions.ts
│   ├── hooks/
│   │   ├── useQuiz.ts
│   │   ├── useTimer.ts
│   │   └── useLeaderboard.ts   # Fetch/submit via API
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser client (anon key)
│   │   │   └── server.ts       # Server client (Route Handlers)
│   │   ├── scoring.ts
│   │   ├── shuffle.ts
│   │   ├── config.ts
│   │   └── storage.ts          # localStorage (nome do jogador)
│   └── types/
│       ├── index.ts
│       └── database.ts         # Tipos gerados do Supabase
└── tests/
    ├── scoring.test.ts
    ├── shuffle.test.ts
    ├── useQuiz.test.ts
    └── leaderboard-api.test.ts
```

### 5.3 Modelo de Dados

```typescript
// src/types/index.ts

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface Question {
  id: string;
  level: DifficultyLevel;
  text: string;
  answer: boolean;        // true = Verdadeiro, false = Falso
  explanation: string;
  tags?: string[];        // ex: ['pricing', 'rules', 'mcp']
}

interface QuizSession {
  playerName: string;
  level: DifficultyLevel | 'mixed';
  questions: Question[];
  currentIndex: number;
  score: number;
  correctAnswers: number;
  streak: number;
  answers: AnswerRecord[];
  startedAt: string;      // ISO 8601
  finishedAt?: string;
}

interface AnswerRecord {
  questionId: string;
  userAnswer: boolean | null;  // null = timeout
  correct: boolean;
  pointsEarned: number;
  timeSpentMs: number;
}

interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  level: DifficultyLevel | 'mixed';
  correct_answers: number;
  total_questions: number;
  percentage: number;
  created_at: string;           // ISO 8601 (timestamptz no Supabase)
}

interface LeaderboardSubmitPayload {
  player_name: string;
  score: number;
  level: DifficultyLevel | 'mixed';
  correct_answers: number;
  total_questions: number;
  percentage: number;
}
```

### 5.4 Schema Supabase

```sql
-- supabase/migrations/001_leaderboard.sql

create table public.leaderboard_entries (
  id            uuid primary key default gen_random_uuid(),
  player_name   text not null check (char_length(player_name) between 1 and 50),
  score         integer not null check (score >= 0),
  level         text not null check (level in ('beginner', 'intermediate', 'advanced', 'mixed')),
  correct_answers integer not null check (correct_answers >= 0),
  total_questions integer not null check (total_questions > 0),
  percentage    numeric(5,2) not null check (percentage >= 0 and percentage <= 100),
  created_at    timestamptz not null default now()
);

-- Índices para consultas do Top 10
create index idx_leaderboard_score_desc on public.leaderboard_entries (score desc);
create index idx_leaderboard_level_score on public.leaderboard_entries (level, score desc);
create index idx_leaderboard_created_at on public.leaderboard_entries (created_at desc);

-- Row Level Security
alter table public.leaderboard_entries enable row level security;

-- Qualquer visitante pode inserir um score (leaderboard anônimo)
create policy "Allow anonymous insert"
  on public.leaderboard_entries
  for insert
  to anon
  with check (true);

-- Qualquer visitante pode ler o ranking
create policy "Allow anonymous select"
  on public.leaderboard_entries
  for select
  to anon
  using (true);

-- Sem UPDATE ou DELETE para anon (proteção básica)
```

### 5.5 Variáveis de Ambiente

```bash
# .env.local.example

NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
# SUPABASE_SERVICE_ROLE_KEY — NÃO usar no frontend; apenas se necessário em scripts admin
```

| Variável | Onde usar | Obrigatória |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server (com RLS) | Sim |

### 5.6 API — Leaderboard

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/leaderboard?level=beginner&limit=10` | Top N por nível ou geral (`level=all`) |
| `GET` | `/api/leaderboard/stats` | Melhor score e total de partidas |
| `POST` | `/api/leaderboard` | Salvar score ao finalizar quiz |

**POST body:**
```json
{
  "player_name": "Bruno",
  "score": 1250,
  "level": "intermediate",
  "correct_answers": 8,
  "total_questions": 10,
  "percentage": 80
}
```

**Validações no servidor (Route Handler):**
- Rejeitar campos ausentes ou tipos inválidos (400)
- `player_name`: trim, 1–50 caracteres; default "Anônimo"
- `score`: inteiro ≥ 0
- `level`: enum válido
- `percentage`: coerente com `correct_answers / total_questions`

### 5.7 Lógica de Pontuação

```typescript
// src/lib/scoring.ts

const BASE_POINTS = 100;
const MAX_SPEED_BONUS = 50;
const STREAK_BONUS = 25;
const STREAK_THRESHOLD = 3;

function calculatePoints(
  correct: boolean,
  timeRemainingMs: number,
  totalTimeMs: number,
  currentStreak: number
): number {
  if (!correct) return 0;

  const speedBonus = Math.round(
    (timeRemainingMs / totalTimeMs) * MAX_SPEED_BONUS
  );
  const streakBonus =
    currentStreak >= STREAK_THRESHOLD ? STREAK_BONUS : 0;

  return BASE_POINTS + speedBonus + streakBonus;
}
```

### 5.8 Configuração por Nível

```typescript
// src/lib/config.ts

export const LEVEL_CONFIG = {
  beginner: {
    label: 'Iniciante',
    description: 'Negócio, planos e posicionamento do Cursor',
    questionsPerSession: 10,
    timePerQuestionSec: 30,
    color: 'emerald',
  },
  intermediate: {
    label: 'Intermediário',
    description: 'Tab, Agent, Rules, Skills, MCP e indexação',
    questionsPerSession: 10,
    timePerQuestionSec: 25,
    color: 'blue',
  },
  advanced: {
    label: 'Avançado',
    description: 'Cloud Agents, SDK, Enterprise, Privacy e Bugbot',
    questionsPerSession: 10,
    timePerQuestionSec: 20,
    color: 'purple',
  },
  mixed: {
    label: 'Misto',
    description: 'Mix de todos os níveis — desafio completo',
    questionsPerSession: 10,
    timePerQuestionSec: 25,
    color: 'amber',
  },
} as const;
```

### 5.9 localStorage Keys (apenas preferências locais)

```typescript
const STORAGE_KEYS = {
  PLAYER_NAME: 'cursor-quiz-player-name',
  LAST_ENTRY_ID: 'cursor-quiz-last-entry-id',  // highlight no leaderboard
} as const;
```

> O leaderboard **não** usa localStorage — toda persistência de scores é no Supabase.

### 5.10 Rotas (App Router)

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `page.tsx` | Landing + CTA |
| `/quiz?level=beginner` | `quiz/page.tsx` | Quiz ativo |
| `/results` | `results/page.tsx` | Resultado da sessão |
| `/leaderboard` | `leaderboard/page.tsx` | Ranking (dados do Supabase) |
| `GET /api/leaderboard` | `api/leaderboard/route.ts` | Listar Top N |
| `POST /api/leaderboard` | `api/leaderboard/route.ts` | Salvar score |

### 5.11 Requisitos Não-Funcionais

| ID | Requisito | Critério |
|----|-----------|----------|
| RNF-01 | Performance | First Contentful Paint < 1.5s |
| RNF-02 | Responsividade | Funcional em 320px–1920px |
| RNF-03 | Acessibilidade | WCAG AA mínimo |
| RNF-04 | SEO básico | Meta tags na landing |
| RNF-05 | Bundle size | < 200KB JS gzipped (excl. Framer Motion) |
| RNF-06 | Disponibilidade API | Leaderboard tolera falha com retry; quiz funciona offline até o fim |
| RNF-07 | Latência Supabase | GET leaderboard < 500ms p95 |
| RNF-08 | Segurança | RLS ativo; sem service role key no client; validação server-side no POST |

---

## 6. Design e UX

### 6.1 Diretrizes Visuais

- **Tema:** Dark mode por padrão (fundo `#0a0a0f`, cards `#16161f`)
- **Tipografia:** Inter (UI) + JetBrains Mono (pontuação/timer)
- **Cores de acento:**
  - Primária: `#6c5ce7` (roxo Cursor-like)
  - Sucesso: `#00b894`
  - Erro: `#e17055`
  - Timer urgente: `#fdcb6e` → `#e17055` (transição)
- **Botões V/F:**
  - Verdadeiro: verde com ícone ✓
  - Falso: vermelho com ícone ✗
  - Tamanho mínimo: 120×56px (touch-friendly)

### 6.2 Responsividade

- Mobile-first (320px+)
- Botões V/F empilhados verticalmente em telas < 640px
- Timer e score em header fixo durante o quiz

### 6.3 Acessibilidade

- Contraste WCAG AA mínimo
- Botões com `aria-label` descritivo
- Timer com `aria-live="polite"`
- Navegação por teclado: `V` = Verdadeiro, `F` = Falso, `Enter` = Próxima

### 6.4 Micro-interações

- Timer pulsa quando < 5 segundos
- Confete sutil ao atingir "Cursor Master"
- Streak badge animado a partir de 3 acertos

---

## 7. Critérios de Aceite (MVP)

- [ ] Usuário consegue escolher um dos 4 níveis e iniciar quiz
- [ ] 10 perguntas embaralhadas são exibidas com timer funcional
- [ ] Resposta correta/incorreta exibe feedback com explicação
- [ ] Pontuação calculada corretamente (base + speed bonus + streak)
- [ ] Tela de resultado mostra score, % e classificação
- [ ] Leaderboard persiste no **Supabase** e exibe Top 10 por nível e geral
- [ ] Score enviado ao Supabase ao finalizar quiz com validação server-side
- [ ] Landing exibe estatísticas agregadas do Supabase (melhor score, total de partidas)
- [ ] Estados de loading/erro tratados no leaderboard
- [ ] App responsivo em mobile e desktop
- [ ] 45 perguntas seed carregadas (15 por nível)
- [ ] Testes unitários para scoring, shuffle e reducer do quiz
- [ ] Build de produção sem erros (`next build`)
- [ ] Atalhos de teclado V/F/Enter funcionais

---

## 8. Roadmap Pós-MVP

| Fase | Feature | Prioridade |
|------|---------|-----------|
| v1.1 | Modo estudo (sem timer) | Alta |
| v1.1 | Modo escuro/claro toggle | Média |
| v1.1 | Compartilhar resultado (link / imagem) | Média |
| v1.2 | Perguntas de múltipla escolha | Baixa |
| v1.2 | Admin panel para editar perguntas | Baixa |
| v1.2 | Internacionalização (EN) | Baixa |
| v2.0 | Autenticação e perfis de usuário (vincular scores) | Alta |
| v2.0 | Modo multiplayer em tempo real | Baixa |
| v2.0 | Painel admin para moderar leaderboard | Média |

---

## 9. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Informações do Cursor desatualizadas | Alto | Tags de versão nas perguntas; revisão trimestral do banco |
| Spam no leaderboard (scores falsos) | Médio | Validação server-side; rate limiting na API Route; sem DELETE público |
| Indisponibilidade do Supabase | Médio | Quiz funciona offline; submit com retry; mensagem amigável no leaderboard |
| Perguntas muito técnicas para público misto | Médio | Nível Iniciante focado em negócio; UX sugere nível adequado |
| Timer causa ansiedade | Baixo | Timer generoso (20–30s); sem penalidade por timeout |
| Pricing muda frequentemente | Médio | Perguntas focam em conceitos, não valores exatos quando possível |

---

## 10. Referências

- [Cursor Docs](https://cursor.com/docs)
- [Cursor Pricing](https://cursor.com/pricing)
- [Cursor Models & Pricing](https://cursor.com/docs/account/pricing)
- [Cursor Rules](https://cursor.com/docs/rules)
- [Cursor Skills](https://cursor.com/docs/skills)
- [Cursor MCP](https://cursor.com/docs/mcp)
- [Cursor Cloud Agents](https://cursor.com/docs/cloud-agent)
- [Cursor SDK](https://cursor.com/docs/sdk/typescript)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Docs](https://supabase.com/docs)
- [Supabase + Next.js SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

---

## 11. Instruções para o Cursor (Agent)

Ao implementar este projeto, siga esta ordem:

1. **Scaffold:** `npx create-next-app@latest cursor-quiz --typescript --tailwind --app --src-dir`
2. **Supabase:** Criar projeto no Supabase; aplicar migration `001_leaderboard.sql`; configurar `.env.local`
3. **Dependências:** `npm install @supabase/supabase-js @supabase/ssr`
4. **Clientes Supabase:** Criar `src/lib/supabase/client.ts` e `server.ts`
5. **Tipos e dados:** Criar `src/types/index.ts`, `src/types/database.ts` e `src/data/questions.ts` com as 45 perguntas da seção 3
6. **API:** Implementar `src/app/api/leaderboard/route.ts` (GET + POST com validação)
7. **Lógica quiz:** Implementar `scoring.ts`, `shuffle.ts`, `config.ts`, `useQuiz.ts`, `useTimer.ts`, `useLeaderboard.ts`
8. **Componentes UI:** Button, Card, Timer, ProgressBar
9. **Páginas:** Landing → Level Select → Quiz → Results → Leaderboard
10. **Estilização:** Dark theme conforme seção 6
11. **Testes:** scoring, shuffle, quiz reducer, API leaderboard (mock Supabase)
12. **Polish:** Animações, acessibilidade, responsividade, estados de erro/retry
13. **Build:** Verificar `next build` sem erros; validar env vars documentadas no README

**Setup Supabase (checklist):**
- [ ] Projeto criado em [supabase.com](https://supabase.com)
- [ ] Migration aplicada (SQL Editor ou CLI)
- [ ] RLS policies ativas e testadas (insert + select como anon)
- [ ] Variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no `.env.local` e na Vercel

**Convenções:**
- Commits em português
- Componentes funcionais com TypeScript strict
- Sem dependências desnecessárias
- Código autoexplicativo, comentários apenas para lógica não óbvia

import { LEVEL_CONFIG } from "@/lib/config";
import { pickRandom, shuffle } from "@/lib/shuffle";
import type { DifficultyLevel, Question, QuizLevel } from "@/types";

export const ALL_QUESTIONS: Question[] = [
  // Nível Iniciante
  {
    id: "beg-01",
    level: "beginner",
    text: "O Cursor é uma extensão do VS Code que você instala no editor existente.",
    answer: false,
    explanation:
      "O Cursor é um editor standalone (fork do VS Code). Roda como aplicativo separado.",
    tags: ["posicionamento"],
  },
  {
    id: "beg-02",
    level: "beginner",
    text: "O plano Hobby gratuito permite usar Agent, Chat e Tab com uso limitado.",
    answer: true,
    explanation:
      "O Hobby inclui Agent, Chat e Tab com limites de uso, sem necessidade de cartão de crédito.",
    tags: ["pricing"],
  },
  {
    id: "beg-03",
    level: "beginner",
    text: "O plano Pro ($20/mês) inclui $20 de uso de API por mês.",
    answer: true,
    explanation:
      "Planos individuais incluem crédito de API que renova a cada ciclo de billing.",
    tags: ["pricing"],
  },
  {
    id: "beg-04",
    level: "beginner",
    text: "O Cursor usa o VS Code Marketplace para instalar extensões.",
    answer: false,
    explanation:
      "Usa o registro Open VSX; nem todas as extensões do Marketplace da Microsoft estão disponíveis.",
    tags: ["setup"],
  },
  {
    id: "beg-05",
    level: "beginner",
    text: "Planos Enterprise incluem pooled usage, SCIM e audit logs.",
    answer: true,
    explanation:
      "Recursos Enterprise incluem uso compartilhado, provisionamento SCIM e logs de auditoria.",
    tags: ["enterprise"],
  },
  {
    id: "beg-06",
    level: "beginner",
    text: '"Auto" é um plano de assinatura mais barato que o Pro.',
    answer: false,
    explanation:
      "Auto é um roteador de modelos que escolhe o modelo automaticamente — não é um plano.",
    tags: ["pricing"],
  },
  {
    id: "beg-07",
    level: "beginner",
    text: "Você pode importar settings, extensões e keybindings do VS Code para o Cursor.",
    answer: true,
    explanation:
      "Em Settings > General > Account > VS Code Import, em um clique.",
    tags: ["setup"],
  },
  {
    id: "beg-08",
    level: "beginner",
    text: "Todos os planos pagos individuais incluem Tab completions ilimitadas.",
    answer: true,
    explanation: "Pro, Pro+ e Ultra incluem completions de Tab ilimitadas.",
    tags: ["pricing"],
  },
  {
    id: "beg-09",
    level: "beginner",
    text: "O Cursor só funciona para desenvolvedores que escrevem JavaScript.",
    answer: false,
    explanation:
      "Suporta múltiplas linguagens e modelos de vários provedores (OpenAI, Anthropic, Google, etc.).",
    tags: ["posicionamento"],
  },
  {
    id: "beg-10",
    level: "beginner",
    text: "Planos Teams Standard e Premium cobram por usuário por mês.",
    answer: true,
    explanation:
      "Standard: $40/usuário/mês; Premium: $120/usuário/mês com 5x os limites de Agent.",
    tags: ["pricing"],
  },
  {
    id: "beg-11",
    level: "beginner",
    text: "O Cursor substitui completamente a necessidade de um desenvolvedor humano no time.",
    answer: false,
    explanation:
      "O Cursor é uma ferramenta de produtividade que amplia capacidades humanas — não substitui julgamento, arquitetura e revisão.",
    tags: ["negócio"],
  },
  {
    id: "beg-12",
    level: "beginner",
    text: "O GitHub Copilot e o Cursor oferecem exatamente a mesma experiência de agente autônomo.",
    answer: false,
    explanation:
      "O Cursor oferece agente autônomo com indexação profunda, Rules, MCP, Cloud Agents — experiência mais ampla que autocomplete inline.",
    tags: ["posicionamento"],
  },
  {
    id: "beg-13",
    level: "beginner",
    text: "O plano Ultra ($200/mês) inclui $400 de uso de API por mês.",
    answer: true,
    explanation:
      "O Ultra é o plano individual de maior capacidade, com $400 de crédito API incluído.",
    tags: ["pricing"],
  },
  {
    id: "beg-14",
    level: "beginner",
    text: "Times no plano Teams têm acesso ao Bugbot para revisão de PRs.",
    answer: true,
    explanation:
      "Bugbot está incluído nos planos Teams Standard e Premium para code reviews agenticos.",
    tags: ["pricing"],
  },
  {
    id: "beg-15",
    level: "beginner",
    text: "O Cursor armazena todo o seu código na nuvem permanentemente para treinar modelos de IA.",
    answer: false,
    explanation:
      "Com Privacy Mode ativado, o código não é usado para treino. Mesmo sem Privacy Mode, o armazenamento é para operação do serviço, não treino permanente.",
    tags: ["privacidade"],
  },
  // Nível Intermediário
  {
    id: "int-01",
    level: "intermediate",
    text: "O Tab pode sugerir edições em múltiplos arquivos ao mesmo tempo.",
    answer: true,
    explanation:
      "Tab prevê edições cross-file quando mudanças em um arquivo exigem updates em outro.",
    tags: ["tab"],
  },
  {
    id: "int-02",
    level: "intermediate",
    text: "User Rules se aplicam ao Inline Edit (Ctrl/Cmd+K).",
    answer: false,
    explanation:
      "User Rules aplicam-se ao Agent (Chat), não ao Inline Edit — conforme documentação oficial.",
    tags: ["rules"],
  },
  {
    id: "int-03",
    level: "intermediate",
    text: "Arquivos de regras de projeto devem usar a extensão `.mdc` em `.cursor/rules/`.",
    answer: true,
    explanation:
      "`.md` sem frontmatter é ignorado pelo sistema de rules; use AGENTS.md para markdown simples.",
    tags: ["rules"],
  },
  {
    id: "int-04",
    level: "intermediate",
    text: "Skills ficam em pastas com `SKILL.md` e podem ser invocadas com `/`.",
    answer: true,
    explanation:
      "Carregadas de `.cursor/skills/`, `~/.cursor/skills/` e compatíveis com `.agents/skills/`.",
    tags: ["skills"],
  },
  {
    id: "int-05",
    level: "intermediate",
    text: "MCP permite conectar o Cursor a ferramentas externas como Notion, Linear e bancos de dados.",
    answer: true,
    explanation:
      "Model Context Protocol expõe tools, resources e prompts de servidores externos.",
    tags: ["mcp"],
  },
  {
    id: "int-06",
    level: "intermediate",
    text: "A indexação do codebase roda manualmente e nunca atualiza sozinha.",
    answer: false,
    explanation:
      "Indexa automaticamente ao abrir o projeto e sincroniza periodicamente (~5 minutos).",
    tags: ["indexação"],
  },
  {
    id: "int-07",
    level: "intermediate",
    text: "Composer 2.5 é um modelo próprio do Cursor treinado para coding agentic.",
    answer: true,
    explanation:
      "Modelo first-party com pool de uso generoso nos planos individuais.",
    tags: ["modelos"],
  },
  {
    id: "int-08",
    level: "intermediate",
    text: "No modo Ask, o Agent pode editar arquivos se você pedir com educação.",
    answer: false,
    explanation: "Ask é read-only — responde e explora sem fazer edições.",
    tags: ["agent"],
  },
  {
    id: "int-09",
    level: "intermediate",
    text: ".cursorignore impede que terminal e MCP leiam arquivos ignorados.",
    answer: false,
    explanation:
      "Bloqueia indexação e contexto do Agent; terminal e MCP podem acessar arquivos ignorados.",
    tags: ["configuração"],
  },
  {
    id: "int-10",
    level: "intermediate",
    text: "Trocar de modo (Agent → Ask → Plan) mantém o mesmo contexto da conversa.",
    answer: false,
    explanation:
      "Cada modo usa contexto próprio; trocar de modo inicia janela de contexto fresca.",
    tags: ["agent"],
  },
  {
    id: "int-11",
    level: "intermediate",
    text: "O atalho Ctrl/Cmd+I abre o painel do Agent.",
    answer: true,
    explanation: "É o atalho padrão para abrir o Agent (Chat) no Cursor.",
    tags: ["atalhos"],
  },
  {
    id: "int-12",
    level: "intermediate",
    text: "Rules e Skills são a mesma coisa — apenas nomes diferentes para instruções persistentes.",
    answer: false,
    explanation:
      "Rules são instruções de contexto no prompt; Skills são pacotes portáveis com scripts e invocação via `/`.",
    tags: ["rules"],
  },
  {
    id: "int-13",
    level: "intermediate",
    text: "O modo Plan cria um plano de implementação antes de escrever código.",
    answer: true,
    explanation:
      "Plan mode foca em planejamento e discussão antes de executar mudanças.",
    tags: ["agent"],
  },
  {
    id: "int-14",
    level: "intermediate",
    text: "Você pode referenciar arquivos específicos no chat usando @ mentions.",
    answer: true,
    explanation:
      "@ permite incluir arquivos, pastas, documentação, terminal output e outros contextos.",
    tags: ["contexto"],
  },
  {
    id: "int-15",
    level: "intermediate",
    text: "O Cursor suporta apenas modelos da OpenAI.",
    answer: false,
    explanation:
      "Suporta modelos de múltiplos provedores: OpenAI, Anthropic, Google, xAI, e modelos próprios (Composer, Auto).",
    tags: ["modelos"],
  },
  // Nível Avançado
  {
    id: "adv-01",
    level: "advanced",
    text: "Cloud Agents exigem aprovação manual para cada comando de terminal, como no Agent local.",
    answer: false,
    explanation:
      "Run Modes aplicam-se a agentes locais; Cloud Agents rodam em VM dedicada sem prompts de aprovação por comando.",
    tags: ["cloud-agents"],
  },
  {
    id: "adv-02",
    level: "advanced",
    text: "Bugbot pode ser acionado manualmente comentando `cursor review` em um PR.",
    answer: true,
    explanation:
      "Também funciona com `bugbot run`; reviews automáticas rodam a cada update do PR.",
    tags: ["bugbot"],
  },
  {
    id: "adv-03",
    level: "advanced",
    text: 'No SDK em modo "local", os modelos de IA rodam inteiramente na sua máquina, offline.',
    answer: false,
    explanation:
      '"Local" refere-se ao loop do agente e filesystem; toda inferência usa modelos hospedados pelo Cursor.',
    tags: ["sdk"],
  },
  {
    id: "adv-04",
    level: "advanced",
    text: "Automations sempre rodam em Max Mode e não permitem desligá-lo.",
    answer: true,
    explanation:
      "Automations criam Cloud Agents, que usam Max Mode por padrão, sem toggle para desativar.",
    tags: ["automations"],
  },
  {
    id: "adv-05",
    level: "advanced",
    text: "Privacy Mode impede que Cloud Agents armazenem cópias temporárias do repositório.",
    answer: false,
    explanation:
      "Cloud Agents precisam armazenar o repo criptografado temporariamente; Privacy Mode garante que o código não seja usado para treino.",
    tags: ["privacidade"],
  },
  {
    id: "adv-06",
    level: "advanced",
    text: "Team Rules têm precedência sobre Project Rules e User Rules em conflitos.",
    answer: true,
    explanation:
      "Ordem de precedência: Team Rules → Project Rules → User Rules.",
    tags: ["rules"],
  },
  {
    id: "adv-07",
    level: "advanced",
    text: "Side chats funcionam com Cloud Agents da mesma forma que com Agent local.",
    answer: false,
    explanation:
      "Side chats são local-only por enquanto; suporte a Cloud Agents está em desenvolvimento.",
    tags: ["cloud-agents"],
  },
  {
    id: "adv-08",
    level: "advanced",
    text: "Enterprise inclui Cursor Blame, que mostra atribuição de código humano vs IA no git blame.",
    answer: true,
    explanation:
      "Recurso exclusivo Enterprise; também há AI Code Tracking API e Conversation Insights.",
    tags: ["enterprise"],
  },
  {
    id: "adv-09",
    level: "advanced",
    text: "O modo Debug gera hipóteses e adiciona logs antes de aplicar um fix direcionado.",
    answer: true,
    explanation:
      "Diferente do Agent normal, Debug investiga com evidência de runtime antes de corrigir.",
    tags: ["agent"],
  },
  {
    id: "adv-10",
    level: "advanced",
    text: "Admins Enterprise podem configurar MCP Allowlist para controlar quais servidores MCP a equipe pode usar.",
    answer: true,
    explanation:
      "Em Team Settings > MCP Configuration; aprova por padrão de command (stdio) ou URL (HTTP/SSE).",
    tags: ["enterprise"],
  },
  {
    id: "adv-11",
    level: "advanced",
    text: "Background Agents e Cloud Agents são produtos diferentes no Cursor.",
    answer: false,
    explanation:
      "Background Agents foi renomeado para Cloud Agents — é o mesmo produto.",
    tags: ["cloud-agents"],
  },
  {
    id: "adv-12",
    level: "advanced",
    text: "O pacote npm do Cursor SDK se chama `@cursor/sdk` e requer Node.js 22.13+.",
    answer: true,
    explanation:
      "Também existe `cursor-sdk` para Python. O SDK permite automação programática de agentes.",
    tags: ["sdk"],
  },
  {
    id: "adv-13",
    level: "advanced",
    text: "Auto-review (desde Cursor 3.6) usa um classificador para decidir se comandos precisam de aprovação.",
    answer: true,
    explanation:
      "Modo recomendado que combina classificador de risco com sandbox para comandos.",
    tags: ["segurança"],
  },
  {
    id: "adv-14",
    level: "advanced",
    text: "Grok 4.5 está disponível em todos os países onde o Cursor opera.",
    answer: false,
    explanation:
      "Grok 4.5 não está disponível na União Europeia (julho/2026).",
    tags: ["modelos"],
  },
  {
    id: "adv-15",
    level: "advanced",
    text: "Automations podem ser disparadas por eventos do GitHub, Slack, webhooks, Linear, Sentry e PagerDuty.",
    answer: true,
    explanation:
      "Automations são Cloud Agents agendados ou orientados a eventos.",
    tags: ["automations"],
  },
];

export function getQuestionsByLevel(level: DifficultyLevel): Question[] {
  return ALL_QUESTIONS.filter((q) => q.level === level);
}

export function selectSessionQuestions(level: QuizLevel): Question[] {
  if (level === "mixed") {
    const beginner = pickRandom(getQuestionsByLevel("beginner"), 4);
    const intermediate = pickRandom(getQuestionsByLevel("intermediate"), 3);
    const advanced = pickRandom(getQuestionsByLevel("advanced"), 3);
    return shuffle([...beginner, ...intermediate, ...advanced]);
  }

  const count = LEVEL_CONFIG[level].questionsPerSession;
  return pickRandom(getQuestionsByLevel(level), count);
}

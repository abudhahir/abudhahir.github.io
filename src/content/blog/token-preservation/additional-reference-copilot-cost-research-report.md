---
title: "Research Report: Controlling GitHub Copilot Cost"
date: "2026-06-05"
excerpt: "Research report on controlling GitHub Copilot cost under the new AI Credits billing model."
tags: ["GitHub Copilot", "Research", "Cost Optimization"]
author: "Abudhahir"
readTime: "10 min read"
series: "Token Preservation"
---

# Team Guideline: Controlling GitHub Copilot Cost (AI Credits) — Business, Enterprise & Pro, Stock Copilot

> Research report compiled June 2026. Pricing, allowances, model lists, and per-token rates change frequently — verify all figures against current GitHub documentation before publishing internally.

## TL;DR
- **The single most important fact: as of June 1, 2026, GitHub Copilot no longer bills on "premium requests" — it bills on token-based GitHub AI Credits (1 credit = $0.01).** Your whole guideline must be built around tokens (model choice x context size x output length x number of agent steps), not request counts. The old "premium request multiplier" system is legacy and now applies only to a shrinking pool of annual Pro/Pro+ subscribers.
- **Code completions and Next Edit Suggestions remain unlimited and free on all paid plans; everything else (Chat, agent mode, Copilot CLI, code review, cloud agent) draws down AI credits.** The cheapest reliable savings: default to "Auto" model selection (10% discount), route simple work to lightweight models, keep context small, split research/plan/implement into fresh sessions, and reserve frontier models (GPT-5.5, Claude Opus) for genuinely hard tasks.
- **For Business/Enterprise, credits are pooled org-wide and admins control spend through four budget layers; the critical, easy-to-miss settings are that "Stop usage when budget limit is reached" is OFF by default on enterprise/cost-center limits, and user-level budgets are the only hard per-person stop.** Configure these before educating the team.

## Key Findings
1. **Billing changed fundamentally on June 1, 2026.** Premium Request Units (PRUs) were replaced by GitHub AI Credits, metered on input + output + cached tokens at each model's published API rate. This is date-sensitive; verify all figures against current GitHub docs.
2. **Plan allowances (monthly):** Pro = 1,500 credits ($10 value); Pro+ = 7,000 ($39); Max = 20,000 ($100); Business = 1,900/user; Enterprise = 3,900/user. Existing Business/Enterprise customers receive higher promotional pooled allowances of **$30 (3,000 credits) and $70 (7,000 credits) per user/month for the first three months (June 1 - September 1, 2026)** before reverting to standard.
3. **Output tokens are the expensive ones** (roughly 5x input on most models), and most input tokens come from context (files, history, tool schemas), not your typed prompt.
4. **Agent mode and Copilot CLI are the biggest cost drivers** — a single task fires many model calls across many tool steps with growing context.
5. **There is no longer an automatic fallback to a cheaper model** when credits/budget run out — work simply stops (except free completions). This makes budgeting and model discipline more important than under the old system.
6. **Auto model selection gives a 10% discount** and routes simple tasks to cheaper models.
7. **Admins control cost through policies (which models/features are allowed) and four budget layers** (user-level, cost-center, organization, enterprise).

## Details

### 1. How Copilot billing actually works (2025-2026)

**The pivot.** Through most of 2025, Copilot used "premium requests": each paid plan got a fixed monthly number, and each interaction consumed 1 request x a model multiplier (0x for base models, up to ~30x for frontier/"fast" models). That system is now **legacy.** On **June 1, 2026**, GitHub moved all plans to **usage-based billing with GitHub AI Credits**, where **1 AI credit = $0.01 USD** and usage is metered on **input, output, and cached tokens** at each model's published per-token rate.

**Who is still on the old multiplier system?** Only Pro/Pro+ subscribers on existing **annual** plans, until their plan expires. For them, multipliers actually increased on June 1. Everyone on monthly Pro/Pro+, and all Business/Enterprise, is on AI Credits.

**Monthly included allowances (AI Credits):**

| Plan | Price | Included credits/month | Notes |
|---|---|---|---|
| Free | $0 | small credit allowance + 2,000 completions | select models only |
| Pro | $10 | 1,500 (1,000 base + 500 flex) | |
| Pro+ | $39 | 7,000 (3,900 base + 3,100 flex) | |
| Max | $100 | 20,000 (10,000 base + 10,000 flex) | upgrade-only after June 1, 2026 |
| Business | $19/user | 1,900/user, pooled | promo $30 (3,000) Jun 1-Sep 1, 2026 |
| Enterprise | $39/user | 3,900/user, pooled | promo $70 (7,000) Jun 1-Sep 1, 2026 |

Credits do **not** roll over month to month. "Base credits" match your subscription price; the "flex allotment" is a variable top-up GitHub can adjust as model economics change.

**What's free vs. metered.** Code completions (ghost text) and Next Edit Suggestions are **unlimited and not billed** on all paid plans. Everything that calls a model is metered: Copilot Chat, agent mode, Copilot CLI, Copilot cloud agent, Copilot Spaces, Spark, code review, and third-party coding agents.

**Per-token model rates (per 1M tokens, input / output).** Lightweight: GPT-5 mini $0.25/$2.00 (included), GPT-5.4 nano $0.20/$1.25, MAI-Code-1-Flash $0.75/$4.50, Raptor mini $0.25/$2.00. Versatile: Claude Haiku 4.5 $1.00/$5.00, Claude Sonnet 4.x $3.00/$15.00, GPT-5.4 $2.50/$15.00. Powerful/frontier: GPT-5.5 $5.00/$30.00, Claude Opus 4.5-4.8 $5.00/$25.00, Gemini 3.1 Pro $2.00/$12.00. The spread between cheapest and most expensive is ~20x on input — model choice is now the single biggest cost lever.

**Ask vs. Edit vs. Agent mode.** All three consume credits when they call a model; the difference is how many tokens. Ask is typically one prompt + one response; Edit touches one or a few files; Agent mode runs an autonomous loop (plan -> read files -> edit -> run tools -> self-correct), each step adding to context and output. Under AI Credits, **every token the agent processes is metered**, so agent mode is dramatically more expensive than a single chat.

**Overage / budgets.** When included credits are exhausted, you either set a dollar budget for additional usage (billed at $0.01/credit) or work stops until the next cycle. There is **no automatic fallback** to a free model anymore.

**Usage limits are separate from credits.** GitHub also enforces session and weekly token-based rate limits (introduced April 2026) to protect infrastructure. You can hit these even with credits remaining.

**Business vs. Enterprise differences.** Enterprise gets a larger per-user pool (3,900 vs. 1,900), priority access to new models, codebase indexing, and GitHub.com chat. Both pool credits org-wide.

### 2. Where cost accumulates (the drivers)
- **Context size / context bloat.** Copilot automatically attaches the active file, selected code, nearby/open files, repo content, custom instructions, and tool/skill schemas to every request.
- **Long chat sessions.** Multi-turn sessions resend growing conversation history each turn.
- **Agent mode multiplying steps.** Each tool call, file read, edit, and self-correction is another metered model call.
- **MCP and tool-calling overhead.** Each enabled MCP tool adds roughly 100-500 tokens per agent step to the system prompt.
- **Vague prompts -> re-prompting.** Ambiguous prompts produce wrong answers, then re-tries, each a fresh metered interaction.
- **Verbose output.** Output tokens cost ~5x input.
- **Large refactors / multi-file edits.** More files in scope = more input and output tokens.
- **Code review dual-metering.** Copilot code review consumes both AI credits AND GitHub Actions minutes.

### 3. Concrete cost-saving best practices

**Model selection strategy.** Default to "Auto" (10% discount, routes simple tasks to cheaper models). Use lightweight models for quick edits/boilerplate/Q&A. Reserve frontier models for architecture, complex debugging, gnarly refactors.

**Prompt engineering for efficiency.** Be specific and scope-bounded. Add "Code only, no explanation" defaults to instructions to cut output tokens. Avoid re-submitting large prompts.

**Context management.** Use #-references to scope context. Close irrelevant tabs. Use files.exclude / .gitignore. Break large tasks into smaller scoped ones. Use /compact and start new chats when switching topics.

**Right mode / right tool.** Inline completions are free. Use Ask mode for simple questions. Reserve agent mode for genuine multi-file work.

**Session hygiene.** Separate Research -> Plan -> Implement into fresh sessions.

**Custom/repository instructions.** A concise copilot-instructions.md reduces repeated mistakes and back-and-forth.

### 4. VS Code-specific levers
Monitoring via Status Bar Copilot icon. Key settings.json keys: chat.disableAIFeatures, github.copilot.enable, github.copilot.nextEditSuggestions.enabled, chat.agent.enabled, chat.agent.maxRequests (default 25), github.copilot.chat.summarizeAgentConversationHistory.enabled, chat.tools.compressOutput.enabled, chat.utilityModel / chat.utilitySmallModel.

### 5. Copilot CLI-specific levers
Each prompt is metered. Use /model to switch to cheaper models or Auto. /context visualizes usage; /compact reclaims space; /clear or /new resets. Auto-compacts at ~80%. Plan mode (Shift+Tab). Use /fleet sparingly. Content exclusion does NOT apply to CLI or agent mode.

### 6. Admin / org-level enforcement (Business & Enterprise)
Policies control which models/features are allowed. Four budget layers: user-level (only hard per-person stop), cost-center, organization, enterprise. Critical: "Stop usage when budget limit is reached" is OFF by default on enterprise/cost-center limits. Monitoring via AI usage dashboard, downloadable reports, email alerts at 75/90/100%.

### 7. Practical team guideline structure
Decision tree by mode/model; do's and don'ts; treat as FinOps (value per credit, not minimal usage).

## Caveats
- Pricing, allowances, model lists, and per-token rates change frequently. Verify against current docs.
- The June 1, 2026 transition is very recent; tooling was still maturing.
- Annual Pro/Pro+ subscribers are on a different (legacy multiplier) system until renewal.
- Content exclusion is a privacy control, not a cost tool, and does not work in agent mode or the CLI.

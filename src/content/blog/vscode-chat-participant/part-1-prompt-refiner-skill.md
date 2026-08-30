---
title: "The Prompt-Refiner Skill: Where a Chat Participant Starts"
subtitle: "A cheap model, a frontmatter file, and the art of choosing a prompting technique"
excerpt: "Before there was a VS Code extension, there was a skill. This part builds the prompt-refiner skill - a SKILL.md that classifies a raw prompt and rewrites it as a structured prompt using the cheapest available model."
date: 2026-08-30
author: "Abu Dhahir"
tags: ["vs code", "extension", "chat participant", "copilot", "prompt engineering", "skills", "tutorial"]
series: "VS Code Chat Participant"
seriesOrder: 2
draft: false
---

Before there was a VS Code extension, a chat participant, or a webview, there was a single idea: **most people write bad prompts, and the fix should cost almost nothing.** That idea became a Copilot *skill*, and the skill became the seed for an entire extension. This series documents that journey, step by step.

Here's the thing worth noticing up front: I did not start by scaffolding an extension. I started by building the smallest useful unit - a skill - and let the extension grow *around* it. If you take one lesson from this series, take that one.

## What a Copilot skill is

A skill is a folder containing a `SKILL.md` file with YAML frontmatter and a markdown body. The frontmatter carries metadata; the body carries instructions. When the skill is invoked, the agent (or, later, our extension) injects the body as system-like context and runs it.

```markdown
---
name: prompt-refiner
description: Refines a raw prompt into a structured prompt, auto-selecting the prompting technique.
model: cheap
---

You are a prompt-refinement engine. Given a raw prompt: ...
```

Three fields matter here:

- `name` - the identifier we'll later look up from code.
- `description` - what it does; surfaced when an agent decides whether to use it.
- `model: cheap` - a hint that this skill should run on the *cheapest* model available, because refinement is a low-cost transform, not a reasoning task.

## The core job: classify, then choose a technique

The skill does three things to any raw prompt it receives:

1. **Classify the task type** - generation, classification, extraction, reasoning, style transfer, or instruction-following.
2. **Choose the prompting technique** - zero-shot, zero-shot chain-of-thought, one-shot, few-shot, multi-shot, or few-shot CoT.
3. **Rewrite it** into a structured prompt using a fixed template.

The technique selection is where the real value lives. The skill encodes a decision rule, not a fixed format:

```markdown
Technique selection:
- Simple, well-specified, low ambiguity → zero-shot (0 examples)
- Multi-step reasoning (math, logic, debugging) but self-contained → zero-shot CoT
- Output format/style hard to describe in words → one-shot (1 example)
- Classification, transformation, paraphrasing, style matching, structured extraction → few-shot (2-5 examples)
- High ambiguity, many edge cases, consistency across varied inputs → multi-shot (6+ examples)
- Complex reasoning where examples must demonstrate the thought process → few-shot CoT
```

This is the difference between a *skill* and a *prompt template*. A template is static; this skill makes a judgment call about how the output should be shaped, then applies the template that fits.

## The output contract

The skill doesn't return free text. It returns a strict shape so a human (or our future extension) can parse it:

```markdown
Strict output format:

Technique: <technique> (<N> examples)

```markdown
...structured prompt...
```
```

And it fills a template, omitting sections the chosen technique doesn't use:

```markdown
## Role
## Objective
## Context
## Input
## Reasoning approach   (CoT only)
## Examples   (n-shot only; each as an explicit "Input: <x> → Output: <y>" pair)
## Output format
## Constraints
```

## The rules that keep it honest

A prompt refiner is dangerous if it gets creative. The skill is constrained so it *preserves intent* rather than inventing requirements:

```markdown
Rules:
- Never invent requirements the user did not state; stay faithful to the raw intent.
- Preserve domain-specific terms, code, or data verbatim.
- If the raw prompt is already well-structured, return it unchanged with a one-line note.
- Match verbosity to the target model: weaker models need more explicit instructions.
```

That last rule is subtle and important: refinement for a weak model needs *more* explicit scaffolding, so the skill adapts its verbosity to the model it's told it will run on.

## Why "cheap" matters

Refinement is deterministic and low-stakes. Spending a frontier model on it is waste. The `model: cheap` frontmatter flag is the first appearance of a theme that will run through this entire series: **route low-cost work to cheap models, and reserve reasoning models for reasoning.** In the next part we'll start turning this skill into something VS Code can ship.

## What's next

In Part 2, we scaffold the extension that will *host* this skill - and, in a nice bit of dogfooding, we use the prompt-refiner itself to generate the bootstrap objective.

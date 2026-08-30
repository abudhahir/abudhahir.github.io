---
title: "A Second Participant: @bootcamp and the YAML Course System"
subtitle: "Stateful courses, quiz grading, and free-text interaction in the Chat view"
excerpt: "Part 6 adds @bootcamp — a guided-coach participant driven by YAML course files, with explain/exercise/quiz steps, progress tracked in globalState, and free-text interaction for hints and quiz answers."
date: 2026-09-04
author: "Abu Dhahir"
tags: ["vs code", "extension", "chat participant", "yaml", "courses", "typescript", "tutorial"]
series: "VS Code Chat Participant"
draft: false
---

`@cleveloper` is a *tool*: you ask, it answers. `@bootcamp` is different — it's *stateful*. It remembers where you are in a course across sessions, grades your quizzes, and walks you step by step. This final part builds it.

## Two participants, one extension

The extension registers both participants side by side in `activate`:

```ts
export function activate(context: vscode.ExtensionContext): void {
  createParticipant(context);          // @cleveloper
  createBootcampParticipant(context);  // @bootcamp
  registerRefineWebview(context);
  registerSnippetsCommand(context);
}
```

They share the model-selection and skill machinery but have completely different request handling. `@bootcamp` doesn't answer questions — it drives a state machine.

## The course format

A course is a YAML file with a list of steps, each one of three types:

```yaml
id: context-engineering
title: Context Engineering
description: Learn to assemble the context a coding agent needs to produce correct code on the first try.
steps:
  - type: explain
    title: What is context engineering?
    content: >
      Context engineering is the practice of deliberately selecting and
      structuring the information you hand to a coding agent so it can reason
      accurately about your codebase.
  - type: exercise
    title: Assemble a context block
    prompt: >
      Pick a small task in your current project and write down the context a
      colleague would need: the goal, the relevant files, and any constraints.
    hint: Start with the goal, then list files, then constraints.
  - type: quiz
    question: Which of these is the most important part of a context block?
    options:
      - The author's name
      - The goal of the task
      - The font size
    answer: 1
    explanation: The goal tells the agent what "done" looks like; the other two are noise.
```

Three step types, each with its own fields:

- **`explain`** — teaching content, shown directly.
- **`exercise`** — a hands-on prompt plus an optional `hint`.
- **`quiz`** — a question with `options` and a 0-based `answer` index, plus an `explanation` shown after grading.

Five courses ship with the extension: `context-engineering`, `token-optimization`, `prompting-fix-bugs`, `coding-agents`, and `copilot-cli-tips`.

## Discovery and validation

Courses load from `media/courses/<id>/course.yaml` (shipped) or `courses/<id>/course.yaml` in the workspace (override). Parsing is strict — a malformed course is skipped, not guessed at:

```ts
export function parseCourse(raw: string, sourcePath: string): Course | undefined {
  let data: unknown;
  try {
    data = loadYaml(raw);
  } catch (err) {
    warn(`Course at ${sourcePath} is not valid YAML and was skipped: ...`);
    return undefined;
  }
  // ... validate id, title, description, non-empty steps, and each step's shape
}
```

The philosophy: **fail loudly, degrade gracefully**. A bad course warns and disappears from the list rather than crashing the participant or, worse, teaching nonsense. This is the same "surface errors inline, never crash" instinct from Part 3, applied to content.

## The command surface

`@bootcamp` exposes four slash commands and routes free text:

```ts
switch (request.command) {
  case 'courses': await handleCourses(context, stream); return;
  case 'start':   await handleStart(context, request.prompt, stream, token); return;
  case 'next':    await handleNext(context, stream, token); return;
  case 'status':  await handleStatus(context, stream); return;
  default:        await handleFreeText(context, request.prompt, stream, token); return;
}
```

- `/courses` — list discovered courses with their status.
- `/start <id>` — begin (or resume) a course at its saved step.
- `/next` — advance to the next step.
- `/status` — report progress and quiz scores across all courses.

## Progress: state that survives reloads

Progress lives in `globalState` under a single key, keyed by course id:

```ts
const PROGRESS_KEY = 'bootcamp.progress';

export interface CourseProgress {
  status: 'not-started' | 'in-progress' | 'completed';
  step: number;   // 0-based index of the current step
  score: number;  // percentage, 0 before any quiz
  correct: number;
  total: number;
}
```

`globalState` is the same store the snippet library used in Part 5 — the difference is that here it holds *positional* state (which step, which score) rather than *content*. That state is what makes `@bootcamp` feel like a coach rather than a search box: stop mid-course, reload VS Code, `/start` again, and you resume exactly where you left off.

## Free-text interaction

Between commands, the participant understands plain sentences — this is what makes it feel conversational:

- During an **exercise**, say `hint`, `help`, `stuck`, or `clue` to get the step's hint.
- Say `done`, `next`, `continue`, `ok`, or `yes` to advance past an explanation or exercise.
- During a **quiz**, answer by option number (`1`) or by the option text itself (`the goal`).

The quiz grading compares the user's answer against the stored `answer` index, records the result into the running score, and shows the explanation:

```ts
gradeQuizAnswer(/* user input, quiz, progress */);
recordQuizAnswer(/* progress, correct */);
```

This is a deliberate contrast with `@cleveloper`'s regex-based intent detection (Part 3): `@bootcamp` doesn't guess intent from a broad pattern — it matches against a *known step state*. The state machine constrains what "hint" or "done" could mean, so the matching can be precise.

## Model use: teach cheap, quiz free

One last model-selection detail. Teaching steps call the language model, but **quizzes never do** — grading is pure string/option matching against the `answer` index, no model involved. And teaching steps use `pickCheapestModel()`:

```ts
import { pickCheapestModel, toErrorMessage } from './languageModel';
```

The rule from Part 1 holds to the end: *explaining a concept is a cheap-model job; the user's quiz score is computed, not generated.* Model calls are reserved for where they add genuine value, and everything else stays deterministic.

## The whole picture

Six parts later, the extension is a single `activate` call wiring together two participants, a skill runner, a webview, and a snippet library — all built outward from one small skill. If there's a throughline, it's this: **start with the smallest useful unit, keep the expensive parts (model calls) only where they earn their keep, and let everything else stay deterministic and testable.**

The full source for this series lives at [`abudhahir/vsc-chat-participant-tutorial`](https://github.com/abudhahir/vsc-chat-participant-tutorial).

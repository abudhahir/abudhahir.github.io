---
title: "The Skill Runner and the Snippet Library"
subtitle: "Loading SKILL.md from disk, resolving model precedence, and persisting snippets"
excerpt: "Part 5 turns the prompt-refiner SKILL.md into a runnable unit - parsing frontmatter, resolving models with a four-step precedence chain, and saving/inserting snippets through globalState and native user snippet files."
date: 2026-09-03
author: "Abu Dhahir"
tags: ["vs code", "extension", "chat participant", "skills", "snippets", "typescript", "tutorial"]
series: "VS Code Chat Participant"
seriesOrder: 6
draft: false
---

Until now, `runSkill` has been a black box. This part opens it. It also builds the snippet system - the feature that turns a one-off refined prompt into a reusable asset.

## The skill runner: from file to stream

A skill lives on disk as `SKILL.md`. The runner has three jobs: find it, parse it, run it.

### Finding the skill

Skills are discovered in two places, with the workspace taking precedence over the shipped copy:

```ts
function candidateDirs(context: vscode.ExtensionContext): string[] {
  const dirs: string[] = [];
  for (const folder of vscode.workspace.workspaceFolders ?? []) {
    dirs.push(path.join(folder.uri.fsPath, 'skills'));
  }
  dirs.push(path.join(context.extensionPath, 'media', 'skills'));
  return dirs;
}
```

This is the extension's answer to the "where do skills live" question from the exploration phase: **a workspace `skills/<name>/SKILL.md` overrides the shipped `media/skills/<name>/SKILL.md`**. Users get a shipped default and a per-project escape hatch, in that order.

### Parsing frontmatter

The frontmatter parser is deliberately simple - split on the first `---` fence and read `key: value` lines:

```ts
const FRONTMATTER_RE = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) data[key] = value;
  }
  return { data, body: raw.slice(match[0].length).trim() };
}
```

No YAML library here - the frontmatter schema is flat `key: value`, and a hand-rolled parser keeps the dependency footprint at zero (the only runtime dependency in the whole extension is `js-yaml`, and that's for the *courses*, not the skills).

### Running it

Running a skill means injecting its instructions plus the raw input, and streaming the reply:

```ts
export async function runSkill(context, name, input, stream, token, modelId?) {
  const skill = await findSkill(context, name);
  if (!skill) {
    stream.markdown(`⚠️ Skill "${name}" not found.`);
    return undefined;
  }

  stream.progress?.('Running skill…');
  try {
    const model = await pickSkillModel(skill.model, modelId);
    const message = vscode.LanguageModelChatMessage.User(`${skill.instructions}\n\n${input}`);
    const response = await model.sendRequest([message], {}, token);
    for await (const fragment of response.text) {
      stream.markdown(fragment);
    }
    return modelDisplayName(model);
  } catch (err) {
    stream.markdown(`⚠️ ${toErrorMessage(err)}`);
    return undefined;
  }
}
```

The skill is just a prompt: the `instructions` body and the raw input concatenated into a single user message. The `stream` object here is the seam that lets the *same* runner feed a chat response stream (Part 3) or a webview (Part 4) without either knowing about the other.

## Model precedence: four steps

The runner resolves a model through a chain that encodes exactly how much each party can override:

```ts
export async function pickSkillModel(preference, modelId?) {
  if (modelId) {
    const byId = await vscode.lm.selectChatModels().then(ms => ms.find(m => m.id === modelId));
    if (byId) return byId;
  }
  const p = (preference ?? '').trim().toLowerCase();
  if (p && p !== 'cheap') {
    const match = (await vscode.lm.selectChatModels())
      .find(m => `${m.vendor} ${m.family} ${m.name}`.toLowerCase().includes(p));
    if (match) return match;
  }
  return pickRefineModel();
}
```

The precedence, highest to lowest:

1. **Explicit per-run `modelId`** - the webview's model picker, the strongest signal: the user chose this model *for this run*.
2. **A hard frontmatter pin** - any `model` value *other than* `cheap` in `SKILL.md`, matched by substring. The skill author's explicit choice.
3. **The `cleveloper.refine.preferredModel` setting** - the user's global preference (from Part 3's `pickRefineModel`).
4. **The cheapest available model** - the default.

The subtlety is in what `cheap` *means*: the prompt-refiner's frontmatter says `model: cheap`, which is *not* a hard pin - it defers to the user setting before falling back to cheapest. A user preference is never silently overridden, and the author's `cheap` hint only kicks in when nothing more specific is available.

## Snippets: a two-tier persistence story

"Save to snippets" from the webview or `/refine` needs somewhere durable to put the text. The answer is *two* stores, kept in sync.

### The in-extension library

The primary store is `globalState` - VS Code's per-user key-value store:

```ts
const LIBRARY_KEY = 'cleveloper.snippets.library';

export async function saveSnippet(context, body) {
  const name = `cleveloper-${timestamp()}`;
  const snippet = { id: `snip-${Date.now()}`, name, body, createdAt: Date.now() };
  const all = listSnippets(context);
  all.push(snippet);
  await context.globalState.update(LIBRARY_KEY, all);
  await saveNativeSnippet(name, body);
  return snippet;
}
```

`globalState` is the right tool: it's already namespaced to your extension, survives reloads, and needs no file paths. But it's invisible to the rest of VS Code.

### The native user snippet file

So we *also* mirror each snippet into the real user snippets file, so it shows up in VS Code's own snippet system:

```ts
async function saveNativeSnippet(name, body) {
  const filePath = path.join(userSnippetsDir(), 'cleveloper.code-snippets');
  let existing = {};
  try {
    existing = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
  } catch { /* file does not exist yet */ }
  existing[name] = {
    prefix: name,
    body: body.split(/\r?\n/),
    description: 'Saved from @cleveloper'
  };
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf8');
}
```

The `userSnippetsDir()` helper computes the platform-specific path (it has to distinguish "Code" from "Code - Insiders" on every OS). The result: a snippet saved from our extension is simultaneously available to our picker *and* to VS Code's native snippet completion.

### Inserting where the cursor is

The picker command has one job - put the chosen snippet at the cursor, editor first, chat as fallback:

```ts
const editor = vscode.window.activeTextEditor;
if (editor) {
  await editor.edit((edit) => edit.insert(editor.selection.active, picked.snippet.body));
  return;
}
await insertIntoChat(picked.snippet.body);
```

The chat insertion is a command we call by name, pre-filling the Chat input:

```ts
async function insertIntoChat(body: string): Promise<void> {
  await vscode.commands.executeCommand('workbench.action.chat.open', {
    query: body,
    isPartialQuery: true
  });
}
```

`isPartialQuery: true` is a small but meaningful choice: the snippet *appends* to whatever's already in the input rather than replacing it.

## What's next

The extension now has a participant, a skill runner, a webview, and snippets. Part 6 adds a *second* participant - `@bootcamp` - with a completely different shape: a stateful, YAML-driven course system.

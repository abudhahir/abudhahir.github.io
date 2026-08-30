---
title: "A Chat Participant That Talks: Request Routing and Model Selection"
subtitle: "createChatParticipant, natural-language detection, and the cheapest-model fallback chain"
excerpt: "Part 3 makes @cleveloper respond — routing /refine to the skill and everything else to Copilot Chat, plus the model-selection logic: pinned model, cheapness ranking, and the preferredModel setting."
date: 2026-09-01
author: "Abu Dhahir"
tags: ["vs code", "extension", "chat participant", "language model", "copilot", "typescript", "tutorial"]
series: "VS Code Chat Participant"
draft: false
---

A participant is just a name until it has a request handler. This part wires `@cleveloper` to two backends — the prompt-refiner skill and raw Copilot Chat — and builds the model-selection logic that decides *which* model runs each job.

## Registering the participant

The registration is small; the handler is everything:

```ts
const PARTICIPANT_ID = 'chat-participant-tutorial.cleveloper';

export function createParticipant(context: vscode.ExtensionContext): vscode.ChatParticipant {
  const participant = vscode.chat.createChatParticipant(
    PARTICIPANT_ID,
    (request, chatContext, stream, token) => handleRequest(context, request, chatContext, stream, token)
  );

  participant.iconPath = new vscode.ThemeIcon('sparkle');

  participant.followupProvider = {
    provideFollowups() {
      return [
        { prompt: 'refine my prompt: ', label: 'Refine a prompt' },
        { prompt: 'what can you do?', label: 'What can you do?' }
      ];
    }
  };

  context.subscriptions.push(participant);
  return participant;
}
```

Two details beyond the handler:

- `followupProvider` returns *suggested follow-ups* — the little clickable chips VS Code shows after a response. This is how you make a participant discoverable without a manual.
- `context.subscriptions.push(participant)` registers the participant's lifecycle with the extension so it's disposed cleanly.

## The routing decision

Every message hits `handleRequest`, which makes one decision — *which backend handles this?*

```ts
const handleRequest = async (context, request, _chatContext, stream, token) => {
  if (token.isCancellationRequested) return;

  if (request.command === 'snippets') {
    await handleSnippetsCommand(context, request.prompt, stream);
    return;
  }

  if (request.command === 'refine' || wantsPromptRefinement(request.prompt)) {
    await refineAndOfferSave(context, request.prompt, stream, token);
    return;
  }

  await streamChatResponse(request.prompt, stream, token);
};
```

Three routes:

1. **`/snippets`** — list or retrieve saved snippets (Part 5).
2. **`/refine`** — *or* any natural-language request that looks like "refine my prompt" — runs the skill.
3. **Everything else** — plain chat via Copilot Chat.

That second condition is the interesting one. A slash command is explicit, but users type sentences. So we detect intent in free text:

```ts
function wantsPromptRefinement(prompt: string): boolean {
  const text = prompt.toLowerCase();
  return (
    /\b(refine|improve|structure|engineer|rewrite)\b/.test(text) &&
    /\bprompt\b/.test(text)
  );
}
```

A verb *and* the word "prompt" both have to be present. "Improve this code" won't match; "improve my prompt" will. It's a deliberately narrow regex — broad heuristics here cause false routing, and a user who says "refine my prompt" to a generic chat is clearly asking for the skill.

## Streaming from Copilot Chat

The fallback route is plain chat, streamed fragment-by-fragment so the user sees tokens as they arrive:

```ts
export async function streamChatResponse(prompt, stream, token) {
  stream.progress('Thinking…');
  try {
    const model = await pickPreferredModel();
    const messages = [vscode.LanguageModelChatMessage.User(prompt)];
    const response = await model.sendRequest(messages, {}, token);
    for await (const fragment of response.text) {
      stream.markdown(fragment);
    }
  } catch (err) {
    stream.markdown(`⚠️ ${toErrorMessage(err)}`);
  }
}
```

The `vscode.lm` API is the bridge to the language model. `selectChatModels()` enumerates what's available, and `sendRequest` streams a response. Notice the error handling: a model outage shouldn't crash the participant — it should surface inline, in the chat, as a warning.

## Model selection: the fallback chain

This is where the "cheap vs. reasoning" theme from Part 1 becomes real code. The plain-chat route pins a preferred model and falls back when it's missing:

```ts
const PREFERRED_SELECTOR: vscode.LanguageModelChatSelector = {
  vendor: 'copilot',
  family: 'gpt-4o'
};

async function pickPreferredModel() {
  const pinned = await findModel(PREFERRED_SELECTOR);
  if (pinned) return pinned;
  return pickCheapestModel();
}
```

And "cheapest" is a ranking, not a guess:

```ts
function cheapnessRank(model: vscode.LanguageModelChat): number {
  const key = `${model.vendor} ${model.family} ${model.name}`.toLowerCase();
  if (key.includes('flash')) return 0;
  if (key.includes('mini')) return 1;
  if (key.includes('haiku')) return 2;
  if (key.includes('lite')) return 3;
  return 4;
}

export async function pickCheapestModel() {
  const models = await vscode.lm.selectChatModels();
  if (models.length === 0) throw new Error(NO_MODEL_MESSAGE);
  return [...models].sort((a, b) => cheapnessRank(a) - cheapnessRank(b))[0];
}
```

The ranking is by **family keyword** — `flash` > `mini` > `haiku` > `lite` > everything else. It's a heuristic, but a stable and explainable one: model families tend to sort by cost the same way they sort by capability, and this ranking encodes the common case without hardcoding any specific model id.

## The user setting plugs in

The `/refine` route uses a *different* selector — one that honors the `cleveloper.refine.preferredModel` setting we declared in Part 2:

```ts
export async function pickRefineModel() {
  const preferred = vscode.workspace
    .getConfiguration('cleveloper.refine')
    .get<string>('preferredModel', '')
    .trim()
    .toLowerCase();

  if (preferred) {
    const models = await vscode.lm.selectChatModels();
    const match = models.find((m) =>
      `${m.vendor} ${m.family} ${m.name}`.toLowerCase().includes(preferred)
    );
    if (match) return match;
  }

  return pickCheapestModel();
}
```

The setting is matched **substring-wise** against each model's vendor, family, and name, so `gpt-4o`, `flash`, `mini`, or `haiku` all work. If it's empty or matches nothing, we fall back to the cheapest available. The key design decision: *a user preference is never silently overridden — it either resolves or defers to a sane default.*

## What's next

The participant now talks. But a chat box is a constrained surface — you can't easily copy the result or pick a model visually. Part 4 fixes that with a theme-aware webview.

---
title: "A Theme-Aware Refine Webview: Streaming, Copy, and Model Picking"
subtitle: "Webview panels, CSP nonces, postMessage streaming, and respecting the active VS Code theme"
excerpt: "Part 4 builds the Cleveloper: Refine Prompt webview — a panel that takes a raw prompt, streams back the refined result, copies it to the clipboard, and picks a model, all while respecting the active VS Code theme."
date: 2026-09-02
author: "Abu Dhahir"
tags: ["vs code", "extension", "webview", "chat participant", "csp", "theme", "tutorial"]
series: "VS Code Chat Participant"
draft: false
---

A chat box is fine for conversation, but refining a prompt is a *document* task: you want a big text area, a model picker, and a copy button. That's what a webview is for. This part builds the `Cleveloper: Refine Prompt` panel.

## Why a webview instead of more chat commands

The `/refine` chat command (Part 3) already works. The webview earns its keep on three counts:

1. **A real editor surface** — paste, revise, re-run without polluting the chat transcript.
2. **Copy to clipboard** — a one-click `vscode.env.clipboard.writeText` that chat can't offer.
3. **Visual model selection** — a dropdown listing every reachable model, overriding the setting per-run.

## The panel and its lifecycle

A webview panel is a window-managed surface, and its lifecycle is where most of the subtlety lives:

```ts
function openRefinePanel(context: vscode.ExtensionContext): void {
  const panel = vscode.window.createWebviewPanel(
    'cleveloper.refine',
    'Cleveloper: Refine Prompt',
    vscode.ViewColumn.Active,
    { enableScripts: true }
  );

  let activeToken: vscode.CancellationTokenSource | undefined;

  panel.webview.html = getWebviewHtml(panel.webview, vscode.window.activeColorTheme.kind);

  void listModels()
    .then((models) => panel.webview.postMessage({ type: 'models', models }))
    .catch(() => panel.webview.postMessage({ type: 'models', models: [] }));

  const themeListener = vscode.window.onDidChangeActiveColorTheme((theme) => {
    panel.webview.postMessage({ type: 'theme', kind: theme.kind });
  });

  panel.onDidDispose(() => {
    activeToken?.cancel();
    activeToken?.dispose();
    themeListener.dispose();
  });
  // ...
}
```

Three things are set up before any user interaction:

- `activeToken` — a cancellation token so a re-run can abort the in-flight request. This matters: a slow model shouldn't keep streaming into a panel the user has already abandoned.
- The model list is **pushed asynchronously** after the panel loads, so the dropdown populates without blocking render.
- A **theme listener** watches for theme changes and notifies the webview, so the panel re-skins live.

## Message passing: host ↔ webview

The webview and the extension host are isolated processes; all communication is `postMessage`. The host's message switch is the contract:

```ts
panel.webview.onDidReceiveMessage(async (msg) => {
  switch (msg.type) {
    case 'refine': {
      const prompt = String(msg.prompt ?? '');
      if (!prompt.trim()) {
        panel.webview.postMessage({ type: 'hint', message: 'Enter a raw prompt first.' });
        break;
      }
      const modelId = typeof msg.modelId === 'string' ? msg.modelId : '';
      activeToken?.dispose();
      activeToken = new vscode.CancellationTokenSource();
      const stream = {
        markdown: (text) => panel.webview.postMessage({ type: 'chunk', text }),
        progress: () => {}
      };
      const usedModel = await runSkill(context, 'prompt-refiner', prompt, stream, activeToken.token, modelId);
      panel.webview.postMessage({ type: 'done', model: usedModel ?? '' });
      break;
    }
    case 'copy': {
      await vscode.env.clipboard.writeText(String(msg.text ?? ''));
      panel.webview.postMessage({ type: 'copied' });
      break;
    }
    case 'save-snippet': {
      await saveSnippet(context, String(msg.text ?? ''));
      panel.webview.postMessage({ type: 'snippet-saved' });
      break;
    }
  }
});
```

Notice how streaming works: the webview sends `refine`, the host calls `runSkill` with a `stream` object whose `markdown` re-posts each chunk back to the webview as `chunk`. The skill streams into the panel in real time, exactly like chat.

## The hard part: CSP and nonces

Webviews run in a sandbox with a Content Security Policy. A naive inline `<script>` is blocked. The standard fix is a **nonce** — a per-render random token echoed in both the CSP header and the script tag:

```ts
function getNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < 32; i++) text += chars.charAt(Math.floor(Math.random() * chars.length));
  return text;
}

const csp = [
  `default-src 'none'`,
  `style-src ${webview.cspSource} 'unsafe-inline'`,
  `script-src 'nonce-${nonce}'`
].join('; ');
```

`default-src 'none'` blocks everything by default; the only script allowed is the one tagged with this render's nonce. This is the single most important line of defense in any webview — skip it and you've shipped an XSS sink.

## Respecting the theme

The panel is styled entirely with VS Code's own CSS variables — `--vscode-foreground`, `--vscode-editor-background`, `--vscode-button-background`, and so on — so it inherits the active theme for free:

```css
body {
  color: var(--vscode-foreground);
  background-color: var(--vscode-editor-background);
}
button {
  color: var(--vscode-button-foreground);
  background-color: var(--vscode-button-background);
}
```

The one place theme needs explicit handling is high-contrast, where a `body` class carries the theme kind and the webview JS maps it:

```js
function applyTheme(kind) {
  const map = {
    1: 'vscode-light',
    2: 'vscode-dark',
    3: 'vscode-high-contrast',
    4: 'vscode-high-contrast-light'
  };
  document.body.className = map[kind] || 'vscode-dark';
}
```

This is why the theme listener from earlier exists: when the user flips themes mid-session, the host posts the new `kind`, and the webview re-applies the class live.

## What's next

The webview calls `runSkill` — but we've been hand-waving what a *skill runner* actually is. Part 5 unpacks it: how a `SKILL.md` on disk becomes a streamed model response, and how "save to snippets" turns a refined prompt into a reusable asset.

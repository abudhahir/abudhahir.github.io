---
title: "Part 0: The Idea I Didn't Know I Had"
subtitle: "A rambling, honest intro to the series — and why I built this thing"
excerpt: "No plan, one petty observation, and a cheap trick. This is the story of how I accidentally built a VS Code extension with two chat participants, told the way it actually happened — dead ends, renames, and all."
date: 2026-08-29
author: "Abu Dhahir"
tags: ["vs code", "extension", "chat participant", "copilot", "story", "tutorial"]
series: "VS Code Chat Participant"
draft: false
---

Okay, real talk before we get anywhere near a `contributes` block.

I did not set out to build an extension. I set out to fix something mildly annoying, and then — like a person who goes to the store for milk and comes home with a stand mixer, two houseplants, and a new hobby — I ended up with a VS Code extension that has *two* chat participants, a webview, a snippet library, and a course system. I don't know how it happened either. That's partly why I'm writing this down.

## The thought that started it (it was petty)

Here's the whole origin story, minus the dramatic lighting: **most prompts people type are terrible.** Not because people are dumb — because nobody teaches this stuff, and because a genuinely good prompt is a little *crafted object*. A role. An objective. Some context. Constraints. Maybe a couple of examples in exactly the right shape. That's a surprising amount of furniture to arrange in a sentence you typed while your coffee was getting cold.

And then came the second thought — the one that actually mattered, the one my wallet liked — *why should fixing a bad prompt cost anything?* Refining a prompt isn't hard reasoning. It's not "prove Fermat's last theorem." It's a transform. Deterministic-ish, low-stakes, totally reversible. If I mess it up, I just try again. So why on earth would I hand that job to the biggest, fanciest, most expensive model in the drawer?

Those two little thoughts — *prompts are crafted* and *crafting should be cheap* — are the entire seed of this project. Every single thing that follows is just those two thoughts, wearing increasingly fancy hats.

## What this series is NOT

Let me set expectations before you get invested, because this is not going to read like the tutorials you're used to.

A normal tutorial starts with a blank folder, runs a scaffold command, and then marches forward feature by feature like the author had a blueprint taped to the wall from minute one. Cute. That is the opposite of what happened here. I started with a *skill* — literally one markdown file with instructions in it — and let the extension grow *around* it like a hermit crab finding progressively fancier shells. The scaffold came later. The participant came later. The webview, the snippets, the second participant, the course thing — every one of them showed up because the previous step made the next step feel obvious. Not because I planned it. Because I tripped into it.

So this series is a story, told in the order things actually went down, warts included. There will be dead ends. There will be a rename (the participant was not always called `@cleveloper`, and I will tell you why). There will be decisions that look *deeply* smart in hindsight and were, in the moment, mostly me shrugging and saying "well, this is probably fine." I'll try to be honest about which was which.

## The map, in six steps

Here's roughly where we're headed, so you can brace yourself:

1. **The skill.** One `SKILL.md` that looks at your sad little prompt and rewrites it into something respectable. The smallest useful unit.
2. **The scaffold.** Turning that file into something a tool can ship — and, in a move I'm still proud of, using the skill to write its own spec. (A tool that bootstraps itself. What could go wrong.)
3. **The participant.** Getting `@cleveloper` to actually talk: routing requests, streaming out of Copilot Chat, and the surprisingly fiddly business of deciding which model does which job.
4. **The webview.** A real editor surface with a copy button and a model picker, themed properly. This part has opinions about CSS.
5. **The skill runner and snippets.** How a file sitting on disk turns into a streamed response, and how a nicely refined prompt turns into something you can keep.
6. **The second participant.** `@bootcamp`, a stateful little coach that teaches you stuff from YAML course files. Yes, I built a robot that assigns homework.

## The bootcamp detour (or: why are there TWO of these now?)

I want to pause on step six for a second, because it's the part that surprised me most, and it deserves more than one bullet.

By the time `@cleveloper` was working, I had built a thing that *makes prompts better*. Nice, but here's the uncomfortable question that followed it around: *who's making me better?* Every conversation I had with the extension was one-directional. It rewrites my prompts, I read the result, we both move on with our lives. Nothing sticks. There's no friction, no check, no "okay but did you actually learn anything?"

That's when it clicked that a chat participant that *tells* you things is fine, but a chat participant that *quizzes* you is a completely different animal. A tutor isn't a lecturer. A tutor makes you do the problem, then watches you flail, then tells you where you flailed. And the thing about flailing is, it's how things actually get into your head. Lecture goes in one ear and out the other; a quiz you bombed stays with you forever.

So `@bootcamp` was born out of pure spite for my own memory, basically. It's driven by YAML course files — explain a bit, throw an exercise at you, grade the attempt — and crucially, it *remembers* your progress. It has state. That's the part that makes it feel alive instead of like a fancy `console.log` with opinions.

And here's where the cheap-things-are-cheap rule paid off a second time: the grading is *computed*, not generated. A quiz is just "did the answer hit these points," and I refuse to wake up a language model to count to three. The model talks; the code scores. Best of both worlds, and my token bill stays gloriously boring.

I'll go deep on all of this in the last part. Just wanted you to see the shape of it early, because the bootcamp is where the whole "this wasn't a plan, it was a spiral" thing is most obvious.

## The one weird idea that holds it together

If you take exactly one thing away from this whole series, make it this: **start with the smallest useful unit, and only pay for the expensive parts where they actually earn their keep.**

Everything in this extension is that sentence wearing a different shirt. The skill *is* the smallest useful unit. The model-selection logic exists purely so cheap work goes to cheap models and real reasoning goes to the models that are worth the tokens. Quiz grading is *computed*, not generated, because — and I cannot stress this enough — a score out of five does not need a language model. A calculator can do it. A small child with a crayon could do it. Do not spend a cent of GPU on it.

The reason the extension ends up feeling weirdly coherent is not that I planned it. It's that every single decision, however accidental, points in the same direction. Like it knew what it wanted to be before I did.

## Should you read this?

You'll have the most fun if you've written a bit of TypeScript and used VS Code enough to know what an extension is. You do *not* need to have built a chat participant before — that's the entire point, I hadn't either. Everything's shown in real code straight out of the repo, and I'll spend more time explaining *why* a piece exists than *what* it does, because the "what" you can just read.

The full source lives at [`abudhahir/vsc-chat-participant-tutorial`](https://github.com/abudhahir/vsc-chat-participant-tutorial), in case you want to follow along with a checkout instead of just nodding at the screen.

Right. Enough preamble. Let's go find a file, and an idea.

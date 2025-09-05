import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';

/**
 * RevealSlides
 * Renders a Reveal.js-compatible container that reads slides from markdown.
 * Initialization and assets are handled by the parent page.
 */
export default function RevealSlides({ markdown = "", className = "", height = '75vh' }) {
  const containerRef = useRef(null);
  
  // Split markdown into Reveal.js-compatible horizontal/vertical stacks
  const splitSlides = (md) => {
    const horiz = (md || '').trim().split(/\n---\n/g); // horizontal separator
    return horiz.map((h) => h.split(/\n--\n/g)); // vertical separator
  };

  const stacks = splitSlides(markdown);

  useEffect(() => {
    if (!markdown) return;

    // Helper to inject a script and await load
    const loadScript = (src) => new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });

    // Helper to inject a stylesheet once
    const loadStyle = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      document.head.appendChild(l);
    };

    // Load Reveal core CSS (layout only) and highlight theme
    loadStyle('https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.css');
    loadStyle('https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/highlight/monokai.css');

    // Load scripts then initialize
    (async () => {
      await loadScript('https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.js');
      await loadScript('https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/highlight/highlight.js');
      await loadScript('https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/notes/notes.js');

      // Initialize Reveal targeting the first .reveal found (this container)
      if (window.Reveal && containerRef.current) {
        const deck = new window.Reveal(containerRef.current, {
          embedded: true,
          controls: true,
          progress: true,
          slideNumber: true,
          hash: false,
          center: true,
          plugins: [window.RevealHighlight, window.RevealNotes],
        });
        deck.initialize();
      }
    })();
  }, [markdown]);

  return (
    <div ref={containerRef} className={`reveal reveal-embedded ${className}`.trim()} style={{ height }}>
      <style>{`
        .reveal.reveal-embedded { background: transparent !important; color: hsl(var(--foreground)) !important; }
        .reveal.reveal-embedded .slides { text-align: left; }
        .reveal.reveal-embedded h1,
        .reveal.reveal-embedded h2,
        .reveal.reveal-embedded h3,
        .reveal.reveal-embedded h4,
        .reveal.reveal-embedded h5,
        .reveal.reveal-embedded h6 { color: hsl(var(--foreground)) !important; }
        .reveal.reveal-embedded a { color: hsl(var(--primary)) !important; }
        .reveal.reveal-embedded pre,
        .reveal.reveal-embedded code { background: hsl(var(--secondary)) !important; color: hsl(var(--foreground)) !important; }
        .reveal.reveal-embedded .progress span { background: hsl(var(--primary)) !important; }
      `}</style>
      <div className="slides">
        {stacks.map((stack, i) => (
          stack.length > 1 ? (
            <section key={`h-${i}`}>
              {stack.map((s, j) => (
                <section key={`v-${i}-${j}`} dangerouslySetInnerHTML={{ __html: marked.parse(s) }} />
              ))}
            </section>
          ) : (
            <section key={`s-${i}`} dangerouslySetInnerHTML={{ __html: marked.parse(stack[0]) }} />
          )
        ))}
      </div>
    </div>
  );
}

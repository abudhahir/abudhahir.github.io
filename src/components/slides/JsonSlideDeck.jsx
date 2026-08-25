import React, { useState, useEffect, useCallback, useRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import SlideStyles from './SlideStyles';
import * as Tpl from './SlideTemplates';

/**
 * Maps JSON string types to the actual React component.
 */
const ComponentMap = {
  Slide: Tpl.Slide,
  TitleSlide: Tpl.TitleSlide,
  Eyebrow: Tpl.Eyebrow,
  Headline: Tpl.Headline,
  Hl: Tpl.Hl,
  Cool: Tpl.Cool,
  Vio: Tpl.Vio,
  Lead: Tpl.Lead,
  StatRow: Tpl.StatRow,
  Stat: Tpl.Stat,
  CardGrid: Tpl.CardGrid,
  SlideCard: Tpl.SlideCard,
  TickList: Tpl.TickList,
  NoteBlock: Tpl.NoteBlock,
  DataTable: Tpl.DataTable,
  Spectrum: Tpl.Spectrum,
  PoolReservoir: Tpl.PoolReservoir,
  NestedLayers: Tpl.NestedLayers,
  Layer: Tpl.Layer,
  LadderChart: Tpl.LadderChart,
  Stages: Tpl.Stages,
  StageCard: Tpl.StageCard,
  SplitColumns: Tpl.SplitColumns,
  SplitCol: Tpl.SplitCol,
  Code: Tpl.Code,
  Mono: Tpl.Mono,
};

/**
 * Recursively parses and renders a JSON block.
 */
function renderBlock(block, idx, isActiveSlide) {
  if (typeof block === 'string') return block;

  const { type, content, items, html, ...rest } = block;
  
  const Component = ComponentMap[type];
  if (!Component) {
    console.warn(`[JsonSlideDeck] Unknown component type: ${type}`);
    return null;
  }

  // Inject 'active' prop if this is the root Slide block
  const props = { ...rest, key: idx };
  if (type === 'Slide' || type === 'TitleSlide') {
    props.active = isActiveSlide;
  }

  // Sanitize any direct HTML props to prevent XSS
  if (html) {
    props.html = DOMPurify.sanitize(html);
  }

  // Sanitize array of items (used in TickList, StageCard)
  if (items && Array.isArray(items)) {
    props.items = items.map(item => DOMPurify.sanitize(item));
  }

  // Recursively render children in 'content' array
  let children = null;
  if (content && Array.isArray(content)) {
    children = content.map((childBlock, childIdx) => 
      renderBlock(childBlock, childIdx, false)
    );
  }

  return <Component {...props}>{children}</Component>;
}

/**
 * JsonSlideDeck - Dynamically renders a presentation from JSON data.
 */
export default function JsonSlideDeck({ data, embedded = false }) {
  const [cur, setCur] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const deckRef = useRef(null);

  if (!data || !data.slides || !Array.isArray(data.slides)) {
    return <div style={{ color: 'red' }}>Error: Invalid presentation data provided.</div>;
  }

  const TOTAL = data.slides.length;

  const go = useCallback((i) => {
    setCur(Math.max(0, Math.min(TOTAL - 1, i)));
    setShowOverview(false);
  }, [TOTAL]);
  
  const next = useCallback(() => go(cur + 1), [cur, go]);
  const prev = useCallback(() => go(cur - 1), [cur, go]);

  // Keyboard
  useEffect(() => {
    if (showOverview) return;
    const handler = (e) => {
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) { next(); e.preventDefault(); }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { prev(); e.preventDefault(); }
      if (e.key === 'Home') { go(0); e.preventDefault(); }
      if (e.key === 'End') { go(TOTAL - 1); e.preventDefault(); }
      if (e.key.toLowerCase() === 'o') { setShowOverview(true); }
      if (e.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      }
    };
    const el = deckRef.current;
    if (el) el.addEventListener('keydown', handler);
    return () => { if (el) el.removeEventListener('keydown', handler); };
  }, [next, prev, go, TOTAL, showOverview]);

  // Touch
  const touchX = useRef(null);
  const handleTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchX.current === null) return;
    const diff = touchX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    if (diff < -40) prev();
    touchX.current = null;
  };

  // Click
  const handleClick = (e) => {
    if (showOverview) return;
    const x = e.clientX;
    const w = window.innerWidth;
    if (x > w * 0.38) next();
    else prev();
  };

  // Auto-focus container so keyboard works immediately
  useEffect(() => {
    if (deckRef.current && !embedded) deckRef.current.focus();
  }, [embedded]);

  const pct = Math.round((cur / (TOTAL - 1)) * 100) || 0;

  return (
    <div
      className="slide-deck"
      ref={deckRef}
      tabIndex={0}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={embedded 
        ? { position: 'relative', width: '100%', height: '100%', outline: 'none' } 
        : { position: 'fixed', inset: 0, outline: 'none' }}
    >
      <SlideStyles />

      {/* Render the current slide (and all others, but hidden via CSS) */}
      {data.slides.map((slideBlock, idx) => renderBlock(slideBlock, idx, cur === idx))}

      {/* Chrome Overlay */}
      {data.brand && (
        <div className="sd-brand">
          <div className="gem" /> {data.brand}
        </div>
      )}

      <div className="sd-counter">
        <b>{String(cur + 1).padStart(2, '0')}</b> / {TOTAL}
      </div>

      <div className="sd-meter">
        <div className="mrow">
          <div className="mlabel">{data.meterLabel || 'PROGRESS'}</div>
          <div className="mpct">{pct}%</div>
        </div>
        <div className="track">
          <div className="fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="sd-nav sd-nav-prev" onClick={(e) => { e.stopPropagation(); prev(); }}>&larr;</div>
      <div className="sd-nav sd-nav-next" onClick={(e) => { e.stopPropagation(); next(); }}>&rarr;</div>

      {/* Overview Grid (Press O) */}
      <div className={`sd-overview${showOverview ? ' show' : ''}`}>
        <h3>Slide Overview</h3>
        <div className="sd-ov-grid">
          {data.slides.map((slide, i) => (
            <div
              key={i}
              className={`sd-ov-thumb${cur === i ? ' cur' : ''}`}
              onClick={(e) => { e.stopPropagation(); go(i); }}
            >
              <div className="tn">{String(i + 1).padStart(2, '0')}</div>
              <div className="tl">{
                (slide.title || '').replace(/<[^>]+>/g, ' ').trim() ||
                (slide.content && slide.content.find(c => c.type === 'Headline')?.html?.replace(/<[^>]+>/g, ' ').trim()) ||
                (slide.content && slide.content.find(c => c.type === 'Eyebrow')?.text) ||
                'Slide'
              }</div>
            </div>
          ))}
        </div>
        <div className="sd-ov-close" onClick={(e) => { e.stopPropagation(); setShowOverview(false); }}>Close [Esc]</div>
      </div>
    </div>
  );
}

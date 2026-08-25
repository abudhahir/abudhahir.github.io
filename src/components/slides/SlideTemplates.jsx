import React from 'react';

/**
 * SlideTemplates - Reusable building blocks for slide presentations.
 *
 * Each export is a composable primitive. Combine them inside a <Slide>
 * component to construct any slide layout from the design system.
 *
 * Usage pattern:
 *   <Slide>
 *     <Eyebrow num="01" text="Section Title" />
 *     <Headline>Some <Hl>highlighted</Hl> text</Headline>
 *     <CardGrid cols={3}>
 *       <SlideCard variant="good" title="Win">...</SlideCard>
 *     </CardGrid>
 *     <NoteBlock variant="vio">Important note...</NoteBlock>
 *   </Slide>
 */

/* ═══════════════════════════════════════════════════════
   SLIDE SHELL - wraps one slide's content
   ═══════════════════════════════════════════════════════ */
export function Slide({ active = false, children }) {
  return (
    <section className={`sd-slide${active ? ' active' : ''}`}>
      <div className="sd-slide-inner">
        {React.Children.map(children, (child, i) =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                className: `${child.props.className || ''} anim`.trim(),
              })
            : child
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   TITLE SLIDE - hero title with tag, credit box, hint
   ═══════════════════════════════════════════════════════ */
export function TitleSlide({
  active = false,
  tagText = '',
  chipText = '',
  title,
  subtitle,
  creditBold,
  creditMuted,
  hintContent,
}) {
  return (
    <section className={`sd-slide${active ? ' active' : ''}`}>
      <div className="sd-slide-inner">
        {(tagText || chipText) && (
          <div className="sd-title-tag anim">
            {tagText && <span>{tagText}</span>}
            {chipText && <span className="chip">{chipText}</span>}
          </div>
        )}
        {title && (
          <h1
            className="sd-title-big anim"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {subtitle && (
          <p
            className="sd-title-sub anim"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}
        {creditBold && (
          <div className="sd-title-credit anim">
            <b>{creditBold}</b>
            {creditMuted && <span>{creditMuted}</span>}
          </div>
        )}
        {hintContent && (
          <div
            className="sd-hint anim"
            dangerouslySetInnerHTML={{ __html: hintContent }}
          />
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   EYEBROW - section number + label + trailing line
   ═══════════════════════════════════════════════════════ */
export function Eyebrow({ num, text }) {
  return (
    <div className="sd-eyebrow">
      <span className="num">{num}</span> {text}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HEADLINE - large display heading (supports inner HTML)
   ═══════════════════════════════════════════════════════ */
export function Headline({ children, html, style }) {
  if (html) {
    return (
      <h2
        className="sd-headline"
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <h2 className="sd-headline" style={style}>
      {children}
    </h2>
  );
}

/** Highlight spans for inside Headline */
export function Hl({ children }) {
  return <span className="hl">{children}</span>;
}
export function Cool({ children }) {
  return <span className="cool">{children}</span>;
}
export function Vio({ children }) {
  return <span className="vio">{children}</span>;
}

/* ═══════════════════════════════════════════════════════
   LEAD - subdued paragraph below headline
   ═══════════════════════════════════════════════════════ */
export function Lead({ children, html, style }) {
  if (html) {
    return (
      <p
        className="sd-lead"
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <p className="sd-lead" style={style}>
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════════════════════
   STAT ROW - big number(s) + optional headline beside
   ═══════════════════════════════════════════════════════ */
export function StatRow({ children }) {
  return <div className="sd-statrow">{children}</div>;
}

export function Stat({ value, color = '', label }) {
  return (
    <div className="sd-stat">
      <div className={`n ${color}`}>{value}</div>
      <div className="k">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CARD GRID - responsive column grid
   ═══════════════════════════════════════════════════════ */
export function CardGrid({ cols = 2, children }) {
  const colClass = cols === 4 ? 'sd-g4' : cols === 3 ? 'sd-g3' : 'sd-g2';
  return <div className={`sd-grid ${colClass}`}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════
   SLIDE CARD - styled card with variant & optional label
   ═══════════════════════════════════════════════════════ */
export function SlideCard({
  variant = '',
  label,
  labelType = '',
  title,
  children,
  tickLabel,
  style,
}) {
  return (
    <div className={`sd-card ${variant}`} style={style}>
      {label && <span className={`lbl ${labelType}`}>{label}</span>}
      {tickLabel && <span className="tick">{tickLabel}</span>}
      {title && (
        <h4 style={tickLabel ? { marginTop: 6 } : undefined}>{title}</h4>
      )}
      {typeof children === 'string' ? <p>{children}</p> : children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TICK LIST - bulleted list with › markers
   ═══════════════════════════════════════════════════════ */
export function TickList({ items = [], style }) {
  return (
    <ul className="sd-ticks" style={style}>
      {items.map((item, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </ul>
  );
}

/* ═══════════════════════════════════════════════════════
   NOTE BLOCK - colored callout box
   ═══════════════════════════════════════════════════════ */
export function NoteBlock({ variant = '', children, html }) {
  if (html) {
    return (
      <div
        className={`sd-note ${variant}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return <div className={`sd-note ${variant}`}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════
   DATA TABLE - styled pricing/comparison table
   ═══════════════════════════════════════════════════════ */
export function DataTable({ headers = [], rows = [] }) {
  return (
    <table className="sd-tbl">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} className={h.hideSm ? 'hide-sm' : ''}>
              {h.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={row.highlight ? 'hi-row' : ''}>
            {row.cells.map((cell, ci) => (
              <td
                key={ci}
                className={[
                  cell.name ? 'name' : '',
                  cell.mono ? 'm' : '',
                  cell.price ? `sd-price ${cell.price}` : '',
                  cell.hideSm ? 'hide-sm' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {cell.dot && <span className={`sd-dot ${cell.dot}`} />}
                {cell.value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ═══════════════════════════════════════════════════════
   SPECTRUM - gradient bar with positioned markers
   ═══════════════════════════════════════════════════════ */
export function Spectrum({ markers = [] }) {
  return (
    <div className="sd-spectrum">
      <div className="bar" />
      {markers.map((m, i) => (
        <div
          key={i}
          className={`mk ${m.tier}`}
          style={{ left: m.position }}
        >
          <div className="val">{m.value}</div>
          <div className="pin" />
          <div className="nm">{m.name}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   POOL RESERVOIR - animated fill bar
   ═══════════════════════════════════════════════════════ */
export function PoolReservoir({
  level = '72%',
  label = 'Shared credit pool',
  pctText = '~72% remaining',
  draws = [],
}) {
  return (
    <div className="sd-pool">
      <div className="vessel">
        <div className="level" style={{ width: level }} />
        <div className="ptext">
          <span className="big">{label}</span>
          <span className="pct">{pctText}</span>
        </div>
      </div>
      {draws.length > 0 && (
        <div className="draws">
          {draws.map((d, i) => (
            <span key={i} className="draw">
              {d.text} <b>{d.action}</b>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NESTED LAYERS - budget architecture visualization
   ═══════════════════════════════════════════════════════ */
export function NestedLayers({ children }) {
  return <div className="sd-arch">{children}</div>;
}

export function Layer({ type, label, description, children }) {
  return (
    <div className={`sd-layer ${type}`}>
      <div className="ltag">
        {label}
        {description && <span className="what">&mdash; {description}</span>}
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LADDER CHART - horizontal cost comparison bars
   ═══════════════════════════════════════════════════════ */
export function LadderChart({ rungs = [] }) {
  return (
    <div className="sd-ladder">
      {rungs.map((r, i) => (
        <div key={i} className="sd-rung">
          <div className="lab">
            <b>{r.label}</b>
            <small>{r.sublabel}</small>
          </div>
          <div className="track">
            <div className="fill" style={{ width: r.width, background: r.gradient }} />
          </div>
          <div className="cost">{r.cost}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STAGE CARD - numbered phase card (rollout playbook)
   ═══════════════════════════════════════════════════════ */
export function Stages({ children }) {
  return <div className="sd-stages">{children}</div>;
}

export function StageCard({ num, title, items = [] }) {
  return (
    <div className="sd-stage">
      <div className="st-n">{num}</div>
      <h4>{title}</h4>
      <ul>
        {items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SPLIT COLUMNS - two-track cheat sheet layout
   ═══════════════════════════════════════════════════════ */
export function SplitColumns({ children }) {
  return <div className="sd-split">{children}</div>;
}

export function SplitCol({ role = 'admin', title, children }) {
  return (
    <div className={`sd-col ${role}`}>
      <h5>
        <span className="badge" /> {title}
      </h5>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CODE INLINE - styled inline code snippet
   ═══════════════════════════════════════════════════════ */
export function Code({ children }) {
  return <span className="sd-codeline">{children}</span>;
}

/* ═══════════════════════════════════════════════════════
   MONO - monospace text span
   ═══════════════════════════════════════════════════════ */
export function Mono({ children }) {
  return <span className="sd-mono">{children}</span>;
}

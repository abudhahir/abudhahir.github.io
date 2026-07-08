/**
 * SlideStyles — Scoped CSS for the slide presentation design system.
 * Uses its own color palette (ink/amber/teal/coral/violet) independent
 * of the site's emerald-dark theme.
 *
 * Injected once by <SlideShell> at the root of any presentation.
 */
export default function SlideStyles() {
  return (
    <style>{`
      /* ── Design tokens ── */
      .slide-deck {
        --ink: #0E1426;
        --ink-2: #151D36;
        --ink-3: #1E2947;
        --paper: #EFEADD;
        --amber: #F5B43C;
        --amber-deep: #E0892B;
        --teal: #46D4B3;
        --coral: #FF6F5E;
        --violet: #9B8CFF;
        --text: #E8E9F2;
        --muted: #949DBC;
        --line: rgba(255,255,255,.10);
        --line-2: rgba(255,255,255,.16);
        --disp: 'Space Grotesk', sans-serif;
        --body: 'IBM Plex Sans', sans-serif;
        --mono: 'IBM Plex Mono', monospace;

        font-family: var(--body);
        color: var(--text);
        background: var(--ink);
        -webkit-font-smoothing: antialiased;
        height: 100%;
        overflow: hidden;
        position: relative;
      }

      /* ── Ambient glow backdrop ── */
      .slide-deck::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background:
          radial-gradient(120% 90% at 88% 6%, rgba(245,180,60,.10), transparent 55%),
          radial-gradient(90% 80% at 4% 100%, rgba(70,212,179,.08), transparent 50%),
          radial-gradient(60% 60% at 95% 95%, rgba(155,140,255,.07), transparent 60%);
      }

      /* ── Slide shell ── */
      .slide-deck .sd-slide {
        position: absolute;
        inset: 0;
        z-index: 1;
        display: none;
        flex-direction: column;
        justify-content: center;
        padding: clamp(28px,6vw,108px);
        padding-bottom: clamp(70px,9vh,118px);
      }
      .slide-deck .sd-slide.active { display: flex; }

      .slide-deck .sd-slide-inner {
        width: 100%;
        max-width: 1180px;
        margin: 0 auto;
      }

      /* ── Entry animations ── */
      .slide-deck .sd-slide.active .anim {
        opacity: 0;
        transform: translateY(14px);
        animation: sd-rise .6s cubic-bezier(.2,.7,.2,1) forwards;
      }
      .slide-deck .sd-slide.active .anim:nth-child(1) { animation-delay: .05s; }
      .slide-deck .sd-slide.active .anim:nth-child(2) { animation-delay: .13s; }
      .slide-deck .sd-slide.active .anim:nth-child(3) { animation-delay: .21s; }
      .slide-deck .sd-slide.active .anim:nth-child(4) { animation-delay: .29s; }
      .slide-deck .sd-slide.active .anim:nth-child(5) { animation-delay: .37s; }
      .slide-deck .sd-slide.active .anim:nth-child(6) { animation-delay: .45s; }

      @keyframes sd-rise {
        to { opacity: 1; transform: none; }
      }

      /* ── Typography ── */
      .slide-deck .sd-eyebrow {
        font-family: var(--mono);
        font-size: clamp(11px,1.05vw,13.5px);
        letter-spacing: .22em;
        text-transform: uppercase;
        color: var(--muted);
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: clamp(16px,2.4vh,26px);
      }
      .slide-deck .sd-eyebrow .num { color: var(--amber); }
      .slide-deck .sd-eyebrow::after {
        content: "";
        flex: 1;
        height: 1px;
        background: var(--line);
        max-width: 160px;
      }

      .slide-deck .sd-headline {
        font-family: var(--disp);
        font-weight: 600;
        line-height: 1.02;
        letter-spacing: -.02em;
        font-size: clamp(29px,5vw,66px);
      }
      .slide-deck .sd-headline .hl { color: var(--amber); }
      .slide-deck .sd-headline .cool { color: var(--teal); }
      .slide-deck .sd-headline .vio { color: var(--violet); }

      .slide-deck .sd-lead {
        font-size: clamp(15px,1.55vw,21px);
        color: var(--muted);
        line-height: 1.55;
        max-width: 46ch;
        margin-top: clamp(14px,2.2vh,22px);
      }

      .slide-deck .sd-mono { font-family: var(--mono); }
      .slide-deck strong { color: var(--text); font-weight: 600; }

      /* ── Title slide ── */
      .slide-deck .sd-title-tag {
        font-family: var(--mono);
        letter-spacing: .3em;
        font-size: 13px;
        text-transform: uppercase;
        color: var(--amber);
        margin-bottom: 24px;
        display: flex;
        gap: 12px;
        align-items: center;
      }
      .slide-deck .sd-title-tag .chip {
        border: 1px solid var(--line-2);
        border-radius: 20px;
        padding: 4px 12px;
        color: var(--violet);
        letter-spacing: .16em;
      }
      .slide-deck .sd-title-big {
        font-family: var(--disp);
        font-weight: 700;
        letter-spacing: -.025em;
        line-height: .98;
        font-size: clamp(42px,8.4vw,112px);
      }
      .slide-deck .sd-title-sub {
        font-size: clamp(16px,1.9vw,24px);
        color: var(--muted);
        margin-top: 24px;
        max-width: 42ch;
        line-height: 1.5;
      }
      .slide-deck .sd-title-credit {
        display: inline-flex;
        align-items: baseline;
        gap: 14px;
        margin-top: 34px;
        padding: 14px 22px;
        border: 1px solid var(--line-2);
        border-radius: 14px;
        background: rgba(255,255,255,.03);
        font-family: var(--mono);
      }
      .slide-deck .sd-title-credit b {
        font-size: clamp(20px,2.4vw,30px);
        color: var(--teal);
        font-weight: 600;
      }
      .slide-deck .sd-title-credit span {
        color: var(--muted);
        font-size: 13px;
        letter-spacing: .04em;
      }
      .slide-deck .sd-hint {
        margin-top: 36px;
        font-family: var(--mono);
        font-size: 12.5px;
        color: var(--muted);
        letter-spacing: .05em;
      }
      .slide-deck .sd-hint kbd {
        font-family: var(--mono);
        background: var(--ink-3);
        border: 1px solid var(--line-2);
        border-bottom-width: 2px;
        border-radius: 6px;
        padding: 2px 8px;
        color: var(--text);
        font-size: 11.5px;
        margin: 0 2px;
      }

      /* ── Grid layouts ── */
      .slide-deck .sd-grid {
        display: grid;
        gap: clamp(12px,1.4vw,20px);
        margin-top: clamp(20px,3vh,32px);
      }
      .slide-deck .sd-g2 { grid-template-columns: 1fr 1fr; }
      .slide-deck .sd-g3 { grid-template-columns: repeat(3,1fr); }
      .slide-deck .sd-g4 { grid-template-columns: repeat(4,1fr); }

      /* ── Cards ── */
      .slide-deck .sd-card {
        background: var(--ink-2);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: clamp(16px,1.7vw,24px);
        position: relative;
        overflow: hidden;
      }
      .slide-deck .sd-card h4 {
        font-family: var(--disp);
        font-weight: 600;
        font-size: clamp(15px,1.4vw,19px);
        letter-spacing: -.01em;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .slide-deck .sd-card p {
        color: var(--muted);
        font-size: clamp(13px,1.05vw,15px);
        line-height: 1.5;
      }
      .slide-deck .sd-card .tick {
        font-family: var(--mono);
        font-size: 12px;
        color: var(--amber);
        letter-spacing: .04em;
      }
      .slide-deck .sd-card.accent { border-color: rgba(245,180,60,.4); }
      .slide-deck .sd-card.good { border-color: rgba(70,212,179,.35); }
      .slide-deck .sd-card.good h4 { color: var(--teal); }
      .slide-deck .sd-card.bad { border-color: rgba(255,111,94,.4); }
      .slide-deck .sd-card.bad h4 { color: var(--coral); }
      .slide-deck .sd-card.vio { border-color: rgba(155,140,255,.4); }
      .slide-deck .sd-card.vio h4 { color: var(--violet); }

      /* Card labels */
      .slide-deck .sd-card .lbl {
        position: absolute;
        top: 0;
        right: 0;
        font-family: var(--mono);
        font-size: 10.5px;
        letter-spacing: .14em;
        padding: 5px 10px;
        border-bottom-left-radius: 12px;
        text-transform: uppercase;
      }
      .slide-deck .lbl-free { background: rgba(70,212,179,.16); color: var(--teal); }
      .slide-deck .lbl-paid { background: rgba(255,111,94,.15); color: var(--coral); }
      .slide-deck .lbl-adm { background: rgba(155,140,255,.16); color: var(--violet); }

      /* ── Tick lists ── */
      .slide-deck ul.sd-ticks {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 11px;
        margin-top: 6px;
        padding: 0;
      }
      .slide-deck ul.sd-ticks li {
        display: flex;
        gap: 13px;
        align-items: flex-start;
        font-size: clamp(14px,1.15vw,16.5px);
        line-height: 1.45;
        color: var(--text);
      }
      .slide-deck ul.sd-ticks li::before {
        content: "\\203A";
        font-family: var(--mono);
        color: var(--amber);
        font-weight: 600;
        line-height: 1.4;
        flex-shrink: 0;
      }
      .slide-deck ul.sd-ticks li span { color: var(--muted); }

      /* ── Stat row ── */
      .slide-deck .sd-statrow {
        display: flex;
        gap: clamp(20px,4vw,56px);
        align-items: baseline;
        flex-wrap: wrap;
        margin-top: 10px;
      }
      .slide-deck .sd-stat .n {
        font-family: var(--disp);
        font-weight: 700;
        letter-spacing: -.03em;
        font-size: clamp(46px,8.4vw,112px);
        line-height: .9;
      }
      .slide-deck .sd-stat .n.teal { color: var(--teal); }
      .slide-deck .sd-stat .n.amber { color: var(--amber); }
      .slide-deck .sd-stat .n.coral { color: var(--coral); }
      .slide-deck .sd-stat .n.vio { color: var(--violet); }
      .slide-deck .sd-stat .k {
        font-family: var(--mono);
        font-size: 13px;
        color: var(--muted);
        letter-spacing: .05em;
        text-transform: uppercase;
        margin-top: 12px;
        max-width: 24ch;
      }

      /* ── Table ── */
      .slide-deck .sd-tbl {
        width: 100%;
        border-collapse: collapse;
        margin-top: clamp(16px,2.4vh,26px);
        font-size: clamp(12.5px,1.05vw,15px);
      }
      .slide-deck .sd-tbl th {
        font-family: var(--mono);
        text-transform: uppercase;
        letter-spacing: .1em;
        font-size: 11px;
        color: var(--muted);
        text-align: left;
        padding: 0 14px 12px;
        border-bottom: 1px solid var(--line-2);
        font-weight: 500;
      }
      .slide-deck .sd-tbl td {
        padding: 11px 14px;
        border-bottom: 1px solid var(--line);
      }
      .slide-deck .sd-tbl td.m { font-family: var(--mono); }
      .slide-deck .sd-tbl tr:last-child td { border-bottom: none; }
      .slide-deck .sd-tbl .name { font-weight: 500; }
      .slide-deck .sd-tbl tr.hi-row td { background: rgba(155,140,255,.07); }

      .slide-deck .sd-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 9px;
        vertical-align: middle;
      }
      .slide-deck .d-teal { background: var(--teal); }
      .slide-deck .d-amber { background: var(--amber); }
      .slide-deck .d-coral { background: var(--coral); }

      .slide-deck .sd-price { font-family: var(--mono); font-weight: 500; }
      .slide-deck .sd-price.lo { color: var(--teal); }
      .slide-deck .sd-price.mid { color: var(--amber); }
      .slide-deck .sd-price.hi { color: var(--coral); }

      /* ── Spectrum bar ── */
      .slide-deck .sd-spectrum {
        margin-top: clamp(26px,4vh,46px);
        position: relative;
        height: 128px;
      }
      .slide-deck .sd-spectrum .bar {
        position: absolute;
        left: 0; right: 0;
        top: 46px;
        height: 16px;
        border-radius: 9px;
        background: linear-gradient(90deg, var(--teal) 0%, #8fd28a 18%, var(--amber) 46%, var(--amber-deep) 62%, var(--coral) 100%);
        box-shadow: 0 0 30px rgba(245,180,60,.22);
      }
      .slide-deck .sd-spectrum .mk {
        position: absolute;
        top: 0;
        transform: translateX(-50%);
        text-align: center;
      }
      .slide-deck .sd-spectrum .mk .pin {
        width: 2px;
        height: 30px;
        background: var(--line-2);
        margin: 34px auto 0;
      }
      .slide-deck .sd-spectrum .mk .val {
        font-family: var(--mono);
        font-weight: 600;
        font-size: clamp(13px,1.2vw,16px);
      }
      .slide-deck .sd-spectrum .mk .nm {
        font-family: var(--mono);
        font-size: 10.5px;
        color: var(--muted);
        margin-top: 4px;
        white-space: nowrap;
      }
      .slide-deck .sd-spectrum .mk.lo .val { color: var(--teal); }
      .slide-deck .sd-spectrum .mk.mid .val { color: var(--amber); }
      .slide-deck .sd-spectrum .mk.hi .val { color: var(--coral); }

      /* ── Pool reservoir ── */
      .slide-deck .sd-pool { margin-top: clamp(22px,3.2vh,34px); }
      .slide-deck .sd-pool .vessel {
        position: relative;
        height: clamp(80px,12vh,112px);
        border-radius: 16px;
        border: 1px solid var(--line-2);
        background: rgba(255,255,255,.03);
        overflow: hidden;
      }
      .slide-deck .sd-pool .level {
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, rgba(70,212,179,.32), rgba(245,180,60,.30) 75%, rgba(255,111,94,.30));
        border-right: 2px solid var(--amber);
      }
      .slide-deck .sd-pool .level::after {
        content: "";
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 2px, transparent 2px 26px);
      }
      .slide-deck .sd-pool .ptext {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 22px;
        font-family: var(--mono);
      }
      .slide-deck .sd-pool .ptext .big {
        font-size: clamp(20px,2.4vw,30px);
        font-weight: 600;
        color: var(--text);
      }
      .slide-deck .sd-pool .ptext .pct {
        font-size: 13px;
        color: var(--amber);
      }
      .slide-deck .sd-pool .draws {
        display: flex;
        gap: 8px;
        margin-top: 14px;
        flex-wrap: wrap;
      }
      .slide-deck .sd-pool .draw {
        font-family: var(--mono);
        font-size: 11px;
        color: var(--muted);
        border: 1px solid var(--line);
        border-radius: 20px;
        padding: 5px 12px;
      }
      .slide-deck .sd-pool .draw b { color: var(--teal); }

      /* ── Budget architecture (nested layers) ── */
      .slide-deck .sd-arch { margin-top: clamp(20px,3vh,30px); }
      .slide-deck .sd-layer {
        border: 1px solid var(--line-2);
        border-radius: 16px;
        padding: clamp(13px,1.5vw,20px);
        position: relative;
      }
      .slide-deck .sd-layer + .sd-layer,
      .slide-deck .sd-layer .sd-layer { margin-top: 0; }
      .slide-deck .sd-layer .ltag {
        font-family: var(--mono);
        font-size: 11px;
        letter-spacing: .12em;
        text-transform: uppercase;
        display: flex;
        gap: 10px;
        align-items: center;
        margin-bottom: clamp(10px,1.4vh,14px);
      }
      .slide-deck .sd-layer .ltag .what {
        color: var(--muted);
        font-weight: 400;
        letter-spacing: .02em;
        text-transform: none;
        font-size: 12.5px;
      }
      .slide-deck .sd-layer.l-ent {
        border-color: rgba(155,140,255,.45);
        background: rgba(155,140,255,.05);
      }
      .slide-deck .sd-layer.l-ent .ltag { color: var(--violet); }
      .slide-deck .sd-layer.l-cc {
        border-color: rgba(245,180,60,.4);
        background: rgba(245,180,60,.045);
      }
      .slide-deck .sd-layer.l-cc .ltag { color: var(--amber); }
      .slide-deck .sd-layer.l-ulb {
        border-color: rgba(255,111,94,.42);
        background: rgba(255,111,94,.05);
      }
      .slide-deck .sd-layer.l-ulb .ltag { color: var(--coral); }
      .slide-deck .sd-layer.l-pool {
        border-color: rgba(70,212,179,.42);
        background: rgba(70,212,179,.06);
        text-align: center;
        padding: clamp(14px,1.8vw,22px);
      }
      .slide-deck .sd-layer.l-pool .ltag {
        color: var(--teal);
        justify-content: center;
        margin-bottom: 0;
      }

      /* ── Ladder chart ── */
      .slide-deck .sd-ladder {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: clamp(18px,2.6vh,28px);
      }
      .slide-deck .sd-rung {
        display: flex;
        align-items: center;
        gap: 18px;
      }
      .slide-deck .sd-rung .lab {
        width: clamp(120px,16vw,200px);
        flex: none;
      }
      .slide-deck .sd-rung .lab b {
        font-family: var(--disp);
        font-weight: 600;
        font-size: clamp(14px,1.3vw,18px);
      }
      .slide-deck .sd-rung .lab small {
        display: block;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 11px;
        margin-top: 2px;
      }
      .slide-deck .sd-rung .track {
        flex: 1;
        height: 22px;
        border-radius: 7px;
        background: rgba(255,255,255,.05);
        overflow: hidden;
      }
      .slide-deck .sd-rung .fill { height: 100%; border-radius: 7px; }
      .slide-deck .sd-rung .cost {
        font-family: var(--mono);
        font-size: 12.5px;
        color: var(--muted);
        width: 120px;
        flex: none;
        text-align: right;
      }

      /* ── Note callout ── */
      .slide-deck .sd-note {
        margin-top: clamp(18px,2.6vh,26px);
        border-left: 3px solid var(--amber);
        background: rgba(245,180,60,.07);
        padding: 14px 20px;
        border-radius: 0 12px 12px 0;
        font-size: clamp(13px,1.1vw,15.5px);
        line-height: 1.5;
        color: var(--text);
      }
      .slide-deck .sd-note b { color: var(--amber); }
      .slide-deck .sd-note.danger {
        border-color: var(--coral);
        background: rgba(255,111,94,.08);
      }
      .slide-deck .sd-note.danger b { color: var(--coral); }
      .slide-deck .sd-note.good {
        border-color: var(--teal);
        background: rgba(70,212,179,.07);
      }
      .slide-deck .sd-note.good b { color: var(--teal); }
      .slide-deck .sd-note.vio {
        border-color: var(--violet);
        background: rgba(155,140,255,.07);
      }
      .slide-deck .sd-note.vio b { color: var(--violet); }

      .slide-deck .sd-codeline {
        font-family: var(--mono);
        background: var(--ink-3);
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 3px 9px;
        font-size: .92em;
        color: var(--teal);
      }

      /* ── Stages (rollout) ── */
      .slide-deck .sd-stages {
        display: grid;
        grid-template-columns: repeat(3,1fr);
        gap: clamp(14px,1.6vw,22px);
        margin-top: clamp(20px,3vh,32px);
      }
      .slide-deck .sd-stage {
        background: var(--ink-2);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: clamp(18px,1.9vw,26px);
        position: relative;
      }
      .slide-deck .sd-stage .st-n {
        font-family: var(--mono);
        font-size: 12px;
        color: var(--amber);
        letter-spacing: .14em;
      }
      .slide-deck .sd-stage h4 {
        font-family: var(--disp);
        font-weight: 600;
        font-size: clamp(16px,1.5vw,21px);
        margin: 6px 0 14px;
        letter-spacing: -.01em;
      }
      .slide-deck .sd-stage ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 9px;
        padding: 0;
      }
      .slide-deck .sd-stage li {
        font-size: clamp(12.5px,1.05vw,14.5px);
        color: var(--muted);
        line-height: 1.4;
        padding-left: 16px;
        position: relative;
      }
      .slide-deck .sd-stage li::before {
        content: "\\203A";
        position: absolute;
        left: 0;
        color: var(--teal);
        font-family: var(--mono);
      }

      /* ── Split (cheat sheet) ── */
      .slide-deck .sd-split {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(14px,1.8vw,26px);
        margin-top: clamp(18px,2.6vh,28px);
      }
      .slide-deck .sd-col h5 {
        font-family: var(--mono);
        font-size: 12px;
        letter-spacing: .14em;
        text-transform: uppercase;
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        gap: 9px;
      }
      .slide-deck .sd-col.admin h5 { color: var(--violet); }
      .slide-deck .sd-col.dev h5 { color: var(--teal); }
      .slide-deck .sd-col .badge {
        width: 9px;
        height: 9px;
        border-radius: 2px;
        transform: rotate(45deg);
        display: inline-block;
      }
      .slide-deck .sd-col.admin .badge { background: var(--violet); }
      .slide-deck .sd-col.dev .badge { background: var(--teal); }

      /* ── Chrome (counter, brand, meter, nav) ── */
      .slide-deck .sd-counter {
        position: fixed;
        top: clamp(20px,3.2vh,34px);
        right: clamp(22px,4vw,54px);
        z-index: 20;
        font-family: var(--mono);
        font-size: 13px;
        letter-spacing: .12em;
        color: var(--muted);
      }
      .slide-deck .sd-counter b { color: var(--text); }

      .slide-deck .sd-brand {
        position: fixed;
        top: clamp(20px,3.2vh,34px);
        left: clamp(22px,4vw,54px);
        z-index: 20;
        font-family: var(--mono);
        font-size: 11.5px;
        letter-spacing: .18em;
        text-transform: uppercase;
        color: var(--muted);
        display: flex;
        align-items: center;
        gap: 9px;
      }
      .slide-deck .sd-brand .gem {
        width: 9px;
        height: 9px;
        background: var(--violet);
        border-radius: 2px;
        transform: rotate(45deg);
      }

      .slide-deck .sd-meter {
        position: fixed;
        left: 0; right: 0; bottom: 0;
        z-index: 20;
        padding: 0 clamp(22px,4vw,54px) 14px;
      }
      .slide-deck .sd-meter .mrow {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 8px;
      }
      .slide-deck .sd-meter .mlabel {
        font-family: var(--mono);
        font-size: 10.5px;
        letter-spacing: .18em;
        text-transform: uppercase;
        color: var(--muted);
      }
      .slide-deck .sd-meter .mpct {
        font-family: var(--mono);
        font-size: 11px;
        color: var(--amber);
        margin-left: auto;
      }
      .slide-deck .sd-meter .track {
        height: 5px;
        background: rgba(255,255,255,.07);
        border-radius: 3px;
        overflow: hidden;
      }
      .slide-deck .sd-meter .fill {
        height: 100%;
        width: 0;
        border-radius: 3px;
        background: linear-gradient(90deg, var(--teal), var(--amber) 70%, var(--coral));
        transition: width .5s cubic-bezier(.2,.7,.2,1);
      }

      .slide-deck .sd-nav {
        position: fixed;
        bottom: clamp(30px,5vh,44px);
        z-index: 21;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 1px solid var(--line-2);
        background: rgba(20,28,52,.7);
        backdrop-filter: blur(6px);
        color: var(--text);
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: .2s;
      }
      .slide-deck .sd-nav:hover { border-color: var(--amber); color: var(--amber); }
      .slide-deck .sd-nav-prev { right: calc(clamp(22px,4vw,54px) + 52px); }
      .slide-deck .sd-nav-next { right: clamp(22px,4vw,54px); }
      .slide-deck .sd-nav:disabled { opacity: .3; cursor: default; }

      /* ── Overview grid ── */
      .slide-deck .sd-overview {
        position: fixed;
        inset: 0;
        z-index: 40;
        background: rgba(8,12,24,.97);
        display: none;
        padding: clamp(40px,6vw,80px);
        overflow: auto;
      }
      .slide-deck .sd-overview.show { display: block; }
      .slide-deck .sd-overview h3 {
        font-family: var(--mono);
        letter-spacing: .2em;
        text-transform: uppercase;
        color: var(--muted);
        font-size: 12px;
        margin-bottom: 24px;
      }
      .slide-deck .sd-ov-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 14px;
      }
      .slide-deck .sd-ov-card {
        background: var(--ink-2);
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 18px;
        cursor: pointer;
        transition: .18s;
        min-height: 104px;
      }
      .slide-deck .sd-ov-card:hover {
        border-color: var(--amber);
        transform: translateY(-2px);
      }
      .slide-deck .sd-ov-card .ovn {
        font-family: var(--mono);
        font-size: 11px;
        color: var(--amber);
        letter-spacing: .1em;
      }
      .slide-deck .sd-ov-card .ovt {
        font-family: var(--disp);
        font-weight: 600;
        font-size: 16px;
        margin-top: 8px;
        line-height: 1.2;
      }
      .slide-deck .sd-ov-card .ove {
        font-family: var(--mono);
        font-size: 10.5px;
        color: var(--muted);
        margin-top: 6px;
        letter-spacing: .06em;
        text-transform: uppercase;
      }

      /* ── Responsive ── */
      @media (max-width:760px) {
        .slide-deck .sd-g2,
        .slide-deck .sd-g3,
        .slide-deck .sd-g4,
        .slide-deck .sd-stages,
        .slide-deck .sd-split { grid-template-columns: 1fr; }
        .slide-deck .sd-spectrum { height: 170px; }
        .slide-deck .sd-rung .lab { width: 120px; }
        .slide-deck .sd-rung .cost { display: none; }
        .slide-deck .sd-brand { display: none; }
        .slide-deck .sd-tbl .hide-sm { display: none; }
      }

      @media (prefers-reduced-motion:reduce) {
        .slide-deck .sd-slide.active .anim {
          animation: none;
          opacity: 1;
          transform: none;
        }
        .slide-deck .sd-meter .fill { transition: none; }
      }
    `}</style>
  );
}

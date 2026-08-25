import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Section navigator for a standard blog article.
 *
 * Receives the heading tree built at build time by `src/utils/headingTree.js`,
 * so nothing is scraped from the DOM - which matters because Mermaid rewrites
 * the article after load.
 *
 * From `xl` up it renders as a rail in the right gutter that expands leftward.
 * Below that the gutter disappears, so the same hierarchy opens as a sheet from
 * a floating control.
 */

/** Height of the fixed page chrome, matching `scroll-margin-top: 6rem`. */
const HEADER_OFFSET = 96;

const ARTICLE_SELECTOR = '.markdown-content';

function flatten(nodes, out = []) {
  for (const node of nodes) {
    out.push(node);
    flatten(node.children, out);
  }
  return out;
}

/**
 * Narrows the tree to matches and the ancestors that give them context.
 * A retained non-match carries `isMatch: false` and is rendered as dimmed,
 * non-navigable context.
 */
function filterTree(nodes, query) {
  const out = [];
  for (const node of nodes) {
    const children = filterTree(node.children, query);
    const isMatch = node.searchText.includes(query);
    if (isMatch || children.length > 0) {
      out.push({ ...node, children, isMatch });
    }
  }
  return out;
}

/** The top-level section that contains the heading currently being read. */
function findActiveRoot(tree, activeSlug) {
  if (!activeSlug) return null;
  for (const root of tree) {
    if (root.slug === activeSlug) return root.slug;
    if (flatten(root.children).some(node => node.slug === activeSlug)) {
      return root.slug;
    }
  }
  return null;
}

function SectionList({
  nodes,
  activeSlug,
  activeRootSlug,
  filtering,
  registerItem,
  onSelect,
}) {
  return (
    <ul className="space-y-0.5">
      {nodes.map(node => {
        // Level 2 and deeper is noise on a hundred-heading article, so it is
        // revealed only beneath the section being read - unless a filter is
        // active, where hiding a match would make it unreachable.
        if (!filtering && node.level >= 2 && node.rootSlug !== activeRootSlug) {
          return null;
        }

        const isActive = node.slug === activeSlug;
        const isContext = filtering && node.isMatch === false;

        return (
          <li key={node.slug}>
            {isContext ? (
              <span
                ref={element => registerItem(node.slug, element)}
                className="block cursor-default rounded px-2 py-1 text-xs text-muted/70"
                style={{ paddingLeft: `${0.5 + node.level * 0.75}rem` }}
              >
                {node.text}
              </span>
            ) : (
              <a
                ref={element => registerItem(node.slug, element)}
                href={`#${node.slug}`}
                onClick={() => onSelect(node.slug)}
                aria-current={isActive ? 'true' : undefined}
                className={`block rounded px-2 py-1 text-xs no-underline transition-colors hover:bg-primary/10 hover:text-primary ${
                  isActive
                    ? 'bg-primary/15 font-medium text-primary'
                    : node.level === 0
                      ? 'text-foreground'
                      : 'text-foreground/70'
                }`}
                style={{ paddingLeft: `${0.5 + node.level * 0.75}rem` }}
              >
                {node.text}
              </a>
            )}
            {node.children.length > 0 && (
              <SectionList
                nodes={node.children}
                activeSlug={activeSlug}
                activeRootSlug={activeRootSlug}
                filtering={filtering}
                registerItem={registerItem}
                onSelect={onSelect}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function ArticleNavigator({ tree = [] }) {
  const [activeSlug, setActiveSlug] = useState(null);
  const [progress, setProgress] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState('');

  const wrapperRef = useRef(null);
  const sheetRef = useRef(null);
  const listRefs = useRef({});
  const itemRefs = useRef({});

  // Tag every node with the top-level section it belongs to, so the level-2
  // reveal is a comparison rather than a search per render.
  const taggedTree = useMemo(() => {
    const tag = (nodes, rootSlug) =>
      nodes.map(node => {
        const slug = rootSlug ?? node.slug;
        return { ...node, rootSlug: slug, children: tag(node.children, slug) };
      });
    return tag(tree, null);
  }, [tree]);

  const allNodes = useMemo(() => flatten(taggedTree), [taggedTree]);
  const normalisedQuery = query.trim().toLowerCase();
  const filtering = normalisedQuery.length > 0;
  const visibleTree = useMemo(
    () => (filtering ? filterTree(taggedTree, normalisedQuery) : taggedTree),
    [taggedTree, filtering, normalisedQuery],
  );
  const activeRootSlug = useMemo(
    () => findActiveRoot(taggedTree, activeSlug),
    [taggedTree, activeSlug],
  );

  const registerItem = useCallback((slug, element) => {
    if (element) itemRefs.current[slug] = element;
    else delete itemRefs.current[slug];
  }, []);

  // Reading position and progress. Both are recomputed from live geometry
  // rather than cached, so Mermaid growing the article cannot leave them stale.
  useEffect(() => {
    if (allNodes.length === 0) return undefined;

    const elements = allNodes
      .map(node => document.getElementById(node.slug))
      .filter(Boolean);
    const article = document.querySelector(ARTICLE_SELECTOR);
    if (elements.length === 0 || !article) return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;

      // Several headings can be on screen at once, so resolve to the last one
      // whose top has passed the header rather than the first intersecting.
      let active = null;
      for (const element of elements) {
        if (element.getBoundingClientRect().top - HEADER_OFFSET <= 1) {
          active = element.id;
        } else {
          break;
        }
      }
      setActiveSlug(active);

      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const scrollable = rect.height - window.innerHeight;
      const travelled = window.scrollY - articleTop;
      const ratio =
        scrollable > 0 ? travelled / scrollable : travelled > 0 ? 1 : 0;
      setProgress(Math.min(1, Math.max(0, ratio)));
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(schedule, {
      rootMargin: `-${HEADER_OFFSET}px 0px 0px 0px`,
      threshold: [0, 1],
    });
    for (const element of elements) observer.observe(element);

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(article);

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [allNodes]);

  // Keep the active entry inside the panel viewport by scrolling the panel
  // itself - never the document, which would fight the reader.
  useEffect(() => {
    if (!activeSlug) return;
    const item = itemRefs.current[activeSlug];
    if (!item) return;
    for (const container of Object.values(listRefs.current)) {
      if (!container || !container.contains(item)) continue;
      const top = item.offsetTop;
      const bottom = top + item.offsetHeight;
      if (top < container.scrollTop) {
        container.scrollTop = top;
      } else if (bottom > container.scrollTop + container.clientHeight) {
        container.scrollTop = bottom - container.clientHeight;
      }
    }
  }, [activeSlug, visibleTree]);

  // Escape and outside-click release the pinned panel and close the sheet.
  useEffect(() => {
    if (!pinned && !sheetOpen) return undefined;

    const onKeyDown = event => {
      if (event.key !== 'Escape') return;
      setPinned(false);
      setSheetOpen(false);
    };
    const onPointerDown = event => {
      if (
        pinned &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setPinned(false);
      }
      if (
        sheetOpen &&
        sheetRef.current &&
        !sheetRef.current.contains(event.target)
      ) {
        setSheetOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [pinned, sheetOpen]);

  if (tree.length === 0) return null;

  const percent = Math.round(progress * 100);
  const activeIndex = taggedTree.findIndex(node => node.slug === activeRootSlug);

  const panelBody = variant => (
    <>
      <div className="border-b border-border p-2">
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Filter sections"
          aria-label="Filter sections"
          className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
        />
      </div>
      <div
        ref={element => {
          listRefs.current[variant] = element;
        }}
        className="relative max-h-[50vh] overflow-y-auto overscroll-contain p-2"
      >
        {visibleTree.length === 0 ? (
          <p className="px-2 py-3 text-xs text-muted">
            No sections match “{query.trim()}”.
          </p>
        ) : (
          <SectionList
            nodes={visibleTree}
            activeSlug={activeSlug}
            activeRootSlug={activeRootSlug}
            filtering={filtering}
            registerItem={registerItem}
            onSelect={() => {
              if (variant === 'sheet') setSheetOpen(false);
            }}
          />
        )}
      </div>
      <div className="flex items-center gap-2 border-t border-border px-3 py-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-150"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[0.65rem] tabular-nums text-muted">{percent}%</span>
      </div>
    </>
  );

  return (
    <>
      {/* Rail, from xl up where the gutter is at least 192px wide. */}
      <div
        ref={wrapperRef}
        className="group fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      >
        {/* The button precedes the panel in the DOM so that tabbing onward from
            it lands inside the panel it just revealed; `order` restores the
            visual arrangement of panel-then-rail. */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPinned(value => !value)}
            aria-expanded={pinned}
            aria-label={
              pinned ? 'Unpin section navigator' : 'Show section navigator'
            }
            className="order-2 flex flex-col items-center gap-1 rounded-full border border-border bg-card/60 px-1.5 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {/* The spine doubles as the progress indicator. */}
            <span className="relative block h-24 w-0.5 overflow-hidden rounded-full bg-border">
              <span
                className="absolute inset-x-0 top-0 rounded-full bg-primary"
                style={{ height: `${percent}%` }}
              />
            </span>
            <span className="flex flex-col items-center gap-1 py-1">
              {taggedTree.map((node, index) => (
                <span
                  key={node.slug}
                  className={`block h-0.5 rounded-full transition-all ${
                    index === activeIndex
                      ? 'w-3 bg-primary'
                      : index < activeIndex
                        ? 'w-2 bg-primary/50'
                        : 'w-2 bg-border'
                  }`}
                />
              ))}
            </span>
          </button>

          <div
            className={`glass order-1 w-80 rounded-lg border border-border shadow-lg transition-opacity duration-150 ${
              pinned
                ? 'visible opacity-100'
                : 'invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100'
            }`}
          >
            {panelBody('rail')}
          </div>
        </div>
      </div>

      {/* Below xl there is no gutter, so the same hierarchy opens as a sheet. */}
      {/* As with the rail, the control precedes the sheet in the DOM so that
          tabbing onward from it lands inside the sheet it just opened; `order`
          restores the visual stacking of sheet-above-control. */}
      <div
        ref={sheetRef}
        className="fixed bottom-4 right-4 z-40 flex flex-col items-end xl:hidden"
      >
        <button
          type="button"
          onClick={() => setSheetOpen(value => !value)}
          aria-expanded={sheetOpen}
          aria-label={
            sheetOpen ? 'Hide section navigator' : 'Show section navigator'
          }
          className="order-2 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h10"
            />
          </svg>
        </button>

        {sheetOpen && (
          <div className="glass order-1 mb-2 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-border shadow-lg">
            {panelBody('sheet')}
          </div>
        )}
      </div>
    </>
  );
}

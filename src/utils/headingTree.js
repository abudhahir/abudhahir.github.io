/**
 * Builds the section hierarchy the blog article navigator renders.
 *
 * Input is the `headings` array Astro produces from `post.render()`
 * (`{ depth, slug, text }[]`), so heading-like lines inside fenced code blocks
 * are already excluded and every `slug` matches the `id` on the rendered
 * heading.
 */

const CONTENTS_HEADING = 'table of contents';

/** Minimum number of top-level sections before a navigator is worth showing. */
export const MIN_NAVIGABLE_SECTIONS = 4;

/**
 * Strips decorative leading characters (emoji, numbering, punctuation) and
 * lowercases, so a reader can filter on the words they actually see.
 */
export function normaliseHeadingText(text) {
  return String(text ?? '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .trim()
    .toLowerCase();
}

/**
 * Whether the first heading of a document is the body restating the title the
 * template already renders, rather than a section of its own.
 *
 * True at depth 1, and also where the heading stands alone at the shallowest
 * depth in the document - the shape used by an article whose sections are
 * authored at `####` under a single `###` title line. Both forms would
 * otherwise become the only top-level entry and demote every real section
 * beneath a restatement of the page title.
 *
 * Keyed on document position rather than on matching the heading against the
 * frontmatter title, and requiring the heading to be alone at its depth, so an
 * article that genuinely uses its shallowest level as a section divider keeps
 * every divider.
 */
function isTitleRestatement(headings) {
  if (headings.length === 0) return false;
  const [first] = headings;
  if (first.depth === 1) return true;

  const minDepth = Math.min(...headings.map(heading => heading.depth));
  if (first.depth !== minDepth) return false;
  return headings.filter(heading => heading.depth === first.depth).length === 1;
}

/**
 * Turns a flat heading list into a nested tree, applying in order:
 *   1. drop a leading heading that merely restates the title,
 *   2. exclude a hand-written `Table of Contents` heading,
 *   3. normalise depth relative to the shallowest remaining heading, so an
 *      article authored entirely at `###` still has top-level sections.
 */
export function buildHeadingTree(headings = []) {
  const withoutTitleDuplicate = isTitleRestatement(headings)
    ? headings.slice(1)
    : headings;

  const navigable = withoutTitleDuplicate.filter(
    heading => normaliseHeadingText(heading.text) !== CONTENTS_HEADING,
  );

  if (navigable.length === 0) return [];

  const minDepth = Math.min(...navigable.map(heading => heading.depth));

  const roots = [];
  const ancestors = [];

  for (const heading of navigable) {
    const relativeDepth = heading.depth - minDepth;

    while (
      ancestors.length > 0 &&
      ancestors[ancestors.length - 1].relativeDepth >= relativeDepth
    ) {
      ancestors.pop();
    }

    const node = {
      slug: heading.slug,
      text: heading.text,
      depth: heading.depth,
      relativeDepth,
      // Nesting position in the tree, which is what the navigator renders
      // against. It can be shallower than `relativeDepth` where an author
      // skips a heading level.
      level: ancestors.length,
      searchText: normaliseHeadingText(heading.text),
      children: [],
    };

    if (ancestors.length === 0) {
      roots.push(node);
    } else {
      ancestors[ancestors.length - 1].node.children.push(node);
    }

    ancestors.push({ relativeDepth, node });
  }

  return roots;
}

/** Whether an article has enough sections for the navigator to be presented. */
export function hasEnoughSections(tree) {
  return tree.length >= MIN_NAVIGABLE_SECTIONS;
}

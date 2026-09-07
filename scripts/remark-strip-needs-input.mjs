/**
 * Keeps unanswered author notes out of the built site.
 *
 * The case studies in case-studies/ are drafted with inline `[NEEDS INPUT: …]`
 * markers where a fact is still missing. They are questions, not copy, and a
 * bracketed note to self reaching a recruiter is the worst failure this page
 * has — worse than the section being absent, because an invented answer would
 * be worse still. So nothing here ever rewrites or paraphrases a marker: it
 * removes, and when removal cannot be done cleanly it removes more.
 *
 * Three passes, in order:
 *
 *   1. Cut everything from the second h1 onwards. The prose uses h2 for its
 *      sections, so a second h1 is where the author-facing tail begins (the
 *      asset list and the gaps summary). Those belong in the file, not on-site.
 *      Then drop the leading h1 as well: the page renders the project's title
 *      in its own hero, and a document with two h1s is worse than one.
 *
 *   2. Per block, strip marker spans. A block whose entire text was a marker
 *      is dropped. A block with prose either side keeps the prose — but only
 *      if what remains still ends like a finished sentence. "…it lost because
 *      [NEEDS INPUT: why?]" cannot be excised without leaving a sentence that
 *      stops mid-clause, so that whole block goes.
 *
 *   3. Drop any h2 section left with no content, heading included.
 *
 * Every removal is logged. astro.config.mjs then greps the built HTML and
 * fails the build if a marker survived all of this — this plugin is the
 * mechanism, that guard is the guarantee.
 */

const MARKER = /\[NEEDS INPUT[\s\S]*?\]/g;

/** Punctuation a finished sentence is allowed to end on. */
const TERMINAL = /[.!?:;"'’”)\]]$/;

const BLOCK_TEXT_SKIP = new Set(['html', 'code']);

/** Concatenated text of a node and everything under it. */
function textOf(node) {
    if (typeof node.value === 'string' && !BLOCK_TEXT_SKIP.has(node.type)) return node.value;
    if (!node.children) return '';
    return node.children.map(textOf).join('');
}

/** Collect every descendant text-bearing node, in document order. */
function textNodes(node, out = []) {
    if (node.type === 'text' || node.type === 'inlineCode') out.push(node);
    if (node.children) for (const c of node.children) textNodes(c, out);
    return out;
}

export function remarkStripNeedsInput() {
    return (tree, file) => {
        const where = file?.basename || 'markdown';
        const removed = [];

        // 1. Author-facing tail.
        const secondH1 = tree.children.findIndex(
            (n, i) => i > 0 && n.type === 'heading' && n.depth === 1,
        );
        if (secondH1 !== -1) {
            const cut = tree.children.length - secondH1;
            tree.children = tree.children.slice(0, secondH1);
            removed.push(`${cut} trailing node(s) from the second h1 on (author-facing tail)`);
        }

        // The title. The page supplies its own <h1>; keeping this one would
        // print the name twice and give the document two top-level headings.
        if (tree.children[0]?.type === 'heading' && tree.children[0].depth === 1) {
            tree.children = tree.children.slice(1);
        }

        // Track the owning h2 so the log says where something went missing.
        let section = '(header)';
        const kept = [];

        for (const node of tree.children) {
            if (node.type === 'heading' && node.depth === 2) section = textOf(node);

            if (!textOf(node).includes('[NEEDS INPUT')) {
                kept.push(node);
                continue;
            }

            // 2. Strip the marker spans, then judge what is left.
            const before = textOf(node);
            for (const t of textNodes(node)) {
                // Collapse the space the marker leaves behind mid-sentence.
                t.value = t.value.replace(MARKER, '').replace(/[ \t]{2,}/g, ' ');
            }
            const after = textOf(node).trim();

            // A leftover fragment means the marker spanned inline nodes and the
            // regex could not see all of it. Dropping is always safe; guessing
            // at the seam is not.
            const partial = after.includes('NEEDS INPUT') || after.includes('[NEEDS');

            if (after === '') {
                removed.push(`${section}: marker-only block`);
            } else if (partial) {
                removed.push(`${section}: block with a marker spanning inline nodes`);
            } else if (!TERMINAL.test(after)) {
                removed.push(`${section}: block whose sentence depended on the marker`);
            } else {
                kept.push(node);
                removed.push(`${section}: trailing marker (${before.length - after.length} chars), prose kept`);
            }
        }
        tree.children = kept;

        // 3. Sections emptied by the pass above.
        const survivors = [];
        for (let i = 0; i < tree.children.length; i++) {
            const node = tree.children[i];
            if (node.type === 'heading' && node.depth === 2) {
                const next = tree.children
                    .slice(i + 1)
                    .find((n) => !(n.type === 'heading' && n.depth > 2));
                const empty = !next || (next.type === 'heading' && next.depth === 2);
                if (empty) {
                    removed.push(`${textOf(node)}: section emptied, heading dropped`);
                    continue;
                }
            }
            survivors.push(node);
        }
        tree.children = survivors;

        if (removed.length) {
            console.warn(`\n[needs-input] ${where}: ${removed.length} removal(s)`);
            for (const r of removed) console.warn(`[needs-input]   - ${r}`);
            console.warn('');
        }
    };
}

export default remarkStripNeedsInput;

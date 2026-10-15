// Renders the markdown source of a /docs page. See docs.ts.
//
// This file imports only marked, so node --test can load it directly.

import { Marked, type Tokens } from 'marked';

export type Heading = { id: string; text: string };
export type RenderedDoc = { title: string | null; html: string; headings: Heading[] };

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

// The same ids that Redcarpet's with_toc_data gave the headings on the Rails
// page, so links to /docs/api#cost-and-limits keep working.
export function headingId(text: string): string {
	return text
		.toLowerCase()
		.replace(/<[^>]*>/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// Renders the markdown source to HTML. The first level-one heading becomes the
// page title, not part of the body. Raw HTML in the source comes out escaped:
// the source is ours, but it arrives over the network, so this is a guard.
// A mermaid code block becomes a <pre class="mermaid"> that the page draws.
export function renderDoc(markdown: string): RenderedDoc {
	let title: string | null = null;
	const headings: Heading[] = [];

	const marked = new Marked({
		gfm: true,
		renderer: {
			heading({ tokens, depth, text }: Tokens.Heading) {
				if (depth === 1 && title === null) {
					title = text;
					return '';
				}
				const id = headingId(text);
				if (depth === 2) headings.push({ id, text: text.replace(/`/g, '') });
				return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
			},
			html({ text }: Tokens.HTML | Tokens.Tag) {
				return escapeHtml(text);
			},
			code({ text, lang }: Tokens.Code) {
				if (lang === 'mermaid') return `<pre class="mermaid">${escapeHtml(text)}</pre>\n`;
				const language = lang ? ` class="language-${escapeHtml(lang)}"` : '';
				// tabindex lets a keyboard user scroll a wide block.
				return `<pre tabindex="0"><code${language}>${escapeHtml(text)}</code></pre>\n`;
			}
		}
	});

	// Raw HTML is escaped, so every <table> here comes from a markdown table.
	// The scroll box keeps the table semantics, unlike display: block.
	const html = marked
		.parse(markdown, { async: false })
		.replace(/<table>/g, '<div class="docs-table" tabindex="0"><table>')
		.replace(/<\/table>/g, '</table></div>');
	return { title, html, headings };
}

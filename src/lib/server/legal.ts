// Markdown copies of /privacy and /tos, for agents that send Accept: text/markdown.
//
// scripts/legal-markdown.py writes these files from the rendered pages. Do not
// edit them by hand. After you change the text of either page, run the script
// again. legal.test.ts fails while a copy is out of date.
import privacy from './legal/privacy.md?raw';
import tos from './legal/tos.md?raw';

const pages: Record<string, string> = {
	'/privacy': privacy,
	'/tos': tos
};

// Returns null for a page that has no legal copy.
export function legalMarkdownFor(pathname: string): string | null {
	return pages[pathname] ?? null;
}

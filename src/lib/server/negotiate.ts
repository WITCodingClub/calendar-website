// Content negotiation for agents that ask for markdown.
//
// Browsers do not list text/markdown, so they keep getting HTML. Markdown wins
// only when the client ranks it above text/html. The Rails backend uses the
// same rule for /docs/api.

type AcceptEntry = { type: string; q: number; index: number };

function parseAccept(header: string): AcceptEntry[] {
	return header
		.split(',')
		.map((part, index) => {
			const [type, ...params] = part.trim().toLowerCase().split(';');
			let q = 1;

			for (const param of params) {
				const [key, value] = param.trim().split('=');
				if (key === 'q') {
					const parsed = Number(value);
					// A q value that is not a number counts as a refusal.
					q = Number.isFinite(parsed) ? parsed : 0;
				}
			}

			return { type: type.trim(), q, index };
		})
		.filter((entry) => entry.type !== '' && entry.q > 0);
}

function bestEntry(entries: AcceptEntry[], type: string): AcceptEntry | undefined {
	return entries.filter((entry) => entry.type === type).sort((a, b) => b.q - a.q)[0];
}

// Wildcards do not count. "text/markdown, text/html, */*" is a request for
// markdown, and a browser's "text/html, */*" is a request for HTML.
export function prefersMarkdown(accept: string | null): boolean {
	if (!accept) return false;

	const entries = parseAccept(accept);
	const markdown = bestEntry(entries, 'text/markdown');
	if (!markdown) return false;

	const html = bestEntry(entries, 'text/html');
	if (!html) return true;

	return markdown.q > html.q || (markdown.q === html.q && markdown.index < html.index);
}

// An estimate of about four characters for each token. Cloudflare also sends an
// estimate in this header.
export function estimateTokens(text: string): number {
	return Math.ceil(text.length / 4);
}

import type { Handle } from '@sveltejs/kit';
import { legalMarkdownFor } from '$lib/server/legal';
import { estimateTokens, prefersMarkdown } from '$lib/server/negotiate';
import { markdownFor } from '$lib/server/pages';

// Markdown for Agents: a request with Accept: text/markdown gets the markdown
// copy of the page. Every other request gets the HTML page, as before.
// See https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
export const handle: Handle = async ({ event, resolve }) => {
	const { request, url } = event;
	const markdown = markdownFor(url.pathname, url.origin) ?? legalMarkdownFor(url.pathname);

	if (markdown === null) return resolve(event);

	const readable = request.method === 'GET' || request.method === 'HEAD';

	if (readable && prefersMarkdown(request.headers.get('accept'))) {
		return new Response(request.method === 'HEAD' ? null : markdown, {
			headers: {
				'content-type': 'text/markdown; charset=utf-8',
				vary: 'Accept',
				'x-markdown-tokens': String(estimateTokens(markdown))
			}
		});
	}

	// The HTML and the markdown share one URL, so a cache must key on Accept.
	const response = await resolve(event);
	response.headers.append('vary', 'Accept');
	return response;
};

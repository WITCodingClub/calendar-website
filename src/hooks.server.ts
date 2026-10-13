import type { Handle } from '@sveltejs/kit';
import { legalMarkdownFor } from '$lib/server/legal';
import { estimateTokens, prefersMarkdown } from '$lib/server/negotiate';
import { changelogMarkdown, markdownFor } from '$lib/server/pages';
import { loadChangelog } from '$lib/server/releases';

// Markdown for Agents: a request with Accept: text/markdown gets the markdown
// copy of the page. Every other request gets the HTML page, as before.
// See https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
export const handle: Handle = async ({ event, resolve }) => {
	const { request, url } = event;
	let markdown = markdownFor(url.pathname, url.origin) ?? legalMarkdownFor(url.pathname);
	// The changelog's copy needs the releases from GitHub, so it is built only
	// when an agent asks for it.
	const isChangelog = url.pathname === '/changelog';

	if (markdown === null && !isChangelog) return resolve(event);

	const readable = request.method === 'GET' || request.method === 'HEAD';

	if (readable && prefersMarkdown(request.headers.get('accept'))) {
		markdown ??= changelogMarkdown(await loadChangelog().catch(() => null), url.origin);
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

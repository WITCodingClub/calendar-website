import { sourcePath } from '../docs.ts';
import { SITE_ORIGIN } from '../site.ts';

// Fetches the markdown source of a /docs page from the Rails backend. See
// docs.ts.
//
// The request goes to the public host. The rproxy Worker sends it to this site
// first, which has no /docs/<slug>.md route, so Rails answers. Each source is
// kept for 10 minutes, in this isolate and in Cloudflare's cache through
// cf.cacheTtl, so most page views make no request to Rails.

const FRESH = 600;

type Entry = { until: number; data: Promise<string> };
// Kept on globalThis for the same reason as the changelog cache in releases.ts.
const store = globalThis as { docsCache?: Map<string, Entry> };
const cache = (store.docsCache ??= new Map<string, Entry>());
const last = new Map<string, string>();

async function request(url: string): Promise<string> {
	const response = await fetch(url, {
		headers: { accept: 'text/markdown', 'user-agent': 'calendar.witcc.dev' },
		// Cloudflare only. Other runtimes ignore it.
		cf: { cacheTtl: FRESH, cacheEverything: true }
	} as RequestInit);
	if (!response.ok) throw new Error(`The backend answered ${response.status} for ${url}`);
	return response.text();
}

// Throws when the backend cannot be reached and nothing was loaded before.
export async function loadDocSource(slug: string): Promise<string> {
	const url = `${SITE_ORIGIN}${sourcePath(slug)}`;
	const hit = cache.get(url);
	let data = hit && hit.until > Date.now() ? hit.data : undefined;

	if (!data) {
		data = request(url);
		cache.set(url, { until: Date.now() + FRESH * 1000, data });
		// A failed request is not kept, so the next visit tries again.
		data.catch(() => cache.delete(url));
	}

	try {
		const source = await data;
		last.set(url, source);
		return source;
	} catch (error) {
		console.error(`Could not load ${url}:`, error);
		const previous = last.get(url);
		if (previous === undefined) throw error;
		return previous;
	}
}

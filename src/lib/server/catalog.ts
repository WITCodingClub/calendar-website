import { error } from '@sveltejs/kit';
import { SITE_ORIGIN } from '../site.ts';
import type { Term } from '../catalog.ts';

// Requests to the backend's public catalog API. See catalog.ts.
//
// The request goes to the public host. The rproxy Worker sends /api to Rails,
// and a zone cache rule keeps GET /api/v1/catalog/* at the edge, so most page
// views make no request to Rails.

const API = `${SITE_ORIGIN}/api/v1/catalog`;
const FRESH = 300;

// The parsed JSON body of a catalog request. A 404 from the API is a 404
// here, so the rproxy Worker then asks Rails, which answers 404 too. Any other
// failure is a 503.
export async function catalogGet<T>(
	path: string,
	params: Record<string, string | number | null | undefined> = {}
): Promise<T> {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== null && value !== undefined && value !== '') query.set(key, String(value));
	}
	const url = `${API}${path}${query.size ? `?${query}` : ''}`;

	let response: Response;
	try {
		response = await fetch(url, {
			headers: { accept: 'application/json', 'user-agent': 'calendar.witcc.dev' },
			// Cloudflare only. Other runtimes ignore it.
			cf: { cacheTtl: FRESH, cacheEverything: true }
		} as RequestInit);
	} catch (cause) {
		console.error(`Could not load ${url}:`, cause);
		error(503, 'The course catalog could not be loaded. Try again in a few minutes.');
	}

	if (response.status === 404) error(404, 'Not found');
	if (response.status === 400) error(400, 'The search is not valid.');
	if (!response.ok) {
		console.error(`The backend answered ${response.status} for ${url}`);
		error(503, 'The course catalog could not be loaded. Try again in a few minutes.');
	}
	return (await response.json()) as T;
}

// The terms for a term picker, newest first. Terms with no sections are left
// out.
export async function catalogTerms(): Promise<Term[]> {
	const body = await catalogGet<{ data: Term[] }>('/terms');
	return body.data.filter((term) => (term.section_count ?? 0) > 0);
}

// The current term, or null between terms.
export async function currentTerm(): Promise<Term | null> {
	try {
		const body = await catalogGet<{ data: Term }>('/terms/current');
		return body.data;
	} catch (failure) {
		if ((failure as { status?: number }).status === 404) return null;
		throw failure;
	}
}

// The term of a term_uid query param, or the default: the current term when
// it has sections, otherwise the newest term that has sections.
export async function selectedTerm(param: string | null, terms: Term[]): Promise<Term | null> {
	if (param) {
		const term = terms.find((candidate) => String(candidate.uid) === param);
		if (!term) error(404, 'Not found');
		return term;
	}
	const current = await currentTerm();
	return terms.find((term) => term.uid === current?.uid) ?? terms[0] ?? null;
}

import { error } from '@sveltejs/kit';
import { SITE_ORIGIN } from '../site.ts';
import { pickTerm, type Term } from '../catalog.ts';

// Requests to the backend's public catalog API. See catalog.ts.
//
// The request goes to the public host. The rproxy Worker sends /api to Rails,
// and a zone cache rule keeps GET /api/v1/catalog/* at the edge, so most page
// views make no request to Rails.

const API = `${SITE_ORIGIN}/api/v1/catalog`;
const FRESH = 300;

// The parsed JSON body of a catalog request. A 404 from the API is a 404
// here. Any other failure is a 503. The rproxy Worker sends any answer of 400
// or higher on to Rails, which has no /catalog route, so a visitor sees the
// Rails 404 page in both cases.
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

// The terms for the term picker and the term of a detail page. The two
// requests run at the same time. See pickTerm.
export async function termChoice(
	param: string | null
): Promise<{ terms: Term[]; term: Term | null }> {
	const [terms, current] = await Promise.all([catalogTerms(), currentTerm()]);
	return { terms, term: pickTerm(param, terms, current?.uid ?? null) };
}

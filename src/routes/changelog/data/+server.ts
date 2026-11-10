import { json } from '@sveltejs/kit';
import { loadChangelog, latestReleaseTag } from '$lib/server/releases';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const tag = await latestReleaseTag();
		if (url.searchParams.get('version') === tag) return json({ tag });
		return json({ tag, releases: await loadChangelog() });
	} catch {
		return json({ error: 'Could not load releases' }, { status: 503 });
	}
};

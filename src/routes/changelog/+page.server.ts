import { loadChangelog } from '$lib/server/releases';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	try {
		const releases = await loadChangelog();
		setHeaders({ 'cache-control': 'public, max-age=300' });
		return { releases, failed: false };
	} catch {
		return { releases: [], failed: true };
	}
};

import type { Release } from './releaseNotes.ts';

const KEY = 'changelog';
const MAX_AGE = 3 * 24 * 60 * 60 * 1000;
type Cached = { tag: string; savedAt: number; releases: Release[] };

export async function refreshChangelog(show: (releases: Release[]) => void): Promise<void> {
	let cached: Cached | undefined;
	try {
		const value = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Cached | null;
		if (
			value &&
			typeof value.tag === 'string' &&
			Number.isFinite(value.savedAt) &&
			Array.isArray(value.releases)
		) {
			cached = value;
			show(cached.releases);
		}
	} catch {
		cached = undefined;
	}

	try {
		const fresh = cached && Date.now() - cached.savedAt < MAX_AGE;
		const query = fresh && cached ? `?version=${encodeURIComponent(cached.tag)}` : '';
		const response = await fetch(`/changelog/data${query}`);
		if (!response.ok) throw new Error('Could not load releases');
		const result = (await response.json()) as { tag: string; releases?: Release[] };
		if (result.releases) {
			show(result.releases);
			try {
				localStorage.setItem(KEY, JSON.stringify({ ...result, savedAt: Date.now() }));
			} catch {
				return;
			}
		}
	} catch (error) {
		if (!cached) throw error;
	}
}

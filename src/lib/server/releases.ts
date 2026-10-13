import {
	buildChangelog,
	publishedReleases,
	versionOf,
	type GitHubCommit,
	type GitHubData,
	type GitHubRelease,
	type Release
} from '../releaseNotes.ts';

// Fetches the changelog from GitHub. See releaseNotes.ts.
//
// Each time the release list is fetched, the commits between the newest
// release and the one before it are fetched too, so a new release and its
// commits show up together. The release list, the tags, and the newest range
// are kept for 10 minutes. Older ranges and tag dates do not change, so they
// are kept for 30 days. Both in this isolate and in Cloudflare's cache,
// through cf.cacheTtl.
//
// A cold start makes about 25 requests. GitHub allows 60 an hour from one IP
// address, and a Worker shares its address with other Workers, so the caching
// matters.

const API = 'https://api.github.com/repos/WITCodingClub/calendar-extension';
const FRESH = 600;
const SETTLED = 30 * 24 * 60 * 60;

type Commit = GitHubCommit & { commit: { committer: { date: string } | null } };
type TagRef = { ref: string; object: { sha: string; type: 'commit' | 'tag' } };
type Tag = { tagger: { date: string } | null };
type Compare = { total_commits: number; commits: Commit[] };

// Kept on globalThis, not in this module, so that every copy of the module
// shares one cache. The dev server can load a module twice on Windows, once
// for each case of the drive letter. A request in flight is shared too, so
// two visitors at once make one set of requests.
type Entry = { until: number; data: Promise<unknown> };
const store = globalThis as { changelogCache?: Map<string, Entry> };
const cache = (store.changelogCache ??= new Map<string, Entry>());

function get<T>(path: string, seconds: number): Promise<T> {
	const url = `${API}${path}`;
	const hit = cache.get(url);
	if (hit && hit.until > Date.now()) return hit.data as Promise<T>;

	const data = request<T>(url, seconds);
	cache.set(url, { until: Date.now() + seconds * 1000, data });
	// A failed request is not kept, so the next visit tries again.
	data.catch(() => cache.delete(url));
	return data;
}

async function request<T>(url: string, seconds: number): Promise<T> {
	const response = await fetch(url, {
		headers: {
			accept: 'application/vnd.github+json',
			'user-agent': 'calendar.witcc.dev',
			'x-github-api-version': '2022-11-28'
		},
		// Cloudflare only. Other runtimes ignore it.
		cf: { cacheTtl: seconds, cacheEverything: true }
	} as RequestInit);
	if (!response.ok) throw new Error(`GitHub answered ${response.status} for ${url}`);
	return (await response.json()) as T;
}

const PER_PAGE = 100;

// Every item of a list endpoint, page by page, until a page is not full.
async function everyPage<T>(path: string, seconds: number): Promise<T[]> {
	const items: T[] = [];
	for (let page = 1; ; page++) {
		const batch = await get<T[]>(`${path}per_page=${PER_PAGE}&page=${page}`, seconds);
		items.push(...batch);
		if (batch.length < PER_PAGE) return items;
	}
}

// Every commit after one tag, up to and including another. Without paging,
// GitHub returns at most 250 of them, so a large release would lose commits.
// total_commits says how many pages there are. See
// https://docs.github.com/en/rest/commits/commits#compare-two-commits
async function commitsBetween(base: string, head: string, seconds: number): Promise<Commit[]> {
	const page = (n: number) =>
		get<Compare>(`/compare/${base}...${head}?per_page=${PER_PAGE}&page=${n}`, seconds);
	const first = await page(1);
	const count = Math.ceil(first.total_commits / PER_PAGE);
	const rest = await Promise.all(Array.from({ length: count - 1 }, (_, i) => page(i + 2)));
	return [first, ...rest].flatMap((compare) => compare.commits);
}

async function fetchGitHub(): Promise<GitHubData> {
	const [releases, refs] = await Promise.all([
		everyPage<GitHubRelease>('/releases?', FRESH),
		get<TagRef[]>('/git/matching-refs/tags', FRESH).catch(() => [] as TagRef[])
	]);
	const published = publishedReleases(releases);

	// Unreachable commits are left out, not fatal: the release is still shown
	// from its notes.
	const ranges = await Promise.all(
		published.map((release, i) => {
			const tag = release.tag_name;
			// The first release: every commit up to its tag.
			if (i === 0) return everyPage<Commit>(`/commits?sha=${tag}&`, SETTLED).catch(() => undefined);
			const ttl = i === published.length - 1 ? FRESH : SETTLED;
			return commitsBetween(published[i - 1].tag_name, tag, ttl).catch(() => undefined);
		})
	);

	// An annotated tag has its own date. A lightweight tag is dated by the
	// commit it points to.
	const allCommits = new Map(ranges.flatMap((commits) => commits ?? []).map((c) => [c.sha, c]));
	const tagDates = await Promise.all(
		published.map(async (release) => {
			const ref = refs.find((r) => r.ref === `refs/tags/${release.tag_name}`);
			if (!ref) return undefined;
			if (ref.object.type === 'tag') {
				const tag = await get<Tag>(`/git/tags/${ref.object.sha}`, SETTLED).catch(() => undefined);
				return tag?.tagger?.date;
			}
			return allCommits.get(ref.object.sha)?.commit.committer?.date;
		})
	);

	return {
		releases,
		commits: Object.fromEntries(published.map((r, i) => [versionOf(r.tag_name), ranges[i]])),
		tagDates: Object.fromEntries(published.map((r, i) => [versionOf(r.tag_name), tagDates[i]]))
	};
}

let last: Release[] | undefined;

// Throws when GitHub cannot be reached and nothing was loaded before.
export async function loadChangelog(): Promise<Release[]> {
	try {
		last = buildChangelog(await fetchGitHub());
	} catch (error) {
		console.error('Could not load the changelog from GitHub:', error);
		if (!last) throw error;
	}
	return last;
}

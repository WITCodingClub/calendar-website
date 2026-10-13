import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { loadChangelog } from './releases.ts';

const repo = 'https://github.com/WITCodingClub/calendar-extension';
const realFetch = globalThis.fetch;

function release(tag: string, body: string) {
	return {
		tag_name: tag,
		html_url: `${repo}/releases/tag/${tag}`,
		published_at: '2026-09-30T21:39:12Z',
		draft: false,
		prerelease: false,
		body
	};
}

function commit(sha: string, message: string) {
	return {
		sha: sha.padEnd(40, '0'),
		commit: { message, author: { email: 'logan@cattn.dev' }, committer: null },
		author: { login: 'Cattn' },
		parents: [{ sha: 'p' }]
	};
}

// Answers like the GitHub API, from a handler per path, and records the
// paths asked for.
function serve(handler: (path: string) => unknown): string[] {
	const asked: string[] = [];
	(globalThis as { changelogCache?: Map<string, unknown> }).changelogCache?.clear();
	globalThis.fetch = (async (input: string | URL | Request) => {
		const path = String(input).replace(
			`https://api.github.com/repos/WITCodingClub/calendar-extension`,
			''
		);
		asked.push(path);
		const body = handler(path);
		return new Response(JSON.stringify(body ?? []), { status: body === undefined ? 404 : 200 });
	}) as typeof fetch;
	return asked;
}

afterEach(() => {
	globalThis.fetch = realFetch;
});

describe('loadChangelog', () => {
	it('reads every page of a compare', async () => {
		const notes = `* Start by @Cattn in ${repo}/pull/1`;
		const asked = serve((path) => {
			if (path.startsWith('/releases?')) {
				return path.endsWith('page=1')
					? [
							release('v1.0.0', notes),
							release('v1.1.0', `* Big release by @Cattn in ${repo}/pull/2`)
						]
					: [];
			}
			if (path.startsWith('/commits?') || path.startsWith('/git/')) return [];
			if (path.startsWith('/compare/v1.0.0...v1.1.0')) {
				// 150 commits: 100 on the first page, 50 on the second.
				return path.endsWith('page=1')
					? {
							total_commits: 150,
							commits: [
								commit('a', 'Big release (#2)'),
								...Array.from({ length: 99 }, (_, i) => commit(`b${i}`, 'v1.1.0'))
							]
						}
					: {
							total_commits: 150,
							commits: [
								commit('c', 'feat: dark mode'),
								...Array.from({ length: 49 }, (_, i) => commit(`d${i}`, 'v1.1.0'))
							]
						};
			}
		});

		const [latest] = await loadChangelog();
		assert.ok(asked.includes('/compare/v1.0.0...v1.1.0?per_page=100&page=2'));
		assert.deepEqual(
			latest.changes.map((c) => c.text),
			['Big release', 'feat: dark mode']
		);
	});

	it('reads every page of releases', async () => {
		const releases = Array.from({ length: 101 }, (_, i) =>
			release(`v1.0.${i}`, `* Change ${i} by @Cattn in ${repo}/pull/${i + 1}`)
		);
		serve((path) => {
			if (path === '/releases?per_page=100&page=1') return releases.slice(0, 100);
			if (path === '/releases?per_page=100&page=2') return releases.slice(100);
			// No commits, so every release is shown from its notes.
			return path.startsWith('/git/') ? [] : undefined;
		});

		const changelog = await loadChangelog();
		assert.equal(changelog.length, 101);
		assert.equal(changelog[0].version, '1.0.100');
	});
});

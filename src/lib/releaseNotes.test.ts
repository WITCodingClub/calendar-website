import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	bostonDate,
	buildChangelog,
	formatReleaseDate,
	isRealChange,
	parseChange,
	parseNotes,
	type Curation,
	type GitHubCommit,
	type GitHubData,
	type GitHubRelease
} from './releaseNotes.ts';

const repo = 'https://github.com/WITCodingClub/calendar-extension';
const pull = (n: number) => `${repo}/pull/${n}`;

function release(tag: string, body: string, publishedAt = '2026-09-30T21:39:12Z'): GitHubRelease {
	return {
		tag_name: tag,
		html_url: `${repo}/releases/tag/${tag}`,
		published_at: publishedAt,
		draft: false,
		prerelease: false,
		body
	};
}

let next = 0;
function commit(
	message: string,
	email = 'logan@cattn.dev',
	login: string | null = null
): GitHubCommit {
	const sha = (++next).toString(16).padStart(7, '0') + 'f'.repeat(33);
	return {
		sha,
		commit: { message, author: { email } },
		author: login ? { login } : null,
		parents: [{ sha: 'p' }]
	};
}

const curation: Curation = {
	directCommitChanges: [],
	ignoredCommits: {},
	ignoredPullRequests: {},
	emailLogins: { 'logan@cattn.dev': 'Cattn', 'mayonej@wit.edu': 'jaspermayone' },
	renamedAccounts: { miretskyd: 'miretskydatwit' },
	releaseSummaries: {}
};

// The first release is v1.0.0, so the release under test is never the first.
function changelog(
	tag: string,
	body: string,
	commits: GitHubCommit[] | undefined,
	more: Partial<Curation> = {},
	extra: Partial<GitHubData> = {}
) {
	const data: GitHubData = {
		releases: [release('v1.0.0', `* Start by @Cattn in ${pull(1)}`), release(tag, body)],
		commits: { '1.0.0': [commit('Start (#1)')], [tag.slice(1)]: commits },
		tagDates: {},
		...extra
	};
	return buildChangelog(data, { ...curation, ...more });
}

const change = (text: string) => ({ text, contributors: [], links: [] });

describe('parseChange', () => {
	it('reads a bullet that GitHub generated', () => {
		assert.deepEqual(parseChange(`fix friends button by @Cattn in ${pull(179)}`), {
			text: 'fix friends button',
			contributors: ['Cattn'],
			links: [{ label: 'PR #179', url: pull(179) }]
		});
	});

	it('reads more than one contributor', () => {
		const { contributors } = parseChange(
			`Friends by @Cattn, @miretskydatwit and @jaspermayone in ${pull(96)}`
		);
		assert.deepEqual(contributors, ['Cattn', 'miretskydatwit', 'jaspermayone']);
	});

	it('links commits, and the issues a change closes', () => {
		const { links } = parseChange(
			`Settings by @Cattn in ${repo}/commit/e78e227, ${repo}/commit/d685cba (closes #129, #141)`
		);
		assert.deepEqual(
			links.map((link) => link.label),
			['e78e227', 'd685cba', 'Issue #129', 'Issue #141']
		);
	});

	it('keeps "by" and "in" that are part of the text', () => {
		const { text } = parseChange(`Fixed signing in by passkey by @Cattn in ${pull(137)}`);
		assert.equal(text, 'Fixed signing in by passkey');
	});

	it('does not credit bots', () => {
		const { contributors } = parseChange(`Optimize images by @imgbot[bot] in ${pull(61)}`);
		assert.deepEqual(contributors, []);
	});

	it('shows a bullet in another format as plain text', () => {
		assert.deepEqual(parseChange('Small fixes'), change('Small fixes'));
	});
});

describe('parseNotes', () => {
	it('reads the summary and the changes, and skips New Contributors', () => {
		const notes = parseNotes(
			[
				'Introducing Friends.',
				"## What's Changed",
				`* Friends by @Cattn in ${pull(96)}`,
				'## New Contributors',
				`* @Griffty made their first contribution in ${pull(134)}`,
				`**Full Changelog**: ${repo}/compare/v2.1.3...v3.0.0`
			].join('\r\n')
		);
		assert.equal(notes.summary, 'Introducing Friends.');
		assert.deepEqual(
			notes.changes.map((c) => c.text),
			['Friends']
		);
	});
});

describe('isRealChange', () => {
	it('rejects changes that tell a student nothing', () => {
		for (const text of [
			'Bug fix',
			'Bug fixes.',
			'Small fixes and improvements.',
			'Minor tweaks',
			'Fixed issues in the Firefox version.',
			'fix: firefox issues',
			'No changes you can see. The code was reorganized.',
			'The same code as 2.1.1.',
			'v3.0.1',
			'v2',
			'ci: run npm run check on pull requests',
			'chore(deps): bump vite',
			'Update README with Firefox build instructions',
			'bump adapter-extension',
			'Upgrade actions/checkout to version 7'
		]) {
			assert.equal(isRealChange(change(text)), false, text);
		}
	});

	it('keeps changes that say what changed', () => {
		for (const text of [
			'fix friends button',
			'Fixed signing in when you use Firefox containers.',
			'Styling fixes.',
			'Build your schedule faster'
		]) {
			assert.equal(isRealChange(change(text)), true, text);
		}
	});
});

describe('buildChangelog', () => {
	it('credits the authors and co-authors of a pull request', () => {
		const [latest] = changelog('v5.1.0', `* Any color by @Griffty in ${pull(134)}`, [
			commit(
				'feat: allow users to use any color (#134)\n\nCo-authored-by: Jasper Mayone <mayonej@wit.edu>\nCo-authored-by: Copilot <175728472+Copilot@users.noreply.github.com>',
				'kotelyakvv@gmail.com',
				'Griffty'
			)
		]);
		assert.deepEqual(latest.changes[0].contributors, ['Griffty', 'jaspermayone']);
	});

	it('uses the current name of a renamed account', () => {
		const [latest] = changelog('v2.0.1', `* Refresh by @miretskyd in ${pull(87)}`, [
			commit('Fix refresh courses button (#87)', 'miretskyd@wit.edu', 'miretskydatwit')
		]);
		assert.deepEqual(latest.changes[0].contributors, ['miretskydatwit']);
	});

	it('drops a pull request with no commits in the release', () => {
		const releases = changelog('v2.1.2', `* Colors by @jaspermayone in ${pull(95)}`, []);
		assert.deepEqual(
			releases.map((r) => r.version),
			['1.0.0']
		);
	});

	it('keeps the notes when the commits could not be loaded', () => {
		const [latest] = changelog(
			'v5.2.0',
			`* Fix the Friends button by @Cattn in ${pull(179)}`,
			undefined
		);
		assert.equal(latest.changes[0].text, 'Fix the Friends button');
	});

	it('adds direct commits, with the words from changelog.ts when it has them', () => {
		const described = commit('feat: move calendar link to settings');
		const plain = commit('fix: center the term chips', 'mayonej@wit.edu');
		const [latest] = changelog(
			'v5.0.0',
			`* UI refresh by @Cattn in ${pull(145)}`,
			[commit('UI refresh (#145)'), described, plain],
			{
				directCommitChanges: [
					{
						version: '5.0.0',
						text: 'Your calendar link is in Settings.',
						contributors: [],
						commits: [described.sha.slice(0, 7)],
						issues: [129]
					}
				]
			}
		);
		assert.deepEqual(
			latest.changes.map((c) => [c.text, c.contributors, c.links.map((l) => l.label)]),
			[
				['UI refresh', ['Cattn'], ['PR #145']],
				[
					'Your calendar link is in Settings.',
					['Cattn'],
					[described.sha.slice(0, 7), 'Issue #129']
				],
				['fix: center the term chips', ['jaspermayone'], [plain.sha.slice(0, 7)]]
			]
		);
	});

	it('leaves out ignored commits, version bumps, and commits that a revert undoes', () => {
		const ignored = commit('update build scripts');
		const original = commit('feat: send usage counts');
		const [latest] = changelog(
			'v5.0.0',
			`* UI refresh by @Cattn in ${pull(145)}`,
			[
				commit('UI refresh (#145)'),
				ignored,
				original,
				commit('revert: feat: send usage counts'),
				commit('v5.0.0')
			],
			{ ignoredCommits: { [ignored.sha.slice(0, 7)]: 'Build scripts' } }
		);
		assert.deepEqual(
			latest.changes.map((c) => c.text),
			['UI refresh']
		);
	});

	it('leaves out ignored pull requests', () => {
		const releases = changelog(
			'v5.0.0',
			`* Interfaces by @jaspermayone in ${pull(10)}`,
			[commit('Interfaces (#10)')],
			{
				ignoredPullRequests: { 10: 'Internal types' }
			}
		);
		assert.ok(!releases.some((r) => r.version === '5.0.0'));
	});

	it('hides a release with no real changelog', () => {
		for (const [body, commits] of [
			[
				`**Full Changelog**: ${repo}/compare/v5.0.0...v5.0.1`,
				[commit('chore: refactor repo'), commit('v5.0.1')]
			],
			[`* Bug fixes by @Cattn in ${pull(200)}`, [commit('Bug fixes (#200)')]],
			[`* ci: fix builds by @Cattn in ${pull(201)}`, [commit('ci: fix builds (#201)')]]
		] as const) {
			const releases = changelog('v5.0.1', body, [...commits], {
				ignoredCommits: {}
			});
			assert.ok(!releases.some((r) => r.version === '5.0.1'), body);
		}
	});

	it('describes a major release in one sentence, in place of the summary in its notes', () => {
		const body = `A summary on GitHub.\n\n* UI refresh by @Cattn in ${pull(145)}`;
		const commits = [commit('UI refresh (#145)')];

		const [described] = changelog('v5.0.0', body, commits, {
			releaseSummaries: { '5.0.0': 'A redesigned extension that loads faster.' }
		});
		assert.equal(described.summary, 'A redesigned extension that loads faster.');

		const [fromNotes] = changelog('v6.0.0', body, commits);
		assert.equal(fromNotes.summary, 'A summary on GitHub.');
	});

	it('describes each release in changelog.ts in one sentence', async () => {
		const { releaseSummaries } = await import('./changelog.ts');
		for (const [version, summary] of Object.entries(releaseSummaries)) {
			assert.match(version, /^\d+\.\d+\.\d+$/, `${version} is not a version`);
			assert.match(summary, /^[^.!?]+[.!?]$/, `${version}: not one sentence`);
		}
	});

	it('dates a release by its tag, in Boston', () => {
		const [latest] = changelog(
			'v5.1.0',
			`* Any color by @Griffty in ${pull(134)}`,
			[commit('Any color (#134)')],
			{},
			{
				tagDates: { '5.1.0': '2026-09-23T02:56:33Z' }
			}
		);
		assert.equal(latest.date, '2026-09-22');
	});

	it('orders by version, not by the day GitHub published it', () => {
		const releases = buildChangelog(
			{
				releases: [
					release('v2.0.1', `* Refresh button by @a in ${pull(87)}`, '2026-01-06T21:03:33Z'),
					release('v10.0.0', `* Big update by @a in ${pull(300)}`, '2026-01-01T00:00:00Z'),
					release('v2.0.0', `* Version two by @a in ${pull(66)}`, '2026-01-06T21:04:57Z')
				],
				commits: {},
				tagDates: {}
			},
			curation
		);
		assert.deepEqual(
			releases.map((r) => r.version),
			['10.0.0', '2.0.1', '2.0.0']
		);
	});
});

describe('release dates', () => {
	it('uses the date in Boston', () => {
		assert.equal(bostonDate('2026-09-23T02:57:29Z'), '2026-09-22');
		assert.equal(formatReleaseDate('2026-09-22'), 'September 22, 2026');
	});
});

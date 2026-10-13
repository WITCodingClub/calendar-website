import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	bostonDate,
	buildChangelog,
	formatReleaseDate,
	isRealChange,
	parseChange,
	parseNotes,
	type GitHubCommit,
	type GitHubData,
	type GitHubRelease
} from './releaseNotes.ts';

const repo = 'https://github.com/WITCodingClub/calendar-extension';
const pull = (n: number) => `${repo}/pull/${n}`;
const commitUrl = (c: GitHubCommit) => `${repo}/commit/${c.sha.slice(0, 7)}`;
const short = (c: GitHubCommit) => c.sha.slice(0, 7);

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
// GitHub links the email to the account when login is given.
function commit(
	message: string,
	login: string | null = 'Cattn',
	email = 'logan@cattn.dev'
): GitHubCommit {
	const sha = (++next).toString(16).padStart(7, 'a') + 'f'.repeat(33);
	return {
		sha,
		commit: { message, author: { email } },
		author: login ? { login } : null,
		parents: [{ sha: 'p' }]
	};
}

// The first release is v1.0.0, so the release under test is never the first.
function changelog(
	tag: string,
	body: string,
	commits: GitHubCommit[] | undefined,
	extra: Partial<GitHubData> = {}
) {
	return buildChangelog({
		releases: [release('v1.0.0', `* Start by @Cattn in ${pull(1)}`), release(tag, body)],
		commits: { '1.0.0': [commit('Start (#1)')], [tag.slice(1)]: commits },
		tagDates: {},
		...extra
	});
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
	it('reads the summary, the changes, and the hidden commits, and skips New Contributors', () => {
		const notes = parseNotes(
			[
				'Introducing Friends.',
				'',
				"## What's Changed",
				`* Friends by @Cattn in ${pull(96)}`,
				'',
				'## New Contributors',
				`* @Griffty made their first contribution in ${pull(134)}`,
				'',
				'<!-- changelog: hide 2abb382 b42c008 -->',
				'<!--',
				'changelog: hide 7d77adf9c1e2',
				'-->',
				`**Full Changelog**: ${repo}/compare/v2.1.3...v3.0.0`
			].join('\r\n')
		);
		assert.equal(notes.summary, 'Introducing Friends.');
		assert.deepEqual(
			notes.changes.map((c) => c.text),
			['Friends']
		);
		assert.deepEqual(notes.hidden, ['2abb382', 'b42c008', '7d77adf']);
	});

	it('does not treat other comments as part of the notes', () => {
		const notes = parseNotes(
			'<!-- a note for maintainers -->\n* Real change by @Cattn in ' + pull(5)
		);
		assert.equal(notes.summary, undefined);
		assert.deepEqual(notes.hidden, []);
		assert.equal(notes.changes.length, 1);
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
				'Griffty',
				'kotelyakvv@gmail.com'
			),
			// GitHub links mayonej@wit.edu to jaspermayone on this commit.
			commit('Other work (#140)', 'jaspermayone', 'mayonej@wit.edu')
		]);
		assert.deepEqual(latest.changes[0].contributors, ['Griffty', 'jaspermayone']);
	});

	it('credits the authors of the commits that a bullet links', () => {
		const work = commit('feat: move calendar link to settings', 'Cattn');
		const [latest] = changelog(
			'v5.0.0',
			`* Your calendar link is in Settings by @jaspermayone in ${commitUrl(work)} (closes #129)`,
			[work]
		);
		assert.deepEqual(
			latest.changes.map((c) => [c.text, c.contributors, c.links.map((l) => l.label)]),
			[
				[
					'Your calendar link is in Settings',
					['jaspermayone', 'Cattn'],
					[short(work), 'Issue #129']
				]
			]
		);
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

	it('adds direct commits that the notes neither link nor hide', () => {
		const linked = commit('feat: move calendar link to settings');
		const hidden = commit('update build scripts');
		const shown = commit('fix: center the term chips', 'jaspermayone');
		const [latest] = changelog(
			'v5.0.0',
			[
				`* UI refresh by @Cattn in ${pull(145)}`,
				`* Your calendar link is in Settings by @Cattn in ${commitUrl(linked)}`,
				`<!-- changelog: hide ${short(hidden)} -->`
			].join('\n'),
			[commit('UI refresh (#145)'), linked, hidden, shown]
		);
		assert.deepEqual(
			latest.changes.map((c) => [c.text, c.contributors]),
			[
				['UI refresh', ['Cattn']],
				['Your calendar link is in Settings', ['Cattn']],
				['fix: center the term chips', ['jaspermayone']]
			]
		);
	});

	it('leaves out version bumps, and commits that a revert undoes', () => {
		const [latest] = changelog('v5.0.0', `* UI refresh by @Cattn in ${pull(145)}`, [
			commit('UI refresh (#145)'),
			commit('feat: send usage counts'),
			commit('revert: feat: send usage counts'),
			commit('v5.0.0')
		]);
		assert.deepEqual(
			latest.changes.map((c) => c.text),
			['UI refresh']
		);
	});

	it('adds no direct commits to the first release', () => {
		const releases = buildChangelog({
			releases: [release('v1.0.0', `* Start by @Cattn in ${pull(1)}`)],
			commits: { '1.0.0': [commit('Start (#1)'), commit('feat: calendar view')] },
			tagDates: {}
		});
		assert.deepEqual(
			releases[0].changes.map((c) => c.text),
			['Start']
		);
	});

	it('hides a release with no real changelog', () => {
		for (const [body, commits] of [
			[`**Full Changelog**: ${repo}/compare/v5.0.0...v5.0.1`, [commit('v5.0.1')]],
			[`* Bug fixes by @Cattn in ${pull(200)}`, [commit('Bug fixes (#200)')]],
			[`* ci: fix builds by @Cattn in ${pull(201)}`, [commit('ci: fix builds (#201)')]]
		] as const) {
			const releases = changelog('v5.0.1', body, [...commits]);
			assert.ok(!releases.some((r) => r.version === '5.0.1'), body);
		}
	});

	it('takes the one-sentence description from the notes', () => {
		const [latest] = changelog(
			'v5.0.0',
			`A redesigned extension that loads faster.\n\n## What's Changed\n* UI refresh by @Cattn in ${pull(145)}`,
			[commit('UI refresh (#145)')]
		);
		assert.equal(latest.summary, 'A redesigned extension that loads faster.');
	});

	it('dates a release by its tag, in Boston', () => {
		const [latest] = changelog(
			'v5.1.0',
			`* Any color by @Griffty in ${pull(134)}`,
			[commit('Any color (#134)')],
			{ tagDates: { '5.1.0': '2026-09-23T02:56:33Z' } }
		);
		assert.equal(latest.date, '2026-09-22');
	});

	it('orders by version, not by the day GitHub published it', () => {
		const releases = buildChangelog({
			releases: [
				release('v2.0.1', `* Refresh button by @a in ${pull(87)}`, '2026-01-06T21:03:33Z'),
				release('v10.0.0', `* Big update by @a in ${pull(300)}`, '2026-01-01T00:00:00Z'),
				release('v2.0.0', `* Version two by @a in ${pull(66)}`, '2026-01-06T21:04:57Z')
			],
			commits: {},
			tagDates: {}
		});
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

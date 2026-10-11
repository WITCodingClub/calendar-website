import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as curation from '../changelog.ts';
import { buildChangelog } from '../releaseNotes.ts';
import { changelogMarkdown, markdownFor } from './pages.ts';

const origin = 'https://calendar.witcc.dev';

describe('markdownFor', () => {
	it('has a copy of the home, about, and contact pages', () => {
		for (const path of ['/', '/about', '/contact']) {
			assert.notEqual(markdownFor(path, origin), null, `${path} has no markdown copy`);
		}
	});

	it('starts each copy with front matter that has a title', () => {
		for (const path of ['/', '/about', '/contact']) {
			assert.match(markdownFor(path, origin) ?? '', /^---\ntitle: .+\n/);
		}
	});

	it('keeps the links that the page buttons open', () => {
		const home = markdownFor('/', origin) ?? '';
		assert.ok(home.includes('https://chromewebstore.google.com/detail/wit-calendar/'));

		const contact = markdownFor('/contact', origin) ?? '';
		assert.ok(contact.includes('https://discord.gg/fkeM94snmy'));
	});

	it('links agents to the API reference and llms.txt from the home copy', () => {
		const home = markdownFor('/', origin) ?? '';
		assert.ok(home.includes(`(${origin}/docs/api.md)`));
		assert.ok(home.includes(`(${origin}/llms.txt)`));
	});

	it('gives the contact copy the working email and the private security channel', () => {
		const contact = markdownFor('/contact', origin) ?? '';
		assert.ok(contact.includes('mailto:calendarwit@gmail.com'));
		assert.ok(contact.includes('/security/advisories/new'));
		assert.doesNotMatch(contact, /@calendar\.witcc\.dev/);
	});

	it('sends legal inquiries to all three legal contacts', () => {
		const contact = markdownFor('/contact', origin) ?? '';
		for (const email of ['calendarwit@gmail.com', 'lambertl@wit.edu', 'mayonej@wit.edu']) {
			assert.ok(contact.includes(`mailto:${email}`), `${email} is not a legal contact`);
		}
	});

	it('builds site links from the request origin', () => {
		const home = markdownFor('/', 'http://localhost:5173') ?? '';
		assert.ok(home.includes('(http://localhost:5173/about)'));
		assert.ok(!home.includes(`${origin}/about`));
	});

	it('has no hand-written copy of the legal pages or of unknown paths', () => {
		assert.equal(markdownFor('/privacy', origin), null);
		assert.equal(markdownFor('/tos', origin), null);
		assert.equal(markdownFor('/missing', origin), null);
		assert.equal(markdownFor('/changelog', origin), null);
	});
});

describe('changelogMarkdown', () => {
	const releases = buildChangelog(
		{
			releases: [
				{
					tag_name: 'v5.2.0',
					html_url: 'https://github.com/WITCodingClub/calendar-extension/releases/tag/v5.2.0',
					published_at: '2026-09-30T21:39:12Z',
					draft: false,
					prerelease: false,
					body:
						"## What's Changed" +
						String.fromCharCode(10) +
						'* Fix the Friends button by @Cattn in https://github.com/WITCodingClub/calendar-extension/pull/179 (closes #177)'
				}
			],
			commits: {},
			tagDates: { '5.2.0': '2026-09-30T21:38:25Z' }
		},
		curation
	);

	it('starts with front matter that has a title', () => {
		assert.match(changelogMarkdown(releases, origin), /^---\ntitle: .+\n/);
	});

	it('credits each change and links its pull request and issues', () => {
		const changelog = changelogMarkdown(releases, origin);
		assert.ok(
			changelog.includes(
				'## [v5.2.0](https://github.com/WITCodingClub/calendar-extension/releases/tag/v5.2.0) (September 30, 2026)'
			)
		);
		assert.ok(
			changelog.includes(
				'- Fix the Friends button ([@Cattn](https://github.com/Cattn), [PR #179](https://github.com/WITCodingClub/calendar-extension/pull/179), [Issue #177](https://github.com/WITCodingClub/calendar-extension/issues/177))'
			)
		);
	});

	it('links to GitHub when the releases could not be loaded', () => {
		const changelog = changelogMarkdown(null, origin);
		assert.ok(changelog.includes('could not be loaded'));
		assert.ok(changelog.includes('(https://github.com/WITCodingClub/calendar-extension/releases)'));
	});
});

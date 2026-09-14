import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { markdownFor } from './pages.ts';

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

	it('builds site links from the request origin', () => {
		const home = markdownFor('/', 'http://localhost:5173') ?? '';
		assert.ok(home.includes('(http://localhost:5173/about)'));
		assert.ok(!home.includes(`${origin}/about`));
	});

	it('has no copy of the legal pages or of unknown paths', () => {
		assert.equal(markdownFor('/privacy', origin), null);
		assert.equal(markdownFor('/tos', origin), null);
		assert.equal(markdownFor('/missing', origin), null);
	});
});

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
		const legal = contact.split('## Legal inquiries')[1]?.split('## ')[0] ?? '';
		for (const email of ['calendarwit@gmail.com', 'lambertl@wit.edu', 'mayonej@wit.edu']) {
			assert.ok(legal.includes(`mailto:${email}`), `${email} is not a legal contact`);
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
	});
});

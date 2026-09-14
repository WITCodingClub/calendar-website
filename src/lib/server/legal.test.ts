import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

// scripts/legal-markdown.py writes the copies from the rendered pages. These
// checks fail when a page changes and its copy does not. To fix a failure, run
// the script again.

const pages = ['privacy', 'tos'];
const lastUpdated = /Last updated.*?(\w+ \d{1,2}, \d{4})/s;

function read(path: string): string {
	return readFileSync(new URL(path, import.meta.url), 'utf8');
}

function pageSource(page: string): string {
	return read(`../../routes/${page}/+page.svelte`);
}

function copy(page: string): string {
	return read(`./legal/${page}.md`);
}

function plain(html: string): string {
	return html
		.replace(/<[^>]*>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ')
		.trim();
}

describe('legal markdown copies', () => {
	for (const page of pages) {
		it(`${page}: starts with front matter that has a title`, () => {
			assert.match(copy(page), /^---\ntitle: .+\n/);
		});

		it(`${page}: has the same last updated date as the page`, () => {
			const pageDate = plain(pageSource(page)).match(lastUpdated)?.[1];

			assert.ok(pageDate, 'the page has no last updated date');
			assert.equal(copy(page).match(lastUpdated)?.[1], pageDate);
		});

		it(`${page}: has every heading of the page`, () => {
			const headings = [...pageSource(page).matchAll(/<h([1-3])[^>]*>(.*?)<\/h\1>/gs)].map(
				(match) => ({ level: Number(match[1]), text: plain(match[2]) })
			);
			const markdown = copy(page);

			assert.ok(headings.length > 0, 'the page has no headings');
			for (const { level, text } of headings) {
				const line = `\n${'#'.repeat(level)} ${text}\n`;
				assert.ok(markdown.includes(line), `the copy has no heading "${text}"`);
			}
		});
	}
});

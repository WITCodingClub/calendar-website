import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { describe, it } from 'node:test';
import { FEATURES, GUIDES, START_GUIDE, guideFor, guidePath, neighborsOf } from './guides.ts';

describe('GUIDES', () => {
	it('gives each guide a unique slug that is safe in a URL', () => {
		const slugs = GUIDES.map((guide) => guide.slug);
		assert.equal(new Set(slugs).size, slugs.length);
		for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
	});

	it('has a page for each guide', () => {
		for (const guide of GUIDES) {
			const page = `src/routes${guidePath(guide.slug)}/+page.svelte`;
			assert.ok(existsSync(page), `${guide.slug} has no ${page}`);
		}
	});

	it('lists every guide page, so each page gets its title', () => {
		const pages = readdirSync('src/routes/guides', { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name);
		for (const slug of pages)
			assert.ok(guideFor(slug), `src/routes/guides/${slug} is not in GUIDES`);
	});

	it('starts with the getting started guide', () => {
		assert.equal(GUIDES[0].slug, 'getting-started');
	});
});

describe('FEATURES', () => {
	it('links each feature to a guide that exists', () => {
		for (const feature of FEATURES) {
			if (feature.guide)
				assert.ok(guideFor(feature.guide), `${feature.name} links to a missing guide`);
		}
	});

	it('has one feature to start with, and it links to the getting started guide', () => {
		const start = FEATURES.filter((feature) => feature.startHere);
		assert.equal(start.length, 1);
		assert.equal(start[0].guide, START_GUIDE.slug);
		assert.equal(START_GUIDE.slug, 'getting-started');
	});

	it('gives each guide one feature tile', () => {
		const guides = FEATURES.flatMap((feature) => (feature.guide ? [feature.guide] : []));
		assert.equal(new Set(guides).size, guides.length);
	});

	it('has a guide for the MCP server', () => {
		assert.ok(FEATURES.some((feature) => feature.guide === 'mcp'));
	});
});

describe('neighborsOf', () => {
	it('has no previous guide for the first guide and no next guide for the last', () => {
		assert.equal(neighborsOf(GUIDES[0].slug).previous, null);
		assert.equal(neighborsOf(GUIDES[GUIDES.length - 1].slug).next, null);
	});

	it('links the first guide to the second', () => {
		assert.equal(neighborsOf(GUIDES[0].slug).next, GUIDES[1]);
		assert.equal(neighborsOf(GUIDES[1].slug).previous, GUIDES[0]);
	});

	it('has no neighbors for a guide that does not exist', () => {
		assert.deepEqual(neighborsOf('missing'), { previous: null, next: null });
	});
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { estimateTokens, prefersMarkdown } from './negotiate.ts';

describe('prefersMarkdown', () => {
	it('returns markdown to a client that asks for markdown only', () => {
		assert.equal(prefersMarkdown('text/markdown'), true);
	});

	it('returns markdown to an agent that also accepts anything', () => {
		assert.equal(prefersMarkdown('text/markdown, text/html, */*'), true);
	});

	it('returns markdown when markdown has the higher quality', () => {
		assert.equal(prefersMarkdown('text/html;q=0.5, text/markdown'), true);
	});

	it('returns HTML to a browser', () => {
		const accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
		assert.equal(prefersMarkdown(accept), false);
	});

	it('returns HTML when HTML has the higher quality', () => {
		assert.equal(prefersMarkdown('text/html, text/markdown;q=0.5'), false);
	});

	it('returns HTML when HTML comes first at the same quality', () => {
		assert.equal(prefersMarkdown('text/html, text/markdown'), false);
	});

	it('returns HTML when the client refuses markdown', () => {
		assert.equal(prefersMarkdown('text/markdown;q=0, */*'), false);
	});

	it('returns HTML when the header is missing or empty', () => {
		assert.equal(prefersMarkdown(null), false);
		assert.equal(prefersMarkdown(''), false);
	});

	it('returns HTML for a wildcard only', () => {
		assert.equal(prefersMarkdown('*/*'), false);
	});

	it('ignores case and spaces', () => {
		assert.equal(prefersMarkdown(' Text/Markdown ; q=1 '), true);
	});

	it('treats a q value that is not a number as a refusal', () => {
		assert.equal(prefersMarkdown('text/markdown;q=abc, text/html;q=0.1'), false);
	});
});

describe('estimateTokens', () => {
	it('counts about four characters for each token', () => {
		assert.equal(estimateTokens(''), 0);
		assert.equal(estimateTokens('abcd'), 1);
		assert.equal(estimateTokens('abcde'), 2);
	});
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DOCS, docFor, docPath, sourcePath } from './docs.ts';
import { metaFor } from './site.ts';

describe('DOCS', () => {
	it('has the API and MCP references', () => {
		assert.deepEqual(
			DOCS.map((doc) => doc.slug),
			['api', 'mcp']
		);
		assert.equal(docFor('nope'), undefined);
	});

	it('reads each source from the backend copy next to the page', () => {
		assert.equal(docPath('api'), '/docs/api');
		assert.equal(sourcePath('api'), '/docs/api.md');
	});

	it('gives each page a title and description', () => {
		for (const doc of DOCS) {
			assert.equal(metaFor(docPath(doc.slug))?.description, doc.description);
		}
	});
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { headingId, renderDoc } from './renderDoc.ts';

describe('headingId', () => {
	it('matches the ids the Rails page gave its headings', () => {
		assert.equal(headingId('Cost and limits'), 'cost-and-limits');
		assert.equal(headingId('Which grain do I want?'), 'which-grain-do-i-want');
		assert.equal(headingId('`Link` header'), 'link-header');
	});
});

describe('renderDoc', () => {
	const doc = renderDoc(`# The title

Intro with a [link](#limits).

## Limits

### Rate limit headers

| Header | Meaning |
| --- | --- |
| \`RateLimit\` | The limit |

\`\`\`sh
curl https://calendar.witcc.dev/api/terms
\`\`\`

\`\`\`mermaid
flowchart LR
  A --> B
\`\`\`

<script>alert(1)</script>
`);

	it('takes the first level-one heading as the title, not the body', () => {
		assert.equal(doc.title, 'The title');
		assert.doesNotMatch(doc.html, /<h1/);
	});

	it('gives each heading an id and lists the level-two headings', () => {
		assert.match(doc.html, /<h2 id="limits">Limits<\/h2>/);
		assert.match(doc.html, /<h3 id="rate-limit-headers">/);
		assert.deepEqual(doc.headings, [{ id: 'limits', text: 'Limits' }]);
	});

	it('puts each table in a focusable scroll box', () => {
		assert.match(doc.html, /<div class="docs-table" tabindex="0"><table>/);
		assert.match(doc.html, /<\/table><\/div>/);
	});

	it('makes code blocks focusable and keeps mermaid source for the page to draw', () => {
		assert.match(doc.html, /<pre tabindex="0"><code class="language-sh">curl/);
		assert.match(doc.html, /<pre class="mermaid">flowchart LR\n {2}A --&gt; B<\/pre>/);
	});

	it('escapes raw HTML in the source', () => {
		assert.doesNotMatch(doc.html, /<script>/);
		assert.match(doc.html, /&lt;script&gt;/);
	});

	it('renders the real backend sources when calendar-backend is next to this repo', (t) => {
		for (const file of ['public-catalog-api.md', 'mcp.md']) {
			let source: string;
			try {
				source = readFileSync(new URL(`../../../../backend/docs/${file}`, import.meta.url), 'utf8');
			} catch {
				t.skip('calendar-backend is not checked out next to this repo');
				return;
			}
			const rendered = renderDoc(source);
			assert.ok(rendered.title, `${file} has a title`);
			assert.ok(rendered.headings.length > 0, `${file} has sections`);
		}
	});
});

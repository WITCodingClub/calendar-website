import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
	MAINTAINER_EMAILS,
	PGP_KEY,
	REPORT_LINKS,
	TEAM_EMAIL,
	securityMarkdown
} from './security.ts';
import { markdownFor } from './server/pages.ts';

const origin = 'https://calendar.witcc.dev';

describe('securityMarkdown', () => {
	const copy = securityMarkdown(origin);

	it('is the copy that agents get from /security', () => {
		assert.equal(markdownFor('/security', origin), copy);
	});

	it('starts with front matter that has a title', () => {
		assert.match(copy, /^---\ntitle: .+\n/);
	});

	it('lists GitHub private reporting first, then the email contacts', () => {
		const positions = [REPORT_LINKS[0].href, TEAM_EMAIL, ...MAINTAINER_EMAILS].map((text) =>
			copy.indexOf(text)
		);

		assert.ok(
			positions.every((position) => position >= 0),
			'a contact is missing'
		);
		assert.deepEqual(
			positions,
			[...positions].sort((a, b) => a - b)
		);
	});

	it('tells a reporter that org membership is not needed', () => {
		assert.ok(copy.includes('You do not need to be a member of the WIT Coding Club.'));
	});

	it('names the encryption key and its fingerprint', () => {
		assert.ok(copy.includes(PGP_KEY.url));
		assert.ok(copy.includes(PGP_KEY.fingerprint));
	});

	it('gives rules for automated tools, with links on the request origin', () => {
		const local = securityMarkdown('http://localhost:5173');

		assert.ok(local.includes('## Automated tools and AI agents'));
		assert.ok(local.includes('(http://localhost:5173/llms.txt)'));
		assert.ok(!local.includes(`${origin}/llms.txt`));
	});
});

describe('/security page', () => {
	const source = readFileSync(new URL('../routes/security/+page.svelte', import.meta.url), 'utf8');

	it('reads the contacts from the shared data, not from its own copy', () => {
		assert.ok(source.includes("from '$lib/security'"));
		for (const email of [TEAM_EMAIL, ...MAINTAINER_EMAILS]) {
			assert.ok(!source.includes(email), `the page hard-codes ${email}`);
		}
	});
});

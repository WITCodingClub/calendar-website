import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { directCommitChanges, emailLogins, ignoredCommits } from './changelog.ts';

describe('changelog curation', () => {
	it('links at least one commit for every direct commit change', () => {
		for (const change of directCommitChanges) {
			assert.ok(change.commits.length, `v${change.version}: "${change.text}" has no commit`);
		}
	});

	it('uses short commit hashes', () => {
		const hashes = [
			...directCommitChanges.flatMap((change) => change.commits),
			...Object.keys(ignoredCommits)
		];
		for (const hash of hashes) assert.match(hash, /^[0-9a-f]{7}$/, hash);
	});

	it('does not both describe and ignore a commit', () => {
		const described = new Set(directCommitChanges.flatMap((change) => change.commits));
		for (const hash of Object.keys(ignoredCommits)) assert.ok(!described.has(hash), hash);
	});

	it('keys emails in lower case', () => {
		for (const email of Object.keys(emailLogins)) assert.equal(email, email.toLowerCase());
	});
});

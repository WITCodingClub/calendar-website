import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { releases } from './changelog.ts';

describe('releases', () => {
	it('links a pull request or a commit for every change', () => {
		for (const release of releases) {
			for (const change of release.changes) {
				assert.ok(
					change.pr || change.commits?.length,
					`v${release.version}: "${change.text}" has no pull request or commit`
				);
			}
		}
	});

	it('uses short commit hashes', () => {
		for (const release of releases) {
			for (const commit of release.changes.flatMap((change) => change.commits ?? [])) {
				assert.match(commit, /^[0-9a-f]{7}$/, `v${release.version}: ${commit}`);
			}
		}
	});
});

// Builds the changelog from GitHub. For each release it uses:
//
// - The release notes. Each change is a bullet in GitHub's own format, the
//   one "Generate release notes" writes:
//
//     * Fix the Friends button by @Cattn in https://github.com/.../pull/179
//
//   A bullet can name more than one contributor ("by @a and @b"), link
//   commits instead of a pull request ("in https://.../commit/abc1234, ..."),
//   and end with the issues it closes ("(closes #177)"). A bullet in another
//   format is shown as plain text.
//   The text before the first heading is the release's one-sentence
//   description.
// - The commits between its tag and the previous release's tag. Their authors
//   and co-authors are credited on the pull requests and commits that the
//   notes link. A pull request with no commit in the range is not in this
//   release, so its bullet is dropped. A commit pushed straight to main that
//   the notes do not link is added with its commit message, unless the notes
//   hide it with a comment that GitHub does not show:
//
//     <!-- changelog: hide 2abb382 b42c008 -->
//
// - The date of its tag.
//
// Then every change that tells a student nothing is dropped (see
// isRealChange), and every release left with no changes is hidden.
//
// This file imports nothing, so node --test can load it directly.

export const REPO_URL = 'https://github.com/WITCodingClub/calendar-extension';
export const RELEASES_URL = `${REPO_URL}/releases`;

export type ChangeLink = { label: string; url: string };

export type Change = {
	text: string;
	// GitHub usernames, without the @.
	contributors: string[];
	links: ChangeLink[];
};

export type Release = {
	version: string;
	url: string;
	// YYYY-MM-DD, in Boston time: the day the release was tagged.
	date: string;
	summary?: string;
	changes: Change[];
};

// The fields of a release in the GitHub REST API that the changelog uses.
// See https://docs.github.com/en/rest/releases/releases#list-releases
export type GitHubRelease = {
	tag_name: string;
	html_url: string;
	published_at: string | null;
	draft: boolean;
	prerelease: boolean;
	body: string | null;
};

// A commit, from the compare or list commits endpoints.
// See https://docs.github.com/en/rest/commits/commits
export type GitHubCommit = {
	sha: string;
	commit: { message: string; author: { email: string } | null };
	author: { login: string } | null;
	parents: { sha: string }[];
};

// Everything the changelog needs from GitHub, keyed by version ("5.2.0").
export type GitHubData = {
	releases: GitHubRelease[];
	// The commits after the previous release, up to and including this one.
	// For the first release, every commit up to it. Missing when GitHub could
	// not be reached.
	commits: Record<string, GitHubCommit[] | undefined>;
	// When each tag was made, as ISO 8601.
	tagDates: Record<string, string | undefined>;
};

export function releaseUrl(version: string): string {
	return `${RELEASES_URL}/tag/v${version}`;
}

export function profileUrl(username: string): string {
	return `https://github.com/${username}`;
}

function commitLink(sha: string): ChangeLink {
	return { label: sha.slice(0, 7), url: `${REPO_URL}/commit/${sha.slice(0, 7)}` };
}

function issueLink(issue: number | string): ChangeLink {
	return { label: `Issue #${issue}`, url: `${REPO_URL}/issues/${issue}` };
}

// --- Release notes ---------------------------------------------------------

const BULLET = /^[*-]\s+(.+)$/;
const USER = String.raw`@[A-Za-z0-9-]+(?:\[bot\])?`;
const CREDIT = new RegExp(
	String.raw`^(.*)\s+by\s+(${USER}(?:(?:,\s*and\s+|,\s*|\s+and\s+)${USER})*)\s+in\s+(.+)$`
);
const GITHUB_LINK = /https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/(pull|issues|commit)\/(\w+)/g;
const CLOSES = /\(closes\s+([^)]*)\)/i;

// Bots, and the accounts of AI tools, are not credited.
function isPerson(username: string): boolean {
	return !/\[bot\]$/i.test(username) && !/^(copilot|imgbotapp)$/i.test(username);
}

function linkFor(kind: string, id: string, url: string): ChangeLink {
	if (kind === 'pull') return { label: `PR #${id}`, url };
	if (kind === 'issues') return { label: `Issue #${id}`, url };
	return commitLink(id);
}

export function parseChange(line: string): Change {
	const credit = CREDIT.exec(line);
	if (!credit) return { text: line.trim(), contributors: [], links: [] };

	const [, text, users, refs] = credit;
	const contributors = (users.match(new RegExp(USER, 'g')) ?? [])
		.map((user) => user.slice(1))
		.filter(isPerson);

	const links = [...refs.matchAll(GITHUB_LINK)].map(([url, kind, id]) => linkFor(kind, id, url));
	for (const [, issue] of CLOSES.exec(refs)?.[1].matchAll(/#(\d+)/g) ?? []) {
		links.push(issueLink(issue));
	}

	return { text: text.trim(), contributors, links };
}

const HIDE = /<!--\s*changelog:\s*hide\b([\s\S]*?)-->/gi;

// The summary is the text before the first heading. The changes are the
// bullets, except the ones under "New Contributors". The hidden commits are
// the short hashes in "<!-- changelog: hide ... -->" comments.
export function parseNotes(body: string): {
	summary?: string;
	changes: Change[];
	hidden: string[];
} {
	const summary: string[] = [];
	const changes: Change[] = [];
	const hidden = [...body.matchAll(HIDE)].flatMap(
		([, hashes]) => hashes.match(/\b[0-9a-f]{7,40}\b/gi)?.map((hash) => hash.slice(0, 7)) ?? []
	);
	let heading: string | undefined;

	// HTML comments are not shown on GitHub, so they are not part of the notes.
	for (const raw of body.replace(/<!--[\s\S]*?-->/g, '').split(/\r?\n/)) {
		const line = raw.trim();
		if (!line || line.startsWith('**Full Changelog**')) continue;

		if (line.startsWith('#')) {
			heading = line.replace(/^#+\s*/, '');
			continue;
		}

		const bullet = BULLET.exec(line);
		if (bullet) {
			if (!/new contributors/i.test(heading ?? '')) changes.push(parseChange(bullet[1]));
		} else if (heading === undefined) {
			summary.push(line);
		}
	}

	return { summary: summary.length ? summary.join(' ') : undefined, changes, hidden };
}

// --- Commits -----------------------------------------------------------------

function subject(commit: GitHubCommit): string {
	return commit.commit.message.split('\n')[0].trim();
}

// The pull request a commit belongs to: "Title (#179)" for a squash merge, or
// "Merge pull request #179 from ..." for a merge commit.
function pullRequestOf(commit: GitHubCommit): number | undefined {
	const match =
		/\(#(\d+)\)\s*$/.exec(subject(commit)) ?? /^Merge pull request #(\d+)/.exec(subject(commit));
	return match ? Number(match[1]) : undefined;
}

// Finds the GitHub account behind a commit email: the account GitHub links to
// that email on any commit, or the name in a noreply address. A co-author with
// neither is not credited, so credit them in the notes.
class Accounts {
	private byEmail = new Map<string, string>();

	constructor(commits: GitHubCommit[]) {
		for (const commit of commits) {
			const email = commit.commit.author?.email.toLowerCase();
			if (email && commit.author?.login && !this.byEmail.has(email)) {
				this.byEmail.set(email, commit.author.login);
			}
		}
	}

	login(email: string): string | undefined {
		const lower = email.toLowerCase();
		// "12345+name@users.noreply.github.com" or "name@users.noreply.github.com"
		const noreply = /^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/.exec(lower);
		return (
			this.byEmail.get(lower) ?? (noreply ? email.split('@')[0].replace(/^\d+\+/, '') : undefined)
		);
	}

	// The commit's author, then its co-authors.
	people(commit: GitHubCommit): string[] {
		const author =
			commit.author?.login ??
			(commit.commit.author ? this.login(commit.commit.author.email) : undefined);
		const coAuthors = [...commit.commit.message.matchAll(/^co-authored-by:.*<([^>]+)>/gim)].map(
			([, email]) => this.login(email)
		);
		return [author, ...coAuthors].filter((login): login is string => !!login && isPerson(login));
	}
}

// One entry per person, in the order they first appear.
function unique(usernames: string[]): string[] {
	const seen = new Set<string>();
	return usernames.filter((username) => {
		const key = username.toLowerCase();
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

// Commits that undo each other: a revert, and the commit it reverts.
function revertedPairs(commits: GitHubCommit[]): Set<string> {
	const gone = new Set<string>();
	for (const commit of commits) {
		const reverts =
			/This reverts commit ([0-9a-f]{7,40})/.exec(commit.commit.message)?.[1] ??
			commits.find((other) => {
				const title = /^revert:?\s*"?(.+?)"?$/i.exec(subject(commit))?.[1];
				return other !== commit && title !== undefined && subject(other) === title;
			})?.sha;
		if (!reverts) continue;
		const original = commits.find((other) => other.sha.startsWith(reverts));
		if (original) {
			gone.add(commit.sha);
			gone.add(original.sha);
		}
	}
	return gone;
}

// The commits of each pull request, including the branch commits that a
// merge commit brings in.
function commitsByPullRequest(commits: GitHubCommit[]): Map<number, GitHubCommit[]> {
	const bySha = new Map(commits.map((commit) => [commit.sha, commit]));
	const groups = new Map<number, GitHubCommit[]>();
	const add = (pr: number, commit: GitHubCommit) =>
		groups.set(pr, [...(groups.get(pr) ?? []), commit]);

	for (const commit of commits) {
		const pr = pullRequestOf(commit);
		if (pr === undefined) continue;
		add(pr, commit);
		// A merge commit: walk its branch, back to where it left main.
		if (commit.parents.length > 1) {
			const main = new Set<string>();
			for (let sha: string | undefined = commit.parents[0].sha; sha && bySha.has(sha);) {
				main.add(sha);
				sha = bySha.get(sha)?.parents[0]?.sha;
			}
			const stack = [commit.parents[1].sha];
			while (stack.length) {
				const branch = bySha.get(stack.pop() as string);
				if (!branch || main.has(branch.sha) || groups.get(pr)?.includes(branch)) continue;
				add(pr, branch);
				stack.push(...branch.parents.map((parent) => parent.sha));
			}
		}
	}
	return groups;
}

// --- No real changelog ---------------------------------------------------------

// Changes that tell a student nothing. Each pattern is matched against the
// whole change, in lower case, with its punctuation removed.
const NOT_REAL = [
	// "Bug fixes", "Small fixes and improvements", "Minor tweaks", "Fixes"
	/^(small|minor|various|some|a few|general)?\s*(bug\s*)?(fix|fixes|fixed|bugfix|bugfixes|tweaks|improvements|changes|updates|cleanup)(\s+and\s+(small\s+|minor\s+)?(improvements|fixes|tweaks|changes))?$/,
	// "Fixed issues in the Firefox version", "Fixed the remaining Firefox issues"
	/^fix(ed|es)?\s+(the\s+|some\s+|a\s+few\s+)?(remaining\s+|other\s+|more\s+)?(\w+\s+)?(issues|bugs|problems)(\s+in\s+the\s+\w+\s+version)?$/,
	// "No changes you can see", "No user-facing changes"
	/^no\s+((user\s*facing|visible)\s+)?changes\b/,
	// "The same code as 2.1.1", "Only the version number changed", "v3.0.1"
	/\bsame code as\b/,
	/\bonly the version( number)? changed\b/,
	/^(bump|bumped|update|updated)\s+(the\s+)?version\b/,
	/^v?\d+(\s\d+){0,2}$/,
	// Work on the project rather than the extension, in GitHub's titles:
	// "Update README", "bump adapter-extension", "Upgrade actions/checkout"
	/\breadme\b/,
	/^(bump|upgrade|update)\s+\S*(adapter|actions|deps|dependencies)\b/
];

// A conventional commit title for work on the project, such as
// "ci: run npm run check" or "chore(deps): bump vite". Matched against the
// text as written, since it needs the colon.
const PROJECT_WORK = /^(ci|chore|build|docs|test|refactor|style|revert)(\([^)]*\))?!?:/i;

export function isRealChange(change: Change): boolean {
	if (PROJECT_WORK.test(change.text.trim())) return false;
	const text = change.text
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s]/gu, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	return text.length > 0 && !NOT_REAL.some((pattern) => pattern.test(text));
}

// --- The changelog ---------------------------------------------------------------

// Compares "5.10.0" and "5.9.1" by number. Negative when a is older.
export function compareVersions(a: string, b: string): number {
	const left = a.split('.').map(Number);
	const right = b.split('.').map(Number);
	for (let i = 0; i < Math.max(left.length, right.length); i++) {
		const diff = (left[i] ?? 0) - (right[i] ?? 0);
		if (diff) return diff;
	}
	return 0;
}

export function versionOf(tag: string): string {
	return tag.replace(/^v/, '');
}

// The published releases, oldest version first. Not by date: v1.0.0, v2.0.0,
// and v2.0.1 were all published on GitHub on the same day, out of order.
export function publishedReleases(releases: GitHubRelease[]): GitHubRelease[] {
	return releases
		.filter((release) => !release.draft && !release.prerelease && release.published_at)
		.sort((a, b) => compareVersions(versionOf(a.tag_name), versionOf(b.tag_name)));
}

function buildRelease(
	release: GitHubRelease,
	first: boolean,
	commits: GitHubCommit[] | undefined,
	tagDate: string | undefined,
	accounts: Accounts
): Release {
	const notes = parseNotes(release.body ?? '');
	const groups = commits ? commitsByPullRequest(commits) : new Map<number, GitHubCommit[]>();
	const find = (short: string) => commits?.find((commit) => commit.sha.startsWith(short));
	const linkedCommits = (change: Change) =>
		change.links.filter((link) => /^[0-9a-f]{7}$/.test(link.label)).map((link) => link.label);

	// The bullets in the notes, crediting everyone on their commits.
	const fromNotes = notes.changes.flatMap((change) => {
		const pr = Number(change.links.find((link) => link.label.startsWith('PR #'))?.label.slice(4));
		// Listed in the notes, but none of its commits are in this release.
		if (pr && commits && !groups.has(pr)) return [];
		const own = pr
			? (groups.get(pr) ?? [])
			: linkedCommits(change).flatMap((short) => find(short) ?? []);
		const people = own.flatMap((commit) => accounts.people(commit));
		return [{ ...change, contributors: unique([...change.contributors, ...people]) }];
	});

	// Commits pushed straight to main that the notes neither link nor hide are
	// shown with their commit messages. Not for the first release: every commit
	// before it is the work that built the extension.
	const inPullRequests = new Set([...groups.values()].flat().map((commit) => commit.sha));
	const reverted = commits ? revertedPairs(commits) : new Set<string>();
	const covered = new Set([...notes.hidden, ...notes.changes.flatMap(linkedCommits)]);
	const direct = first
		? []
		: (commits ?? [])
				.filter(
					(commit) =>
						commit.parents.length < 2 &&
						!inPullRequests.has(commit.sha) &&
						!reverted.has(commit.sha) &&
						!covered.has(commit.sha.slice(0, 7))
				)
				.reverse()
				.map((commit) => ({
					text: subject(commit),
					contributors: unique(accounts.people(commit)),
					links: [commitLink(commit.sha)]
				}));

	return {
		version: versionOf(release.tag_name),
		url: release.html_url,
		date: bostonDate(tagDate ?? (release.published_at as string)),
		summary: notes.summary,
		changes: [...fromNotes, ...direct].filter(isRealChange)
	};
}

// Newest version first. A release with no real changes is left out.
export function buildChangelog(data: GitHubData): Release[] {
	const accounts = new Accounts(Object.values(data.commits).flatMap((commits) => commits ?? []));
	return publishedReleases(data.releases)
		.map((release, i) => {
			const version = versionOf(release.tag_name);
			return buildRelease(
				release,
				i === 0,
				data.commits[version],
				data.tagDates[version],
				accounts
			);
		})
		.filter((release) => release.changes.length > 0)
		.reverse();
}

// --- Dates ----------------------------------------------------------------------

// "2026-09-30", the day an ISO 8601 time falls on in Boston.
export function bostonDate(iso: string): string {
	return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

// "September 30, 2026", from "2026-09-30". Formatted in UTC so it does not
// move a day in time zones west of UTC.
export function formatReleaseDate(date: string): string {
	return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}

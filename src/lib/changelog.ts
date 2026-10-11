// Curation for the changelog. GitHub is the source of what changed in each
// release: its release notes, and the commits between each tag and the one
// before it. This file only adds what GitHub cannot say well:
//
// - directCommitChanges: what a commit pushed straight to main changed, in
//   words a student understands. One change can cover several commits. A
//   direct commit that is not here or in ignoredCommits is shown with its
//   commit message.
// - releaseSummaries: a one-sentence description of each major release.
// - ignoredCommits and ignoredPullRequests: work on the project, not the
//   extension, that the "no real changelog" rules in releaseNotes.ts do not
//   catch.
// - emailLogins: the GitHub account behind a commit email that GitHub does not
//   link to an account, so that co-authors get credit.
// - renamedAccounts: the current name of a renamed GitHub account.
//
// Contributors here are GitHub usernames. The commits' authors and co-authors
// are added to them.
//
// This file imports nothing, so node --test can load it directly.

export type DirectCommitChange = {
	// The release that the commits are in.
	version: string;
	text: string;
	contributors: string[];
	// Short hashes.
	commits: string[];
	// Issues in the extension repository that the change closes.
	issues?: number[];
};

export const directCommitChanges: DirectCommitChange[] = [
	{
		version: '5.1.0',
		text: 'A redesigned home screen and usage counts screen.',
		contributors: ['Cattn'],
		commits: ['b59aad8']
	},
	{
		version: '5.1.0',
		text: 'The extension now works with this website. The website can tell when you have the extension installed, and the store tab closes for you after you install it from here. This works in Chrome and Firefox.',
		contributors: ['Cattn'],
		commits: ['675e08d', '881cb14', 'a78d1a5', '330656a', 'ebc41bf', 'e625eac']
	},
	{
		version: '5.1.0',
		text: 'When you show past terms, the extension opens your current term, not the oldest one.',
		contributors: ['Cattn'],
		commits: ['a246868'],
		issues: [161]
	},
	{
		version: '5.1.0',
		text: 'Fixed the alignment of the chips in class descriptions.',
		contributors: ['Cattn'],
		commits: ['8fd756f'],
		issues: [160]
	},
	{
		version: '5.0.1',
		text: 'No changes you can see. The code was reorganized.',
		contributors: ['Cattn'],
		commits: ['d4e3232']
	},
	{
		version: '5.0.0',
		text: 'If you use Google Calendar, your calendar link is now in Settings.',
		contributors: ['Cattn'],
		commits: ['2d6f5d6'],
		issues: [129]
	},
	{
		version: '5.0.0',
		text: 'When you sign in again with Google, you skip the WIT Self Service step.',
		contributors: ['Cattn'],
		commits: ['243b92f'],
		issues: [141]
	},
	{
		version: '4.0.1',
		text: 'Term names fit in narrow windows.',
		contributors: ['Cattn'],
		commits: ['d42c2e4'],
		issues: [126]
	},
	{
		version: '3.1.2',
		text: 'Fixed the remaining Firefox issues.',
		contributors: ['Cattn'],
		commits: ['01ed179']
	},
	{
		version: '3.1.1',
		text: 'Fixed issues in the Firefox version.',
		contributors: ['Cattn'],
		commits: ['151af80']
	},
	{
		version: '3.1.0',
		text: 'Fixed the Google sign-in popup not showing on some Linux distributions.',
		contributors: ['Cattn'],
		commits: ['d2c7288']
	},
	{
		version: '3.0.1',
		text: 'Your class colors and titles no longer reset when your schedule updates.',
		contributors: ['Cattn'],
		commits: ['617545e']
	},
	{
		version: '3.0.1',
		text: 'Study Day events now use the university events color you picked.',
		contributors: ['jaspermayone'],
		commits: ['9522531']
	},
	{
		version: '2.1.3',
		text: 'No changes from 2.1.2. Only the version number changed.',
		contributors: ['Cattn'],
		commits: ['1ea7242']
	},
	{
		version: '2.1.1',
		text: 'A "Show Historic Terms" setting, to see past terms next to your current schedule.',
		contributors: ['jaspermayone'],
		commits: ['40b5604']
	},
	{
		version: '2.1.1',
		text: 'Your terms are saved to your account, so they come back on a new device.',
		contributors: ['jaspermayone'],
		commits: ['455352f']
	},
	{
		version: '2.1.1',
		text: 'Settings warns you when a connected Google account needs you to sign in again, with a button to do it.',
		contributors: ['jaspermayone'],
		commits: ['5a8efe4']
	},
	{
		version: '2.1.1',
		text: 'If you are not signed in to WIT Self Service, the extension says so and links to it. It also stops waiting if the page does not load.',
		contributors: ['jaspermayone'],
		commits: ['3cea571']
	},
	{
		version: '2.1.1',
		text: 'The "Clear data" button in Settings is available to everyone.',
		contributors: ['Cattn'],
		commits: ['27908d1']
	},
	{
		version: '2.0.0',
		text: 'Calendar links move to the new server address on their own.',
		contributors: ['jaspermayone'],
		commits: ['b5e18d8']
	},
	{
		version: '2.0.0',
		text: 'The extension asks for fewer permissions.',
		contributors: ['jaspermayone'],
		commits: ['7f1b898']
	},
	{
		version: '1.0.0',
		text: 'Sign in, and the extension imports your class schedule from WIT Self Service.',
		contributors: ['Cattn'],
		commits: ['b472e8f', '11820a9', 'c9a11b1', '5efec33']
	},
	{
		version: '1.0.0',
		text: 'A calendar view of your week, with a help page and light and dark modes.',
		contributors: ['Cattn'],
		commits: ['1d7128e', '2a25fd7', '7423a41']
	},
	{
		version: '1.0.0',
		text: 'Sync to Google Calendar, or copy a calendar link for Outlook, Apple Calendar, or any other calendar app.',
		contributors: ['Cattn'],
		commits: ['ae14a8b', '3d251d9', 'c337d9e']
	},
	{
		version: '1.0.0',
		text: 'Edit each class: its title, with templates, its color, and its reminders.',
		contributors: ['Cattn'],
		commits: ['a9adf3a', '35fbd3a', '137f50e', '987506b', 'e77efda']
	},
	{
		version: '1.0.0',
		text: 'Settings for your default colors and the term to show.',
		contributors: ['Cattn'],
		commits: ['e78e227', 'd685cba', '20b0ea4', 'da3327e']
	}
];

// Version: one sentence on what a major release brings, shown under its
// heading. It is used in place of any summary in the GitHub release notes.
export const releaseSummaries: Record<string, string> = {
	'5.0.0': 'A redesigned extension that loads faster.',
	'4.0.0': 'Sign in with your WIT Google account, or with a passkey.',
	'3.1.0': 'WIT-Calendar is now on Firefox.',
	'3.0.0': 'Introducing Friends.',
	'2.0.0': 'More control over notifications, accounts, and university events.',
	'1.0.0': 'The first stable release.'
};

// Short hash: why it is not in the changelog.
export const ignoredCommits: Record<string, string> = {
	'8bc88b0': 'Version bump',
	'2dc3306': 'Version bump and release workflow',
	e1d46ca: 'Fixes a typo in a change from the same release',
	'33fa527': 'Removes a code comment',
	'2abb382': 'Moves to the new server address',
	b42c008: 'Moves to the production server, and updates dependencies',
	'7d77adf': 'Manifest fix for the build',
	'2a6f618': 'Moves back to the production server',
	'824fcc6': 'Pins dependency versions',
	f532642: 'Version bump',
	f446f26: 'Fixes the developer environment switcher',
	bbfbf4a: 'Fixes build errors',
	cb1b317: 'Build changes',
	e0cf3e9: 'Build changes',
	'4a236eb': 'Build scripts',
	'1bdd885': 'Build changes'
};

// Pull request: why it is not in the changelog.
export const ignoredPullRequests: Record<number, string> = {
	9: 'The list view it changed was removed before v1.0.0',
	10: 'Internal types',
	20: 'Beta access check, removed for the stable release',
	61: 'Image compression by ImgBot',
	65: 'Merges the beta work for the stable release',
	72: 'Production server address and manifest',
	75: 'Feature flag internals'
};

// Old GitHub username: the account's name now. Older release notes use the old
// name, which another account could take.
export const renamedAccounts: Record<string, string> = {
	miretskyd: 'miretskydatwit'
};

// Lower-case commit email: GitHub username.
export const emailLogins: Record<string, string> = {
	'logan@cattn.dev': 'Cattn',
	'thecrazykid2121@gmail.com': 'Cattn',
	'mayonej@wit.edu': 'jaspermayone',
	'me@jaspermayone.com': 'jaspermayone',
	'miretskyd@wit.edu': 'miretskydatwit',
	'kotelyakvv@gmail.com': 'Griffty'
};

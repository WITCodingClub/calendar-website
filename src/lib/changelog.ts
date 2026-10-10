// The extension's release history, for the changelog page and its markdown
// copy. It is written for students, from the commits between each pair of
// tags in https://github.com/WITCodingClub/calendar-extension, and from the
// pull requests and issues they link to. That covers the commits pushed
// straight to main, which the GitHub release notes leave out. Internal
// changes, such as CI, build scripts, and refactors, are left out.
//
// Add a new release to the top. Dates are in Boston time. Contributors are
// GitHub usernames: the author of the pull request or commit, then its
// co-authors. Bots are left out.
//
// This file imports nothing, so node --test can load it directly.

export const REPO_URL = 'https://github.com/WITCodingClub/calendar-extension';
export const RELEASES_URL = `${REPO_URL}/releases`;

export type Change = {
	text: string;
	contributors: string[];
	// The pull request that made the change.
	pr?: number;
	// Issues in the extension repository that the change closes.
	issues?: number[];
	// The commits that made the change, when it has no pull request.
	commits?: string[];
};

export type Release = {
	version: string;
	// YYYY-MM-DD
	date: string;
	summary?: string;
	changes: Change[];
};

export const releases: Release[] = [
	{
		version: '5.2.0',
		date: '2026-09-30',
		changes: [
			{
				text: 'The extension works better in a full browser tab, and you can move any page from the sidebar into its own tab.',
				contributors: ['Cattn'],
				pr: 178,
				issues: [174]
			},
			{
				text: 'In Friends, the add button now says "Hide" while the add-friend menu is open, and the menu opens by itself only when someone sends you a request.',
				contributors: ['Cattn'],
				pr: 179,
				issues: [177]
			},
			{
				text: 'Fixed the dropdown arrows not showing in Firefox.',
				contributors: ['Cattn'],
				pr: 176,
				issues: [175]
			}
		]
	},
	{
		version: '5.1.0',
		date: '2026-09-22',
		changes: [
			{
				text: 'Pick any color for a class with the new color picker in the class editor.',
				contributors: ['Griffty', 'jaspermayone'],
				pr: 134,
				issues: [120]
			},
			{
				text: 'Choose your reminders for university events in Settings.',
				contributors: ['Cattn'],
				pr: 163,
				issues: [123]
			},
			{
				text: 'A redesigned home screen and usage counts screen.',
				contributors: ['Cattn'],
				commits: ['b59aad8']
			},
			{
				text: 'The extension now works with this website. The website can tell when you have the extension installed, and the store tab closes for you after you install it from here. This works in Chrome and Firefox.',
				contributors: ['Cattn'],
				commits: ['675e08d']
			},
			{
				text: 'When you show past terms, the extension opens your current term, not the oldest one.',
				contributors: ['Cattn'],
				commits: ['a246868'],
				issues: [161]
			},
			{
				text: 'If you never picked a university events color, the color picker now shows Graphite, the color those events use.',
				contributors: ['jaspermayone'],
				pr: 165
			},
			{
				text: 'Fixed the alignment of the chips in class descriptions.',
				contributors: ['Cattn'],
				commits: ['8fd756f'],
				issues: [160]
			}
		]
	},
	{
		version: '5.0.1',
		date: '2026-09-19',
		changes: [
			{
				text: 'No changes you can see. The code was reorganized.',
				contributors: ['Cattn'],
				commits: ['d4e3232']
			}
		]
	},
	{
		version: '5.0.0',
		date: '2026-09-16',
		summary: 'A redesigned extension that loads faster.',
		changes: [
			{
				text: 'A redesign of the calendar, Friends, Settings, Help, and popups, with a new color palette and better layouts at every window size.',
				contributors: ['Cattn'],
				pr: 145,
				issues: [148]
			},
			{
				text: 'The calendar scrolls to your first class when it opens, and you can scroll it sideways with the mouse wheel.',
				contributors: ['Cattn'],
				pr: 151,
				issues: [146]
			},
			{
				text: 'The calendar no longer takes over your scrolling when you meant to scroll down the page.',
				contributors: ['Cattn'],
				pr: 158,
				issues: [154]
			},
			{
				text: 'Faster loading: your calendar preferences load in one request, and the calendar and Settings send their requests at the same time.',
				contributors: ['jaspermayone'],
				pr: 136
			},
			{
				text: 'If your sign-in expires, the extension notices and asks you to sign in again. Ctrl+Shift+Alt+Backspace clears all extension data if you get stuck.',
				contributors: ['Cattn'],
				pr: 149,
				issues: [127, 128]
			},
			{
				text: 'You can choose to share anonymous usage counts, so we can see which features people use. They are off unless you turn them on. The extension asks you once after you sign in, and you can change it in Settings.',
				contributors: ['jaspermayone', 'Cattn'],
				pr: 143
			},
			{
				text: 'If you use Google Calendar, your calendar link is now in Settings.',
				contributors: ['Cattn'],
				commits: ['2d6f5d6'],
				issues: [129]
			},
			{
				text: 'When you sign in again with Google, you skip the WIT Self Service step.',
				contributors: ['Cattn'],
				commits: ['243b92f'],
				issues: [141]
			},
			{
				text: 'Clearer error messages, including one when passkey sign-in fails.',
				contributors: ['miretskydatwit'],
				pr: 140
			},
			{
				text: 'Fixed adding a Google account from Settings in Firefox.',
				contributors: ['Cattn'],
				pr: 159,
				issues: [156]
			}
		]
	},
	{
		version: '4.0.1',
		date: '2026-09-14',
		changes: [
			{
				text: 'Fixed signing in when you use Firefox containers.',
				contributors: ['Cattn'],
				pr: 137
			},
			{
				text: 'Term names fit in narrow windows.',
				contributors: ['Cattn'],
				commits: ['d42c2e4'],
				issues: [126]
			}
		]
	},
	{
		version: '4.0.0',
		date: '2026-09-12',
		summary: 'Sign in with your WIT Google account, or with a passkey.',
		changes: [
			{
				text: 'Setup signs you in with your WIT Google account. If you pick a different Google account, the extension tells you to choose your WIT one.',
				contributors: ['jaspermayone', 'Cattn'],
				pr: 132
			},
			{
				text: 'Sign in with a passkey, so you can skip Google on a new device.',
				contributors: ['jaspermayone', 'Cattn'],
				pr: 132
			}
		]
	},
	{
		version: '3.1.2',
		date: '2026-09-11',
		changes: [
			{
				text: 'Fixed the remaining Firefox issues.',
				contributors: ['Cattn'],
				commits: ['01ed179']
			}
		]
	},
	{
		version: '3.1.1',
		date: '2026-09-11',
		changes: [
			{
				text: 'Fixed issues in the Firefox version.',
				contributors: ['Cattn'],
				commits: ['151af80']
			}
		]
	},
	{
		version: '3.1.0',
		date: '2026-09-11',
		summary: 'WIT-Calendar is now on Firefox.',
		changes: [
			{
				text: 'Firefox support. Install WIT-Calendar from Firefox Add-ons.',
				contributors: ['Cattn'],
				pr: 130
			},
			{
				text: 'Fixed the Google sign-in popup not showing on some Linux distributions.',
				contributors: ['Cattn'],
				commits: ['d2c7288']
			}
		]
	},
	{
		version: '3.0.1',
		date: '2026-09-08',
		changes: [
			{
				text: 'Your class colors and titles no longer reset when your schedule updates.',
				contributors: ['Cattn'],
				commits: ['617545e']
			},
			{
				text: 'Study Day events now use the university events color you picked.',
				contributors: ['jaspermayone'],
				commits: ['9522531']
			}
		]
	},
	{
		version: '3.0.0',
		date: '2026-08-21',
		summary: 'Introducing Friends.',
		changes: [
			{
				text: 'Friends: add friends by email or user ID, accept or decline requests, and see their schedules next to yours. Classes you share are highlighted, and the extension suggests times to meet.',
				contributors: ['Cattn', 'miretskydatwit', 'jaspermayone'],
				pr: 96
			},
			{
				text: 'Calendar cards show room numbers.',
				contributors: ['Cattn'],
				pr: 116,
				issues: [111]
			},
			{
				text: 'The color dropdown for a class shows its color, not a blank.',
				contributors: ['Cattn'],
				pr: 115,
				issues: [112]
			},
			{
				text: 'When you show past terms, the extension no longer opens a past term.',
				contributors: ['Cattn'],
				pr: 117,
				issues: [109]
			},
			{
				text: 'A clearer error when you are not logged in to WIT.',
				contributors: ['miretskydatwit'],
				pr: 110
			}
		]
	},
	{
		version: '2.1.3',
		date: '2026-06-17',
		changes: [
			{
				text: 'No changes from 2.1.2. Only the version number changed.',
				contributors: ['Cattn'],
				commits: ['1ea7242']
			}
		]
	},
	{
		version: '2.1.2',
		date: '2026-06-17',
		changes: [
			{
				text: 'The same code as 2.1.1.',
				contributors: [],
				commits: ['07a13d8']
			}
		]
	},
	{
		version: '2.1.1',
		date: '2026-06-17',
		changes: [
			{
				text: 'Pick a color for university events in Settings.',
				contributors: ['jaspermayone', 'miretskydatwit'],
				pr: 95
			},
			{
				text: 'Turning off all notifications now pauses every reminder and keeps your reminder settings for when you turn them back on.',
				contributors: ['jaspermayone'],
				pr: 93
			},
			{
				text: 'While notifications are off, your reminders show grayed out, with a note that they are paused.',
				contributors: ['miretskydatwit'],
				pr: 98,
				issues: [97]
			},
			{
				text: 'A "Show Historic Terms" setting, to see past terms next to your current schedule.',
				contributors: ['jaspermayone'],
				commits: ['40b5604']
			},
			{
				text: 'Your terms are saved to your account, so they come back on a new device.',
				contributors: ['jaspermayone'],
				commits: ['455352f']
			},
			{
				text: 'Settings warns you when a connected Google account needs you to sign in again, with a button to do it.',
				contributors: ['jaspermayone'],
				commits: ['5a8efe4']
			},
			{
				text: 'If you are not signed in to WIT Self Service, the extension says so and links to it. It also stops waiting if the page does not load.',
				contributors: ['jaspermayone'],
				commits: ['3cea571']
			},
			{
				text: 'The "Clear data" button in Settings is available to everyone.',
				contributors: ['Cattn'],
				commits: ['27908d1']
			},
			{
				text: 'The extension checks its settings in one request instead of six when it starts.',
				contributors: ['jaspermayone'],
				pr: 99
			},
			{
				text: 'Styling fixes.',
				contributors: ['miretskydatwit'],
				pr: 101,
				issues: [56]
			},
			{
				text: 'Removed repeated text from the "failed to fetch data" error.',
				contributors: ['miretskydatwit', 'jaspermayone'],
				pr: 106,
				issues: [105]
			}
		]
	},
	{
		version: '2.1.0',
		date: '2026-01-09',
		changes: [
			{
				text: 'Support for half-semester courses.',
				contributors: ['Cattn'],
				pr: 91
			},
			{
				text: 'Fixed the extension sending the same request more than once.',
				contributors: ['Cattn'],
				pr: 90
			}
		]
	},
	{
		version: '2.0.1',
		date: '2026-01-06',
		changes: [
			{
				text: 'Fixed the Refresh courses button.',
				contributors: ['miretskydatwit', 'Cattn'],
				pr: 87
			},
			{
				text: 'A back button on the processing courses page, so you can go back if a term has no classes.',
				contributors: ['miretskydatwit', 'Cattn'],
				pr: 88,
				issues: [84]
			}
		]
	},
	{
		version: '2.0.0',
		date: '2026-01-06',
		summary: 'More control over notifications, accounts, and university events.',
		changes: [
			{
				text: 'Turn off all notifications with one switch.',
				contributors: ['jaspermayone', 'Cattn'],
				pr: 66
			},
			{
				text: 'Connect more than one Google account.',
				contributors: ['jaspermayone', 'Cattn'],
				pr: 66
			},
			{
				text: 'Add university events to your calendar, and choose which kinds. Holidays are always added.',
				contributors: ['jaspermayone', 'Cattn'],
				pr: 66
			},
			{
				text: 'Switch between the current and next term, and refresh your schedule with one button.',
				contributors: ['jaspermayone', 'Cattn'],
				pr: 66
			},
			{
				text: 'Calendar links move to the new server address on their own.',
				contributors: ['jaspermayone'],
				commits: ['b5e18d8']
			},
			{
				text: 'The extension asks for fewer permissions.',
				contributors: ['jaspermayone'],
				commits: ['7f1b898']
			}
		]
	},
	{
		version: '1.0.0',
		date: '2025-12-23',
		summary: 'The first stable release.',
		changes: [
			{
				text: 'Sign in, and the extension imports your class schedule from WIT Self Service.',
				contributors: ['Cattn'],
				commits: ['b472e8f', '11820a9', 'c9a11b1', '5efec33']
			},
			{
				text: 'A calendar view of your week, with a help page and light and dark modes.',
				contributors: ['Cattn'],
				commits: ['1d7128e', '2a25fd7', '7423a41']
			},
			{
				text: 'Sync to Google Calendar, or copy a calendar link for Outlook, Apple Calendar, or any other calendar app.',
				contributors: ['Cattn'],
				commits: ['ae14a8b', '3d251d9', 'c337d9e']
			},
			{
				text: 'Edit each class: its title, with templates, its color, and its reminders.',
				contributors: ['Cattn'],
				commits: ['a9adf3a', '35fbd3a', '137f50e', '987506b', 'e77efda']
			},
			{
				text: 'The edit window has a close button, and no longer closes when you click outside it.',
				contributors: ['miretskydatwit'],
				pr: 55
			},
			{
				text: 'Every reminder has a delete button.',
				contributors: ['miretskydatwit'],
				pr: 57
			},
			{
				text: 'Close the edit window with the Escape key.',
				contributors: ['miretskydatwit'],
				pr: 59
			},
			{
				text: 'Settings for your default colors and the term to show.',
				contributors: ['Cattn'],
				commits: ['e78e227', 'd685cba', '20b0ea4', 'da3327e']
			},
			{
				text: 'Choose 12-hour or 24-hour time.',
				contributors: ['miretskydatwit', 'Cattn'],
				pr: 14,
				issues: [5]
			},
			{
				text: 'A hint that you can expand the sidebar.',
				contributors: ['miretskydatwit'],
				pr: 35,
				issues: [28]
			},
			{
				text: 'A clearer error when you are not signed in.',
				contributors: ['miretskydatwit'],
				pr: 11
			},
			{
				text: 'If the server is down, the error links to the status page and GitHub.',
				contributors: ['miretskydatwit'],
				pr: 78
			},
			{
				text: 'The "Get Your Calendar" page links to the status page and GitHub, in case the server goes down while you are signed in.',
				contributors: ['miretskydatwit'],
				pr: 82
			},
			{
				text: 'A link to the website on the welcome screen.',
				contributors: ['miretskydatwit'],
				pr: 80
			}
		]
	}
];

export function releaseUrl(version: string): string {
	return `${RELEASES_URL}/tag/v${version}`;
}

export function pullUrl(pr: number): string {
	return `${REPO_URL}/pull/${pr}`;
}

export function issueUrl(issue: number): string {
	return `${REPO_URL}/issues/${issue}`;
}

export function commitUrl(commit: string): string {
	return `${REPO_URL}/commit/${commit}`;
}

export function profileUrl(username: string): string {
	return `https://github.com/${username}`;
}

// "September 30, 2026". The date is formatted in UTC so it does not move a
// day in time zones west of UTC.
export function formatReleaseDate(date: string): string {
	return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}

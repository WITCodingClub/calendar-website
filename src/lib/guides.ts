// The user guides under /guides, and the features they cover. The overview
// page, the page titles, the markdown copy, and the next and previous links
// all read this file.
//
// To add a guide:
// 1. Add it to GUIDES, in the order a reader should see it.
// 2. Add src/routes/guides/<slug>/+page.svelte. Wrap the page in <Guide>, and
//    use <Screenshot> for each picture.
// 3. Put its screenshots in static/guides/<slug>/.
// 4. Point the feature's `guide` at the new slug, so the overview links it.
//
// This file imports nothing, so node --test can load it directly.

export type Guide = {
	slug: string;
	title: string;
	// One sentence for the overview card and the page description.
	summary: string;
};

export const GUIDES: Guide[] = [
	{
		slug: 'getting-started',
		title: 'Getting started',
		summary:
			'Install WIT-Calendar, sign in, get your schedule into your calendar, and make it look the way you want.'
	},
	{
		slug: 'friends',
		title: 'Friends',
		summary: 'Add friends, choose what each one sees, compare calendars, and find a time to meet.'
	},
	// {
	// 	slug: 'dashboard',
	// 	title: 'Your dashboard',
	// 	summary:
	// 		'Manage WIT-Calendar on the web: your schedule, calendar preferences, connected calendars, notifications, and account.'
	// },
	// {
	// 	slug: 'mcp',
	// 	title: 'Connect an AI assistant',
	// 	summary:
	// 		'Let Claude, ChatGPT, or another AI assistant read your schedule and the course catalog, and ask it about your week.'
	// }
];

export type Feature = {
	name: string;
	summary: string;
	// The slug of the guide that covers this feature. Leave it out until the
	// guide exists, and the overview shows the feature without a link.
	guide?: string;
	// The one feature that new users should read first. The overview and the
	// home page point new users to its guide.
	startHere?: boolean;
};

// Every feature that ships today. Add a feature here when it ships, even
// before it has a guide.
export const FEATURES: Feature[] = [
	{
		name: 'Getting started',
		summary:
			'Install WIT-Calendar, get your classes into Google Calendar, Outlook, or Apple Calendar, and pick your colors, titles, and alerts.',
		guide: 'getting-started',
		startHere: true
	},
	{
		name: 'Friends',
		summary:
			'Add friends, compare calendars, and find a time to meet. Share your full schedule or only when you are busy.',
		guide: 'friends'
	},
	// {
	// 	name: 'Dashboard',
	// 	summary:
	// 		'Change your settings on the web, connect Google Calendar or Outlook, and get your calendar feed link.',
	// 	guide: 'dashboard'
	// },
	// {
	// 	name: 'AI assistants',
	// 	summary: 'Connect Claude, ChatGPT, or Claude Code and ask about your schedule and the catalog.',
	// 	guide: 'mcp'
	// }
];

// The guide that new users should read first. It is also the first guide.
export const START_GUIDE: Guide = GUIDES[0];

export function guidePath(slug: string): string {
	return `/guides/${slug}`;
}

export function guideFor(slug: string): Guide | null {
	return GUIDES.find((guide) => guide.slug === slug) ?? null;
}

// The guides on either side of this one, for the links at the bottom of a
// guide. Null at either end of the list.
export function neighborsOf(slug: string): { previous: Guide | null; next: Guide | null } {
	const index = GUIDES.findIndex((guide) => guide.slug === slug);
	if (index === -1) return { previous: null, next: null };
	return { previous: GUIDES[index - 1] ?? null, next: GUIDES[index + 1] ?? null };
}

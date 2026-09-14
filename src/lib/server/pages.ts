// Markdown copies of the pages, for agents that send Accept: text/markdown.
//
// These are written by hand, not converted from the HTML. The links on the
// pages are onclick handlers on buttons, so a converter would drop them.
// When you change the text of a page, change its copy here too.
//
// /privacy and /tos have no copy. Their text is generated legal markup, so
// they return HTML to every client.

const WEB_STORE_URL =
	'https://chromewebstore.google.com/detail/wit-calendar/aceelinogfcceklkpacakdeddnaakicj';

const pages: Record<string, (origin: string) => string> = {
	'/': (origin) => `---
title: WIT-Calendar
description: A Chrome extension that imports your Wentworth Institute of Technology classes into your calendar.
---

# WIT-Calendar

WIT-Calendar is a Chrome extension that imports your classes into your calendar. It supports Google Calendar, Microsoft Outlook, and Apple Calendar.

- [Install from the Chrome Web Store](${WEB_STORE_URL})
- [Sign in](${origin}/users/sign_in): Open your dashboard.
- [About](${origin}/about)
- [Contact](${origin}/contact)

## For agents and developers

- [llms.txt](${origin}/llms.txt): An index of the site for agents.
- [Course Catalog API reference](${origin}/docs/api.md): A public, read-only API for the Wentworth course catalog. It needs no API key.

## Legal

- [Privacy Policy](${origin}/privacy)
- [Terms of Service](${origin}/tos)
`,

	'/about': (origin) => `---
title: WIT-Calendar - About
description: What WIT-Calendar is and where to see the server status.
---

# About

WIT-Calendar is a Chrome extension that imports your classes into your calendar. It supports all major calendars, including Google Calendar, Microsoft Outlook, and Apple Calendar.

- [Install from the Chrome Web Store](${WEB_STORE_URL})
- [Server status page](https://stats.uptimerobot.com/QS76oPqfzz)
- [Home](${origin}/)
- [Contact](${origin}/contact)
`,

	'/contact': (origin) => `---
title: WIT-Calendar - Contact
description: How to contact the WIT-Calendar team.
---

# Contact

The best way to contact us is through Discord.

- [Discord](https://discord.gg/fkeM94snmy)
- [GitHub](https://github.com/WITCodingClub/calendar)
- [Instagram](https://www.instagram.com/wit_coding_club/)
- Email: contact@calendar.witcc.dev
- [About](${origin}/about)
`
};

// Returns null for a page that has no markdown copy.
export function markdownFor(pathname: string, origin: string): string | null {
	const page = pages[pathname];
	return page ? page(origin) : null;
}

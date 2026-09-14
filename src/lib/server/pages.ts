import { securityMarkdown } from '../security.ts';

// Markdown copies of the pages, for agents that send Accept: text/markdown.
//
// These are written by hand, not converted from the HTML. The links on the
// pages are onclick handlers on buttons, so a converter would drop them.
// When you change the text of a page, change its copy here too.
//
// /privacy and /tos are not here. Their text is generated legal markup, so a
// script generates their copies too. See legal.ts.

import {
	CONTACT_EMAIL,
	DISCORD_URL,
	GITHUB_ISSUES_URL,
	GITHUB_URL,
	INSTAGRAM_URL,
	LEGAL_EMAILS,
	ORGANIZATION,
	SECURITY_REPORT_URL,
	STATUS_URL,
	WEB_STORE_URL,
	listOfEmails,
	metaFor
} from '../site.ts';

const pages: Record<string, (origin: string) => string> = {
	'/': (origin) => `---
title: WIT-Calendar
description: ${metaFor('/')?.description}
---

# WIT-Calendar

WIT-Calendar is a free Chrome extension for students at ${ORGANIZATION.school}. It imports your class schedule into your calendar, so every lecture, lab, and final exam shows up next to the rest of your week. It supports Google Calendar, Microsoft Outlook, and Apple Calendar. The ${ORGANIZATION.name}, a student club at ${ORGANIZATION.school} in ${ORGANIZATION.locality}, makes and runs it. Read [more about the project](${origin}/about), or [contact us](${origin}/contact).

- [Install from the Chrome Web Store](${WEB_STORE_URL})
- [Sign in](${origin}/users/sign_in): Open your dashboard.
- [About](${origin}/about)
- [Contact](${origin}/contact)

## How it works

1. Install WIT-Calendar from the Chrome Web Store.
2. Open the extension. It gets your schedule, processes it, and gives you a calendar link.
3. Add the link to Outlook, Apple Calendar, or any calendar app. You can also connect your Google account, so changes reach Google Calendar automatically.
4. Choose the event alerts, colors, and titles in the extension, or in your dashboard after you sign in.

## For agents and developers

WIT-Calendar also publishes the Wentworth course catalog as a public, read-only API. It needs no API key.

- [Course Catalog API reference](${origin}/docs/api.md): The REST, GraphQL, and CSV endpoints, as markdown.
- [OpenAPI description](${origin}/docs/api/openapi.json)
- [GraphQL schema](${origin}/docs/api/schema.graphql)
- [llms.txt](${origin}/llms.txt): An index of the site for agents.
- [Source code on GitHub](${GITHUB_URL})

## Legal

- [Privacy Policy](${origin}/privacy)
- [Terms of Service](${origin}/tos)
- [Security](${origin}/security): How to report a vulnerability.
`,

	'/about': (origin) => `---
title: WIT-Calendar - About
description: What WIT-Calendar is and where to see the server status.
---

# About

WIT-Calendar is a Chrome extension that imports your classes into your calendar. It supports all major calendars, including Google Calendar, Microsoft Outlook, and Apple Calendar.

- [Install from the Chrome Web Store](${WEB_STORE_URL})
- [Server status page](${STATUS_URL})
- [Home](${origin}/)
- [Contact](${origin}/contact)
`,

	'/contact': (origin) => `---
title: WIT-Calendar - Contact
description: ${metaFor('/contact')?.description}
---

# Contact

The fastest way to reach the WIT-Calendar team is our [Discord server](${DISCORD_URL}). You can ask a question, tell us about a problem with your schedule, or suggest a feature there. You can also email us at [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) with any questions or concerns. If you report a problem, tell us which calendar you use and what issue you're having.

- [Discord](${DISCORD_URL})
- [GitHub](${GITHUB_URL})
- [Instagram](${INSTAGRAM_URL})
- [About](${origin}/about)

If the extension does something wrong, open an issue on [GitHub](${GITHUB_ISSUES_URL}) and include the steps that cause the problem. Do not report a security problem in a public issue. Send it privately through [GitHub private vulnerability reporting](${SECURITY_REPORT_URL}). Our [security.txt](${origin}/.well-known/security.txt) file lists the other contacts.

WIT-Calendar is made by the ${ORGANIZATION.name}, a student club at ${ORGANIZATION.school}, ${ORGANIZATION.streetAddress}, ${ORGANIZATION.locality}, ${ORGANIZATION.region} ${ORGANIZATION.postalCode}. To learn what data we keep and how to remove it, read the [Privacy Policy](${origin}/privacy). Send legal inquiries to all three of these addresses: ${listOfEmails(LEGAL_EMAILS.map((email) => `[${email}](mailto:${email})`))}.
`
};

// Returns null for a page that has no markdown copy.
export function markdownFor(pathname: string, origin: string): string | null {
	const page = pages[pathname];
	return page ? page(origin) : null;
}

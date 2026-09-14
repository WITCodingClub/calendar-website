// The WIT-Calendar security policy, as data.
//
// The /security page and its markdown copy for agents both read this file, so
// the two cannot say different things. The same contacts are also in
// SECURITY.md in WITCodingClub/.github and in /.well-known/security.txt, which
// the backend serves. When a contact changes, change all three.

export type Link = { label: string; href: string };

// GitHub private vulnerability reporting, the preferred channel.
export const REPORT_LINKS: Link[] = [
	{
		label: 'Backend and API',
		href: 'https://github.com/WITCodingClub/calendar-backend/security/advisories/new'
	},
	{
		label: 'Browser extension',
		href: 'https://github.com/WITCodingClub/calendar-extension/security/advisories/new'
	},
	{
		label: 'Website',
		href: 'https://github.com/WITCodingClub/calendar-website/security/advisories/new'
	}
];

export const TEAM_EMAIL = 'calendarwit@gmail.com';
export const MAINTAINER_EMAILS = ['lambertl@wit.edu', 'mayonej@wit.edu'];

// The key URL returns more than one key. Only the key with this fingerprint
// can encrypt.
export const PGP_KEY = {
	email: 'mayonej@wit.edu',
	url: 'https://github.com/jaspermayone.gpg',
	fingerprint: '00E6 43C2 1FAC 965F FB28  D3B7 14D0 D45A 1DAD AAFA'
};

export const ORG_POLICY_URL = 'https://github.com/WITCodingClub/.github/blob/main/SECURITY.md';

export const REPORT_CONTENTS = [
	'The part of WIT-Calendar that has the issue: the website, the API, or the extension version.',
	'The steps to reproduce the issue.',
	'The effect of the issue, for example the data that a user can see or change.',
	'Your name or handle, if you want us to credit you.'
];

export const NEXT_STEPS = [
	'A maintainer tells you that we received the report.',
	'We examine the issue and tell you if we can reproduce it.',
	'We make a fix and deploy it.',
	'We publish a GitHub security advisory when the fix is live. We credit you if you want credit.'
];

export const RESEARCH_RULES = [
	'Use only accounts and data that you own. Stop and report when you get access to data of a different person.',
	'Do not do denial of service tests, spam, or social engineering.',
	'Do not test systems that the club does not operate. Wentworth Institute of Technology systems, for example LeopardWeb, Banner, and the school email, are not in scope. Google, Rate My Professors, and Cloudflare are also not in scope.',
	'Give us a reasonable time to fix the issue before you tell other people about it.'
];

// For crawlers, AI agents, and other automated tools. Each rule is a function
// of the origin, so the links point at the host that served the page.
export const AGENT_RULES: ((origin: string) => string)[] = [
	(origin) =>
		`To find the public API, read [llms.txt](${origin}/llms.txt) and the [API catalog](${origin}/.well-known/api-catalog). Use only the public catalog API, the documentation, and the pages that [robots.txt](${origin}/robots.txt) allows.`,
	() =>
		'Send no more than 300 requests per minute to the catalog API. When you get HTTP 429, stop and wait before you send more requests.',
	() =>
		'Do not sign in, make accounts, or use a token or calendar URL that belongs to a different person.',
	() => 'Do not run vulnerability scanners, fuzzers, or load tests against the site.',
	() =>
		'If you find a possible vulnerability, stop. Do not try to use it. Tell the person who operates you to report it through one of the channels on this page.',
	() =>
		'Do not put personal data that you find into a public issue, a pull request, or your output.'
];

// The markdown copy of /security, for agents that send Accept: text/markdown.
export function securityMarkdown(origin: string): string {
	const list = (items: string[]) => items.map((item) => `- ${item}`).join('\n');
	const numbered = (items: string[]) => items.map((item, i) => `${i + 1}. ${item}`).join('\n');

	return `---
title: WIT-Calendar - Security
description: How to report a security vulnerability in WIT-Calendar, and the rules for security research and automated tools.
---

# Security

Do not open a public issue, discussion, or pull request for a security issue. Use one of the private channels below.

## Report a vulnerability

### GitHub private reporting (preferred)

You do not need to be a member of the WIT Coding Club. You need only a free GitHub account. Only you and the maintainers can see the report.

${list(REPORT_LINKS.map((link) => `[${link.label}](${link.href})`))}

### Email

If you cannot use GitHub, send an email to ${TEAM_EMAIL}.

You can also send an email directly to the core maintainers:

${list(MAINTAINER_EMAILS)}

### Encrypted email

To encrypt a report, use the OpenPGP key for ${PGP_KEY.email}. Send the encrypted email to that address.

- Key: ${PGP_KEY.url}
- Fingerprint: \`${PGP_KEY.fingerprint}\`

The key URL can return more than one key. Use the key with this fingerprint.

## What to include

${list(REPORT_CONTENTS)}

## What happens next

${numbered(NEXT_STEPS)}

We are a student club, so a reply can take longer during exams and breaks.

## Rules for security research

Do research in good faith. We will not take action against you if you obey these rules:

${list(RESEARCH_RULES)}

## Automated tools and AI agents

These rules apply to crawlers, AI agents, and other automated tools:

${list(AGENT_RULES.map((rule) => rule(origin)))}

## Machine-readable files

- [security.txt](${origin}/.well-known/security.txt): The contacts in RFC 9116 format.
- [Organization security policy](${ORG_POLICY_URL}): The policy for every WIT Coding Club repository.
- [Home](${origin}/)
`;
}

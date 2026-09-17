// Facts about the site that the pages, their markdown copies, and the
// structured data all use. Change a fact here, not in each page.
//
// This file imports nothing, so node --test can load it directly.

// The Worker also answers on workers.dev. Links and canonical URLs always name
// the public host.
export const SITE_ORIGIN = 'https://calendar.witcc.dev';
export const SITE_NAME = 'WIT-Calendar';

export const CHROME_WEB_STORE_URL =
	'https://chromewebstore.google.com/detail/wit-calendar/aceelinogfcceklkpacakdeddnaakicj';
export const FIREFOX_WEB_STORE_URL = 'https://addons.mozilla.org/en-US/firefox/addon/wit-calendar/';

// The store to send a visitor to. Firefox, including Firefox for Android,
// installs from Firefox Add-ons. Every other browser gets the Chrome Web
// Store, which Chrome, Edge, Brave, and Opera can all install from.
export function webStoreUrlFor(userAgent: string): string {
	return /Firefox\//.test(userAgent) ? FIREFOX_WEB_STORE_URL : CHROME_WEB_STORE_URL;
}

export const CONTACT_EMAIL = 'calendarwit@gmail.com';
// Legal inquiries go to all three addresses. They are the email contacts in
// the security policy, in the same order.
export const LEGAL_EMAILS = [CONTACT_EMAIL, 'lambertl@wit.edu', 'mayonej@wit.edu'];
export const DISCORD_URL = 'https://discord.gg/fkeM94snmy';
export const GITHUB_URL = 'https://github.com/WITCodingClub/calendar';
export const GITHUB_ISSUES_URL = 'https://github.com/WITCodingClub/calendar/issues';
export const GITHUB_ORG_URL = 'https://github.com/WITCodingClub';
export const INSTAGRAM_URL = 'https://www.instagram.com/wit_coding_club/';
export const STATUS_URL = 'https://stats.uptimerobot.com/QS76oPqfzz';
export const SECURITY_REPORT_URL =
	'https://github.com/WITCodingClub/calendar-backend/security/advisories/new';
export const SHARE_IMAGE_URL = `${SITE_ORIGIN}/secondary_wit_ss.webp`;

export const ORGANIZATION = {
	name: 'WIT Coding Club',
	school: 'Wentworth Institute of Technology',
	streetAddress: '550 Huntington Avenue',
	locality: 'Boston',
	region: 'MA',
	postalCode: '02115',
	country: 'US'
};

// "a, b, and c", for a sentence that names every legal contact.
export function listOfEmails(emails: string[]): string {
	if (emails.length < 3) return emails.join(' and ');
	return `${emails.slice(0, -1).join(', ')}, and ${emails[emails.length - 1]}`;
}

export type PageMeta = { title: string; description: string };

const pageMeta: Record<string, PageMeta> = {
	'/': {
		title: SITE_NAME,
		description:
			'WIT-Calendar is a free Chrome extension that imports your Wentworth Institute of Technology class schedule into Google Calendar, Microsoft Outlook, or Apple Calendar.'
	},
	'/about': {
		title: `${SITE_NAME} - About`,
		description: 'What WIT-Calendar is, who makes it, and where to see the server status.'
	},
	'/contact': {
		title: `${SITE_NAME} - Contact`,
		description:
			'How to contact the WIT-Calendar team: Discord, email, GitHub issues, private security reports, and legal inquiries.'
	},
	'/privacy': {
		title: `${SITE_NAME} - Privacy Policy`,
		description: 'How WIT-Calendar collects, uses, and protects your information.'
	},
	'/tos': {
		title: `${SITE_NAME} - Terms of Service`,
		description: 'The terms that apply when you use WIT-Calendar.'
	}
};

// Returns null for a path that is not a page, such as the 404 page.
export function metaFor(pathname: string): PageMeta | null {
	return pageMeta[pathname] ?? null;
}

export function canonicalUrl(pathname: string): string {
	return `${SITE_ORIGIN}${pathname}`;
}

const organizationId = `${SITE_ORIGIN}/#organization`;

// Schema.org identity for the home page: the extension, the club that makes
// it, and the website. See https://schema.org/SoftwareApplication and
// https://schema.org/Organization.
export function structuredData(): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'SoftwareApplication',
				'@id': `${SITE_ORIGIN}/#app`,
				name: SITE_NAME,
				alternateName: 'WIT Calendar',
				description: pageMeta['/'].description,
				url: `${SITE_ORIGIN}/`,
				applicationCategory: 'ProductivityApplication',
				operatingSystem: 'Google Chrome, Mozilla Firefox',
				installUrl: [CHROME_WEB_STORE_URL, FIREFOX_WEB_STORE_URL],
				image: SHARE_IMAGE_URL,
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
				publisher: { '@id': organizationId },
				sameAs: [CHROME_WEB_STORE_URL, FIREFOX_WEB_STORE_URL, GITHUB_URL]
			},
			{
				'@type': 'Organization',
				'@id': organizationId,
				name: ORGANIZATION.name,
				url: `${SITE_ORIGIN}/`,
				logo: `${SITE_ORIGIN}/icon.png`,
				email: CONTACT_EMAIL,
				sameAs: [GITHUB_ORG_URL, INSTAGRAM_URL, DISCORD_URL],
				contactPoint: [
					{
						'@type': 'ContactPoint',
						contactType: 'customer support',
						email: CONTACT_EMAIL,
						url: `${SITE_ORIGIN}/contact`,
						availableLanguage: 'English'
					},
					...LEGAL_EMAILS.map((email) => ({
						'@type': 'ContactPoint',
						contactType: 'legal inquiries',
						email,
						url: `${SITE_ORIGIN}/contact`,
						availableLanguage: 'English'
					}))
				],
				address: {
					'@type': 'PostalAddress',
					name: ORGANIZATION.school,
					streetAddress: ORGANIZATION.streetAddress,
					addressLocality: ORGANIZATION.locality,
					addressRegion: ORGANIZATION.region,
					postalCode: ORGANIZATION.postalCode,
					addressCountry: ORGANIZATION.country
				}
			},
			{
				'@type': 'WebSite',
				'@id': `${SITE_ORIGIN}/#website`,
				name: SITE_NAME,
				url: `${SITE_ORIGIN}/`,
				publisher: { '@id': organizationId }
			}
		]
	};
}

// A JSON-LD script element. "<" is escaped so that no text in the data can
// close the script element early.
export function jsonLdScript(data: Record<string, unknown>): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

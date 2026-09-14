import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	CONTACT_EMAIL,
	LEGAL_EMAILS,
	canonicalUrl,
	jsonLdScript,
	listOfEmails,
	metaFor,
	structuredData
} from './site.ts';

type Node = Record<string, unknown>;

function nodeOfType(type: string): Node {
	const graph = structuredData()['@graph'] as Node[];
	const node = graph.find((entry) => entry['@type'] === type);
	assert.ok(node, `no ${type} in the structured data`);
	return node;
}

describe('metaFor', () => {
	it('has a title and a description for every page', () => {
		for (const path of ['/', '/about', '/contact', '/privacy', '/tos']) {
			const meta = metaFor(path);
			assert.ok(meta?.title, `${path} has no title`);
			assert.ok((meta?.description.length ?? 0) > 40, `${path} has a short description`);
		}
	});

	it('has nothing for a path that is not a page', () => {
		assert.equal(metaFor('/missing'), null);
	});
});

describe('canonicalUrl', () => {
	it('always names the public host', () => {
		assert.equal(canonicalUrl('/'), 'https://calendar.witcc.dev/');
		assert.equal(canonicalUrl('/contact'), 'https://calendar.witcc.dev/contact');
	});
});

describe('structuredData', () => {
	it('describes the extension as a free SoftwareApplication', () => {
		const app = nodeOfType('SoftwareApplication');
		assert.equal(app.name, 'WIT-Calendar');
		assert.equal(app.url, 'https://calendar.witcc.dev/');
		assert.ok(app.description);
		assert.deepEqual(app.offers, { '@type': 'Offer', price: '0', priceCurrency: 'USD' });
	});

	it('gives the organization a contact point and a postal address', () => {
		const org = nodeOfType('Organization');
		const contacts = org.contactPoint as Node[];
		const support = contacts.find((point) => point.contactType === 'customer support');
		const address = org.address as Node;

		assert.ok(contacts.every((point) => point['@type'] === 'ContactPoint'));
		assert.equal(support?.email, CONTACT_EMAIL);
		assert.equal(address['@type'], 'PostalAddress');
		for (const key of ['streetAddress', 'addressLocality', 'postalCode', 'addressCountry']) {
			assert.ok(address[key], `address has no ${key}`);
		}
	});

	it('sends legal inquiries to all three legal contacts', () => {
		const org = nodeOfType('Organization');
		const legal = (org.contactPoint as Node[])
			.filter((point) => point.contactType === 'legal inquiries')
			.map((point) => point.email);

		assert.deepEqual(legal, ['calendarwit@gmail.com', 'lambertl@wit.edu', 'mayonej@wit.edu']);
		assert.deepEqual(legal, LEGAL_EMAILS);
	});

	it('uses no calendar.witcc.dev email address', () => {
		assert.doesNotMatch(JSON.stringify(structuredData()), /@calendar\.witcc\.dev/);
	});

	it('links the extension to the organization that publishes it', () => {
		const app = nodeOfType('SoftwareApplication');
		const org = nodeOfType('Organization');
		assert.deepEqual(app.publisher, { '@id': org['@id'] });
	});
});

describe('listOfEmails', () => {
	it('joins the addresses into one sentence', () => {
		assert.equal(listOfEmails(['a@x.com']), 'a@x.com');
		assert.equal(listOfEmails(['a@x.com', 'b@x.com']), 'a@x.com and b@x.com');
		assert.equal(listOfEmails(['a@x.com', 'b@x.com', 'c@x.com']), 'a@x.com, b@x.com, and c@x.com');
	});
});

describe('jsonLdScript', () => {
	it('wraps the data in a JSON-LD script element', () => {
		const script = jsonLdScript({ name: 'x' });
		assert.equal(script, '<script type="application/ld+json">{"name":"x"}</script>');
	});

	it('escapes "<" so the data cannot close the script element', () => {
		const script = jsonLdScript({ name: '</script><script>alert(1)</script>' });
		assert.equal(script.match(/<\/script>/g)?.length, 1);
		assert.deepEqual(JSON.parse(script.slice(35, -9)), {
			name: '</script><script>alert(1)</script>'
		});
	});
});

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
	coursePath,
	instructorPath,
	meetingLines,
	oneDecimal,
	pageParam,
	pickTerm,
	rmpSummary,
	seasons,
	seatsLine,
	shortDate,
	withQuery,
	type Section
} from './catalog.ts';
import { metaFor } from './site.ts';

const section = (meetings: Section['meeting_times']): Section => ({
	crn: 12345,
	term: { uid: 202710, name: 'Spring 2027' },
	subject_code: 'COMP',
	course_number: 2350,
	course_code: 'COMP 2350-01',
	title: 'Data Structures',
	schedule_type: 'Lecture',
	seats: { capacity: 30, available: 12 },
	instructors: [],
	meeting_times: meetings,
	final_exam: null
});

describe('catalog paths', () => {
	it('puts a course code in the path without a space', () => {
		assert.equal(coursePath('COMP 2350'), '/catalog/courses/COMP2350');
	});

	it('escapes an instructor id', () => {
		assert.equal(instructorPath('a/b'), '/catalog/instructors/a%2Fb');
	});

	it('leaves blank params out of a query string', () => {
		assert.equal(
			withQuery('/catalog/courses', { q: 'data', term_uid: '', page: null }),
			'/catalog/courses?q=data'
		);
		assert.equal(withQuery('/catalog/courses', {}), '/catalog/courses');
	});

	it('reads a page number of 1 or more', () => {
		assert.equal(pageParam('3'), 3);
		assert.equal(pageParam('0'), 1);
		assert.equal(pageParam('abc'), 1);
		assert.equal(pageParam(null), 1);
	});

	it('has a route and a title for each list page', () => {
		for (const path of ['/catalog', '/catalog/courses', '/catalog/instructors']) {
			assert.ok(existsSync(`src/routes${path}/+page.svelte`), `${path} has no page`);
			assert.ok(metaFor(path), `${path} has no title`);
		}
	});
});

describe('catalog formatting', () => {
	it('summarizes a rating', () => {
		const rmp = {
			id: 'x',
			avg_rating: '4.26',
			avg_difficulty: null,
			num_ratings: 1,
			would_take_again_percent: null
		};
		assert.equal(rmpSummary(rmp), '4.3 / 5 from 1 rating');
		assert.equal(rmpSummary(null), null);
		assert.equal(oneDecimal(null), '–');
	});

	it('counts open seats, or says nothing without counts', () => {
		assert.equal(seatsLine({ capacity: 30, available: 12 }), '12 of 30 open');
		assert.equal(seatsLine({ capacity: null, available: null }), null);
	});

	it('writes one line for each meeting', () => {
		const lines = meetingLines(
			section([
				{
					day: 'monday',
					begin_time_12h: '10:00 AM',
					end_time_12h: '11:40 AM',
					all_day: false,
					location: { display: 'WENTW 010' }
				},
				{ day: null, begin_time_12h: null, end_time_12h: null, all_day: true, location: null }
			])
		);
		assert.deepEqual(lines, ['Mon 10:00 AM – 11:40 AM, WENTW 010', 'TBA All day']);
	});

	it('names the seasons a course is offered', () => {
		assert.equal(seasons(['fall', 'spring']), 'Fall, Spring');
		assert.equal(seasons([]), null);
	});

	it('reads an exam date as a calendar date', () => {
		assert.equal(shortDate('2026-12-15'), 'Tue, Dec 15');
	});
});

describe('pickTerm', () => {
	const terms = [
		{ uid: 202730, name: 'Summer 2027' },
		{ uid: 202720, name: 'Spring 2027' }
	];

	it('takes the term of the param when it is in the list', () => {
		assert.equal(pickTerm('202720', terms, 202730)?.name, 'Spring 2027');
	});

	it('falls back to the current term, then the newest, for an unknown param', () => {
		assert.equal(pickTerm('201410', terms, 202720)?.name, 'Spring 2027');
		assert.equal(pickTerm(null, terms, 199910)?.name, 'Summer 2027');
		assert.equal(pickTerm(null, [], null), null);
	});
});

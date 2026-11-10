// The public course catalog pages under /catalog (calendar-backend#797). The
// data comes from the backend's public catalog API, /api/v1/catalog, which
// needs no token. See https://calendar.witcc.dev/docs/api.
//
// This file has the types and the formatting rules. It imports nothing, so
// node --test can load it. The requests are in server/catalog.ts.

export type Term = {
	uid: number;
	name: string;
	section_count?: number;
};

export type Rmp = {
	id: string;
	avg_rating: number | string;
	avg_difficulty: number | string | null;
	num_ratings: number;
	would_take_again_percent: number | string | null;
};

export type Instructor = {
	pub_id: string;
	name: string;
	title: string | null;
	department: string | null;
	school: string | null;
	rmp: Rmp | null;
};

export type Review = {
	pub_id: string;
	course_name: string | null;
	comment: string | null;
	clarity_rating: number | null;
	difficulty_rating: number | null;
	rated_on: string | null;
};

export type InstructorDetail = Instructor & {
	rmp_tags: { name: string; count: number }[];
	recent_reviews: Review[];
	review_count: number;
	reviews_source: string;
	sections?: Section[];
};

export type MeetingTime = {
	day: string | null;
	begin_time_12h: string | null;
	end_time_12h: string | null;
	all_day: boolean;
	location: { display: string | null } | null;
};

export type Section = {
	crn: number;
	term: { uid: number; name: string };
	subject_code: string;
	course_number: number;
	course_code: string;
	title: string;
	schedule_type: string | null;
	seats: { capacity: number | null; available: number | null };
	instructors: Instructor[];
	meeting_times: MeetingTime[];
	final_exam: {
		date: string;
		start_time: string;
		end_time: string;
		location: string | null;
	} | null;
	// Null until the backend stores the catalog entry of the course. The course
	// page needs it, so link to the page only when it is set.
	course?: { code: string } | null;
};

export type RequisiteNode =
	| { type: 'and' | 'or'; operands: RequisiteNode[] }
	| { type: 'course'; code: string; title: string | null; linked: boolean; min_grade?: string }
	| { type: 'test'; name: string; score?: string };

export type CourseSummary = {
	code: string;
	title: string | null;
	credit_hours: number | null;
	typically_offered: string[];
};

export type Course = CourseSummary & {
	description: string | null;
	prerequisites: RequisiteNode | null;
	corequisites: RequisiteNode[];
	mutual_exclusions: RequisiteNode[];
	restrictions: { heading: string; values: string[] }[];
	department: string | null;
	unlocks: CourseSummary[];
	sections?: Section[];
};

export type Page<T> = {
	data: T[];
	meta: { page: number; per_page: number; total_count: number; total_pages: number };
};

export const CATALOG_PATH = '/catalog';
export const PER_PAGE = 25;

// "COMP 2350" to "/catalog/courses/COMP2350". The path has no space.
export function coursePath(code: string): string {
	return `${CATALOG_PATH}/courses/${code.replace(/\s+/g, '')}`;
}

export function instructorPath(pubId: string): string {
	return `${CATALOG_PATH}/instructors/${encodeURIComponent(pubId)}`;
}

// A path with a query string. Empty values are left out, so a form with a
// blank field makes a clean URL.
export function withQuery(
	path: string,
	params: Record<string, string | number | null | undefined>
): string {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== null && value !== undefined && value !== '') query.set(key, String(value));
	}
	const text = query.toString();
	return text ? `${path}?${text}` : path;
}

// A page number from a query string: 1 or more.
export function pageParam(value: string | null): number {
	const page = Number.parseInt(value ?? '', 10);
	return Number.isFinite(page) && page > 1 ? page : 1;
}

// The term of a term_uid query param when it is in the list. Otherwise the
// default: the current term when it has sections, else the newest term that
// has sections. An old bookmark with a term that has no sections left gets
// the default, not a 404.
export function pickTerm(
	param: string | null,
	terms: Term[],
	currentUid: number | null
): Term | null {
	const chosen = param ? terms.find((term) => String(term.uid) === param) : undefined;
	return chosen ?? terms.find((term) => term.uid === currentUid) ?? terms[0] ?? null;
}

// "4.2 / 5 from 31 ratings", or null when there are no ratings.
export function rmpSummary(rmp: Rmp | null): string | null {
	if (!rmp) return null;
	const ratings = rmp.num_ratings === 1 ? 'rating' : 'ratings';
	return `${oneDecimal(rmp.avg_rating)} / 5 from ${rmp.num_ratings} ${ratings}`;
}

export function oneDecimal(value: number | string | null): string {
	if (value === null || value === '') return '–';
	return Number(value).toFixed(1);
}

// "12 of 30 open", or null when Banner gave no counts.
export function seatsLine(seats: Section['seats']): string | null {
	if (seats.capacity === null) return null;
	return `${seats.available ?? 0} of ${seats.capacity} open`;
}

// One line for each meeting: "Mon 10:00 AM – 11:40 AM, WENTW 010".
export function meetingLines(section: Section): string[] {
	return section.meeting_times.map((meeting) => {
		const day = meeting.day
			? meeting.day.slice(0, 1).toUpperCase() + meeting.day.slice(1, 3)
			: 'TBA';
		const time = meeting.all_day
			? 'All day'
			: `${meeting.begin_time_12h} – ${meeting.end_time_12h}`;
		const place = meeting.location?.display;
		return `${day} ${time}${place ? `, ${place}` : ''}`;
	});
}

// "Fall, Spring", or null.
export function seasons(typicallyOffered: string[]): string | null {
	if (typicallyOffered.length === 0) return null;
	return typicallyOffered
		.map((season) => season.charAt(0).toUpperCase() + season.slice(1))
		.join(', ');
}

// "Tue, Dec 15" for an ISO date ("2026-12-15"), read as a calendar date, not
// a time, so the time zone cannot move it to another day.
export function shortDate(isoDate: string): string {
	const [year, month, day] = isoDate.split('-').map(Number);
	return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	});
}

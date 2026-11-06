import type { Course } from '$lib/catalog';
import { catalogGet, catalogTerms, selectedTerm } from '$lib/server/catalog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, setHeaders }) => {
	const terms = await catalogTerms();
	const term = await selectedTerm(url.searchParams.get('term_uid'), terms);
	const course = await catalogGet<{ data: Course }>(`/courses/${encodeURIComponent(params.code)}`, {
		term_uid: term?.uid
	});

	setHeaders({ 'cache-control': 'public, max-age=300' });
	return { course: course.data, terms, term };
};

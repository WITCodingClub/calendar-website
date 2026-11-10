import type { Course } from '$lib/catalog';
import { catalogGet, termChoice } from '$lib/server/catalog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, setHeaders }) => {
	const { terms, term } = await termChoice(url.searchParams.get('term_uid'));
	const course = await catalogGet<{ data: Course }>(`/courses/${encodeURIComponent(params.code)}`, {
		term_uid: term?.uid
	});

	setHeaders({ 'cache-control': 'public, max-age=300' });
	return { course: course.data, terms, term };
};

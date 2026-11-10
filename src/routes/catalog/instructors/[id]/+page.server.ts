import type { InstructorDetail } from '$lib/catalog';
import { catalogGet, termChoice } from '$lib/server/catalog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, setHeaders }) => {
	const { terms, term } = await termChoice(url.searchParams.get('term_uid'));
	const instructor = await catalogGet<{ data: InstructorDetail }>(
		`/instructors/${encodeURIComponent(params.id)}`,
		{
			term_uid: term?.uid
		}
	);

	setHeaders({ 'cache-control': 'public, max-age=300' });
	return { instructor: instructor.data, terms, term };
};

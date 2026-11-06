import type { InstructorDetail } from '$lib/catalog';
import { catalogGet, catalogTerms, selectedTerm } from '$lib/server/catalog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, setHeaders }) => {
	const terms = await catalogTerms();
	const term = await selectedTerm(url.searchParams.get('term_uid'), terms);
	const instructor = await catalogGet<{ data: InstructorDetail }>(
		`/instructors/${encodeURIComponent(params.id)}`,
		{
			term_uid: term?.uid
		}
	);

	setHeaders({ 'cache-control': 'public, max-age=300' });
	return { instructor: instructor.data, terms, term };
};

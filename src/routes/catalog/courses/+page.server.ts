import { PER_PAGE, pageParam, type CourseSummary, type Page } from '$lib/catalog';
import { catalogGet, catalogTerms } from '$lib/server/catalog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	const termUid = url.searchParams.get('term_uid') ?? '';
	const page = pageParam(url.searchParams.get('page'));

	const [courses, terms] = await Promise.all([
		catalogGet<Page<CourseSummary>>('/courses', { q, term_uid: termUid, page, per_page: PER_PAGE }),
		catalogTerms()
	]);

	setHeaders({ 'cache-control': 'public, max-age=300' });
	return { q, termUid, courses: courses.data, meta: courses.meta, terms };
};

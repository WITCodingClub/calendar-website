import { error } from '@sveltejs/kit';
import { docFor, sourcePath } from '$lib/docs';
import { loadDocSource } from '$lib/server/docs';
import { renderDoc } from '$lib/server/renderDoc';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const doc = docFor(params.slug);
	// A 404 sends the request on to Rails, which answers any other /docs path.
	if (!doc) error(404, 'Not found');

	let source: string;
	try {
		source = await loadDocSource(doc.slug);
	} catch {
		// The rproxy Worker answers any 400 or higher from Rails, so a visitor
		// then gets the backend's own copy of the page.
		error(503, 'The reference could not be loaded. Try again in a few minutes.');
	}

	setHeaders({
		'cache-control': 'public, max-age=300',
		link: `<${sourcePath(doc.slug)}>; rel="alternate"; type="text/markdown"`
	});

	const rendered = renderDoc(source);
	return {
		slug: doc.slug,
		title: rendered.title ?? doc.title,
		html: rendered.html,
		headings: rendered.headings,
		hasDiagrams: rendered.html.includes('<pre class="mermaid">')
	};
};

<script lang="ts">
	import { resolve } from '$app/paths';
	import { seasons } from '$lib/catalog';
	import CatalogPage from '$lib/components/catalog/CatalogPage.svelte';
	import Pager from '$lib/components/catalog/Pager.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const codeParam = (code: string) => code.replace(/\s+/g, '');
</script>

<svelte:head>
	<title>WIT-Calendar - Courses</title>
</svelte:head>

<CatalogPage title="Courses" back={{ label: 'Course Catalog', href: resolve('/catalog') }}>
	<form method="GET" class="filters card">
		<label>
			Search
			<input type="search" name="q" value={data.q} placeholder="COMP 2350 or data structures" />
		</label>
		<label>
			Offered in
			<select name="term_uid">
				<option value="">Any term</option>
				{#each data.terms as term (term.uid)}
					<option value={term.uid} selected={String(term.uid) === data.termUid}>{term.name}</option>
				{/each}
			</select>
		</label>
		<button type="submit">Search</button>
	</form>

	{#if data.courses.length === 0}
		<p class="card">No courses match. Try a course code such as COMP 2350, or fewer words.</p>
	{:else}
		<ul class="list" id="courses">
			{#each data.courses as course (course.code)}
				<li>
					<a href={resolve('/catalog/courses/[code]', { code: codeParam(course.code) })}
						>{course.code}: {course.title}</a
					>
					<p class="hint">
						{[
							course.credit_hours ? `${course.credit_hours} credits` : null,
							seasons(course.typically_offered)
						]
							.filter(Boolean)
							.join(' · ')}
					</p>
				</li>
			{/each}
		</ul>
		<Pager page={data.meta.page} totalPages={data.meta.total_pages} />
	{/if}
</CatalogPage>

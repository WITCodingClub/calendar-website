<script lang="ts">
	// One section (CRN) from the catalog API: its code, instructors, meetings,
	// seats, and final exam. With showCourse, the title links to the course.
	import { resolve } from '$app/paths';
	import { meetingLines, seatsLine, shortDate, type Section } from '$lib/catalog';

	let { section, showCourse = false }: { section: Section; showCourse?: boolean } = $props();

	const seats = $derived(seatsLine(section.seats));
	const lines = $derived(meetingLines(section));
</script>

<li data-crn={section.crn}>
	<p class="text-on-surface font-medium">
		{#if showCourse && section.course}
			<a
				href={resolve('/catalog/courses/[code]', {
					code: `${section.subject_code}${section.course_number}`
				})}>{section.course_code}: {section.title}</a
			>
		{:else if showCourse}
			{section.course_code}: {section.title}
		{:else}
			{section.course_code}
		{/if}
		<span class="hint"
			>· CRN {section.crn}{section.schedule_type ? ` · ${section.schedule_type}` : ''}{seats
				? ` · ${seats}`
				: ''}</span
		>
	</p>
	<p class="hint">
		{#if section.instructors.length > 0}
			{#each section.instructors as person, index (person.pub_id)}{#if index > 0},
				{/if}<a href={resolve('/catalog/instructors/[id]', { id: person.pub_id })}>{person.name}</a
				>{/each}
		{:else}
			Instructor TBA
		{/if}
	</p>
	<ul class="meetings">
		{#each lines as line, index (index)}
			<li>{line}</li>
		{:else}
			<li>No meeting times</li>
		{/each}
	</ul>
	{#if section.final_exam}
		<p class="hint">
			Final: {shortDate(section.final_exam.date)}, {section.final_exam.start_time} – {section
				.final_exam.end_time}{section.final_exam.location ? `, ${section.final_exam.location}` : ''}
		</p>
	{/if}
</li>

<style>
	p {
		margin: 0;
	}

	.meetings {
		list-style: none;
		margin: 0.25rem 0;
		padding: 0;
		font-size: 0.9rem;
	}
</style>

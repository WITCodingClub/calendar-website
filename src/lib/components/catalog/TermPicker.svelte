<script lang="ts">
	// A GET form that picks a term for the current page. It works without
	// JavaScript: the button sends the form.
	import type { Term } from '$lib/catalog';

	let { terms, selected }: { terms: Term[]; selected: number | null } = $props();
</script>

{#if terms.length > 1}
	<form method="GET" class="filters">
		<label>
			Term
			<select name="term_uid">
				{#each terms as term (term.uid)}
					<option value={term.uid} selected={term.uid === selected}>{term.name}</option>
				{/each}
			</select>
		</label>
		<button type="submit">Show</button>
	</form>
{/if}

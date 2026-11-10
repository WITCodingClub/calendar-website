<script lang="ts">
	// Previous and next links for a list from the catalog API. It shows nothing
	// when the list fits on one page.
	import { page as current } from '$app/state';

	let { page, totalPages }: { page: number; totalPages: number } = $props();

	// The current URL with another page number. The filters stay.
	function hrefFor(target: number): string {
		const pairs = [...current.url.searchParams].filter(([key]) => key !== 'page');
		if (target > 1) pairs.push(['page', String(target)]);
		const text = pairs
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
			.join('&');
		return text ? `${current.url.pathname}?${text}` : current.url.pathname;
	}
</script>

{#if totalPages > 1}
	<nav aria-label="Pagination" class="pager">
		{#if page > 1}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- The current path with another page number. -->
			<a href={hrefFor(page - 1)} rel="prev">Previous</a>
		{:else}
			<span aria-disabled="true">Previous</span>
		{/if}
		<span>Page {page} of {totalPages}</span>
		{#if page < totalPages}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- The current path with another page number. -->
			<a href={hrefFor(page + 1)} rel="next">Next</a>
		{:else}
			<span aria-disabled="true">Next</span>
		{/if}
	</nav>
{/if}

<style>
	.pager {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	span[aria-disabled='true'] {
		opacity: 0.4;
	}
</style>

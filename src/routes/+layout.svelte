<script lang="ts">
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.png';
	import BottomBar from '$lib/components/BottomBar.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import { selected } from '$lib/store.svelte';
	import { cubicInOut } from 'svelte/easing';
	import { get, writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import '../app.css';
	import '../main.css';

	let { children } = $props();

	const order = ['/', '/about', '/contact', '/privacy', '/tos'];
	const inX = writable(0);
	const outX = writable(0);
	const activeTransitions = writable(0);
	const skipAnim = writable(false);

	beforeNavigate(({ from, to }) => {
		const fromPath = from?.url.pathname ?? page.url.pathname;
		const toPath = to?.url.pathname ?? page.url.pathname;
		const fromIdx = order.indexOf(fromPath);
		const toIdx = order.indexOf(toPath);
		if (fromIdx !== -1 && toIdx !== -1) {
			const forward = toIdx > fromIdx;
			const dist = browser ? Math.ceil(window.innerWidth) : 120;
			inX.set(forward ? dist : -dist);
			outX.set(forward ? -dist : dist);
		} else {
			inX.set(0);
			outX.set(0);
		}
	});

	selected.subscribe(() => {
		if (get(activeTransitions) > 0) {
			activeTransitions.set(0);
			skipAnim.set(true);
			setTimeout(() => skipAnim.set(false));
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" as="image" href="/primary_wit_ss.webp" />
	<link rel="preload" as="image" href="/secondary_wit_ss.webp" />
	<link rel="preload" as="image" href="/third_wit_ss.webp" />
	<title>WIT-Calendar</title>
</svelte:head>

<TopBar />

<div class="relative overflow-hidden overflow-x-hidden overflow-y-hidden min-h-screen flex flex-col">
	{#key page.url.pathname}
		<div
			in:fly={{ x: $inX, opacity: 1, duration: $skipAnim ? 0 : 500, easing: cubicInOut }}
			out:fly={{ x: $outX, opacity: 1, duration: $skipAnim ? 0 : 500, easing: cubicInOut }}
			onintrostart={() => activeTransitions.update((n) => n + 1)}
			onoutrostart={() => activeTransitions.update((n) => n + 1)}
			onintroend={() => activeTransitions.update((n) => Math.max(0, n - 1))}
			onoutroend={() => activeTransitions.update((n) => Math.max(0, n - 1))}
			class:absolute={$activeTransitions > 0 && !$skipAnim}
			class:inset-0={$activeTransitions > 0 && !$skipAnim}
			class="flex-1"
		>
			{@render children()}
		</div>
	{/key}
	<BottomBar />
</div>
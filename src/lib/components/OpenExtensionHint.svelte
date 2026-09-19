<script lang="ts">
	import { EXTENSION_SOURCE } from '$lib/extension';

	let sidebarOpen = $state(false);
	let lastInner = 0;
	let lastOuter = 0;

	$effect(() => {
		lastInner = window.innerWidth;
		lastOuter = window.outerWidth;
		const id = setInterval(() => {
			window.postMessage({ source: EXTENSION_SOURCE, type: 'ping' }, window.location.origin);
		}, 1000);
		return () => clearInterval(id);
	});

	function onresize() {
		const inner = window.innerWidth;
		const outer = window.outerWidth;
		if (lastInner > 0 && Math.abs(outer - lastOuter) <= 2) {
			const delta = inner - lastInner;
			if (delta <= -240) sidebarOpen = true;
			else if (delta >= 240) sidebarOpen = false;
		}
		lastInner = inner;
		lastOuter = outer;
	}
</script>

<svelte:window onresize={onresize} />

<div
	class={[
		'hint pointer-events-none fixed z-50 flex text-primary',
		{ sidebar: sidebarOpen },
		sidebarOpen
			? 'top-[12%] right-[0.7rem] max-w-[min(24rem,calc(100vw-1.25rem))] flex-row-reverse items-center gap-1.5'
			: 'top-[0.1rem] right-[1.1rem] max-w-[min(19.5rem,calc(100vw-1.75rem))] flex-col items-end gap-0.5 max-[719px]:hidden'
	]}
	role="status"
>
	{#if sidebarOpen}
		<svg
			class="arrow-side h-[2.15rem] w-[4.6rem] shrink-0 overflow-visible drop-shadow-[0_1px_1px_rgb(0_0_0/0.2)]"
			viewBox="0 0 120 56"
			aria-hidden="true"
		>
			<defs>
				<marker
					id="side-arrowhead"
					markerWidth="5.5"
					markerHeight="5.5"
					refX="4.5"
					refY="2.75"
					orient="auto"
					markerUnits="strokeWidth"
				>
					<path
						d="M0 0 L5.5 2.75 L0 5.5"
						fill="none"
						stroke="currentColor"
						stroke-width="1"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</marker>
			</defs>
			<path
				d="M8 40 C 36 40, 72 28, 104 28"
				fill="none"
				stroke="currentColor"
				stroke-width="3.5"
				stroke-linecap="round"
				marker-end="url(#side-arrowhead)"
			/>
		</svg>
	{:else}
		<svg
			class="arrow-firefox mr-[0.15rem] hidden h-20 w-[7.25rem] shrink-0 drop-shadow-[0_1px_1px_rgb(0_0_0/0.2)]"
			viewBox="0 0 160 110"
			aria-hidden="true"
		>
			<path
				d="M28 98 C 42 38, 108 22, 142 20"
				fill="none"
				stroke="currentColor"
				stroke-width="3.5"
				stroke-linecap="round"
			/>
			<path
				d="M126 8 L148 20 L124 34"
				fill="none"
				stroke="currentColor"
				stroke-width="3.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<svg
			class="arrow-chrome mr-[2.75rem] h-[5.75rem] w-[6.25rem] shrink-0 overflow-visible drop-shadow-[0_1px_1px_rgb(0_0_0/0.2)]"
			viewBox="0 0 140 130"
			aria-hidden="true"
		>
			<defs>
				<marker
					id="chrome-arrowhead"
					markerWidth="5.5"
					markerHeight="5.5"
					refX="4.5"
					refY="2.75"
					orient="auto"
					markerUnits="strokeWidth"
				>
					<path
						d="M0 0 L5.5 2.75 L0 5.5"
						fill="none"
						stroke="currentColor"
						stroke-width="1"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</marker>
			</defs>
			<path
				d="M118 118 C 96 62, 60 42, 52 18"
				fill="none"
				stroke="currentColor"
				stroke-width="3.5"
				stroke-linecap="round"
				marker-end="url(#chrome-arrowhead)"
			/>
		</svg>
	{/if}
	<div
		class="rounded-2xl border border-outline-variant bg-surface-container-high px-4 pt-[0.85rem] pb-[0.95rem] text-on-surface shadow-[0_10px_28px_rgb(0_0_0/0.18)]"
	>
		{#if sidebarOpen}
			<p class="mb-1.5 text-base font-[750] tracking-tight text-primary">Sign in</p>
			<p class="m-0 text-[0.94rem] leading-snug text-pretty">
				In the sidebar, sign in with your WIT Google or Microsoft account.
			</p>
		{:else}
			<p class="mb-1.5 text-base font-[750] tracking-tight text-primary">Open the sidebar</p>
			<p class="m-0 text-[0.94rem] leading-snug text-pretty">
				Click the extensions menu in the top right (the puzzle icon), then click WIT-Calendar.
			</p>
		{/if}
	</div>
</div>

<style>
	@media (prefers-reduced-motion: no-preference) {
		.arrow-firefox {
			animation: point 1.5s ease-in-out infinite;
		}

		.arrow-chrome {
			animation: point-up 1.5s ease-in-out infinite;
		}

		.arrow-side {
			animation: point-side 1.5s ease-in-out infinite;
		}
	}

	@keyframes point {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(7px, -8px);
		}
	}

	@keyframes point-up {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(-7px, -8px);
		}
	}

	@keyframes point-side {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(8px, 0);
		}
	}

	@-moz-document url-prefix() {
		.hint:not(.sidebar) {
			top: 0.65rem;
			right: 1.1rem;
			align-items: flex-end;
		}

		.hint:not(.sidebar) .arrow-firefox {
			display: block;
		}

		.hint:not(.sidebar) .arrow-chrome {
			display: none;
		}
	}
</style>

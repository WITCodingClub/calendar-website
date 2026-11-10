<script lang="ts">
	import { ConnectedButtons } from 'm3-svelte';
	import { Button } from 'm3-svelte';
	import { selected } from '$lib/store.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	const NAV = [
		{ path: '/', label: 'Home' },
		{ path: '/about', label: 'About' },
		{ path: '/guides', label: 'Guides' },
		{ path: '/changelog', label: 'Changelog' },
		{ path: '/contact', label: 'Contact' }
	];

	const EXTRA_LABELS: Record<string, string> = {
		'/privacy': 'Privacy',
		'/tos': 'Terms',
		'/security': 'Security',
		'/docs': 'Docs'
	};

	let menuOpen = $state(false);
	let menuRoot: HTMLElement | undefined = $state();

	const section = $derived('/' + (page.url.pathname.split('/')[1] ?? ''));
	const currentLabel = $derived(
		NAV.find((item) => item.path === section)?.label ??
			EXTRA_LABELS[section] ??
			section.slice(1).replace(/^\w/, (c) => c.toUpperCase())
	);

	onMount(() => {
		$selected = page.url.pathname;
	});

	$effect(() => {
		$selected = page.url.pathname;
		menuOpen = false;
	});

	function go(path: string) {
		menuOpen = false;
		$selected = path;
	}

	function handleWindowClick(event: MouseEvent) {
		if (menuOpen && menuRoot && !menuRoot.contains(event.target as Node)) menuOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') menuOpen = false;
	}
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleKeydown} />

<!-- Desktop / tablet -->
<div class="mt-4 px-4 sm:flex hidden w-full items-center justify-center">
	<div class="max-w-full overflow-x-auto">
		<ConnectedButtons>
			<input type="radio" name="seg" id="seg-a" bind:group={$selected} value="/" />
			<Button for="seg-a" variant="filled">Home</Button>
			<input type="radio" name="seg" id="seg-b" bind:group={$selected} value="/about" />
			<Button for="seg-b" variant="filled">About</Button>
			<input type="radio" name="seg" id="seg-e" bind:group={$selected} value="/guides" />
			<Button for="seg-e" variant="filled">Guides</Button>
			<input type="radio" name="seg" id="seg-d" bind:group={$selected} value="/changelog" />
			<Button for="seg-d" variant="filled">Changelog</Button>
			<input type="radio" name="seg" id="seg-c" bind:group={$selected} value="/contact" />
			<Button for="seg-c" variant="filled">Contact</Button>
		</ConnectedButtons>
	</div>
</div>

<!-- Mobile -->
<nav class="mobile-nav mt-3 px-3 sm:hidden relative" bind:this={menuRoot}>
	<div class="bar">
		<button class="crumb" type="button" onclick={() => go('/')} aria-label="Go to home page">
			<svg
				class="crumb-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<rect x="3" y="4" width="18" height="18" rx="2" />
				<path d="M16 2v4M8 2v4M3 10h18" />
			</svg>
			<span class="crumb-text">/ {currentLabel}</span>
		</button>

		<button
			class="menu-button"
			class:open={menuOpen}
			type="button"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={menuOpen}
			aria-controls="mobile-menu"
		>
			<span class="line"></span>
			<span class="line"></span>
			<span class="line"></span>
		</button>
	</div>

	{#if menuOpen}
		<ul id="mobile-menu" class="menu" transition:fly={{ y: -8, duration: 160, easing: cubicOut }}>
			{#each NAV as item (item.path)}
				<li>
					<button
						type="button"
						class="menu-item"
						class:active={item.path === section}
						aria-current={item.path === section ? 'page' : undefined}
						onclick={() => go(item.path)}
					>
						{item.label}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</nav>

<style>
	.mobile-nav {
		z-index: 50;
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.375rem;
		border-radius: 9999px;
		background: rgb(var(--m3-scheme-primary));
	}

	.crumb {
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		height: 2.75rem;
		padding: 0 1.25rem 0 1rem;
		min-width: 0;
		border: none;
		border-radius: 9999px;
		background: rgb(var(--m3-scheme-on-primary));
		color: rgb(var(--m3-scheme-primary));
		cursor: pointer;
		transition: filter 150ms;
	}

	.crumb:active {
		filter: brightness(1.15);
	}

	.crumb-icon {
		width: 1.125rem;
		height: 1.125rem;
		flex-shrink: 0;
	}

	.crumb-text {
		font-size: 1.125rem;
		font-weight: 800;
		font-style: italic;
		letter-spacing: -0.01em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		/* Italic glyphs overhang their box; give the clip area room so they aren't cut off */
		padding-inline: 0.2em;
		margin-inline: -0.2em;
	}

	.menu-button {
		position: relative;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.3rem;
		width: 2.75rem;
		height: 2.75rem;
		flex-shrink: 0;
		border: none;
		border-radius: 9999px;
		background: rgb(var(--m3-scheme-on-primary));
		cursor: pointer;
	}

	.line {
		display: block;
		width: 1.25rem;
		height: 2px;
		border-radius: 2px;
		background: rgb(var(--m3-scheme-primary));
		transition:
			transform 200ms ease,
			opacity 200ms ease;
	}

	.menu-button.open .line:nth-child(1) {
		transform: translateY(calc(0.3rem + 2px)) rotate(45deg);
	}

	.menu-button.open .line:nth-child(2) {
		opacity: 0;
	}

	.menu-button.open .line:nth-child(3) {
		transform: translateY(calc(-0.3rem - 2px)) rotate(-45deg);
	}

	.menu {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0.75rem;
		left: 0.75rem;
		margin: 0;
		padding: 0.375rem;
		list-style: none;
		border-radius: 1.5rem;
		background: rgb(var(--m3-scheme-primary));
		box-shadow: 0 8px 24px rgb(0 0 0 / 0.25);
	}

	.menu-item {
		display: block;
		width: 100%;
		padding: 0.75rem 1.25rem;
		border: none;
		border-radius: 9999px;
		background: transparent;
		color: rgb(var(--m3-scheme-on-primary));
		font-size: 1rem;
		font-weight: 600;
		text-align: left;
		cursor: pointer;
	}

	.menu-item.active {
		background: rgb(var(--m3-scheme-on-primary));
		color: rgb(var(--m3-scheme-primary));
		font-style: italic;
		font-weight: 800;
	}
</style>

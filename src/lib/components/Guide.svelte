<script lang="ts">
    // The frame of every guide page: the title, a link back to the overview,
    // the guide's text, and links to the guides before and after it. The title
    // and the order come from src/lib/guides.ts.
    import type { Snippet } from "svelte";
    import type { Pathname } from "$app/types";
    import { resolve } from "$app/paths";
    import { Button } from "m3-svelte";
    import { selected } from "$lib/store.svelte";
    import { guideFor, guidePath, neighborsOf } from "$lib/guides";

    let { slug, children }: { slug: string; children: Snippet } = $props();

    const guide = $derived(guideFor(slug));
    const neighbors = $derived(neighborsOf(slug));

    // Every guide is its own route, so its path is a real Pathname.
    const hrefFor = (slug: string) => resolve(guidePath(slug) as Pathname);
</script>

<svelte:head>
	<title>WIT-Calendar - {guide?.title ?? "Guide"}</title>
</svelte:head>

<div class="flex flex-row justify-center items-center mt-12 md:mt-24 px-4 text-center">
    <h1 class="roboto-flex-wit-main text-4xl sm:text-5xl md:text-6xl leading-tight">{guide?.title}</h1>
</div>

<div class="flex flex-wrap justify-center items-center mt-4 peak gap-3 sm:gap-4 px-4">
    <Button variant="outlined" onclick={() => $selected = "/guides"}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z"/></svg>
        All guides
    </Button>
</div>

<div class="flex justify-center px-4 sm:px-6 mt-8 pb-16">
    <div class="w-full max-w-3xl flex flex-col gap-10">
        {#if guide}
            <p class="summary text-xl font-medium text-on-surface">{guide.summary}</p>
        {/if}

        <article class="guide-body text-lg text-secondary">
            {@render children()}
        </article>

        {#if neighbors.previous || neighbors.next}
        <nav class="pager" aria-label="More guides">
            {#if neighbors.previous}
                <a class="pager-link bg-surface-container-high" href={hrefFor(neighbors.previous.slug)}>
                    <span class="text-secondary">Previous</span>
                    <span class="text-primary font-bold">{neighbors.previous.title}</span>
                </a>
            {:else}
                <span></span>
            {/if}
            {#if neighbors.next}
                <a class="pager-link next bg-surface-container-high" href={hrefFor(neighbors.next.slug)}>
                    <span class="text-secondary">Next</span>
                    <span class="text-primary font-bold">{neighbors.next.title}</span>
                </a>
            {/if}
        </nav>
        {/if}
    </div>
</div>

<style>
    .roboto-flex-wit-main {
        font-family: "Roboto Flex", sans-serif;
        color: var(--color-primary);
        font-optical-sizing: 144;
        font-weight: 900;
        font-style: normal;
        font-variation-settings:
            "slnt" 0,
            "wdth" 129,
            "GRAD" 0,
            "XOPQ" 140,
            "XTRA" 468,
            "YOPQ" 51,
            "YTAS" 750,
            "YTDE" -203,
            "YTFI" 738,
            "YTLC" 514,
            "YTUC" 712;
    }

    .summary {
        margin: 0;
        text-align: center;
        line-height: 1.6;
        text-wrap: pretty;
    }

    /* The guide's text comes from each guide page, so these rules reach into
       it with :global. They are scoped to .guide-body. */
    .guide-body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .guide-body :global(h2) {
        font-family: "Roboto Flex", sans-serif;
        color: var(--color-primary);
        font-weight: 800;
        font-variation-settings: "wdth" 129, "XTRA" 468;
        font-size: clamp(1.35rem, 2.5vw, 1.85rem);
        line-height: 1.2;
        letter-spacing: -0.02em;
        margin: 1.5rem 0 0;
        scroll-margin-top: 1.5rem;
    }

    .guide-body :global(h3) {
        color: rgb(var(--m3-scheme-on-surface));
        font-weight: 700;
        font-size: 1.2rem;
        margin: 0.75rem 0 0;
        scroll-margin-top: 1.5rem;
    }

    .guide-body :global(p),
    .guide-body :global(li) {
        margin: 0;
        line-height: 1.7;
        text-wrap: pretty;
    }

    .guide-body :global(ol),
    .guide-body :global(ul) {
        margin: 0;
        padding-left: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .guide-body :global(ol) {
        list-style: decimal;
    }

    .guide-body :global(ul) {
        list-style: disc;
    }

    .guide-body :global(a) {
        color: var(--color-primary);
        text-decoration: underline;
        text-underline-offset: 0.18em;
    }

    .guide-body :global(strong) {
        color: rgb(var(--m3-scheme-on-surface));
    }

    .guide-body :global(code) {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 0.9em;
        padding: 0.1em 0.35em;
        border-radius: 0.375rem;
        background: rgb(var(--m3-scheme-surface-container-high));
        color: rgb(var(--m3-scheme-on-surface));
    }

    .guide-body :global(pre) {
        margin: 0;
        padding: 1rem 1.25rem;
        border-radius: 0.75rem;
        background: rgb(var(--m3-scheme-surface-container-high));
        overflow-x: auto;
    }

    .guide-body :global(pre code) {
        padding: 0;
        background: none;
    }

    .pager {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .pager-link {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 1rem 1.25rem;
        border-radius: 1rem;
        transition: filter 0.15s ease;
    }

    .pager-link:hover {
        filter: brightness(1.08);
    }

    .pager-link.next {
        grid-column: 2;
        text-align: right;
    }
</style>

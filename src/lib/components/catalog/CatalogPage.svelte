<script lang="ts">
    // The frame of a /catalog page: the title, an optional line under it, a
    // link back, and the body. The styles here apply to every catalog page.
    import type { Snippet } from "svelte";
    import { resolve } from "$app/paths";

    let {
        title,
        subtitle = null,
        back = null,
        children
    }: {
        title: string;
        subtitle?: string | null;
        back?: { label: string; href: string } | null;
        children: Snippet;
    } = $props();
</script>

<div class="flex flex-col items-center mt-12 md:mt-24 px-4 text-center gap-3">
    {#if back}
        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- The caller resolves the path. -->
        <a class="back text-secondary" href={back.href}>← {back.label}</a>
    {/if}
    <h1 class="roboto-flex-wit-main text-4xl sm:text-5xl md:text-6xl leading-tight">{title}</h1>
    {#if subtitle}
        <p class="text-lg text-secondary">{subtitle}</p>
    {/if}
</div>

<div class="flex justify-center px-4 sm:px-6 mt-8 pb-16">
    <div class="catalog w-full max-w-3xl flex flex-col gap-6 text-secondary">
        {@render children()}
        <p class="source">
            Course data comes from Wentworth's registration system and can be out of date. Check myWentworth
            before you register. Developers can read the same data from the
            <a href={resolve("/docs/[slug]", { slug: "api" })}>Course Catalog API</a>.
        </p>
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

    .back {
        text-decoration: underline;
        text-underline-offset: 0.18em;
    }

    .source {
        font-size: 0.9rem;
        text-align: center;
    }

    .catalog :global(a) {
        color: var(--color-primary);
        text-decoration: underline;
        text-underline-offset: 0.18em;
    }

    .catalog :global(.card) {
        background: var(--color-surface-container-high);
        border-radius: 1rem;
        padding: 1.25rem 1.5rem;
    }

    .catalog :global(.list) {
        list-style: none;
        margin: 0;
        padding: 0;
        border-radius: 1rem;
        overflow: hidden;
        background: var(--color-surface-container-high);
    }

    .catalog :global(.list > li) {
        padding: 0.9rem 1.5rem;
        border-top: 1px solid var(--color-outline-variant);
    }

    .catalog :global(.list > li:first-child) {
        border-top: none;
    }

    .catalog :global(.hint) {
        font-size: 0.9rem;
        color: var(--color-on-surface-variant);
    }

    .catalog :global(.filters) {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: end;
    }

    .catalog :global(.filters label) {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.9rem;
        flex: 1 1 12rem;
    }

    .catalog :global(.filters input),
    .catalog :global(.filters select) {
        border: 1px solid var(--color-outline);
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
        background: var(--color-surface);
        color: var(--color-on-surface);
        font-size: 1rem;
    }

    .catalog :global(.filters button) {
        border-radius: 999px;
        padding: 0.6rem 1.25rem;
        background: var(--color-primary);
        color: var(--color-on-primary);
        font-weight: 600;
    }

    .catalog :global(h2) {
        font-family: "Roboto Flex", sans-serif;
        color: var(--color-primary);
        font-weight: 800;
        font-size: clamp(1.35rem, 2.5vw, 1.85rem);
        margin: 0;
    }
</style>

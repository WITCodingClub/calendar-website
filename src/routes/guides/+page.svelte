<script lang="ts">
    import type { Pathname } from "$app/types";
    import { resolve } from "$app/paths";
    import { selected } from "$lib/store.svelte";
    import { Button } from "m3-svelte";
    import { FEATURES, START_GUIDE, guideFor, guidePath } from "$lib/guides";

    // Every guide is its own route, so its path is a real Pathname.
    const guideHref = (slug: string) => resolve(guidePath(slug) as Pathname);
</script>

<svelte:head>
	<title>WIT-Calendar - Guides</title>
</svelte:head>

<div class="flex flex-row justify-center items-center mt-12 md:mt-24 px-4 text-center sm:text-left">
    <h1 class="roboto-flex-wit-main text-4xl sm:text-6xl md:text-7xl leading-tight">Guides</h1>
</div>

<div class="flex flex-wrap justify-center items-center mt-4 peak gap-3 sm:gap-4 px-4">
    <Button variant="outlined" onclick={() => $selected = "/about"}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z"/></svg>
        About
    </Button>
    <Button variant="outlined" onclick={() => $selected = "/contact"}>
        Contact
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712"/></svg>
    </Button>
</div>

<div class="flex justify-center px-4 sm:px-6 mt-8 pb-16">
    <div class="guides-content w-full max-w-3xl text-lg text-secondary">
        <p class="intro">
            Walk through each WIT-Calendar feature step by step, with screenshots.
        </p>

        <section>
            <ul class="feature-grid">
                {#each FEATURES as feature (feature.name)}
                    {#if feature.startHere && feature.guide}
                    <li class="feature start bg-primary-container text-on-primary-container">
                        <span class="start-label bg-primary text-on-primary">New here? Start here</span>
                        <h3 class="text-2xl font-bold">{feature.name}</h3>
                        <p>{feature.summary}</p>
                        <div>
                            <Button variant="filled" onclick={() => $selected = guidePath(START_GUIDE.slug)}>
                                Read the guide
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712"/></svg>
                            </Button>
                        </div>
                    </li>
                    {:else}
                    <li class="feature bg-surface-container-high">
                        <h3 class="text-xl font-bold text-on-surface">{feature.name}</h3>
                        <p>{feature.summary}</p>
                        {#if feature.guide}
                            <a class="feature-link" href={guideHref(feature.guide)}>
                                {guideFor(feature.guide)?.title ?? "Read the guide"}
                            </a>
                        {:else}
                            <span class="soon text-on-surface-variant">Guide coming soon</span>
                        {/if}
                    </li>
                    {/if}
                {/each}
            </ul>
        </section>

        <section>
            <h2 class="section-heading">For developers</h2>
            <p>
                <!-- eslint-disable svelte/no-navigation-without-resolve -- The Rails backend serves /docs, outside the SvelteKit app. -->
                The technical references live under /docs: the
                <a href="/docs/api" data-sveltekit-reload>Course Catalog API</a> and the
                <a href="/docs/mcp" data-sveltekit-reload>MCP server</a>.
                <!-- eslint-enable svelte/no-navigation-without-resolve -->
            </p>
        </section>
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

    .guides-content {
        display: flex;
        flex-direction: column;
        gap: 2.25rem;
    }

    .guides-content section {
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
    }

    .section-heading {
        font-family: "Roboto Flex", sans-serif;
        color: var(--color-primary);
        font-weight: 800;
        font-variation-settings: "wdth" 129, "XTRA" 468;
        font-size: clamp(1.35rem, 2.5vw, 1.85rem);
        line-height: 1.2;
        letter-spacing: -0.02em;
        margin: 0;
    }

    .intro {
        text-align: center;
    }

    .guides-content p {
        margin: 0;
        line-height: 1.7;
        text-wrap: pretty;
    }

    .guides-content a {
        color: var(--color-primary);
        text-decoration: underline;
        text-underline-offset: 0.18em;
    }

    .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
        gap: 1rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .feature {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1.25rem 1.5rem;
        border-radius: 1rem;
    }

    .feature h3 {
        margin: 0;
    }

    .feature p {
        flex: 1;
        font-size: 1rem;
        line-height: 1.6;
    }

    .feature.start {
        grid-column: 1 / -1;
        gap: 0.75rem;
        padding: 1.5rem 1.75rem;
        border: 2px solid rgb(var(--m3-scheme-primary));
    }

    .feature.start p {
        font-size: 1.1rem;
        color: inherit;
    }

    .start-label {
        align-self: flex-start;
        padding: 0.2rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.85rem;
        font-weight: 700;
    }

    .feature-link,
    .soon {
        font-size: 0.95rem;
        font-weight: 600;
    }

    .guide-list {
        list-style: decimal;
        margin: 0;
        padding-left: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        line-height: 1.6;
    }

    .guide-list span {
        display: block;
    }

    .guide-list a {
        font-weight: 700;
    }
</style>

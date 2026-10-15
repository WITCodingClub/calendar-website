<script lang="ts">
    // A developer reference page. The text is markdown from the Rails backend,
    // rendered by renderDoc in src/lib/docs.ts. See that file.
    import { onMount } from "svelte";
    import { resolve } from "$app/paths";
    import { Button } from "m3-svelte";
    import { selected } from "$lib/store.svelte";
    import { DOCS, docPath, sourcePath } from "$lib/docs";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    let article: HTMLElement | undefined = $state();

    // Mermaid is large, so it loads only on a page that has a diagram.
    onMount(async () => {
        if (!data.hasDiagrams || !article) return;
        const { default: mermaid } = await import("mermaid");
        const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: dark ? "dark" : "neutral" });
        await mermaid.run({ nodes: article.querySelectorAll<HTMLElement>("pre.mermaid") });
    });
</script>

<svelte:head>
	<title>WIT-Calendar - {data.title}</title>
	<link rel="alternate" type="text/markdown" href={sourcePath(data.slug)} />
</svelte:head>

<div class="flex flex-row justify-center items-center mt-12 md:mt-24 px-4 text-center">
    <h1 class="roboto-flex-wit-main text-4xl sm:text-5xl md:text-6xl leading-tight">{data.title}</h1>
</div>

<nav class="flex flex-wrap justify-center items-center mt-4 peak gap-3 sm:gap-4 px-4" aria-label="Developer docs">
    <Button variant="outlined" onclick={() => $selected = "/guides"}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z"/></svg>
        All guides
    </Button>
    {#each DOCS as doc (doc.slug)}
        {#if doc.slug !== data.slug}
        <Button variant="outlined" onclick={() => $selected = docPath(doc.slug)}>{doc.title}</Button>
        {/if}
    {/each}
</nav>

<div class="flex justify-center px-4 sm:px-6 mt-8 pb-16">
    <div class="w-full max-w-3xl flex flex-col gap-8">
        {#if data.headings.length > 0}
        <details class="toc bg-surface-container-high">
            <summary class="text-on-surface font-bold">On this page</summary>
            <ul>
                {#each data.headings as heading (heading.id)}
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- An in-page anchor, not a route. -->
                <li><a href={`#${heading.id}`}>{heading.text}</a></li>
                {/each}
            </ul>
        </details>
        {/if}

        <!-- The HTML comes from renderDoc, which escapes any raw HTML in the source. -->
        <article bind:this={article} class="doc-body text-lg text-secondary">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html data.html}
        </article>

        <p class="source text-secondary">
            <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- Rails serves the markdown source. -->
            Agents can read this page as <a href={sourcePath(data.slug)} data-sveltekit-reload>markdown</a>.
            For help with the app itself, read the <a href={resolve("/guides")}>guides</a>.
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

    .toc {
        padding: 1rem 1.25rem;
        border-radius: 1rem;
    }

    .toc summary {
        cursor: pointer;
    }

    .toc ul {
        margin: 0.75rem 0 0;
        padding-left: 1.25rem;
        list-style: disc;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .toc a,
    .source a {
        color: var(--color-primary);
        text-decoration: underline;
        text-underline-offset: 0.18em;
    }

    .source {
        margin: 0;
        font-size: 0.95rem;
    }

    /* The page's text is {@html}, so these rules reach into it with :global.
       They are scoped to .doc-body, and match the guide pages. */
    .doc-body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-width: 0;
    }

    .doc-body :global(h2) {
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

    .doc-body :global(h3),
    .doc-body :global(h4) {
        color: rgb(var(--m3-scheme-on-surface));
        font-weight: 700;
        font-size: 1.2rem;
        margin: 0.75rem 0 0;
        scroll-margin-top: 1.5rem;
    }

    .doc-body :global(p),
    .doc-body :global(li) {
        margin: 0;
        line-height: 1.7;
        text-wrap: pretty;
    }

    .doc-body :global(ol),
    .doc-body :global(ul) {
        margin: 0;
        padding-left: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .doc-body :global(ol) {
        list-style: decimal;
    }

    .doc-body :global(ul) {
        list-style: disc;
    }

    .doc-body :global(a) {
        color: var(--color-primary);
        text-decoration: underline;
        text-underline-offset: 0.18em;
        overflow-wrap: anywhere;
    }

    .doc-body :global(strong) {
        color: rgb(var(--m3-scheme-on-surface));
    }

    .doc-body :global(code) {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 0.9em;
        padding: 0.1em 0.35em;
        border-radius: 0.375rem;
        background: rgb(var(--m3-scheme-surface-container-high));
        color: rgb(var(--m3-scheme-on-surface));
        overflow-wrap: anywhere;
    }

    .doc-body :global(pre) {
        margin: 0;
        padding: 1rem 1.25rem;
        border-radius: 0.75rem;
        background: rgb(var(--m3-scheme-surface-container-high));
        overflow-x: auto;
        font-size: 0.9rem;
    }

    .doc-body :global(pre code) {
        padding: 0;
        background: none;
        overflow-wrap: normal;
    }

    .doc-body :global(pre.mermaid) {
        display: flex;
        justify-content: center;
    }

    .doc-body :global(.docs-table) {
        overflow-x: auto;
        border-radius: 0.75rem;
    }

    .doc-body :global(table) {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
    }

    .doc-body :global(th),
    .doc-body :global(td) {
        padding: 0.5rem 0.75rem;
        text-align: left;
        vertical-align: top;
        border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant));
    }

    .doc-body :global(th) {
        color: rgb(var(--m3-scheme-on-surface));
        background: rgb(var(--m3-scheme-surface-container-high));
    }

    .doc-body :global(blockquote) {
        margin: 0;
        padding-left: 1rem;
        border-left: 4px solid var(--color-primary);
    }

    .doc-body :global(:focus-visible) {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }
</style>

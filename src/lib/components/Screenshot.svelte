<script lang="ts">
    // A screenshot in a guide. Put the image in static/guides/<slug>/ and pass
    // its path as src, such as "/guides/mcp/consent.webp". Until the image
    // exists, leave src out: the guide shows a placeholder that says what the
    // screenshot should show, so the gap is easy to spot.
    //
    // width and height are the image's size in pixels. They are optional, but
    // they let the page save room for the image before it loads, and a
    // <ScreenshotRow> needs them to line screenshots up.
    //
    // maxWidth caps how wide the screenshot shows, in pixels, and centers it.
    // Use it for a small image, such as one cropped to a single menu, so the
    // page doesn't stretch it to the full column and blur it.
    let {
        src,
        alt,
        caption,
        width,
        height,
        maxWidth
    }: {
        src?: string;
        alt: string;
        caption?: string;
        width?: number;
        height?: number;
        maxWidth?: number;
    } = $props();

    const ratio = $derived(width && height ? width / height : undefined);
</script>

<figure
    class="screenshot"
    class:capped={maxWidth}
    style:--ratio={ratio}
    style:max-width={maxWidth ? `${maxWidth}px` : undefined}
>
    {#if src}
        <img {src} {alt} {width} {height} loading="lazy" class="outline outline-outline-variant rounded-xl shadow-md w-full h-auto" />
    {:else}
        <div class="placeholder rounded-xl" role="img" aria-label={`Screenshot to come: ${alt}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm1-4h12l-3.75-5l-3 4L9 13z"/></svg>
            <span>Screenshot to come: {alt}</span>
        </div>
    {/if}
    {#if caption}
        <figcaption class="text-secondary">{caption}</figcaption>
    {/if}
</figure>

<style>
    .screenshot {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin: 0.5rem 0;
    }

    .capped {
        width: 100%;
        align-self: center;
        margin-inline: auto;
    }

    .placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        aspect-ratio: 16 / 10;
        padding: 1.5rem;
        border: 2px dashed rgb(var(--m3-scheme-outline-variant));
        background: rgb(var(--m3-scheme-surface-container-low));
        color: rgb(var(--m3-scheme-on-surface-variant));
        font-size: 0.95rem;
        text-align: center;
    }

    figcaption {
        font-size: 0.9rem;
        text-align: center;
    }
</style>

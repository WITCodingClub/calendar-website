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
    //
    // Click a screenshot to see it larger, in a popup in the middle of the
    // page. Click outside the image, or press Escape, to close it.
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

    let lightbox: HTMLDialogElement | undefined = $state();

    // Like a chat app's image viewer: a click anywhere but the image or the
    // link closes the popup. The close button is one of those places.
    function closeOnOutsideClick(event: MouseEvent) {
        const target = event.target as Element;
        if (!target.closest("img, a")) lightbox?.close();
    }
</script>

<figure
    class="screenshot"
    class:capped={maxWidth}
    style:--ratio={ratio}
    style:max-width={maxWidth ? `${maxWidth}px` : undefined}
>
    {#if src}
        <button
            type="button"
            class="enlarge"
            aria-haspopup="dialog"
            title="Click to enlarge"
            onclick={() => lightbox?.showModal()}
        >
            <img {src} {alt} {width} {height} loading="lazy" class="outline outline-outline-variant rounded-xl shadow-md w-full h-auto" />
        </button>
        <dialog bind:this={lightbox} class="lightbox" aria-label={alt} onclick={closeOnOutsideClick}>
            <button type="button" class="close" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/></svg>
            </button>
            <img {src} {alt} {width} {height} class="full rounded-lg" />
            <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- A static image file, not a page. -->
            <a class="original" href={src} target="_blank" rel="noopener">Open original</a>
        </dialog>
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

    .enlarge {
        display: block;
        width: 100%;
        padding: 0;
        border: 0;
        background: none;
        cursor: zoom-in;
        border-radius: 0.75rem;
    }

    .enlarge:focus-visible {
        outline: 3px solid rgb(var(--m3-scheme-primary));
        outline-offset: 3px;
    }

    /* The dialog covers the whole screen, and centers the image in it. A
       closed dialog keeps its default display: none. */
    .lightbox {
        width: 100vw;
        height: 100dvh;
        max-width: none;
        max-height: none;
        margin: 0;
        padding: 1.5rem;
        border: 0;
        background: transparent;
        overflow: hidden;
    }

    .lightbox[open] {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
    }

    .lightbox::backdrop {
        background: rgb(0 0 0 / 0.85);
    }

    .full {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: calc(100dvh - 6rem);
        object-fit: contain;
        box-shadow: 0 12px 40px rgb(0 0 0 / 0.5);
        cursor: default;
    }

    .original {
        color: rgb(255 255 255 / 0.8);
        font-size: 0.9rem;
        text-decoration: underline;
        text-underline-offset: 0.18em;
    }

    .original:hover {
        color: white;
    }

    .close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: grid;
        place-items: center;
        width: 2.75rem;
        height: 2.75rem;
        border: 0;
        border-radius: 9999px;
        background: rgb(255 255 255 / 0.12);
        color: white;
        cursor: pointer;
    }

    .close:hover {
        background: rgb(255 255 255 / 0.22);
    }

    /* Keep the page behind the popup from scrolling. */
    :global(html:has(dialog.lightbox[open])) {
        overflow: hidden;
    }

    @media (prefers-reduced-motion: no-preference) {
        .lightbox[open] .full {
            animation: zoom-in 0.18s ease-out;
        }

        .lightbox[open]::backdrop {
            animation: fade-in 0.18s ease-out;
        }
    }

    @keyframes zoom-in {
        from {
            opacity: 0;
            transform: scale(0.94);
        }
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }
</style>

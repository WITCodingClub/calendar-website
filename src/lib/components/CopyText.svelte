<script lang="ts">
    // A line of text the reader will paste somewhere, such as an address or a
    // command, with a button that copies it.
    //
    // By default it is a block of its own with a Copy button. Set inline to put
    // it inside a sentence: inline code with a small copy icon, which turns into
    // a checkmark once the text is copied.
    import { Button } from "m3-svelte";

    let { text, inline = false }: { text: string; inline?: boolean } = $props();

    let status = $state<"idle" | "copied" | "manual">("idle");
    let code: HTMLElement | undefined = $state();
    let timer: ReturnType<typeof setTimeout> | undefined;

    $effect(() => () => clearTimeout(timer));

    // Some browsers refuse the clipboard API, for example in an embedded view.
    // Then select the text and try the older copy command. If that fails too,
    // the text stays selected, so a keyboard shortcut copies it.
    function copyBySelecting(): boolean {
        if (!code) return false;
        const selection = window.getSelection();
        selection?.selectAllChildren(code);
        try {
            return document.execCommand("copy");
        } catch {
            return false;
        }
    }

    async function copy() {
        let done: boolean;
        try {
            await navigator.clipboard.writeText(text);
            done = true;
        } catch {
            done = copyBySelecting();
        }
        status = done ? "copied" : "manual";
        clearTimeout(timer);
        timer = setTimeout(() => (status = "idle"), done ? 2000 : 4000);
    }

    const shortcut = $derived(
        typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘C" : "Ctrl+C"
    );
</script>

{#snippet checkIcon(size: number)}
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
{/snippet}
{#snippet copyIcon(size: number)}
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V7q0-.425.288-.712T4 6t.713.288T5 7v13h10q.425 0 .713.288T16 21t-.288.713T15 22zm4-6V4z"/></svg>
{/snippet}

{#if inline}
    <span class="copy-inline">
        <code bind:this={code}>{text}</code>
        <button
            type="button"
            class="icon-button"
            class:copied={status === "copied"}
            aria-label={status === "copied" ? "Copied" : `Copy ${text}`}
            title={status === "manual" ? `Press ${shortcut} to copy` : status === "copied" ? "Copied" : "Copy"}
            onclick={copy}
        >
            {#if status === "copied"}
                {@render checkIcon(16)}
            {:else}
                {@render copyIcon(16)}
            {/if}
        </button>
    </span>
{:else}
    <div class="copy-text">
        <pre><code bind:this={code}>{text}</code></pre>
        <Button variant="tonal" onclick={copy}>
            {#if status === "manual"}
                Press {shortcut}
            {:else if status === "copied"}
                {@render checkIcon(20)}
                Copied
            {:else}
                {@render copyIcon(20)}
                Copy
            {/if}
        </Button>
    </div>
{/if}
<span class="sr-only" aria-live="polite"
    >{status === "copied" ? "Copied to clipboard" : status === "manual" ? `Selected. Press ${shortcut} to copy.` : ""}</span
>

<style>
    .copy-text {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .copy-text pre {
        flex: 1;
        min-width: 0;
    }

    .copy-inline {
        display: inline-flex;
        align-items: center;
        gap: 0.125rem;
        max-width: 100%;
        vertical-align: middle;
    }

    .copy-inline code {
        overflow-wrap: anywhere;
    }

    .icon-button {
        display: inline-grid;
        place-items: center;
        flex-shrink: 0;
        width: 1.75rem;
        height: 1.75rem;
        padding: 0;
        border: 0;
        border-radius: 9999px;
        background: transparent;
        color: rgb(var(--m3-scheme-on-surface-variant));
        cursor: pointer;
        transition: background-color 0.15s ease, color 0.15s ease;
    }

    .icon-button:hover {
        background: rgb(var(--m3-scheme-on-surface) / 0.08);
        color: rgb(var(--m3-scheme-on-surface));
    }

    .icon-button:focus-visible {
        outline: 2px solid rgb(var(--m3-scheme-primary));
        outline-offset: 1px;
    }

    .icon-button.copied {
        color: rgb(var(--m3-scheme-primary));
    }
</style>

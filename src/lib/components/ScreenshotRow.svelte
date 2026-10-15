<script lang="ts">
    // Puts screenshots side by side, such as two steps of one flow. Give each
    // <Screenshot> its width and height, and the row sizes them to the same
    // height. On a narrow screen they stack.
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet } = $props();
</script>

<div class="screenshot-row">
    {@render children()}
</div>

<style>
    .screenshot-row {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    @media (min-width: 640px) {
        .screenshot-row {
            flex-direction: row;
            align-items: flex-start;
        }

        /* --ratio is the screenshot's width over its height. Growing each one
           by its ratio gives them all the same height. */
        .screenshot-row > :global(figure) {
            flex: var(--ratio, 1) 1 0;
            min-width: 0;
        }
    }
</style>

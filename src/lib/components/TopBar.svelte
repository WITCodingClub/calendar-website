<script lang="ts">
    import { ConnectedButtons } from "m3-svelte";
    import { Button } from "m3-svelte";
    import { selected } from '$lib/store.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/state';

    onMount(() => {
        $selected = page.url.pathname;
    });

    $effect(() => {
        $selected = page.url.pathname;
    });

</script>

<div class="flex justify-center items-center mt-4 w-full px-2 sm:px-4">
    <div class="max-w-full overflow-x-auto">
    <ConnectedButtons>
        <input type="radio" name="seg" id="seg-a" bind:group={$selected} value="/" />
        <Button for="seg-a" variant="filled">Home</Button>
        <input type="radio" name="seg" id="seg-b" bind:group={$selected} value="/about" />
        <Button for="seg-b" variant="filled">About</Button>
        <input type="radio" name="seg" id="seg-e" bind:group={$selected} value="/guides" />
        <Button for="seg-e" variant="filled">Guides</Button>
        <input type="radio" name="seg" id="seg-c" bind:group={$selected} value="/contact" />
        <Button for="seg-c" variant="filled">Contact</Button>
        <input type="radio" name="seg" id="seg-d" bind:group={$selected} value="/changelog" />
        <Button for="seg-d" variant="filled">Changelog</Button>
    </ConnectedButtons>
    </div>
</div>
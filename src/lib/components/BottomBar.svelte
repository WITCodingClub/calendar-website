<script lang="ts">
    import { Button } from "m3-svelte";
    import { selected } from '$lib/store.svelte';
</script>

<footer class="flex justify-center items-center mt-auto w-full px-4 py-6">
    <div class="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
        <Button variant="text" onclick={() => $selected = "/privacy"}>
            Privacy Policy
        </Button>
        <span class="separator">•</span>
        <Button variant="text" onclick={() => $selected = "/tos"} >
            Terms of Service
        </Button>
        <span class="separator">•</span>
        <Button variant="text" onclick={() => $selected = "/security"}>
            Security
        </Button>
    </div>
</footer>

<style>
    footer {
        color: rgb(var(--m3-scheme-on-surface-variant));
    }

    .separator {
        color: rgb(var(--m3-scheme-on-surface-variant));
        opacity: 0.6;
    }
</style>

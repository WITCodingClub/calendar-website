<script lang="ts">
    import { selected } from "$lib/store.svelte";
    import { Button } from "m3-svelte";
    import { RELEASES_URL, commitUrl, formatReleaseDate, issueUrl, profileUrl, pullUrl, releaseUrl, releases } from "$lib/changelog";
</script>

<svelte:head>
	<title>WIT-Calendar - Changelog</title>
</svelte:head>

<div class="flex flex-row justify-center items-center mt-12 md:mt-24 px-4 text-center sm:text-left">
    <h1 class="roboto-flex-wit-main text-4xl sm:text-6xl md:text-7xl leading-tight">Changelog</h1>
</div>

<div class="flex flex-wrap justify-center items-center mt-4 peak gap-3 sm:gap-4 px-4">
    <Button variant="outlined" onclick={() => $selected = "/contact"}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z"/></svg>
        Contact
    </Button>
    <Button square variant="tonal" href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h14v-7h2v7q0 .825-.587 1.413T19 21zm4.7-5.3l-1.4-1.4L17.6 5H14V3h7v7h-2V6.4z"/></svg>
        Releases on GitHub
    </Button>
</div>

<!-- eslint-disable svelte/no-navigation-without-resolve -- These links go to GitHub, outside the SvelteKit app. -->
<div class="flex justify-center px-4 sm:px-6 mt-8 pb-16">
    <ol class="changelog w-full max-w-3xl">
        {#each releases as release (release.version)}
            <li class="release bg-surface-container-high">
                <header class="release-header">
                    <h2 class="text-2xl font-bold text-primary">
                        <a href={releaseUrl(release.version)} target="_blank" rel="noopener noreferrer">v{release.version}</a>
                    </h2>
                    <time datetime={release.date} class="text-secondary">{formatReleaseDate(release.date)}</time>
                </header>
                {#if release.summary}
                    <p class="text-lg font-medium text-on-surface">{release.summary}</p>
                {/if}
                <ul class="changes">
                    {#each release.changes as change (change.text)}
                        <li>
                            <span class="text-on-surface">{change.text}</span>
                            <span class="change-meta">
                                {#each change.contributors as username (username)}
                                    <a class="contributor bg-secondary-container text-on-secondary-container" href={profileUrl(username)} target="_blank" rel="noopener noreferrer" title={`${username} on GitHub`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
                                        {username}
                                    </a>
                                {/each}
                                {#if change.pr}
                                    <a class="ref text-secondary" href={pullUrl(change.pr)} target="_blank" rel="noopener noreferrer" title="Pull request">PR #{change.pr}</a>
                                {:else}
                                    {#each change.commits ?? [] as commit (commit)}
                                        <a class="ref text-secondary" href={commitUrl(commit)} target="_blank" rel="noopener noreferrer" title="Commit"><code>{commit}</code></a>
                                    {/each}
                                {/if}
                                {#each change.issues ?? [] as issue (issue)}
                                    <a class="ref text-secondary" href={issueUrl(issue)} target="_blank" rel="noopener noreferrer" title="Issue">Issue #{issue}</a>
                                {/each}
                            </span>
                        </li>
                    {/each}
                </ul>
            </li>
        {/each}
    </ol>
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

    .changelog {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .release {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1.25rem 1.5rem;
        border-radius: 1rem;
    }

    .release-header {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.25rem 1rem;
    }

    .release-header a:hover {
        text-decoration: underline;
        text-underline-offset: 0.18em;
    }

    .release p {
        margin: 0;
    }

    .changes {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin: 0.25rem 0 0;
        padding-left: 1.25rem;
        list-style: disc;
        line-height: 1.6;
    }

    .change-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.375rem 0.5rem;
        margin-top: 0.25rem;
    }

    .contributor {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        padding: 0.125rem 0.625rem 0.125rem 0.5rem;
        border-radius: 9999px;
        font-size: 0.8125rem;
        font-weight: 600;
        line-height: 1.5;
        transition: filter 0.15s ease;
    }

    .contributor:hover {
        filter: brightness(1.12);
    }

    .ref {
        font-size: 0.8125rem;
        text-decoration: underline;
        text-underline-offset: 0.18em;
        text-decoration-color: rgb(var(--m3-scheme-secondary) / 0.4);
    }

    .ref:hover {
        text-decoration-color: rgb(var(--m3-scheme-secondary));
    }
</style>

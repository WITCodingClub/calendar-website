<script lang="ts">
    import { resolve } from "$app/paths";
    import { rmpSummary } from "$lib/catalog";
    import CatalogPage from "$lib/components/catalog/CatalogPage.svelte";
    import Pager from "$lib/components/catalog/Pager.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>WIT-Calendar - Instructors</title>
</svelte:head>

<CatalogPage title="Instructors" back={{ label: "Course Catalog", href: resolve("/catalog") }}>
    <form method="GET" class="filters card">
        <label>
            Search
            <input type="search" name="q" value={data.q} placeholder="Name" />
        </label>
        <label>
            Teaching in
            <select name="term_uid">
                <option value="">Any term</option>
                {#each data.terms as term (term.uid)}
                    <option value={term.uid} selected={String(term.uid) === data.termUid}>{term.name}</option>
                {/each}
            </select>
        </label>
        <button type="submit">Search</button>
    </form>

    {#if data.instructors.length === 0}
        <p class="card">No instructors match. Try a first or last name.</p>
    {:else}
        <ul class="list" id="instructors">
            {#each data.instructors as person (person.pub_id)}
                <li>
                    <a href={resolve("/catalog/instructors/[id]", { id: person.pub_id })}>{person.name}</a>
                    <p class="hint">{[person.department ?? person.title, rmpSummary(person.rmp)].filter(Boolean).join(" · ")}</p>
                </li>
            {/each}
        </ul>
        <Pager page={data.meta.page} totalPages={data.meta.total_pages} />
    {/if}
</CatalogPage>

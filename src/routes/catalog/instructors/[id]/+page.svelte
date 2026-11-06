<script lang="ts">
    import { resolve } from "$app/paths";
    import { oneDecimal } from "$lib/catalog";
    import CatalogPage from "$lib/components/catalog/CatalogPage.svelte";
    import SectionRow from "$lib/components/catalog/SectionRow.svelte";
    import TermPicker from "$lib/components/catalog/TermPicker.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    const person = $derived(data.instructor);
    const rmp = $derived(person.rmp);
    const subtitle = $derived([...new Set([person.title, person.department, person.school].filter(Boolean))].join(" · "));
    const sections = $derived(person.sections ?? []);
</script>

<svelte:head>
	<title>WIT-Calendar - {person.name}</title>
</svelte:head>

<CatalogPage title={person.name} {subtitle} back={{ label: "Instructors", href: resolve("/catalog/instructors") }}>
    <section class="card" id="ratings">
        <h2>Ratings</h2>
        {#if rmp}
            <dl class="stats">
                <div><dt>Rating</dt><dd>{oneDecimal(rmp.avg_rating)} / 5</dd></div>
                <div><dt>Difficulty</dt><dd>{oneDecimal(rmp.avg_difficulty)} / 5</dd></div>
                <div><dt>Would take again</dt><dd>{rmp.would_take_again_percent === null ? "–" : `${Math.round(Number(rmp.would_take_again_percent))}%`}</dd></div>
                <div><dt>Ratings</dt><dd>{rmp.num_ratings}</dd></div>
            </dl>
            {#if person.rmp_tags.length > 0}
                <p class="hint">{person.rmp_tags.map((tag) => tag.name).join(" · ")}</p>
            {/if}
            {#if person.recent_reviews.length > 0}
                <ul class="reviews" id="reviews">
                    {#each person.recent_reviews as review (review.pub_id)}
                        <li>
                            <p class="hint">{[review.course_name, review.rated_on?.slice(0, 7)].filter(Boolean).join(" · ")}</p>
                            <p>{review.comment}</p>
                        </li>
                    {/each}
                </ul>
            {/if}
            <p class="hint">
                Students wrote these reviews on {person.reviews_source}.
                {#if person.review_count > person.recent_reviews.length}
                    These are the {person.recent_reviews.length} newest of {person.review_count}.
                {/if}
            </p>
        {:else}
            <p>No ratings yet.</p>
        {/if}
    </section>

    <section id="sections" class="flex flex-col gap-4">
        <h2>Sections{data.term ? ` in ${data.term.name}` : ""}</h2>
        <TermPicker terms={data.terms} selected={data.term?.uid ?? null} />
        {#if sections.length === 0}
            <p class="card">No sections{data.term ? ` in ${data.term.name}` : ""}. Pick another term to see its sections.</p>
        {:else}
            <ul class="list">
                {#each sections as section (section.crn)}
                    <SectionRow {section} showCourse />
                {/each}
            </ul>
        {/if}
    </section>
</CatalogPage>

<style>
    .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }

    .stats dt {
        font-size: 0.85rem;
        color: var(--color-on-surface-variant);
    }

    .stats dd {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-on-surface);
    }

    .reviews {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .reviews p {
        margin: 0;
    }
</style>

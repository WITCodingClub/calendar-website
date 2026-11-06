<script lang="ts">
    import { resolve } from "$app/paths";
    import { seasons } from "$lib/catalog";
    import CatalogPage from "$lib/components/catalog/CatalogPage.svelte";
    import Requisite from "$lib/components/catalog/Requisite.svelte";
    import SectionRow from "$lib/components/catalog/SectionRow.svelte";
    import TermPicker from "$lib/components/catalog/TermPicker.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    const course = $derived(data.course);
    const subtitle = $derived.by(() => {
        const offered = seasons(course.typically_offered);
        return [course.credit_hours ? `${course.credit_hours} credits` : null, offered ? `Usually offered ${offered}` : null]
            .filter(Boolean)
            .join(" · ");
    });
    const sections = $derived(course.sections ?? []);
    const codeParam = (code: string) => code.replace(/\s+/g, "");
</script>

<svelte:head>
	<title>WIT-Calendar - {course.code}: {course.title}</title>
	{#if course.description}<meta name="description" content={course.description} />{/if}
</svelte:head>

<CatalogPage title={`${course.code}: ${course.title}`} {subtitle} back={{ label: "Courses", href: resolve("/catalog/courses") }}>
    <section class="card" id="about">
        <p>{course.description ?? "No catalog description for this course yet."}</p>
        <dl>
            {#if course.prerequisites}
                <dt>Prerequisites</dt>
                <dd><Requisite node={course.prerequisites} /></dd>
            {/if}
            {#if course.corequisites.length > 0}
                <dt>Corequisites</dt>
                <dd>{#each course.corequisites as ref, index (index)}{#if index > 0}, {/if}<Requisite node={ref} />{/each}</dd>
            {/if}
            {#if course.mutual_exclusions.length > 0}
                <dt>Cannot also take</dt>
                <dd>{#each course.mutual_exclusions as ref, index (index)}{#if index > 0}, {/if}<Requisite node={ref} />{/each}</dd>
            {/if}
            {#if course.unlocks.length > 0}
                <dt>Prerequisite for</dt>
                <dd>{#each course.unlocks as unlocked, index (unlocked.code)}{#if index > 0}, {/if}<a href={resolve("/catalog/courses/[code]", { code: codeParam(unlocked.code) })} title={unlocked.title ?? undefined}>{unlocked.code}</a>{/each}</dd>
            {/if}
            {#if course.restrictions.length > 0}
                <dt>Restrictions</dt>
                <dd>
                    {#each course.restrictions as group, index (index)}
                        <div><strong>{group.heading}:</strong> {group.values.join(", ")}</div>
                    {/each}
                </dd>
            {/if}
            {#if course.department}
                <dt>Department</dt>
                <dd>{course.department}</dd>
            {/if}
        </dl>
    </section>

    <section id="sections" class="flex flex-col gap-4">
        <h2>Sections{data.term ? ` in ${data.term.name}` : ""}</h2>
        <TermPicker terms={data.terms} selected={data.term?.uid ?? null} />
        {#if sections.length === 0}
            <p class="card">No sections{data.term ? ` in ${data.term.name}` : ""}. Pick another term to see its sections.</p>
        {:else}
            <ul class="list">
                {#each sections as section (section.crn)}
                    <SectionRow {section} />
                {/each}
            </ul>
        {/if}
    </section>
</CatalogPage>

<style>
    dl {
        display: grid;
        gap: 0.25rem 1rem;
        margin: 1rem 0 0;
    }

    dt {
        font-size: 0.85rem;
        color: var(--color-on-surface-variant);
        margin-top: 0.5rem;
    }

    dd {
        margin: 0;
    }
</style>

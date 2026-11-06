<script lang="ts">
    import { resolve } from "$app/paths";
    import CatalogPage from "$lib/components/catalog/CatalogPage.svelte";
</script>

<svelte:head>
	<title>WIT-Calendar - Course Catalog</title>
</svelte:head>

<CatalogPage title="Course Catalog" subtitle="Browse Wentworth courses and instructors. No sign-in needed.">
    <ul class="list">
        <li>
            <h2><a href={resolve("/catalog/courses")}>Courses</a></h2>
            <p class="hint">Every course in the catalog: its description, prerequisites, and the sections of each term.</p>
        </li>
        <li>
            <h2><a href={resolve("/catalog/instructors")}>Instructors</a></h2>
            <p class="hint">Everyone who teaches a section, with ratings from Rate My Professors.</p>
        </li>
    </ul>
</CatalogPage>

<script lang="ts">
    import { onMount } from "svelte";
    import { selected } from "$lib/store.svelte";
    import { Button } from "m3-svelte";
    import { resolve } from "$app/paths";
    import { GITHUB_URL, ORGANIZATION, WEB_STORE_URL, jsonLdScript, structuredData } from "$lib/site";

    let authStatus: { authenticated: boolean; admin: boolean } | null = null;

    onMount(async () => {
        try {
            const res = await fetch("/session/status", { credentials: "include" });
            if (res.ok) authStatus = await res.json();
        } catch {
            // stay null → show Sign In
        }
    });
</script>

<svelte:head>
	<title>WIT-Calendar</title>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- the data is ours, and jsonLdScript escapes "<" -->
	{@html jsonLdScript(structuredData())}
</svelte:head>

<div class="flex flex-row justify-center items-center mt-12 md:mt-24 px-4 text-center sm:text-left">
    <svg aria-hidden="true" class="w-14 h-14 md:w-30 md:h-30" viewBox="0 0 190 203" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="17" width="182" height="182" rx="12" stroke="#060606" stroke-width="8"/>
        <rect x="53" width="16" height="35" rx="8" fill="black"/>
        <rect x="120" width="16" height="35" rx="8" fill="black"/>
        <rect x="23" y="43" width="30" height="30" fill="#D92228" fill-opacity="0.3"/>
        <rect x="80" y="43" width="30" height="30" fill="#D92228" fill-opacity="0.3"/>
        <rect x="137" y="43" width="30" height="30" fill="#D92228" fill-opacity="0.3"/>
        <rect x="23" y="93" width="30" height="30" fill="#D92228" fill-opacity="0.3"/>
        <rect x="80" y="93" width="30" height="30" fill="#D92228" fill-opacity="0.3"/>
        <rect x="137" y="93" width="30" height="30" fill="#D92228" fill-opacity="0.3"/>
        <rect x="23" y="143" width="30" height="30" fill="#D92228" fill-opacity="0.3"/>
        <rect x="80" y="143" width="30" height="30" fill="#D92228" fill-opacity="0.3"/>
        <rect x="137" y="143" width="30" height="30" fill="#D92228" fill-opacity="0.3"/>
        <path d="M40.2827 154.061L11.23 65.1328H47.5459L64.2695 115.792C64.6357 117.135 64.9613 118.64 65.2461 120.309C65.5716 121.936 65.8158 123.014 65.9785 123.543H65.9175C66.0396 122.974 66.182 122.221 66.3447 121.285C66.5482 120.349 66.7313 119.658 66.894 119.21L84.7163 65.1328H115.112L132.812 115.304C133.626 118.071 134.134 120.003 134.338 121.102C134.582 122.201 134.765 123.055 134.887 123.666H135.009C135.091 123.096 135.233 122.241 135.437 121.102C135.681 119.922 135.884 119.108 136.047 118.661L153.198 65.1328H178.344L149.536 154.061H114.99L95.2754 100.289C95.1126 99.8822 95.0109 99.4753 94.9702 99.0684C94.9295 98.6615 94.8888 98.2139 94.8481 97.7256H94.7871C94.7464 98.2139 94.7057 98.6615 94.665 99.0684C94.665 99.4753 94.5837 99.8822 94.4209 100.289L75.8052 154.061H40.2827Z" fill="#E3C36C"/>
    </svg>
    <h1 class="roboto-flex-wit-main text-4xl sm:text-6xl md:text-7xl leading-tight"><span class="sr-only">W</span>IT-Calendar</h1>
</div>

<div class="flex flex-wrap justify-center items-center mt-4 peak gap-3 sm:gap-4 px-4">
    <Button variant="outlined" onclick={() => $selected = "/about"}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11.95 18q.525 0 .888-.363t.362-.887t-.362-.888t-.888-.362t-.887.363t-.363.887t.363.888t.887.362m.05 4q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m.1-14.3q.625 0 1.088.4t.462 1q0 .55-.337.975t-.763.8q-.575.5-1.012 1.1t-.438 1.35q0 .35.263.588t.612.237q.375 0 .638-.25t.337-.625q.1-.525.45-.937t.75-.788q.575-.55.988-1.2t.412-1.45q0-1.275-1.037-2.087T12.1 6q-.95 0-1.812.4T8.975 7.625q-.175.3-.112.638t.337.512q.35.2.725.125t.625-.425q.275-.375.688-.575t.862-.2"/></svg>
        More Info
    </Button>
    <Button variant="filled" onclick={() => window.open('https://chromewebstore.google.com/detail/wit-calendar/aceelinogfcceklkpacakdeddnaakicj', '_blank', 'noopener,noreferrer')}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m16 8.4l-8.9 8.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7L14.6 7H7q-.425 0-.712-.288T6 6t.288-.712T7 5h10q.425 0 .713.288T18 6v10q0 .425-.288.713T17 17t-.712-.288T16 16z"/></svg>
        Web Store
    </Button>
        {#if authStatus?.authenticated}
        <Button variant="filled" onclick={() => window.location.href = authStatus?.admin ? "/admin" : "/dashboard"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960">
                <path fill="currentColor" d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Z"/>
            </svg>
            {authStatus?.admin ? "Admin Panel" : "My Dashboard"}
        </Button>
    {:else}
        <Button variant="filled" onclick={() => window.location.href = "/users/sign_in"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960">
                <path fill="currentColor" d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/>
            </svg>
            Sign In
        </Button>
    {/if}
</div>


<div class="flex justify-center items-center mt-8 px-4 sm:px-6">
    <div class="rounded-3xl w-full max-w-6xl px-4 sm:px-8 md:px-16 py-8 sm:py-12">
        <div class="flex flex-col sm:flex-row justify-center items-end gap-6 md:gap-8">
            <img src="/primary_wit_ss.webp" alt="Third WIT-Calendar" class="outline outline-tertiary w-full max-w-[420px] sm:w-[clamp(220px,24vw,420px)] lg:w-[clamp(240px,26vw,460px)] lg:max-w-[460px] h-auto aspect-16/10 object-cover rounded-xl shadow-md transition-transform duration-200 ease-in-out sm:transform sm:rotate-2 sm:translate-y-[8px] sm:hover:rotate-1 sm:hover:translate-y-[2px] hover:scale-[1.03] hover:shadow-xl order-2 sm:order-0 mx-auto" />
            <img src="/secondary_wit_ss.webp" alt="Primary WIT-Calendar" class="outline outline-primary w-full max-w-[640px] sm:w-[clamp(300px,36vw,640px)] lg:w-[clamp(360px,40vw,720px)] lg:max-w-[720px] h-auto aspect-16/10 object-cover rounded-xl shadow-lg transition-transform duration-200 ease-in-out sm:transform sm:-translate-y-[8px] z-10 sm:hover:-translate-y-[6px] hover:scale-[1.03] hover:shadow-xl order-1 sm:order-1 mx-auto" />
            <img src="/third_wit_ss.webp" alt="Secondary WIT-Calendar" class="outline outline-tertiary w-full max-w-[420px] sm:w-[clamp(220px,24vw,420px)] lg:w-[clamp(240px,26vw,460px)] lg:max-w-[460px] h-auto aspect-16/10 object-cover rounded-xl shadow-md transition-transform duration-200 ease-in-out sm:transform sm:-rotate-2 sm:translate-y-[8px] sm:hover:-rotate-1 sm:hover:translate-y-[2px] hover:scale-[1.03] hover:shadow-xl order-2 sm:order-2 mx-auto" />
        </div>
    </div>
</div>

<div class="flex justify-center px-4 sm:px-6 pb-8">
    <div class="home-content w-full max-w-3xl text-lg text-secondary">
        <h2>Your class schedule, in your calendar</h2>
        <p>
            WIT-Calendar is a free Chrome extension for students at {ORGANIZATION.school}.
            It imports your class schedule into your calendar, so every lecture, lab, and final exam
            shows up next to the rest of your week. It supports all major calendars, including
            Google Calendar, Microsoft Outlook, and Apple Calendar.
        </p>

        <h2>How it works</h2>
        <ol>
            <li>Install WIT-Calendar from the <a href={WEB_STORE_URL} target="_blank" rel="external noopener noreferrer">Chrome Web Store</a>.</li>
            <li>Open the extension. It gets your schedule, processes it, and gives you a calendar link.</li>
            <li>Add the link to Outlook, Apple Calendar, or any calendar app. You can also connect your Google account, so changes reach Google Calendar automatically.</li>
            <li>Choose the event alerts, colors, and titles in the extension, or in your dashboard after you <a href="/users/sign_in" rel="external" data-sveltekit-reload>sign in</a>.</li>
        </ol>

        <h2>For developers and AI agents</h2>
        <p>
            WIT-Calendar also publishes the Wentworth course catalog as a public, read-only API.
            It needs no API key.
        </p>
        <!-- eslint-disable svelte/no-navigation-without-resolve -->
        <ul>
            <li><a href="/docs/api" data-sveltekit-reload>Course Catalog API reference</a> (also as <a href="/docs/api.md" data-sveltekit-reload>markdown</a>)</li>
            <li><a href="/docs/api/openapi.json" data-sveltekit-reload>OpenAPI description</a> and <a href="/docs/api/schema.graphql" data-sveltekit-reload>GraphQL schema</a></li>
            <li><a href="/llms.txt" data-sveltekit-reload>llms.txt</a>, an index of this site for AI agents</li>
            <li><a href={GITHUB_URL} rel="external">Source code on GitHub</a></li>
        </ul>
        <!-- eslint-enable svelte/no-navigation-without-resolve -->

        <h2>Who makes WIT-Calendar</h2>
        <p>
            The {ORGANIZATION.name}, a student club at {ORGANIZATION.school} in {ORGANIZATION.locality},
            makes and runs WIT-Calendar. Read <a href={resolve('/about')}>more about the project</a>, or
            <a href={resolve('/contact')}>contact us</a>.
        </p>
    </div>
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

    .home-content h2 {
        margin-top: 2rem;
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-primary);
    }

    .home-content p,
    .home-content ol,
    .home-content ul {
        line-height: 1.6;
    }

    .home-content ol {
        list-style: decimal;
        padding-left: 1.5rem;
    }

    .home-content ul {
        list-style: disc;
        padding-left: 1.5rem;
    }

    .home-content a {
        color: var(--color-primary);
        text-decoration: underline;
    }


</style>

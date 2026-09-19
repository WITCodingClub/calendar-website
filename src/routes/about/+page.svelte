<script lang="ts">
    import { selected } from "$lib/store.svelte";
    import { Button } from "m3-svelte";
</script>

<svelte:head>
	<title>WIT-Calendar - About</title>
</svelte:head>

<div class="flex flex-row justify-center items-center mt-12 md:mt-24 px-4 text-center sm:text-left">
    <h1 class="roboto-flex-wit-main text-4xl sm:text-6xl md:text-7xl leading-tight">About</h1>
</div>

<div class="flex flex-wrap justify-center items-center mt-4 peak gap-3 sm:gap-4 px-4">
    <Button variant="outlined" onclick={() => $selected = "/"}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z"/></svg>
        Back Home
    </Button>
    <Button variant="outlined" onclick={() => $selected = "/contact"}>
        Contact
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712"/></svg>
    </Button>
</div>


<div class="flex justify-center items-center mt-8 px-4 sm:px-6">
    <p class="text-center text-lg font-medium text-secondary">
        WIT-Calendar is a Chrome extension that allows you to easily import your classes into your calendar!
        <br>
        It supports all major calendars, including Google Calendar, Microsoft Outlook, and Apple Calendar.
        <br>
        <br>
        Check out the status page for the server below!
        <br>
        <br>
        <Button square variant="tonal" onclick={() => window.open('https://stats.uptimerobot.com/QS76oPqfzz', '_blank')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h14v-7h2v7q0 .825-.587 1.413T19 21zm4.7-5.3l-1.4-1.4L17.6 5H14V3h7v7h-2V6.4z"/></svg>        
            Status Page
        </Button>
    </p>
</div>

<div class="invisible">
    <img src="/settings.png" alt="Settings page" class="outline outline-tertiary w-full max-w-[420px] sm:w-[clamp(220px,24vw,420px)] lg:w-[clamp(240px,26vw,460px)] lg:max-w-[460px] h-auto aspect-16/10 object-cover object-top rounded-xl shadow-md transition-transform duration-200 ease-in-out sm:transform sm:rotate-2 sm:translate-y-[8px] sm:hover:rotate-1 sm:hover:translate-y-[2px] hover:scale-[1.03] hover:shadow-xl order-2 sm:order-0 mx-auto" />
    <img src="/calendar.png" alt="Calendar page" class="outline outline-primary w-full max-w-[640px] sm:w-[clamp(300px,36vw,640px)] lg:w-[clamp(360px,40vw,720px)] lg:max-w-[720px] h-auto aspect-16/10 object-cover object-top rounded-xl shadow-lg transition-transform duration-200 ease-in-out sm:transform sm:-translate-y-[8px] z-10 sm:hover:-translate-y-[6px] hover:scale-[1.03] hover:shadow-xl order-1 sm:order-1 mx-auto" />
    <img src="/help.png" alt="Help page" class="outline outline-tertiary w-full max-w-[420px] sm:w-[clamp(220px,24vw,420px)] lg:w-[clamp(240px,26vw,460px)] lg:max-w-[460px] h-auto aspect-16/10 object-cover object-top rounded-xl shadow-md transition-transform duration-200 ease-in-out sm:transform sm:-rotate-2 sm:translate-y-[8px] sm:hover:-rotate-1 sm:hover:translate-y-[2px] hover:scale-[1.03] hover:shadow-xl order-2 sm:order-2 mx-auto" />
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

 
</style>

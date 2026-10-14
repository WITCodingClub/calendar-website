<script lang="ts">
    import { resolve } from "$app/paths";
    import Guide from "$lib/components/Guide.svelte";
    import Screenshot from "$lib/components/Screenshot.svelte";
    import { CHROME_WEB_STORE_URL, DISCORD_URL, FIREFOX_WEB_STORE_URL } from "$lib/site";
</script>

<Guide slug="getting-started">
    <p>
        The tutorial in the extension gets your classes into your calendar. This guide covers the same
        steps in more detail, and the settings that come after.
    </p>

    <h2 id="install">Install the extension</h2>
    <p>
        Install WIT-Calendar from the <a href={CHROME_WEB_STORE_URL} target="_blank" rel="external noopener noreferrer">Chrome Web Store</a>
        or <a href={FIREFOX_WEB_STORE_URL} target="_blank" rel="external noopener noreferrer">Firefox Add-ons</a>.
        Chrome, Edge, Brave, and Opera all install from the Chrome Web Store.
    </p>
    <p>Pin the extension to your toolbar, so you can open it in one click.</p>
    <Screenshot alt="The WIT-Calendar extension pinned to the browser toolbar" />

    <h2 id="sign-in">Sign in</h2>
    <p>Open the extension and sign in with your WIT Google account. After the first time, you can also sign in with a passkey.</p>
    <Screenshot alt="The sign-in screen in the extension" />

    <h2 id="get-schedule">Get your schedule</h2>
    <ol>
        <li>Choose a term.</li>
        <li>The extension gets your schedule and processes it. This takes a few seconds.</li>
        <li>Check that your classes, labs, and their rooms are right.</li>
    </ol>
    <Screenshot alt="The extension showing a processed schedule for one term" />

    <h2 id="add-to-calendar">Add it to your calendar</h2>
    <h3>Google Calendar</h3>
    <p>
        Connect your Google account in the extension. Your classes go straight into Google Calendar, and
        changes to your schedule reach it automatically.
    </p>
    <Screenshot alt="Connecting a Google account in the extension" />

    <h3>Outlook, Apple Calendar, and other apps</h3>
    <p>Copy your calendar link from the extension, then subscribe to it in your calendar app:</p>
    <ul>
        <li><strong>Outlook:</strong> select <strong>Add calendar</strong>, then <strong>Subscribe from web</strong>, and paste the link.</li>
        <li><strong>Apple Calendar:</strong> select <strong>File</strong>, then <strong>New Calendar Subscription</strong>, and paste the link.</li>
        <li><strong>Other apps:</strong> look for an option to add a calendar by URL.</li>
    </ul>
    <Screenshot alt="The calendar link and its copy button in the extension" />

    <h2 id="customize">Make it yours</h2>
    <p>Change these in the extension, or in your dashboard after you <a href="/users/sign_in" rel="external" data-sveltekit-reload>sign in</a> on this site:</p>
    <ul>
        <li><strong>Colors:</strong> pick any color for each class.</li>
        <li><strong>Titles:</strong> choose how each class's events are titled.</li>
        <li><strong>Alerts:</strong> choose when you get a reminder before each class, or turn reminders off.</li>
        <li><strong>University events:</strong> give holidays and deadlines their own color and alerts.</li>
    </ul>
    <p>Your colors and titles stay the same when your schedule updates.</p>
    <Screenshot alt="The color, title, and alert settings for one class" />

    <h2 id="next">Next steps</h2>
    <ul>
        <li><a href={resolve("/guides")}>See every feature</a> and its guide.</li>
        <li><a href={resolve("/guides/mcp")}>Connect an AI assistant</a> to ask about your week.</li>
        <li>Stuck? Ask on <a href={DISCORD_URL} target="_blank" rel="external noopener noreferrer">Discord</a>, or <a href={resolve("/contact")}>contact us</a>.</li>
    </ul>
</Guide>

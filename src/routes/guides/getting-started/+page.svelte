<script lang="ts">
    import { resolve } from "$app/paths";
    import Guide from "$lib/components/Guide.svelte";
    import Screenshot from "$lib/components/Screenshot.svelte";
    import ScreenshotRow from "$lib/components/ScreenshotRow.svelte";
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
    <Screenshot 
        src="/guides/getting-started/extension-toolbar.webp" 
        width={356}
        height={253}
        maxWidth={356}
        alt="The WIT-Calendar extension pinned to the browser toolbar"
    />

    <h2 id="sign-in">Sign in</h2>
    <p>Open the extension and sign in with your WIT Google account. Then, a new tab will open to login to your WIT LeopardWeb account. Sign in with your WIT email and password.</p>
    <p>After the first time, you can also sign in with a passkey.</p>
    <ScreenshotRow>
        <Screenshot
            src="/guides/getting-started/google-button.webp"
            width={519}
            height={543}
            alt="The extension's welcome screen, with the Sign in with Google button highlighted"
        />
        <Screenshot
            src="/guides/getting-started/google-sign-in.webp"
            width={860}
            height={733}
            alt="Google's window for choosing a wit.edu account, next to the extension's Signing in screen"
        />
    </ScreenshotRow>
    <ScreenshotRow>
        <Screenshot
            src="/guides/getting-started/leopardweb.webp"
            width={1748}
            height={933}
            alt="The LeopardWeb sign-in screen, with the email and password fields highlighted"
        />
    </ScreenshotRow>

    <h2 id="get-schedule">Get your schedule</h2>
    <ol>
        <li>Choose a term.</li>
        <li>The extension gets your schedule and processes it. This takes a few seconds.</li>
        <li>Check that your classes, labs, and their rooms are right.</li>
    </ol>
    <Screenshot src="/guides/getting-started/schedule.webp" alt="The extension showing a processed schedule for one term" />

    <h2 id="add-to-calendar">Add it to your calendar</h2>
    <h3>Google Calendar</h3>
    <p>
        Your classes automatically go straight into your WIT Google account's Google Calendar, however, if you wish, you can connect a secondary Google account in the extension.
        This will allow you to use the extension with your personal Google account, and any changes to your schedule reach it automatically.
    </p>
    <p>To connect a secondary Google account, go to the Settings tab in the extension, then under the "Connected Accounts" section, click the <strong>Add Account</strong> button.</p>
    <Screenshot src="/guides/getting-started/connect-google-accs.webp" alt="Connecting a Google account in the extension" />

    <h3>Outlook, Apple Calendar, and other apps</h3>
    <p>Copy your calendar link from the extension, then subscribe to it in your calendar app:</p>
    <ul>
        <li><strong>Outlook:</strong> select <strong>Add calendar</strong>, then <strong>Subscribe from web</strong>, and paste the link.</li>
        <li><strong>Apple Calendar:</strong> select <strong>File</strong>, then <strong>New Calendar Subscription</strong>, and paste the link.</li>
        <li><strong>Other apps:</strong> look for an option to add a calendar by URL.</li>
    </ul>
    <Screenshot src="/guides/getting-started/calendar-link.webp" alt="The calendar link and its copy button in the extension" />

    <h2 id="customize">Make it yours</h2>
    <p>Change these in the extension, or in your dashboard after you <a href="/users/sign_in" rel="external" data-sveltekit-reload>sign in</a> on this site:</p>
    <ul>
        <li><strong>Colors:</strong> pick any color for each class.</li>
        <li><strong>University events:</strong> give holidays and deadlines their own color and alerts.</li>
        <li><strong>Titles:</strong> choose how each class's events are titled.</li>
        <li><strong>Alerts:</strong> choose when you get a reminder before each class, or turn reminders off.</li>
    </ul>
    <p>Your colors and titles stay the same when your schedule updates.</p>
    <ScreenshotRow>
        <Screenshot
            src="/guides/getting-started/colors.webp"
            width={895}
            height={570}
            alt="The extension's settings, with the color list open for the default lecture color"
        />
        <Screenshot
            src="/guides/getting-started/uni-events.webp"
            width={890}
            height={734}
            alt="The university events settings: the sync switch, the color, the reminders, and the event types to sync"
        />
    </ScreenshotRow>
    <ScreenshotRow>
        <Screenshot
            src="/guides/getting-started/titles.webp"
            width={672}
            height={766}
            alt="The Edit Calendar Event window, with the course title, description, and location fields highlighted"
        />
        <Screenshot
            src="/guides/getting-started/alerts.webp"
            width={671}
            height={808}
            alt="The Edit Calendar Event window, with the reminders highlighted"
        />
    </ScreenshotRow>

    <h2 id="pro-tip">Pro Tip:</h2>
    <p>You can open the extension in a new tab by clicking the icon at the top right of the extension, as shown below.</p>
    <Screenshot src="/guides/getting-started/open-new-tab.webp" alt="The extension's icon at the top right, with the new tab option highlighted" />
    <p>This is what it looks like when you open the extension in a new tab:</p>
    <Screenshot src="/guides/getting-started/in-new-tab.webp" alt="The extension's new tab, with the schedule and settings open" />


    <h2 id="next">Stuck?</h2>
    <p>Ask on <a href={DISCORD_URL} target="_blank" rel="external noopener noreferrer">Discord</a> or <a href={resolve("/contact")}>contact us</a> if you need help.</p>
</Guide>

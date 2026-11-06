<script lang="ts">
    import { resolve } from "$app/paths";
    import Guide from "$lib/components/Guide.svelte";
    import Screenshot from "$lib/components/Screenshot.svelte";
    import ScreenshotRow from "$lib/components/ScreenshotRow.svelte";
    import { DISCORD_URL } from "$lib/site";
</script>

<Guide slug="dashboard">
    <p>
        Your dashboard on this site has the same settings and information as the extension, plus a few that only live here.
        Use it on any computer or phone, even one without the extension.
    </p>

    <h2 id="open">Open your dashboard</h2>
    <p>
        <a href="/users/sign_in" rel="external" data-sveltekit-reload>Sign in</a> with your WIT Google account
        or a passkey. Once you're signed in, you should see the Overview page.
    </p>
    <Screenshot
        src="/guides/dashboard/signin.webp"
        width={2560}
        height={1362}
        maxWidth={400}
        alt="The dashboard's Sign in page, with the Google and passkey buttons"
    />

    <h2 id="overview">Overview</h2>
    <p>The first page shows where you are:</p>
    <ul>
        <li><strong>Current Term</strong> and <strong>Next Term</strong>, with how many courses you're taking.</li>
        <li><strong>Calendar:</strong> whether a calendar is connected.</li>
    </ul>
    <p>
        The menu on the side lists every page. On a phone, it moves to the bottom of the screen, and the less
        common pages are under <strong>More</strong>.
    </p>
    <Screenshot
        src="/guides/dashboard/overview.webp"
        width={2082}
        height={1352}
        alt="The dashboard's Overview page, with the menu on the side, the current and next term, and the calendar connection"
    />

    <h2 id="schedule">Schedule</h2>
    <p>
        <strong>My Schedule</strong> shows the courses you imported with the extension. Choose a term, then
        switch between the <strong>List</strong>, <strong>Week</strong>, and <strong>Month</strong> views.
    </p>
    <Screenshot
        src="/guides/dashboard/schedule.webp"
        width={2082}
        height={1352}
        alt="My Schedule in week view, with the term menu and the List, Week, and Month buttons"
    />

    <h2 id="preferences">Preferences</h2>
    <p><strong>Calendar Preferences</strong> controls how your classes look in your calendar:</p>
    <ul>
        <li>
            <strong>Global Defaults:</strong> templates for every event's title, description, and location. For
            example, a title template of <code>{"{{subject}} {{course_number}} — {{title}}"}</code> gives you titles
            like "COMP 2350 — Object-Oriented Design".
        </li>
        <li><strong>University Calendar Events:</strong> add holidays, deadlines, and other events from the academic calendar, and choose which kinds you get. Holidays always sync.</li>
    </ul>
    <ScreenshotRow>
        <Screenshot
            src="/guides/dashboard/advanced-editing.webp"
            width={1639}
            height={1076}
            alt="The Advanced editing reference, listing the variables you can use in event titles, descriptions, and locations"
        />
        <Screenshot
            src="/guides/dashboard/uni-events.webp"
            width={1216}
            height={1074}
            alt="The University Calendar Events settings, with the sync checkbox and the categories to sync"
        />
    </ScreenshotRow>

    <h2 id="accounts">Accounts</h2>
    <p>
        <strong>Connected Accounts</strong> is where you connect the calendars your classes go to. Your classes go
        straight into a connected calendar, and changes reach it automatically.
    </p>
    <ul>
        <li><strong>Google Calendar:</strong> connect your WIT Google account, or add another one, such as a personal account.</li>
        <li><strong>Outlook Calendar:</strong> select <strong>Connect Outlook</strong> and sign in with your Microsoft account.</li>
    </ul>
    <p>Select <strong>Disconnect</strong> next to an account to stop syncing to it.</p>
    <Screenshot
        src="/guides/dashboard/connected-accounts.webp"
        width={1234}
        height={638}
        alt="Connected Accounts, with two Google accounts, their Disconnect buttons, and the Add account button"
    />

    <h2 id="ics-feed">ICS Feed</h2>
    <p>
        For Apple Calendar or any other app, copy <strong>Your personal ICS URL</strong> and subscribe to it in the
        app. The feed updates every time you sync with the extension. The
        <a href={resolve("/guides/getting-started#add-to-calendar")}>Getting started guide</a> has the steps for Outlook and Apple
        Calendar.
    </p>
    <p>
        <strong>Keep the link private.</strong> Anyone with it can see your full schedule, without a password.
    </p>
    <Screenshot
        src="/guides/dashboard/ics-url.webp"
        width={617}
        height={563}
        maxWidth={400}
        alt="The ICS URL, with the Your personal ICS URL and the Copy button"
    />

    <h2 id="notifications">Notifications</h2>
    <ul>
        <li><strong>Google Calendar notifications:</strong> select <strong>Disable</strong> to pause the reminders for your classes, and <strong>Enable</strong> to turn them back on.</li>
        <li><strong>University calendar events:</strong> keep the default reminder, turn reminders off, or choose a custom time. A custom reminder can be a notification or an email.</li>
        <li><strong>Friend emails:</strong> turn emails about friend requests and friendship end dates on or off.</li>
    </ul>
    <Screenshot
        src="/guides/dashboard/notifications.webp"
        width={617}
        height={753}
        maxWidth={400}
        alt="Notifications, with the class, university event, and friend email settings"
    />

    <h2 id="friends">Friends</h2>
    <p>
        The <strong>Friends</strong> page has your friends, your friend requests, and your private groups. Open a
        friend to see their schedule and change what you share with them. You can also make
        <strong>meeting links</strong> here, so someone who isn't your friend can book a time with you.
    </p>
    <p>To learn more, read the <a href={resolve("/guides/friends")}>Friends guide</a>. Note that it is for the extension, not the dashboard.</p>

    <h2 id="settings">Settings</h2>
    <ul>
        <li><strong>Your account:</strong> your name, email, and <strong>User ID</strong>. Give your User ID to a friend so they can add you.</li>
        <li><strong>Connected Google Accounts:</strong> disconnect a Google account you've connected.</li>
        <li><strong>Notifications:</strong> turn notifications on or off for your classes, university events, and friend emails.</li>
        <li><strong>ICS Feed:</strong> copy your personal ICS URL and subscribe to it in your calendar app.</li>
        <li><strong>Sign out.</strong></li>
    </ul>
    <Screenshot
        src="/guides/dashboard/settings.webp"
        width={616}
        height={563}
        maxWidth={400}
        alt="Settings, with the account details and Sign out"
    />

    <h2 id="next">Stuck?</h2>
    <p>Ask on <a href={DISCORD_URL} target="_blank" rel="external noopener noreferrer">Discord</a> or <a href={resolve("/contact")}>contact us</a> if you need help.</p>
</Guide>

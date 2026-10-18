<script lang="ts">
    import { resolve } from "$app/paths";
    import Guide from "$lib/components/Guide.svelte";
    import Screenshot from "$lib/components/Screenshot.svelte";
	import ScreenshotRow from "$lib/components/ScreenshotRow.svelte";
    import { DISCORD_URL } from "$lib/site";
</script>

<Guide slug="friends">
    <p>
        Friends lets you see when your friends are free, compare your calendars, and plan a meeting at a
        time that works for everyone. You choose how much of your schedule each friend can see.
    </p>
    <p>Open the extension and select the <strong>Friends</strong> tab at the top.</p>
    <Screenshot src="/guides/friends/friends-main.webp" width={1280} height={900} alt="The Friends tab in the extension" />

    <h2 id="add-a-friend">Add a friend</h2>
    <ol>
        <li>On the Friends tab, select <strong>Manage friends</strong> in the top right corner.</li>
        <li>Under <strong>People</strong>, select <strong>Add friend</strong>.</li>
        <li>Enter your friend's email or user ID.</li>
        <li>Choose what you share with them. See "<a href="#what-you-share">What you share</a>" below.</li>
        <li>If you like, choose an end date for the friendship.</li>
        <li>Send the request. Your friend sees it in their own Requests list and they will also receive an email notification.</li>
    </ol>
    <ScreenshotRow>
        <Screenshot
            src="/guides/friends/manage-friends-button.webp"
            width={1280}
            height={900}
            alt="The Manage friends section in the extension"
        />
        <Screenshot
            src="/guides/friends/add-friend-button.webp"
            width={480}
            height={900}
            alt="The Manage friends menu in the extension"
        />
    </ScreenshotRow>

    <h2 id="requests">Answer a friend request</h2>
    <p>
        Requests sent to you show up under <strong>Requests</strong> in Manage friends. Before you accept one,
        select <strong>Edit details</strong> to choose what you share with that friend, and an optional end
        date. Then accept the request, or select <strong>Decline</strong>.
    </p>
    <p>Requests you sent show up there too. Select <strong>Cancel request</strong> to take one back.</p>
    <ScreenshotRow>
        <Screenshot
            src="/guides/friends/friend-requests.webp" 
            width={480}
            height={900}
            maxWidth={300}
            alt="A friend request under Requests, with its sharing and end date details open"
        />
        <Screenshot
            src="/guides/friends/friend-request-details.webp" 
            width={480}
            height={900}
            maxWidth={300}
            alt="The Edit details section of a friend request, with the sharing and end date options"
        />
    </ScreenshotRow>

    <h2 id="what-you-share">What you share</h2>
    <p>You choose one of these for each friend:</p>
    <ul>
        <li><strong>Full schedule:</strong> your friend sees your classes, with their details.</li>
        <li><strong>Availability only:</strong> your friend sees only when you are busy. Your course details stay private.</li>
    </ul>
    <p>
        To change it, open Manage friends, select the friend under People, and choose a new option under
        <strong>Your schedule sharing</strong>. The change applies right away.
    </p>
    <h3>End dates</h3>
    <p>
        A friendship can end on a date you choose. When it ends, you stop sharing with each other.
        Moving the end date earlier applies right away. Moving it later, or removing it, needs your
        friend's approval: they get an email, and approve the change in their dashboard on this site.
        Until they do, the current end date stays.
    </p>
    <ScreenshotRow>
        <Screenshot
            src="/guides/friends/friend-sharing.webp"
            width={480}
            height={900}
            maxWidth={300}
            alt="A friend's settings in Manage friends, with Your schedule sharing and the end date"
        />
    </ScreenshotRow>

    <h2 id="groups">Private groups</h2>
    <p>
        A group saves a set of friends you plan with often, such as a study group or a club. Only you can
        see your groups, and nobody gets an invitation.
    </p>
    <ol>
        <li>In Manage friends, go to <strong>Groups</strong> and select <strong>Create group</strong>.</li>
        <li>Name the group, and search for the friends to add.</li>
        <li>If you like, choose an end date. When it passes, the group goes away, but your friendships stay.</li>
        <li>Select <strong>Save group</strong>.</li>
    </ol>
    <p>To plan with a group, open it and select <strong>Find a time with this group</strong>.</p>
    <ScreenshotRow>
        <Screenshot
            src="/guides/friends/create-group.webp"
            width={480}
            height={900}
            maxWidth={300}
            alt="Creating a private group in Manage friends"
        />
        <Screenshot
            src="/guides/friends/edit-group.webp"
            width={480}
            height={900}
            maxWidth={300}
            alt="The Edit details section of a group, with the end date and the move later button"
        />
    </ScreenshotRow>

    <h2 id="compare">Compare calendars</h2>
    <ol>
        <li>On the Friends tab, select <strong>Edit people</strong> and choose who to compare with.</li>
        <li>Select <strong>Compare calendars</strong>.</li>
        <li>Switch between the <strong>Calendar</strong> and <strong>List</strong> views, and between <strong>This week</strong> and <strong>Next week</strong>. Click on any day to see its details on its own.</li>
    </ol>
    <p>
        A friend who shares only their availability shows up as <strong>Busy</strong>, with no class
        details.<br>Select <strong>← Back to Friends</strong> when you are done.
        <br>
        <strong>Tip:</strong> view the comparison in the new tab view for best experience. See <a href={resolve("/guides/getting-started#pro-tip")}>Getting started</a>.
    </p>
    <ScreenshotRow>
        <Screenshot
            src="/guides/friends/edit-people.webp"
            width={688}
            height={706}
            maxWidth={300}
            alt="The Edit people section in the Friends tab, with the people to compare with"
        />
        <Screenshot
            src="/guides/friends/compare-calendars-button.webp"
            width={360}
            height={400}
            maxWidth={400}
            alt="The Compare calendars button in the Friends tab"
        />
    </ScreenshotRow>
    <ScreenshotRow>
        <Screenshot
            src="/guides/friends/compare-detailed.webp"
            width={1600}
            height={1093}
            maxWidth={400}
            alt="Compare calendars, showing the week for three people side by side in a new tab, in detailed view"
        />
        <Screenshot
            src="/guides/friends/compare-group.webp"
            width={1600}
            height={1077}
            maxWidth={400}
            alt="Compare calendars, showing the week for three people side by side in a new tab, in list view"
        />
    </ScreenshotRow>

    <h2 id="find-a-time">Find a time together</h2>
    <p>
        Choose people with <strong>Edit people</strong>, or start from a group. WIT-Calendar then suggests
        times when everyone is free. Narrow the suggestions with the filters:
    </p>
    <ul>
        <li><strong>Dates:</strong> this week, next week, or a custom range.</li>
        <li><strong>Length:</strong> how long the meeting lasts.</li>
        <li><strong>Hours:</strong> the earliest start and latest end. <strong>Between classes</strong> keeps suggestions between the first class and the last class of the day, and skips days with no classes.</li>
        <li><strong>Buffer:</strong> free minutes to leave before and after everyone's busy times, so nobody has to run.</li>
    </ul>
    <p>Select <strong>Show more</strong> for more days, then pick a suggested time.</p>
    <Screenshot src="/guides/friends/filter-dates.webp" width={1280} height={900} alt="Suggested times for a group, with the date, length, hours, and buffer filters" />

    <h2 id="create-a-meeting">Create a meeting</h2>
    <p>When you pick a suggested time, a meeting form opens. Fill in:</p>
    <ul>
        <li>The meeting title.</li>
        <li>The date, start time, and duration. A meeting can last up to 12 hours.</li>
        <li>The location, if you like.</li>
        <li><strong>Repeat</strong>, to meet every week through the end of the term.</li>
        <li><strong>Add to calendar</strong>, the calendar to put the meeting on.</li>
    </ul>
    <p>
        Select <strong>Preview on calendar</strong> to see the meeting next to everyone's schedule. To finish
        later, select <strong>Save draft</strong>, and <strong>Continue</strong> it from the Friends tab.
    </p>
    <p>
        When it looks right, select <strong>Create meeting</strong>, or <strong>Create &amp; invite</strong> if
        <strong>Send calendar invitations to participants</strong> is on, and confirm. A meeting can include up
        to 20 friends.
    </p>
    <Screenshot src="/guides/friends/create-meeting.webp" width={592} height={1108} maxWidth={400} alt="The Create meeting form, with the title, time, repeat, and calendar fields" />

    <h2 id="upcoming">Upcoming meetings</h2>
    <p>
        <strong>Upcoming meetings</strong> on the Friends tab lists your meetings in the next 14 days. Select
        <strong>Details</strong> on a meeting to see who is coming and where.
    </p>
    <ul>
        <li>If you organized it, you can edit or delete it. For a repeating meeting, the change applies to the whole series.</li>
        <li>If you were invited, you can leave it. Answer the calendar invitation in your calendar app.</li>
    </ul>
    <p>Meetings count as busy time when friends look for a time with you.</p>
    <Screenshot src="/guides/friends/meeting-details.webp" width={592} height={520} maxWidth={400} alt="The details of a saved meeting, with the participants and the edit and delete buttons" />

    <h2 id="meeting-links">Meet with someone outside WIT-Calendar</h2>
    <p>
        A one-time meeting link lets anyone, even someone without WIT-Calendar, pick a free time on your
        calendar. Each link takes one booking.
    </p>
    <ol>
        <li>Under <strong>One-time meeting links</strong>, select <strong>Create meeting link</strong>.</li>
        <li>Give the meeting a name, if you like.</li>
        <li>Choose the dates your guest can pick from, up to 30 days.</li>
        <li>Choose the meeting length.</li>
        <li>Choose when the link stops taking bookings, up to 60 days from now.</li>
        <li>Select <strong>Create meeting link</strong>, and send it to your guest.</li>
    </ol>
    <p>
        Guests can book on weekdays between 8:00 AM and 9:00 PM Eastern. Copy the link before you leave the
        page: it can't be shown again. To stop a link from taking bookings, select <strong>Revoke</strong>.
    </p>
    <Screenshot src="/guides/friends/create-meeting-link.webp" width={672} height={640} maxWidth={400} alt="Creating a one-time meeting link, with the dates, length, and expiry fields" />

    <h2 id="next">Stuck?</h2>
    <p>Ask on <a href={DISCORD_URL} target="_blank" rel="external noopener noreferrer">Discord</a> or <a href={resolve("/contact")}>contact us</a> if you need help.</p>
</Guide>

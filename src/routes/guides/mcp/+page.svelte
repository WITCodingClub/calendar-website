<script lang="ts">
    import { resolve } from "$app/paths";
    import Guide from "$lib/components/Guide.svelte";
    import CopyText from "$lib/components/CopyText.svelte";
    import Screenshot from "$lib/components/Screenshot.svelte";
    import ScreenshotRow from "$lib/components/ScreenshotRow.svelte";
    import { DISCORD_URL, SITE_ORIGIN } from "$lib/site";

    const MCP_URL = `${SITE_ORIGIN}/api/mcp`;
</script>

<Guide slug="mcp">
    <p>
        WIT-Calendar has an MCP server. MCP (Model Context Protocol) is the way AI assistants such as
        Claude and ChatGPT connect to other apps. Connect one, and you can ask it about your week and
        the course catalog in plain words: "When am I free on Thursday?" or "Which sections of this
        course fit my schedule?"
    </p>
    <p>
        You choose what the assistant can do when you connect it. Unless you allow more, it can only read:
        it can't change your settings, your friends, or anything else. You can disconnect it at any time.
    </p>

    <h2 id="what-it-can-read">What it can read</h2>
    <ul>
        <li><strong>Your courses:</strong> the courses you take in a term, with the professor, meeting times, and rooms.</li>
        <li><strong>Your final exams</strong> in a term.</li>
        <li><strong>Your busy times:</strong> your classes, finals, and saved friend meetings between two dates.</li>
        <li><strong>Your friends:</strong> your friends list, and the times your friends are busy. It sees when a friend is busy, but not which courses they take.</li>
        <li><strong>The university calendar:</strong> holidays, term dates, registration, deadlines, study days, finals week, and graduation.</li>
        <li><strong>The course catalog:</strong> terms, subjects, sections, courses with their prerequisites, instructors with their RateMyProfessor ratings, and reviews.</li>
        <li><strong>Your calendar settings:</strong> your event titles, colors, reminders, and visibility.</li>
    </ul>
    <p>
        The course catalog and the university calendar are public, so the assistant can always read them.
        When you connect, you can turn off reading your schedule, your friends, or your calendar settings.
    </p>
    <p>All times are in Boston time (Eastern Time).</p>

    <h2 id="what-it-can-change">What it can change, if you allow it</h2>
    <p>
        These are off unless you turn them on when you connect. With one on, you can ask the assistant to do
        it for you, such as "Turn off my class reminders."
    </p>
    <ul>
        <li><strong>Calendar settings:</strong> your event titles, colors, reminders, and visibility.</li>
        <li><strong>Notifications:</strong> pause or resume your class reminders.</li>
        <li><strong>Friend requests:</strong> send, accept, decline, and cancel them.</li>
        <li><strong>Meetings with friends:</strong> create, change, cancel, and leave them.</li>
        <li><strong>Friend groups:</strong> create, rename, and delete them, and add or remove members.</li>
    </ul>

    <p>See <a href="#allow">Sign in and allow the connection</a> for more details.</p>

    <h2 id="before-you-start">Before you start</h2>
    <p>
        You need a WIT-Calendar account. If you have used the extension, you already have one.
    </p>

    <h2 id="claude">Connect Claude / Claude Code</h2>
    <ol>
        <li>In Claude, open <strong>Settings</strong>, then <strong>Customize</strong>.</li>
        <li>Click the <strong>+ Add</strong> button in the top right corner of the screen, then select <strong>+ Add custom connector</strong>.</li>
        <li>Enter <CopyText text={MCP_URL} inline /> as the URL.</li>
        <li>Claude opens WIT-Calendar in your browser. <a href="#allow">Sign in and allow the connection</a>.</li>
    </ol>
    <Screenshot
        src="/guides/mcp/add-custom-connector-claude.webp"
        width={1029}
        height={801}
        maxWidth={600}
        alt="Claude's Add custom connector dialog, with the name WIT-Calendar and the MCP server address filled in"
    />

    <p>For Claude Code, run this command in your terminal:</p>
    <CopyText text="claude mcp add --transport http wit-calendar {MCP_URL}" />
    <p>Then run <code>/mcp</code> in Claude Code, and choose <strong>wit-calendar</strong>.</p>

    <h2 id="chatgpt">Connect ChatGPT</h2>
    <ol>
        <li>In ChatGPT, open <strong>Settings</strong>, then <strong>Plugins</strong>.</li>
        <li>Select <strong>Browse directory</strong>.</li>
        <li>Select <strong>Add</strong> in the top right corner, then <strong>Add custom MCP server</strong>.</li>
        <li>
            Name it <strong>WIT-Calendar</strong>. Under <strong>Connection</strong>, keep <strong>Server URL</strong>
            selected and enter <CopyText text={MCP_URL} inline />. Set <strong>Authentication</strong> to
            <strong>OAuth</strong>.
        </li>
        <li>ChatGPT opens WIT-Calendar in your browser. <a href="#allow">Sign in and allow the connection</a>.</li>
    </ol>
    <ScreenshotRow>
        <Screenshot
            src="/guides/mcp/chatgpt-plugins.webp"
            width={1059}
            height={603}
            alt="ChatGPT's Plugins settings, with the Browse directory button highlighted"
        />
        <Screenshot
            src="/guides/mcp/chatgpt-add-custom-mcp.webp"
            width={1453}
            height={534}
            alt="ChatGPT's plugin directory, with the Add menu open and Add custom MCP server highlighted"
        />
    </ScreenshotRow>
    <Screenshot
        src="/guides/mcp/chatgpt-add-custom-mcp-menu.webp"
        width={758}
        height={541}
        maxWidth={758}
        alt="ChatGPT's Add custom MCP server form, with the name WIT-Calendar, the MCP server address, and OAuth sign-in"
    />

    <h2 id="other-apps">Other apps</h2>
    <p>
        Any app that supports MCP servers with OAuth sign-in can connect. Give it <CopyText text={MCP_URL} inline />,
        and it finds the rest by itself.
    </p>

    <h2 id="allow">Sign in and allow the connection</h2>
    <p>
        When you connect an app, WIT-Calendar opens in your browser. Sign in if you need to. You then see a
        page titled <strong>Connect</strong> with the app's name. It shows:
    </p>
    <ul>
        <li>The account you are signed in as.</li>
        <li>The address that the app sends you back to after you allow it.</li>
        <li>What the app can read, and what it can change if you allow it. Uncheck anything you don't want it to have.</li>
        <li>For some apps, the website that published the app's name and addresses.</li>
    </ul>
    <p>
        Check that the address belongs to the app you are connecting, such as claude.ai for Claude. Then
        select <strong>Allow</strong>. If you didn't start the connection from that app yourself, or the
        address looks wrong, select <strong>Deny</strong>.
    </p>
    <Screenshot
        src="/guides/mcp/consent-page.webp"
        width={781}
        height={1595}
        maxWidth={420}
        alt="The WIT-Calendar consent page for claude.ai: what the app can read, what it can change if you allow it, and the Deny and Allow buttons"
    />

    <h2 id="try-it">Try it</h2>
    <p>Ask the assistant about your schedule:</p>
    <ul>
        <li>"What classes do I have tomorrow, and where?"</li>
        <li>"When are my finals this term?"</li>
        <li>"When are my friend and I both free this week?"</li>
        <li>"Is there a holiday or a study day before my next final?"</li>
    </ul>
    <p>Or about the course catalog:</p>
    <ul>
        <li>"What are the prerequisites for this course, and what does it unlock?"</li>
        <li>"Find another section of my Tuesday lab that doesn't conflict with my classes."</li>
        <li>"Who teaches this course next term, and what do students say about them?"</li>
        <li>"Do these CRNs have any time conflicts?"</li>
    </ul>
    <p>If the assistant asks which term you mean, tell it, or say "this term".</p>
    <ScreenshotRow>
        <Screenshot
            src="/guides/mcp/claude-select-question.webp"
            width={885}
            height={638}
            alt="Claude's Connectors menu, with Add from WIT-Calendar open and its ready-made prompts, such as Check my schedule"
        />
        <Screenshot
            src="/guides/mcp/claude-prompt-inputs.webp"
            width={577}
            height={283}
            alt="The Enter prompt inputs dialog for check_my_schedule, with the term Fall 2026"
        />
    </ScreenshotRow>
    <ScreenshotRow>
        <Screenshot
            src="/guides/mcp/claude-mid-prompt.webp"
            width={1604}
            height={885}
            alt="Claude running the Check my schedule prompt and asking to use the my_courses tool from WIT-Calendar"
        />
        <Screenshot
            src="/guides/mcp/claude-schedule.webp"
            width={861}
            height={769}
            alt="Claude's answer: a week view of the student's Fall 2026 courses from WIT-Calendar"
        />
    </ScreenshotRow>

    <h2 id="disconnect">Disconnect an app</h2>
    <ol>
        <li><a href="/users/sign_in" rel="external" data-sveltekit-reload>Sign in to your user dashboard</a>, then open <strong>Settings</strong>.</li>
        <li>Find the <strong>Connected apps</strong> card. It lists every app that can use your WIT-Calendar data, with the address each app uses. The card shows up only while at least one app is connected.</li>
        <li>Select <strong>Disconnect</strong> next to the app, then confirm.</li>
    </ol>
    <p>The app can't read your data after that. To use it again, connect it again.</p>
    <Screenshot
        src="/guides/mcp/connected-apps-card-user-dash.webp"
        width={619}
        height={755}
        maxWidth={619}
        alt="The dashboard's Settings page, with the Connected apps card highlighted, showing Claude and a Disconnect button"
    />

    <h2 id="troubleshooting">Troubleshooting</h2>
    <h3>"Cannot connect this app"</h3>
    <p>The page says why under the heading:</p>
    <ul>
        <li>
            <strong>"This server cannot issue a token for …"</strong>: the app was given the wrong address.
            Remove the connector, and add it again with exactly <CopyText text={MCP_URL} inline />.
        </li>
        <li>
            <strong>"This app's details could not be checked"</strong>: WIT-Calendar couldn't read the app's
            published details. Try again in a few minutes. If it keeps happening, the problem is on the
            app's side.
        </li>
    </ul>
    <h3>The assistant doesn't use WIT-Calendar</h3>
    <p>
        Check that the connector is turned on for the chat, and mention WIT-Calendar or your schedule in
        your question.
    </p>
    <h3>Still stuck?</h3>
    <p>
        Ask on <a href={DISCORD_URL} target="_blank" rel="external noopener noreferrer">Discord</a>, or
        <a href={resolve("/contact")}>contact us</a>. Tell us which app you are connecting and what you see (include screenshots when applicable).
    </p>

    <h2 id="developers">For developers</h2>
    <p>
        The <a href={resolve("/docs/[slug]", { slug: "mcp" })}>MCP server reference</a> lists every tool,
        the OAuth sign-in flow, and the rate limits. Each catalog tool matches an endpoint of the public
        <a href={resolve("/docs/[slug]", { slug: "api" })}>Course Catalog API</a>. To learn what data we
        keep, read the <a href={resolve("/privacy")}>privacy policy</a>.
    </p>
</Guide>

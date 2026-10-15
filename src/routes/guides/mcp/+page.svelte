<script lang="ts">
    import { resolve } from "$app/paths";
    import Guide from "$lib/components/Guide.svelte";
    import Screenshot from "$lib/components/Screenshot.svelte";
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
        The connection is read-only. The assistant can't change your schedule, your settings, or anything
        else, and you can disconnect it at any time.
    </p>

    <h2 id="what-it-can-read">What it can read</h2>
    <ul>
        <li><strong>Your courses:</strong> the courses you take in a term, with the professor, meeting times, and rooms.</li>
        <li><strong>Your final exams</strong> in a term.</li>
        <li><strong>Your busy times:</strong> your classes, finals, and saved friend meetings between two dates.</li>
        <li><strong>Your friends:</strong> your friends list, and the times your friends are busy. It sees when a friend is busy, but not which courses they take.</li>
        <li><strong>The university calendar:</strong> holidays, term dates, registration, deadlines, study days, finals week, and graduation.</li>
        <li><strong>The course catalog:</strong> terms, subjects, sections, courses with their prerequisites, instructors with their RateMyProfessor ratings, and reviews.</li>
    </ul>
    <p>All times are in Boston time (Eastern Time).</p>

    <h2 id="before-you-start">Before you start</h2>
    <p>
        You need a WIT-Calendar account. If you have used the extension, you already have one. You sign
        in with the same Google account, Microsoft account, or passkey as always.
    </p>
    <p>The address of the MCP server is:</p>
    <pre><code>{MCP_URL}</code></pre>

    <h2 id="claude">Connect Claude</h2>
    <ol>
        <li>In Claude, open <strong>Settings</strong>, then <strong>Connectors</strong>.</li>
        <li>Select <strong>Add custom connector</strong>.</li>
        <li>Enter <code>{MCP_URL}</code> as the URL.</li>
        <li>Claude opens WIT-Calendar in your browser. <a href="#allow">Sign in and allow the connection</a>.</li>
    </ol>
    <Screenshot alt="The Add custom connector dialog in Claude, with the WIT-Calendar URL" />

    <h2 id="chatgpt">Connect ChatGPT</h2>
    <p>
        Add a custom connector in ChatGPT's settings, and enter <code>{MCP_URL}</code> as the URL. ChatGPT
        opens WIT-Calendar in your browser. <a href="#allow">Sign in and allow the connection</a>.
    </p>
    <Screenshot alt="Adding WIT-Calendar as a connector in ChatGPT" />

    <h2 id="claude-code">Connect Claude Code</h2>
    <p>Run this command in your terminal:</p>
    <pre><code>claude mcp add --transport http wit-calendar {MCP_URL}</code></pre>
    <p>
        Then run <code>/mcp</code> in Claude Code, and choose <strong>wit-calendar</strong>. Claude Code opens
        your browser. <a href="#allow">Sign in and allow the connection</a>.
    </p>

    <h2 id="other-apps">Other apps</h2>
    <p>
        Any app that supports MCP servers with OAuth sign-in can connect. Give it <code>{MCP_URL}</code>,
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
        <li>What the app will be able to read.</li>
        <li>For some apps, the website that published the app's name and addresses.</li>
    </ul>
    <p>
        Check that the address belongs to the app you are connecting, such as claude.ai for Claude. Then
        select <strong>Allow</strong>. If you didn't start the connection from that app yourself, or the
        address looks wrong, select <strong>Deny</strong>.
    </p>
    <Screenshot alt="The WIT-Calendar consent page, with the app's name, the return address, and the Allow and Deny buttons" />

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
    <Screenshot alt="Claude answering a question about a student's schedule" />

    <h2 id="staying-connected">Staying connected</h2>
    <p>
        You sign in once. The app keeps its access up to date by itself, so you don't have to sign in
        again unless you disconnect it.
    </p>
    <p>
        The app and the extension share one limit on how often they can read your data. If the assistant
        says it hit a limit, wait a minute and ask again.
    </p>

    <h2 id="disconnect">Disconnect an app</h2>
    <ol>
        <li><a href="/users/sign_in" rel="external" data-sveltekit-reload>Sign in</a> on this site, and open <strong>Settings</strong> on your dashboard.</li>
        <li>Find the <strong>Connected apps</strong> card. It lists every app that can read your schedule, with the address each app uses. The card shows up only while at least one app is connected.</li>
        <li>Select <strong>Disconnect</strong> next to the app, then confirm.</li>
    </ol>
    <p>The app can't read your data after that. To use it again, connect it again.</p>
    <Screenshot alt="The Connected apps card in dashboard settings, with a Disconnect button" />

    <h2 id="troubleshooting">Troubleshooting</h2>
    <h3>"Cannot connect this app"</h3>
    <p>The page says why under the heading:</p>
    <ul>
        <li>
            <strong>"This server cannot issue a token for …"</strong>: the app was given the wrong address.
            Remove the connector, and add it again with exactly <code>{MCP_URL}</code>.
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
        <a href={resolve("/contact")}>contact us</a>. Tell us which app you are connecting and what you see.
    </p>

    <h2 id="developers">For developers</h2>
    <p>
        The <a href={resolve("/docs/[slug]", { slug: "mcp" })}>MCP server reference</a> lists every tool,
        the OAuth sign-in flow, and the rate limits. Each catalog tool matches an endpoint of the public
        <a href={resolve("/docs/[slug]", { slug: "api" })}>Course Catalog API</a>. To learn what data we
        keep, read the <a href={resolve("/privacy")}>privacy policy</a>.
    </p>
</Guide>

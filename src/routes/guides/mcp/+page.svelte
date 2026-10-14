<script lang="ts">
    import { resolve } from "$app/paths";
    import Guide from "$lib/components/Guide.svelte";
    import Screenshot from "$lib/components/Screenshot.svelte";
    import { SITE_ORIGIN } from "$lib/site";

    const MCP_URL = `${SITE_ORIGIN}/api/mcp`;
</script>

<Guide slug="mcp">
    <p>
        WIT-Calendar has an MCP server. MCP is the way AI assistants such as Claude and ChatGPT connect to
        other apps. Once you connect one, you can ask it things like "When am I free on Thursday?" or
        "Which sections of this course fit my schedule?"
    </p>

    <h2 id="what-it-can-read">What it can read</h2>
    <p>The assistant can only read. It can't change your schedule, your settings, or anything else.</p>
    <ul>
        <li>Your courses, with meeting times and rooms</li>
        <li>Your final exams</li>
        <li>When you are busy, and when your friends are busy</li>
        <li>The university calendar: holidays, deadlines, and finals week</li>
        <li>The course catalog: sections, courses, instructors, and reviews</li>
    </ul>

    <h2 id="claude">Connect Claude</h2>
    <ol>
        <li>In Claude, open <strong>Settings</strong>, then <strong>Connectors</strong>.</li>
        <li>Select <strong>Add custom connector</strong>.</li>
        <li>Enter <code>{MCP_URL}</code> as the URL.</li>
        <li>Sign in with your WIT account, then select <strong>Allow</strong>.</li>
    </ol>
    <Screenshot alt="The Add custom connector dialog in Claude, with the WIT-Calendar URL" />
    <Screenshot alt="The WIT-Calendar consent page, with the Allow button" />

    <h2 id="chatgpt">Connect ChatGPT</h2>
    <p>Add a custom connector in ChatGPT's settings, and enter <code>{MCP_URL}</code> as the URL. Then sign in and select <strong>Allow</strong>.</p>
    <Screenshot alt="Adding WIT-Calendar as a connector in ChatGPT" />

    <h2 id="claude-code">Connect Claude Code</h2>
    <p>Run this command:</p>
    <pre><code>claude mcp add --transport http wit-calendar {MCP_URL}</code></pre>
    <p>Then run <code>/mcp</code> in Claude Code, and finish the sign-in in your browser.</p>

    <h2 id="try-it">Try it</h2>
    <p>Ask the assistant about your schedule. For example:</p>
    <ul>
        <li>"What classes do I have tomorrow, and where?"</li>
        <li>"When are my finals this term?"</li>
        <li>"When are my friend and I both free this week?"</li>
        <li>"Find another section of my Tuesday lab that doesn't conflict with my classes."</li>
    </ul>
    <Screenshot alt="Claude answering a question about a student's schedule" />

    <h2 id="disconnect">Disconnect an app</h2>
    <p>
        <a href="/users/sign_in" rel="external" data-sveltekit-reload>Sign in</a> on this site, open
        <strong>Settings</strong> on your dashboard, and find <strong>Connected apps</strong>. Select
        <strong>Disconnect</strong> next to an app to take away its access.
    </p>
    <Screenshot alt="The Connected apps card in dashboard settings" />

    <h2 id="developers">For developers</h2>
    <p>
        <!-- eslint-disable svelte/no-navigation-without-resolve -- The Rails backend serves /docs, outside the SvelteKit app. -->
        The <a href="/docs/mcp" data-sveltekit-reload>MCP server reference</a> lists every tool, the
        sign-in flow, and the rate limits. Read <a href={resolve("/privacy")}>the privacy policy</a> to
        learn what data we keep.
        <!-- eslint-enable svelte/no-navigation-without-resolve -->
    </p>
</Guide>

<script lang="ts">
	import { page } from '$app/state';
	import {
		AGENT_RULES,
		MAINTAINER_EMAILS,
		NEXT_STEPS,
		ORG_POLICY_URL,
		PGP_KEY,
		REPORT_CONTENTS,
		REPORT_LINKS,
		RESEARCH_RULES,
		TEAM_EMAIL
	} from '$lib/security';
	import { selected } from '$lib/store.svelte';
	import { Button } from 'm3-svelte';

	// The agent rules are markdown with inline links. The page shows each link
	// as an anchor, so split the text into plain parts and link parts.
	type Part = { text: string; href?: string };

	function parts(markdown: string): Part[] {
		const result: Part[] = [];
		let last = 0;
		for (const match of markdown.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
			result.push({ text: markdown.slice(last, match.index) });
			result.push({ text: match[1], href: match[2] });
			last = (match.index ?? 0) + match[0].length;
		}
		result.push({ text: markdown.slice(last) });
		return result;
	}

	const agentRules = $derived(AGENT_RULES.map((rule) => parts(rule(page.url.origin))));
</script>

<svelte:head>
	<title>WIT-Calendar - Security</title>
	<meta
		name="description"
		content="How to report a security vulnerability in WIT-Calendar, and the rules for security research and automated tools."
	/>
</svelte:head>

<div class="mt-12 px-4 sm:text-left md:mt-24 flex flex-row items-center justify-center text-center">
	<h1 class="roboto-flex-wit-main text-4xl leading-tight sm:text-6xl md:text-7xl">Security</h1>
</div>

<div class="mt-4 gap-3 px-4 sm:gap-4 flex flex-wrap items-center justify-center">
	<Button variant="outlined" onclick={() => ($selected = '/')}>Back Home</Button>
	<Button variant="outlined" onclick={() => ($selected = '/contact')}>Contact</Button>
</div>

<!--
	Each link in this article is an external URL or a path that the backend
	serves, for example /.well-known/security.txt and /llms.txt. SvelteKit has no
	route for these paths, so resolve() does not apply, and data-sveltekit-reload
	makes the browser load them in full instead of in the client router.
-->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<article
	class="mt-8 mb-12 max-w-3xl gap-8 px-4 sm:px-6 mx-auto flex flex-col text-left"
	data-sveltekit-reload
>
	<p class="text-lg font-medium">
		Do not open a public issue, discussion, or pull request for a security issue. Use one of the
		private channels below.
	</p>

	<section class="gap-3 flex flex-col">
		<h2 class="text-2xl font-semibold text-primary">Report a vulnerability</h2>

		<h3 class="text-xl font-semibold">GitHub private reporting (preferred)</h3>
		<p>
			You do not need to be a member of the WIT Coding Club. You need only a free GitHub account.
			Only you and the maintainers can see the report.
		</p>
		<ul class="pl-6 list-disc">
			{#each REPORT_LINKS as link (link.href)}
				<li><a class="text-primary underline" href={link.href}>{link.label}</a></li>
			{/each}
		</ul>

		<h3 class="text-xl font-semibold">Email</h3>
		<p>
			If you cannot use GitHub, send an email to
			<a class="text-primary underline" href="mailto:{TEAM_EMAIL}">{TEAM_EMAIL}</a>.
		</p>
		<p>You can also send an email directly to the core maintainers:</p>
		<ul class="pl-6 list-disc">
			{#each MAINTAINER_EMAILS as email (email)}
				<li><a class="text-primary underline" href="mailto:{email}">{email}</a></li>
			{/each}
		</ul>

		<h3 class="text-xl font-semibold">Encrypted email</h3>
		<p>
			To encrypt a report, use the OpenPGP key for
			<a class="text-primary underline" href="mailto:{PGP_KEY.email}">{PGP_KEY.email}</a>. Send the
			encrypted email to that address.
		</p>
		<ul class="pl-6 list-disc">
			<li>Key: <a class="text-primary underline" href={PGP_KEY.url}>{PGP_KEY.url}</a></li>
			<li>Fingerprint: <code class="break-all">{PGP_KEY.fingerprint}</code></li>
		</ul>
		<p>The key URL can return more than one key. Use the key with this fingerprint.</p>
	</section>

	<section class="gap-3 flex flex-col">
		<h2 class="text-2xl font-semibold text-primary">What to include</h2>
		<ul class="pl-6 list-disc">
			{#each REPORT_CONTENTS as item (item)}
				<li>{item}</li>
			{/each}
		</ul>
	</section>

	<section class="gap-3 flex flex-col">
		<h2 class="text-2xl font-semibold text-primary">What happens next</h2>
		<ol class="pl-6 list-decimal">
			{#each NEXT_STEPS as step (step)}
				<li>{step}</li>
			{/each}
		</ol>
		<p>We are a student club, so a reply can take longer during exams and breaks.</p>
	</section>

	<section class="gap-3 flex flex-col">
		<h2 class="text-2xl font-semibold text-primary">Rules for security research</h2>
		<p>Do research in good faith. We will not take action against you if you obey these rules:</p>
		<ul class="pl-6 list-disc">
			{#each RESEARCH_RULES as rule (rule)}
				<li>{rule}</li>
			{/each}
		</ul>
	</section>

	<section class="gap-3 flex flex-col">
		<h2 class="text-2xl font-semibold text-primary">Automated tools and AI agents</h2>
		<p>These rules apply to crawlers, AI agents, and other automated tools:</p>
		<ul class="pl-6 list-disc">
			{#each agentRules as rule, i (i)}
				<li>
					{#each rule as part, j (j)}{#if part.href}<a
								class="text-primary underline"
								href={part.href}>{part.text}</a
							>{:else}{part.text}{/if}{/each}
				</li>
			{/each}
		</ul>
		<p>
			An agent can read this page as markdown. Send the request with
			<code>Accept: text/markdown</code>.
		</p>
	</section>

	<section class="gap-3 flex flex-col">
		<h2 class="text-2xl font-semibold text-primary">Machine-readable files</h2>
		<ul class="pl-6 list-disc">
			<li>
				<a class="text-primary underline" href="/.well-known/security.txt">security.txt</a>: The
				contacts in RFC 9116 format.
			</li>
			<li>
				<a class="text-primary underline" href={ORG_POLICY_URL}>Organization security policy</a>:
				The policy for every WIT Coding Club repository.
			</li>
		</ul>
	</section>
</article>

<!-- eslint-enable svelte/no-navigation-without-resolve -->

<style>
	.roboto-flex-wit-main {
		font-family: 'Roboto Flex', sans-serif;
		color: var(--color-primary);
		font-optical-sizing: 144;
		font-weight: 900;
		font-style: normal;
		font-variation-settings:
			'slnt' 0,
			'wdth' 129,
			'GRAD' 0,
			'XOPQ' 140,
			'XTRA' 468,
			'YOPQ' 51,
			'YTAS' 750,
			'YTDE' -203,
			'YTFI' 738,
			'YTLC' 514,
			'YTUC' 712;
	}
</style>

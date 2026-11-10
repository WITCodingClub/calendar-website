<script lang="ts">
	// One node of a prerequisite tree from the catalog API. A course that the
	// catalog knows links to its page. A nested group gets parentheses.
	import { resolve } from '$app/paths';
	import Requisite from './Requisite.svelte';
	import type { RequisiteNode } from '$lib/catalog';

	let { node, nested = false }: { node: RequisiteNode; nested?: boolean } = $props();

	const codeParam = (code: string) => code.replace(/\s+/g, '');
</script>

{#if node.type === 'and' || node.type === 'or'}
	{#if nested}({/if}{#each node.operands as operand, index (index)}{#if index > 0}<span
				class="joiner"
			>
				{node.type}
			</span>{/if}<Requisite node={operand} nested />{/each}{#if nested}){/if}
{:else if node.type === 'course'}
	{#if node.linked}
		<a
			href={resolve('/catalog/courses/[code]', { code: codeParam(node.code) })}
			title={node.title ?? undefined}>{node.code}</a
		>
	{:else}
		<span>{node.code}</span>
	{/if}
	{#if node.min_grade}<span class="joiner">(min {node.min_grade})</span>{/if}
{:else if node.type === 'test'}
	<span>{node.name}{node.score ? ` ${node.score}` : ''}</span>
{/if}

<style>
	.joiner {
		font-size: 0.8rem;
		text-transform: uppercase;
		color: var(--color-on-surface-variant);
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';

	let me: any = null;

	onMount(async () => {
		const res = await fetch('/api/me');
		me = await res.json();
	});
</script>

<h1>PLM / CadIQ</h1>

{#if me?.ok}
	<p>Signed in as <b>{me.session.email}</b></p>
	<p>Tenant: <code>{me.session.tenantId}</code></p>
{:else}
	<p>Loading…</p>
{/if}

<form method="post" action="/api/auth/logout">
	<button type="submit">Logout</button>
</form>

<script lang="ts">
	let me: any = null;

	// simple fetch to show tenant context
	async function loadMe() {
		const res = await fetch('/api/me');
		me = await res.json();
	}

	loadMe();
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

<script lang="ts">
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';
	let tenants: { id: string; name: string }[] = [];
	let selectedTenantId = '';

	async function startLogin() {
		error = '';
		tenants = [];
		selectedTenantId = '';

		const res = await fetch('/api/auth/login-start', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();
		if (!data.ok) {
			error = data.error ?? 'Login failed';
			return;
		}

		tenants = data.tenants;

		if (tenants.length === 1) {
			selectedTenantId = tenants[0].id;
			await selectTenant();
		}
	}

	async function selectTenant() {
		const res = await fetch('/api/auth/select-tenant', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ email, password, tenantId: selectedTenantId })
		});

		const data = await res.json();
		if (!data.ok) {
			error = data.error ?? 'Tenant selection failed';
			return;
		}

		await goto('/');
	}
</script>

<h1>PLM / CadIQ</h1>

<div style="max-width: 420px; display: grid; gap: 12px;">
	<label>
		Email
		<input bind:value={email} autocomplete="username" />
	</label>

	<label>
		Password
		<input type="password" bind:value={password} autocomplete="current-password" />
	</label>

	<button on:click={startLogin}>Sign in</button>

	{#if error}
		<p style="color: red;">{error}</p>
	{/if}

	{#if tenants.length > 1}
		<hr />
		<label>
			Select tenant
			<select bind:value={selectedTenantId}>
				<option value="" disabled>Select…</option>
				{#each tenants as t}
					<option value={t.id}>{t.name}</option>
				{/each}
			</select>
		</label>

		<button disabled={!selectedTenantId} on:click={selectTenant}> Continue </button>
	{/if}
</div>

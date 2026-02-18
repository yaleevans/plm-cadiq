<script lang="ts">
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';
	let tenants: { id: string; name: string }[] = [];
	let selectedTenantId = '';
	let busy = false;

	async function startLogin() {
		error = '';
		tenants = [];
		selectedTenantId = '';
		busy = true;

		try {
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

			tenants = data.tenants ?? [];

			if (tenants.length === 1) {
				selectedTenantId = tenants[0].id;
				await selectTenant();
			}
		} catch (e: any) {
			error = e?.message ?? String(e);
		} finally {
			busy = false;
		}
	}

	async function selectTenant() {
		error = '';
		busy = true;

		try {
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
		} catch (e: any) {
			error = e?.message ?? String(e);
		} finally {
			busy = false;
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') startLogin();
	}
</script>

<main class="auth">
	<section class="auth-card" aria-label="Login">
		<header class="auth-header">
			<h1>Sabel CAD Validator</h1>
			<p>Sign in to continue</p>
		</header>
		<form class="auth-fields" autocomplete="on" on:submit|preventDefault={startLogin}>
			<label class="auth-label">
				<span>Email</span>
				<input
					class="auth-input"
					name="email"
					type="email"
					inputmode="email"
					autocomplete="username"
					bind:value={email}
					required
				/>
			</label>

			<label class="auth-label">
				<span>Password</span>
				<input
					class="auth-input"
					name="password"
					type="password"
					autocomplete="current-password"
					bind:value={password}
					required
				/>
			</label>

			<button class="auth-button" type="submit" disabled={busy || !email || !password}>
				{busy ? 'Signing in…' : 'Sign in'}
			</button>

			{#if error}
				<p class="auth-error">{error}</p>
			{/if}

			{#if tenants.length > 1}
				<div class="auth-divider"></div>

				<label class="auth-label">
					<span>Select tenant</span>
					<select class="auth-input" name="tenantId" bind:value={selectedTenantId} required>
						<option value="" disabled>Select…</option>
						{#each tenants as t}
							<option value={t.id}>{t.name}</option>
						{/each}
					</select>
				</label>

				<button
					class="auth-button secondary"
					type="button"
					disabled={busy || !selectedTenantId}
					on:click={selectTenant}
				>
					{busy ? 'Loading…' : 'Continue'}
				</button>
			{/if}
		</form>
	</section>
</main>

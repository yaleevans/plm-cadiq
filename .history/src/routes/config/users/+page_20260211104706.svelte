<script lang="ts">
	import { onMount } from 'svelte';

	type TenantUser = { userId: string; email: string; role: 'admin' | 'user' };

	let loading = true;
	let error = '';
	let okMsg = '';

	let users: TenantUser[] = [];

	let email = '';
	let tempPassword = '';
	let role: 'admin' | 'user' = 'user';

	async function refresh() {
		loading = true;
		error = '';
		okMsg = '';

		const res = await fetch('/api/users');
		const data = await res.json();

		if (!data.ok) {
			error = data.error ?? 'Failed to load users';
			loading = false;
			return;
		}

		users = data.users ?? [];
		loading = false;
	}

	async function addUser() {
		error = '';
		okMsg = '';

		const res = await fetch('/api/users', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ email, tempPassword, role })
		});

		const data = await res.json();

		if (!data.ok) {
			error = data.error ?? 'Failed to add user';
			return;
		}

		okMsg = 'User added.';
		email = '';
		tempPassword = '';
		role = 'user';

		await refresh();
	}

	onMount(() => {
		refresh();
	});
</script>

<h2>User Management</h2>

<div style="display:grid; gap: 16px; max-width: 820px;">
	<div style="border: 1px solid #ddd; border-radius: 10px; padding: 12px;">
		<h3 style="margin-top:0">Add user to this tenant</h3>

		<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px;">
			<label>Email <input bind:value={email} placeholder="user@acme.com" /></label>
			<label>Temp password <input type="password" bind:value={tempPassword} /></label>
		</div>

		<label style="display:block; margin-top: 10px;">
			Role
			<select bind:value={role}>
				<option value="user">User</option>
				<option value="admin">Admin</option>
			</select>
		</label>

		<div style="display:flex; gap: 12px; align-items:center; margin-top: 10px;">
			<button on:click={addUser}>Add User</button>
			{#if okMsg}<span style="color: green;">{okMsg}</span>{/if}
			{#if error}<span style="color: red;">{error}</span>{/if}
		</div>
	</div>

	<div style="border: 1px solid #ddd; border-radius: 10px; padding: 12px;">
		<h3 style="margin-top:0">Users in this tenant</h3>
		<ul>
			{#each users as user}
				<li>{user.email} ({user.role})</li>
			{/each}
		</ul>
	</div>
</div>

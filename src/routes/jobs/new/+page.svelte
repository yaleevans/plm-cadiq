<script lang="ts">
	import { onMount } from 'svelte';
	import { createPlmClient } from '$lib/plm/createPlmClient';
	import type { TenantConfig } from '$lib/types/config';

	let term = '';
	let status = 'Initializing...';
	let results: any = null;
	let plm: any = null;

	onMount(async () => {
		try {
			status = 'Loading config...';

			const res = await fetch('/api/config');
			const payload: { ok: boolean; config: TenantConfig } = await res.json();

			if (!payload.ok || !payload.config?.plm) {
				status = 'No PLM configured';
				return;
			}

			// ✅ assign to outer variable (no const)
			plm = createPlmClient(payload.config.plm);

			status = 'Logging into PLM...';
			const loginRes = await plm.login();

			status = loginRes.ok ? 'Connected to PLM ✅' : `PLM login failed ❌: ${loginRes.message}`;
		} catch (err) {
			console.error(err);
			status = 'Unexpected error';
		}
	});

	async function doSearch() {
		if (!plm) {
			status = 'Not connected to PLM yet';
			return;
		}
		if (!term.trim()) return;

		status = 'Searching...';

		try {
			results = await plm.search(term);
			status = 'Done ✅';
		} catch (e: any) {
			status = `Search failed ❌: ${e?.message ?? e}`;
		}
	}
</script>

<p>{status}</p>

<label>
	Enter search term:
	<input bind:value={term} on:keydown={(e) => e.key === 'Enter' && doSearch()} />
	<button on:click={doSearch}>Search</button>
</label>

{#if results}
	<pre>{JSON.stringify(results, null, 2)}</pre>
{/if}

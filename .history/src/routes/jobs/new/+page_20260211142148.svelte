<script lang="ts">
	import { onMount } from 'svelte';
	import { createPlmClient } from '$lib/plm/createPlmClient';
	import type { TenantConfig } from '$lib/types/config';

	let status = 'Initializing...';

	onMount(async () => {
		try {
			status = 'Loading config...';

			const res = await fetch('/api/config');
			const payload: { ok: boolean; config: TenantConfig } = await res.json();

			if (!payload.ok || !payload.config?.plm) {
				status = 'No PLM configured';
				return;
			}

			const plm = createPlmClient(payload.config.plm);

			status = 'Logging into PLM...';
			const loginRes = await plm.login();

			status = loginRes.ok ? 'Connected to PLM ✅' : `PLM login failed ❌: ${loginRes.message}`;
		} catch (err) {
			console.error(err);
			status = 'Unexpected error';
		}
	});
</script>

<p>{status}</p>

<label>
	Enter search term:
	<input />
</label>

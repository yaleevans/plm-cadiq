<script lang="ts">
	import { onMount } from 'svelte';
	import { createPlmClient } from '$lib/plm/createPlmClient';
	import type { TenantConfig } from '$lib/types/config';

	let term = 'us*001';
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

	let revisionRows: RevisionRow[] = [];
	let selectedRevision: RevisionRow | null = null;

	async function doSearch() {
		if (!plm) {
			status = 'Not connected to PLM yet';
			return;
		}
		if (!term.trim()) return;

		status = 'Searching item...';
		selectedRevision = null;
		revisionRows = [];

		try {
			const searchResp = await plm.search(term);

			// get the first item uid from your search response
			const itemUid =
				JSON.parse(searchResp.searchResultsJSON).objects?.[0]?.uid ??
				searchResp?.ServiceData?.plain?.[0];

			if (!itemUid) {
				status = 'No items found';
				return;
			}

			status = 'Loading revisions...';
			const serviceData = await plm.getItemRevisions(itemUid); // see note below

			revisionRows = tcRevisionListToRows(serviceData);
			status = revisionRows.length ? 'Select a revision below' : 'No revisions returned';
		} catch (e: any) {
			status = `Search failed ❌: ${e?.message ?? e}`;
		}
	}

	type RevisionRow = { uid: string; display: string };

	function tcRevisionListToRows(serviceData: any): RevisionRow[] {
		const itemUid = serviceData?.plain?.[0];
		const itemObj = itemUid ? serviceData?.modelObjects?.[itemUid] : null;
		const revList = itemObj?.props?.revision_list;

		const uids: string[] = revList?.dbValues ?? [];
		const labels: string[] = revList?.uiValues ?? [];

		return uids.map((uid, i) => ({
			uid,
			display: labels[i] ?? uid
		}));
	}
</script>

<p>{status}</p>

<label>
	Enter search term:
	<input bind:value={term} on:keydown={(e) => e.key === 'Enter' && doSearch()} />
	<button on:click={doSearch}>Search</button>
</label>

{#if revisionRows.length}
	<h3>Revisions</h3>
	<table>
		<thead>
			<tr>
				<th>Revision</th>
				<th>UID</th>
			</tr>
		</thead>
		<tbody>
			{#each revisionRows as r}
				<tr
					on:click={() => (selectedRevision = r)}
					style="cursor:pointer; font-weight:{selectedRevision?.uid === r.uid ? 'bold' : 'normal'}"
				>
					<td>{r.display}</td>
					<td>{r.uid}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

{#if selectedRevision}
	<p>Selected revision: {selectedRevision.display}</p>
{/if}

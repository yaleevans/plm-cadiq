<script lang="ts">
	import { onMount } from 'svelte';
	import { createPlmClient } from '$lib/plm/createPlmClient';
	import type { TenantConfig } from '$lib/types/config';

	type RevisionRow = { uid: string; display: string };
	type DatasetRow = { uid: string; display: string };
	type FileRow = { uid: string; display: string };

	let term = 'us*001';
	let status = 'Initializing...';

	let plm: any = null;

	let revisionRows: RevisionRow[] = [];
	let selectedRevision: RevisionRow | null = null;

	let datasetRows: DatasetRow[] = [];
	let selectedDataset: DatasetRow | null = null;

	let fileRows: FileRow[] = [];
	let cadStatus = '';

	onMount(async () => {
		try {
			status = 'Loading config...';

			const res = await fetch('/api/config');
			const payload: { ok: boolean; config: TenantConfig } = await res.json();

			if (!payload.ok || !payload.config?.plm) {
				status = 'No PLM configured';
				return;
			}

			plm = createPlmClient(payload.config.plm);

			status = 'Logging into PLM...';
			const loginRes = await plm.login();

			status = loginRes.ok ? 'Connected to PLM ✅' : `PLM login failed ❌: ${loginRes.message}`;
		} catch (err) {
			console.error(err);
			status = 'Unexpected error';
		}
	});

	function tcRevisionListToRows(serviceData: any): RevisionRow[] {
		const itemUid = serviceData?.plain?.[0];
		const itemObj = itemUid ? serviceData?.modelObjects?.[itemUid] : null;
		const revList = itemObj?.props?.revision_list;

		const uids: string[] = revList?.dbValues ?? [];
		const labels: string[] = revList?.uiValues ?? [];

		return uids.map((uid, i) => ({ uid, display: labels[i] ?? uid }));
	}

	function propListToRows(
		serviceData: any,
		ownerUid: string,
		propName: string
	): { uid: string; display: string }[] {
		const owner = serviceData?.modelObjects?.[ownerUid];
		const prop = owner?.props?.[propName];

		const uids: string[] = prop?.dbValues ?? [];
		const labels: string[] = prop?.uiValues ?? [];

		return uids.map((uid, i) => ({ uid, display: labels[i] ?? uid }));
	}

	async function doSearch() {
		if (!plm) {
			status = 'Not connected to PLM yet';
			return;
		}
		if (!term.trim()) return;

		status = 'Searching item...';

		// reset all downstream state
		selectedRevision = null;
		revisionRows = [];
		selectedDataset = null;
		datasetRows = [];
		fileRows = [];
		cadStatus = '';

		try {
			const searchResp = await plm.search(term);

			const itemUid =
				JSON.parse(searchResp.searchResultsJSON).objects?.[0]?.uid ??
				searchResp?.ServiceData?.plain?.[0];

			if (!itemUid) {
				status = 'No items found';
				return;
			}

			status = 'Loading revisions...';
			const serviceData = await plm.getItemRevisions(itemUid);

			revisionRows = tcRevisionListToRows(serviceData);
			status = revisionRows.length ? 'Select a revision below' : 'No revisions returned';
		} catch (e: any) {
			status = `Search failed ❌: ${e?.message ?? e}`;
		}
	}

	async function onSelectRevision(r: RevisionRow) {
		if (!plm) return;

		selectedRevision = r;

		// reset dataset + file state
		selectedDataset = null;
		datasetRows = [];
		fileRows = [];
		cadStatus = 'Loading datasets...';

		try {
			// This assumes you added a wrapper method:
			// plm.getDatasetsForRevision(revUid) -> getProperties(ItemRevision, ["IMAN_specification"])
			const dsSd = await plm.getDatasetsForRevision(r.uid);

			datasetRows = propListToRows(dsSd, r.uid, 'IMAN_specification');
			cadStatus = datasetRows.length
				? 'Select a dataset below'
				: 'No datasets found for this revision';
		} catch (e: any) {
			cadStatus = `Dataset lookup failed ❌: ${e?.message ?? e}`;
		}
	}

	async function onSelectDataset(d: DatasetRow) {
		if (!plm || !selectedRevision) return;

		selectedDataset = d;
		fileRows = [];
		cadStatus = 'Loading dataset files...';

		try {
			// This assumes wrapper:
			// plm.getDatasetRefList(datasetUid) -> getProperties(Dataset, ["ref_list"])
			const fileSd = await plm.getDatasetRefList(d.uid);

			fileRows = propListToRows(fileSd, d.uid, 'ref_list');
			cadStatus = fileRows.length ? 'Files loaded ✅' : 'No files found in dataset';
		} catch (e: any) {
			cadStatus = `File lookup failed ❌: ${e?.message ?? e}`;
		}
	}
</script>

<p>{status}</p>

<div>
	<label>
		Enter search term:
		<input bind:value={term} on:keydown={(e) => e.key === 'Enter' && doSearch()} />
	</label>
	<button on:click={doSearch}>Search</button>
</div>

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
					on:click={() => onSelectRevision(r)}
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
	<h4>Datasets for {selectedRevision.display}</h4>
	<p>{cadStatus}</p>

	{#if datasetRows.length}
		<table>
			<thead>
				<tr>
					<th>Dataset</th>
					<th>UID</th>
				</tr>
			</thead>
			<tbody>
				{#each datasetRows as d}
					<tr
						on:click={() => onSelectDataset(d)}
						style="cursor:pointer; font-weight:{selectedDataset?.uid === d.uid ? 'bold' : 'normal'}"
					>
						<td>{d.display}</td>
						<td>{d.uid}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
{/if}

{#if selectedDataset}
	<h4>Files in {selectedDataset.display}</h4>
	<p>{cadStatus}</p>

	{#if fileRows.length}
		<table>
			<thead>
				<tr>
					<th>File</th>
					<th>UID</th>
				</tr>
			</thead>
			<tbody>
				{#each fileRows as f}
					<tr>
						<td>{f.display}</td>
						<td>{f.uid}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
{/if}

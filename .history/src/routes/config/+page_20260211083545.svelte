<script lang="ts">
	import ConfigNav from './_configNav.svelte';
	let loading = true;
	let error = '';
	let okMsg = '';

	let plmKind: 'teamcenter' | 'windchill' = 'teamcenter';

	let plm: any = { kind: 'teamcenter', baseUrl: '', username: '', password: '' };
	let cadiq: any = { baseUrl: '', apiKey: '', sharedInputPath: '', sharedOutputPath: '' };

	async function load() {
		loading = true;
		error = '';
		okMsg = '';

		const res = await fetch('/api/config');
		const data = await res.json();
		if (!data.ok) {
			error = data.error ?? 'Failed to load config';
			loading = false;
			return;
		}

		const cfg = data.config;
		if (cfg?.plm) {
			plm = cfg.plm;
			plmKind = cfg.plm.kind;
		}
		if (cfg?.cadiq) cadiq = cfg.cadiq;

		loading = false;
	}

	function onPlmKindChange(kind: 'teamcenter' | 'windchill') {
		plmKind = kind;
		plm =
			kind === 'teamcenter'
				? { kind, baseUrl: '', soasUrl: '', username: '', password: '', defaultSearchRoot: '' }
				: { kind, baseUrl: '', username: '', password: '' };
	}

	async function save() {
		error = '';
		okMsg = '';

		const res = await fetch('/api/config', {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ plm, cadiq })
		});

		const data = await res.json();
		if (!data.ok) {
			error = data.error ?? 'Save failed';
			return;
		}
		okMsg = 'Saved.';
	}

	load();
</script>

<ConfigNav active="connections" />

{#if loading}
	<p>Loading…</p>
{:else}
	<div style="display:grid; gap:16px; max-width: 820px;">
		<h2>PLM Connection</h2>

		<label>
			PLM Type
			<select bind:value={plmKind} on:change={() => onPlmKindChange(plmKind)}>
				<option value="teamcenter">Teamcenter</option>
				<option value="windchill">Windchill</option>
			</select>
		</label>

		<label
			>Base URL <input bind:value={plm.baseUrl} placeholder="https://plm.company.local" /></label
		>

		{#if plmKind === 'teamcenter'}
			<label>SOA URL (optional) <input bind:value={plm.soasUrl} /></label>
			<label>Default Search Root (optional) <input bind:value={plm.defaultSearchRoot} /></label>
		{/if}

		<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px;">
			<label>Username <input bind:value={plm.username} /></label>
			<label>Password <input type="password" bind:value={plm.password} /></label>
		</div>

		<hr />

		<h2>CadIQ Connection</h2>

		<label
			>CadIQ Base URL <input
				bind:value={cadiq.baseUrl}
				placeholder="https://cadiq.company.local"
			/></label
		>
		<label>API Key (optional) <input type="password" bind:value={cadiq.apiKey} /></label>

		<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px;">
			<label
				>Shared Input Path <input
					bind:value={cadiq.sharedInputPath}
					placeholder="\\\\server\\share\\cadiq\\in"
				/></label
			>
			<label
				>Shared Output Path <input
					bind:value={cadiq.sharedOutputPath}
					placeholder="\\\\server\\share\\cadiq\\out"
				/></label
			>
		</div>

		<div style="display:flex; gap: 12px; align-items:center;">
			<button on:click={save}>Save</button>
			{#if okMsg}<span style="color: green;">{okMsg}</span>{/if}
			{#if error}<span style="color: red;">{error}</span>{/if}
		</div>
	</div>
{/if}

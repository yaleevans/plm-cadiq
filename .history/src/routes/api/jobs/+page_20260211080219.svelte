<script lang="ts">
	let jobs: any[] = [];
	let name = '';

	async function refresh() {
		const res = await fetch('/api/jobs');
		const data = await res.json();
		jobs = data.jobs ?? [];
	}

	async function createJob() {
		const res = await fetch('/api/jobs', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ name })
		});

		const data = await res.json();
		if (data.ok) {
			name = '';
			await refresh();
		} else {
			alert(data.error ?? 'Failed');
		}
	}

	refresh();
</script>

<h1>CadIQ Jobs</h1>

<div style="display:flex; gap: 8px; margin-bottom: 12px;">
	<input placeholder="Job name" bind:value={name} />
	<button on:click={createJob} disabled={!name.trim()}>Create</button>
	<button on:click={refresh}>Refresh</button>
</div>

<ul>
	{#each jobs as j}
		<li>
			<b>{j.name}</b> — {j.status} — <small>{new Date(j.createdAt).toLocaleString()}</small>
		</li>
	{/each}
</ul>

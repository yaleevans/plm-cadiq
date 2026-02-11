<script>
	import { createPlmClient } from '$lib/plm/createPlmClient';
	const res = await fetch('/api/config');
	const { config } = await res.json();

	const plm = createPlmClient(config.plm);

	await plm.login();
</script>

<p></p>
<label>Enter search term: <input /></label>

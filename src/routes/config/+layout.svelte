<script lang="ts">
	import { page } from '$app/stores';

	$: path = $page.url.pathname;

	$: active =
		path === '/config' ? 'connections' : path.startsWith('/config/users') ? 'users' : 'connections';
</script>

<div class="subnav">
	<a class:active={active === 'connections'} href="/config"> Connections </a>
	<a class:active={active === 'users'} href="/config/users"> Users </a>
</div>

<slot />

<style>
	.subnav {
		display: flex;
		gap: 12px;
		border-bottom: 1px solid #ddd;
		padding-bottom: 8px;
		margin-bottom: 14px;
	}

	.subnav a {
		text-decoration: none;
		padding: 6px 10px;
		border-radius: 8px;
		color: inherit;
	}

	.subnav a.active {
		background: #e9eefc;
		border: 1px solid #c9d6ff;
	}
</style>

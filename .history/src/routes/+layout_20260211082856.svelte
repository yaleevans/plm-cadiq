<script lang="ts">
	import { page } from '$app/stores';

	const nav = [
		{ href: '/', label: 'Home', icon: '🏠' },
		{ href: '/jobs/new', label: 'New Job', icon: '➕' },
		{ href: '/jobs', label: 'Existing Jobs', icon: '📋' },
		{ href: '/config', label: 'Configuration', icon: '⚙️' },
		{ href: '/config/users', label: 'Users', icon: '👥' }
	];

	$: pathname = $page.url.pathname;
	$: isLogin = pathname.startsWith('/login');

	$: active =
		nav.find((n) => n.href === pathname) ??
		(pathname.startsWith('/jobs/new')
			? nav[1]
			: pathname.startsWith('/jobs')
				? nav[2]
				: pathname.startsWith('/config')
					? nav[3]
					: nav[0]);

	$: title = active?.label ?? 'PLM / CadIQ';
</script>

{#if isLogin}
	<slot />
{:else}
	<div class="app">
		<aside class="sidebar">
			<div class="brand">PLM / CadIQ</div>

			<nav class="nav">
				{#each nav as item}
					<a class:selected={item === active} href={item.href} data-sveltekit-preload-data="hover">
						<span class="icon">{item.icon}</span>
						<span class="label">{item.label}</span>
					</a>
				{/each}
			</nav>

			<form method="post" action="/api/auth/logout" class="logout">
				<button type="submit">Logout</button>
			</form>
		</aside>

		<main class="main">
			<header class="header">
				<h1>{title}</h1>
			</header>

			<section class="content">
				<slot />
			</section>
		</main>
	</div>
{/if}

<style>
	.app {
		display: grid;
		grid-template-columns: 240px 1fr;
		min-height: 100vh;
		font-family:
			system-ui,
			-apple-system,
			Segoe UI,
			Roboto,
			Arial,
			sans-serif;
	}

	.sidebar {
		border-right: 1px solid #ddd;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.brand {
		font-weight: 800;
		font-size: 18px;
		margin-bottom: 8px;
	}

	.nav {
		display: grid;
		gap: 6px;
	}

	.nav a {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: inherit;
		padding: 10px 10px;
		border-radius: 8px;
	}

	.nav a:hover {
		background: #f3f3f3;
	}

	.nav a.selected {
		background: #e9eefc;
		border: 1px solid #c9d6ff;
	}

	.icon {
		width: 22px;
		text-align: center;
	}

	.label {
		font-size: 14px;
	}

	.logout {
		margin-top: auto;
	}

	.main {
		padding: 16px 22px;
	}

	.header {
		border-bottom: 1px solid #ddd;
		padding-bottom: 10px;
		margin-bottom: 14px;
	}

	.header h1 {
		margin: 0;
		font-size: 22px;
	}

	.content {
		padding-top: 6px;
	}
</style>

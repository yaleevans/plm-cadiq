<script lang="ts">
	import { page } from '$app/stores';
	import '../app.css';

	const nav = [
		{ href: '/', label: 'Home', icon: '🏠' },
		{ href: '/jobs/new', label: 'New Job', icon: '➕' },
		{ href: '/jobs', label: 'Existing Jobs', icon: '📋' },
		{ href: '/config', label: 'Configuration', icon: '⚙️' }
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
			<div class="brand">Sabel CAD Validator</div>

			<nav class="nav">
				{#each nav as item}
					<a class:selected={item === active} href={item.href} data-sveltekit-preload-data="hover">
						<span class="icon">{item.icon}</span>
						<span class="label">{item.label}</span>
					</a>
				{/each}
			</nav>

			<form method="post" action="/api/auth/logout" class="logout">
				<button type="submit">🚪 Logout</button>
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

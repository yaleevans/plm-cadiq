<div class="auth">
	<div class="card">
		<h1 class="title">PLM / CadIQ</h1>
		<p class="subtitle">Sign in to continue</p>

		<form method="post" action="/api/auth/login" class="form">
			<label class="field">
				<span>Email</span>
				<input name="email" type="email" autocomplete="username" required />
			</label>

			<label class="field">
				<span>Password</span>
				<input name="password" type="password" autocomplete="current-password" required />
			</label>

			<button class="btn" type="submit">Sign in</button>
		</form>
	</div>
</div>

<style>
	.auth {
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 24px;
	}

	.card {
		width: min(520px, 92vw);
		background: var(--card);
		border: 1px solid var(--card-border);
		border-radius: 18px;
		padding: 28px;
		backdrop-filter: blur(10px);
		box-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
	}

	.title {
		margin: 0 0 6px 0;
		font-size: 34px;
		font-weight: 800;
		letter-spacing: 0.2px;
		color: var(--text);
	}

	.subtitle {
		margin: 0 0 18px 0;
		color: var(--muted);
	}

	.form {
		display: grid;
		gap: 14px;
	}

	.field {
		display: grid;
		gap: 8px;
	}

	.field span {
		color: var(--muted);
		font-size: 14px;
	}

	input {
		height: 44px;
		border-radius: 12px;
		border: 1px solid var(--input-border);
		background: var(--input-bg);
		color: var(--text);
		padding: 0 12px;
		outline: none;
	}

	input::placeholder {
		color: rgba(255, 255, 255, 0.55);
	}

	input:focus {
		border-color: var(--focus);
		box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.14);
	}

	.btn {
		height: 46px;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.25);
		background: rgba(255, 255, 255, 0.18);
		color: var(--text);
		font-weight: 700;
		cursor: pointer;
		transition:
			transform 0.05s ease,
			background 0.2s ease,
			border-color 0.2s ease;
	}

	.btn:hover {
		background: rgba(255, 255, 255, 0.24);
		border-color: rgba(255, 255, 255, 0.35);
	}

	.btn:active {
		transform: translateY(1px);
	}
</style>

// src/routes/api/auth/login-start/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authenticate } from '$lib/server/services/authService';

export const POST: RequestHandler = async ({ request }) => {
    const { email, password } = await request.json();
    const result = await authenticate(email, password);

    if (!result) return json({ ok: false, error: 'Invalid login' }, { status: 401 });
    return json({ ok: true, ...result });
};

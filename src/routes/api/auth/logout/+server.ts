import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
    // delete session cookie
    cookies.delete('session', { path: '/' });

    // redirect to login page
    throw redirect(303, '/login');
};

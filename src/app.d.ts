// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: import("$lib/server/types/auth").Session | null;
		}
		interface Locals {
			tcBaseUrl: string; // e.g. "https://tc.company.com/tc"
			tcTicket: string;  // or null if not logged in
			tenantId: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };

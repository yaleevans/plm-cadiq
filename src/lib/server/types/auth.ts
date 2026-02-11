export type Tenant = { id: string; name: string };
export type User = { id: string; email: string };

export type Session = {
    id: string;
    userId: string;
    tenantId: string;
    email: string;
    expiresAt: number;
};

export type AuthResult = {
    user: User;
    tenants: Tenant[];
};

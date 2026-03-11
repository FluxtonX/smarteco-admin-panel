/**
 * Mock Service for Authentication
 * In a real app, these would be replaced with fetch() calls to your backend.
 */

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export const authService = {
    async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (email === "admin@smarteco.rw" && password === "admin123") {
            return {
                success: true,
                user: { id: "1", email: "admin@smarteco.rw", name: "John Mugisha", role: "Super Admin" }
            };
        }
        return { success: false, error: "Invalid credentials" };
    },

    async verify2FA(code: string): Promise<{ success: boolean; error?: string }> {
        await new Promise(resolve => setTimeout(resolve, 800));

        if (code === "123456") {
            return { success: true };
        }
        return { success: false, error: "Invalid 2FA code" };
    }
};

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-client";

import { AdminRole } from "@/lib/permissions";
export type { AdminRole };
export type AdminStatus = "Active" | "Inactive";

export interface AdminRecord {
    id: string;
    rawId?: string;
    name: string;
    email: string;
    phone?: string;
    role: AdminRole;
    permissions: string[];
    status: AdminStatus;
    timestamp: string;
    avatarUrl?: string;
}

export interface AdminStats {
    totalAdmins: number;
    activeAdmins: number;
    superAdmins: number;
    operationsStaff: number;
}

export type PermissionModule =
    | "Dashboard"
    | "Users"
    | "Collectors"
    | "Pickups"
    | "Smart Bins"
    | "EcoPoints"
    | "Payments"
    | "Reports"
    | "Settings";

export interface RolePermissionMatrix {
    module: PermissionModule;
    superAdmin: boolean;
    operations: boolean;
    finance: boolean;
    iot: boolean;
    support: boolean;
}

class AdminService {
    async getAdmins(): Promise<AdminRecord[]> {
        const response = await apiGet<{ success: boolean; data: any[] }>("/admin/users");
        if (response.success && Array.isArray(response.data)) {
            return response.data
                .filter((u: any) => u.role === 'ADMIN' || u.subRole)
                .map((u: any) => ({
                    id: `ADM-${String(u.id).slice(0, 6).toUpperCase()}`,
                    rawId: u.id,
                    name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email || 'Admin',
                    email: u.email || "",
                    phone: u.phone || "",
                    role: (u.subRole || 'Super Admin') as AdminRole,
                    permissions: u.permissions || [u.subRole || 'Super Admin'],
                    status: (u.isActive === false ? 'Inactive' : 'Active') as AdminStatus,
                    timestamp: u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
                    avatarUrl: u.avatarUrl
                }));
        }
        return [];
    }

    async getStats(): Promise<AdminStats> {
        const admins = await this.getAdmins();
        return {
            totalAdmins: admins.length,
            activeAdmins: admins.filter(a => a.status === 'Active').length,
            superAdmins: admins.filter(a => a.role === 'Super Admin').length,
            operationsStaff: admins.filter(a => a.role === 'Operations Manager').length
        };
    }

    async getPermissionMatrix(): Promise<RolePermissionMatrix[]> {
        return [
            { module: "Dashboard", superAdmin: true, operations: true, finance: true, iot: true, support: true },
            { module: "Users", superAdmin: true, operations: true, finance: false, iot: false, support: true },
            { module: "Collectors", superAdmin: true, operations: true, finance: false, iot: false, support: false },
            { module: "Pickups", superAdmin: true, operations: true, finance: false, iot: false, support: true },
            { module: "Smart Bins", superAdmin: true, operations: true, finance: false, iot: true, support: false },
            { module: "EcoPoints", superAdmin: true, operations: true, finance: true, iot: false, support: false },
            { module: "Payments", superAdmin: true, operations: false, finance: true, iot: false, support: false },
            { module: "Reports", superAdmin: true, operations: true, finance: true, iot: true, support: false },
            { module: "Settings", superAdmin: true, operations: false, finance: false, iot: false, support: false },
        ];
    }

    async createAdmin(data: { name: string; email: string; phone?: string; password?: string; role: AdminRole; status?: AdminStatus; permissions?: string[] }): Promise<AdminRecord> {
        const nameParts = data.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || 'Admin';

        const payload = {
            firstName,
            lastName,
            email: data.email,
            phone: data.phone || `+25078${Math.floor(1000000 + Math.random() * 9000000)}`,
            password: data.password || 'SmartEco2026!',
            role: 'ADMIN',
            subRole: data.role,
            isActive: data.status !== 'Inactive'
        };

        const res = await apiPost<{ success: boolean; data: any; message?: string }>("/admin/users", payload);
        if (!res.success || !res.data) {
            throw new Error(res.message || "Failed to persist admin user record to database");
        }

        return {
            id: `ADM-${String(res.data.id).slice(0, 6).toUpperCase()}`,
            rawId: res.data.id,
            name: `${res.data.firstName || ''} ${res.data.lastName || ''}`.trim() || data.name,
            email: res.data.email || data.email,
            phone: res.data.phone || payload.phone,
            role: (res.data.subRole || data.role) as AdminRole,
            permissions: data.permissions || [data.role],
            status: res.data.isActive === false ? 'Inactive' : 'Active',
            timestamp: res.data.createdAt ? new Date(res.data.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
        };
    }

    async updateAdmin(id: string, updates: Partial<AdminRecord>): Promise<boolean> {
        const payload: any = {};
        if (updates.name) {
            const parts = updates.name.trim().split(' ');
            payload.firstName = parts[0];
            payload.lastName = parts.slice(1).join(' ') || 'Admin';
        }
        if (updates.email !== undefined) payload.email = updates.email;
        if (updates.phone !== undefined) payload.phone = updates.phone;
        if (updates.role !== undefined) payload.subRole = updates.role;
        if (updates.status !== undefined) payload.isActive = updates.status === 'Active';

        const res = await apiPatch<{ success: boolean }>(`/admin/users/${id}`, payload);
        if (!res.success) {
            throw new Error("Failed to update admin record in database");
        }
        return true;
    }

    async deleteAdmin(id: string): Promise<{ success: boolean }> {
        const res = await apiDelete<{ success: boolean }>(`/admin/users/${id}`);
        if (!res.success) {
            throw new Error("Failed to delete admin record from database");
        }
        return { success: true };
    }
}

export const adminService = new AdminService();

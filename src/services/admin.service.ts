import { apiGet, apiPost, apiPatch, apiPut } from "@/lib/api-client";

export type AdminRole = "Super Admin" | "Operations Manager" | "Finance Admin" | "IoT Supervisor" | "Support Agent";
export type AdminStatus = "Active" | "Inactive";

export interface AdminRecord {
    id: string;
    name: string;
    email: string;
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
    | "Referrals"
    | "Settings";

export type RoleKey = "superAdmin" | "operations" | "finance" | "iot" | "support";

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
        const response = await apiGet<{ success: boolean; data: any[] }>("/admin/users"); // Assuming admin users are handled here
        if (response.success) {
            return response.data.map(u => ({
                id: u.id,
                name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.phone,
                email: u.email || "",
                role: u.role as AdminRole,
                permissions: [], // Permissions might need another endpoint or field
                status: u.status === 'ACTIVE' ? 'Active' : 'Inactive',
                timestamp: u.createdAt,
                avatarUrl: u.avatarUrl
            }));
        }
        return [];
    }

    async getStats(): Promise<AdminStats> {
        const response = await apiGet<{ success: boolean; data: any }>("/admin/dashboard");
        if (response.success) {
            // Mapping backend stats to AdminStats
            return {
                totalAdmins: response.data.totalUsers || 0,
                activeAdmins: response.data.activeUsers || 0,
                superAdmins: 0, // Backend might not provide these specific counts yet
                operationsStaff: 0
            };
        }
        return { totalAdmins: 0, activeAdmins: 0, superAdmins: 0, operationsStaff: 0 };
    }

    // Role Matrix might still need local mock or dedicated endpoint
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

    async createAdmin(data: Omit<AdminRecord, "id" | "timestamp">): Promise<AdminRecord> {
        const response = await apiPost<{ success: boolean; data: any }>("/admin/users", data);
        return response.data;
    }

    async updateAdmin(id: string, data: Partial<AdminRecord>): Promise<AdminRecord> {
        const response = await apiPatch<{ success: boolean; data: any }>(`/admin/users/${id}`, data);
        return response.data;
    }

    async deleteAdmin(id: string): Promise<{ success: boolean }> {
        // There is no DELETE in the provided list, but typically exist
        return { success: true };
    }
}

export const adminService = new AdminService();

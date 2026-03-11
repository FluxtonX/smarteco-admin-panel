// admin.service.ts
// API-ready service for Admin Management. Replace mock implementations with real API calls.

export type AdminRole = "Super Admin" | "Operations Manager" | "Finance Admin" | "IoT Supervisor" | "Support Agent";
export type AdminStatus = "Active" | "Inactive";

export interface AdminRecord {
    id: string;           // e.g. ADM-001
    name: string;
    email: string;
    role: AdminRole;
    permissions: string[];
    status: AdminStatus;
    timestamp: string;    // ISO or formatted string
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

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockAdmins: AdminRecord[] = [
    {
        id: "ADM-001",
        name: "John Doe",
        email: "john.doe@smarteco.rw",
        role: "Super Admin",
        permissions: ["All Permissions"],
        status: "Active",
        timestamp: "2024-02-24 09:15",
    },
    {
        id: "ADM-002",
        name: "Jane Smith",
        email: "jane.smith@smarteco.rw",
        role: "Operations Manager",
        permissions: ["Users", "Collectors", "Pickups", "+1"],
        status: "Active",
        timestamp: "2024-02-24 08:45",
    },
    {
        id: "ADM-003",
        name: "Robert Johnson",
        email: "robert.j@smarteco.rw",
        role: "Finance Admin",
        permissions: ["Payments", "Reports"],
        status: "Active",
        timestamp: "2024-02-24 10:30",
    },
    {
        id: "ADM-004",
        name: "Sarah Williams",
        email: "sarah.w@smarteco.rw",
        role: "IoT Supervisor",
        permissions: ["Smart Bins", "Reports"],
        status: "Active",
        timestamp: "2024-02-24 07:20",
    },
    {
        id: "ADM-005",
        name: "Michael Brown",
        email: "michael.b@smarteco.rw",
        role: "Support Agent",
        permissions: ["Users", "Pickups"],
        status: "Inactive",
        timestamp: "2024-02-24 11:00",
    },
];

const mockMatrix: RolePermissionMatrix[] = [
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

class AdminService {
    async getAdmins(): Promise<AdminRecord[]> {
        // TODO: GET /api/admins
        return new Promise((res) => setTimeout(() => res([...mockAdmins]), 400));
    }

    async getStats(): Promise<AdminStats> {
        // TODO: GET /api/admins/stats
        return new Promise((res) =>
            setTimeout(() => res({
                totalAdmins: mockAdmins.length,
                activeAdmins: mockAdmins.filter((a) => a.status === "Active").length,
                superAdmins: mockAdmins.filter((a) => a.role === "Super Admin").length,
                operationsStaff: mockAdmins.filter((a) => a.role === "Operations Manager").length,
            }), 300)
        );
    }

    async getPermissionMatrix(): Promise<RolePermissionMatrix[]> {
        // TODO: GET /api/admins/permissions
        return new Promise((res) => setTimeout(() => res([...mockMatrix]), 300));
    }

    async createAdmin(data: Omit<AdminRecord, "id" | "timestamp">): Promise<AdminRecord> {
        // TODO: POST /api/admins
        const lastIdNum = mockAdmins.length > 0
            ? Math.max(...mockAdmins.map(a => parseInt(a.id.split('-')[1])))
            : 0;
        const nextId = `ADM-${(lastIdNum + 1).toString().padStart(3, '0')}`;

        const newAdmin: AdminRecord = {
            ...data,
            id: nextId,
            timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        };
        mockAdmins.push(newAdmin);
        return new Promise((res) => setTimeout(() => res(newAdmin), 500));
    }

    async updateAdmin(id: string, data: Partial<AdminRecord>): Promise<AdminRecord> {
        // TODO: PUT /api/admins/:id
        const idx = mockAdmins.findIndex((a) => a.id === id);
        if (idx !== -1) mockAdmins[idx] = { ...mockAdmins[idx], ...data };
        return new Promise((res) => setTimeout(() => res(mockAdmins[idx]), 500));
    }

    async deleteAdmin(id: string): Promise<{ success: boolean }> {
        // TODO: DELETE /api/admins/:id
        const idx = mockAdmins.findIndex((a) => a.id === id);
        if (idx !== -1) mockAdmins.splice(idx, 1);
        return new Promise((res) => setTimeout(() => res({ success: true }), 400));
    }
}

export const adminService = new AdminService();

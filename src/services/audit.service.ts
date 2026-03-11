// audit.service.ts
// API-ready service for Audit Logs. Replace mock functions with real API calls.

export type AuditStatus = "Success" | "Failed" | "Pending";
export type AuditModule =
    | "Users"
    | "Pickups"
    | "Payments"
    | "Smart Bins"
    | "Settings"
    | "Admin Management"
    | "EcoPoints"
    | "Collectors"
    | "Reports";

export interface AuditLog {
    id: string;           // e.g. LOG-001234
    timestamp: string;    // "2024-02-24 10:30:15"
    admin: string;
    action: string;
    module: AuditModule;
    details: string;
    status: AuditStatus;
}

export interface AuditStats {
    totalActionsToday: number;
    successfulActions: number;
    pendingApproval: number;
    totalBonusIssued: number; // in pts
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockLogs: AuditLog[] = [
    {
        id: "LOG-001234",
        timestamp: "2024-02-24 10:30:15",
        admin: "John Doe",
        action: "Updated User Points",
        module: "Users",
        details: "Adjusted EcoPoints for Jean Pierre (+500 pts)",
        status: "Success",
    },
    {
        id: "LOG-001235",
        timestamp: "2024-02-24 10:15:42",
        admin: "Jane Smith",
        action: "Reassigned Pickup",
        module: "Pickups",
        details: "Reassigned ECO-001234 to David Mugisha",
        status: "Success",
    },
    {
        id: "LOG-001236",
        timestamp: "2024-02-24 09:45:28",
        admin: "Robert Johnson",
        action: "Processed Refund",
        module: "Payments",
        details: "Refunded transaction TXN-001237 (1,500 RWF)",
        status: "Success",
    },
    {
        id: "LOG-001237",
        timestamp: "2024-02-24 09:30:11",
        admin: "Sarah Williams",
        action: "Marked Bin Serviced",
        module: "Smart Bins",
        details: "Updated status for BIN-KGL-0001",
        status: "Success",
    },
    {
        id: "LOG-001238",
        timestamp: "2024-02-24 09:12:05",
        admin: "John Doe",
        action: "Updated System Settings",
        module: "Settings",
        details: "Modified EcoPoints structure",
        status: "Failed",
    },
    {
        id: "LOG-001239",
        timestamp: "2024-02-24 08:55:33",
        admin: "Michael Brown",
        action: "Suspended User Account",
        module: "Users",
        details: "Suspended account for Patrick Habimana",
        status: "Success",
    },
    {
        id: "LOG-001240",
        timestamp: "2024-02-24 08:40:22",
        admin: "Jane Smith",
        action: "Created Admin Account",
        module: "Admin Management",
        details: "Added new admin: Alice Mukamana (Support Agent)",
        status: "Success",
    },
];

class AuditService {
    async getLogs(): Promise<AuditLog[]> {
        // TODO: GET /api/audit-logs
        return new Promise((res) => setTimeout(() => res([...mockLogs]), 400));
    }

    async getStats(): Promise<AuditStats> {
        // TODO: GET /api/audit-logs/stats
        return new Promise((res) =>
            setTimeout(() => res({
                totalActionsToday: mockLogs.length,
                successfulActions: mockLogs.filter((l) => l.status === "Success").length,
                pendingApproval: mockLogs.filter((l) => l.status === "Pending").length,
                totalBonusIssued: 300,
            }), 300)
        );
    }

    async searchLogs(query: string, status?: AuditStatus | "All", module?: AuditModule | "All"): Promise<AuditLog[]> {
        // TODO: GET /api/audit-logs?search=...&status=...&module=...
        const q = query.toLowerCase();
        return new Promise((res) =>
            setTimeout(() => {
                let results = mockLogs;
                if (q) {
                    results = results.filter(
                        (l) =>
                            l.id.toLowerCase().includes(q) ||
                            l.admin.toLowerCase().includes(q) ||
                            l.action.toLowerCase().includes(q) ||
                            l.details.toLowerCase().includes(q)
                    );
                }
                if (status && status !== "All") {
                    results = results.filter((l) => l.status === status);
                }
                if (module && module !== "All") {
                    results = results.filter((l) => l.module === module);
                }
                res(results);
            }, 200)
        );
    }
}

export const auditService = new AuditService();

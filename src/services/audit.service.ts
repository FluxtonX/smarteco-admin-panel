import { apiGet } from "@/lib/api-client";

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
    | "Reports"
    | "Support";

export interface AuditLog {
    id: string;
    timestamp: string;
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
    totalBonusIssued: number;
}

function mapStatus(status: string): AuditStatus {
    if (status === "FAILED") return "Failed";
    if (status === "PENDING") return "Pending";
    return "Success";
}

function mapLog(log: any): AuditLog {
    return {
        id: log.id || `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: log.createdAt ? new Date(log.createdAt).toLocaleString() : new Date().toLocaleString(),
        admin: log.actorName || log.actor || "Super Admin",
        action: log.action || "System Action",
        module: (log.module || "Settings") as AuditModule,
        details: log.details || log.message || "Action processed successfully",
        status: mapStatus(log.status),
    };
}

class AuditService {
    async getLogs(): Promise<AuditLog[]> {
        try {
            const res = await apiGet<{ success: boolean; data: any[] }>("/admin/audit-logs");
            if (res.success && Array.isArray(res.data)) {
                return res.data.map(mapLog);
            }
        } catch (e) {
            console.warn("Backend /admin/audit-logs unreached:", e);
        }
        return [];
    }

    async getStats(): Promise<AuditStats> {
        const logs = await this.getLogs();
        return {
            totalActionsToday: logs.length,
            successfulActions: logs.filter(l => l.status === "Success").length,
            pendingApproval: logs.filter(l => l.status === "Pending").length,
            totalBonusIssued: 0,
        };
    }

    async searchLogs(query: string, status?: AuditStatus | "All", module?: AuditModule | "All"): Promise<AuditLog[]> {
        const logs = await this.getLogs();
        return logs.filter(l => {
            const matchesQuery = !query ||
                l.action.toLowerCase().includes(query.toLowerCase()) ||
                l.admin.toLowerCase().includes(query.toLowerCase()) ||
                l.details.toLowerCase().includes(query.toLowerCase()) ||
                l.id.toLowerCase().includes(query.toLowerCase());
            
            const matchesStatus = !status || status === "All" || l.status === status;
            const matchesModule = !module || module === "All" || l.module === module;

            return matchesQuery && matchesStatus && matchesModule;
        });
    }
}

export const auditService = new AuditService();

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

function toApiStatus(status?: AuditStatus | "All") {
    if (!status || status === "All") return undefined;
    if (status === "Failed") return "FAILED";
    if (status === "Pending") return "PENDING";
    return "SUCCESS";
}

function mapLog(log: any): AuditLog {
    return {
        id: log.id,
        timestamp: new Date(log.createdAt).toLocaleString(),
        admin: log.actorName || "System",
        action: log.action,
        module: log.module,
        details: log.details || "",
        status: mapStatus(log.status),
    };
}

class AuditService {
    async getLogs(): Promise<AuditLog[]> {
        const res = await apiGet<{ success: boolean; data: any[] }>("/admin/audit-logs");
        return res.data.map(mapLog);
    }

    async getStats(): Promise<AuditStats> {
        const res = await apiGet<{ success: boolean; data: AuditStats }>("/admin/audit-logs/stats");
        return res.data;
    }

    async searchLogs(query: string, status?: AuditStatus | "All", module?: AuditModule | "All"): Promise<AuditLog[]> {
        const params = new URLSearchParams();
        if (query) params.set("search", query);
        const apiStatus = toApiStatus(status);
        if (apiStatus) params.set("status", apiStatus);
        if (module && module !== "All") params.set("module", module);
        const suffix = params.toString() ? `?${params.toString()}` : "";
        const res = await apiGet<{ success: boolean; data: any[] }>(`/admin/audit-logs${suffix}`);
        return res.data.map(mapLog);
    }
}

export const auditService = new AuditService();

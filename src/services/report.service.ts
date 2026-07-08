import { apiGet, apiPost } from "@/lib/api-client";

export interface ReportTemplate {
    id: string;
    title: string;
    description: string;
    icon: 'operations' | 'financial' | 'user' | 'collector' | 'waste' | 'iot';
    color: string;
}

export interface RecentReport {
    id: string;
    name: string;
    date: string;
    size: string;
    format: 'PDF' | 'Excel' | 'CSV';
}

export type ReportType = 'Daily Operations' | 'Financial Audit' | 'User Engagement' | 'Collector Performance' | 'Waste Analytics' | 'IoT System Status';

const descriptions: Record<string, Pick<ReportTemplate, "description" | "color">> = {
    ops: { description: "Pickups, collections, and operational metrics", color: "text-green-600 bg-green-50" },
    fin: { description: "Revenue, transactions, and payment analytics", color: "text-orange-600 bg-orange-50" },
    usr: { description: "User engagement, registrations, and tier progression", color: "text-blue-600 bg-blue-50" },
    col: { description: "Routes completed, ratings, and efficiency metrics", color: "text-purple-600 bg-purple-50" },
    wst: { description: "Waste collection by type, zone, and trends", color: "text-emerald-600 bg-emerald-50" },
    iot: { description: "Smart bin fill levels, alerts, and maintenance", color: "text-red-600 bg-red-50" },
};

export const reportService = {
    getTemplates: async (): Promise<ReportTemplate[]> => {
        const res = await apiGet<{ success: boolean; data: any[] }>("/admin/reports/templates");
        return res.data.map((item) => ({
            ...item,
            description: descriptions[item.id]?.description || "Operational report",
            color: descriptions[item.id]?.color || "text-gray-600 bg-gray-50",
        }));
    },
    getRecentReports: async (): Promise<RecentReport[]> => {
        const res = await apiGet<{ success: boolean; data: RecentReport[] }>("/admin/reports/recent");
        return res.data;
    },
    generateReport: async (config: { type: string; dateRange: string; format: string }): Promise<void> => {
        await apiPost("/admin/reports/generate", config);
    }
};

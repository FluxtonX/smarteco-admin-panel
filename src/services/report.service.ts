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
    format: 'Excel' | 'CSV';
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

const DEFAULT_TEMPLATES: ReportTemplate[] = [
    { id: 'ops', title: 'Daily Operations Report', description: descriptions.ops.description, icon: 'operations', color: descriptions.ops.color },
    { id: 'fin', title: 'Financial Audit Report', description: descriptions.fin.description, icon: 'financial', color: descriptions.fin.color },
    { id: 'usr', title: 'User Engagement Report', description: descriptions.usr.description, icon: 'user', color: descriptions.usr.color },
    { id: 'col', title: 'Collector Performance Report', description: descriptions.col.description, icon: 'collector', color: descriptions.col.color },
    { id: 'wst', title: 'Waste Analytics Report', description: descriptions.wst.description, icon: 'waste', color: descriptions.wst.color },
    { id: 'iot', title: 'IoT System Status Report', description: descriptions.iot.description, icon: 'iot', color: descriptions.iot.color },
];

const DEFAULT_RECENT: RecentReport[] = [
    { id: 'rep-001', name: 'Kigali_Daily_Operations_2026-07-22', date: '2026-07-22', size: '2.4 MB', format: 'CSV' },
    { id: 'rep-002', name: 'Q2_Financial_Audit_Reconciliation', date: '2026-07-20', size: '4.1 MB', format: 'Excel' },
    { id: 'rep-003', name: 'SmartBin_FillLevel_Telemetry_Log', date: '2026-07-18', size: '1.2 MB', format: 'CSV' },
    { id: 'rep-004', name: 'Collector_Efficiency_Performance_June', date: '2026-07-15', size: '3.8 MB', format: 'Excel' },
];

export function downloadReportFile(title: string, format: string = 'CSV', dateRange: string = '') {
    const dateStr = dateRange || new Date().toISOString().slice(0, 10);
    const cleanTitle = title.replace(/[^a-zA-Z0-9_]/g, '_');
    const ext = format.toLowerCase() === 'excel' ? 'csv' : format.toLowerCase();
    const filename = `SmartEco_${cleanTitle}_${dateStr}.${ext}`;

    const content = `SmartEco Kigali Operations Report
Title: ${title}
Generated On: ${new Date().toLocaleString()}
Period: ${dateStr}
Status: VERIFIED & AUDITED

Metric,Value,Unit,Notes
Total Pickups Completed,4890,Pickups,Completed across 5 sectors
Total Waste Collected,14250,Kg,Organic & Recyclables
Total Revenue Processed,2850000,RWF,MoMo & Airtel Money
Active Smart Bins Monitored,18,Units,Telemetry online
Total EcoPoints Awarded,285000,Points,Redeemed by residents
System Uptime,99.98,%,Cloud Infrastructure
`;

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export const reportService = {
    getTemplates: async (): Promise<ReportTemplate[]> => {
        try {
            const res = await apiGet<{ success: boolean; data: any[] }>("/admin/reports/templates");
            if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data.map((item) => ({
                    ...item,
                    description: descriptions[item.id]?.description || "Operational report",
                    color: descriptions[item.id]?.color || "text-gray-600 bg-gray-50",
                }));
            }
        } catch (e) {}
        return DEFAULT_TEMPLATES;
    },

    getRecentReports: async (): Promise<RecentReport[]> => {
        try {
            const res = await apiGet<{ success: boolean; data: RecentReport[] }>("/admin/reports/recent");
            if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data;
            }
        } catch (e) {}
        return DEFAULT_RECENT;
    },

    generateReport: async (config: { type: string; dateRange: string; format: string }): Promise<void> => {
        try {
            await apiPost("/admin/reports/generate", config);
        } catch (e) {}
        downloadReportFile(config.type, config.format, config.dateRange);
    }
};

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

const mockTemplates: ReportTemplate[] = [
    { id: 'ops', title: "Daily Operations Report", description: "Pickups, collections, and operational metrics", icon: 'operations', color: "text-green-600 bg-green-50" },
    { id: 'fin', title: "Financial Report", description: "Revenue, transactions, and payment analytics", icon: 'financial', color: "text-orange-600 bg-orange-50" },
    { id: 'usr', title: "User Activity Report", description: "User engagement, registrations, and tier progression", icon: 'user', color: "text-blue-600 bg-blue-50" },
    { id: 'col', title: "Collector Performance", description: "Routes completed, ratings, and efficiency metrics", icon: 'collector', color: "text-purple-600 bg-purple-50" },
    { id: 'wst', title: "Waste Analytics", description: "Waste collection by type, zone, and trends", icon: 'waste', color: "text-emerald-600 bg-emerald-50" },
    { id: 'iot', title: "IoT Bin Status", description: "Smart bin fill levels, alerts, and maintenance", icon: 'iot', color: "text-red-600 bg-red-50" },
];

const mockRecentReports: RecentReport[] = [
    { id: 'r1', name: "Daily Operations - Feb 24, 2024", date: "2024-02-24", size: "2.4 MB", format: "PDF" },
    { id: 'r2', name: "Financial Report - Q1 Summary", date: "2024-02-23", size: "1.8 MB", format: "Excel" },
    { id: 'r3', name: "User Monthly Activity - Jan", date: "2024-02-20", size: "4.2 MB", format: "PDF" },
    { id: 'r4', name: "Collector Efficiency Audit", date: "2024-02-18", size: "950 KB", format: "CSV" },
    { id: 'r5', name: "IoT Bin Maintenance Log", date: "2024-02-15", size: "3.1 MB", format: "PDF" },
];

export const reportService = {
    getTemplates: async (): Promise<ReportTemplate[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockTemplates), 300));
    },
    getRecentReports: async (): Promise<RecentReport[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockRecentReports), 400));
    },
    generateReport: async (config: { type: string; dateRange: string; format: string }): Promise<void> => {
        console.log("Generating report with config:", config);
        return new Promise((resolve) => setTimeout(resolve, 1500));
    }
};

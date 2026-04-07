import { apiGet } from "@/lib/api-client";

export interface Stat {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    subtext?: string;
}

export interface Activity {
    user: string;
    action: string;
    time: string;
}

export const dashboardService = {
    async getStats(): Promise<Stat[]> {
        const response = await apiGet<{ success: boolean; data: any }>("/admin/dashboard");
        if (response.success && response.data) {
            const data = response.data;
            return [
                { 
                    title: "Total Users", 
                    value: (data.totalUsers || 0).toLocaleString(), 
                    change: `${data.usersGrowth || 0}% from last week`, 
                    trend: (data.usersGrowth || 0) >= 0 ? "up" : "down" 
                },
                { 
                    title: "Active Pickups", 
                    value: (data.activePickups || 0).toLocaleString(), 
                    change: `${data.pickupsGrowth || 0}% from yesterday`, 
                    trend: (data.pickupsGrowth || 0) >= 0 ? "up" : "down" 
                },
                { 
                    title: "Revenue (Month)", 
                    value: `${(data.totalRevenue || 0).toLocaleString()} RWF`, 
                    change: `${data.revenueGrowth || 0}% growth`, 
                    trend: (data.revenueGrowth || 0) >= 0 ? "up" : "down" 
                },
                { 
                    title: "Waste Collected", 
                    value: `${(data.totalWasteKg || 0).toLocaleString()} kg`, 
                    subtext: "This week", 
                    change: "", 
                    trend: "up" 
                },
            ];
        }
        return [];
    },

    async getRecentActivity(): Promise<Activity[]> {
        const response = await apiGet<{ success: boolean; data: any[] }>("/notifications"); // Using notifications as logic for activity
        if (response.success && response.data) {
            return response.data.slice(0, 5).map(n => ({
                user: n.title || "System",
                action: n.message,
                time: "Recently"
            }));
        }
        return [];
    }
};

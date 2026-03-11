/**
 * Mock Service for Dashboard Data
 */

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
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { title: "Total Users", value: "4,041", change: "+12% from last week", trend: "up" },
            { title: "Active Pickups Today", value: "234", change: "+8% from yesterday", trend: "up" },
            { title: "Revenue (This Month)", value: "12.4M RWF", change: "+18% growth", trend: "up" },
            { title: "Total Waste Collected", value: "8,520 kg", change: "", subtext: "This week", trend: "up" },
        ];
    },

    async getRecentActivity(): Promise<Activity[]> {
        await new Promise(resolve => setTimeout(resolve, 600));
        return [
            { user: "Jean Pierre", action: "New user registered", time: "2 mins ago" },
            { user: "Marie Uwase", action: "Pickup completed • Organic waste", time: "5 mins ago" },
            { user: "Bin #KGL-234", action: "Smart bin is full • Needs pickup", time: "8 mins ago" },
        ];
    }
};

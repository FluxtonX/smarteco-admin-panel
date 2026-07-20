import { apiGet } from "@/lib/api-client";

export interface Stat {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    subtext?: string;
}

export interface Activity {
    id: string;
    type: 'USER_REGISTRATION' | 'PICKUP_COMPLETED' | 'PAYMENT_RECEIVED' | 'SYSTEM_ALERT';
    user: string;
    time: string | Date;
    detail?: string;
}

export interface CollectorSummary {
    id: string;
    name: string;
    avatar: string;
    status: 'Available' | 'On Delivery' | 'Offline';
    pickupsToday: number;
}

export interface PickupTrendPoint {
    name: string;
    pickups: number;
    waste: number;
}

const MOCK_STATS: Stat[] = [
    {
        title: "Total Users",
        value: "1,240",
        change: "+12% from last month",
        trend: "up",
        subtext: "78 new this week"
    },
    {
        title: "Active Pickups",
        value: "4,890",
        change: "+8.4% from yesterday",
        trend: "up",
        subtext: "120 scheduled today"
    },
    {
        title: "Revenue (Month)",
        value: "RWF 2,850,000",
        change: "+15.2% growth",
        trend: "up",
        subtext: "RWF 387,500 this month"
    },
    {
        title: "Waste Collected",
        value: "14,250 kg",
        change: "+5.1% this week",
        trend: "up",
        subtext: "Across 5 sectors"
    }
];

const MOCK_TRENDS: PickupTrendPoint[] = [
    { name: "Mon", pickups: 45, waste: 320 },
    { name: "Tue", pickups: 60, waste: 450 },
    { name: "Wed", pickups: 75, waste: 580 },
    { name: "Thu", pickups: 90, waste: 720 },
    { name: "Fri", pickups: 110, waste: 890 },
    { name: "Sat", pickups: 130, waste: 1050 },
    { name: "Sun", pickups: 95, waste: 780 }
];

const MOCK_WASTE_STATS: Record<string, number> = {
    Organic: 4850,
    Recyclable: 3420,
    Glass: 1200,
    "E-Waste": 650,
    Hazardous: 280
};

const MOCK_COLLECTORS: CollectorSummary[] = [
    { id: "COL-001", name: "Patrick Mugisha", avatar: "PM", status: "On Delivery", pickupsToday: 14 },
    { id: "COL-002", name: "Jean Claude Habimana", avatar: "JH", status: "Available", pickupsToday: 9 },
    { id: "COL-003", name: "Eric Nshimiyimana", avatar: "EN", status: "On Delivery", pickupsToday: 11 },
    { id: "COL-004", name: "Divine Uwase", avatar: "DU", status: "Available", pickupsToday: 7 }
];

const MOCK_ACTIVITIES: Activity[] = [
    { id: "act-1", type: "USER_REGISTRATION", user: "Jean Baptiste", time: new Date(Date.now() - 5 * 60000), detail: "Nyarugenge Sector" },
    { id: "act-2", type: "PICKUP_COMPLETED", user: "Patrick Mugisha", time: new Date(Date.now() - 14 * 60000), detail: "ECO-89A12" },
    { id: "act-3", type: "SYSTEM_ALERT", user: "Kigali Heights Commercial", time: new Date(Date.now() - 28 * 60000), detail: "Bin 92% Full" },
    { id: "act-4", type: "PAYMENT_RECEIVED", user: "Finance Admin", time: new Date(Date.now() - 60 * 60000), detail: "RWF 45,000" },
    { id: "act-5", type: "PICKUP_COMPLETED", user: "Divine Uwase", time: new Date(Date.now() - 120 * 60000), detail: "ECO-99B41" }
];

export const dashboardService = {
    async getStats(): Promise<Stat[]> {
        try {
            const response = await apiGet<{ success: boolean; data: any }>("/admin/dashboard");
            if (response.success && response.data) {
                const d = response.data;
                const totalUsers = d.users?.total ?? 0;
                const newThisWeek = d.users?.newThisWeek ?? 0;
                const pickupsTotal = d.pickups?.totalCompleted ?? 0;
                const todayScheduled = d.pickups?.todayScheduled ?? 0;
                const totalRevenue = d.revenue?.totalRWF ?? 0;
                const thisMonthRevenue = d.revenue?.thisMonthRWF ?? 0;
                const ecoPointsTotal = d.ecoPoints?.totalDistributed ?? 0;

                return [
                    {
                        title: "Total Users",
                        value: totalUsers.toLocaleString(),
                        change: `+${newThisWeek} new this week`,
                        trend: "up",
                        subtext: `${d.users?.residential || 0} residential`
                    },
                    {
                        title: "Active Pickups",
                        value: pickupsTotal.toLocaleString(),
                        change: `${todayScheduled} scheduled today`,
                        trend: "up",
                        subtext: `${d.pickups?.todayCompleted || 0} completed today`
                    },
                    {
                        title: "Revenue (Month)",
                        value: `RWF ${totalRevenue.toLocaleString()}`,
                        change: `RWF ${thisMonthRevenue.toLocaleString()} this month`,
                        trend: "up",
                        subtext: "MoMo & Airtel Money"
                    },
                    {
                        title: "Waste Collected",
                        value: `${ecoPointsTotal.toLocaleString()} pts`,
                        change: "Issued eco points",
                        trend: "up",
                        subtext: `${d.collectors?.total || 0} collectors active`
                    }
                ];
            }
        } catch (e) {
            console.warn("Backend /admin/dashboard endpoint unavailable, using mock stats:", e);
        }
        return MOCK_STATS;
    },

    async getPickupTrends(): Promise<PickupTrendPoint[]> {
        try {
            const response = await apiGet<{ success: boolean; data: any[] }>("/admin/pickups?limit=100");
            if (response.success && response.data && response.data.length > 0) {
                const daysMap: Record<string, { pickups: number; waste: number }> = {
                    Mon: { pickups: 0, waste: 0 },
                    Tue: { pickups: 0, waste: 0 },
                    Wed: { pickups: 0, waste: 0 },
                    Thu: { pickups: 0, waste: 0 },
                    Fri: { pickups: 0, waste: 0 },
                    Sat: { pickups: 0, waste: 0 },
                    Sun: { pickups: 0, waste: 0 }
                };

                const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

                response.data.forEach(p => {
                    const date = p.scheduledDate || p.createdAt;
                    if (date) {
                        const dayName = dayNames[new Date(date).getDay()];
                        if (daysMap[dayName]) {
                            daysMap[dayName].pickups += 1;
                            daysMap[dayName].waste += (p.weightKg || 12);
                        }
                    }
                });

                const result = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({
                    name: d,
                    pickups: daysMap[d].pickups,
                    waste: daysMap[d].waste
                }));

                // If any day has pickups, return dynamic result
                if (result.some(r => r.pickups > 0)) {
                    return result;
                }
            }
        } catch (e) {
            console.warn("Backend /admin/pickups unavailable for trends, using mock:", e);
        }
        return MOCK_TRENDS;
    },

    async getWasteDistribution(): Promise<Record<string, number>> {
        try {
            const response = await apiGet<{ success: boolean; data: any }>("/admin/dashboard");
            if (response.success && response.data?.pickups?.byWasteType) {
                const byType = response.data.pickups.byWasteType;
                const mapped: Record<string, number> = {};
                for (const key in byType) {
                    const formattedKey = key.charAt(0) + key.slice(1).toLowerCase();
                    mapped[formattedKey] = byType[key];
                }
                if (Object.keys(mapped).length > 0) return mapped;
            }
        } catch (e) {
            // Fall back
        }
        return MOCK_WASTE_STATS;
    },

    async getActiveCollectors(): Promise<CollectorSummary[]> {
        try {
            const response = await apiGet<{ success: boolean; data: any[] }>("/admin/collectors");
            if (response.success && response.data && response.data.length > 0) {
                return response.data.slice(0, 5).map((c, i) => ({
                    id: `COL-00${i + 1}`,
                    name: c.name || `${c.user?.firstName || ''} ${c.user?.lastName || ''}`.trim() || 'Collector',
                    avatar: (c.name || 'Collector').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
                    status: c.isAvailable ? 'Available' : 'On Delivery',
                    pickupsToday: c.totalPickups || Math.floor(Math.random() * 15) + 3
                }));
            }
        } catch (e) {
            // Fall back
        }
        return MOCK_COLLECTORS;
    },

    async getRecentActivity(): Promise<Activity[]> {
        try {
            // 1. Try audit logs endpoint
            const response = await apiGet<{ success: boolean; data: any[] }>("/admin/audit-logs?limit=5");
            if (response.success && response.data && response.data.length > 0) {
                return response.data.map((log, index) => {
                    let type: Activity['type'] = 'SYSTEM_ALERT';
                    if (log.action?.includes('USER') || log.module === 'Users') type = 'USER_REGISTRATION';
                    else if (log.action?.includes('PICKUP') || log.module === 'Pickups') type = 'PICKUP_COMPLETED';
                    else if (log.action?.includes('PAYMENT') || log.module === 'Payments') type = 'PAYMENT_RECEIVED';

                    return {
                        id: log.id || `audit-${index}`,
                        type,
                        user: log.actorName || log.actorId || "System",
                        time: log.createdAt ? new Date(log.createdAt) : new Date(),
                        detail: log.details || log.action || log.module
                    };
                });
            }

            // 2. Dynamic fallback: fetch real live users and pickups if audit logs are empty
            const [usersRes, pickupsRes] = await Promise.allSettled([
                apiGet<{ success: boolean; data: any[] }>("/admin/users?limit=5"),
                apiGet<{ success: boolean; data: any[] }>("/admin/pickups?limit=5")
            ]);

            const dynamicActivities: Activity[] = [];

            if (usersRes.status === 'fulfilled' && usersRes.value?.data?.length > 0) {
                usersRes.value.data.slice(0, 3).forEach((u: any) => {
                    dynamicActivities.push({
                        id: `usr-${u.id}`,
                        type: 'USER_REGISTRATION',
                        user: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.phone || 'New Resident',
                        time: u.createdAt ? new Date(u.createdAt) : new Date(),
                        detail: u.userType || 'Residential'
                    });
                });
            }

            if (pickupsRes.status === 'fulfilled' && pickupsRes.value?.data?.length > 0) {
                pickupsRes.value.data.slice(0, 3).forEach((p: any) => {
                    dynamicActivities.push({
                        id: `pkp-${p.id}`,
                        type: 'PICKUP_COMPLETED',
                        user: p.user ? `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() || p.user.phone : 'Resident',
                        time: p.createdAt ? new Date(p.createdAt) : new Date(),
                        detail: `${p.reference || 'Pickup'} • ${p.wasteType || 'Organic'}`
                    });
                });
            }

            if (dynamicActivities.length > 0) {
                return dynamicActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
            }
        } catch (e) {
            console.warn("Real activity endpoints unavailable, using dynamic fallback:", e);
        }
        return MOCK_ACTIVITIES;
    }
};

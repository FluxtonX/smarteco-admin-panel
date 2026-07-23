"use client";

import { apiGet } from "@/lib/api-client";

export interface RewardStatRecord {
    label: string;
    value: string;
    trend: string;
    trendType: 'up' | 'down';
    iconType: 'medal' | 'trending' | 'users' | 'gift';
    subtext?: string;
}

export interface CategoryPointData {
    category: string;
    points: number;
    color: string;
}

export interface TierDistributionData {
    name: string;
    value: number;
    color: string;
    points: string;
}

export interface TrendData {
    date: string;
    issued: number;
    redeemed: number;
}

export interface ReferralPerformanceData {
    month: string;
    count: number;
}

interface EcoPointsBalance {
    totalPoints: number;
    tier: string;
    multiplier: number;
    nextTier: string;
    pointsToNextTier: number;
    progressPercent: number;
    totalPickups: number;
    totalWeightKg: number;
}

interface EcoPointsTransaction {
    id: string;
    points: number;
    action: string;
    description: string;
    createdAt: string;
}

interface EcoPointsLeaderboardEntry {
    rank: number;
    userId: string;
    name: string;
    points: number;
    tier: string;
    avatarUrl: string | null;
}

export const rewardService = {
    getStats: async (): Promise<RewardStatRecord[]> => {
        let totalPoints = 0;
        let multiplier = 1.0;
        let tier = 'ECO_STARTER';
        let totalPickups = 0;
        let totalWeightKg = 0;

        try {
            const res = await apiGet<{ success: boolean; data: EcoPointsBalance }>('/eco-points/balance');
            if (res.success && res.data) {
                totalPoints = res.data.totalPoints || 0;
                multiplier = res.data.multiplier || 1.0;
                tier = res.data.tier || 'ECO_STARTER';
                totalPickups = res.data.totalPickups || 0;
                totalWeightKg = res.data.totalWeightKg || 0;
            }
        } catch (e) {}

        try {
            if (totalPoints === 0) {
                const dashRes = await apiGet<{ success: boolean; data: any }>('/admin/dashboard');
                if (dashRes.success && dashRes.data) {
                    totalPoints = dashRes.data.ecoPoints?.totalDistributed || 0;
                    totalPickups = dashRes.data.pickups?.totalCompleted || 0;
                }
            }
        } catch (e) {}

        return [
            {
                label: "Total Points Issued",
                value: `${totalPoints.toLocaleString()}`,
                trend: "Live",
                trendType: "up",
                iconType: "medal",
                subtext: "lifetime distributed"
            },
            {
                label: "Bonus Points (Tier)",
                value: `${(totalPoints * (multiplier - 1)).toFixed(0)}`,
                trend: `${multiplier}x`,
                trendType: "up",
                iconType: "trending",
                subtext: `${tier.replace('_', ' ')} multiplier`
            },
            {
                label: "Total Pickups",
                value: `${totalPickups.toLocaleString()}`,
                trend: "Live",
                trendType: "up",
                iconType: "users",
                subtext: "completed pickups"
            },
            {
                label: "Waste Processed",
                value: `${totalWeightKg.toLocaleString()} kg`,
                trend: "Live",
                trendType: "up",
                iconType: "gift",
                subtext: "total collected"
            },
        ];
    },

    getCategoryPoints: async (): Promise<CategoryPointData[]> => {
        const categories: Record<string, { points: number; color: string }> = {
            'Organic': { points: 0, color: "#22C55E" },
            'Recyclable': { points: 0, color: "#3B82F6" },
            'E-Waste': { points: 0, color: "#8B5CF6" },
            'Glass': { points: 0, color: "#10B981" },
            'Hazardous': { points: 0, color: "#EF4444" },
        };

        try {
            const res = await apiGet<{ success: boolean; data: EcoPointsTransaction[] }>('/eco-points/history?limit=100');
            if (res.success && Array.isArray(res.data)) {
                res.data.forEach(tx => {
                    if (tx.action?.includes('ORGANIC')) categories['Organic'].points += tx.points;
                    else if (tx.action?.includes('RECYCLABLE')) categories['Recyclable'].points += tx.points;
                    else if (tx.action?.includes('EWASTE')) categories['E-Waste'].points += tx.points;
                    else if (tx.action?.includes('GLASS')) categories['Glass'].points += tx.points;
                    else if (tx.action?.includes('HAZARDOUS')) categories['Hazardous'].points += tx.points;
                    else categories['Organic'].points += (tx.points || 0);
                });
            }
        } catch (e) {}

        return Object.keys(categories).map(k => ({
            category: k,
            points: categories[k].points,
            color: categories[k].color
        }));
    },

    getTierDistribution: async (): Promise<TierDistributionData[]> => {
        let starter = 0, warrior = 0, champion = 0;
        let pStarter = 0, pWarrior = 0, pChampion = 0;

        try {
            const res = await apiGet<{ success: boolean; data: EcoPointsLeaderboardEntry[] }>('/eco-points/leaderboard');
            if (res.success && Array.isArray(res.data)) {
                res.data.forEach(user => {
                    if (user.tier === 'ECO_STARTER') { starter++; pStarter += user.points; }
                    else if (user.tier === 'ECO_WARRIOR') { warrior++; pWarrior += user.points; }
                    else if (user.tier === 'ECO_CHAMPION') { champion++; pChampion += user.points; }
                });
            }
        } catch (e) {}

        return [
            { name: "Eco Starter", value: starter, color: "#64748B", points: `${pStarter.toLocaleString()} pts` },
            { name: "Eco Warrior", value: warrior, color: "#22C55E", points: `${pWarrior.toLocaleString()} pts` },
            { name: "Eco Champion", value: champion, color: "#064E3B", points: `${pChampion.toLocaleString()} pts` },
        ];
    },

    getTrendData: async (): Promise<TrendData[]> => {
        const months = ["Oct", "Nov", "Dec", "Jan", "Feb"];
        return months.map(m => ({ date: m, issued: 0, redeemed: 0 }));
    },

    getReferralPerformance: async (): Promise<ReferralPerformanceData[]> => {
        const months = ["Sep", "Oct", "Nov", "Dec", "Jan"];
        return months.map(m => ({ month: m, count: 0 }));
    }
};

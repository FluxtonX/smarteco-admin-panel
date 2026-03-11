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

const mockStats: RewardStatRecord[] = [
    { label: "Total Points Issued", value: "127,340", trend: "+18%", trendType: "up", iconType: "medal", subtext: "from last month" },
    { label: "Bonus Points (Tier)", value: "38,200", trend: "Impact", trendType: "up", iconType: "trending", subtext: "Tier multiplier impact" },
    { label: "Referral Points", value: "6,300", trend: "126", trendType: "up", iconType: "users", subtext: "successful referrals" },
    { label: "Points Redeemed", value: "15,670", trend: "12%", trendType: "up", iconType: "gift", subtext: "redemption rate" },
];

const mockCategoryData: CategoryPointData[] = [
    { category: "Organic", points: 45000, color: "#22C55E" },
    { category: "Recyclable", points: 38000, color: "#3B82F6" },
    { category: "E-Waste", points: 15000, color: "#8B5CF6" },
    { category: "Glass", points: 12000, color: "#10B981" },
    { category: "Hazardous", points: 8000, color: "#EF4444" },
];

const mockTierData: TierDistributionData[] = [
    { name: "Eco Starter", value: 2340, color: "#64748B", points: "420,000 pts" },
    { name: "Eco Warrior", value: 1256, color: "#22C55E", points: "1,890,000 pts" },
    { name: "Eco Champion", value: 445, color: "#064E3B", points: "2,230,000 pts" },
];

const mockTrendData: TrendData[] = [
    { date: "Oct", issued: 90000, redeemed: 12000 },
    { date: "Nov", issued: 130000, redeemed: 25000 },
    { date: "Dec", issued: 145000, redeemed: 32000 },
    { date: "Jan", issued: 155000, redeemed: 45000 },
    { date: "Feb", issued: 180000, redeemed: 58000 },
];

const mockReferralData: ReferralPerformanceData[] = [
    { month: "Sep", count: 850 },
    { month: "Oct", count: 1200 },
    { month: "Nov", count: 1800 },
    { month: "Dec", count: 1400 },
    { month: "Jan", count: 2100 },
];

export const rewardService = {
    getStats: async (): Promise<RewardStatRecord[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockStats), 300));
    },
    getCategoryPoints: async (): Promise<CategoryPointData[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockCategoryData), 400));
    },
    getTierDistribution: async (): Promise<TierDistributionData[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockTierData), 400));
    },
    getTrendData: async (): Promise<TrendData[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockTrendData), 500));
    },
    getReferralPerformance: async (): Promise<ReferralPerformanceData[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockReferralData), 400));
    }
};

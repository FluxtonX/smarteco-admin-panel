"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { LiveStatus } from "@/components/ui/live-status";
import { RewardStats } from "@/components/rewards/reward-stats";
import {
    WasteCategoryChart,
    TierDistributionChart,
    PointsTrendChart,
    ReferralPerformanceChart
} from "@/components/rewards/reward-charts";
import {
    rewardService,
    RewardStatRecord,
    CategoryPointData,
    TierDistributionData,
    TrendData,
    ReferralPerformanceData
} from "@/services/reward.service";

export default function RewardsPage() {
    const [stats, setStats] = useState<RewardStatRecord[]>([]);
    const [categories, setCategories] = useState<CategoryPointData[]>([]);
    const [tiers, setTiers] = useState<TierDistributionData[]>([]);
    const [trends, setTrends] = useState<TrendData[]>([]);
    const [referrals, setReferrals] = useState<ReferralPerformanceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            const [s, c, t, tr, r] = await Promise.all([
                rewardService.getStats(),
                rewardService.getCategoryPoints(),
                rewardService.getTierDistribution(),
                rewardService.getTrendData(),
                rewardService.getReferralPerformance()
            ]);
            setStats(s);
            setCategories(c);
            setTiers(t);
            setTrends(tr);
            setReferrals(r);
            setIsLoading(false);
        }
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen bg-[#F8FAFB] overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin" />
                    <span className="mt-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest">Loading Analytics...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8FAFB] overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
                    {/* Header */}
                    <div className="flex flex-row items-start justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-[28px] font-bold text-[#1A1A1A] tracking-tight">
                                EcoPoints & Rewards
                            </h1>
                            <p className="text-[12px] md:text-[13px] font-medium text-gray-500">
                                Rewards program monitoring
                            </p>
                        </div>
                        <div className="flex-shrink-0 pt-1">
                            <LiveStatus />
                        </div>
                    </div>

                    {/* Stats Row */}
                    <RewardStats stats={stats} />

                    {/* Chart Grids */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8">
                            <WasteCategoryChart data={categories} />
                        </div>
                        <div className="lg:col-span-4">
                            <TierDistributionChart data={tiers} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PointsTrendChart data={trends} />
                        <ReferralPerformanceChart data={referrals} />
                    </div>
                </main>
            </div>
        </div>
    );
}

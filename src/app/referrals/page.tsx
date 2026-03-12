"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { LiveStatus } from "@/components/ui/live-status";
import { ReferralStats } from "@/components/referrals/referral-stats";
import { ReferralPerformanceChart } from "@/components/referrals/referral-charts";
import { ReferralTable } from "@/components/referrals/referral-table";
import {
    referralService,
    ReferralStat,
    ReferralPerformanceData,
    ReferralRecord
} from "@/services/referral.service";

export default function ReferralsPage() {
    const [stats, setStats] = useState<ReferralStat[]>([]);
    const [performance, setPerformance] = useState<ReferralPerformanceData[]>([]);
    const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            const [s, p, r] = await Promise.all([
                referralService.getStats(),
                referralService.getPerformance(),
                referralService.getReferrals()
            ]);
            setStats(s);
            setPerformance(p);
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
                    <span className="mt-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest">Loading Referrals...</span>
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
                    <div className="flex flex-row items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-[28px] font-bold text-[#1A1A1A] tracking-tight">
                                Referral System
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
                    <ReferralStats stats={stats} />

                    {/* Charts Section */}
                    <ReferralPerformanceChart data={performance} />

                    {/* Referrals Table Section */}
                    <div className="overflow-x-auto">
                        <ReferralTable referrals={referrals} />
                    </div>
                </main>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { PickupChart } from "@/components/dashboard/pickup-chart";
import { WasteChart } from "@/components/dashboard/waste-chart";
import { ActiveCollectors } from "@/components/dashboard/active-collectors";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AlertsNotifications } from "@/components/dashboard/alerts-notifications";
import { Users, Truck, DollarSign, TrendingUp, Zap } from "lucide-react";
import { LiveStatus } from "@/components/ui/live-status";
import { dashboardService, Stat } from "@/services/dashboard.service";

export default function DashboardPage() {
    const [currentTime, setCurrentTime] = useState<string>("");
    const [stats, setStats] = useState<Stat[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString());
        
        async function loadStats() {
            try {
                const [data, activity] = await Promise.all([
                    dashboardService.getStats(),
                    dashboardService.getRecentActivity()
                ]);
                setStats(data);
                setRecentActivity(activity);
            } catch (error) {
                console.error("Failed to load stats:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadStats();
    }, []);

    const getIcon = (title: string) => {
        switch (title) {
            case "Total Users": return Users;
            case "Active Pickups": return Truck;
            case "Revenue (Month)": return DollarSign;
            case "Waste Collected": return TrendingUp;
            default: return Zap;
        }
    };

    const getIconColor = (title: string) => {
        switch (title) {
            case "Total Users": return "bg-blue-50 text-blue-600";
            case "Active Pickups": return "bg-indigo-50 text-indigo-600";
            case "Revenue (Month)": return "bg-orange-50 text-orange-600";
            case "Waste Collected": return "bg-green-50 text-green-600";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight truncate">Dashboard</h1>
                    <p className="text-[10px] md:text-sm text-gray-500 font-medium mt-1 truncate">
                        Real-time analytics <span className="hidden xs:inline">•</span>
                        <span className="text-gray-400 font-normal ml-1 hidden xs:inline">
                            {currentTime ? `Last updated: ${currentTime}` : "Loading timestamp..."}
                        </span>
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <LiveStatus />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-[98px] bg-white border border-gray-100 rounded-[4px] animate-pulse" />
                    ))
                ) : (
                    stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            change={stat.change}
                            subtext={stat.subtext}
                            icon={getIcon(stat.title)}
                            iconColor={getIconColor(stat.title)}
                            trend={stat.trend}
                        />
                    ))
                )}
            </div>

            {/* Charts Grid - Equalized columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PickupChart data={undefined} isLoading={isLoading} />
                <WasteChart stats={undefined} isLoading={isLoading} />
            </div>

            {/* Details Grid - Equalized columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActiveCollectors stats={null} isLoading={isLoading} />
                <RecentActivity activities={recentActivity} isLoading={isLoading} />
            </div>

            {/* Alerts Section */}
            <div className="pt-2">
                <AlertsNotifications />
            </div>
        </div>
    );
}

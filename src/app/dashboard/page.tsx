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

export default function DashboardPage() {
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString());
    }, []);

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
                <StatCard
                    title="Total Users"
                    value="4,041"
                    change="+12% from last week"
                    icon={Users}
                    iconColor="bg-blue-50 text-blue-600"
                    trend="up"
                />
                <StatCard
                    title="Active Pickups Today"
                    value="234"
                    change="+8% from yesterday"
                    icon={Truck}
                    iconColor="bg-indigo-50 text-indigo-600"
                    trend="up"
                />
                <StatCard
                    title="Revenue (This Month)"
                    value="12.4M RWF"
                    change="+18% growth"
                    icon={DollarSign}
                    iconColor="bg-orange-50 text-orange-600"
                    trend="up"
                />
                <StatCard
                    title="Total Waste Collected"
                    value="8,520 kg"
                    subtext="This week"
                    icon={TrendingUp}
                    iconColor="bg-green-50 text-green-600"
                    trend="up"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PickupChart />
                <WasteChart />
            </div>

            {/* Details Grid - Equalized columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActiveCollectors />
                <RecentActivity />
            </div>

            {/* Alerts Section */}
            <div className="pt-2">
                <AlertsNotifications />
            </div>
        </div>
    );
}

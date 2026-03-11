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
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight leading-tight">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Real-time analytics and system monitoring •
                        <span className="text-gray-400 font-normal ml-1">
                            {currentTime ? `Last updated: ${currentTime}` : "Loading timestamp..."}
                        </span>
                    </p>
                </div>
                <LiveStatus />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

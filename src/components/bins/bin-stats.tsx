"use client";

import { Card } from "@/components/ui/card";
import { Users, CheckCircle, RefreshCw, Calendar, Layout, Bell, Activity, ClipboardList, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BinStats as BinStatsData } from "@/services/bin.service";
import { Button } from "@/components/ui/button";

interface BinStatProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    hoverColor: string;
}

function StatCard({ title, value, icon: Icon, color, hoverColor }: BinStatProps) {
    return (
        <Card className="flex-1 min-w-[200px] h-[98px] rounded-[4px] border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative cursor-default">
            <div className="flex items-center justify-between h-full relative z-10">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">{title}</p>
                    <h3 className="text-2xl font-bold text-[#2D3436] leading-none">{value}</h3>
                </div>
                <div className={cn("w-12 h-12 rounded-[4px] flex items-center justify-center transition-all duration-300 shadow-sm", color, hoverColor)}>
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </div>
            </div>
        </Card>
    );
}

export function BinStats({ stats }: { stats: BinStatsData | null }) {
    if (!stats) return null;

    const items = [
        {
            title: "Total users",
            value: stats.users,
            icon: Users,
            color: "bg-green-50 text-primary-green",
            hoverColor: "group-hover:bg-primary-green"
        },
        {
            title: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            color: "bg-green-50 text-primary-green",
            hoverColor: "group-hover:bg-primary-green"
        },
        {
            title: "In Progress",
            value: stats.inProgress,
            icon: RefreshCw,
            color: "bg-blue-50 text-blue-600",
            hoverColor: "group-hover:bg-blue-600"
        },
        {
            title: "Scheduled",
            value: stats.scheduled,
            icon: Calendar,
            color: "bg-yellow-50 text-yellow-600",
            hoverColor: "group-hover:bg-yellow-600"
        }
    ];

    return (
        <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item, index) => (
                    <StatCard key={index} {...item} />
                ))}
            </div>
        </div>
    );
}


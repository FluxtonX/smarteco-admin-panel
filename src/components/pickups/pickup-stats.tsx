"use client";

import { Card } from "@/components/ui/card";
import { Package, CheckCircle, Calendar, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PickupStatProps {
    title: string;
    value: number;
    icon: LucideIcon;
    color: string;
    hoverColor: string;
}

function StatCard({ title, value, icon: Icon, color, hoverColor }: PickupStatProps) {
    return (
        <Card className="flex-1 min-w-[140px] h-[98px] rounded-[4px] border border-gray-100 bg-white p-3 md:p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden relative cursor-default">
            <div className="flex justify-between items-start relative z-10">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</p>
                <div className={cn("p-1.5 rounded-[4px] shadow-sm transition-all group-hover:text-white", color, hoverColor)}>
                    <Icon className="w-3.5 h-3.5" />
                </div>
            </div>
            <div className="flex items-end justify-between relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 leading-none">{value}</h3>
            </div>
        </Card>
    );
}

export function PickupStats({ stats }: { stats: any }) {
    if (!stats) return null;

    const items = [
        {
            title: "Total Pickups",
            value: stats.total,
            icon: Package,
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
            icon: Package,
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {items.map((item, index) => (
                <StatCard key={index} {...item} />
            ))}
        </div>
    );
}

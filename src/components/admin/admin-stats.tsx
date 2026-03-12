"use client";

import { AdminStats } from "@/services/admin.service";
import { Users, Shield, ShieldAlert, UserCog } from "lucide-react";

interface AdminStatsProps {
    stats: AdminStats;
}

const STAT_CARDS = [
    {
        key: "totalAdmins" as keyof AdminStats,
        label: "Total Admins",
        icon: Users,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-500",
    },
    {
        key: "activeAdmins" as keyof AdminStats,
        label: "Active Admins",
        icon: Shield,
        iconBg: "bg-green-50",
        iconColor: "text-primary-green",
    },
    {
        key: "superAdmins" as keyof AdminStats,
        label: "Super Admins",
        icon: ShieldAlert,
        iconBg: "bg-red-50",
        iconColor: "text-red-500",
    },
    {
        key: "operationsStaff" as keyof AdminStats,
        label: "Operations Staff",
        icon: UserCog,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-500",
    },
];

export function AdminStatsGrid({ stats }: AdminStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {STAT_CARDS.map(({ key, label, icon: Icon, iconBg, iconColor }) => (
                <div
                    key={key}
                    className="bg-white border border-gray-200 rounded-[4px] p-3 md:p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="space-y-1">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
                        <p className="text-[28px] font-bold text-gray-800 leading-none">{stats[key]}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-[4px] ${iconBg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                </div>
            ))}
        </div>
    );
}

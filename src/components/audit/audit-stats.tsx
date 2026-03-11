"use client";

import { AuditStats } from "@/services/audit.service";
import { Activity, CheckCircle, Clock, Gift } from "lucide-react";

interface AuditStatsProps {
    stats: AuditStats;
}

export function AuditStatsGrid({ stats }: AuditStatsProps) {
    const cards = [
        {
            label: "Total Actions Today",
            value: stats.totalActionsToday,
            icon: Activity,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
        },
        {
            label: "Successful Actions",
            value: stats.successfulActions,
            icon: CheckCircle,
            iconBg: "bg-green-50",
            iconColor: "text-primary-green",
        },
        {
            label: "Pending Approval",
            value: stats.pendingApproval,
            icon: Clock,
            iconBg: "bg-orange-50",
            iconColor: "text-orange-500",
        },
        {
            label: "Total Bonus Issued",
            value: `${stats.totalBonusIssued.toLocaleString()} pts`,
            icon: Gift,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-500",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
                <div
                    key={label}
                    className="bg-white border border-gray-200 rounded-[4px] p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="space-y-1">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest leading-none">{label}</p>
                        <p className="text-[26px] font-bold text-gray-800 leading-tight">{value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-[4px] ${iconBg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                </div>
            ))}
        </div>
    );
}

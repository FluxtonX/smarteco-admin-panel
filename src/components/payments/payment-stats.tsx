"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, CheckCircle, AlertCircle, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentStat } from "@/services/payment.service";

interface PaymentStatsProps {
    stats: PaymentStat[];
}

export function PaymentStats({ stats }: PaymentStatsProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'revenue': return <DollarSign className="w-5 h-5 text-primary-green" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-primary-green" />;
            case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'pending': return <TrendingUp className="w-5 h-5 text-amber-500" />;
            default: return null;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'revenue': return "bg-[#DCFCE7]";
            case 'success': return "bg-[#DCFCE7]";
            case 'failed': return "bg-[#FEE2E2]";
            case 'pending': return "bg-[#FEF3C7]";
            default: return "bg-gray-50";
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
                <Card key={idx} className="p-4 border-gray-100 shadow-sm rounded-[8px] flex flex-row justify-between items-start group hover:shadow-md transition-all">
                    <div className="flex-1 space-y-2">
                        <div className="text-[11px] font-semibold text-gray-400 tracking-tight">{stat.label}</div>
                        <div className="space-y-0.5">
                            <div className="text-[22px] font-bold text-[#1A1A1A] tracking-tight leading-none">
                                {stat.value}
                            </div>
                            <div className="flex items-center space-x-1.5">
                                {stat.trend && (
                                    <span className={cn(
                                        "text-[10px] font-bold",
                                        stat.trendType === 'up' ? "text-primary-green" : "text-red-500"
                                    )}>
                                        {stat.trend}
                                    </span>
                                )}
                                <span className="text-[10px] font-medium text-gray-400">{stat.subtext}</span>
                            </div>
                        </div>
                    </div>
                    <div className={cn("p-2 rounded-[6px] transition-transform group-hover:scale-110", getIconBg(stat.iconType))}>
                        {getIcon(stat.iconType)}
                    </div>
                </Card>
            ))}
        </div>
    );
}

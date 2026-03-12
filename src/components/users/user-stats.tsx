"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { LucideIcon } from "lucide-react";

interface UserSummaryCardProps {
    title: string;
    count: number;
    subtext: string;
    icon: LucideIcon;
}

export function UserSummaryCard({ title, count, subtext, icon: Icon }: UserSummaryCardProps) {
    return (
        <Card className="flex-1 min-w-[140px] h-[98px] rounded-[4px] border border-gray-100 bg-white p-3 md:p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="flex justify-between items-start relative z-10">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</p>
                <div className="p-1.5 rounded-[4px] bg-green-50 text-primary-green group-hover:bg-primary-green group-hover:text-white transition-all shadow-sm">
                    <Icon className="w-3.5 h-3.5" />
                </div>
            </div>
            <div className="flex items-end justify-between relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 leading-none">{count}</h3>
                <p className="text-[10px] text-gray-400 font-bold">{subtext}</p>
            </div>
        </Card>
    );
}

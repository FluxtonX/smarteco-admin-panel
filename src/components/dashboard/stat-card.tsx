"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    subtext?: string;
    icon: LucideIcon;
    iconColor?: string;
    trend?: "up" | "down" | "neutral";
}

export function StatCard({
    title,
    value,
    change,
    subtext,
    icon: Icon,
    iconColor = "bg-blue-100 text-blue-600",
    trend = "up"
}: StatCardProps) {
    return (
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all group h-[98px] w-full rounded-[4px] border-width-[1px] opacity-100">
            <CardContent className="p-[10px] h-full flex flex-col justify-center">
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col w-full py-1">
                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider leading-none">{title}</p>
                        <h3 className="text-[26px] font-bold text-gray-900 leading-none mt-1.5">{value}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                            {change && (
                                <span className={cn(
                                    "text-[9px] font-bold px-1 py-0.5 rounded",
                                    trend === "up" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                                )}>
                                    {change}
                                </span>
                            )}
                            {subtext && (
                                <span className="text-[9px] text-gray-400 font-medium">
                                    {subtext}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110 duration-300", iconColor)}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

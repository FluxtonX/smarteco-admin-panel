"use client";

import { Card } from "@/components/ui/card";
import { MapPin, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectorStatProps {
    title: string;
    value: string;
    type: 'location' | 'route' | 'rating' | 'pickups';
}

function StatCard({ title, value, type }: CollectorStatProps) {
    const iconMap = {
        location: { icon: MapPin, color: "bg-green-50 text-primary-green" },
        route: { icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
        rating: { icon: Star, color: "bg-yellow-50 text-yellow-600" },
        pickups: { icon: TrendingUp, color: "bg-green-50 text-primary-green" },
    };

    const { icon: Icon, color } = iconMap[type];

    return (
        <Card className="flex-1 min-w-[200px] h-[98px] rounded-[4px] border border-gray-100 bg-white p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden relative cursor-default">
            <div className="flex justify-between items-start relative z-10">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</p>
                <div className={cn("p-1.5 rounded-[4px] shadow-sm transition-all group-hover:bg-opacity-100 group-hover:text-white", color,
                    type === 'location' || type === 'pickups' ? "group-hover:bg-primary-green" :
                        type === 'route' ? "group-hover:bg-blue-600" : "group-hover:bg-yellow-600"
                )}>
                    <Icon className="w-3.5 h-3.5" />
                </div>
            </div>
            <div className="flex items-end justify-between relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 leading-none">{value}</h3>
            </div>
        </Card>
    );
}

export function CollectorStats({ stats }: { stats: any[] }) {
    return (
        <div className="flex gap-4 w-full">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
}

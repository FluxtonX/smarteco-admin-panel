"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, UserPlus, PackageCheck, AlertCircle, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
    {
        icon: UserPlus,
        user: "Jean Pierre",
        action: "New user registered",
        time: "2 mins ago",
        color: "bg-green-500",
    },
    {
        icon: PackageCheck,
        user: "Marie Uwase",
        action: "Pickup completed • Organic waste",
        time: "5 mins ago",
        color: "bg-blue-500",
    },
    {
        icon: AlertCircle,
        user: "Bin #KGL-234",
        action: "Smart bin is full • Needs pickup",
        time: "8 mins ago",
        color: "bg-orange-500",
    },
    {
        icon: CreditCard,
        user: "Business Account",
        action: "Payment received • 5,000 RWF",
        time: "12 mins ago",
        color: "bg-purple-500",
    },
    {
        icon: Activity,
        user: "Aline Mutoni",
        action: "Collector status changed to 'Online'",
        time: "15 mins ago",
        color: "bg-gray-500",
    },
];

export function RecentActivity() {
    return (
        <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-4 pt-6 px-8 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-gray-500" />
                    <CardTitle className="text-lg font-bold text-gray-900 leading-tight">Recent Activity</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-8 pb-6">
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[1px] before:bg-gray-100">
                    {activities.map((activity, idx) => (
                        <div key={idx} className="relative flex items-start pl-8 space-x-3 group">
                            {/* Timeline Dot */}
                            <div className={cn(
                                "absolute left-0 top-1.5 w-[22px] h-[22px] rounded-[4px] border-4 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110",
                                activity.color
                            )}>
                                <activity.icon className="w-2.5 h-2.5 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{activity.user}</p>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0">{activity.time}</span>
                                </div>
                                <p className="text-[12px] text-gray-500 font-medium leading-tight">{activity.action}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

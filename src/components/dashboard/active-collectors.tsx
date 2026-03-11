"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const collectors = [
    {
        name: "David Mugisha",
        id: "TC-001 • Kigali North",
        status: "En Route",
        pickups: 8,
        avatar: "DM",
        statusColor: "bg-orange-100 text-orange-700",
    },
    {
        name: "Grace Uwimana",
        id: "TC-002 • Kigali East",
        status: "Arrived",
        pickups: 12,
        avatar: "GU",
        statusColor: "bg-blue-100 text-blue-700",
    },
    {
        name: "Patrick Habimana",
        id: "TC-005 • Kigali South",
        status: "Completed",
        pickups: 10,
        avatar: "PH",
        statusColor: "bg-green-100 text-green-700",
    },
];

export function ActiveCollectors() {
    return (
        <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-4 pt-6 px-8 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-gray-500" />
                    <CardTitle className="text-lg font-bold text-gray-900 leading-tight">Active Collectors</CardTitle>
                </div>
                <button className="text-xs font-bold text-primary-green hover:underline">View All</button>
            </CardHeader>
            <CardContent className="px-8 pb-6 space-y-4">
                {collectors.map((collector, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:shadow-sm transition-all group">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-gray-100 rounded-md">
                                <AvatarFallback className="bg-primary-green text-white font-bold text-xs rounded-md">{collector.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-none mb-1 group-hover:text-primary-green transition-colors">{collector.name}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{collector.id}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <Badge className={cn("px-2 py-0.5 text-[10px] font-bold uppercase border-none mb-1", collector.statusColor)}>
                                {collector.status}
                            </Badge>
                            <p className="text-[10px] text-gray-400 font-bold">{collector.pickups} pickups today</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}


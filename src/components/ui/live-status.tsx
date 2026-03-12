"use client";

import { Badge } from "@/components/ui/badge";

export function LiveStatus() {
    return (
        <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-4 py-1.5 flex items-center space-x-2 font-bold text-[10px] md:text-[11px] uppercase tracking-wider rounded-[4px] cursor-default shadow-sm ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
            <span>Live Data</span>
        </Badge>
    );
}

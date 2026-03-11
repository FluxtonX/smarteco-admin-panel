"use client";

import { Badge } from "@/components/ui/badge";

export function LiveStatus() {
    return (
        <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-3 py-1 flex items-center space-x-1.5 font-bold text-[11px] uppercase tracking-wide rounded-[4px] cursor-default shadow-sm">
            <div className="w-1.5 h-1.5 rounded-[2px] bg-green-600 animate-pulse" />
            <span>Live Data</span>
        </Badge>
    );
}

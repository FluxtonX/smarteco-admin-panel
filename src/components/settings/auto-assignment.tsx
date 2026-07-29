"use client";

import { AutoAssignmentSettings } from "@/services/settings.service";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoAssignmentProps {
    settings: AutoAssignmentSettings;
    onChange: (s: AutoAssignmentSettings) => void;
}

export function AutoAssignmentCard({ settings, onChange }: AutoAssignmentProps) {
    const methods = [
        "Nearest Collector",
        "Zone-Based",
        "Priority Queue"
    ] as const;

    const currentMethod = settings?.method || "Nearest Collector";
    const isEnabled = settings?.enabled !== false;

    return (
        <Card className="p-6 md:p-8 border-gray-200 bg-white shadow-sm rounded-[8px] space-y-6 font-sans">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-base font-extrabold text-[#1A1A1A] tracking-tight">Auto-Assignment Dispatch Logic</h3>
                    <p className="text-[12px] text-gray-500 font-medium mt-0.5">
                        Configure automatic dispatch routing for pickups and smart bin alerts.
                    </p>
                </div>
            </div>

            {/* Assignment Method */}
            <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-700 block">Assignment Method</label>
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full h-10 border border-gray-200 rounded-[6px] px-4 flex items-center justify-between text-xs font-bold text-[#0F172A] hover:bg-gray-50 transition-all outline-none bg-white cursor-pointer select-none">
                        <span>{currentMethod}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[360px] p-1">
                        {methods.map((m) => (
                            <DropdownMenuItem
                                key={m}
                                onClick={() => onChange({ ...settings, method: m as any })}
                                className={cn(
                                    "px-3 py-2 text-xs font-bold rounded-[4px] cursor-pointer",
                                    currentMethod === m ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                                )}
                            >
                                {m}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Enable Auto-Assignment Toggle */}
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="space-y-0.5">
                    <p className="text-[13px] font-extrabold text-[#1A1A1A]">Enable Automatic Dispatch</p>
                    <p className="text-[12px] text-gray-500 font-medium">Automatically assign full bin pickups to nearby available collectors</p>
                </div>
                {/* Custom Toggle */}
                <button
                    type="button"
                    onClick={() => onChange({ ...settings, enabled: !isEnabled })}
                    className={cn(
                        "relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer",
                        isEnabled ? "bg-emerald-600" : "bg-gray-300"
                    )}
                >
                    <span
                        className={cn(
                            "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200",
                            isEnabled ? "translate-x-6" : "translate-x-0"
                        )}
                    />
                </button>
            </div>
        </Card>
    );
}

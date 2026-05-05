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

interface AutoAssignmentProps {
    settings: AutoAssignmentSettings;
    onChange: (s: AutoAssignmentSettings) => void;
}

export function AutoAssignmentCard({ settings, onChange }: AutoAssignmentProps) {
    // Backend is manual assignment only (admin assigns pickups explicitly)
    const methods = ["Manual (Admin Only)"] as const;

    return (
        <Card className="p-8 border-gray-200 bg-white shadow-sm rounded-[4px] space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-[16px] font-bold text-gray-700 tracking-tight leading-none">Auto-Assignment Logic</h3>
            </div>
            <p className="text-[12px] text-gray-500 font-medium">
                Manual assignment only: pickups are assigned to collectors by admins (no auto-assignment).
            </p>

            {/* Assignment Method */}
            <div className="space-y-2.5">
                <label className="text-[12px] font-semibold text-gray-500 block">Assignment Method</label>
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full h-10 border border-gray-300 rounded-[2px] px-4 flex items-center justify-between text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all outline-none bg-white cursor-pointer select-none">
                        <span>Manual (Admin Only)</span>
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[400px]">
                        {methods.map((m) => (
                            <DropdownMenuItem key={m} disabled>{m}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Enable Auto-Assignment Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div className="space-y-0.5">
                    <p className="text-[13px] font-semibold text-gray-700">Enable Auto-Assignment</p>
                    <p className="text-[12px] text-gray-400 font-medium">Automatically assign pickups to collectors</p>
                </div>
                {/* Custom Toggle */}
                <button
                    disabled
                    className="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none bg-gray-200 opacity-60 cursor-not-allowed"
                >
                    <span
                        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 translate-x-0"
                    />
                </button>
            </div>
        </Card>
    );
}

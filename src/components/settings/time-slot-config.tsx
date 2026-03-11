"use client";

import { TimeSlotConfig } from "@/services/settings.service";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TimeSlotCardProps {
    config: TimeSlotConfig;
    onChange: (c: TimeSlotConfig) => void;
}

type SlotKey = keyof TimeSlotConfig;

const SLOTS: { key: SlotKey; label: string }[] = [
    { key: "morning", label: "Morning" },
    { key: "midday", label: "Midday" },
    { key: "afternoon", label: "Afternoon" },
    { key: "evening", label: "Evening" },
];

const timeInputClass =
    "h-10 w-full border border-gray-300 rounded-[2px] px-3 text-[13px] font-medium text-gray-600 outline-none hover:border-gray-400 focus:border-primary-green focus:ring-1 focus:ring-primary-green/20 transition-all bg-white";

export function TimeSlotCard({ config, onChange }: TimeSlotCardProps) {
    const handleChange = (key: SlotKey, field: "start" | "end", value: string) => {
        onChange({ ...config, [key]: { ...config[key], [field]: value } });
    };

    return (
        <Card className="p-8 border-gray-200 bg-white shadow-sm rounded-[4px] space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-purple-50 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-[16px] font-bold text-gray-700 tracking-tight leading-none">Time Slot Configuration</h3>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                {SLOTS.map(({ key, label }) => (
                    <div key={key} className="space-y-2.5">
                        <label className="text-[12px] font-semibold text-gray-500 block">{label}</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="time"
                                value={config[key].start}
                                onChange={(e) => handleChange(key, "start", e.target.value)}
                                className={timeInputClass}
                            />
                            <span className="text-gray-400 font-medium text-sm shrink-0">-</span>
                            <input
                                type="time"
                                value={config[key].end}
                                onChange={(e) => handleChange(key, "end", e.target.value)}
                                className={timeInputClass}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

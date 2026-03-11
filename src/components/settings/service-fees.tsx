"use client";

import { ServiceFees } from "@/services/settings.service";
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface ServiceFeesCardProps {
    fees: ServiceFees;
    onChange: (f: ServiceFees) => void;
}

const FEE_GRID: { key: keyof ServiceFees; label: string }[][] = [
    [
        { key: "residentialOrganic", label: "Residential - Organic" },
        { key: "residentialRecyclable", label: "Residential - Recyclable" },
    ],
    [
        { key: "businessOrganic", label: "Business - Organic" },
        { key: "businessEWaste", label: "Business - E-Waste" },
    ],
];

export function ServiceFeesCard({ fees, onChange }: ServiceFeesCardProps) {
    const update = (key: keyof ServiceFees, value: string) => {
        onChange({ ...fees, [key]: Number(value) || 0 });
    };

    return (
        <Card className="p-8 border-gray-200 bg-white shadow-sm rounded-[4px] space-y-7">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-orange-50 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="text-[16px] font-bold text-gray-700 tracking-tight leading-none">Service Fees</h3>
            </div>

            {/* 2×2 Fee Grid — each cell is a full bordered box */}
            <div className="space-y-3">
                {FEE_GRID.map((row, ri) => (
                    <div key={ri} className="grid grid-cols-2 gap-3">
                        {row.map(({ key, label }) => (
                            <div
                                key={key}
                                className="flex items-center justify-between border border-gray-200 rounded-[2px] px-5 py-3 bg-white"
                            >
                                <span className="text-[13px] font-medium text-gray-600">{label}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                    <input
                                        type="number"
                                        min={0}
                                        value={fees[key]}
                                        onChange={(e) => update(key, e.target.value)}
                                        className="w-24 h-8 border border-gray-300 rounded-[2px] px-2 text-[13px] font-semibold text-gray-700 text-right outline-none hover:border-gray-400 focus:border-primary-green transition-all bg-white"
                                    />
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">RWF</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </Card>
    );
}

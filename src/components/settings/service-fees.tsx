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

            {/* Responsive Fee Grid — each cell is a full bordered box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FEE_GRID.flat().map(({ key, label }) => (
                    <div
                        key={key}
                        className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 border border-gray-200 rounded-[2px] px-5 py-4 bg-white hover:border-gray-300 transition-colors shadow-sm"
                    >
                        <span className="text-[13px] font-bold text-gray-700">{label}</span>
                        <div className="flex items-center gap-2 shrink-0 self-end xs:self-auto">
                            <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">RWF</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={fees[key]}
                                    onChange={(e) => update(key, e.target.value)}
                                    className="w-28 h-9 border border-gray-200 rounded-[4px] pl-10 pr-3 text-[14px] font-bold text-gray-800 outline-none hover:border-gray-400 focus:border-primary-green transition-all bg-gray-50/30"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

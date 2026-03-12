"use client";

import { EcoPointsStructure } from "@/services/settings.service";
import { Card } from "@/components/ui/card";
import { Leaf } from "lucide-react";

interface EcoPointsCardProps {
    structure: EcoPointsStructure;
    onChange: (s: EcoPointsStructure) => void;
}

const WASTE_GRID: { key: keyof EcoPointsStructure["wastePoints"]; label: string }[][] = [
    [
        { key: "organic", label: "Organic" },
        { key: "recyclable", label: "Recyclable" },
    ],
    [
        { key: "eWaste", label: "E-Waste" },
        { key: "glass", label: "Glass" },
    ],
    [
        { key: "hazardous", label: "Hazardous" },
    ],
];

export function EcoPointsCard({ structure, onChange }: EcoPointsCardProps) {
    const { wastePoints, tierMultipliers } = structure;

    const updatePoints = (key: keyof typeof wastePoints, value: string) => {
        onChange({
            ...structure,
            wastePoints: { ...wastePoints, [key]: Number(value) || 0 },
        });
    };

    return (
        <Card className="p-8 border-gray-200 bg-white shadow-sm rounded-[4px] space-y-7">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-green-50 flex items-center justify-center shrink-0">
                    <Leaf className="w-4 h-4 text-primary-green" />
                </div>
                <h3 className="text-[16px] font-bold text-gray-700 tracking-tight leading-none">EcoPoints Structure</h3>
            </div>

            {/* Responsive Waste Type Point Boxes — 1-column mobile, 2-column desktop */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                {WASTE_GRID.flat().map(({ key, label }) => (
                    <div
                        key={key}
                        className="flex items-center justify-between border border-gray-200 rounded-[2px] px-5 py-3 bg-white hover:border-gray-300 transition-colors shadow-sm"
                    >
                        <span className="text-[13px] font-bold text-gray-700">{label}</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min={0}
                                value={wastePoints[key]}
                                onChange={(e) => updatePoints(key, e.target.value)}
                                className="w-16 h-8 border border-gray-200 rounded-[4px] px-2 text-[14px] font-bold text-gray-800 text-right outline-none hover:border-gray-400 focus:border-primary-green transition-all bg-gray-50/30"
                            />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">pts</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Tier Multipliers */}
            <div className="space-y-3">
                <p className="text-[13px] font-bold text-gray-700">Tier Multipliers</p>
                {tierMultipliers.map((tm) => (
                    <div
                        key={tm.tier}
                        className="flex items-center justify-between border border-gray-200 rounded-[2px] px-5 py-3 bg-white hover:border-gray-300 transition-colors shadow-sm"
                    >
                        <span className="text-[13px] font-bold text-gray-700">{tm.label}</span>
                        <div className="min-w-[70px] h-9 border border-gray-200 rounded-[4px] px-3 flex items-center justify-center bg-green-50/50">
                            <span className="text-[14px] font-black text-primary-green">{tm.multiplier.toFixed(1)}x</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

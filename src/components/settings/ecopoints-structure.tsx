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

            {/* Waste Type Point Boxes — 2-column grid, each cell is a full bordered box */}
            <div className="space-y-3">
                {WASTE_GRID.map((row, ri) => (
                    <div key={ri} className="grid grid-cols-2 gap-3">
                        {row.map(({ key, label }) => (
                            <div
                                key={key}
                                className="flex items-center justify-between border border-gray-200 rounded-[2px] px-5 py-3 bg-white"
                            >
                                <span className="text-[13px] font-medium text-gray-600">{label}</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={wastePoints[key]}
                                    onChange={(e) => updatePoints(key, e.target.value)}
                                    className="w-16 h-8 border border-gray-300 rounded-[2px] px-2 text-[13px] font-semibold text-gray-700 text-right outline-none hover:border-gray-400 focus:border-primary-green transition-all bg-white"
                                />
                            </div>
                        ))}
                        {/* empty cell if row has only 1 item */}
                        {row.length === 1 && <div />}
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
                        className="flex items-center justify-between border border-gray-200 rounded-[2px] px-5 py-3 bg-white"
                    >
                        <span className="text-[13px] font-medium text-gray-600">{tm.label}</span>
                        <div className="min-w-[64px] h-8 border border-gray-300 rounded-[2px] px-3 flex items-center justify-end bg-white">
                            <span className="text-[13px] font-bold text-gray-700">{tm.multiplier.toFixed(1)}x</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

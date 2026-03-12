"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Cell
} from "recharts";

const trendData = [
    { time: "00:00", level: 45 },
    { time: "04:00", level: 52 },
    { time: "08:00", level: 68 },
    { time: "12:00", level: 74 },
    { time: "16:00", level: 82 },
    { time: "20:00", level: 92 },
    { time: "24:00", level: 92 },
];

const distributionData = [
    { name: "Organic", count: 5 },
    { name: "Recyclable", count: 4 },
    { name: "E-Waste", count: 2 },
    { name: "Glass", count: 1.5 },
    { name: "Hazardous", count: 1 },
];

const typeStats = [
    { label: "Organic", count: 45, avgFill: "68%" },
    { label: "Recyclable", count: 38, avgFill: "52%" },
    { label: "E-Waste", count: 22, avgFill: "35%" },
    { label: "Glass", count: 18, avgFill: "58%" },
    { label: "Hazardous", count: 12, avgFill: "72%" },
];

export function BinSensorData() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Fill Level Trends */}
                <Card className="p-6 border-gray-100 shadow-sm rounded-[8px] hover:shadow-md transition-shadow">
                    <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-6">Fill Level Trends (24h)</h3>
                    <div className="h-[250px] w-full">
                        {mounted ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                        domain={[0, 100]}
                                        ticks={[0, 25, 50, 75, 100]}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: '#15803D', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            border: '1px solid #E5E7EB',
                                            padding: '12px',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                        itemStyle={{ color: '#15803D', fontWeight: 'bold', fontSize: '12px' }}
                                        labelStyle={{ color: '#6B7280', fontSize: '10px', marginBottom: '4px' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="level"
                                        stroke="#15803D"
                                        strokeWidth={3}
                                        dot={{ fill: '#15803D', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, stroke: '#15803D', strokeWidth: 2, fill: '#fff' }}
                                        animationDuration={1500}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-lg">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading...</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Bin Type Distribution */}
                <Card className="p-6 border-gray-100 shadow-sm rounded-[8px] hover:shadow-md transition-shadow">
                    <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-6">Bin Type Distribution</h3>
                    <div className="h-[250px] w-full">
                        {mounted ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={distributionData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#636E72' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#636E72' }}
                                        domain={[0, 6]}
                                        ticks={[0, 1, 2, 3, 4, 5, 6]}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F9FAFB' }}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            border: '1px solid #E5E7EB',
                                            padding: '12px',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                        itemStyle={{ color: '#166534', fontWeight: 'bold', fontSize: '12px' }}
                                        labelStyle={{ color: '#6B7280', fontSize: '10px', marginBottom: '4px' }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={1500}>
                                        {distributionData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill="#166534"
                                                className="hover:fill-[#15803D] transition-colors cursor-pointer"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-lg">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading...</span>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Bin Type Statistics */}
            <div className="space-y-6">
                <h3 className="text-[16px] font-bold text-[#1A1A1A] tracking-tight">Bin Type Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {typeStats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-[#064E3B] flex items-center justify-center shadow-lg border-4 border-white">
                                <span className="text-white text-[18px] font-bold">{stat.count}</span>
                            </div>
                            <div className="text-center group">
                                <div className="text-[13px] font-bold text-[#1A1A1A] leading-none mb-1">{stat.label}</div>
                                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-tight">Avg Fill: {stat.avgFill}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

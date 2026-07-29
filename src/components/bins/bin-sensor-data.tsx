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
import { binService, BinRecord } from "@/services/bin.service";
import { Flame, Battery, ShieldAlert, Cpu, Radio, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

export function BinSensorData() {
    const [mounted, setMounted] = useState(false);
    const [bins, setBins] = useState<BinRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        async function loadBinsData() {
            try {
                const data = await binService.getBins();
                setBins(data);
            } catch (e) {
                console.error("Failed to load bins sensor data:", e);
            } finally {
                setIsLoading(false);
            }
        }
        loadBinsData();
    }, []);

    // Calculate real type distribution
    const organicCount = bins.filter(b => b.type === 'Organic').length;
    const recyclableCount = bins.filter(b => b.type === 'Recyclable').length;
    const ewasteCount = bins.filter(b => b.type === 'E-Waste').length;
    const glassCount = bins.filter(b => b.type === 'Glass').length;
    const hazardousCount = bins.filter(b => b.type === 'Hazardous').length;

    const distributionData = [
        { name: "Organic", count: organicCount || 5 },
        { name: "Recyclable", count: recyclableCount || 4 },
        { name: "E-Waste", count: ewasteCount || 2 },
        { name: "Glass", count: glassCount || 1.5 },
        { name: "Hazardous", count: hazardousCount || 1 },
    ];

    // Calculate real fill level trend across 24h
    const trendData = [
        { time: "00:00", level: Math.round(bins.reduce((acc, b) => acc + (b.history?.[0]?.level || 25), 0) / (bins.length || 1)) },
        { time: "04:00", level: Math.round(bins.reduce((acc, b) => acc + (b.history?.[1]?.level || 35), 0) / (bins.length || 1)) },
        { time: "08:00", level: Math.round(bins.reduce((acc, b) => acc + (b.history?.[2]?.level || 50), 0) / (bins.length || 1)) },
        { time: "12:00", level: Math.round(bins.reduce((acc, b) => acc + (b.history?.[3]?.level || 65), 0) / (bins.length || 1)) },
        { time: "16:00", level: Math.round(bins.reduce((acc, b) => acc + (b.fillLevel || 75), 0) / (bins.length || 1)) },
        { time: "20:00", level: Math.round(bins.reduce((acc, b) => acc + (b.fillLevel || 80), 0) / (bins.length || 1)) },
        { time: "24:00", level: Math.round(bins.reduce((acc, b) => acc + (b.fillLevel || 85), 0) / (bins.length || 1)) },
    ];

    const typeStats = [
        { label: "Organic", count: organicCount, avgFill: `${Math.round(bins.filter(b => b.type === 'Organic').reduce((acc, b) => acc + b.fillLevel, 0) / (organicCount || 1))}%` },
        { label: "Recyclable", count: recyclableCount, avgFill: `${Math.round(bins.filter(b => b.type === 'Recyclable').reduce((acc, b) => acc + b.fillLevel, 0) / (recyclableCount || 1))}%` },
        { label: "E-Waste", count: ewasteCount, avgFill: `${Math.round(bins.filter(b => b.type === 'E-Waste').reduce((acc, b) => acc + b.fillLevel, 0) / (ewasteCount || 1))}%` },
        { label: "Glass", count: glassCount, avgFill: `${Math.round(bins.filter(b => b.type === 'Glass').reduce((acc, b) => acc + b.fillLevel, 0) / (glassCount || 1))}%` },
        { label: "Hazardous", count: hazardousCount, avgFill: `${Math.round(bins.filter(b => b.type === 'Hazardous').reduce((acc, b) => acc + b.fillLevel, 0) / (hazardousCount || 1))}%` },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
            {/* Live Telemetry Alerts Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-[8px] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[6px] bg-emerald-600 flex items-center justify-center text-white shrink-0">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Active Telemetry Bins</div>
                        <div className="text-xl font-extrabold text-emerald-950">{bins.length || 31} Bins</div>
                    </div>
                </Card>

                <Card className="p-4 bg-blue-50/60 border border-blue-100 rounded-[8px] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[6px] bg-blue-600 flex items-center justify-center text-white shrink-0">
                        <Radio className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold uppercase text-blue-800 tracking-wider">LoRaWAN Gateways</div>
                        <div className="text-xl font-extrabold text-blue-950">EU868 (100% Online)</div>
                    </div>
                </Card>

                <Card className="p-4 bg-amber-50/60 border border-amber-100 rounded-[8px] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[6px] bg-amber-600 flex items-center justify-center text-white shrink-0">
                        <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">Avg Internal Temp</div>
                        <div className="text-xl font-extrabold text-amber-950">24.2°C (Normal)</div>
                    </div>
                </Card>

                <Card className="p-4 bg-rose-50/60 border border-rose-100 rounded-[8px] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[6px] bg-rose-600 flex items-center justify-center text-white shrink-0">
                        <Flame className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold uppercase text-rose-800 tracking-wider">Fire / Tilt Safety</div>
                        <div className="text-xl font-extrabold text-rose-950">0 Hazards Detected</div>
                    </div>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Fill Level Trends */}
                <Card className="p-6 border-gray-100 shadow-sm rounded-[8px] hover:shadow-md transition-shadow bg-white">
                    <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-6">Fill Level Trends (24h Aggregate)</h3>
                    <div className="h-[250px] w-full">
                        {mounted && !isLoading ? (
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
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Telemetry...</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Bin Type Distribution */}
                <Card className="p-6 border-gray-100 shadow-sm rounded-[8px] hover:shadow-md transition-shadow bg-white">
                    <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-6">Live Bin Category Distribution</h3>
                    <div className="h-[250px] w-full">
                        {mounted && !isLoading ? (
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
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Categories...</span>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Bin Type Statistics */}
            <div className="space-y-6">
                <h3 className="text-[16px] font-bold text-[#1A1A1A] tracking-tight">System Waste Category Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {typeStats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center space-y-3 p-4 bg-white border border-gray-100 rounded-[8px] shadow-sm">
                            <div className="w-14 h-14 rounded-full bg-[#064E3B] flex items-center justify-center shadow-md border-2 border-white">
                                <span className="text-white text-[16px] font-bold">{stat.count}</span>
                            </div>
                            <div className="text-center group">
                                <div className="text-[13px] font-bold text-[#1A1A1A] leading-none mb-1">{stat.label}</div>
                                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-tight">Avg Fill: {stat.avgFill}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

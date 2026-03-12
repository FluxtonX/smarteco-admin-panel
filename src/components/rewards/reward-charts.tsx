"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
    PieChart, Pie, Legend, LineChart, Line
} from "recharts";
import { CategoryPointData, TierDistributionData, TrendData, ReferralPerformanceData } from "@/services/reward.service";

export function WasteCategoryChart({ data }: { data: CategoryPointData[] }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <Card className="p-6 border-gray-100 shadow-sm rounded-[8px]">
            <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-8">Points by Waste Category</h3>
            <div className="h-[300px] w-full min-w-0">
                {mounted ? (
                    <ResponsiveContainer width="100%" height="100%" debounce={100}>
                        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis
                                dataKey="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                domain={[0, 60000]}
                                ticks={[0, 15000, 30000, 45000, 60000]}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', padding: '10px' }}
                            />
                            <Bar dataKey="points" radius={[4, 4, 0, 0]} barSize={45}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
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
    );
}

export function TierDistributionChart({ data }: { data: TierDistributionData[] }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <Card className="p-6 border-gray-100 shadow-sm rounded-[8px]">
            <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-4">Tier Distribution</h3>
            <div className="h-[280px] w-full relative min-w-0">
                {mounted ? (
                    <ResponsiveContainer width="100%" height="100%" debounce={100}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-lg">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading...</span>
                    </div>
                )}
            </div>
            <div className="mt-4 space-y-2">
                {data.map((tier, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                            <span className="font-bold text-gray-500">{tier.name}: {tier.value}</span>
                        </div>
                        <span className="font-bold text-[#1A1A1A]">{tier.points}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function PointsTrendChart({ data }: { data: TrendData[] }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <Card className="p-6 border-gray-100 shadow-sm rounded-[8px]">
            <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-8">Points Issued vs Redeemed</h3>
            <div className="h-[300px] w-full min-w-0">
                {mounted ? (
                    <ResponsiveContainer width="100%" height="100%" debounce={100}>
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#636E72' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#636E72' }}
                                domain={[40000, 200000]}
                                ticks={[40000, 80000, 120000, 160000, 200000]}
                            />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="issued"
                                stroke="#15803D"
                                strokeWidth={2}
                                dot={{ fill: '#fff', r: 4, strokeWidth: 2, stroke: '#15803D' }}
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
    );
}

export function ReferralPerformanceChart({ data }: { data: ReferralPerformanceData[] }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <Card className="p-6 border-gray-100 shadow-sm rounded-[8px]">
            <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-8">Referral Performance</h3>
            <div className="h-[300px] w-full min-w-0">
                {mounted ? (
                    <ResponsiveContainer width="100%" height="100%" debounce={100}>
                        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                domain={[0, 2200]}
                                ticks={[0, 1100, 1650, 2200]}
                            />
                            <Tooltip cursor={false} />
                            <Bar dataKey="count" fill="#15803D" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-lg">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading...</span>
                    </div>
                )}
            </div>
        </Card>
    );
}

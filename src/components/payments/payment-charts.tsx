"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { RevenueDayData, RevenueWasteData } from "@/services/payment.service";

export function RevenueDayChart({ data }: { data: RevenueDayData[] }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <Card className="p-6 border-gray-100 shadow-sm rounded-[8px]">
            <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-8">Revenue by Day</h3>
            <div className="h-[300px] w-full min-w-0">
                {mounted ? (
                    <ResponsiveContainer width="100%" height="100%" debounce={100}>
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                domain={[0, 1000000]}
                                ticks={[0, 250000, 500000, 750000, 1000000]}
                                tickFormatter={(value) => `${value / 1000}k`}
                            />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#15803D"
                                strokeWidth={3}
                                dot={{ fill: '#fff', r: 4, strokeWidth: 2, stroke: '#15803D' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
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

export function RevenueWasteChart({ data }: { data: RevenueWasteData[] }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <Card className="p-6 border-gray-100 shadow-sm rounded-[8px]">
            <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-4">Revenue by Waste Type</h3>
            <div className="h-[320px] w-full relative min-w-0">
                {mounted ? (
                    <ResponsiveContainer width="100%" height="100%" debounce={100}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={80}
                                paddingAngle={0}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${Math.round((percent || 0) * 100)}%`}
                                labelLine={true}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
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

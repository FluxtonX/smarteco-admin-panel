"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { ReferralPerformanceData } from "@/services/referral.service";

export function ReferralCharts({ data }: { data: ReferralPerformanceData[] }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <Card className="p-6 border-gray-100 shadow-sm rounded-[8px]">
            <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-8">Performance Overview</h3>
            <div className="h-[350px] w-full min-w-0">
                {mounted ? (
                    <ResponsiveContainer width="100%" height="100%" debounce={100}>
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="week"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar
                                dataKey="referrals"
                                fill="#22C55E"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-lg">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Analytics...</span>
                    </div>
                )}
            </div>
        </Card>
    );
}

export function ReferralPerformanceChart({ data }: { data: ReferralPerformanceData[] }) {
    return <ReferralCharts data={data} />;
}

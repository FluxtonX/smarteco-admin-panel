"use client";

import { Card } from "@/components/ui/card";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { ReferralPerformanceData } from "@/services/referral.service";

export function ReferralCharts({ data }: { data: ReferralPerformanceData[] }) {
    return (
        <Card className="p-6 border-gray-100 shadow-sm rounded-[8px]">
            <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-8">Referral Performance</h3>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="week"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#636E72' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#636E72' }}
                            domain={[0, 6000]}
                            ticks={[0, 1500, 3000, 4500, 6000]}
                        />
                        <Tooltip cursor={false} />
                        <Legend verticalAlign="bottom" height={36} iconType="rect" align="center" />
                        <Bar
                            dataKey="referrals"
                            name="Referrals"
                            fill="#15803D"
                            radius={[2, 2, 0, 0]}
                            barSize={50}
                        />
                        <Bar
                            dataKey="bonus"
                            name="Bonus Points"
                            fill="#4ADE80"
                            radius={[2, 2, 0, 0]}
                            barSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

export function ReferralPerformanceChart({ data }: { data: ReferralPerformanceData[] }) {
    return <ReferralCharts data={data} />;
}

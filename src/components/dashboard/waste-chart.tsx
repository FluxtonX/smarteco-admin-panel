"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const data = [
    { name: 'Organic', value: 44, color: '#1E8449' },
    { name: 'Recyclable', value: 31, color: '#3b82f6' },
    { name: 'E-Waste', value: 12, color: '#6366f1' },
    { name: 'Glass', value: 8, color: '#8b5cf6' },
    { name: 'Hazardous', value: 4, color: '#ef4444' },
];

export function WasteChart() {
    return (
        <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-0 pt-6 px-8">
                <CardTitle className="text-lg font-semibold text-gray-900 leading-tight tracking-tight">Waste by Category</CardTitle>
                <p className="text-xs text-gray-400 font-medium -mt-1 underline decoration-dotted underline-offset-4">Distribution this week</p>
            </CardHeader>
            <CardContent className="p-8 pb-4">
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={80}
                                paddingAngle={0}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}%`}
                                labelLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

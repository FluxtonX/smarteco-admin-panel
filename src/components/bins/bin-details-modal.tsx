"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BinRecord } from "@/services/bin.service";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { X, Calendar, User, MapPin } from "lucide-react";

interface BinDetailsModalProps {
    bin: BinRecord | null;
    isOpen: boolean;
    onClose: () => void;
}

export function BinDetailsModal({ bin, isOpen, onClose }: BinDetailsModalProps) {
    if (!bin) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="sm:max-w-[750px] w-[95%] max-h-[90vh] p-0 overflow-hidden border-none rounded-[12px] bg-[#FFFFFF] shadow-2xl font-sans fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col">
                {/* Close Button Pin */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {/* Modal Header Area */}
                <header className="px-10 pt-10 pb-4 bg-white shrink-0">
                    <div className="space-y-4">
                        <h2 className="text-[18px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">{bin.id} - Details</h2>

                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-[#636E72] uppercase tracking-tight">Owner</span>
                            <div className="text-[16px] font-bold text-[#1A1A1A] leading-tight">{bin.user.name}</div>
                            <p className="text-[12px] font-medium text-[#636E72]">{bin.user.address} • Kigali North</p>
                        </div>
                    </div>
                </header>

                <div className="px-10 pb-8 pt-2 space-y-6 overflow-y-auto">
                    {/* Horizontal Stats Row - Compact Height (Reduced ~25%) */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Fill Level Card */}
                        <div className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-[6px] py-3.5 px-4 flex flex-col items-center justify-center space-y-1">
                            <span className="text-[9px] font-bold text-[#E11D48] uppercase tracking-widest">Fill Level</span>
                            <span className="text-[24px] font-bold text-[#E11D48] tracking-tighter leading-none">{bin.fillLevel}%</span>
                        </div>

                        {/* Bin Type Card */}
                        <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-[6px] py-3.5 px-4 flex flex-col items-center justify-center space-y-1">
                            <span className="text-[9px] font-bold text-[#2563EB] uppercase tracking-widest">Bin Type</span>
                            <span className="text-[14px] font-bold text-[#2563EB] tracking-tight leading-none uppercase">Organic</span>
                        </div>

                        {/* Last Emptied Card */}
                        <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-[6px] py-3.5 px-4 flex flex-col items-center justify-center space-y-1 text-center">
                            <span className="text-[9px] font-bold text-[#4B5563] uppercase tracking-widest">Last Emptied</span>
                            <span className="text-[12px] font-bold text-[#1F2937] leading-tight">{bin.lastEmptied}</span>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="space-y-4">
                        <h3 className="text-[14px] font-bold text-[#1A1A1A] tracking-tight whitespace-nowrap">Fill Level History (24h)</h3>
                        <div className="h-[200px] w-full bg-[#FFFFFF] relative pr-6 pb-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={bin.history} margin={{ top: 5, right: 5, bottom: 20, left: -30 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 9, fill: '#636E72', fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        stroke="#E5E7EB"
                                        tickLine={false}
                                        tick={{ fontSize: 9, fill: '#636E72', fontWeight: 500 }}
                                        domain={[0, 100]}
                                        ticks={[0, 25, 50, 75, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            border: '1px solid #E5E7EB',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            padding: '8px'
                                        }}
                                        labelStyle={{ fontSize: '9px', color: '#636E72', marginBottom: '4px' }}
                                        itemStyle={{ fontSize: '10px', fontWeight: '800', color: '#15803D' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="level"
                                        stroke="#15803D"
                                        strokeWidth={2}
                                        dot={{ fill: '#15803D', r: 3, stroke: '#fff', strokeWidth: 1.5 }}
                                        activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bottom Info Cards Section - Light Gray with Shadow */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#F8FAFC] border border-[#EDF2F7] rounded-[8px] p-3 shadow-sm flex flex-col items-center space-y-1">
                            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest text-center">Alert Status</span>
                            <Badge className={cn(
                                "px-3 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider border-none shadow-none text-center min-w-[70px] flex justify-center",
                                bin.alertStatus === 'Full' ? "bg-[#FFE4E6] text-[#E11D48]" :
                                    bin.alertStatus === 'Nearly Full' ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#DCFCE7] text-[#16A34A]"
                            )}>
                                {bin.alertStatus === 'Nearly Full' ? 'N. Full' : bin.alertStatus}
                            </Badge>
                        </div>
                        <div className="bg-[#F8FAFC] border border-[#EDF2F7] rounded-[8px] p-3 shadow-sm flex flex-col items-center space-y-1 text-center">
                            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest text-center">Assigned Collector</span>
                            <div className="text-[13px] font-bold text-[#1A1A1A] tracking-tight">{bin.collector}</div>
                        </div>
                    </div>

                    {/* Footer Actions - Narrower Style */}
                    <div className="flex items-center gap-4 pt-2 shrink-0">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-9 border-[#E5E7EB] text-[#1A1A1A] font-bold rounded-[6px] hover:bg-gray-50 transition-all text-[11px] shadow-none"
                        >
                            Close
                        </Button>
                        <Button
                            className="flex-[2.5] h-9 bg-[#15803D] hover:bg-[#166534] text-white font-bold rounded-[6px] transition-all text-[11px] shadow-sm"
                        >
                            Trigger Assignment
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

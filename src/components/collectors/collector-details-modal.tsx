"use client";

import { X, Truck, Star, MapPin, TrendingUp, History, Radio } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CollectorRecord } from "@/services/collector.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CollectorDetailsModalProps {
    collector: CollectorRecord | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CollectorDetailsModal({ collector, isOpen, onClose }: CollectorDetailsModalProps) {
    if (!collector) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-2xl h-auto flex flex-col font-sans">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-4 border-none flex flex-row items-start justify-between text-left">
                    <div className="space-y-0.5">
                        <DialogTitle className="text-xl font-bold text-[#1A1A1A]">{collector.name}</DialogTitle>
                        <p className="text-xs font-semibold text-gray-500 tracking-tight">
                            {collector.id} • {collector.phone}
                        </p>
                    </div>
                </DialogHeader>

                {/* Body Content */}
                <div className="px-6 pb-6 space-y-6 flex-1 overflow-y-auto">

                    {/* Top Stats Cards (3 Cards) */}
                    <div className="grid grid-cols-3 gap-3">
                        {/* Performance Card */}
                        <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-1">
                            <p className="text-[9px] font-bold text-[#2E7D32] uppercase tracking-[0.05em] leading-none">Performance Score</p>
                            <p className="text-xl font-bold text-[#1B5E20]">{collector.performance}%</p>
                        </div>

                        {/* Total Pickups Card */}
                        <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-1">
                            <p className="text-[9px] font-bold text-[#1565C0] uppercase tracking-[0.05em] leading-none">Total Pickups</p>
                            <p className="text-xl font-bold text-[#0D47A1]">{collector.totalPickups.toLocaleString()}</p>
                        </div>

                        {/* Rating Card */}
                        <div className="bg-[#FFF9C4] border border-[#FFF176] rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-1">
                            <p className="text-[9px] font-bold text-[#F9A825] uppercase tracking-[0.05em] leading-none">Rating</p>
                            <div className="flex items-center space-x-1.5">
                                <Star className="w-4 h-4 fill-[#F9A825] text-[#F9A825]" />
                                <p className="text-xl font-bold text-[#E65100]">{collector.rating}</p>
                            </div>
                        </div>
                    </div>

                    {/* Collector Details Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-[#1A1A1A]">Collector Details</h3>
                        <div className="space-y-0.5 rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            {/* Zone */}
                            <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] border-b border-gray-100">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Zone</span>
                                <span className="text-sm font-bold text-[#2D3436]">{collector.zone}</span>
                            </div>

                            {/* Vehicle Plate */}
                            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vehicle Plate</span>
                                <span className="text-sm font-bold text-[#2D3436] tracking-wider">{collector.vehicle}</span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] border-b border-gray-100">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
                                <Badge className={cn(
                                    "px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-[4px] border-none shadow-sm",
                                    collector.status === "On Route" && "bg-blue-100/80 text-blue-700",
                                    collector.status === "Available" && "bg-green-100/80 text-green-700",
                                    collector.status === "Offline" && "bg-gray-100/80 text-gray-600"
                                )}>
                                    {collector.status}
                                </Badge>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center justify-between px-4 py-3 bg-white">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</span>
                                <span className="text-sm font-bold text-[#2D3436]">{collector.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-5 bg-white border-t border-gray-100 flex items-center justify-between gap-3 rounded-b-2xl">
                    <Button className="flex-1 bg-primary-green hover:bg-green-700 text-white font-bold h-11 text-xs shadow-md shadow-green-100 rounded-lg">
                        Reassign Pickup
                    </Button>
                    <Button variant="outline" className="flex-1 border-gray-200 text-gray-600 font-bold h-11 text-xs hover:bg-gray-50 rounded-lg">
                        <History className="w-3.5 h-3.5 mr-2 opacity-70" />
                        View Route History
                    </Button>
                    <Button variant="outline" className="flex-1 border-gray-200 text-gray-600 font-bold h-11 text-xs hover:bg-gray-50 rounded-lg">
                        <Radio className="w-3.5 h-3.5 mr-2 text-blue-500 animate-pulse" />
                        Track Live
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

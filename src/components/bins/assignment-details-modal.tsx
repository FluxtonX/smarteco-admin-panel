"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, User, MapPin, Calendar, Clock, CheckCircle2, Navigation } from "lucide-react";
import { AssignmentRecord } from "@/services/bin.service";
import { cn } from "@/lib/utils";

interface AssignmentDetailsModalProps {
    assignment: AssignmentRecord | null;
    isOpen: boolean;
    onClose: () => void;
}

export function AssignmentDetailsModal({ assignment, isOpen, onClose }: AssignmentDetailsModalProps) {
    if (!assignment) return null;

    const timeline = [
        { status: "Assigned", time: assignment.assignedAt, done: true },
        { status: "Dispatched", time: "2024-02-24 08:35", done: assignment.status !== 'Pending' },
        { status: "In Transit", time: "2024-02-24 08:45", done: assignment.status === 'Completed' || assignment.status === 'In Progress' },
        { status: "Completed", time: "2024-02-24 09:15", done: assignment.status === 'Completed' },
    ];

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Completed': return "bg-[#DCFCE7] text-[#166534]";
            case 'In Progress': return "bg-[#FEF3C7] text-[#92400E]";
            case 'Pending': return "bg-gray-100 text-gray-500";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white w-[800px] rounded-[12px] shadow-2xl relative animate-in zoom-in duration-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="space-y-1">
                        <h2 className="text-[10px] font-bold text-primary-green uppercase tracking-[0.2em]">Assignment Detail</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[22px] font-bold text-[#1A1A1A] tracking-tight">{assignment.binId}</span>
                            <Badge className={cn("px-3 py-1 rounded-[4px] font-bold text-[10px] uppercase shadow-none border-none", getStatusVariant(assignment.status))}>
                                {assignment.status}
                            </Badge>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 grid grid-cols-12 gap-8">
                    {/* Left side - Info */}
                    <div className="col-span-12 lg:col-span-7 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-white border border-gray-100 rounded-[8px] shadow-sm space-y-2">
                                <div className="flex items-center text-gray-400 space-x-2">
                                    <User className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Collector</span>
                                </div>
                                <div className="text-[16px] font-bold text-[#1A1A1A]">{assignment.collector}</div>
                            </div>
                            <div className="p-5 bg-white border border-gray-100 rounded-[8px] shadow-sm space-y-2">
                                <div className="flex items-center text-gray-400 space-x-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Assigned At</span>
                                </div>
                                <div className="text-[16px] font-bold text-[#1A1A1A] truncate">{assignment.assignedAt}</div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-[8px] space-y-4">
                            <div className="flex items-center space-x-2 text-primary-green">
                                <MapPin className="w-4 h-4" />
                                <h4 className="text-[12px] font-bold uppercase tracking-widest">Target Destination</h4>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[15px] font-bold text-[#1A1A1A]">Kigali North District, Hub 04</div>
                                <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                                    Near the main marketplace entrance, Sector A. Access code for smart lock: <span className="text-[#1A1A1A] font-bold">#4492</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Timeline */}
                    <div className="col-span-12 lg:col-span-5 space-y-6">
                        <div className="flex items-center space-x-2">
                            <Navigation className="w-4 h-4 text-primary-green" />
                            <h4 className="text-[12px] font-bold uppercase tracking-widest">Assignment Timeline</h4>
                        </div>
                        <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                            {timeline.map((item, idx) => (
                                <div key={idx} className="relative">
                                    <div className={cn(
                                        "absolute -left-[19px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10",
                                        item.done ? "bg-primary-green" : "bg-gray-100"
                                    )} />
                                    <div className="space-y-0.5">
                                        <div className={cn("text-[13px] font-bold", item.done ? "text-[#1A1A1A]" : "text-gray-400")}>
                                            {item.status}
                                        </div>
                                        <div className="text-[11px] font-medium text-gray-400">{item.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end items-center space-x-3">
                    <button
                        onClick={onClose}
                        className="px-6 h-11 border border-gray-200 bg-white text-gray-600 text-[12px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Close Details
                    </button>
                    <button
                        className="px-8 h-11 bg-primary-green text-white text-[12px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-[#15803D] transition-all shadow-lg shadow-primary-green/20"
                    >
                        Contact Collector
                    </button>
                </div>
            </div>
        </div>
    );
}

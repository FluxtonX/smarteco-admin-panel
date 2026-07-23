"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, AlertTriangle, Truck, CheckCircle2, UserCheck } from "lucide-react";
import { BinRecord, binService } from "@/services/bin.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BinDetailsModalProps {
    bin: BinRecord | null;
    isOpen: boolean;
    onClose: () => void;
    onBinUpdated?: () => void;
}

const AVAILABLE_COLLECTORS = [
    { id: "COL-001", name: "Patrick Mugisha", status: "On Delivery" },
    { id: "COL-002", name: "Jean Claude Habimana", status: "Available" },
    { id: "COL-003", name: "Divine Uwase", status: "Available" },
    { id: "COL-004", name: "Eric Nshimiyimana", status: "On Delivery" },
];

export function BinDetailsModal({ bin, isOpen, onClose, onBinUpdated }: BinDetailsModalProps) {
    const [selectedCollector, setSelectedCollector] = useState<string>("Patrick Mugisha");
    const [isAssigning, setIsAssigning] = useState(false);
    const [assignmentSuccess, setAssignmentSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (bin) {
            if (bin.collector && bin.collector !== "Unassigned") {
                setSelectedCollector(bin.collector);
            } else {
                setSelectedCollector("Patrick Mugisha");
            }
            setAssignmentSuccess(null);
        }
    }, [bin]);

    if (!bin) return null;

    const handleTriggerAssignment = async () => {
        setIsAssigning(true);
        try {
            const res = await binService.assignCollector(bin.id, selectedCollector);
            setAssignmentSuccess(`Successfully assigned ${res.collector} to ${bin.id}!`);
            if (onBinUpdated) onBinUpdated();
            setTimeout(() => {
                setAssignmentSuccess(null);
            }, 3000);
        } catch (error) {
            console.error("Assignment failed:", error);
        } finally {
            setIsAssigning(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="sm:max-w-[480px] p-6 bg-white border-0 shadow-2xl overflow-hidden rounded-[16px] h-auto flex flex-col font-sans">
                {/* Header */}
                <DialogHeader className="p-0 flex flex-row items-center justify-between pb-4 border-b border-[#F1F5F9]">
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
                            <span>Smart Bin {bin.id}</span>
                        </DialogTitle>
                        <p className="text-[12px] font-semibold text-[#64748B]">Real-time telemetry and collector assignment</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-[#F1F5F9] rounded-full text-[#94A3B8] hover:text-[#0F172A] transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>

                {/* Body Content */}
                <div className="py-4 space-y-5">
                    {/* User & Location Header Box */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] p-3.5 space-y-1">
                        <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Owner / Location</div>
                        <div className="text-[14px] font-bold text-[#0F172A]">{bin.user.name}</div>
                        <div className="text-[12px] font-medium text-[#475569]">{bin.user.address}</div>
                    </div>

                    {/* Progress Level Card */}
                    <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-4 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Fill Level Capacity</span>
                            <span className={cn(
                                "text-base font-extrabold",
                                bin.fillLevel >= 90 ? "text-[#E11D48]" : bin.fillLevel >= 75 ? "text-[#D97706]" : "text-[#16A34A]"
                            )}>{bin.fillLevel}%</span>
                        </div>
                        <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full transition-all duration-500 rounded-full",
                                    bin.fillLevel >= 90 ? "bg-[#EF4444]" : bin.fillLevel >= 75 ? "bg-[#F59E0B]" : "bg-[#10B981]"
                                )}
                                style={{ width: `${bin.fillLevel}%` }}
                            />
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-3 shadow-sm flex flex-col items-center space-y-1">
                            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest text-center">Alert Status</span>
                            <Badge className={cn(
                                "px-3 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider border-none shadow-none text-center min-w-[70px] flex justify-center",
                                bin.alertStatus === 'Critical' ? "bg-[#FFE4E6] text-[#E11D48]" :
                                bin.alertStatus === 'Full' ? "bg-[#FFE4E6] text-[#E11D48]" :
                                bin.alertStatus === 'Nearly Full' ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#DCFCE7] text-[#16A34A]"
                            )}>
                                {bin.alertStatus}
                            </Badge>
                        </div>
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-3 shadow-sm flex flex-col items-center space-y-1 text-center">
                            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest text-center">Current Collector</span>
                            <div className="text-[12px] font-bold text-[#0F172A] truncate w-full">{bin.collector}</div>
                        </div>
                    </div>

                    {/* Assign Collector Selector Section */}
                    <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-[#166534] uppercase tracking-wider flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-[#166534]" />
                                <span>Assign Dispatch Collector</span>
                            </label>
                        </div>
                        <select
                            value={selectedCollector}
                            onChange={(e) => setSelectedCollector(e.target.value)}
                            className="w-full h-10 border border-[#86EFAC] rounded-[6px] px-3 text-xs font-bold text-[#0F172A] bg-white outline-none focus:ring-2 focus:ring-[#22C55E]/30"
                        >
                            {AVAILABLE_COLLECTORS.map((c) => (
                                <option key={c.id} value={c.name}>
                                    {c.name} ({c.status})
                                </option>
                            ))}
                        </select>

                        {assignmentSuccess && (
                            <div className="p-2 bg-[#DCFCE7] border border-[#86EFAC] rounded-[6px] text-[11px] font-bold text-[#15803D] flex items-center gap-2 animate-in fade-in">
                                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                                <span>{assignmentSuccess}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-10 border-[#E2E8F0] text-[#475569] font-bold rounded-[6px] hover:bg-gray-50 transition-all text-xs"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handleTriggerAssignment}
                            disabled={isAssigning}
                            className="flex-[2] h-10 bg-[#15803D] hover:bg-[#166534] text-white font-bold rounded-[6px] transition-all text-xs shadow-md shadow-[#15803D]/20 flex items-center justify-center gap-1.5"
                        >
                            <UserCheck className="w-4 h-4" />
                            <span>{isAssigning ? "Dispatching..." : "Trigger Assignment"}</span>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

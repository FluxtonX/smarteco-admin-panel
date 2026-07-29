"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Truck, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import { BinRecord, CollectorOption, binService } from "@/services/bin.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BinDetailsModalProps {
    bin: BinRecord | null;
    isOpen: boolean;
    onClose: () => void;
    onBinUpdated?: () => void;
}

export function BinDetailsModal({ bin, isOpen, onClose, onBinUpdated }: BinDetailsModalProps) {
    const [collectors, setCollectors] = useState<CollectorOption[]>([]);
    const [selectedCollectorId, setSelectedCollectorId] = useState<string>("");
    const [isLoadingCollectors, setIsLoadingCollectors] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const [assignmentSuccess, setAssignmentSuccess] = useState<string | null>(null);
    const [assignmentError, setAssignmentError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setIsLoadingCollectors(true);
            setAssignmentSuccess(null);
            setAssignmentError(null);
            binService.getCollectors().then((fetched) => {
                setCollectors(fetched);
                if (fetched.length > 0) {
                    setSelectedCollectorId(fetched[0].id);
                }
                setIsLoadingCollectors(false);
            }).catch(() => {
                setIsLoadingCollectors(false);
            });
        }
    }, [isOpen]);

    if (!bin) return null;

    const handleTriggerAssignment = async () => {
        if (!selectedCollectorId) {
            setAssignmentError("Please select a valid collector profile.");
            return;
        }

        setIsAssigning(true);
        setAssignmentError(null);
        setAssignmentSuccess(null);
        try {
            const res = await binService.assignCollector(bin.id, selectedCollectorId);
            setAssignmentSuccess(res.message || `Assigned ${res.collectorName} to bin ${bin.id}`);
            if (onBinUpdated) onBinUpdated();
            setTimeout(() => {
                setAssignmentSuccess(null);
            }, 3000);
        } catch (error: any) {
            console.error("Assignment failed:", error);
            setAssignmentError(error.message || "Failed to assign collector.");
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
                            {isLoadingCollectors && (
                                <span className="text-[10px] font-semibold text-gray-400 animate-pulse">Loading collectors...</span>
                            )}
                        </div>

                        {collectors.length > 0 ? (
                            <select
                                value={selectedCollectorId}
                                onChange={(e) => setSelectedCollectorId(e.target.value)}
                                className="w-full h-10 border border-[#86EFAC] rounded-[6px] px-3 text-xs font-bold text-[#0F172A] bg-white outline-none focus:ring-2 focus:ring-[#22C55E]/30"
                            >
                                {collectors.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.zone} — Plate: {c.vehiclePlate})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="p-3 bg-white border border-gray-200 rounded-[6px] text-[11px] font-bold text-gray-500 text-center">
                                {isLoadingCollectors ? "Fetching collectors from system..." : "No active collectors found in system."}
                            </div>
                        )}

                        {assignmentSuccess && (
                            <div className="p-2 bg-[#DCFCE7] border border-[#86EFAC] rounded-[6px] text-[11px] font-bold text-[#15803D] flex items-center gap-2 animate-in fade-in">
                                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                                <span>{assignmentSuccess}</span>
                            </div>
                        )}

                        {assignmentError && (
                            <div className="p-2 bg-[#FEE2E2] border border-[#FCA5A5] rounded-[6px] text-[11px] font-bold text-[#991B1B] flex items-center gap-2 animate-in fade-in">
                                <AlertCircle className="w-4 h-4 text-[#991B1B] shrink-0" />
                                <span>{assignmentError}</span>
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
                            disabled={isAssigning || collectors.length === 0}
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

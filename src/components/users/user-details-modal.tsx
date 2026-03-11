import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Ban, CheckCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { UserRecord, userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UserDetailsModalProps {
    user: UserRecord | null;
    isOpen: boolean;
    onClose: () => void;
}

export function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
    const [localStatus, setLocalStatus] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        if (user) setLocalStatus(user.status);
    }, [user]);

    if (!user || !localStatus) return null;

    const isSuspended = localStatus === "Suspended";

    const handleToggle = async () => {
        setIsActionLoading(true);
        await userService.toggleUserStatus(user.id);
        setLocalStatus(isSuspended ? "Active" : "Suspended");
        setIsActionLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="sm:max-w-[600px] p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-xl h-auto flex flex-col font-sans">
                {/* Header */}
                <DialogHeader className="px-6 py-5 border-b border-gray-100 flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl font-bold text-[#1A1A1A]">{user.name}</DialogTitle>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>

                {/* Body Content */}
                <div className="px-6 py-5 space-y-6 flex-1 overflow-y-auto">

                    {/* Top Gray Bar */}
                    <div className="bg-[#f8f9fa] rounded-[4px] p-4 flex items-center justify-between border border-gray-100">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">User ID</p>
                            <p className="text-sm font-extrabold text-[#1A1A1A]">{user.id}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Registration Date</p>
                            <p className="text-sm font-bold text-[#2D3436]">2024-02-01</p> {/* Mock date to match image */}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                            <p className="text-sm font-bold text-[#2D3436]">{user.phone}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-right">Status</p>
                            <Badge className={cn(
                                "px-3 py-1 text-[11px] font-bold uppercase border-none rounded-[4px] flex items-center gap-1.5 shadow-sm",
                                isSuspended ? "bg-red-100/80 text-red-700" : "bg-green-100/80 text-green-700"
                            )}>
                                {isSuspended ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                {localStatus}
                            </Badge>
                        </div>
                    </div>

                    {/* Metric Cards Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-[4px] p-4 flex flex-col items-center justify-center">
                            <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">EcoPoints</p>
                            <p className="text-3xl font-bold text-[#2E7D32]">{user.points}</p>
                        </div>
                        <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-[4px] p-4 flex flex-col items-center justify-center">
                            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">Active Pickups</p>
                            <p className="text-3xl font-bold text-[#1565C0]">{user.pickups}</p>
                        </div>
                    </div>

                    {/* Details List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between bg-[#f8f9fa] rounded-[4px] px-4 py-3 border border-gray-100">
                            <span className="text-sm font-semibold text-[#636E72]">Account Type</span>
                            <Badge className="bg-blue-100 text-blue-700 border-none px-2.5 py-0.5 rounded-[4px] font-bold text-[10px] uppercase shadow-none">{user.type}</Badge>
                        </div>
                        <div className="flex items-center justify-between bg-[#f8f9fa] rounded-[4px] px-4 py-3 border border-gray-100">
                            <span className="text-sm font-semibold text-[#636E72]">Current Tier</span>
                            <Badge className="bg-green-100 text-green-700 border-none px-2.5 py-0.5 rounded-[4px] font-bold text-[10px] uppercase shadow-none">{user.tier}</Badge>
                        </div>
                        <div className="flex items-center justify-between bg-[#f8f9fa] rounded-[4px] px-4 py-3 border border-gray-100">
                            <span className="text-sm font-semibold text-[#636E72]">Zone</span>
                            <span className="text-sm font-bold text-[#2D3436]">{user.location}</span>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between rounded-b-xl gap-4">
                    <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-[4px] border-gray-200 text-gray-600 font-bold hover:bg-white shadow-sm hover:border-gray-300">
                        Close
                    </Button>
                    <Button
                        onClick={handleToggle}
                        disabled={isActionLoading}
                        className={cn(
                            "flex-1 h-12 rounded-[4px] text-white font-bold shadow-sm flex items-center justify-center overflow-hidden transition-all",
                            isSuspended ? "bg-green-600 hover:bg-green-700 shadow-green-200" : "bg-[#E74C3C] hover:bg-[#C0392B] shadow-red-200"
                        )}
                    >
                        {isActionLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                        ) : (
                            <>
                                {isSuspended ? <CheckCircle className="w-4 h-4 mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
                                <span>{isSuspended ? "Activate User" : "Suspend User"}</span>
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

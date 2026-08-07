"use client";

import { useState, useEffect } from "react";
import { binService } from "@/services/bin.service";
import { userService, UserRecord } from "@/services/user.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Cpu, CheckCircle2, AlertCircle, RefreshCw, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CreateBinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateBinModal({ isOpen, onClose, onSuccess }: CreateBinModalProps) {
    const { toast } = useToast();
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [deviceId, setDeviceId] = useState<string>("");
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Default 3 bin types pre-selected (Landfill/General, Recycle, Compost/Organic)
    const [selectedWasteTypes, setSelectedWasteTypes] = useState<Record<string, boolean>>({
        GENERAL: true,      // Landfill
        RECYCLABLE: true,   // Recycle
        ORGANIC: true,      // Compost
        EWASTE: false,      // Optional E-Waste
        HAZARDOUS: false,   // Optional Hazardous
        LANDFILL: false,    // Optional Landfill
    });

    useEffect(() => {
        if (isOpen) {
            loadUsers();
        }
    }, [isOpen]);

    const loadUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const data = await userService.getUsers();
            setUsers(data);
            if (data.length > 0) {
                // Pre-select user 7f6378df-871f-4569-aef2-c43ea0a1ca77 if present, else first user
                const target = data.find(u => u.rawId === '7f6378df-871f-4569-aef2-c43ea0a1ca77' || u.id === '7f6378df-871f-4569-aef2-c43ea0a1ca77') || data[0];
                setSelectedUserId(target.rawId || target.id);
            }
        } catch (e) {
            console.error("Failed to load users:", e);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const toggleWasteType = (typeKey: string) => {
        setSelectedWasteTypes(prev => ({
            ...prev,
            [typeKey]: !prev[typeKey]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) {
            toast({ title: "Error", description: "Please select a customer.", variant: "destructive" });
            return;
        }

        const activeWasteTypes = Object.keys(selectedWasteTypes).filter(k => selectedWasteTypes[k]);
        if (activeWasteTypes.length === 0) {
            toast({ title: "Error", description: "Please select at least one waste bin type.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await binService.createBin({
                userId: selectedUserId,
                wasteTypes: activeWasteTypes,
                deviceId: deviceId.trim() || undefined,
            });

            if (res.success) {
                toast({ title: "Success", description: res.message || "Smart bins created successfully!" });
                onSuccess();
                onClose();
            } else {
                toast({ title: "Error", description: res.message || "Failed to create smart bins.", variant: "destructive" });
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[540px] bg-white p-6 rounded-[12px] font-sans">
                <DialogHeader className="border-b border-gray-100 pb-4">
                    <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-emerald-600" />
                        Provision Smart Bins for Customer
                    </DialogTitle>
                    <p className="text-xs text-gray-500 mt-1">
                        Select customer, configure default 3 bins (Landfill, Recycle, Compost) or customize, and optionally pair IoT sensor.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    {/* Customer Selection */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-700">Customer Account</Label>
                        {isLoadingUsers ? (
                            <div className="flex items-center text-xs text-gray-500 py-2">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2 text-emerald-600" />
                                Loading customer list...
                            </div>
                        ) : (
                            <select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="w-full h-10 px-3 border border-gray-300 rounded-[6px] text-xs font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                {users.map(u => (
                                    <option key={u.id} value={u.rawId || u.id}>
                                        {u.name} ({u.email || u.phone}) — {u.location}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Bin Options Selection */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold text-gray-700">Bin Type Choices</Label>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                                Default: Landfill, Recycle & Compost
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 bg-gray-50 p-3 rounded-[8px] border border-gray-200">
                            {/* General / Landfill */}
                            <label className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 cursor-pointer hover:border-emerald-300 transition-all">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={selectedWasteTypes.GENERAL}
                                        onCheckedChange={() => toggleWasteType("GENERAL")}
                                    />
                                    <div className="text-xs font-bold text-gray-800">Landfill (General Waste)</div>
                                </div>
                                <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Standard Default</span>
                            </label>

                            {/* Recyclable */}
                            <label className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 cursor-pointer hover:border-emerald-300 transition-all">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={selectedWasteTypes.RECYCLABLE}
                                        onCheckedChange={() => toggleWasteType("RECYCLABLE")}
                                    />
                                    <div className="text-xs font-bold text-gray-800">Recycle (Plastics, Paper, Metals)</div>
                                </div>
                                <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Standard Default</span>
                            </label>

                            {/* Organic / Compost */}
                            <label className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 cursor-pointer hover:border-emerald-300 transition-all">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={selectedWasteTypes.ORGANIC}
                                        onCheckedChange={() => toggleWasteType("ORGANIC")}
                                    />
                                    <div className="text-xs font-bold text-gray-800">Compost (Organic Waste)</div>
                                </div>
                                <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Standard Default</span>
                            </label>

                            {/* Additional Optional Bins */}
                            <div className="pt-2 border-t border-gray-200 space-y-2">
                                <span className="text-[11px] font-bold text-gray-700 block">Additional Optional Bins</span>
                                
                                <label className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 cursor-pointer hover:border-blue-300 transition-all">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={selectedWasteTypes.EWASTE}
                                            onCheckedChange={() => toggleWasteType("EWASTE")}
                                        />
                                        <div className="text-xs font-bold text-blue-900">E-Waste (Electronics & Batteries)</div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Optional Add-on</span>
                                </label>

                                <label className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 cursor-pointer hover:border-amber-300 transition-all">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={selectedWasteTypes.LANDFILL}
                                            onCheckedChange={() => toggleWasteType("LANDFILL")}
                                        />
                                        <div className="text-xs font-bold text-amber-900">Landfill Direct Waste</div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Optional Add-on</span>
                                </label>

                                <label className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 cursor-pointer hover:border-rose-300 transition-all">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={selectedWasteTypes.HAZARDOUS}
                                            onCheckedChange={() => toggleWasteType("HAZARDOUS")}
                                        />
                                        <div className="text-xs font-bold text-rose-900">Hazardous Waste</div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">Optional Add-on</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Optional IoT Sensor Pairing */}
                    <div className="space-y-1.5 bg-blue-50/50 p-3 rounded-[8px] border border-blue-100">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900">
                            <Cpu className="w-4 h-4 text-blue-600" />
                            <span>Pair Physical IoT Sensor EUI (Optional)</span>
                        </div>
                        <Input
                            placeholder="e.g. 5303dadc-d24c-41f7-b284-1cb21a8c48c3"
                            value={deviceId}
                            onChange={(e) => setDeviceId(e.target.value)}
                            className="h-9 text-xs bg-white"
                        />
                        <p className="text-[10px] text-blue-700">
                            Allowed by Admin, Operations Manager, and IoT Supervisor roles.
                        </p>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="h-9 text-xs font-bold text-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-9 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-5"
                        >
                            {isSubmitting ? (
                                <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                    Provisioning...
                                </>
                            ) : (
                                "Provision Smart Bins"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

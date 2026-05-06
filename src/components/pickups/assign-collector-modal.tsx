"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { collectorService, CollectorRecord } from "@/services/collector.service";
import { User, Truck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignCollectorModalProps {
    pickupId: string | null;
    pickupRef?: string | null;
    isOpen: boolean;
    onClose: () => void;
    onAssign: (collectorId: string) => void;
}

export function AssignCollectorModal({ pickupId, pickupRef, isOpen, onClose, onAssign }: AssignCollectorModalProps) {
    const [collectors, setCollectors] = useState<CollectorRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            async function loadCollectors() {
                setIsLoading(true);
                try {
                    const data = await collectorService.getCollectors();
                    // Filter for available collectors if needed
                    setCollectors(data);
                } catch (error) {
                    console.error("Failed to load collectors:", error);
                } finally {
                    setIsLoading(false);
                }
            }
            loadCollectors();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white p-0 overflow-hidden rounded-xl border-none shadow-2xl font-sans">
                <DialogHeader className="p-6 bg-[#F8F9FA] border-b border-gray-100">
                    <DialogTitle className="text-xl font-bold text-[#1A1A1A]">Assign Collector</DialogTitle>
                    <p className="text-xs font-semibold text-[#636E72] mt-1 uppercase tracking-wider">Pickup Reference: {pickupRef || pickupId}</p>
                </DialogHeader>

                <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center space-y-4">
                            <div className="w-6 h-6 border-2 border-primary-green border-t-transparent animate-spin" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Finding available collectors...</p>
                        </div>
                    ) : collectors.length === 0 ? (
                        <div className="py-8 text-center text-gray-500 font-medium">No available collectors found.</div>
                    ) : (
                        collectors.map((collector) => (
                            <div 
                                key={collector.id}
                                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-primary-green/30 hover:bg-green-50/30 transition-all cursor-pointer group"
                                onClick={() => onAssign(collector.id)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary-green/10 transition-colors">
                                        <User className="w-5 h-5 text-gray-400 group-hover:text-primary-green" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-[#2D3436]">{collector.name}</h4>
                                            <span className={cn(
                                                "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ml-2",
                                                collector.status === 'Available' ? "bg-green-100 text-green-700" : 
                                                collector.status === 'On Route' ? "bg-blue-100 text-blue-700" : 
                                                "bg-gray-100 text-gray-500"
                                            )}>
                                                {collector.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-[11px] font-semibold text-gray-400">
                                            <div className="flex items-center">
                                                <Truck className="w-3 h-3 mr-1" />
                                                {collector.vehicle}
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {collector.zone}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    size="sm" 
                                    className="h-8 px-3 bg-white border border-gray-200 text-[#2D3436] font-bold text-[11px] hover:bg-primary-green hover:text-white hover:border-primary-green transition-all shadow-none"
                                >
                                    Select
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-gray-50 flex justify-end space-x-3">
                    <Button variant="ghost" onClick={onClose} className="font-bold text-gray-500 hover:text-gray-700">Cancel</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { BinRecord } from "@/services/bin.service";
import { Navigation, RefreshCw, AlertTriangle, CheckCircle2, MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Dynamically import Leaflet map to disable Server-Side Rendering (SSR)
const LeafletMapInner = dynamic(() => import("./leaflet-map-inner"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 font-sans text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-[#166534] mb-2" />
            <span>Loading OpenStreetMap engine...</span>
        </div>
    )
});

interface BinMapProps {
    bins: BinRecord[];
    onSelectBin?: (bin: BinRecord) => void;
}

export function BinMap({ bins, onSelectBin }: BinMapProps) {
    const [selectedBinId, setSelectedBinId] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'NORMAL'>('ALL');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Map each bin with actual coordinates & actual user address from DB
    const mappedBins = useMemo(() => {
        return bins.map((bin) => {
            const fillLevel = bin.fillLevel;
            let statusColor = "bg-emerald-500 text-emerald-500 border-emerald-300";
            let statusBadge = "Normal";
            if (fillLevel >= 90) {
                statusColor = "bg-red-500 text-red-500 border-red-300 animate-pulse";
                statusBadge = "Critical";
            } else if (fillLevel >= 75) {
                statusColor = "bg-amber-500 text-amber-500 border-amber-300";
                statusBadge = "Full";
            } else if (fillLevel >= 60) {
                statusColor = "bg-yellow-500 text-yellow-500 border-yellow-300";
                statusBadge = "Nearly Full";
            }

            const hasGps = bin.latitude != null && bin.longitude != null && !isNaN(Number(bin.latitude)) && !isNaN(Number(bin.longitude));

            return {
                ...bin,
                hasGps,
                lat: hasGps ? Number(bin.latitude) : 0,
                lng: hasGps ? Number(bin.longitude) : 0,
                fullAddress: bin.user.address || "Address Pending",
                statusColor,
                statusBadge
            };
        });
    }, [bins]);

    const filteredBins = useMemo(() => {
        if (activeFilter === 'CRITICAL') {
            return mappedBins.filter(b => b.fillLevel >= 75);
        }
        if (activeFilter === 'NORMAL') {
            return mappedBins.filter(b => b.fillLevel < 75);
        }
        return mappedBins;
    }, [mappedBins, activeFilter]);

    const binsWithoutGpsCount = useMemo(() => mappedBins.filter(b => !b.hasGps).length, [mappedBins]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 600);
    };

    return (
        <div className="w-full bg-white border border-gray-100 rounded-[12px] shadow-sm overflow-hidden flex flex-col font-sans">
            {/* Header Toolbar */}
            <div className="p-4 bg-[#F8FAFB] border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-[6px] bg-[#DCFCE7] flex items-center justify-center text-[#166534]">
                        <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-[14px] font-bold text-[#1A1A1A]">OpenStreetMap Telemetry & Location Map</h3>
                        <p className="text-[11px] text-[#636E72]">
                            Displaying {filteredBins.length} smart bins {binsWithoutGpsCount > 0 ? `(${binsWithoutGpsCount} address pending GPS coords)` : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Status Filter Buttons */}
                    <div className="bg-white border border-gray-200 rounded-[6px] p-1 flex items-center space-x-1">
                        <button
                            onClick={() => setActiveFilter('ALL')}
                            className={cn(
                                "px-2.5 py-1 rounded-[4px] text-[11px] font-bold transition-all",
                                activeFilter === 'ALL' ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            All ({mappedBins.length})
                        </button>
                        <button
                            onClick={() => setActiveFilter('CRITICAL')}
                            className={cn(
                                "px-2.5 py-1 rounded-[4px] text-[11px] font-bold transition-all flex items-center gap-1",
                                activeFilter === 'CRITICAL' ? "bg-red-600 text-white" : "text-red-600 hover:bg-red-50"
                            )}
                        >
                            <AlertTriangle className="w-3 h-3" />
                            Critical ({mappedBins.filter(b => b.fillLevel >= 75).length})
                        </button>
                        <button
                            onClick={() => setActiveFilter('NORMAL')}
                            className={cn(
                                "px-2.5 py-1 rounded-[4px] text-[11px] font-bold transition-all flex items-center gap-1",
                                activeFilter === 'NORMAL' ? "bg-emerald-600 text-white" : "text-emerald-600 hover:bg-emerald-50"
                            )}
                        >
                            <CheckCircle2 className="w-3 h-3" />
                            Normal ({mappedBins.filter(b => b.fillLevel < 75).length})
                        </button>
                    </div>

                    {/* Re-center / Refresh */}
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        size="sm"
                        className="h-8 border-gray-200 text-gray-700 text-[11px] font-bold px-3 rounded-[6px]"
                    >
                        <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isRefreshing && "animate-spin")} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Interactive Leaflet Map Area */}
            <div className="relative w-full h-[450px] bg-[#E5E9EC] overflow-hidden">
                {mappedBins.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-6 z-30">
                        <MapPinOff className="w-10 h-10 text-gray-400 mb-2" />
                        <h4 className="text-sm font-bold text-gray-700">No Smart Bins Available</h4>
                        <p className="text-xs text-gray-500 mt-1">There are currently no registered smart bins to map.</p>
                    </div>
                ) : (
                    <LeafletMapInner
                        bins={filteredBins}
                        selectedBinId={selectedBinId}
                        onSelectBin={(bin) => {
                            setSelectedBinId(bin.id);
                            if (onSelectBin) onSelectBin(bin);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

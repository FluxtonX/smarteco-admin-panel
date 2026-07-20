"use client";

import { useState, useMemo } from "react";
import { BinRecord } from "@/services/bin.service";
import { MapPin, Navigation, RefreshCw, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BinMapProps {
    bins: BinRecord[];
    onSelectBin?: (bin: BinRecord) => void;
    onToggleDataSource?: (useMock: boolean) => void;
    isUsingMockData?: boolean;
}

// Sample coordinates across Kigali City districts for bin pins
const KIGALI_LOCATIONS = [
    { name: "Kigali City Center (Nyarugenge)", lat: -1.9441, lng: 30.0619, address: "KN 4 Ave, Nyarugenge" },
    { name: "Kacyiru Government Quarter", lat: -1.9350, lng: 30.0820, address: "KG 7 Ave, Kacyiru" },
    { name: "Remera Heights Hub", lat: -1.9580, lng: 30.1120, address: "KG 11 Ave, Remera" },
    { name: "Kimironko Market Area", lat: -1.9470, lng: 30.1280, address: "KG 17 Ave, Kimironko" },
    { name: "Gikondo Commercial Zone", lat: -1.9680, lng: 30.0750, address: "KK 6 Ave, Gikondo" },
    { name: "Nyamirambo Eco District", lat: -1.9720, lng: 30.0450, address: "KN 20 Ave, Nyamirambo" },
    { name: "Kicukiro Center Hub", lat: -1.9810, lng: 30.1010, address: "KK 15 Rd, Kicukiro" },
    { name: "Kigali Heights Commercial", lat: -1.9525, lng: 30.0932, address: "KG 7 Ave, Kacyiru" }
];

export function BinMap({ bins, onSelectBin, onToggleDataSource, isUsingMockData = false }: BinMapProps) {
    const [selectedBinId, setSelectedBinId] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'NORMAL'>('ALL');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Map each bin to Kigali coordinates deterministically
    const mappedBins = useMemo(() => {
        return bins.map((bin, index) => {
            const loc = KIGALI_LOCATIONS[index % KIGALI_LOCATIONS.length];
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

            return {
                ...bin,
                lat: loc.lat,
                lng: loc.lng,
                district: loc.name,
                fullAddress: bin.user.address !== "User Address" ? bin.user.address : loc.address,
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

    const selectedBin = mappedBins.find(b => b.id === selectedBinId) || mappedBins[0];

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 600);
    };

    return (
        <div className="w-full bg-white border border-gray-100 rounded-[12px] shadow-sm overflow-hidden flex flex-col">
            {/* Header Toolbar */}
            <div className="p-4 bg-[#F8FAFB] border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-[6px] bg-[#DCFCE7] flex items-center justify-center text-[#166534]">
                        <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-[14px] font-bold text-[#1A1A1A]">Kigali City Smart Bin Map</h3>
                        <p className="text-[11px] text-[#636E72]">
                            Displaying {filteredBins.length} monitored IoT bins across Kigali City Hub
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

                    {/* Data Source Toggle */}
                    {onToggleDataSource && (
                        <button
                            onClick={() => onToggleDataSource(!isUsingMockData)}
                            className={cn(
                                "px-3 py-1.5 rounded-[6px] text-[11px] font-bold border flex items-center space-x-1.5 transition-all shadow-sm",
                                isUsingMockData
                                    ? "bg-amber-50 border-amber-200 text-amber-800"
                                    : "bg-[#DCFCE7] border-[#166534]/20 text-[#166534]"
                            )}
                        >
                            <Zap className="w-3.5 h-3.5" />
                            <span>{isUsingMockData ? "Mock Mode" : "Live API"}</span>
                        </button>
                    )}

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

            {/* Interactive Visual Canvas Map Area */}
            <div className="relative w-full h-[400px] bg-[#E5E9EC] overflow-hidden group">
                {/* Simulated Street Map Vector Grid */}
                <div
                    className="absolute inset-0 bg-[#EBF0F3] opacity-90"
                    style={{
                        backgroundImage: `
                            radial-gradient(#CBD5E1 1.5px, transparent 1.5px),
                            linear-gradient(to right, rgba(203, 213, 225, 0.3) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(203, 213, 225, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px, 120px 120px, 120px 120px'
                    }}
                />

                {/* Kigali Roads & Water Features Decorative Vector Overlays */}
                <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M -50 350 C 200 300, 400 200, 800 150 C 1000 120, 1200 50, 1400 0" fill="none" stroke="#FFFFFF" strokeWidth="16" />
                    <path d="M -50 350 C 200 300, 400 200, 800 150 C 1000 120, 1200 50, 1400 0" fill="none" stroke="#CBD5E1" strokeWidth="8" />

                    <path d="M 100 -50 C 150 200, 350 450, 700 400 C 1100 350, 1200 600, 1400 600" fill="none" stroke="#FFFFFF" strokeWidth="12" />
                    <path d="M 100 -50 C 150 200, 350 450, 700 400 C 1100 350, 1200 600, 1400 600" fill="none" stroke="#94A3B8" strokeWidth="5" strokeDasharray="10 5" />

                    <path d="M 0 100 Q 300 180 500 380 T 1100 500" fill="none" stroke="#38BDF8" strokeWidth="6" opacity="0.6" />
                </svg>

                {/* Map Pins Grid Layer */}
                <div className="absolute inset-0 p-8 flex items-center justify-center">
                    <div className="relative w-full h-full max-w-[1000px] max-h-[350px]">
                        {filteredBins.map((bin, i) => {
                            const positions = [
                                { top: '25%', left: '22%' },
                                { top: '18%', left: '48%' },
                                { top: '55%', left: '72%' },
                                { top: '35%', left: '84%' },
                                { top: '72%', left: '42%' },
                                { top: '80%', left: '18%' },
                                { top: '65%', left: '60%' },
                                { top: '40%', left: '38%' },
                            ];
                            const pos = positions[i % positions.length];
                            const isSelected = selectedBinId === bin.id;

                            return (
                                <div
                                    key={bin.id}
                                    style={{ top: pos.top, left: pos.left }}
                                    onClick={() => {
                                        setSelectedBinId(bin.id);
                                        if (onSelectBin) onSelectBin(bin);
                                    }}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin z-10 hover:z-30 transition-all duration-300"
                                >
                                    {(bin.fillLevel >= 80 || isSelected) && (
                                        <span className={cn(
                                            "absolute -inset-2 rounded-full opacity-75 animate-ping",
                                            bin.fillLevel >= 90 ? "bg-red-400" : bin.fillLevel >= 75 ? "bg-amber-400" : "bg-emerald-400"
                                        )} />
                                    )}

                                    <div className={cn(
                                        "relative flex items-center justify-center p-2 rounded-full border-2 shadow-lg transition-transform duration-300 transform group-hover/pin:scale-125",
                                        isSelected ? "scale-125 ring-4 ring-offset-2 ring-[#166534] bg-white" : "bg-white",
                                        bin.fillLevel >= 90 ? "border-red-500 text-red-600" :
                                        bin.fillLevel >= 75 ? "border-amber-500 text-amber-600" : "border-emerald-500 text-emerald-600"
                                    )}>
                                        <MapPin className="w-5 h-5 fill-current" />

                                        <span className={cn(
                                            "absolute -top-2 -right-2 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full text-white shadow-sm",
                                            bin.fillLevel >= 90 ? "bg-red-600" : bin.fillLevel >= 75 ? "bg-amber-600" : "bg-emerald-600"
                                        )}>
                                            {bin.fillLevel}%
                                        </span>
                                    </div>

                                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover/pin:flex flex-col bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-[6px] shadow-xl whitespace-nowrap z-50">
                                        <span className="font-bold">{bin.id} ({bin.type})</span>
                                        <span className="text-gray-300">{bin.user.name} • {bin.fillLevel}% Full</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Glassmorphism Info Overlay Card (Selected Bin) */}
                {selectedBin && (
                    <div className="absolute top-4 left-4 max-w-[280px] bg-white/95 backdrop-blur-md p-4 rounded-[10px] border border-gray-100 shadow-xl z-20 transition-all">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bin Location</span>
                            <span className={cn(
                                "text-[10px] font-extrabold px-2 py-0.5 rounded-[4px] uppercase",
                                selectedBin.fillLevel >= 90 ? "bg-red-100 text-red-700" :
                                selectedBin.fillLevel >= 75 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                            )}>
                                {selectedBin.fillLevel}% {selectedBin.statusBadge}
                            </span>
                        </div>

                        <div className="mt-3 space-y-1.5">
                            <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight">{selectedBin.id}</h4>
                            <p className="text-[11px] font-medium text-gray-600">{selectedBin.user.name}</p>
                            <p className="text-[10px] text-gray-400">{selectedBin.fullAddress}</p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                            <span className="text-gray-500 font-medium">Waste Type: <strong className="text-gray-800">{selectedBin.type}</strong></span>
                            {onSelectBin && (
                                <button
                                    onClick={() => onSelectBin(selectedBin)}
                                    className="text-[#166534] font-bold hover:underline"
                                >
                                    Details →
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="absolute bottom-4 right-4 flex items-center space-x-2 z-20">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-[6px] border border-gray-200 shadow-sm text-[10px] font-bold text-gray-700">
                        Map Center: Kigali, Rwanda
                    </div>
                </div>
            </div>
        </div>
    );
}

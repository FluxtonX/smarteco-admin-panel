"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { BinRecord } from "@/services/bin.service";
import { AlertTriangle, CheckCircle2, MapPin } from "lucide-react";

interface LeafletMapInnerProps {
    bins: (BinRecord & { hasGps: boolean; lat: number; lng: number; fullAddress: string; statusBadge: string })[];
    selectedBinId: string | null;
    onSelectBin?: (bin: BinRecord) => void;
}

// Helper component to auto-fit map view to fit all markers
function MapBoundsFitter({ bins }: { bins: { lat: number; lng: number; hasGps: boolean }[] }) {
    const map = useMap();

    useEffect(() => {
        const gpsBins = bins.filter(b => b.hasGps);
        if (gpsBins.length > 0) {
            const bounds = L.latLngBounds(gpsBins.map(b => [b.lat, b.lng]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }, [bins, map]);

    return null;
}

function createCustomIcon(fillLevel: number, isSelected: boolean) {
    let strokeColor = "#10b981"; // Normal green
    let badgeBg = "#166534";
    if (fillLevel >= 90) {
        strokeColor = "#ef4444"; // Critical red
        badgeBg = "#dc2626";
    } else if (fillLevel >= 75) {
        strokeColor = "#f59e0b"; // Amber
        badgeBg = "#d97706";
    } else if (fillLevel >= 60) {
        strokeColor = "#eab308"; // Yellow
        badgeBg = "#ca8a04";
    }

    const shadowRing = isSelected ? `box-shadow: 0 0 0 4px #166534; transform: scale(1.15);` : '';

    const html = `
        <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; background: white; border-radius: 9999px; border: 3px solid ${strokeColor}; ${shadowRing} transition: all 0.2s ease-in-out;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
            <span style="position: absolute; top: -6px; right: -6px; background-color: ${badgeBg}; color: white; font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 9999px; box-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                ${fillLevel}%
            </span>
        </div>
    `;

    return L.divIcon({
        html,
        className: "",
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -19]
    });
}

export default function LeafletMapInner({ bins, selectedBinId, onSelectBin }: LeafletMapInnerProps) {
    const binsWithGps = bins.filter(b => b.hasGps);
    
    // Default center (Kigali, Rwanda default or first bin)
    const defaultCenter: [number, number] = binsWithGps.length > 0 
        ? [binsWithGps[0].lat, binsWithGps[0].lng]
        : [-1.9441, 30.0619];

    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            scrollWheelZoom={true}
            className="w-full h-full z-10"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapBoundsFitter bins={binsWithGps} />

            {binsWithGps.map((bin) => (
                <Marker
                    key={bin.id}
                    position={[bin.lat, bin.lng]}
                    icon={createCustomIcon(bin.fillLevel, selectedBinId === bin.id)}
                    eventHandlers={{
                        click: () => {
                            if (onSelectBin) onSelectBin(bin);
                        }
                    }}
                >
                    <Popup className="leaflet-custom-popup">
                        <div className="p-1 min-w-[200px] font-sans">
                            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-2">
                                <span className="text-[11px] font-bold text-gray-900">{bin.id}</span>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${
                                    bin.fillLevel >= 90 ? 'bg-red-600' :
                                    bin.fillLevel >= 75 ? 'bg-amber-600' : 'bg-emerald-600'
                                }`}>
                                    {bin.fillLevel}% {bin.statusBadge}
                                </span>
                            </div>
                            <div className="space-y-1 text-[11px] text-gray-600">
                                <p className="font-semibold text-gray-800">{bin.user.name}</p>
                                <p className="text-gray-500 text-[10px]">{bin.fullAddress}</p>
                                <p className="text-gray-500 text-[10px] pt-1">Type: <strong className="text-gray-700">{bin.type}</strong></p>
                            </div>
                            {onSelectBin && (
                                <button
                                    onClick={() => onSelectBin(bin)}
                                    className="mt-3 w-full py-1 bg-emerald-700 text-white rounded text-[11px] font-bold hover:bg-emerald-800 transition-all text-center block"
                                >
                                    View Bin Details →
                                </button>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

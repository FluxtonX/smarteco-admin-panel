"use client";

import { apiGet, apiPost } from "@/lib/api-client";

// ─── Frontend Display Interfaces ─────────────────────────────

export interface BinRecord {
    id: string;
    user: {
        name: string;
        address: string;
    };
    type: 'Organic' | 'Recyclable' | 'General' | 'E-Waste' | 'Glass' | 'Hazardous' | 'Landfill';
    fillLevel: number;
    lastEmptied: string;
    alertStatus: 'Critical' | 'Full' | 'Nearly Full' | 'Normal';
    collector: string;
    latitude?: number | null;
    longitude?: number | null;
    hasSensor?: boolean;
    deviceId?: string | null;
    distanceMm?: number | null;
    temperature?: number | null;
    position?: 'Upright' | 'Tilted' | null;
    rawWasteType?: string;
    history: { time: string; level: number }[];
}

export interface CollectorOption {
    id: string;
    name: string;
    vehiclePlate: string;
    zone: string;
    isAvailable: boolean;
}

export interface BinStats {
    total: number;
    alerts: number;
    active: number;
    maintenance: number;
}

export interface AssignmentRecord {
    binId: string;
    collector: string;
    assignedAt: string;
    status: 'In Progress' | 'Completed' | 'Pending';
    reference?: string;
    address?: string;
    notes?: string;
    scheduledDate?: string;
    timeSlot?: string;
}

interface ReportBinDto {
    issueType: string;
    description?: string;
}

interface UpdateFillLevelDto {
    fillLevel: number;
}

interface ScanBinDto {
    qrCode: string;
    latitude: number;
    longitude: number;
}

interface GenericResponse {
    success: boolean;
    message?: string;
    data?: any;
}

function mapWasteType(wType: string): BinRecord['type'] {
    switch (wType) {
        case 'ORGANIC': return 'Organic';
        case 'RECYCLABLE': return 'Recyclable';
        case 'GENERAL': return 'General';
        case 'EWASTE': return 'E-Waste';
        case 'GLASS': return 'Glass';
        case 'HAZARDOUS': return 'Hazardous';
        case 'LANDFILL': return 'Landfill';
        default: return 'General';
    }
}

function calculateAlertStatus(fillLevel: number): BinRecord['alertStatus'] {
    if (fillLevel >= 95) return 'Critical';
    if (fillLevel >= 80) return 'Full';
    if (fillLevel >= 60) return 'Nearly Full';
    return 'Normal';
}

export const binService = {
    getBins: async (): Promise<BinRecord[]> => {
        try {
            const res = await apiGet<{ success: boolean; data: any[] }>('/admin/bins');
            if (res.success && res.data && Array.isArray(res.data)) {
                return res.data.map(bb => {
                    const lat = bb.latitude ?? bb.user?.homeLatitude ?? null;
                    const lng = bb.longitude ?? bb.user?.homeLongitude ?? null;
                    const rawAddress = bb.user?.defaultAddress || bb.user?.address || bb.address;
                    const address = rawAddress
                        ? rawAddress
                        : (lat != null && lng != null && !isNaN(Number(lat)) && !isNaN(Number(lng))
                            ? `GPS Coords: ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`
                            : 'Address Pending');

                    const pickupCollector = bb.pickups?.[0]?.collector;
                    const collectorName = pickupCollector
                        ? (pickupCollector.user 
                            ? `${pickupCollector.user.firstName || ''} ${pickupCollector.user.lastName || ''}`.trim()
                            : pickupCollector.name || pickupCollector.collectorName || "Assigned Collector")
                        : "Unassigned";

                    return {
                        id: bb.qrCode || bb.id,
                        user: {
                            name: `${bb.user?.firstName || ''} ${bb.user?.lastName || ''}`.trim() || 'Resident',
                            address
                        },
                        type: mapWasteType(bb.wasteType),
                        rawWasteType: bb.wasteType,
                        fillLevel: bb.fillLevel || 0,
                        lastEmptied: bb.lastEmptied ? new Date(bb.lastEmptied).toISOString().split('T')[0] : 'N/A',
                        alertStatus: calculateAlertStatus(bb.fillLevel || 0),
                        collector: collectorName,
                        latitude: lat,
                        longitude: lng,
                        hasSensor: bb.hasSensor ?? !!bb.iotDevice,
                        deviceId: bb.deviceId ?? bb.iotDevice?.deviceId ?? null,
                        distanceMm: bb.distanceMm ?? null,
                        temperature: bb.temperature ?? null,
                        position: bb.position ?? null,
                        history: bb.telemetry && bb.telemetry.length > 0
                            ? bb.telemetry.map((t: any) => ({
                                time: new Date(t.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                level: t.fillLevel ?? 0
                              }))
                            : [
                                { time: "00:00", level: Math.max(0, (bb.fillLevel || 0) - 30) },
                                { time: "06:00", level: Math.max(0, (bb.fillLevel || 0) - 15) },
                                { time: "12:00", level: Math.max(0, (bb.fillLevel || 0) - 5) },
                                { time: "18:00", level: bb.fillLevel || 0 },
                                { time: "24:00", level: bb.fillLevel || 0 }
                            ]
                    };
                });
            }
        } catch (e) {
            console.warn("Backend API /admin/bins unreached:", e);
        }
        return [];
    },

    getCollectors: async (): Promise<CollectorOption[]> => {
        try {
            const res = await apiGet<{ success: boolean; data: any[] }>('/admin/collectors');
            if (res.success && Array.isArray(res.data)) {
                return res.data.map(c => ({
                    id: c.id,
                    name: `${c.user?.firstName || ''} ${c.user?.lastName || ''}`.trim() || c.collectorName || 'Collector',
                    vehiclePlate: c.vehiclePlate || 'N/A',
                    zone: c.zone || 'Kigali',
                    isAvailable: c.isAvailable !== false
                }));
            }
        } catch (e) {
            console.warn("Failed to fetch collectors from API:", e);
        }
        return [];
    },

    getBin: async (id: string): Promise<BinRecord | null> => {
        try {
            const res = await apiGet<any>(`/bins/${id}`);
            if (res.data) {
                return {
                    id: res.data.qrCode || res.data.id,
                    user: { name: `${res.data.user?.firstName || ''} ${res.data.user?.lastName || ''}`.trim() || "Resident", address: res.data.user?.defaultAddress || "Address Pending" },
                    type: mapWasteType(res.data.wasteType),
                    fillLevel: res.data.fillLevel || 0,
                    lastEmptied: res.data.lastEmptied ? new Date(res.data.lastEmptied).toISOString().split('T')[0] : 'N/A',
                    alertStatus: calculateAlertStatus(res.data.fillLevel || 0),
                    collector: "Unassigned",
                    latitude: res.data.latitude ?? null,
                    longitude: res.data.longitude ?? null,
                    history: []
                };
            }
        } catch (e) {}
        return null;
    },

    getStats: async (): Promise<BinStats> => {
        const bins = await binService.getBins();
        return {
            total: bins.length,
            alerts: bins.filter(b => b.fillLevel >= 60).length,
            active: bins.filter(b => b.fillLevel < 60).length,
            maintenance: 0
        };
    },

    getAssignments: async (): Promise<AssignmentRecord[]> => {
        try {
            const res = await apiGet<{ success: boolean; data: any[] }>('/admin/pickups?limit=50');
            if (res.success && res.data && res.data.length > 0) {
                return res.data
                  .filter((pickup) => pickup.bin?.qrCode || pickup.reference)
                  .map((pickup) => {
                    const collectorName = pickup.collector?.name ||
                      (pickup.collector?.user 
                        ? `${pickup.collector.user.firstName || ''} ${pickup.collector.user.lastName || ''}`.trim()
                        : null);

                    return {
                      binId: pickup.bin?.qrCode || pickup.reference,
                      collector: collectorName || "Unassigned",
                      assignedAt: pickup.createdAt
                        ? new Date(pickup.createdAt).toISOString().slice(0, 16).replace('T', ' ')
                        : "",
                      status: pickup.status === "COMPLETED" ? "Completed" : pickup.collector ? "In Progress" : "Pending",
                      reference: pickup.reference,
                      address: pickup.address || pickup.bin?.user?.defaultAddress || "Kigali, Rwanda",
                      notes: pickup.notes || undefined,
                      scheduledDate: pickup.scheduledDate ? new Date(pickup.scheduledDate).toISOString().slice(0, 10) : undefined,
                      timeSlot: pickup.timeSlot || undefined
                    };
                  });
            }
        } catch (e) {
            console.warn("Failed to fetch pickup assignments:", e);
        }
        return [];
    },

    assignCollector: async (binId: string, collectorId: string): Promise<{ success: boolean; message?: string; collectorName?: string }> => {
        const res = await apiPost<{ success: boolean; message?: string; data?: any }>('/admin/bins/assign', { binId, collectorId });
        if (!res.success) {
            throw new Error(res.message || "Failed to assign collector to bin");
        }
        return {
            success: true,
            message: res.message,
            collectorName: res.data?.collectorName || 'Assigned Collector'
        };
    },

    reportBin: async (id: string, dto: ReportBinDto): Promise<GenericResponse> => {
        return apiPost<GenericResponse>(`/bins/${id}/report`, dto);
    },

    updateFillLevel: async (id: string, dto: UpdateFillLevelDto): Promise<GenericResponse> => {
        return apiPost<GenericResponse>(`/bins/${id}/fill-level`, dto);
    },

    scanBin: async (dto: ScanBinDto): Promise<GenericResponse> => {
        return apiPost<GenericResponse>('/bins/scan', dto);
    },

    createBin: async (payload: { userId: string; wasteTypes?: string[]; deviceId?: string; latitude?: number; longitude?: number }): Promise<GenericResponse> => {
        return apiPost<GenericResponse>('/admin/bins', payload);
    }
};

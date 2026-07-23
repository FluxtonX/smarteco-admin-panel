"use client";

import { apiGet, apiPost } from "@/lib/api-client";

// ─── Frontend Display Interfaces ─────────────────────────────

export interface BinRecord {
    id: string;
    user: {
        name: string;
        address: string;
    };
    type: 'Organic' | 'Recyclable' | 'E-Waste' | 'Glass' | 'Hazardous';
    fillLevel: number;
    lastEmptied: string;
    alertStatus: 'Critical' | 'Full' | 'Nearly Full' | 'Normal';
    collector: string;
    history: { time: string; level: number }[];
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
        case 'EWASTE': return 'E-Waste';
        case 'GLASS': return 'Glass';
        case 'HAZARDOUS': return 'Hazardous';
        default: return 'Organic';
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
            if (res.success && res.data && res.data.length > 0) {
                return res.data.map(bb => ({
                    id: bb.qrCode || bb.id,
                    user: {
                        name: `${bb.user?.firstName || ''} ${bb.user?.lastName || ''}`.trim() || 'Resident',
                        address: bb.user?.defaultAddress || bb.user?.location || 'Kigali'
                    },
                    type: mapWasteType(bb.wasteType),
                    fillLevel: bb.fillLevel || 0,
                    lastEmptied: bb.lastEmptied ? new Date(bb.lastEmptied).toISOString().split('T')[0] : 'N/A',
                    alertStatus: calculateAlertStatus(bb.fillLevel || 0),
                    collector: bb.pickups?.[0]?.collector?.user 
                        ? `${bb.pickups[0].collector.user.firstName} ${bb.pickups[0].collector.user.lastName}`
                        : "Unassigned",
                    history: [
                        { time: "00:00", level: Math.max(0, (bb.fillLevel || 0) - 40) },
                        { time: "06:00", level: Math.max(0, (bb.fillLevel || 0) - 20) },
                        { time: "12:00", level: Math.max(0, (bb.fillLevel || 0) - 10) },
                        { time: "18:00", level: bb.fillLevel || 0 },
                        { time: "24:00", level: bb.fillLevel || 0 }
                    ]
                }));
            }
        } catch (e) {
            console.warn("Backend API /admin/bins unreached:", e);
        }
        return [];
    },

    getBin: async (id: string): Promise<BinRecord | null> => {
        try {
            const res = await apiGet<any>(`/bins/${id}`);
            if (res.data) {
                return {
                    id: res.data.qrCode || res.data.id,
                    user: { name: `${res.data.user?.firstName || ''} ${res.data.user?.lastName || ''}`.trim() || "Resident", address: res.data.user?.defaultAddress || "Kigali" },
                    type: mapWasteType(res.data.wasteType),
                    fillLevel: res.data.fillLevel || 0,
                    lastEmptied: res.data.lastEmptied ? new Date(res.data.lastEmptied).toISOString().split('T')[0] : 'N/A',
                    alertStatus: calculateAlertStatus(res.data.fillLevel || 0),
                    collector: "Unassigned",
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
            alerts: bins.filter(b => b.fillLevel >= 75).length,
            active: bins.filter(b => b.fillLevel < 75).length,
            maintenance: 0
        };
    },

    getAssignments: async (): Promise<AssignmentRecord[]> => {
        try {
            const res = await apiGet<{ success: boolean; data: any[] }>('/admin/pickups?limit=50');
            if (res.success && res.data && res.data.length > 0) {
                return res.data
                  .filter((pickup) => pickup.bin?.qrCode || pickup.reference)
                  .map((pickup) => ({
                    binId: pickup.bin?.qrCode || pickup.reference,
                    collector: pickup.collector ? `${pickup.collector.firstName || ''} ${pickup.collector.lastName || ''}`.trim() : "Unassigned",
                    assignedAt: pickup.createdAt
                      ? new Date(pickup.createdAt).toISOString().slice(0, 16).replace('T', ' ')
                      : "",
                    status: pickup.status === "COMPLETED" ? "Completed" : pickup.collector ? "In Progress" : "Pending"
                }));
            }
        } catch (e) {}
        return [];
    },

    assignCollector: async (binId: string, collectorId?: string): Promise<{ success: boolean; collector: string }> => {
        const res = await apiPost<{ success: boolean; message?: string }>('/admin/bins/assign', { binId, collectorId });
        if (!res.success) {
            throw new Error(res.message || "Failed to assign collector to bin");
        }
        return { success: true, collector: collectorId || "Assigned Collector" };
    },

    reportBin: async (id: string, dto: ReportBinDto): Promise<GenericResponse> => {
        return apiPost<GenericResponse>(`/bins/${id}/report`, dto);
    },

    updateFillLevel: async (id: string, dto: UpdateFillLevelDto): Promise<GenericResponse> => {
        return apiPost<GenericResponse>(`/bins/${id}/fill-level`, dto);
    },

    scanBin: async (dto: ScanBinDto): Promise<GenericResponse> => {
        return apiPost<GenericResponse>('/bins/scan', dto);
    }
};

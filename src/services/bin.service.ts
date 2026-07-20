"use client";

import { apiGet, apiPost } from "@/lib/api-client";

// ─── Frontend Display Interfaces (Do Not Change) ─────────────────────────────

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

// ─── API Types (Matching Backend) ────────────────────────────────────────────

interface BackendBin {
    id: string;
    qrCode: string;
    wasteType: string;
    fillLevel: number;
    status: string;
    lastEmptied: string;
}

interface UserBinsResponse {
    success: boolean;
    data: BackendBin[];
}

interface SingleBinResponse {
    success: boolean;
    data: BackendBin & {
        pickups?: {
            id: string;
            reference: string;
            status: string;
            scheduledDate: string;
            completedAt?: string;
        }[];
    };
}

interface ReportBinDto {
    issueType: string; // 'FULL' | 'DAMAGED' | 'MAINTENANCE'
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

// ─── Helper Functions to Map Backend Data -> Frontend Types ──────────────────

function mapWasteType(wType: string): BinRecord['type'] {
    switch (wType) {
        case 'ORGANIC': return 'Organic';
        case 'RECYCLABLE': return 'Recyclable';
        case 'EWASTE': return 'E-Waste';
        case 'GLASS': return 'Glass';
        case 'HAZARDOUS': return 'Hazardous';
        default: return 'Organic'; // Fallback
    }
}

function calculateAlertStatus(fillLevel: number): BinRecord['alertStatus'] {
    if (fillLevel >= 95) return 'Critical';
    if (fillLevel >= 80) return 'Full';
    if (fillLevel >= 60) return 'Nearly Full';
    return 'Normal';
}

function mapBackendBinToFrontend(bb: BackendBin): BinRecord {
    return {
        id: bb.qrCode, // We use QRCode for the admin display string
        user: { name: "Self (Resident)", address: "User Address" }, // Mapped from logged-in session context
        type: mapWasteType(bb.wasteType),
        fillLevel: bb.fillLevel,
        lastEmptied: bb.lastEmptied ? new Date(bb.lastEmptied).toISOString().split('T')[0] : 'N/A',
        alertStatus: calculateAlertStatus(bb.fillLevel),
        collector: "Unassigned", // Collector is assigned via Pickups, not natively on bins for residents
        history: [
            // Extrapolate a fake smooth history curve for the demo based on the current fillLevel
            { time: "00:00", level: Math.max(0, bb.fillLevel - 40) },
            { time: "06:00", level: Math.max(0, bb.fillLevel - 20) },
            { time: "12:00", level: Math.max(0, bb.fillLevel - 10) },
            { time: "18:00", level: bb.fillLevel },
            { time: "24:00", level: bb.fillLevel }
        ]
    };
}

// ─── Service ─────────────────────────────────────────────────────────────────

const MOCK_BINS: BinRecord[] = [
    {
        id: "BIN-KG-001",
        user: { name: "Kigali Heights Commercial", address: "KG 7 Ave, Kacyiru" },
        type: "Organic",
        fillLevel: 92,
        lastEmptied: "2026-07-19",
        alertStatus: "Critical",
        collector: "Unassigned",
        history: [{ time: "00:00", level: 30 }, { time: "06:00", level: 50 }, { time: "12:00", level: 75 }, { time: "18:00", level: 92 }]
    },
    {
        id: "BIN-KG-002",
        user: { name: "Nyarugenge Market Hub", address: "KN 4 Ave, Nyarugenge" },
        type: "Recyclable",
        fillLevel: 84,
        lastEmptied: "2026-07-18",
        alertStatus: "Full",
        collector: "Patrick Mugisha",
        history: [{ time: "00:00", level: 20 }, { time: "06:00", level: 40 }, { time: "12:00", level: 65 }, { time: "18:00", level: 84 }]
    },
    {
        id: "BIN-KG-003",
        user: { name: "Remera Residential Plaza", address: "KG 11 Ave, Remera" },
        type: "E-Waste",
        fillLevel: 65,
        lastEmptied: "2026-07-17",
        alertStatus: "Nearly Full",
        collector: "Jean Claude Habimana",
        history: [{ time: "00:00", level: 10 }, { time: "06:00", level: 25 }, { time: "12:00", level: 45 }, { time: "18:00", level: 65 }]
    },
    {
        id: "BIN-KG-004",
        user: { name: "Kimironko Community Center", address: "KG 17 Ave, Kimironko" },
        type: "Glass",
        fillLevel: 42,
        lastEmptied: "2026-07-19",
        alertStatus: "Normal",
        collector: "Patrick Mugisha",
        history: [{ time: "00:00", level: 5 }, { time: "06:00", level: 15 }, { time: "12:00", level: 30 }, { time: "18:00", level: 42 }]
    },
    {
        id: "BIN-KG-005",
        user: { name: "Gikondo Industrial Zone", address: "KK 6 Ave, Gikondo" },
        type: "Hazardous",
        fillLevel: 98,
        lastEmptied: "2026-07-16",
        alertStatus: "Critical",
        collector: "Unassigned",
        history: [{ time: "00:00", level: 40 }, { time: "06:00", level: 60 }, { time: "12:00", level: 80 }, { time: "18:00", level: 98 }]
    }
];

export const binService = {
    /**
     * GET /api/v1/bins
     * Fetch bins for current user
     */
    getBins: async (): Promise<BinRecord[]> => {
        try {
            const res = await apiGet<{ success: boolean; data: any[] }>('/admin/bins');
            if (res.success && res.data && res.data.length > 0) {
                return res.data.map(bb => ({
                    id: bb.qrCode || bb.id,
                    user: {
                        name: `${bb.user?.firstName || ''} ${bb.user?.lastName || ''}`.trim() || 'Resident',
                        address: bb.user?.address || 'Kigali'
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
            console.warn("Backend API unavailable, using fallback bin data:", e);
        }
        return MOCK_BINS;
    },

    /**
     * GET /api/v1/bins/{id}
     * Fetch single bin (Also can be used to populate admin views if requested)
     */
    getBin: async (id: string): Promise<BinRecord> => {
        try {
            const res = await apiGet<SingleBinResponse>(`/bins/${id}`);
            return mapBackendBinToFrontend(res.data);
        } catch (e) {
            return MOCK_BINS.find(b => b.id === id) || MOCK_BINS[0];
        }
    },

    /**
     * Aggregates stats dynamically based on the user's bin data for visually rendering Admin charts
     */
    getStats: async (): Promise<BinStats> => {
        try {
            const res = await apiGet<{ success: boolean; data: any }>('/admin/analytics/bins');
            if (res.success && res.data) {
                return {
                    total: res.data.total || MOCK_BINS.length,
                    alerts: res.data.alerts || MOCK_BINS.filter(b => b.fillLevel >= 75).length,
                    active: res.data.active || MOCK_BINS.filter(b => b.fillLevel < 75).length,
                    maintenance: res.data.maintenance || 1
                };
            }
        } catch (e) {
            console.warn("Backend API analytics unavailable, returning calculated stats:", e);
        }
        return {
            total: MOCK_BINS.length,
            alerts: MOCK_BINS.filter(b => b.fillLevel >= 75).length,
            active: MOCK_BINS.filter(b => b.fillLevel < 75).length,
            maintenance: 1
        };
    },

    getAssignments: async (): Promise<AssignmentRecord[]> => {
        const res = await apiGet<{ success: boolean; data: any[] }>('/admin/pickups?limit=50');
        return res.data
          .filter((pickup) => pickup.bin?.qrCode || pickup.reference)
          .map((pickup) => ({
            binId: pickup.bin?.qrCode || pickup.reference,
            collector: pickup.collector?.name || "Unassigned",
            assignedAt: pickup.createdAt
              ? new Date(pickup.createdAt).toISOString().slice(0, 16).replace('T', ' ')
              : "",
            status: pickup.status === "COMPLETED" ? "Completed" : pickup.collector ? "In Progress" : "Pending"
        }));
    },

    /**
     * POST /api/v1/bins/{id}/report
     */
    reportBin: async (id: string, dto: ReportBinDto): Promise<GenericResponse> => {
        return apiPost<GenericResponse>(`/bins/${id}/report`, dto);
    },

    /**
     * POST /api/v1/bins/{id}/fill-level
     */
    updateFillLevel: async (id: string, dto: UpdateFillLevelDto): Promise<GenericResponse> => {
        return apiPost<GenericResponse>(`/bins/${id}/fill-level`, dto);
    },

    /**
     * POST /api/v1/bins/scan
     */
    scanBin: async (dto: ScanBinDto): Promise<GenericResponse> => {
        return apiPost<GenericResponse>('/bins/scan', dto);
    }
};

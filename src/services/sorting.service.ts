import { apiGet } from "@/lib/api-client";

// ─── TYPES ────────────────────────────────────────

export interface SortingCategoryStat {
    category: string;
    count: number;
    avgConfidence: number;
}

export interface RecentSortingEvent {
    id: string;
    category: string;
    confidence: number;
    capturedAt: string;
    kioskName: string;
    kioskLocation: string | null;
    userName: string | null;
}

export interface SortingStats {
    totalEvents: number;
    totalPointsAwarded: number;
    kiosks: {
        total: number;
        active: number;
        inactive: number;
    };
    byCategory: SortingCategoryStat[];
    recentEvents: RecentSortingEvent[];
}

export interface SortingEvent {
    id: string;
    kioskId: string;
    kioskName: string;
    kioskLocation: string | null;
    category: string;
    confidence: number;
    capturedAt: string;
    syncedAt: string;
    user: {
        id: string;
        name: string;
        phone: string;
    } | null;
}

export interface KioskRecord {
    id: string;
    kioskId: string;
    name: string | null;
    location: string | null;
    status: string;
    apiKey: string | null;
    lastSeenAt: string | null;
    totalEvents: number;
    createdAt: string;
}

export interface KioskTelemetryEvent {
    id: string;
    eventId: string;
    kioskId: string;
    sessionId: string | null;
    appVersion: string | null;
    schemaVersion: number | null;
    occurredAt: string;
    seq: number | null;
    eventType: string;
    category: string | null;
    binId: string | null;
    item: string | null;
    confidence: number | null;
    language: string | null;
    material: string | null;
    massG: number | null;
    massBasis: string | null;
    co2Factor: number | null;
    co2Kg: number | null;
    diverted: boolean;
    fillLevelAfter: number | null;
    createdAt: string;
    kiosk?: {
        name: string | null;
        location: string | null;
    } | null;
}

// ─── SERVICE ──────────────────────────────────────

export const sortingService = {
    getStats: async (): Promise<SortingStats> => {
        const res = await apiGet<{ success: boolean; data: SortingStats }>("/admin/sorting/stats");
        return res.data;
    },

    getEvents: async (params?: {
        page?: number;
        limit?: number;
        kioskId?: string;
        category?: string;
    }): Promise<{ data: SortingEvent[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
        const query = new URLSearchParams();
        if (params?.page) query.set("page", String(params.page));
        if (params?.limit) query.set("limit", String(params.limit));
        if (params?.kioskId) query.set("kioskId", params.kioskId);
        if (params?.category) query.set("category", params.category);
        const qs = query.toString();
        const res = await apiGet<{ success: boolean; data: SortingEvent[]; meta: any }>(
            `/admin/sorting/events${qs ? `?${qs}` : ""}`
        );
        return { data: res.data, meta: res.meta };
    },

    getTelemetryEvents: async (params?: {
        page?: number;
        limit?: number;
        kioskId?: string;
        eventType?: string;
        search?: string;
    }): Promise<{ data: KioskTelemetryEvent[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
        const query = new URLSearchParams();
        if (params?.page) query.set("page", String(params.page));
        if (params?.limit) query.set("limit", String(params.limit));
        if (params?.kioskId) query.set("kioskId", params.kioskId);
        if (params?.eventType) query.set("eventType", params.eventType);
        if (params?.search) query.set("search", params.search);
        const qs = query.toString();
        const res = await apiGet<{ success: boolean; data: KioskTelemetryEvent[]; meta: any }>(
            `/admin/sorting/kiosk-telemetry${qs ? `?${qs}` : ""}`
        );
        return { data: res.data, meta: res.meta };
    },

    getKiosks: async (): Promise<KioskRecord[]> => {
        const res = await apiGet<{ success: boolean; data: KioskRecord[] }>("/admin/kiosks");
        return res.data;
    },
};

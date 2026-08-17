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

    getKiosks: async (): Promise<KioskRecord[]> => {
        const res = await apiGet<{ success: boolean; data: KioskRecord[] }>("/admin/kiosks");
        return res.data;
    },
};

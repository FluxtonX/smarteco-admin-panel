import { apiGet, apiPatch, apiPost } from '@/lib/api-client';

export interface CollectorRecord {
    id: string;
    name: string;
    phone: string;
    zone: string;
    status: 'On Route' | 'Available' | 'Offline';
    vehicle: string;
    rating: number;
    totalPickups: number;
    performance: number;
}

export const collectorService = {
    /** 
     * GET /api/v1/admin/collectors
     * Admin-only: List all collectors
     */
    async getCollectors(): Promise<CollectorRecord[]> {
        const res = await apiGet<{ success: boolean; data: any[] }>('/admin/collectors');
        if (res.success && res.data) {
            return res.data.map(c => ({
                id: c.id,
                name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.phone,
                phone: c.phone,
                zone: c.assignedZone || "Kigali",
                status: c.isOnline ? (c.currentPickup ? "On Route" : "Available") : "Offline",
                vehicle: c.vehiclePlate || "N/A",
                rating: c.rating || 0,
                totalPickups: c.totalPickups || 0,
                performance: c.performanceScore || 0
            }));
        }
        return [];
    },

    /**
     * POST /api/v1/admin/collectors
     * Admin-only: Register a new collector
     */
    async registerCollector(data: any): Promise<boolean> {
        const res = await apiPost<{ success: boolean }>('/admin/collectors', data);
        return res.success;
    },

    /** GET /api/v1/collectors/me/pickups */
    getAssignedPickups: async () => {
        return apiGet<{ success: boolean; data: any[] }>('/collectors/me/pickups');
    },

    /** PATCH /api/v1/collectors/pickups/{id}/status */
    updatePickupStatus: async (pickupId: string, statusPayload: any) => {
        return apiPatch(`/collectors/pickups/${pickupId}/status`, statusPayload);
    },

    /** PATCH /api/v1/collectors/me/location */
    updateLocation: async (locationPayload: { latitude: number; longitude: number }) => {
        return apiPatch('/collectors/me/location', locationPayload);
    },

    async getStats() {
        const collectors = await this.getCollectors();
        return [
            { title: "Total Collectors", value: collectors.length.toString(), type: "location" },
            { title: "On Route", value: collectors.filter(c => c.status === 'On Route').length.toString(), type: "route" },
            { title: "Average Rating", value: (collectors.reduce((acc, c) => acc + c.rating, 0) / (collectors.length || 1)).toFixed(1), type: "rating" },
            { title: "Total Pickups", value: collectors.reduce((acc, c) => acc + c.totalPickups, 0).toLocaleString(), type: "pickups" },
        ];
    }
};

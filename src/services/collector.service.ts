/**
 * Mock Service for Collector Management
 */

export interface CollectorRecord {
    id: string;
    name: string;
    phone: string;
    zone: string;
    status: 'On Route' | 'Available' | 'Offline';
    vehicle: string;
    rating: number;
    totalPickups: number;
    performance: number; // percentage
}

export const collectorService = {
    async getCollectors(): Promise<CollectorRecord[]> {
        await new Promise(resolve => setTimeout(resolve, 800));
        return [
            {
                id: "TC-001",
                name: "David Mugisha",
                phone: "+250 788 111 222",
                zone: "Kigali North",
                status: "On Route",
                vehicle: "RAD 234K",
                rating: 4.8,
                totalPickups: 1234,
                performance: 95
            },
            {
                id: "TC-002",
                name: "Grace Uwimana",
                phone: "+250 788 222 333",
                zone: "Kigali North",
                status: "Available",
                vehicle: "RAD 345L",
                rating: 4.9,
                totalPickups: 1567,
                performance: 98
            },
            {
                id: "TC-003",
                name: "Patrick Habimana",
                phone: "+250 788 333 444",
                zone: "Kigali North",
                status: "On Route",
                vehicle: "RAD 456M",
                rating: 4.7,
                totalPickups: 987,
                performance: 92
            },
            {
                id: "TC-004",
                name: "Alice Mukamana",
                phone: "+250 788 444 555",
                zone: "Kigali North",
                status: "Available",
                vehicle: "RAD 567N",
                rating: 4.9,
                totalPickups: 1789,
                performance: 97
            },
            {
                id: "TC-005",
                name: "Eric Niyonzima",
                phone: "+250 788 555 666",
                zone: "Kigali North",
                status: "Offline",
                vehicle: "RAD 678O",
                rating: 4.6,
                totalPickups: 756,
                performance: 88
            }
        ];
    },

    async getStats() {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { title: "Total Users", value: "5", type: "location" },
            { title: "On Route", value: "2", type: "route" },
            { title: "Average Rating", value: "4.8", type: "rating" },
            { title: "Total Pickups", value: "6,333", type: "pickups" },
        ];
    }
};

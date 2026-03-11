"use client";

export interface PickupRecord {
    id: string;
    user: {
        name: string;
        area: string;
    };
    wasteType: 'Organic' | 'Recyclable' | 'E-Waste' | 'Glass' | 'Hazardous';
    weight: string;
    collector: string;
    status: 'En Route' | 'Completed' | 'Scheduled' | 'In Progress';
    payment: 'Paid' | 'Pending' | 'Failed';
    timeSlot: string;
}

export interface PickupStats {
    total: number;
    completed: number;
    inProgress: number;
    scheduled: number;
}

const mockPickups: PickupRecord[] = [
    {
        id: "ECD-001234",
        user: { name: "Jean Pierre", area: "Kigali North" },
        wasteType: "Organic",
        weight: "12.5 kg",
        collector: "David Mugisha",
        status: "En Route",
        payment: "Paid",
        timeSlot: "09:00 - 11:00"
    },
    {
        id: "ECD-001235",
        user: { name: "Marie Uwase", area: "Kigali East" },
        wasteType: "Recyclable",
        weight: "8.3 kg",
        collector: "Grace Uwimana",
        status: "Completed",
        payment: "Paid",
        timeSlot: "07:00 - 09:00"
    },
    {
        id: "ECD-001236",
        user: { name: "Green Solutions Ltd", area: "Kigali West" },
        wasteType: "E-Waste",
        weight: "25 kg",
        collector: "Patrick Habimana",
        status: "Scheduled",
        payment: "Pending",
        timeSlot: "13:00 - 15:00"
    },
    {
        id: "ECD-001237",
        user: { name: "Aline Mutoni", area: "Kigali South" },
        wasteType: "Glass",
        weight: "5.2 kg",
        collector: "Alice Mukamana",
        status: "In Progress",
        payment: "Paid",
        timeSlot: "11:00 - 13:00"
    },
    {
        id: "ECD-001238",
        user: { name: "Samuel Nkurunziza", area: "Kigali North" },
        wasteType: "Hazardous",
        weight: "3.8 kg",
        collector: "Unassigned",
        status: "Scheduled",
        payment: "Failed",
        timeSlot: "15:00 - 17:00"
    }
];

const mockStats: PickupStats = {
    total: 5,
    completed: 1,
    inProgress: 2,
    scheduled: 2
};

export const pickupService = {
    async getPickups(): Promise<PickupRecord[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockPickups;
    },

    async getStats(): Promise<PickupStats> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockStats;
    }
};

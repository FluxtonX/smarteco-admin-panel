"use client";

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
    users: number;
    completed: number;
    inProgress: number;
    scheduled: number;
}

const mockBins: BinRecord[] = [
    {
        id: "BIN-KGL-0001",
        user: { name: "Jean Pierre", address: "KN 5 Ave" },
        type: "Organic",
        fillLevel: 92,
        lastEmptied: "2024-02-20",
        alertStatus: "Full",
        collector: "David Mugisha",
        history: [
            { time: "00:00", level: 45 }, { time: "03:00", level: 52 },
            { time: "06:00", level: 68 }, { time: "09:00", level: 74 },
            { time: "12:00", level: 82 }, { time: "15:00", level: 88 },
            { time: "18:00", level: 92 }, { time: "21:00", level: 92 }
        ]
    },
    {
        id: "BIN-KGL-0002",
        user: { name: "Marie Uwase", address: "KK 15 St" },
        type: "Recyclable",
        fillLevel: 78,
        lastEmptied: "2024-02-22",
        alertStatus: "Nearly Full",
        collector: "Unassigned",
        history: [
            { time: "00:00", level: 20 }, { time: "03:00", level: 35 },
            { time: "06:00", level: 48 }, { time: "09:00", level: 55 },
            { time: "12:00", level: 62 }, { time: "15:00", level: 70 },
            { time: "18:00", level: 78 }, { time: "21:00", level: 78 }
        ]
    },
    {
        id: "BIN-KGL-0004",
        user: { name: "Aline Mutoni", address: "KK 7 Ave" },
        type: "Glass",
        fillLevel: 88,
        lastEmptied: "2024-02-21",
        alertStatus: "Nearly Full",
        collector: "Alice Mukamana",
        history: [
            { time: "00:00", level: 10 }, { time: "03:00", level: 25 },
            { time: "06:00", level: 40 }, { time: "09:00", level: 55 },
            { time: "12:00", level: 70 }, { time: "15:00", level: 80 },
            { time: "18:00", level: 88 }, { time: "21:00", level: 88 }
        ]
    },
    {
        id: "BIN-KGL-0005",
        user: { name: "Hospital Central", address: "KN 4 Ave" },
        type: "Hazardous",
        fillLevel: 95,
        lastEmptied: "2024-02-19",
        alertStatus: "Critical",
        collector: "Patrick Habimana",
        history: [
            { time: "00:00", level: 30 }, { time: "03:00", level: 50 },
            { time: "06:00", level: 70 }, { time: "09:00", level: 80 },
            { time: "12:00", level: 88 }, { time: "15:00", level: 92 },
            { time: "18:00", level: 95 }, { time: "21:00", level: 95 }
        ]
    }
];

const mockStats: BinStats = {
    users: 6,
    completed: 4,
    inProgress: 1,
    scheduled: 1
};

export interface AssignmentRecord {
    binId: string;
    collector: string;
    assignedAt: string;
    status: 'In Progress' | 'Completed' | 'Pending';
}

const mockAssignments: AssignmentRecord[] = [
    { binId: "BIN-KGL-0001", collector: "David Mugisha", assignedAt: "2024-02-24 08:30", status: "In Progress" },
    { binId: "BIN-KGL-0005", collector: "Patrick Habimana", assignedAt: "2024-02-24 08:15", status: "Completed" },
    { binId: "BIN-KGL-0004", collector: "Alice Mukamana", assignedAt: "2024-02-24 07:45", status: "Completed" },
    { binId: "BIN-KGL-0002", collector: "Unassigned", assignedAt: "2024-02-24 09:00", status: "Pending" },
];

export const binService = {
    getBins: async (): Promise<BinRecord[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockBins), 500);
        });
    },

    getStats: async (): Promise<BinStats> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockStats), 300);
        });
    },

    getAssignments: async (): Promise<AssignmentRecord[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockAssignments), 400);
        });
    }
};

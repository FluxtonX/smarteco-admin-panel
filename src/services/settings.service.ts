// settings.service.ts
// API-ready service layer for System Settings. Replace mock functions with real API calls when backend is ready.

export interface AutoAssignmentSettings {
    method: "Nearest Collector" | "Zone-Based" | "Priority Queue";
    enabled: boolean;
}

export interface TimeSlot {
    start: string;
    end: string;
}

export interface TimeSlotConfig {
    morning: TimeSlot;
    midday: TimeSlot;
    afternoon: TimeSlot;
    evening: TimeSlot;
}

export interface WasteTypePoints {
    organic: number;
    recyclable: number;
    eWaste: number;
    glass: number;
    hazardous: number;
}

export interface TierMultiplier {
    tier: string;
    label: string;
    multiplier: number;
}

export interface EcoPointsStructure {
    wastePoints: WasteTypePoints;
    tierMultipliers: TierMultiplier[];
}

export interface ServiceFees {
    residentialOrganic: number;
    residentialRecyclable: number;
    businessOrganic: number;
    businessEWaste: number;
}

export interface NotificationTemplate {
    id: string;
    name: string;
    channel: string;
}

export interface SystemSettings {
    autoAssignment: AutoAssignmentSettings;
    timeSlots: TimeSlotConfig;
    ecoPoints: EcoPointsStructure;
    serviceFees: ServiceFees;
    notificationTemplates: NotificationTemplate[];
}

// ─── Mock Defaults ────────────────────────────────────────────────────────────

const defaultSettings: SystemSettings = {
    autoAssignment: {
        method: "Nearest Collector",
        enabled: true,
    },
    timeSlots: {
        morning: { start: "07:00", end: "09:00" },
        midday: { start: "11:00", end: "13:00" },
        afternoon: { start: "14:00", end: "16:00" },
        evening: { start: "17:00", end: "19:00" },
    },
    ecoPoints: {
        wastePoints: {
            organic: 10,
            recyclable: 15,
            eWaste: 25,
            glass: 12,
            hazardous: 30,
        },
        tierMultipliers: [
            { tier: "eco_starter", label: "Eco Starter", multiplier: 1.0 },
            { tier: "eco_warrior", label: "Eco Warrior", multiplier: 1.5 },
            { tier: "eco_champion", label: "Eco Champion", multiplier: 2.0 },
        ],
    },
    serviceFees: {
        residentialOrganic: 1500,
        residentialRecyclable: 1200,
        businessOrganic: 5000,
        businessEWaste: 8000,
    },
    notificationTemplates: [
        { id: "pickup_scheduled", name: "Pickup Scheduled", channel: "SMS + Push" },
        { id: "collector_en_route", name: "Collector En Route", channel: "Push" },
        { id: "pickup_completed", name: "Pickup Completed", channel: "SMS + Push" },
        { id: "ecopoints_earned", name: "EcoPoints Earned", channel: "Push" },
        { id: "smart_bin_full", name: "Smart Bin Full", channel: "SMS + Push" },
    ],
};

let currentSettings: SystemSettings = JSON.parse(JSON.stringify(defaultSettings));

class SettingsService {
    async getSettings(): Promise<SystemSettings> {
        // TODO: replace with GET /api/settings
        return new Promise((resolve) => setTimeout(() => resolve({ ...currentSettings }), 400));
    }

    async saveSettings(settings: SystemSettings): Promise<{ success: boolean }> {
        // TODO: replace with PUT /api/settings
        currentSettings = { ...settings };
        return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 600));
    }

    async resetToDefault(): Promise<SystemSettings> {
        // TODO: replace with POST /api/settings/reset
        currentSettings = JSON.parse(JSON.stringify(defaultSettings));
        return new Promise((resolve) => setTimeout(() => resolve({ ...currentSettings }), 400));
    }
}

export const settingsService = new SettingsService();

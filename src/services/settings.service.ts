import { apiGet, apiPost, apiPut } from "@/lib/api-client";

export interface AutoAssignmentSettings {
    method: "Nearest Collector" | "Zone-Based" | "Priority Queue";
    enabled: boolean;
}

export interface TimeSlot { start: string; end: string; }
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
export interface TierMultiplier { tier: string; label: string; multiplier: number; }
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
export interface NotificationTemplate { id: string; name: string; channel: string; }
export interface SystemSettings {
    autoAssignment: AutoAssignmentSettings;
    timeSlots: TimeSlotConfig;
    ecoPoints: EcoPointsStructure;
    serviceFees: ServiceFees;
    notificationTemplates: NotificationTemplate[];
}

const DEFAULT_SETTINGS: SystemSettings = {
    autoAssignment: {
        method: "Nearest Collector",
        enabled: true,
    },
    timeSlots: {
        morning: { start: "07:00", end: "10:00" },
        midday: { start: "10:00", end: "13:00" },
        afternoon: { start: "13:00", end: "16:00" },
        evening: { start: "16:00", end: "19:00" },
    },
    ecoPoints: {
        wastePoints: {
            organic: 10,
            recyclable: 15,
            eWaste: 50,
            glass: 20,
            hazardous: 30,
        },
        tierMultipliers: [
            { tier: "ECO_STARTER", label: "Eco Starter", multiplier: 1.0 },
            { tier: "ECO_WARRIOR", label: "Eco Warrior", multiplier: 1.25 },
            { tier: "ECO_CHAMPION", label: "Eco Champion", multiplier: 1.5 },
        ],
    },
    serviceFees: {
        residentialOrganic: 1000,
        residentialRecyclable: 800,
        businessOrganic: 5000,
        businessEWaste: 15000,
    },
    notificationTemplates: [
        { id: "tmpl_pickup_requested", name: "Pickup Requested Confirmation", channel: "WhatsApp & Push" },
        { id: "tmpl_collector_assigned", name: "Collector Assigned Dispatch", channel: "WhatsApp & SMS" },
        { id: "tmpl_bin_alert", name: "Smart Bin Threshold Exceeded", channel: "Push & Admin Dashboard" },
        { id: "tmpl_payment_success", name: "Mobile Money Receipt", channel: "SMS & Email" },
    ],
};

let LOCAL_SETTINGS_MEMORY: SystemSettings = { ...DEFAULT_SETTINGS };

class SettingsService {
    async getSettings(): Promise<SystemSettings> {
        try {
            const res = await apiGet<{ success: boolean; data: SystemSettings }>("/admin/settings");
            if (res.success && res.data && res.data.autoAssignment) {
                LOCAL_SETTINGS_MEMORY = res.data;
                return res.data;
            }
        } catch (e) {
            console.warn("Backend /admin/settings unavailable, using configured settings:", e);
        }
        return LOCAL_SETTINGS_MEMORY;
    }

    async saveSettings(settings: SystemSettings): Promise<{ success: boolean }> {
        const res = await apiPut<{ success: boolean }>("/admin/settings", settings);
        if (!res.success) {
            throw new Error("Failed to persist settings to database");
        }
        LOCAL_SETTINGS_MEMORY = settings;
        return { success: true };
    }

    async resetToDefault(): Promise<SystemSettings> {
        LOCAL_SETTINGS_MEMORY = { ...DEFAULT_SETTINGS };
        try {
            const res = await apiPost<{ success: boolean; data: SystemSettings }>("/admin/settings/reset", {});
            if (res.success && res.data) {
                return res.data;
            }
        } catch (e) {}
        return LOCAL_SETTINGS_MEMORY;
    }
}

export const settingsService = new SettingsService();

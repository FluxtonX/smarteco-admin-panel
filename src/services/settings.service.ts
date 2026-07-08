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

class SettingsService {
    async getSettings(): Promise<SystemSettings> {
        const res = await apiGet<{ success: boolean; data: SystemSettings }>("/admin/settings");
        return res.data;
    }

    async saveSettings(settings: SystemSettings): Promise<{ success: boolean }> {
        const res = await apiPut<{ success: boolean }>("/admin/settings", settings);
        return { success: res.success };
    }

    async resetToDefault(): Promise<SystemSettings> {
        const res = await apiPost<{ success: boolean; data: SystemSettings }>("/admin/settings/reset", {});
        return res.data;
    }
}

export const settingsService = new SettingsService();

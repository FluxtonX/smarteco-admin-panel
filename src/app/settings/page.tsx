"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { AutoAssignmentCard } from "@/components/settings/auto-assignment";
import { TimeSlotCard } from "@/components/settings/time-slot-config";
import { EcoPointsCard } from "@/components/settings/ecopoints-structure";
import { ServiceFeesCard } from "@/components/settings/service-fees";
import { NotificationTemplatesCard } from "@/components/settings/notification-templates";
import { Button } from "@/components/ui/button";
import { settingsService, SystemSettings } from "@/services/settings.service";
import { RotateCcw, Save } from "lucide-react";

export default function SystemSettingsPage() {
    const [settings, setSettings] = useState<SystemSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState("");

    useEffect(() => {
        settingsService.getSettings().then((s) => {
            setSettings(s);
            setIsLoading(false);
        });
    }, []);

    const handleReset = async () => {
        setIsLoading(true);
        const fresh = await settingsService.resetToDefault();
        setSettings(fresh);
        setIsLoading(false);
        setSavedMessage("Settings reset to default.");
        setTimeout(() => setSavedMessage(""), 3000);
    };

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        await settingsService.saveSettings(settings);
        setIsSaving(false);
        setSavedMessage("Changes saved successfully!");
        setTimeout(() => setSavedMessage(""), 3000);
    };

    if (isLoading || !settings) {
        return (
            <div className="flex h-screen bg-[#F8FAFB] overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin" />
                    <span className="mt-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest">Loading Settings...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8FAFB] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <main className="flex-1 overflow-y-auto pb-28 animate-in fade-in duration-700">
                    {/* Page Header */}
                    <div className="px-8 pt-8 pb-6 flex items-start justify-between">
                        <div className="space-y-1">
                            <h1 className="text-[28px] font-bold text-gray-800 tracking-tight leading-none">System Settings</h1>
                            <p className="text-[14px] font-medium text-gray-400">Configure assignment logic, time slots, EcoPoints, and notifications</p>
                        </div>
                    </div>

                    {/* Settings Sections */}
                    <div className="px-8 space-y-6">
                        {/* Auto-Assignment */}
                        <AutoAssignmentCard
                            settings={settings.autoAssignment}
                            onChange={(v) => setSettings({ ...settings, autoAssignment: v })}
                        />

                        {/* Time Slots */}
                        <TimeSlotCard
                            config={settings.timeSlots}
                            onChange={(v) => setSettings({ ...settings, timeSlots: v })}
                        />

                        {/* EcoPoints */}
                        <EcoPointsCard
                            structure={settings.ecoPoints}
                            onChange={(v) => setSettings({ ...settings, ecoPoints: v })}
                        />

                        {/* Service Fees */}
                        <ServiceFeesCard
                            fees={settings.serviceFees}
                            onChange={(v) => setSettings({ ...settings, serviceFees: v })}
                        />

                        {/* Notification Templates */}
                        <NotificationTemplatesCard
                            templates={settings.notificationTemplates}
                        />
                    </div>
                </main>

                {/* Sticky Footer */}
                <div className="fixed bottom-0 right-0 left-[260px] bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between z-50">
                    <div>
                        {savedMessage && (
                            <p className="text-[13px] font-semibold text-primary-green animate-in fade-in">{savedMessage}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="h-10 px-6 border-gray-300 text-[12px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-800 hover:border-gray-400 rounded-[2px] flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset to Default
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-10 px-8 bg-primary-green hover:bg-[#15803D] text-[12px] font-bold uppercase tracking-widest rounded-[2px] shadow-lg shadow-primary-green/20 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { NotificationTemplate } from "@/services/settings.service";
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useState } from "react";

interface NotificationTemplatesCardProps {
    templates: NotificationTemplate[];
}

export function NotificationTemplatesCard({ templates }: NotificationTemplatesCardProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    const handleEdit = (id: string, name: string) => {
        setEditingId(id);
        setEditText(name);
    };

    const handleSaveEdit = () => {
        // TODO: call API to save template text
        setEditingId(null);
    };

    return (
        <Card className="p-8 border-gray-200 bg-white shadow-sm rounded-[4px] space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-red-50 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="text-[16px] font-bold text-gray-700 tracking-tight leading-none">Notification Templates</h3>
            </div>

            {/* Each template row is a fully bordered box */}
            <div className="space-y-3">
                {templates.map((tmpl) => (
                    <div
                        key={tmpl.id}
                        className="flex items-center justify-between border border-gray-200 rounded-[2px] px-5 py-4 bg-white hover:border-gray-300 hover:bg-gray-50/30 transition-colors group"
                    >
                        <div className="space-y-0.5">
                            {editingId === tmpl.id ? (
                                <input
                                    className="h-8 border border-gray-300 rounded-[2px] px-3 text-[13px] font-semibold text-gray-700 outline-none focus:border-primary-green w-64"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onBlur={handleSaveEdit}
                                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                                    autoFocus
                                />
                            ) : (
                                <p className="text-[13px] font-semibold text-gray-700">{tmpl.name}</p>
                            )}
                            <p className="text-[11px] font-medium text-gray-400">{tmpl.channel}</p>
                        </div>
                        <button
                            onClick={() => handleEdit(tmpl.id, tmpl.name)}
                            className="h-8 px-5 border border-gray-300 rounded-[2px] text-[12px] font-semibold text-gray-500 hover:bg-white hover:border-gray-400 hover:text-gray-800 transition-all bg-white shrink-0"
                        >
                            Edit Template
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
}

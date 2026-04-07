"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { notificationService, Notification } from "@/services/notification.service";

export function AlertsNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        notificationService.getNotifications()
            .then(data => setNotifications(data.filter(n => !n.isRead)))
            .catch(() => {});
    }, []);

    return (
        <Card className="border border-orange-100 bg-orange-50/20 shadow-sm">
            <CardHeader className="pb-3 pt-6 px-8">
                <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-orange-600" />
                    <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">System Notifications</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-8 pb-6">
                {notifications.length > 0 ? (
                    <ul className="space-y-4">
                        {notifications.slice(0, 5).map((n) => (
                            <li key={n.id} className="flex items-center space-x-4 transition-all group">
                                <div className={`w-2.5 h-2.5 rounded-[2px] ${n.type === 'error' ? 'bg-red-600 animate-pulse' : 'bg-orange-600'} outline outline-offset-2 outline-orange-200`} />
                                <p className="text-sm text-gray-700 font-medium leading-tight">
                                    <span className="font-bold text-gray-900 pr-1">{n.title}</span>
                                    {n.message}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="py-4 text-center">
                        <p className="text-sm text-gray-500 font-medium italic">No new system alerts</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

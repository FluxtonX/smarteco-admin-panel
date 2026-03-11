"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

export function AlertsNotifications() {
    return (
        <Card className="border border-orange-100 bg-orange-50/20 shadow-sm">
            <CardHeader className="pb-3 pt-6 px-8">
                <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-orange-600" />
                    <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">Alerts and Notifications</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-8 pb-6">
                <ul className="space-y-4">
                    <li className="flex items-center space-x-4 transition-all group">
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-orange-600 animate-pulse outline outline-offset-2 outline-orange-200" />
                        <p className="text-sm text-gray-700 font-medium leading-tight">
                            <span className="font-bold text-gray-900 pr-1">3 Smart bins</span>
                            requires immediate pickup (&gt;90% full)
                        </p>
                    </li>
                    <li className="flex items-center space-x-4 transition-all">
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-yellow-500" />
                        <p className="text-sm text-gray-700 font-medium leading-tight">
                            <span className="font-bold text-gray-900 pr-1">2 Collectors</span>
                            have exceeded their quota limit
                        </p>
                    </li>
                    <li className="flex items-center space-x-4 transition-all">
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-orange-400" />
                        <p className="text-sm text-gray-700 font-medium leading-tight">
                            <span className="font-bold text-gray-900 pr-1">5 Users</span>
                            pending tier upgrade verification
                        </p>
                    </li>
                </ul>
            </CardContent>
        </Card>
    );
}

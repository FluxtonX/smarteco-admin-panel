"use client";

import { AuditLog } from "@/services/audit.service";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityTimelineProps {
    logs: AuditLog[];
}

export function ActivityTimeline({ logs }: ActivityTimelineProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-[18px] font-bold text-gray-800 tracking-tight">Recent Activity Timeline</h3>

            <div className="space-y-4">
                {logs.map((log) => (
                    <div
                        key={log.id}
                        className="flex items-center justify-between bg-white border border-gray-100 rounded-[8px] px-6 py-5 shadow-sm hover:shadow-md transition-shadow group"
                    >
                        <div className="flex items-center gap-5 flex-1 min-w-0">
                            {/* Icon Box */}
                            <div className={cn(
                                "w-11 h-11 rounded-[6px] flex items-center justify-center shrink-0 border transition-colors",
                                log.status === "Success" && "bg-[#E8F5E9] border-[#C8E6C9] group-hover:bg-[#C8E6C9]",
                                log.status === "Failed" && "bg-red-50 border-red-100 group-hover:bg-red-100",
                                log.status === "Pending" && "bg-orange-50 border-orange-100 group-hover:bg-orange-100"
                            )}>
                                <FileText className={cn(
                                    "w-5 h-5",
                                    log.status === "Success" && "text-[#2E7D32]",
                                    log.status === "Failed" && "text-red-500",
                                    log.status === "Pending" && "text-orange-500"
                                )} />
                            </div>

                            {/* Content */}
                            <div className="space-y-1 min-w-0">
                                <p className="text-[15px] font-bold text-[#1A1A1A] leading-none">{log.action}</p>
                                <p className="text-[13px] font-medium text-gray-500 truncate pr-4">{log.details}</p>
                                <p className="text-[11px] font-medium text-gray-400">
                                    by <span className="font-bold text-gray-500">{log.admin}</span>
                                    {" • "}
                                    {log.timestamp}
                                </p>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className={cn(
                            "px-5 py-1.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wider border shadow-sm shrink-0 min-w-[100px] text-center",
                            log.status === "Success" && "bg-[#DCFCE7] text-[#166534] border-[#166534]/20",
                            log.status === "Failed" && "bg-red-100 text-red-700 border-red-200",
                            log.status === "Pending" && "bg-orange-100 text-orange-700 border-orange-200"
                        )}>
                            {log.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

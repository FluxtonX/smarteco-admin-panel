"use client";

import { Card } from "@/components/ui/card";
import {
    FileText,
    Download,
    FileSpreadsheet,
    FileJson,
    ChevronRight
} from "lucide-react";
import { RecentReport } from "@/services/report.service";
import { cn } from "@/lib/utils";

interface RecentReportsListProps {
    reports: RecentReport[];
}

export function RecentReportsList({ reports }: RecentReportsListProps) {
    const getFormatIcon = (format: string) => {
        switch (format) {
            case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
            case 'Excel': return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
            case 'CSV': return <FileJson className="w-5 h-5 text-blue-500" />;
            default: return <FileText className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-[15px] font-bold text-[#1A1A1A]">Recent Reports</h3>
            <Card className="border-gray-100 shadow-sm rounded-[8px] overflow-hidden">
                <div className="divide-y divide-gray-50">
                    {reports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group">
                            <div className="flex items-center space-x-4">
                                <div className="p-2.5 bg-gray-50 rounded-[4px]">
                                    {getFormatIcon(report.format)}
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-[13px] font-bold text-[#1A1A1A] group-hover:text-primary-green transition-colors">
                                        {report.name}
                                    </div>
                                    <div className="flex items-center space-x-2 text-[11px] font-medium text-gray-400">
                                        <span>{report.date}</span>
                                        <span>•</span>
                                        <span>{report.size}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2.5 text-gray-400 hover:text-primary-green hover:bg-primary-green/5 border border-gray-100 rounded-[2px] transition-all">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

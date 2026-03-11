"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CustomReportGenerator } from "@/components/reports/custom-report-generator";
import { ReportTemplatesGrid } from "@/components/reports/report-templates";
import { RecentReportsList } from "@/components/reports/recent-reports";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
    reportService,
    ReportTemplate,
    RecentReport
} from "@/services/report.service";

export default function ReportsPage() {
    const [templates, setTemplates] = useState<ReportTemplate[]>([]);
    const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const [t, r] = await Promise.all([
                reportService.getTemplates(),
                reportService.getRecentReports()
            ]);
            setTemplates(t);
            setRecentReports(r);
            setIsLoading(false);
        }
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen bg-[#F8FAFB] overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin" />
                    <span className="mt-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest">Loading Reports...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8FAFB] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <main className="flex-1 overflow-y-auto p-8 space-y-8 animate-in fade-in duration-700">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h1 className="text-[28px] font-bold text-[#1A1A1A] tracking-tight leading-none">
                                Reports
                            </h1>
                            <p className="text-[14px] font-medium text-gray-500">
                                Generate and download system reports
                            </p>
                        </div>
                        <Button className="bg-[#DCFCE7] text-[#166534] hover:bg-[#bbf7d0] border border-[#166534]/20 text-[12px] font-bold uppercase tracking-widest h-11 px-8 flex items-center gap-2 rounded-[2px] shadow-sm">
                            <Download className="w-4 h-4" />
                            Generate Report
                        </Button>
                    </div>

                    {/* Custom Generator */}
                    <CustomReportGenerator />

                    {/* Templates Grid */}
                    <ReportTemplatesGrid templates={templates} />

                    {/* Recent Reports List */}
                    <RecentReportsList reports={recentReports} />
                </main>
            </div>
        </div>
    );
}

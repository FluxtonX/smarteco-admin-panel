"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Calendar, Download, CheckCircle2 } from "lucide-react";
import { reportService } from "@/services/report.service";

export function CustomReportGenerator() {
    const [reportType, setReportType] = useState("Daily Operations");
    const [format, setFormat] = useState("CSV");
    const [dateValue, setDateValue] = useState("2026-07-23");
    const [isGenerating, setIsGenerating] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            await reportService.generateReport({
                type: reportType,
                dateRange: dateValue,
                format: format
            });
            setSuccessMsg(`Report generated and downloaded: ${reportType} (${format})`);
            setTimeout(() => setSuccessMsg(""), 4000);
        } catch (e) {
            console.error("Report generation error:", e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card className="p-6 md:p-8 border-gray-200 bg-white shadow-sm rounded-[8px] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                    <h3 className="text-[16px] font-bold text-gray-800 tracking-tight leading-none">Generate Custom Report</h3>
                    <p className="text-[12px] font-medium text-gray-500 mt-1">Select filters and format to download system analytical report</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                {/* Report Type */}
                <div className="space-y-2.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block leading-none">Report Type</label>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full h-11 border border-gray-300 rounded-[6px] px-4 flex items-center justify-between text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all outline-none focus:ring-1 focus:ring-primary-green/20 bg-white cursor-pointer select-none">
                            <span className="truncate">{reportType}</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[300px]">
                            <DropdownMenuItem onClick={() => setReportType("Daily Operations")}>Daily Operations</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setReportType("Financial Audit")}>Financial Audit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setReportType("User Engagement")}>User Engagement</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setReportType("Collector Performance")}>Collector Performance</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setReportType("Waste Analytics")}>Waste Analytics</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setReportType("IoT System Status")}>IoT System Status</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Date Range */}
                <div className="space-y-2.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block leading-none">Date Range</label>
                    <div className="relative h-11 group">
                        <div className="absolute left-0 top-0 w-10 h-11 flex items-center justify-center z-20 cursor-pointer">
                            <Calendar className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors pointer-events-none" />
                            <input
                                type="date"
                                tabIndex={-1}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                value={dateValue}
                                onChange={(e) => setDateValue(e.target.value)}
                                onClick={(e) => e.currentTarget.showPicker?.()}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="YYYY-MM-DD"
                            className="w-full h-full pl-10 pr-4 bg-white border border-gray-300 rounded-[6px] text-[13px] font-bold text-gray-700 placeholder:text-gray-300 outline-none hover:border-gray-400 focus:border-primary-green focus:ring-1 focus:ring-primary-green/20 transition-all"
                            value={dateValue}
                            onChange={(e) => setDateValue(e.target.value)}
                        />
                    </div>
                </div>

                {/* Format */}
                <div className="space-y-2.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block leading-none">Format</label>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full h-11 border border-gray-300 rounded-[6px] px-4 flex items-center justify-between text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all outline-none focus:ring-1 focus:ring-primary-green/20 uppercase bg-white cursor-pointer select-none">
                            <span className="truncate">{format}</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[150px]">
                            <DropdownMenuItem onClick={() => setFormat("CSV")}>CSV</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFormat("Excel")}>EXCEL</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Submit Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                <div>
                    {successMsg && (
                        <div className="flex items-center gap-2 text-xs font-bold text-[#166534] bg-[#DCFCE7] px-3 py-1.5 rounded-[4px]">
                            <CheckCircle2 className="w-4 h-4 text-[#166534]" />
                            <span>{successMsg}</span>
                        </div>
                    )}
                </div>
                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="h-11 bg-primary-green hover:bg-[#15803D] text-white font-bold text-xs uppercase tracking-wider px-8 rounded-[6px] shadow-md shadow-primary-green/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    <Download className="w-4 h-4" />
                    <span>{isGenerating ? "Generating..." : "Generate & Download Report"}</span>
                </Button>
            </div>
        </Card>
    );
}

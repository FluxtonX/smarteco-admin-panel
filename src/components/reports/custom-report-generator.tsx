"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Calendar } from "lucide-react";

export function CustomReportGenerator() {
    const [reportType, setReportType] = useState("Daily Operations");
    const [format, setFormat] = useState("PDF");
    const [dateValue, setDateValue] = useState("2024-02-24");

    return (
        <Card className="p-8 border-gray-200 bg-white shadow-sm rounded-[4px] space-y-7">
            <h3 className="text-[16px] font-bold text-gray-700 tracking-tight leading-none">Generate Custom Report</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                {/* Report Type */}
                <div className="space-y-2.5">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block leading-none">Report Type</label>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full h-10 border border-gray-300 rounded-[2px] px-4 flex items-center justify-between text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all outline-none focus:ring-1 focus:ring-primary-green/20 bg-white cursor-pointer select-none">
                            <span className="truncate">{reportType}</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[300px]">
                            <DropdownMenuItem onClick={() => setReportType("Daily Operations")}>Daily Operations</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setReportType("Financial Audit")}>Financial Audit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setReportType("User Engagement")}>User Engagement</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setReportType("Collector Performance")}>Collector Performance</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Date Range - Hybrid: direct typing + calendar picker from icon */}
                <div className="space-y-2.5">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block leading-none">Date Range</label>
                    <div className="relative h-10 group">
                        {/* Calendar icon area — clicking opens the hidden date picker */}
                        <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center z-20 cursor-pointer">
                            <Calendar
                                className="w-4 h-4 text-gray-400 group-hover:text-gray-500 transition-colors pointer-events-none"
                            />
                            <input
                                type="date"
                                tabIndex={-1}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                value={dateValue}
                                onChange={(e) => setDateValue(e.target.value)}
                                onClick={(e) => e.currentTarget.showPicker?.()}
                            />
                        </div>
                        {/* Visible text field for manual typing */}
                        <input
                            type="text"
                            placeholder="dd/mm/yy"
                            className="w-full h-full pl-10 pr-4 bg-white border border-gray-300 rounded-[2px] text-[13px] font-medium text-gray-600 placeholder:text-gray-300 outline-none hover:border-gray-400 focus:border-primary-green focus:ring-1 focus:ring-primary-green/20 transition-all"
                            value={dateValue}
                            onChange={(e) => setDateValue(e.target.value)}
                        />
                    </div>
                </div>

                {/* Format */}
                <div className="space-y-2.5">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block leading-none">Format</label>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full h-10 border border-gray-300 rounded-[2px] px-4 flex items-center justify-between text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all outline-none focus:ring-1 focus:ring-primary-green/20 uppercase bg-white cursor-pointer select-none">
                            <span className="truncate">{format}</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[150px]">
                            <DropdownMenuItem onClick={() => setFormat("PDF")}>PDF</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFormat("Excel")}>EXCEL</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFormat("CSV")}>CSV</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Card>
    );
}

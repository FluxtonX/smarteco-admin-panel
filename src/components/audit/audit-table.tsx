"use client";

import { AuditLog, AuditModule, AuditStatus } from "@/services/audit.service";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuditTableProps {
    logs: AuditLog[];
    search: string;
    statusFilter: AuditStatus | "All";
    moduleFilter: AuditModule | "All";
    onSearchChange: (v: string) => void;
    onStatusChange: (v: AuditStatus | "All") => void;
    onModuleChange: (v: AuditModule | "All") => void;
}

const MODULE_STYLES: Record<AuditModule, string> = {
    "Users": "bg-blue-100 text-blue-700 border-blue-200",
    "Pickups": "bg-green-100 text-green-700 border-green-200",
    "Payments": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Smart Bins": "bg-teal-100 text-teal-700 border-teal-200",
    "Settings": "bg-indigo-100 text-indigo-700 border-indigo-200",
    "Admin Management": "bg-purple-100 text-purple-700 border-purple-200",
    "EcoPoints": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Collectors": "bg-orange-100 text-orange-700 border-orange-200",
    "Reports": "bg-gray-100 text-gray-700 border-gray-200",
};

const STATUS_OPTIONS: (AuditStatus | "All")[] = ["All", "Success", "Failed", "Pending"];
const MODULE_OPTIONS: (AuditModule | "All")[] = [
    "All",
    "Users",
    "Pickups",
    "Payments",
    "Smart Bins",
    "Settings",
    "Admin Management",
    "EcoPoints",
    "Collectors",
    "Reports"
];

export function AuditTable({
    logs,
    search,
    statusFilter,
    moduleFilter,
    onSearchChange,
    onStatusChange,
    onModuleChange,
}: AuditTableProps) {
    return (
        <div className="space-y-4">
            {/* Search + Filter Bar */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by transaction ID or user..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-[2px] text-[13px] font-medium text-gray-600 placeholder:text-gray-300 outline-none hover:border-gray-400 focus:border-primary-green focus:ring-1 focus:ring-primary-green/20 transition-all bg-white"
                    />
                </div>

                {/* Status Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="h-10 px-5 border border-gray-300 rounded-[2px] text-[13px] font-semibold text-gray-600 flex items-center gap-2 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all outline-none cursor-pointer select-none min-w-[120px] justify-between">
                        {statusFilter === "All" ? "All Status" : statusFilter}
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[150px]">
                        {STATUS_OPTIONS.map((s) => (
                            <DropdownMenuItem key={s} onClick={() => onStatusChange(s)}>
                                {s === "All" ? "All Status" : s}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Module Filter (More Filters) */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="h-10 px-5 border border-gray-300 rounded-[2px] text-[13px] font-semibold text-gray-500 flex items-center gap-2 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all outline-none cursor-pointer select-none min-w-[140px] justify-between">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                            {moduleFilter === "All" ? "More Filters" : moduleFilter}
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[180px] max-h-[300px] overflow-y-auto">
                        {MODULE_OPTIONS.map((m) => (
                            <DropdownMenuItem key={m} onClick={() => onModuleChange(m)}>
                                {m}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table */}
            <Card className="border-gray-200 shadow-sm rounded-[4px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/80">
                                {["LOG ID", "TIMESTAMP", "ADMIN", "ACTION", "MODULE", "DETAILS", "STATUS"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-5 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-[13px] text-gray-400 font-medium">
                                        No audit logs match your search.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                                        {/* Log ID */}
                                        <td className="px-5 py-4 text-[11px] font-bold text-gray-400 font-mono tracking-widest whitespace-nowrap">
                                            {log.id}
                                        </td>
                                        {/* Timestamp */}
                                        <td className="px-5 py-4 text-[12px] font-medium text-gray-500 whitespace-nowrap leading-5">
                                            {log.timestamp.split(" ").map((part, i) => (
                                                <div key={i} className={i === 1 ? "text-gray-400" : ""}>{part}</div>
                                            ))}
                                        </td>
                                        {/* Admin */}
                                        <td className="px-5 py-4 text-[13px] font-semibold text-gray-700 whitespace-nowrap">
                                            {log.admin}
                                        </td>
                                        {/* Action */}
                                        <td className="px-5 py-4 text-[13px] font-medium text-gray-600 whitespace-nowrap">
                                            {log.action}
                                        </td>
                                        {/* Module badge */}
                                        <td className="px-5 py-4">
                                            <span className={cn(
                                                "inline-flex items-center px-3 py-1 rounded-[2px] text-[11px] font-bold border whitespace-nowrap",
                                                MODULE_STYLES[log.module]
                                            )}>
                                                {log.module}
                                            </span>
                                        </td>
                                        {/* Details */}
                                        <td className="px-5 py-4 text-[12px] font-medium text-gray-500 max-w-[220px]">
                                            {log.details}
                                        </td>
                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span className={cn(
                                                "inline-flex items-center px-3 py-1 rounded-[2px] text-[11px] font-bold",
                                                log.status === "Success" && "bg-green-100 text-green-700 border border-green-200",
                                                log.status === "Failed" && "bg-red-100 text-red-600 border border-red-200",
                                                log.status === "Pending" && "bg-orange-100 text-orange-600 border border-orange-200",
                                            )}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

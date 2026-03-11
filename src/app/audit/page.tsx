"use client";

import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { AuditStatsGrid } from "@/components/audit/audit-stats";
import { AuditTable } from "@/components/audit/audit-table";
import { ActivityTimeline } from "@/components/audit/activity-timeline";
import { auditService, AuditLog, AuditStats, AuditStatus, AuditModule } from "@/services/audit.service";

export default function AuditLogsPage() {
    const [allLogs, setAllLogs] = useState<AuditLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
    const [stats, setStats] = useState<AuditStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<AuditStatus | "All">("All");
    const [moduleFilter, setModuleFilter] = useState<AuditModule | "All">("All");

    useEffect(() => {
        Promise.all([auditService.getLogs(), auditService.getStats()]).then(([logs, s]) => {
            setAllLogs(logs);
            setFilteredLogs(logs);
            setStats(s);
            setIsLoading(false);
        });
    }, []);

    // Live filtering
    useEffect(() => {
        auditService.searchLogs(search, statusFilter, moduleFilter).then(setFilteredLogs);
    }, [search, statusFilter, moduleFilter]);

    if (isLoading || !stats) {
        return (
            <div className="flex h-screen bg-[#F8FAFB] overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin" />
                    <span className="mt-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest">Loading Audit Logs...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8FAFB] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <main className="flex-1 overflow-y-auto animate-in fade-in duration-700">
                    {/* Page Header */}
                    <div className="px-8 pt-8 pb-6">
                        <h1 className="text-[28px] font-bold text-gray-800 tracking-tight leading-none">Audit Logs</h1>
                        <p className="text-[14px] font-medium text-gray-400 mt-1">System activity and admin action tracking</p>
                    </div>

                    <div className="px-8 pb-12 space-y-8">
                        {/* Stats Cards */}
                        <AuditStatsGrid stats={stats} />

                        {/* Table + Filters */}
                        <AuditTable
                            logs={filteredLogs}
                            search={search}
                            statusFilter={statusFilter}
                            moduleFilter={moduleFilter}
                            onSearchChange={setSearch}
                            onStatusChange={setStatusFilter}
                            onModuleChange={setModuleFilter}
                        />

                        {/* Recent Activity Timeline — shows the latest 5 unfiltered logs */}
                        <ActivityTimeline logs={allLogs.slice(0, 5)} />
                    </div>
                </main>
            </div>
        </div>
    );
}

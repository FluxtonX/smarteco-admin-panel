"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BinStats } from "@/components/bins/bin-stats";
import { BinTable } from "@/components/bins/bin-table";
import { BinSensorData } from "@/components/bins/bin-sensor-data";
import { AssignmentLogs } from "@/components/bins/assignment-logs";
import { LiveStatus } from "@/components/ui/live-status";


import { BinMap } from "@/components/bins/bin-map";
import { BinDetailsModal } from "@/components/bins/bin-details-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, MapPin, FileText, Download, AlertCircle, Clock, Activity, ClipboardList } from "lucide-react";
import { binService, BinRecord, BinStats as BinStatsData } from "@/services/bin.service";
import { useSearch } from "@/context/search-context";
import { cn } from "@/lib/utils";


export default function SmartBinManagementPage() {
    const { searchQuery, setSearchQuery } = useSearch();
    const [bins, setBins] = useState<BinRecord[]>([]);
    const [stats, setStats] = useState<BinStatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Active Alerts");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedBinForModal, setSelectedBinForModal] = useState<BinRecord | null>(null);
    const [isBinModalOpen, setIsBinModalOpen] = useState(false);
    const [isMockDataMode, setIsMockDataMode] = useState(false);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [binsData, statsData] = await Promise.all([
                    binService.getBins(),
                    binService.getStats()
                ]);
                setBins(binsData);
                setStats(statsData);
            } catch (error) {
                console.error("Failed to load bin data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredBinsBySearch = bins.filter(b =>
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.user.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.collector.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const binsRequiringAttention = filteredBinsBySearch.filter(b =>
        ['Critical', 'Full', 'Nearly Full'].includes(b.alertStatus)
    );

    const tabs = [
        { name: "Overview", icon: Search },
        { name: "Active Alerts", count: stats?.alerts || 0, icon: AlertCircle },
        { name: "Sensor Data", icon: Clock },
        { name: "Assignment Logs", icon: FileText },
    ];

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-[22px] font-bold text-[#1A1A1A] tracking-tight leading-none">IoT Smart Bin Monitoring</h1>
                            <p className="text-[12px] md:text-[13px] text-[#636E72] font-medium mt-1.5">
                                Real-time monitoring of {bins.length} smart bins
                            </p>
                        </div>
                        <Button className="h-10 bg-[#DCFCE7] text-[#166534] border border-[#166534]/20 font-bold hover:bg-[#bbf7d0] rounded-[4px] px-6 flex items-center justify-center space-x-2 transition-all shadow-sm w-full sm:w-auto">
                            <Download className="w-4 h-4 text-[#166534]" />
                            <span className="text-[11px] uppercase tracking-wider">Export Report</span>
                        </Button>
                    </div>

                    {/* Tab Navigation - Scrollable on mobile */}
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="bg-white p-1 rounded-[8px] border border-gray-100 shadow-sm inline-flex items-center space-x-1 min-w-max">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={cn(
                                        "px-4 md:px-6 py-2 rounded-[6px] text-xs font-bold transition-all flex items-center gap-2 border",
                                        activeTab === tab.name
                                            ? "bg-[#DCFCE7] text-[#166534] border-[#166534]/20 shadow-sm"
                                            : "text-[#636E72] hover:bg-gray-50 border-transparent hover:border-gray-200"
                                    )}
                                >
                                    <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.name ? "text-[#166534]" : "text-gray-400")} />
                                    {tab.name}
                                    {tab.count && (
                                        <span className={cn(
                                            "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                                            activeTab === tab.name ? "bg-[#166534] text-white" : "bg-gray-200 text-gray-500"
                                        )}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === "Active Alerts" && (
                        <div className="space-y-8 transition-all animate-in fade-in duration-500">
                            {/* Alert Banner */}
                            <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-[4px] p-4 flex items-start gap-4 shadow-sm">
                                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                                <div className="space-y-1">
                                    <h3 className="text-[15px] font-bold text-[#1A1A1A]">Immediate Action Required</h3>
                                    <p className="text-[13px] font-medium text-[#B91C1C]">
                                        {binsRequiringAttention.length} bins require attention. Please assign collectors immediately.
                                    </p>
                                </div>
                            </div>

                            {/* Attention Section */}
                            <div className="space-y-4">
                                <h2 className="text-base font-bold text-[#1A1A1A] tracking-tight">Bins Requiring Attention</h2>
                                <div className="overflow-x-auto">
                                    <BinTable
                                        bins={binsRequiringAttention}
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Overview" && (
                        <div className="space-y-8 transition-all animate-in fade-in duration-500">
                            <BinStats stats={stats} />
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-[16px] font-bold text-[#1A1A1A] tracking-tight">Smart bin locations</h2>
                                </div>
                                <BinMap
                                    bins={filteredBinsBySearch}
                                    onSelectBin={(bin) => {
                                        setSelectedBinForModal(bin);
                                        setIsBinModalOpen(true);
                                    }}
                                    onToggleDataSource={(useMock) => setIsMockDataMode(useMock)}
                                    isUsingMockData={isMockDataMode}
                                />
                                <div className="overflow-x-auto">
                                    <BinTable
                                        bins={filteredBinsBySearch}
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Sensor Data" && (
                        <BinSensorData />
                    )}

                    {activeTab === "Assignment Logs" && (
                        <AssignmentLogs />
                    )}

                </main>
            </div>
            <BinDetailsModal
                bin={selectedBinForModal}
                isOpen={isBinModalOpen}
                onClose={() => setIsBinModalOpen(false)}
            />
        </div>
    );
}


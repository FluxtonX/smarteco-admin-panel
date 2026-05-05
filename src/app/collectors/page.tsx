"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CollectorStats } from "@/components/collectors/collector-stats";
import { CollectorTable } from "@/components/collectors/collector-table";
import { CollectorDetailsModal } from "@/components/collectors/collector-details-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Filter } from "lucide-react";
import { collectorService, CollectorRecord, PendingCollector } from "@/services/collector.service";
import { useSearch } from "@/context/search-context";
import { LiveStatus } from "@/components/ui/live-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingCollectorTable } from "@/components/collectors/pending-collector-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

export default function CollectorManagementPage() {
    const { searchQuery, setSearchQuery } = useSearch();
    const [collectors, setCollectors] = useState<CollectorRecord[]>([]);
    const [pendingCollectors, setPendingCollectors] = useState<PendingCollector[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCollector, setSelectedCollector] = useState<CollectorRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("All Status");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { toast } = useToast();

    async function loadData() {
        setIsLoading(true);
        try {
            const [collectorsData, pendingData, statsData] = await Promise.all([
                collectorService.getCollectors(),
                collectorService.getPendingCollectors(),
                collectorService.getStats()
            ]);
            setCollectors(collectorsData);
            setPendingCollectors(pendingData);
            setStats(statsData);
        } catch (error) {
            console.error("Failed to load collector data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleApproval = async (id: string, action: 'APPROVE' | 'REJECT') => {
        try {
            const success = await collectorService.approveCollector(id, action);
            if (success) {
                toast({
                    title: `Collector ${action === 'APPROVE' ? 'Approved' : 'Rejected'}`,
                    description: `The collector status has been updated successfully.`,
                });
                loadData();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update collector status.",
                variant: "destructive"
            });
        }
    };

    const filteredCollectors = collectors.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "All Status" || c.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-row items-start justify-between gap-6">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight leading-tight">Collector Management</h1>
                            <p className="text-[12px] md:text-sm text-[#636E72] font-semibold mt-1">5 active collectors</p>
                        </div>
                        <div className="flex-shrink-0 pt-1">
                            <LiveStatus />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <CollectorStats stats={stats} />

                    {/* Controls Row - Stack on mobile */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                        <div className="relative flex-[4]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B2BEC3]" />
                            <Input
                                placeholder="Search collectors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 bg-white border-gray-100 shadow-sm focus:ring-primary-green/20 rounded-[4px] text-sm text-[#2D3436] placeholder:text-[#B2BEC3] font-medium w-full"
                            />
                        </div>
                        <div className="flex-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-full h-11 bg-white border border-gray-100 text-[#2D3436] font-bold hover:bg-gray-50 hover:border-gray-200 shadow-sm rounded-[4px] flex items-center justify-between px-4 transition-all outline-none">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-gray-400" />
                                        <span>{statusFilter}</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[calc(100vw-2rem)] md:w-56">
                                    {["All Status", "Available", "On Route", "Offline"].map((status) => (
                                        <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Main Table Area with Tabs */}
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="bg-white border border-gray-100 p-1 h-12 rounded-[4px] mb-6">
                            <TabsTrigger value="all" className="px-6 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-primary-green data-[state=active]:text-white">
                                All Collectors ({collectors.length})
                            </TabsTrigger>
                            <TabsTrigger value="pending" className="px-6 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-primary-green data-[state=active]:text-white relative">
                                Pending Approvals
                                {pendingCollectors.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">
                                        {pendingCollectors.length}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <div className="-mx-4 md:mx-0 overflow-x-auto">
                                <CollectorTable
                                    collectors={filteredCollectors}
                                    isLoading={isLoading}
                                    onView={(c) => {
                                        setSelectedCollector(c);
                                        setIsModalOpen(true);
                                    }}
                                    onEdit={(c) => {
                                        setSelectedCollector(c);
                                        setIsModalOpen(true);
                                    }}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="pending">
                            <div className="-mx-4 md:mx-0 overflow-x-auto">
                                <PendingCollectorTable
                                    collectors={pendingCollectors}
                                    isLoading={isLoading}
                                    onApprove={(id) => handleApproval(id, 'APPROVE')}
                                    onReject={(id) => handleApproval(id, 'REJECT')}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
<br></br>
                    {/* Modal */}
                    <CollectorDetailsModal
                        collector={selectedCollector}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </main>
            </div>
        </div>
    );
}

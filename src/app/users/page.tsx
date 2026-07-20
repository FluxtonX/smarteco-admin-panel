"use client";

import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { UserSummaryCard } from "@/components/users/user-stats";
import { UserTable } from "@/components/users/user-table";
import { TierDistribution } from "@/components/users/tier-distribution";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileDown, Users, Home, Building2, UserX, BarChart3 } from "lucide-react";
import { userService, UserRecord, DashboardStats } from "@/services/user.service";
import { useSearch } from "@/context/search-context";
import { LiveStatus } from "@/components/ui/live-status";

export default function UsersPage() {
    const { searchQuery, setSearchQuery } = useSearch();
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const loadUsersData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [data, dashData] = await Promise.all([
                userService.getUsers(),
                userService.getDashboardStats(),
            ]);
            setUsers(data);
            setStats(dashData);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsersData();
    }, [loadUsersData]);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery) ||
            user.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab =
            activeTab === "all" ||
            (activeTab === "residential" && user.type === "Residential") ||
            (activeTab === "business" && user.type === "Business") ||
            (activeTab === "suspended" && user.status === "Suspended");

        return matchesSearch && matchesTab;
    });

    // Dynamic counts
    const totalCount = users.length;
    const residentialCount = users.filter(u => u.type === "Residential").length;
    const businessCount = users.filter(u => u.type === "Business").length;
    const suspendedCount = users.filter(u => u.status === "Suspended").length;

    // Dynamic Tier distribution calculation
    const tierDistributionData = stats?.users?.tierDistribution ?? {
        ECO_STARTER: users.filter(u => u.tier === 'Eco Starter' || u.tier === 'ECO_STARTER' || !u.tier).length,
        ECO_WARRIOR: users.filter(u => u.tier === 'Eco Warrior' || u.tier === 'ECO_WARRIOR').length,
        ECO_CHAMPION: users.filter(u => u.tier === 'Eco Champion' || u.tier === 'ECO_CHAMPION').length,
    };

    // CSV Download Function
    const handleExportCSV = () => {
        if (filteredUsers.length === 0) return;
        const headers = ["User ID", "Name", "Phone", "Location", "Type", "Tier", "EcoPoints", "Pickups", "Status"];
        const rows = filteredUsers.map(u => [
            `"${u.id}"`,
            `"${u.name}"`,
            `"${u.phone}"`,
            `"${u.location}"`,
            `"${u.type}"`,
            `"${u.tier}"`,
            u.points,
            u.pickups,
            `"${u.status}"`
        ]);
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `smarteco_users_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-[#2D3436]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 bg-[#f8f9fa]">
                    {/* Header Section */}
                    <div className="flex flex-row items-start justify-between gap-6">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight leading-tight">User Management</h1>
                            <p className="text-[12px] md:text-sm text-[#636E72] font-semibold mt-1">
                                Manage and monitor system users across Kigali
                            </p>
                        </div>
                        <div className="flex-shrink-0 pt-1">
                            <LiveStatus />
                        </div>
                    </div>

                    {/* User Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <UserSummaryCard title="Total Users" count={totalCount} subtext={`Manage ${totalCount} registered users`} icon={Users} />
                        <UserSummaryCard title="Residential Users" count={residentialCount} subtext="Private households" icon={Home} />
                        <UserSummaryCard title="Business Accounts" count={businessCount} subtext="Commercial entities" icon={Building2} />
                        <UserSummaryCard title="Suspended" count={suspendedCount} subtext="Pending verification" icon={UserX} />
                    </div>

                    {/* Tabs / Filters Section with distinct green highlight on active */}
                    <div className="pt-2 overflow-x-auto scrollbar-hide">
                        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                            <TabsList className="bg-transparent border-none p-0 h-auto flex whitespace-nowrap gap-3 min-w-max pb-2">
                                <TabsTrigger
                                    value="all"
                                    className="text-[10px] md:text-[11px] font-bold uppercase px-4 md:px-5 py-2.5 rounded-[6px] border border-gray-200 bg-white text-gray-700 data-[state=active]:bg-[#DCFCE7] data-[state=active]:text-[#166534] data-[state=active]:border-[#166534]/30 data-[state=active]:shadow-md hover:bg-green-50 hover:text-primary-green transition-all flex items-center space-x-2"
                                >
                                    <Users className="w-3.5 h-3.5" />
                                    <span>All Users ({totalCount})</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="residential"
                                    className="text-[10px] md:text-[11px] font-bold uppercase px-4 md:px-5 py-2.5 rounded-[6px] border border-gray-200 bg-white text-gray-700 data-[state=active]:bg-[#DCFCE7] data-[state=active]:text-[#166534] data-[state=active]:border-[#166534]/30 data-[state=active]:shadow-md hover:bg-green-50 hover:text-primary-green transition-all flex items-center space-x-2"
                                >
                                    <Home className="w-3.5 h-3.5" />
                                    <span>Residential ({residentialCount})</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="business"
                                    className="text-[10px] md:text-[11px] font-bold uppercase px-4 md:px-5 py-2.5 rounded-[6px] border border-gray-200 bg-white text-gray-700 data-[state=active]:bg-[#DCFCE7] data-[state=active]:text-[#166534] data-[state=active]:border-[#166534]/30 data-[state=active]:shadow-md hover:bg-green-50 hover:text-primary-green transition-all flex items-center space-x-2"
                                >
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>Business ({businessCount})</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="suspended"
                                    className="text-[10px] md:text-[11px] font-bold uppercase px-4 md:px-5 py-2.5 rounded-[6px] border border-gray-200 bg-white text-gray-700 data-[state=active]:bg-[#DCFCE7] data-[state=active]:text-[#166534] data-[state=active]:border-[#166534]/30 data-[state=active]:shadow-md hover:bg-green-50 hover:text-primary-green transition-all flex items-center space-x-2"
                                >
                                    <UserX className="w-3.5 h-3.5" />
                                    <span>Suspended ({suspendedCount})</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="tier"
                                    className="text-[10px] md:text-[11px] font-bold uppercase px-4 md:px-5 py-2.5 rounded-[6px] border border-gray-200 bg-white text-gray-700 data-[state=active]:bg-[#DCFCE7] data-[state=active]:text-[#166534] data-[state=active]:border-[#166534]/30 data-[state=active]:shadow-md hover:bg-green-50 hover:text-primary-green transition-all flex items-center space-x-2"
                                >
                                    <BarChart3 className="w-3.5 h-3.5" />
                                    <span>Tier Distribution</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {activeTab === "tier" ? (
                        <TierDistribution tierData={tierDistributionData} />
                    ) : (
                        <>
                            {/* Search and Export Row */}
                            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B2BEC3]" />
                                    <Input
                                        placeholder="Search by name, phone, or ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-11 bg-white border-gray-200 shadow-sm focus:ring-primary-green/20 rounded-[6px] text-sm text-[#2D3436] placeholder:text-[#B2BEC3] font-medium w-full"
                                    />
                                </div>
                                <div className="flex flex-row items-center gap-3">
                                    <Button
                                        onClick={handleExportCSV}
                                        className="h-11 bg-white border border-gray-200 text-[#636E72] font-bold hover:bg-green-50 hover:text-primary-green hover:border-green-200 shadow-sm rounded-[6px] flex items-center justify-center transition-all px-5"
                                    >
                                        <FileDown className="w-4 h-4 mr-2" />
                                        <span>Export CSV</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Main User Table */}
                            <div className="-mx-4 md:mx-0 overflow-x-auto">
                                <UserTable
                                    users={filteredUsers}
                                    isLoading={isLoading}
                                    onUsersChanged={loadUsersData}
                                />
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

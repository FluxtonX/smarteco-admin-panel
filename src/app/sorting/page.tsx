"use client";

import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import {
    Sparkles,
    Cpu,
    TrendingUp,
    Award,
    Clock,
    Copy,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    sortingService,
    SortingStats,
    SortingEvent,
    KioskRecord,
} from "@/services/sorting.service";

const CATEGORY_COLORS: Record<string, string> = {
    PLASTIC: "bg-blue-100 text-blue-700",
    ORGANIC: "bg-green-100 text-green-700",
    PAPER: "bg-yellow-100 text-yellow-700",
    GLASS: "bg-cyan-100 text-cyan-700",
    METAL: "bg-orange-100 text-orange-700",
    E_WASTE: "bg-purple-100 text-purple-700",
    LANDFILL: "bg-gray-100 text-gray-700",
    HAZARDOUS: "bg-red-100 text-red-700",
};

const CATEGORY_BAR_COLORS: Record<string, string> = {
    PLASTIC: "bg-blue-500",
    ORGANIC: "bg-green-500",
    PAPER: "bg-yellow-500",
    GLASS: "bg-cyan-500",
    METAL: "bg-orange-500",
    E_WASTE: "bg-purple-500",
    LANDFILL: "bg-gray-500",
    HAZARDOUS: "bg-red-500",
};

export default function AISortingPage() {
    const [stats, setStats] = useState<SortingStats | null>(null);
    const [events, setEvents] = useState<SortingEvent[]>([]);
    const [kiosks, setKiosks] = useState<KioskRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "events" | "kiosks">("overview");
    const [eventPage, setEventPage] = useState(1);
    const [eventMeta, setEventMeta] = useState({ total: 0, totalPages: 0 });
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

    const loadData = useCallback(async (showSpinner = true) => {
        if (showSpinner) setIsLoading(true);
        try {
            const [statsData, eventsData, kiosksData] = await Promise.all([
                sortingService.getStats(),
                sortingService.getEvents({ page: eventPage, limit: 15 }),
                sortingService.getKiosks(),
            ]);
            setStats(statsData);
            setEvents(eventsData.data);
            setEventMeta(eventsData.meta);
            setKiosks(kiosksData);
        } catch (error) {
            console.error("Failed to load sorting data:", error);
        } finally {
            if (showSpinner) setIsLoading(false);
        }
    }, [eventPage]);

    useEffect(() => {
        loadData(true);

        const intervalId = setInterval(() => {
            loadData(false);
        }, 15000);

        return () => clearInterval(intervalId);
    }, [loadData]);

    const copyApiKey = (key: string, kioskId: string) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(kioskId);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const toggleKeyVisibility = (kioskId: string) => {
        setVisibleKeys((prev) => {
            const next = new Set(prev);
            if (next.has(kioskId)) {
                next.delete(kioskId);
            } else {
                next.add(kioskId);
            }
            return next;
        });
    };

    const maxCategoryCount = stats?.byCategory.reduce(
        (max, c) => Math.max(max, c.count),
        0
    ) || 1;

    const tabs = [
        { id: "overview" as const, label: "Overview" },
        { id: "events" as const, label: "Sorting Events" },
        { id: "kiosks" as const, label: "Kiosks & API Keys" },
    ];

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-[22px] font-bold text-[#1A1A1A] tracking-tight leading-none flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                AI Sorting Analytics
                            </h1>
                            <p className="text-[12px] md:text-[13px] text-[#636E72] font-medium mt-1.5">
                                Real-time waste classification intelligence from kiosk sensors
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-bold text-green-700">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Live — 15s refresh
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="bg-white p-1 rounded-[8px] border border-gray-100 shadow-sm inline-flex items-center space-x-1 min-w-max">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "px-4 md:px-6 py-2 rounded-[6px] text-xs font-bold transition-all border",
                                        activeTab === tab.id
                                            ? "bg-purple-50 text-purple-700 border-purple-200 shadow-sm"
                                            : "text-[#636E72] hover:bg-gray-50 border-transparent hover:border-gray-200"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Classifications</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{stats?.totalEvents.toLocaleString() || "—"}</p>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <Award className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Points Awarded</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{stats?.totalPointsAwarded.toLocaleString() || "—"}</p>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Cpu className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Kiosks</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats ? `${stats.kiosks.active} / ${stats.kiosks.total}` : "—"}
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{stats?.byCategory.length || "—"}</p>
                                </div>
                            </div>

                            {/* Category Distribution */}
                            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-900 mb-5">Classification Distribution</h3>
                                {isLoading ? (
                                    <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
                                ) : stats?.byCategory.length ? (
                                    <div className="space-y-3">
                                        {stats.byCategory
                                            .sort((a, b) => b.count - a.count)
                                            .map((cat) => (
                                                <div key={cat.category} className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "text-[11px] font-bold px-2.5 py-1 rounded-full min-w-[80px] text-center",
                                                        CATEGORY_COLORS[cat.category] || "bg-gray-100 text-gray-700"
                                                    )}>
                                                        {cat.category.replace("_", " ")}
                                                    </span>
                                                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all duration-700",
                                                                CATEGORY_BAR_COLORS[cat.category] || "bg-gray-400"
                                                            )}
                                                            style={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-600 min-w-[60px] text-right">
                                                        {cat.count.toLocaleString()}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 min-w-[70px] text-right">
                                                        {cat.avgConfidence}% avg
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                                        No sorting events recorded yet
                                    </div>
                                )}
                            </div>

                            {/* Recent Events */}
                            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Sorting Events</h3>
                                {stats?.recentEvents.length ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Category</th>
                                                    <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Confidence</th>
                                                    <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Kiosk</th>
                                                    <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">User</th>
                                                    <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.recentEvents.map((e) => (
                                                    <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                                        <td className="py-2.5 px-3">
                                                            <span className={cn(
                                                                "text-[11px] font-bold px-2 py-0.5 rounded-full",
                                                                CATEGORY_COLORS[e.category] || "bg-gray-100 text-gray-700"
                                                            )}>
                                                                {e.category.replace("_", " ")}
                                                            </span>
                                                        </td>
                                                        <td className="py-2.5 px-3 text-xs font-semibold text-gray-700">
                                                            {(e.confidence * 100).toFixed(1)}%
                                                        </td>
                                                        <td className="py-2.5 px-3 text-xs text-gray-600">{e.kioskName}</td>
                                                        <td className="py-2.5 px-3 text-xs text-gray-600">{e.userName || "—"}</td>
                                                        <td className="py-2.5 px-3 text-xs text-gray-500">
                                                            {new Date(e.capturedAt).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-8">No events recorded yet</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* EVENTS TAB */}
                    {activeTab === "events" && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-900">
                                        All Sorting Events ({eventMeta.total.toLocaleString()})
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Category</th>
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Confidence</th>
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Kiosk</th>
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Location</th>
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">User</th>
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Captured</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {events.length ? events.map((e) => (
                                                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                                    <td className="py-2.5 px-3">
                                                        <span className={cn(
                                                            "text-[11px] font-bold px-2 py-0.5 rounded-full",
                                                            CATEGORY_COLORS[e.category] || "bg-gray-100 text-gray-700"
                                                        )}>
                                                            {e.category.replace("_", " ")}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3 text-xs font-semibold text-gray-700">
                                                        {(e.confidence * 100).toFixed(1)}%
                                                    </td>
                                                    <td className="py-2.5 px-3 text-xs text-gray-600">{e.kioskName}</td>
                                                    <td className="py-2.5 px-3 text-xs text-gray-500">{e.kioskLocation || "—"}</td>
                                                    <td className="py-2.5 px-3 text-xs text-gray-600">
                                                        {e.user ? e.user.name : "—"}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-xs text-gray-500">
                                                        {new Date(e.capturedAt).toLocaleString()}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                                                        No sorting events found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {eventMeta.totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                        <span className="text-xs text-gray-500">
                                            Page {eventPage} of {eventMeta.totalPages}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEventPage((p) => Math.max(1, p - 1))}
                                                disabled={eventPage <= 1}
                                                className="p-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setEventPage((p) => Math.min(eventMeta.totalPages, p + 1))}
                                                disabled={eventPage >= eventMeta.totalPages}
                                                className="p-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* KIOSKS TAB */}
                    {activeTab === "kiosks" && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-900 mb-4">
                                    Registered Kiosks ({kiosks.length})
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Kiosk ID</th>
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Name</th>
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Location</th>
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">API Key</th>
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Events</th>
                                                <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase">Last Seen</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {kiosks.length ? kiosks.map((k) => (
                                                <tr key={k.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                                    <td className="py-2.5 px-3 text-xs font-mono font-semibold text-gray-700">
                                                        {k.kioskId}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-xs text-gray-700 font-medium">
                                                        {k.name || "—"}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-xs text-gray-500">
                                                        {k.location || "—"}
                                                    </td>
                                                    <td className="py-2.5 px-3">
                                                        <span className={cn(
                                                            "text-[11px] font-bold px-2 py-0.5 rounded-full",
                                                            k.status === "ACTIVE"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                        )}>
                                                            {k.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3">
                                                        {k.apiKey ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <code className="text-[11px] font-mono bg-gray-100 px-2 py-0.5 rounded max-w-[140px] truncate">
                                                                    {visibleKeys.has(k.kioskId)
                                                                        ? k.apiKey
                                                                        : `${k.apiKey.substring(0, 8)}${"•".repeat(12)}`}
                                                                </code>
                                                                <button
                                                                    onClick={() => toggleKeyVisibility(k.kioskId)}
                                                                    className="p-1 hover:bg-gray-100 rounded"
                                                                    title={visibleKeys.has(k.kioskId) ? "Hide" : "Reveal"}
                                                                >
                                                                    {visibleKeys.has(k.kioskId) ? (
                                                                        <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                                                                    ) : (
                                                                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={() => copyApiKey(k.apiKey!, k.kioskId)}
                                                                    className="p-1 hover:bg-gray-100 rounded"
                                                                    title="Copy API key"
                                                                >
                                                                    {copiedKey === k.kioskId ? (
                                                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                                    ) : (
                                                                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">Not set</span>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-xs font-semibold text-gray-700">
                                                        {k.totalEvents.toLocaleString()}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-xs text-gray-500">
                                                        {k.lastSeenAt
                                                            ? new Date(k.lastSeenAt).toLocaleString()
                                                            : "Never"}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={7} className="text-center py-8 text-gray-400 text-sm">
                                                        No kiosks registered
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

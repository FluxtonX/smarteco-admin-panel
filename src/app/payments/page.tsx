"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { LiveStatus } from "@/components/ui/live-status";
import { PaymentStats } from "@/components/payments/payment-stats";
import { RevenueDayChart, RevenueWasteChart } from "@/components/payments/payment-charts";
import { PaymentTable } from "@/components/payments/payment-table";
import {
    paymentService,
    PaymentStat,
    RevenueDayData,
    RevenueWasteData,
    TransactionRecord
} from "@/services/payment.service";

export default function PaymentsPage() {
    const [stats, setStats] = useState<PaymentStat[]>([]);
    const [revenueDay, setRevenueDay] = useState<RevenueDayData[]>([]);
    const [revenueWaste, setRevenueWaste] = useState<RevenueWasteData[]>([]);
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            const [s, d, w, t] = await Promise.all([
                paymentService.getStats(),
                paymentService.getRevenueByDay(),
                paymentService.getRevenueByWaste(),
                paymentService.getTransactions()
            ]);
            setStats(s);
            setRevenueDay(d);
            setRevenueWaste(w);
            setTransactions(t);
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
                    <span className="mt-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest">Loading Payments...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8FAFB] overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
                    {/* Header */}
                    <div className="flex flex-row items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-[28px] font-bold text-[#1A1A1A] tracking-tight">
                                Payment Management
                            </h1>
                            <p className="text-[12px] md:text-[13px] font-medium text-gray-500">
                                Mobile money transaction monitoring
                            </p>
                        </div>
                        <div className="self-start sm:self-auto">
                            <LiveStatus />
                        </div>
                    </div>

                    {/* Stats Row */}
                    <PaymentStats stats={stats} />

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-7">
                            <RevenueDayChart data={revenueDay} />
                        </div>
                        <div className="lg:col-span-5">
                            <RevenueWasteChart data={revenueWaste} />
                        </div>
                    </div>

                    {/* Transactions Table Section */}
                    <div className="overflow-x-auto">
                        <PaymentTable transactions={transactions} />
                    </div>
                </main>
            </div>
        </div>
    );
}

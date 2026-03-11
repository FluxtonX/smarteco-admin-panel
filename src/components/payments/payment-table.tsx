"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, CheckCircle2, XCircle, Clock } from "lucide-react";
import { TransactionRecord } from "@/services/payment.service";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface PaymentTableProps {
    transactions: TransactionRecord[];
}

export function PaymentTable({ transactions }: PaymentTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");

    const filteredTransactions = transactions.filter(tx => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = tx.id.toLowerCase().includes(query) ||
            tx.user.toLowerCase().includes(query) ||
            (tx.momoId && tx.momoId.toLowerCase().includes(query));
        const matchesStatus = statusFilter === "All Status" || tx.webhook === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getMethodStyle = (method: string) => {
        switch (method) {
            case 'MTN MoMo': return "bg-[#FFCC00]/10 text-[#665500] border-[#FFCC00]/20";
            case 'Airtel Money': return "bg-[#D12B2B]/10 text-[#D12B2B] border-[#D12B2B]/20";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed': return "bg-[#DCFCE7] text-[#166534]";
            case 'In Progress': return "bg-[#FEF3C7] text-[#92400E]";
            case 'Pending': return "bg-white text-gray-500 border border-gray-200";
            case 'Failed': return "bg-[#FEE2E2] text-[#991B1B]";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getWebhookStyle = (status: string) => {
        switch (status) {
            case 'Delivered': return "bg-primary-green/10 text-primary-green";
            case 'Pending': return "bg-amber-100 text-amber-600";
            case 'Failed': return "bg-red-100 text-red-600";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search by transaction ID or user..."
                        className="pl-10 h-10 bg-white border-gray-100 text-[13px] placeholder:text-gray-400 focus:ring-primary-green"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="h-10 px-8 border bg-white border-gray-100 text-[13px] font-bold text-[#636E72] flex items-center gap-2 rounded-[2px] hover:bg-gray-50 transition-colors outline-none cursor-pointer">
                        {statusFilter}
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuItem onClick={() => setStatusFilter("All Status")}>All Status</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Delivered")}>Delivered</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Failed")}>Failed</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[8px] border border-gray-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Transaction ID</TableHead>
                            <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">User</TableHead>
                            <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Amount</TableHead>
                            <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Method</TableHead>
                            <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Status</TableHead>
                            <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Timestamp</TableHead>
                            <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Webhook</TableHead>
                            <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions.map((tx) => (
                            <TableRow key={tx.id} className="hover:bg-gray-50/30 transition-colors">
                                <TableCell className="px-6 py-4">
                                    <div className="space-y-0.5">
                                        <div className="text-[12px] font-bold text-[#1A1A1A]">{tx.id}</div>
                                        <div className="text-[10px] font-medium text-gray-400">{tx.momoId}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-[13px] font-semibold text-[#1A1A1A]">{tx.user}</TableCell>
                                <TableCell className="px-6 py-4 text-[13px] font-bold text-[#1A1A1A]">{tx.amount}</TableCell>
                                <TableCell className="px-6 py-4">
                                    <Badge className={cn("px-3 py-1 text-[10px] font-bold rounded-[2px] shadow-none border", getMethodStyle(tx.method))}>
                                        {tx.method}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Badge className={cn("px-4 py-1 text-[10px] font-bold rounded-[2px] shadow-none border-none", getStatusStyle(tx.status))}>
                                        {tx.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-[11px] font-medium text-gray-500 whitespace-nowrap">{tx.timestamp}</TableCell>
                                <TableCell className="px-6 py-4">
                                    <Badge className={cn("px-3 py-1 text-[10px] font-bold rounded-[2px] shadow-none border-none", getWebhookStyle(tx.webhook))}>
                                        {tx.webhook}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <button className="px-4 py-1.5 text-[11px] font-bold text-red-500 border border-red-500 rounded-[2px] hover:bg-red-50 transition-colors uppercase tracking-tight">
                                        Refund
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

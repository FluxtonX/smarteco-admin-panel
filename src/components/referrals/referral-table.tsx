"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Check, X } from "lucide-react";
import { ReferralRecord } from "@/services/referral.service";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ReferralTableProps {
    referrals: ReferralRecord[];
}

export function ReferralTable({ referrals }: ReferralTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");

    const filteredReferrals = referrals.filter(ref => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = ref.id.toLowerCase().includes(query) ||
            ref.referrer.toLowerCase().includes(query) ||
            ref.referredUser.toLowerCase().includes(query) ||
            ref.referralCode.toLowerCase().includes(query);
        const matchesStatus = statusFilter === "All Status" || ref.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Valid': return "bg-[#DCFCE7] text-[#166534]";
            case 'Pending': return "bg-[#FEF3C7] text-[#92400E]";
            case 'Disputed': return "bg-[#FEE2E2] text-[#991B1B]";
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
                        placeholder="Search by referral ID or user..."
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
                        <DropdownMenuItem onClick={() => setStatusFilter("Valid")}>Valid</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Disputed")}>Dispute</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[8px] border border-gray-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Referral ID</TableHead>
                            <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Referrer</TableHead>
                            <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Referral Code</TableHead>
                            <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Referred User</TableHead>
                            <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Status</TableHead>
                            <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4 text-center">Bonus Issued</TableHead>
                            <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Date</TableHead>
                            <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReferrals.map((ref) => (
                            <TableRow key={ref.id} className="hover:bg-gray-50/30 transition-colors">
                                <TableCell className="px-6 py-4 text-[12px] font-bold text-[#1A1A1A]">{ref.id}</TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="space-y-0.5">
                                        <div className="text-[13px] font-semibold text-[#1A1A1A]">{ref.referrer}</div>
                                        <div className="text-[11px] font-medium text-gray-400">{ref.referrerPhone}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Badge variant="outline" className="bg-[#DCFCE7]/20 border-primary-green/20 text-primary-green text-[10px] font-bold rounded-[2px] px-3 py-1">
                                        {ref.referralCode}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-[13px] font-semibold text-[#1A1A1A]">{ref.referredUser}</TableCell>
                                <TableCell className="px-6 py-4">
                                    <Badge className={cn("px-4 py-1.5 text-[10px] font-bold rounded-[2px] shadow-none border-none", getStatusStyle(ref.status))}>
                                        {ref.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-[12px] font-bold text-primary-green text-center">{ref.bonus}</TableCell>
                                <TableCell className="px-6 py-4 text-[11px] font-medium text-gray-500 whitespace-nowrap">{ref.date}</TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {ref.status === 'Pending' && (
                                            <>
                                                <button className="p-1.5 rounded-[4px] border border-primary-green/20 bg-primary-green/5 text-primary-green hover:bg-primary-green hover:text-white transition-all">
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="p-1.5 rounded-[4px] border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        )}
                                        {ref.status === 'Disputed' && (
                                            <button className="px-4 py-1.5 text-[10px] font-bold text-gray-500 border border-gray-200 rounded-[2px] hover:bg-gray-50 transition-all uppercase tracking-tight">
                                                Review
                                            </button>
                                        )}
                                        {ref.status === 'Valid' && (
                                            <span className="text-[10px] font-bold text-gray-300 uppercase italic">Finalized</span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Map } from "lucide-react";
import { BinRecord } from "@/services/bin.service";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BinDetailsModal } from "./bin-details-modal";

interface BinTableProps {
    bins: BinRecord[];
    isLoading: boolean;
}

export function BinTable({ bins, isLoading }: BinTableProps) {
    const [selectedBin, setSelectedBin] = useState<BinRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewBin = (bin: BinRecord) => {
        setSelectedBin(bin);
        setIsModalOpen(true);
    };

    const getTypeBadgeStyle = (type: string) => {
        switch (type) {
            case 'Organic': return "bg-[#DCFCE7] text-[#166534] border-none";
            case 'Recyclable': return "bg-[#DBEAFE] text-[#1E40AF] border-none";
            case 'E-Waste': return "bg-[#F3E8FF] text-[#6B21A8] border-none";
            case 'Glass': return "bg-[#E0F2FE] text-[#075985] border-none";
            case 'Hazardous': return "bg-[#FEE2E2] text-[#991B1B] border-none";
            default: return "bg-gray-100 text-gray-700 border-none";
        }
    };

    const getAlertStatusStyle = (status: string) => {
        switch (status) {
            case 'Critical': return "bg-[#FEE2E2] text-[#991B1B]";
            case 'Full': return "bg-[#FFE4E6] text-[#9F1239]";
            case 'Nearly Full': return "bg-[#FEF3C7] text-[#92400E]";
            case 'Normal': return "bg-[#DCFCE7] text-[#166534]";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getProgressColor = (level: number) => {
        if (level >= 90) return "bg-[#EF4444]";
        if (level >= 75) return "bg-[#F59E0B]";
        return "bg-[#10B981]";
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 font-semibold">Loading bins...</div>;
    }

    return (
        <div className="bg-white rounded-[8px] border border-gray-100 shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-white hover:bg-white border-b border-gray-100">
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-5">Bin ID</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-5">User</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-5">Bin Type</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-5">Fill Level</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-5">Last Emptied</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-5">Alert Status</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-5">Assigned Collector</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-5 text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bins.map((bin) => (
                        <TableRow key={bin.id} className="hover:bg-gray-50/30 border-b border-gray-50 transition-colors">
                            <TableCell className="px-6 py-5 font-bold text-[11px] text-[#2D3436] tracking-tight">{bin.id}</TableCell>
                            <TableCell className="px-6 py-5">
                                <div className="space-y-0.5">
                                    <div className="text-[13px] font-bold text-[#1A1A1A]">{bin.user.name}</div>
                                    <div className="text-[11px] font-medium text-gray-400">{bin.user.address}</div>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-5">
                                <Badge className={cn("px-2.5 py-0.5 font-bold text-[10px] rounded-[4px] shadow-none", getTypeBadgeStyle(bin.type))}>
                                    {bin.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-5">
                                <div className="w-[140px] flex items-center space-x-3">
                                    <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full transition-all duration-500 rounded-full", getProgressColor(bin.fillLevel))}
                                            style={{ width: `${bin.fillLevel}%` }}
                                        />
                                    </div>
                                    <span className={cn(
                                        "text-[11px] font-bold min-w-[30px]",
                                        bin.fillLevel >= 90 ? "text-red-600" : bin.fillLevel >= 75 ? "text-amber-600" : "text-emerald-600"
                                    )}>{bin.fillLevel}%</span>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-5 font-bold text-[11px] text-[#4B5563]">{bin.lastEmptied}</TableCell>
                            <TableCell className="px-6 py-5">
                                <Badge className={cn("px-3 py-1 text-[10px] font-bold rounded-[4px] shadow-none uppercase tracking-wider", getAlertStatusStyle(bin.alertStatus))}>
                                    {bin.alertStatus}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-5">
                                <span className={cn("text-[12px] font-bold", bin.collector === "Unassigned" ? "text-red-500 animate-pulse" : "text-[#1A1A1A]")}>
                                    {bin.collector}
                                </span>
                            </TableCell>
                            <TableCell className="px-6 py-5">
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => handleViewBin(bin)}
                                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-[#166534]"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <BinDetailsModal
                bin={selectedBin}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}


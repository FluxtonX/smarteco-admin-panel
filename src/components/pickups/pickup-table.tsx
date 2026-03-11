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
import { Eye, Pencil, CheckCircle, Clock } from "lucide-react";
import { PickupRecord } from "@/services/pickup.service";
import { cn } from "@/lib/utils";

interface PickupTableProps {
    pickups: PickupRecord[];
    isLoading: boolean;
}

export function PickupTable({ pickups, isLoading }: PickupTableProps) {
    const getWasteBadgeStyle = (type: string) => {
        switch (type) {
            case 'Organic': return "bg-green-50 text-green-700 border-green-100";
            case 'Recyclable': return "bg-blue-50 text-blue-700 border-blue-100";
            case 'E-Waste': return "bg-purple-50 text-purple-700 border-purple-100";
            case 'Glass': return "bg-teal-50 text-teal-700 border-teal-100";
            case 'Hazardous': return "bg-red-50 text-red-700 border-red-100";
            default: return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'En Route': return "bg-blue-50 text-blue-600 border-blue-100";
            case 'Completed': return "bg-green-50 text-green-600 border-green-100";
            case 'Scheduled': return "bg-yellow-50 text-yellow-600 border-yellow-100";
            case 'In Progress': return "bg-sky-50 text-sky-600 border-sky-100";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    const getPaymentStyle = (payment: string) => {
        switch (payment) {
            case 'Paid': return "bg-green-100 text-green-700 border-none";
            case 'Pending': return "bg-yellow-100 text-yellow-700 border-none";
            case 'Failed': return "bg-red-100 text-red-700 border-none";
            default: return "bg-gray-100 text-gray-700 border-none";
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 font-semibold">Loading pickups...</div>;
    }

    return (
        <div className="bg-white rounded-[4px] border border-gray-100 shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-[#F8F9FA] hover:bg-[#F8F9FA] border-b border-gray-100">
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Pickup ID</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">User</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Waste Type</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Weight (kg)</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Collector</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Status</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Payment</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4">Time Slot</TableHead>
                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 py-4 text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pickups.map((pickup) => (
                        <TableRow key={pickup.id} className="hover:bg-gray-50/50 border-b border-gray-50 transition-colors group">
                            <TableCell className="px-6 py-4 font-bold text-[11px] text-[#2D3436] tracking-tight">{pickup.id}</TableCell>
                            <TableCell className="px-6 py-4">
                                <div className="space-y-0.5">
                                    <div className="text-[13px] font-bold text-[#2D3436]">{pickup.user.name}</div>
                                    <div className="text-[11px] font-semibold text-gray-400">{pickup.user.area}</div>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <Badge className={cn("px-3 py-1 font-bold text-[10px] uppercase tracking-wider border rounded-[4px] shadow-none", getWasteBadgeStyle(pickup.wasteType))}>
                                    {pickup.wasteType}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 font-bold text-[13px] text-[#2D3436]">{pickup.weight}</TableCell>
                            <TableCell className="px-6 py-4">
                                <span className={cn("text-[13px] font-bold", pickup.collector === "Unassigned" ? "text-red-500" : "text-[#2D3436]")}>
                                    {pickup.collector}
                                </span>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <Badge className={cn("px-2.5 py-1 text-[11px] font-bold border rounded-[4px] shadow-none", getStatusStyle(pickup.status))}>
                                    {pickup.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <Badge className={cn("px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-[4px] shadow-none", getPaymentStyle(pickup.payment))}>
                                    {pickup.payment}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <div className="flex items-center space-x-2 text-[12px] font-bold text-[#2D3436]">
                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{pickup.timeSlot}</span>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <div className="flex items-center justify-center space-x-3">
                                    <button className="p-1.5 text-gray-400 hover:text-primary-green hover:bg-green-50 rounded-md transition-all">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-all">
                                        <CheckCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

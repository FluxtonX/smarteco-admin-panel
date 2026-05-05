"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";
import { PendingCollector } from "@/services/collector.service";
import { Button } from "@/components/ui/button";

interface PendingCollectorTableProps {
    collectors: PendingCollector[];
    isLoading?: boolean;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export function PendingCollectorTable({ collectors, isLoading, onApprove, onReject }: PendingCollectorTableProps) {
    if (isLoading) {
        return (
            <div className="border border-gray-100 rounded-xl bg-white p-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary-green border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-gray-500">Loading pending collectors...</p>
            </div>
        );
    }

    if (collectors.length === 0) {
        return (
            <div className="border border-gray-100 rounded-xl bg-white p-12 text-center">
                <p className="text-sm font-medium text-gray-500">No pending collectors found.</p>
            </div>
        );
    }

    return (
        <div className="border border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="border-b border-gray-100 h-12">
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collector</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vehicle Plate</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applied Date</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</TableHead>
                        <TableHead className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {collectors.map((collector) => (
                        <TableRow key={collector.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors h-16">
                            <TableCell className="px-6">
                                <span className="text-sm font-bold text-[#2D3436]">{collector.name}</span>
                            </TableCell>
                            <TableCell className="px-6 text-sm font-semibold text-gray-600">{collector.phone}</TableCell>
                            <TableCell className="px-6 text-sm font-bold text-[#2D3436]">{collector.vehiclePlate}</TableCell>
                            <TableCell className="px-6">
                                <div className="flex items-center space-x-1.5 text-gray-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-xs font-semibold">{new Date(collector.createdAt).toLocaleDateString()}</span>
                                </div>
                            </TableCell>
                            <TableCell className="px-6">
                                <Badge className="bg-yellow-100 text-yellow-700 border-none px-3 py-1 text-[10px] font-bold uppercase rounded-[4px]">
                                    {collector.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onApprove(collector.id)}
                                        className="h-8 px-3 border-green-100 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 font-bold text-xs"
                                    >
                                        <Check className="w-3.5 h-3.5 mr-1" />
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onReject(collector.id)}
                                        className="h-8 px-3 border-red-100 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 font-bold text-xs"
                                    >
                                        <X className="w-3.5 h-3.5 mr-1" />
                                        Reject
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

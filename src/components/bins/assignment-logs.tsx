"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { binService, AssignmentRecord } from "@/services/bin.service";
import { AssignmentDetailsModal } from "@/components/bins/assignment-details-modal";
import { cn } from "@/lib/utils";

export function AssignmentLogs() {
    const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState<AssignmentRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            const data = await binService.getAssignments();
            setAssignments(data);
            setIsLoading(false);
        }
        loadData();
    }, []);

    const handleViewAssignment = (assignment: AssignmentRecord) => {
        setSelectedAssignment(assignment);
        setIsModalOpen(true);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'In Progress': return "bg-[#FEF3C7] text-[#92400E] border-none";
            case 'Completed': return "bg-[#DCFCE7] text-[#166534] border-none";
            case 'Pending': return "bg-white text-[#636E72] border border-gray-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 font-semibold animate-pulse">Loading assignments...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-[18px] font-bold text-[#1A1A1A] tracking-tight">Recent Collector Assignments</h2>

            <div className="bg-white rounded-[8px] border border-gray-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white hover:bg-white border-b border-gray-100">
                            <TableHead className="text-[10px] font-bold text-[#636E72] uppercase tracking-widest px-6 py-5">Bin ID</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#636E72] uppercase tracking-widest px-6 py-5">Collector</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#636E72] uppercase tracking-widest px-6 py-5">Assigned At</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#636E72] uppercase tracking-widest px-6 py-5">Status</TableHead>
                            <TableHead className="text-[10px] font-bold text-[#636E72] uppercase tracking-widest px-6 py-5 text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignments.map((log, idx) => (
                            <TableRow key={idx} className="hover:bg-gray-50/30 border-b border-gray-50 transition-colors">
                                <TableCell className="px-6 py-5 font-bold text-[11px] text-[#2D3436] tracking-tight">{log.binId}</TableCell>
                                <TableCell className="px-6 py-5 text-[13px] font-bold text-[#1A1A1A]">{log.collector}</TableCell>
                                <TableCell className="px-6 py-5 text-[12px] font-medium text-gray-500">{log.assignedAt}</TableCell>
                                <TableCell className="px-6 py-5">
                                    <Badge className={cn("px-4 py-1.5 text-[10px] font-bold rounded-[4px] shadow-none min-w-[100px] flex justify-center", getStatusStyle(log.status))}>
                                        {log.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-5">
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => handleViewAssignment(log)}
                                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-primary-green"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AssignmentDetailsModal
                assignment={selectedAssignment}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

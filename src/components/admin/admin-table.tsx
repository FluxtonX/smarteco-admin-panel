"use client";

import { useState } from "react";
import { AdminRecord, AdminRole } from "@/services/admin.service";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Pencil, Trash2 } from "lucide-react";

interface AdminTableProps {
    admins: AdminRecord[];
    onEdit?: (admin: AdminRecord) => void;
    onDelete?: (id: string) => void;
}

const ROLE_STYLES: Record<AdminRole, string> = {
    "Super Admin": "bg-red-100 text-red-700 border border-red-200",
    "Operations Manager": "bg-blue-100 text-blue-700 border border-blue-200",
    "Finance Admin": "bg-teal-100 text-teal-700 border border-teal-200",
    "IoT Supervisor": "bg-indigo-100 text-indigo-700 border border-indigo-200",
    "Support Agent": "bg-orange-100 text-orange-700 border border-orange-200",
};

export function AdminTable({ admins, onEdit, onDelete }: AdminTableProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [adminToDelete, setAdminToDelete] = useState<AdminRecord | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = async () => {
        if (!adminToDelete) return;
        setIsDeleting(true);
        await onDelete?.(adminToDelete.id);
        setIsDeleting(false);
        setAdminToDelete(null);
    };

    return (
        <>
            <Card className="border-gray-200 shadow-sm rounded-[4px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/80">
                                {["ADMIN ID", "NAME", "EMAIL", "ROLE", "PERMISSIONS", "STATUS", "TIMESTAMP", ""].map((h) => (
                                    <th
                                        key={h}
                                        className="px-5 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {admins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors group">
                                    {/* ID */}
                                    <td className="px-5 py-4 text-[11px] font-bold text-gray-400 tracking-widest whitespace-nowrap font-mono">
                                        {admin.id}
                                    </td>
                                    {/* Name */}
                                    <td className="px-5 py-4 text-[13px] font-semibold text-gray-800 whitespace-nowrap">
                                        {admin.name}
                                    </td>
                                    {/* Email */}
                                    <td className="px-5 py-4 text-[13px] font-medium text-gray-500 whitespace-nowrap">
                                        {admin.email}
                                    </td>
                                    {/* Role badge */}
                                    <td className="px-5 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-[2px] text-[11px] font-bold whitespace-nowrap",
                                            ROLE_STYLES[admin.role]
                                        )}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    {/* Permissions */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {admin.permissions.map((p) => (
                                                <span
                                                    key={p}
                                                    className={cn(
                                                        "px-2.5 py-0.5 rounded-[2px] text-[11px] font-semibold whitespace-nowrap",
                                                        p === "All Permissions"
                                                            ? "bg-gray-100 text-gray-600 border border-gray-200"
                                                            : p.startsWith("+")
                                                                ? "bg-gray-100 text-gray-500 border border-gray-200"
                                                                : "bg-green-50 text-green-700 border border-green-100"
                                                    )}
                                                >
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-[2px] text-[11px] font-bold",
                                            admin.status === "Active"
                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                : "bg-gray-100 text-gray-500 border border-gray-200"
                                        )}>
                                            {admin.status}
                                        </span>
                                    </td>
                                    {/* Timestamp */}
                                    <td className="px-5 py-4 text-[12px] font-medium text-gray-400 whitespace-nowrap">
                                        {admin.timestamp}
                                    </td>
                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 transition-opacity">
                                            <button
                                                onClick={() => onEdit?.(admin)}
                                                className="p-1.5 text-gray-400 hover:text-primary-green hover:bg-green-50 rounded-[2px] transition-all border border-transparent hover:border-green-100"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setAdminToDelete(admin)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-[2px] transition-all border border-transparent hover:border-red-100"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={!!adminToDelete} onOpenChange={(open) => !open && setAdminToDelete(null)}>
                <DialogContent showCloseButton={false} className="sm:max-w-[400px] p-0 border-none rounded-[4px] overflow-hidden bg-white shadow-2xl">
                    <div className="p-8 space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                                <AlertTriangle className="w-7 h-7 text-red-500" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-[18px] font-bold text-gray-800">Confirm Deletion</h2>
                                <p className="text-[13px] font-medium text-gray-500 leading-relaxed px-2">
                                    Are you sure you want to delete <span className="text-gray-900 font-bold">{adminToDelete?.name}</span>? This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="h-11 bg-red-500 hover:bg-red-600 text-white font-bold text-[12px] uppercase tracking-widest rounded-[2px] shadow-lg shadow-red-200 transition-all border-none"
                            >
                                {isDeleting ? "Deleting..." : "Confirm Deletion"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setAdminToDelete(null)}
                                disabled={isDeleting}
                                className="h-11 bg-white border border-gray-200 text-gray-500 font-bold text-[12px] uppercase tracking-widest rounded-[2px] hover:bg-gray-50 transition-all shadow-sm"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

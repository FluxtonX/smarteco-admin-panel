"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { AdminStatsGrid } from "@/components/admin/admin-stats";
import { AdminTable } from "@/components/admin/admin-table";
import { RolePermissionMatrixTable } from "@/components/admin/role-permission-matrix";
import { Button } from "@/components/ui/button";
import {
    adminService,
    AdminRecord,
    AdminStats,
    RolePermissionMatrix,
    AdminRole,
    AdminStatus,
} from "@/services/admin.service";
import { Plus, X, UserPlus } from "lucide-react";

const ROLES: AdminRole[] = [
    "Super Admin",
    "Operations Manager",
    "Finance Admin",
    "IoT Supervisor",
    "Support Agent",
];

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState<AdminRecord[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [matrix, setMatrix] = useState<RolePermissionMatrix[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Add Admin form state
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "Operations Manager" as AdminRole,
        status: "Active" as AdminStatus,
        permissions: [] as string[],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([
            adminService.getAdmins(),
            adminService.getStats(),
            adminService.getPermissionMatrix(),
        ]).then(([a, s, m]) => {
            setAdmins(a);
            setStats(s);
            setMatrix(m);
            setIsLoading(false);
        });
    }, []);

    const handleAddAdmin = async () => {
        if (!form.name || !form.email) return;
        setIsSubmitting(true);
        const newAdmin = await adminService.createAdmin({
            name: form.name,
            email: form.email,
            role: form.role,
            status: form.status,
            permissions: form.permissions.length ? form.permissions : [form.role],
        });
        const [a, s] = await Promise.all([adminService.getAdmins(), adminService.getStats()]);
        setAdmins(a);
        setStats(s);
        setIsSubmitting(false);
        setShowModal(false);
        setForm({ name: "", email: "", role: "Operations Manager", status: "Active", permissions: [] });
    };

    const handleDelete = async (id: string) => {
        await adminService.deleteAdmin(id);
        const [a, s] = await Promise.all([adminService.getAdmins(), adminService.getStats()]);
        setAdmins(a);
        setStats(s);
    };

    if (isLoading || !stats) {
        return (
            <div className="flex h-screen bg-[#F8FAFB] overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin" />
                    <span className="mt-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8FAFB] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <main className="flex-1 overflow-y-auto animate-in fade-in duration-700">
                    {/* Page Header */}
                    <div className="px-8 pt-8 pb-6 flex items-start justify-between">
                        <div className="space-y-1">
                            <h1 className="text-[28px] font-bold text-gray-800 tracking-tight leading-none">Admin Management</h1>
                            <p className="text-[14px] font-medium text-gray-400">{admins.length} admin account{admins.length !== 1 ? "s" : ""}</p>
                        </div>
                        <Button
                            onClick={() => setShowModal(true)}
                            className="h-10 px-5 bg-primary-green hover:bg-[#15803D] text-[12px] font-bold rounded-[4px] shadow-lg shadow-green-200/50 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Admin
                        </Button>
                    </div>

                    <div className="px-8 pb-10 space-y-8">
                        {/* Stats Cards */}
                        <AdminStatsGrid stats={stats} />

                        {/* Admin Table */}
                        <AdminTable
                            admins={admins}
                            onDelete={handleDelete}
                        />

                        {/* Role Permission Matrix */}
                        <RolePermissionMatrixTable matrix={matrix} />
                    </div>
                </main>
            </div>

            {/* Add Admin Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-[4px] border border-gray-200 shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-[4px] bg-green-50 flex items-center justify-center">
                                    <UserPlus className="w-4 h-4 text-primary-green" />
                                </div>
                                <h2 className="text-[16px] font-bold text-gray-800">Add New Admin</h2>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-[2px] transition-all border border-transparent hover:border-gray-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-7 py-6 space-y-5">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full h-10 border border-gray-300 rounded-[2px] px-4 text-[13px] font-medium text-gray-700 outline-none hover:border-gray-400 focus:border-primary-green focus:ring-1 focus:ring-primary-green/20 transition-all placeholder:text-gray-300"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">Email</label>
                                <input
                                    type="email"
                                    placeholder="admin@smarteco.rw"
                                    className="w-full h-10 border border-gray-300 rounded-[2px] px-4 text-[13px] font-medium text-gray-700 outline-none hover:border-gray-400 focus:border-primary-green focus:ring-1 focus:ring-primary-green/20 transition-all placeholder:text-gray-300"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">Role</label>
                                <select
                                    className="w-full h-10 border border-gray-300 rounded-[2px] px-4 text-[13px] font-medium text-gray-600 outline-none hover:border-gray-400 focus:border-primary-green focus:ring-1 focus:ring-primary-green/20 transition-all bg-white"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
                                >
                                    {ROLES.map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">Status</label>
                                <div className="flex gap-3">
                                    {(["Active", "Inactive"] as AdminStatus[]).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setForm({ ...form, status: s })}
                                            className={`flex-1 h-9 border rounded-[2px] text-[12px] font-bold transition-all ${form.status === s
                                                    ? s === "Active"
                                                        ? "bg-green-50 border-green-300 text-green-700"
                                                        : "bg-gray-100 border-gray-300 text-gray-600"
                                                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-7 py-5 border-t border-gray-100 flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowModal(false)}
                                className="h-9 px-5 border-gray-200 text-[12px] font-bold text-gray-500 rounded-[2px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddAdmin}
                                disabled={isSubmitting || !form.name || !form.email}
                                className="h-9 px-6 bg-primary-green hover:bg-[#15803D] text-[12px] font-bold rounded-[2px] disabled:opacity-50"
                            >
                                {isSubmitting ? "Adding..." : "Add Admin"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

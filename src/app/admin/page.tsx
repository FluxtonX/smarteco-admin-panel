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
    "Waste Management (COPED)",
    "Operations Manager",
    "Finance Admin",
    "IoT Supervisor",
    "Support Agent",
    "Customer",
];

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState<AdminRecord[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [matrix, setMatrix] = useState<RolePermissionMatrix[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Add Admin form state
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
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

    const [errorMsg, setErrorMsg] = useState("");

    const handleAddAdmin = async () => {
        if (!form.name || !form.email) return;
        setIsSubmitting(true);
        setErrorMsg("");
        try {
            await adminService.createAdmin({
                name: form.name,
                email: form.email,
                phone: form.phone,
                password: form.password,
                role: form.role,
                status: form.status,
                permissions: form.permissions.length ? form.permissions : [form.role],
            });
            const [a, s] = await Promise.all([adminService.getAdmins(), adminService.getStats()]);
            setAdmins(a);
            setStats(s);
            setShowModal(false);
            setForm({ name: "", email: "", phone: "", password: "", role: "Operations Manager", status: "Active", permissions: [] });
        } catch (err: any) {
            console.error("Failed to create admin account in database:", err);
            setErrorMsg(err.message || "Failed to create admin account in database.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const target = admins.find(a => a.id === id || a.rawId === id);
            const rawId = target?.rawId || id;
            await adminService.deleteAdmin(rawId);
            const [a, s] = await Promise.all([adminService.getAdmins(), adminService.getStats()]);
            setAdmins(a);
            setStats(s);
        } catch (err: any) {
            console.error("Failed to delete admin record from database:", err);
        }
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
        <div className="flex h-screen bg-[#F8FAFB] overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto animate-in fade-in duration-700">
                    {/* Page Header */}
                    <div className="px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 flex flex-row items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-[28px] font-bold text-gray-800 tracking-tight leading-none">Admin Management</h1>
                            <p className="text-[12px] md:text-[14px] font-medium text-gray-400">{admins.length} admin account{admins.length !== 1 ? "s" : ""}</p>
                        </div>
                        <Button
                            onClick={() => setShowModal(true)}
                            className="h-10 px-5 bg-primary-green hover:bg-[#15803D] text-[12px] font-bold rounded-[6px] shadow-md shadow-green-200/50 flex items-center justify-center gap-2 w-auto"
                        >
                            <Plus className="w-4 h-4" />
                            Add Admin
                        </Button>
                    </div>

                    <div className="px-4 md:px-8 pb-10 space-y-6 md:space-y-8">
                        {/* Stats Cards */}
                        <AdminStatsGrid stats={stats} />

                        {/* Admin Table */}
                        <div className="overflow-x-auto">
                            <AdminTable
                                admins={admins}
                                onDelete={handleDelete}
                            />
                        </div>

                        {/* Role Permission Matrix */}
                        <div className="overflow-x-auto">
                            <RolePermissionMatrixTable matrix={matrix} />
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Admin Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[12px] border border-gray-200 shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8FAFC]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-[6px] bg-green-100 flex items-center justify-center">
                                    <UserPlus className="w-4 h-4 text-[#166534]" />
                                </div>
                                <h2 className="text-[16px] font-bold text-gray-800">Add New Admin</h2>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
                            {errorMsg && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-[6px]">
                                    {errorMsg}
                                </div>
                            )}

                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Fabrice Nkurunziza"
                                    className="w-full h-10 border border-gray-300 rounded-[6px] px-3.5 text-xs font-bold text-gray-800 outline-none hover:border-gray-400 focus:border-primary-green transition-all"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="ops.manager@smarteco.rw"
                                    className="w-full h-10 border border-gray-300 rounded-[6px] px-3.5 text-xs font-bold text-gray-800 outline-none hover:border-gray-400 focus:border-primary-green transition-all"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Phone Number</label>
                                <input
                                    type="text"
                                    placeholder="+250 788 123 456"
                                    className="w-full h-10 border border-gray-300 rounded-[6px] px-3.5 text-xs font-bold text-gray-800 outline-none hover:border-gray-400 focus:border-primary-green transition-all"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Default Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full h-10 border border-gray-300 rounded-[6px] px-3.5 text-xs font-bold text-gray-800 outline-none hover:border-gray-400 focus:border-primary-green transition-all"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                            </div>

                            {/* Role */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Assigned Sub-Role</label>
                                <select
                                    className="w-full h-10 border border-gray-300 rounded-[6px] px-3.5 text-xs font-bold text-gray-800 outline-none hover:border-gray-400 focus:border-primary-green bg-white"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
                                >
                                    {ROLES.map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Account Status</label>
                                <div className="flex gap-3">
                                    {(["Active", "Inactive"] as AdminStatus[]).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setForm({ ...form, status: s })}
                                            className={`flex-1 h-9 rounded-[6px] text-xs font-bold transition-all border ${form.status === s
                                                ? s === "Active"
                                                    ? "bg-[#DCFCE7] border-[#86EFAC] text-[#166534]"
                                                    : "bg-gray-100 border-gray-300 text-gray-700"
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
                        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50">
                            <Button
                                variant="outline"
                                onClick={() => setShowModal(false)}
                                className="h-10 px-5 border-gray-200 text-xs font-bold text-gray-600 rounded-[6px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddAdmin}
                                disabled={isSubmitting || !form.name || !form.email}
                                className="h-10 px-6 bg-primary-green hover:bg-[#15803D] text-xs font-bold rounded-[6px] text-white shadow-md shadow-primary-green/20 disabled:opacity-50"
                            >
                                {isSubmitting ? "Creating..." : "Create Admin Role"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

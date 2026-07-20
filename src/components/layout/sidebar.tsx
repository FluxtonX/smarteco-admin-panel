"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Truck,
    Trash2,
    Award,
    CreditCard,
    Share2,
    FileText,
    Settings,
    UserCog,
    History,
    Info,
    Package,
    CheckCircle,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentUserRole, setCurrentUserRole, hasRoutePermission, AdminRole } from "@/lib/permissions";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Users", href: "/users" },
    { icon: Truck, label: "Collectors", href: "/collectors" },
    { icon: Package, label: "Pickup Management", href: "/pickups" },
    { icon: Trash2, label: "Smart Bins (IoT)", href: "/bins" },
    { icon: Award, label: "EcoPoints & Rewards", href: "/rewards" },
    { icon: CreditCard, label: "Payments", href: "/payments" },
    { icon: Share2, label: "Referral System", href: "/referrals" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Settings, label: "System Settings", href: "/settings" },
    { icon: UserCog, label: "Admin Management", href: "/admin" },
    { icon: History, label: "Audit Logs", href: "/audit" },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [currentRole, setRoleState] = useState<AdminRole>("Super Admin");

    useEffect(() => {
        setRoleState(getCurrentUserRole());
    }, []);

    const handleRoleChange = (newRole: AdminRole) => {
        setCurrentUserRole(newRole);
        setRoleState(newRole);
    };

    const visibleMenuItems = menuItems.filter(item => hasRoutePermission(currentRole, item.href));

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-200 flex flex-col pt-4 transition-transform duration-300 lg:relative lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Sidebar Logo Section */}
                <div className="px-6 mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-green flex items-center justify-center">
                            <Trash2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">SmartEco</h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Operations Portal</p>
                        </div>
                    </div>

                    {/* Role Switcher Badge */}
                    <div className="mt-4 p-2 bg-[#F8FAFB] rounded-[6px] border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 min-w-0">
                            <Shield className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                            <span className="text-[10px] font-bold text-gray-700 truncate">{currentRole}</span>
                        </div>
                        <select
                            value={currentRole}
                            onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
                            className="text-[9px] font-bold bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-600 outline-none cursor-pointer"
                        >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Operations Manager">Ops Manager</option>
                            <option value="Finance Admin">Finance</option>
                            <option value="IoT Supervisor">IoT Super</option>
                            <option value="Support Agent">Support</option>
                        </select>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    {visibleMenuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                                    isActive
                                        ? "bg-primary-green text-white shadow-md shadow-green-100"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                                <span className="text-sm font-semibold">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer Branding */}
                <div className="p-6 border-t border-gray-100">
                    <div className="flex flex-col items-center justify-center text-center space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Government of Rwanda</p>
                        <p className="text-[9px] text-gray-500 font-medium">Ministry of Environment</p>
                    </div>
                </div>
            </div>
        </>
    );
}

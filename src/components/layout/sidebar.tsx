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
    Package,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentUserRole, hasRoutePermission, AdminRole } from "@/lib/permissions";
import { userService } from "@/services/user.service";

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
        userService.getProfile().then(profile => {
            if (profile && (profile as any).subRole) {
                setRoleState((profile as any).subRole as AdminRole);
            }
        }).catch(() => {});
    }, []);

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
                "fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-200 flex flex-col pt-4 transition-transform duration-300 lg:relative lg:translate-x-0 font-sans",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Sidebar Logo Section */}
                <div className="px-6 mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-green flex items-center justify-center shadow-md shadow-green-100">
                            <Trash2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">SmartEco</h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Operations Portal</p>
                        </div>
                    </div>

                    {/* Authenticated Admin Role Badge (Read-Only) */}
                    <div className="mt-4 p-2.5 bg-[#F0FDF4] rounded-[6px] border border-[#DCFCE7] flex items-center justify-between shadow-sm">
                        <div className="flex items-center space-x-2 min-w-0">
                            <Shield className="w-4 h-4 text-[#166534] shrink-0" />
                            <span className="text-xs font-bold text-[#166534] truncate">{currentRole}</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
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
                                        ? "bg-primary-green text-white shadow-md shadow-green-100 font-bold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold text-sm"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

            </div>
        </>
    );
}

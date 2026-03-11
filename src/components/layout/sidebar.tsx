"use client";

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
    CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-[260px] min-h-screen bg-white border-r border-gray-200 flex flex-col pt-4">
            {/* Sidebar Logo Section */}
            <div className="px-6 mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-green flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">SmartEco</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Operations Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
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
    );
}

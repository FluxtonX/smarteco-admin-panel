"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSearch } from "@/context/search-context";

export function Topbar() {
    const { searchQuery, setSearchQuery } = useSearch();

    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search users, pickups, collectors, bins..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-all text-sm w-full"
                    />
                </div>
            </div>

            {/* Right Actions Section */}
            <div className="flex items-center space-x-6">
                {/* System Status Label */}
                <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-none px-3 py-1 flex items-center space-x-1.5 font-bold text-[11px] uppercase tracking-wide rounded-[4px]">
                    <div className="w-1.5 h-1.5 rounded-[2px] bg-green-600 animate-pulse" />
                    <span>All Systems Operational</span>
                </Badge>

                {/* Notification Bell with Badge */}
                <div className="relative cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-[2px] border-2 border-white">
                        3
                    </span>
                </div>

                {/* User Profile Info */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded-md transition-all group outline-none focus:ring-2 focus:ring-primary-green/20 border-none bg-transparent">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-green transition-colors">John Mugisha</p>
                            <div className="flex items-center justify-end text-[10px] text-gray-500 font-semibold uppercase tracking-tight">
                                <div className="w-1.5 h-1.5 rounded-[2px] bg-orange-500 mr-1" />
                                Super Admin
                            </div>
                        </div>
                        <Avatar className="h-9 w-9 border-2 border-primary-green/20 ring-1 ring-white rounded-md">
                            <AvatarImage src="/avatar.jpg" alt="John Mugisha" className="rounded-md" />
                            <AvatarFallback className="bg-primary-green text-white font-bold text-xs uppercase rounded-md">JM</AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                        <DropdownMenuItem>Security Status</DropdownMenuItem>
                        <DropdownMenuItem>Admin Logs</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 font-semibold">Sign Out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

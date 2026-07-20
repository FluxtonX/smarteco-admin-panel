"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Eye,
    Pencil,
    MapPin,
    Phone,
    User,
    Shield,
    Zap,
    Building2,
    Home,
    CheckCircle2,
    AlertCircle,
    Trash2,
    AlertTriangle,
    Ban
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRecord, userService } from "@/services/user.service";
import { UserDetailsModal } from "./user-details-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UserTableProps {
    users: UserRecord[];
    isLoading?: boolean;
    onUsersChanged?: () => void;
}

export function UserTable({ users, isLoading, onUsersChanged }: UserTableProps) {
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
    // Delete Confirmation Modal State
    const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        const rawId = userToDelete.rawId || userToDelete.id;
        await userService.deleteUser(rawId);
        setIsDeleting(false);
        setUserToDelete(null);
        if (onUsersChanged) onUsersChanged();
    };

    const handleToggleStatus = async (user: UserRecord) => {
        const rawId = user.rawId || user.id;
        await userService.toggleUserStatus(rawId);
        if (onUsersChanged) onUsersChanged();
    };

    if (isLoading) {
        return (
            <div className="border border-gray-100 rounded-xl bg-white p-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 rounded-sm border-2 border-primary-green border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-gray-500">Loading users...</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="border border-gray-100 rounded-xl bg-white p-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">No users found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden font-sans">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="hover:bg-transparent border-gray-100">
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6 py-4">User ID</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6">Name</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6">Phone</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6">Type</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6">Tier</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6 text-center">EcoPoints</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6 text-center">Pickups</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6">Status</TableHead>
                        <TableHead className="text-[11px] font-bold text-gray-500 uppercase px-6 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50/50 border-gray-100 group transition-colors">
                            <TableCell className="px-6 py-4">
                                <span className="text-[10px] font-semibold text-primary-green bg-green-50 px-2 py-0.5 rounded-[4px] border border-green-100/50 uppercase">{user.id}</span>
                            </TableCell>
                            <TableCell className="px-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#1A1A1A] group-hover:text-primary-green transition-colors">{user.name}</span>
                                    <div className="flex items-center text-[10px] text-[#636E72] font-semibold mt-0.5 uppercase">
                                        <MapPin className="w-3 h-3 mr-1 text-[#B2BEC3]" />
                                        {user.location}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="px-4">
                                <div className="flex items-center text-xs font-semibold text-[#636E72]">
                                    <Phone className="w-3 h-3 mr-2 text-[#B2BEC3]" />
                                    {user.phone}
                                </div>
                            </TableCell>
                            <TableCell className="px-4">
                                <Badge className={cn(
                                    "px-2 py-0.5 text-[9px] font-bold uppercase border-none rounded-[4px] flex items-center w-fit space-x-1 shadow-sm",
                                    user.type === "Business" ? "bg-purple-100/50 text-purple-700" : "bg-blue-100/50 text-blue-700"
                                )}>
                                    {user.type === "Business" ? <Building2 className="w-2.5 h-2.5" /> : <Home className="w-2.5 h-2.5" />}
                                    <span>{user.type}</span>
                                </Badge>
                            </TableCell>
                            <TableCell className="px-4">
                                <div className="flex items-center space-x-1.5">
                                    <Shield className={cn(
                                        "w-3.5 h-3.5",
                                        user.tier === "Eco Champion" ? "text-[#E67E22]" : user.tier === "Eco Warrior" ? "text-[#3498DB]" : "text-[#BDC3C7]"
                                    )} />
                                    <span className="text-xs font-bold text-[#2D3436] whitespace-nowrap">{user.tier}</span>
                                </div>
                            </TableCell>
                            <TableCell className="px-4 text-center">
                                <div className="inline-flex items-center space-x-1 bg-yellow-50 px-2.5 py-1 rounded-[4px] border border-yellow-100 shadow-sm">
                                    <Zap className="w-3 h-3 text-[#F1C40F] fill-[#F1C40F]" />
                                    <span className="text-[11px] font-bold text-[#D4AC0D]">{user.points}</span>
                                </div>
                            </TableCell>
                            <TableCell className="px-4 text-center">
                                <span className="text-sm font-bold text-[#2D3436]">{user.pickups}</span>
                            </TableCell>
                            <TableCell className="px-4">
                                <Badge
                                    onClick={() => handleToggleStatus(user)}
                                    className={cn(
                                        "px-2 py-0.5 text-[9px] font-bold uppercase border-none rounded-[4px] flex items-center w-fit space-x-1 shadow-sm cursor-pointer hover:opacity-80 transition-opacity",
                                        user.status === "Active" ? "bg-green-100/50 text-green-700" : "bg-red-100/50 text-red-700"
                                    )}
                                >
                                    {user.status === "Active" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                                    <span>{user.status}</span>
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-2">
                                    {/* View Details */}
                                    <button
                                        onClick={() => { setSelectedUser(user); setIsDetailsOpen(true); }}
                                        title="View Profile Details"
                                        className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-[4px] border border-gray-100 shadow-sm transition-all text-[#B2BEC3] hover:border-blue-200"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    {/* Edit Profile */}
                                    <button
                                        onClick={() => { setSelectedUser(user); setIsDetailsOpen(true); }}
                                        title="Edit User Profile"
                                        className="p-1.5 hover:bg-green-50 hover:text-green-600 rounded-[4px] border border-gray-100 shadow-sm transition-all text-[#B2BEC3] hover:border-green-200"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    {/* Delete User */}
                                    <button
                                        onClick={() => setUserToDelete(user)}
                                        title="Delete User"
                                        className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-[4px] border border-gray-100 shadow-sm transition-all text-[#B2BEC3] hover:border-red-200"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* View/Edit User Modal */}
            <UserDetailsModal
                user={selectedUser}
                isOpen={isDetailsOpen}
                onClose={() => {
                    setIsDetailsOpen(false);
                    setTimeout(() => setSelectedUser(null), 200);
                }}
                onUserUpdated={() => {
                    if (onUsersChanged) onUsersChanged();
                }}
            />

            {/* Delete Confirmation Popup Dialog */}
            <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
                <DialogContent showCloseButton={false} className="sm:max-w-[420px] p-6 bg-white rounded-xl shadow-2xl font-sans">
                    <DialogHeader className="flex flex-col items-center text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-1">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-gray-900">Delete User Account?</DialogTitle>
                    </DialogHeader>

                    <div className="py-2 text-center text-xs text-gray-600 space-y-1">
                        <p>Are you sure you want to permanently delete user account:</p>
                        <p className="font-bold text-gray-900 text-sm">{userToDelete?.name} ({userToDelete?.id})</p>
                        <p className="text-red-500 font-semibold pt-1">This action cannot be undone.</p>
                    </div>

                    <div className="flex items-center space-x-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setUserToDelete(null)}
                            className="flex-1 h-10 rounded-[6px] border-gray-200 text-gray-700 font-bold text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="flex-1 h-10 rounded-[6px] bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm"
                        >
                            {isDeleting ? "Deleting..." : "Delete User"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

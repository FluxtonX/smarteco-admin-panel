import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Ban, CheckCircle, CheckCircle2, AlertCircle, Save, Edit3 } from "lucide-react";
import { UserRecord, userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UserDetailsModalProps {
    user: UserRecord | null;
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated?: (updatedUser: UserRecord) => void;
}

export function UserDetailsModal({ user, isOpen, onClose, onUserUpdated }: UserDetailsModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state for editing
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        type: "Residential" as "Residential" | "Business",
        tier: "Eco Starter",
        points: 0,
        status: "Active" as "Active" | "Suspended",
        location: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                phone: user.phone,
                type: user.type,
                tier: user.tier,
                points: user.points,
                status: user.status,
                location: user.location || "Kigali, Rwanda"
            });
            setIsEditing(false);
        }
    }, [user]);

    if (!user) return null;

    const handleToggleStatus = async () => {
        setIsSaving(true);
        const newStatus: "Active" | "Suspended" = formData.status === "Active" ? "Suspended" : "Active";
        const rawId = user.rawId || user.id;
        await userService.toggleUserStatus(rawId);
        const updated: UserRecord = { ...user, ...formData, status: newStatus };
        setFormData({ ...formData, status: newStatus });
        if (onUserUpdated) onUserUpdated(updated);
        setIsSaving(false);
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        const rawId = user.rawId || user.id;
        await userService.updateUserAdmin(rawId, formData);
        const updated: UserRecord = { ...user, ...formData };
        if (onUserUpdated) onUserUpdated(updated);
        setIsEditing(false);
        setIsSaving(false);
    };

    const isSuspended = formData.status === "Suspended";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="sm:max-w-[620px] p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-xl h-auto flex flex-col font-sans">
                {/* Header */}
                <DialogHeader className="px-6 py-5 border-b border-gray-100 flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle className="text-xl font-bold text-[#1A1A1A]">{user.name}</DialogTitle>
                        <p className="text-[11px] font-semibold text-gray-400 mt-0.5">Edit user profile & permissions</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={cn(
                                "px-3 py-1.5 rounded-[6px] text-xs font-bold flex items-center space-x-1.5 transition-all border",
                                isEditing ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent"
                            )}
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{isEditing ? "View Details" : "Edit Profile"}</span>
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </DialogHeader>

                {/* Body Content */}
                <div className="px-6 py-5 space-y-6 flex-1 overflow-y-auto">
                    {/* ID & Status Bar */}
                    <div className="bg-[#f8f9fa] rounded-[6px] p-4 flex items-center justify-between border border-gray-100">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">User ID</p>
                            <p className="text-sm font-extrabold text-[#1A1A1A]">{user.id}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</p>
                            <p className="text-xs font-bold text-[#2D3436]">{formData.location}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-right">Account Status</p>
                            <Badge className={cn(
                                "px-3 py-1 text-[10px] font-bold uppercase border-none rounded-[4px] flex items-center gap-1 shadow-sm",
                                isSuspended ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                            )}>
                                {isSuspended ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                {formData.status}
                            </Badge>
                        </div>
                    </div>

                    {isEditing ? (
                        /* Edit Form Fields */
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full h-10 border border-gray-300 rounded-[6px] px-3 text-xs font-bold text-gray-800 outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green/20"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full h-10 border border-gray-300 rounded-[6px] px-3 text-xs font-bold text-gray-800 outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Account Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full h-10 border border-gray-300 rounded-[6px] px-3 text-xs font-bold text-gray-800 outline-none focus:border-primary-green bg-white"
                                    >
                                        <option value="Residential">Residential</option>
                                        <option value="Business">Business</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Eco Tier</label>
                                    <select
                                        value={formData.tier}
                                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                                        className="w-full h-10 border border-gray-300 rounded-[6px] px-3 text-xs font-bold text-gray-800 outline-none focus:border-primary-green bg-white"
                                    >
                                        <option value="Eco Starter">Eco Starter</option>
                                        <option value="Eco Warrior">Eco Warrior</option>
                                        <option value="Eco Champion">Eco Champion</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">EcoPoints Balance</label>
                                    <input
                                        type="number"
                                        value={formData.points}
                                        onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                                        className="w-full h-10 border border-gray-300 rounded-[6px] px-3 text-xs font-bold text-gray-800 outline-none focus:border-primary-green"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Account Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full h-10 border border-gray-300 rounded-[6px] px-3 text-xs font-bold text-gray-800 outline-none focus:border-primary-green bg-white"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Read-Only Details View */
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-[6px] p-4 flex flex-col items-center justify-center">
                                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">EcoPoints</p>
                                    <p className="text-3xl font-bold text-[#2E7D32]">{formData.points}</p>
                                </div>
                                <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-[6px] p-4 flex flex-col items-center justify-center">
                                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">Active Pickups</p>
                                    <p className="text-3xl font-bold text-[#1565C0]">{user.pickups}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between bg-[#f8f9fa] rounded-[6px] px-4 py-2.5 border border-gray-100">
                                    <span className="text-xs font-semibold text-[#636E72]">Account Type</span>
                                    <Badge className="bg-blue-100 text-blue-700 border-none px-2.5 py-0.5 rounded-[4px] font-bold text-[10px] uppercase shadow-none">{formData.type}</Badge>
                                </div>
                                <div className="flex items-center justify-between bg-[#f8f9fa] rounded-[6px] px-4 py-2.5 border border-gray-100">
                                    <span className="text-xs font-semibold text-[#636E72]">Current Tier</span>
                                    <Badge className="bg-green-100 text-green-700 border-none px-2.5 py-0.5 rounded-[4px] font-bold text-[10px] uppercase shadow-none">{formData.tier}</Badge>
                                </div>
                                <div className="flex items-center justify-between bg-[#f8f9fa] rounded-[6px] px-4 py-2.5 border border-gray-100">
                                    <span className="text-xs font-semibold text-[#636E72]">Phone</span>
                                    <span className="text-xs font-bold text-[#2D3436]">{formData.phone}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between rounded-b-xl gap-3">
                    <Button variant="outline" onClick={onClose} className="h-10 rounded-[6px] border-gray-200 text-gray-600 font-bold hover:bg-white text-xs">
                        Close
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                        {isEditing ? (
                            <Button
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className="h-10 bg-primary-green hover:bg-[#15803D] text-white font-bold text-xs px-5 rounded-[6px] flex items-center space-x-1.5"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save Changes</span>
                            </Button>
                        ) : (
                            <Button
                                onClick={handleToggleStatus}
                                disabled={isSaving}
                                className={cn(
                                    "h-10 rounded-[6px] text-white font-bold text-xs px-4 flex items-center space-x-1.5 shadow-sm",
                                    isSuspended ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                                )}
                            >
                                {isSuspended ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                <span>{isSuspended ? "Activate Account" : "Suspend Account"}</span>
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

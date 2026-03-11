"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, UserPlus, Shield, MapPin, Phone, Mail, User, CheckCircle2 } from "lucide-react";
import { userService } from "@/services/user.service";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CreateUserPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: "Residential",
        location: "",
        tier: "Eco Starter"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await userService.createUser(formData);
            router.push("/users");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/users">
                                <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200 text-gray-400 hover:text-primary-green hover:border-primary-green rounded-[4px] bg-white transition-all">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight leading-tight">Create New User</h1>
                                <p className="text-sm text-[#636E72] font-semibold mt-1">Add a new resident or business to the SmartEco system</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="p-8 border-gray-100 shadow-sm rounded-xl bg-white space-y-8">
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 border-b border-gray-50 pb-2">
                                    <User className="w-5 h-5 text-primary-green" />
                                    <h2 className="text-sm font-bold text-[#2D3436] uppercase tracking-widest">Personal Information</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase">Full Name</Label>
                                        <div className="relative">
                                            <Input
                                                id="name"
                                                required
                                                placeholder="e.g. Samuel Nkurunziza"
                                                className="h-12 pl-10 border-gray-100 bg-[#f8f9fa] shadow-sm focus:ring-primary-green/20 rounded-[4px] text-sm font-semibold"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase">Email Address</Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                placeholder="samuel@example.rw"
                                                className="h-12 pl-10 border-gray-100 bg-[#f8f9fa] shadow-sm focus:ring-primary-green/20 rounded-[4px] text-sm font-semibold"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase">Phone Number</Label>
                                        <div className="relative">
                                            <Input
                                                id="phone"
                                                required
                                                placeholder="+250 788 345 678"
                                                className="h-12 pl-10 border-gray-100 bg-[#f8f9fa] shadow-sm focus:ring-primary-green/20 rounded-[4px] text-sm font-semibold"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-xs font-bold text-gray-500 uppercase">Zone / Location</Label>
                                        <div className="relative">
                                            <Input
                                                id="location"
                                                required
                                                placeholder="e.g. Kigali West"
                                                className="h-12 pl-10 border-gray-100 bg-[#f8f9fa] shadow-sm focus:ring-primary-green/20 rounded-[4px] text-sm font-semibold"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Configuration */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 border-b border-gray-50 pb-2">
                                    <Shield className="w-5 h-5 text-primary-green" />
                                    <h2 className="text-sm font-bold text-[#2D3436] uppercase tracking-widest">Account Configuration</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase">Account Type</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {["Residential", "Business"].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, type })}
                                                    className={cn(
                                                        "h-12 rounded-[4px] border font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-sm",
                                                        formData.type === type
                                                            ? "bg-primary-green text-white border-primary-green ring-2 ring-primary-green/20"
                                                            : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                                                    )}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase">Initial Tier</Label>
                                        <div className="flex h-12 w-full items-center justify-between rounded-[4px] border border-gray-100 bg-[#f8f9fa] px-4 text-sm font-semibold text-[#2D3436] shadow-sm">
                                            <span>Eco Starter</span>
                                            <CheckCircle2 className="w-4 h-4 text-primary-green" />
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 italic">All new accounts start at Eco Starter tier</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-6 flex items-center justify-end space-x-4 border-t border-gray-50">
                                <Link href="/users">
                                    <Button type="button" variant="outline" className="h-12 px-8 rounded-[4px] border-gray-200 text-gray-500 font-bold hover:bg-gray-50">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-12 px-10 bg-primary-green text-white font-bold hover:bg-green-700 shadow-lg shadow-green-100 rounded-[4px] flex items-center justify-center transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full mr-2" />
                                    ) : (
                                        <UserPlus className="w-4 h-4 mr-2" />
                                    )}
                                    <span>Create Account</span>
                                </Button>
                            </div>
                        </Card>
                    </form>
                </main>
            </div>
        </div>
    );
}

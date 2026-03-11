"use client";

import { Clock, Lock, RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SessionExpiredPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="w-full max-w-[448px] space-y-6">
                {/* Icon Section */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="w-20 h-20 rounded-lg bg-[#FFE4D1] flex items-center justify-center shadow-sm">
                        <Clock className="w-10 h-10 text-[#D35400]" />
                    </div>
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Session Expired</h1>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
                            Your session has expired due to inactivity for security reasons. Please sign in again to continue.
                        </p>
                    </div>
                </div>

                <Card className="border shadow-md overflow-hidden bg-white">
                    <CardContent className="px-8 pt-8 pb-6 space-y-6">
                        {/* Security Information Box */}
                        <div className="bg-blue-50/40 border border-blue-100 rounded-lg p-5 space-y-3">
                            <div className="flex items-center justify-center text-blue-800 space-x-2 pb-1">
                                <Lock className="w-4 h-4" />
                                <span className="text-sm font-bold tracking-tight">Security Information</span>
                            </div>
                            <ul className="space-y-2 text-sm text-blue-900/80 font-medium">
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    Sessions expire after 15 minutes of inactivity
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    All unsaved changes may be lost
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    This helps protect sensitive admin data
                                </li>
                            </ul>
                        </div>

                        <Button
                            onClick={() => router.push("/login")}
                            className="w-full bg-[#1E8449] hover:bg-[#145A32] text-white font-bold py-6 rounded-md shadow-sm transition-all duration-200"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Sign In Again
                        </Button>
                    </CardContent>

                    <CardFooter className="px-8 pb-8 pt-2 flex flex-col items-center">
                        <p className="text-xs text-gray-400 font-medium tracking-tight">
                            SmartEco Admin Portal • Session timed out at 9:48:03 AM
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

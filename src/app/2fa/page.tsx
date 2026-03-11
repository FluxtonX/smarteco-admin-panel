"use client";

import { useState } from "react";
import { ShieldAlert, ShieldCheck, ArrowLeft, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TwoFactorPage() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [isVerifying, setIsVerifying] = useState(false);
    const router = useRouter();

    const handleVerify = (enteredCode: string, e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsVerifying(true);

        // Simulate a brief "active" verification state
        setTimeout(() => {
            if (enteredCode === "123456") {
                router.push("/dashboard");
            } else {
                router.push("/expired");
            }
        }, 800);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newCode = [...code];
        pastedData.split("").forEach((char, index) => {
            newCode[index] = char;
        });
        setCode(newCode);

        // If full code is pasted, verify immediately
        if (pastedData.length === 6) {
            handleVerify(pastedData);
        } else {
            // Focus the next empty input
            const nextEmptyIndex = pastedData.length;
            if (nextEmptyIndex < 6) {
                document.getElementById(`code-${nextEmptyIndex}`)?.focus();
            }
        }
    };

    const handleInputChange = (index: number, value: string) => {
        // Handle case where user might type multiple characters (though maxLength is 1)
        const char = value.slice(-1);
        if (!/^\d?$/.test(char)) return;

        const newCode = [...code];
        newCode[index] = char;
        setCode(newCode);

        // Auto-focus next input
        if (char && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }

        // Auto-verify when all digits are entered
        const fullCode = newCode.join("");
        if (fullCode.length === 6) {
            // Give a tiny delay for visual feedback of the last digit
            setTimeout(() => handleVerify(fullCode), 100);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="w-full max-w-[448px] space-y-6">
                {/* Logo Section */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#1E8449] to-[#145A32] flex items-center justify-center shadow-lg">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Two-Factor Authentication</h1>
                        <p className="text-sm text-gray-500 mt-1 font-medium">
                            Enter the 6-digit code from your authenticator app
                        </p>
                    </div>
                </div>

                <Card className="border shadow-md overflow-hidden bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pt-6 px-8 flex flex-col items-center">
                        <div className="flex items-center justify-center text-[#145A32] space-x-2">
                            <ShieldAlert className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">Verification Required</span>
                        </div>
                    </CardHeader>

                    <CardContent className="px-8 pb-4 space-y-6">
                        <div className="flex justify-between gap-2 py-4">
                            {code.map((digit, idx) => (
                                <Input
                                    key={idx}
                                    id={`code-${idx}`}
                                    type="text"
                                    maxLength={1}
                                    className="w-12 h-14 text-center text-xl font-bold border-gray-200 focus:ring-[#1E8449] focus:border-[#1E8449] bg-gray-50"
                                    value={digit}
                                    onPaste={handlePaste}
                                    onChange={(e) => handleInputChange(idx, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !code[idx] && idx > 0) {
                                            const prevInput = document.getElementById(`code-${idx - 1}`);
                                            prevInput?.focus();
                                        }
                                    }}
                                />
                            ))}
                        </div>

                        <p className="text-[12px] text-center text-gray-500 font-medium px-4">
                            Open your authenticator app (Google Authenticator, Authy, etc.) and enter the 6-digit code shown.
                        </p>

                        <Button
                            onClick={() => handleVerify(code.join(""))}
                            disabled={isVerifying || code.includes("")}
                            className={cn(
                                "w-full py-6 rounded-md shadow-sm transition-all duration-300 font-bold",
                                isVerifying
                                    ? "bg-[#145A32] text-white cursor-not-allowed"
                                    : "bg-[#7da37d] hover:bg-[#1E8449] text-white"
                            )}
                        >
                            {isVerifying ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Verifying...</span>
                                </div>
                            ) : "Verify & Continue"}
                        </Button>

                        <div className="text-center space-y-3 pt-2">
                            <p className="text-xs text-gray-500 font-medium">Having trouble?</p>
                            <div className="flex flex-col space-y-2">
                                <button className="text-sm font-bold text-[#145A32] hover:underline">Use backup code</button>
                                <button className="text-sm font-bold text-[#145A32] hover:underline">Contact IT support</button>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="px-8 pb-8 pt-0 flex flex-col items-stretch space-y-4">
                        {/* Demo Code Box */}
                        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 space-y-2">
                            <div className="flex items-center text-blue-700 text-xs font-bold uppercase tracking-wider">
                                <ShieldCheck className="w-3 h-3 mr-1.5" />
                                Demo Code (Development)
                            </div>
                            <div className="text-sm text-blue-600 font-medium">
                                Enter: <span className="text-blue-800 font-bold">123456</span>
                            </div>
                        </div>
                    </CardFooter>
                </Card>

                {/* Back Link */}
                <div className="text-center">
                    <Link href="/login" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-gray-600">
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}

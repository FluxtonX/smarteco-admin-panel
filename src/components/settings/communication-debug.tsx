"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, PhoneCall, Send, ShieldAlert, CheckCircle2, AlertCircle, Smartphone } from "lucide-react";
import { systemService } from "@/services/system.service";

export function CommunicationDebugCard() {
    const [mounted, setMounted] = useState(false);
    const [waPhone, setWaPhone] = useState("");
    const [waMessage, setWaMessage] = useState("");
    const [isWaSending, setIsWaSending] = useState(false);
    const [waStatus, setWaStatus] = useState<{ success: boolean; message: string } | null>(null);

    const [ussdPhone, setUssdPhone] = useState("+250780000000");
    const [ussdCode, setUssdCode] = useState("");
    const [ussdResponse, setUssdResponse] = useState<string | null>(null);
    const [isUssdSimulating, setIsUssdSimulating] = useState(false);
    const [ussdError, setUssdError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleSendWhatsApp = async () => {
        if (!waPhone || !waMessage) return;
        setIsWaSending(true);
        setWaStatus(null);
        const res = await systemService.sendWhatsApp(waPhone, waMessage);
        setIsWaSending(false);
        setWaStatus({
            success: res.success,
            message: res.success ? `WhatsApp sent to ${waPhone}!` : `WhatsApp failed: ${res.message}`
        });
    };

    const handleSimulateUssd = async () => {
        if (!ussdPhone) return;
        setIsUssdSimulating(true);
        setUssdError(null);
        try {
            const resp = await systemService.simulateUssd(`SES-${Date.now()}`, ussdPhone, ussdCode);
            setUssdResponse(resp);
        } catch (e: any) {
            setUssdError(e.message || "USSD Simulation failed.");
        } finally {
            setIsUssdSimulating(false);
        }
    };

    return (
        <Card className="border border-blue-100 bg-white shadow-sm overflow-hidden font-sans">
            <CardHeader className="pb-3 pt-6 px-6 md:px-8 bg-blue-50/30">
                <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">Communication Debug (Admin/Dev)</CardTitle>
                </div>
                <p className="text-[12px] text-gray-500 font-medium">Manually trigger communications and simulate provider callbacks.</p>
            </CardHeader>
            <CardContent className="px-6 md:px-8 pb-8 pt-6 space-y-8">
                {/* WhatsApp Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                        <MessageSquare className="w-4 h-4 text-[#25D366]" />
                        <span>Send Manual WhatsApp Message</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            placeholder="Phone (e.g. +250788123456)" 
                            value={waPhone} 
                            onChange={(e) => setWaPhone(e.target.value)}
                            className="bg-gray-50 border-gray-200 text-xs font-bold"
                        />
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Message text..." 
                                value={waMessage} 
                                onChange={(e) => setWaMessage(e.target.value)}
                                className="bg-gray-50 border-gray-200 text-xs font-bold"
                            />
                            <Button 
                                onClick={handleSendWhatsApp} 
                                disabled={isWaSending || !waPhone || !waMessage}
                                className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-6 text-xs"
                            >
                                <Send className="w-4 h-4 mr-1.5" />
                                {isWaSending ? "..." : "Send"}
                            </Button>
                        </div>
                    </div>
                    {waStatus && (
                        <div className={`p-3 rounded-[6px] text-xs font-bold flex items-center gap-2 ${waStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                            {waStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                            <span>{waStatus.message}</span>
                        </div>
                    )}
                </div>

                <div className="h-px bg-gray-100" />

                {/* USSD Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                        <PhoneCall className="w-4 h-4 text-orange-500" />
                        <span>Simulate USSD Provider Callback (*123#)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            placeholder="User Phone (e.g. +250780000000)" 
                            value={ussdPhone} 
                            onChange={(e) => setUssdPhone(e.target.value)}
                            className="bg-gray-50 border-gray-200 text-xs font-bold"
                        />
                        <div className="flex gap-2">
                            <Input 
                                placeholder="USSD Input (e.g. 1 or *123#)" 
                                value={ussdCode} 
                                onChange={(e) => setUssdCode(e.target.value)}
                                className="bg-gray-50 border-gray-200 text-xs font-bold"
                            />
                            <Button 
                                onClick={handleSimulateUssd} 
                                disabled={isUssdSimulating}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 text-xs"
                            >
                                {isUssdSimulating ? "Processing..." : "Simulate Call"}
                            </Button>
                        </div>
                    </div>

                    {/* Interactive USSD Screen Window */}
                    {ussdResponse && (
                        <div className="mt-4 p-4 bg-slate-900 text-emerald-400 rounded-[8px] border border-slate-700 font-mono text-xs space-y-2 shadow-inner">
                            <div className="flex items-center justify-between text-gray-400 text-[10px] border-b border-slate-800 pb-2">
                                <span className="flex items-center gap-1">
                                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>USSD Interactive Session Output ({ussdPhone})</span>
                                </span>
                                <span>Status: OK</span>
                            </div>
                            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-100">
                                {ussdResponse}
                            </pre>
                        </div>
                    )}

                    {ussdError && (
                        <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-[6px] text-xs font-bold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                            <span>{ussdError}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

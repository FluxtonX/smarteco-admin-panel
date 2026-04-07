"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, PhoneCall, Send, ShieldAlert } from "lucide-react";
import { systemService } from "@/services/system.service";

export function CommunicationDebugCard() {
    const [mounted, setMounted] = useState(false);
    const [waPhone, setWaPhone] = useState("");
    const [waMessage, setWaMessage] = useState("");
    const [isWaSending, setIsWaSending] = useState(false);

    const [ussdPhone, setUssdPhone] = useState("+250780000000");
    const [ussdCode, setUssdCode] = useState("*123#");
    const [isUssdSimulating, setIsUssdSimulating] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleSendWhatsApp = async () => {
        if (!waPhone || !waMessage) return;
        setIsWaSending(true);
        const success = await systemService.sendWhatsApp(waPhone, waMessage);
        setIsWaSending(false);
        if (success) {
            alert("WhatsApp message sent successfully!");
            setWaMessage("");
        } else {
            alert("Failed to send WhatsApp message.");
        }
    };

    const handleSimulateUssd = async () => {
        setIsUssdSimulating(true);
        try {
            await systemService.simulateUssd(`SES-${Date.now()}`, ussdPhone, ussdCode);
            alert("USSD Callback simulated successfully!");
        } catch (e) {
            alert("USSD Simulation failed.");
        } finally {
            setIsUssdSimulating(false);
        }
    };

    return (
        <Card className="border border-blue-100 bg-white shadow-sm overflow-hidden">
            <CardHeader className="pb-3 pt-6 px-8 bg-blue-50/30">
                <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">Communication Debug (Admin/Dev)</CardTitle>
                </div>
                <p className="text-[12px] text-gray-500 font-medium">Manually trigger communications and simulate provider callbacks.</p>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-6 space-y-8">
                {/* WhatsApp Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                        <MessageSquare className="w-4 h-4 text-[#25D366]" />
                        <span>Send Manual WhatsApp Message</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            placeholder="Phone (e.g. +250...)" 
                            value={waPhone} 
                            onChange={(e) => setWaPhone(e.target.value)}
                            className="bg-gray-50 border-gray-200"
                        />
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Message text..." 
                                value={waMessage} 
                                onChange={(e) => setWaMessage(e.target.value)}
                                className="bg-gray-50 border-gray-200"
                            />
                            <Button 
                                onClick={handleSendWhatsApp} 
                                disabled={isWaSending || !waPhone || !waMessage}
                                className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-6"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {isWaSending ? "..." : "Send"}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* USSD Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                        <PhoneCall className="w-4 h-4 text-orange-500" />
                        <span>Simulate USSD Provider Callback</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            placeholder="User Phone" 
                            value={ussdPhone} 
                            onChange={(e) => setUssdPhone(e.target.value)}
                            className="bg-gray-50 border-gray-200"
                        />
                        <div className="flex gap-2">
                            <Input 
                                placeholder="USSD Input (e.g. *123#)" 
                                value={ussdCode} 
                                onChange={(e) => setUssdCode(e.target.value)}
                                className="bg-gray-50 border-gray-200"
                            />
                            <Button 
                                onClick={handleSimulateUssd} 
                                disabled={isUssdSimulating}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6"
                            >
                                {isUssdSimulating ? "Processing..." : "Simulate Call"}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

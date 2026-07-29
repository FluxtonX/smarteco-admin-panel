"use client";

import { MomoGatewayConfig } from "@/services/settings.service";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreditCard, ShieldCheck, Key, Globe, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface MomoSettingsCardProps {
    config?: MomoGatewayConfig;
    onChange: (config: MomoGatewayConfig) => void;
}

export function MomoSettingsCard({ config, onChange }: MomoSettingsCardProps) {
    const current = config || {
        environment: 'sandbox',
        baseUrl: 'https://sandbox.momodeveloper.mtn.com',
        currency: 'RWF',
        targetEnvironment: 'sandbox',
        apiKey: '',
        apiUser: '',
        subscriptionKey: '',
        enabled: true,
    };

    const updateField = (field: keyof MomoGatewayConfig, value: any) => {
        onChange({
            ...current,
            [field]: value,
        });
    };

    return (
        <Card className="p-6 md:p-8 border-gray-200 bg-white shadow-sm rounded-[8px] space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[8px] bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5 text-[#D97706]" />
                    </div>
                    <div>
                        <h3 className="text-base font-extrabold text-[#1A1A1A] tracking-tight">MTN Mobile Money Gateway (MTN MoMo)</h3>
                        <p className="text-[12px] text-gray-500 font-medium mt-0.5">
                            Configure API credentials, sandbox/production endpoints, and collection settings for MTN payments
                        </p>
                    </div>
                </div>

                {/* Gateway Active Toggle */}
                <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-gray-600">
                        {current.enabled ? "Gateway Active" : "Gateway Disabled"}
                    </span>
                    <button
                        type="button"
                        onClick={() => updateField('enabled', !current.enabled)}
                        className={cn(
                            "relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none",
                            current.enabled ? "bg-emerald-600" : "bg-gray-300"
                        )}
                    >
                        <span
                            className={cn(
                                "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200",
                                current.enabled ? "translate-x-6" : "translate-x-0"
                            )}
                        />
                    </button>
                </div>
            </div>

            {/* Environment Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[12px] font-bold text-gray-700 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-amber-600" />
                        <span>API Environment Mode</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                updateField('environment', 'sandbox');
                                updateField('baseUrl', 'https://sandbox.momodeveloper.mtn.com');
                                updateField('targetEnvironment', 'sandbox');
                            }}
                            className={cn(
                                "h-10 text-xs font-bold rounded-[6px] border transition-all flex items-center justify-center gap-2",
                                current.environment === 'sandbox'
                                    ? "bg-amber-50 text-amber-800 border-amber-300 shadow-sm"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            <span>Sandbox / Test</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                updateField('environment', 'production');
                                updateField('baseUrl', 'https://proxy.momoapi.mtn.com');
                                updateField('targetEnvironment', 'mtnrwanda');
                            }}
                            className={cn(
                                "h-10 text-xs font-bold rounded-[6px] border transition-all flex items-center justify-center gap-2",
                                current.environment === 'production'
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            <span>Production (Live)</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[12px] font-bold text-gray-700 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>Gateway Base URL</span>
                    </label>
                    <Input
                        value={current.baseUrl}
                        onChange={(e) => updateField('baseUrl', e.target.value)}
                        placeholder="https://sandbox.momodeveloper.mtn.com"
                        className="h-10 text-xs font-bold border-gray-200"
                    />
                </div>
            </div>

            {/* API Credentials Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-gray-400" />
                        <span>MTN Subscription Key</span>
                    </label>
                    <Input
                        type="password"
                        value={current.subscriptionKey}
                        onChange={(e) => updateField('subscriptionKey', e.target.value)}
                        placeholder="Ocp-Apim-Subscription-Key"
                        className="h-10 text-xs font-medium border-gray-200 font-mono"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                        <span>API User ID (UUID)</span>
                    </label>
                    <Input
                        value={current.apiUser}
                        onChange={(e) => updateField('apiUser', e.target.value)}
                        placeholder="X-Reference-Id API User"
                        className="h-10 text-xs font-medium border-gray-200 font-mono"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-gray-400" />
                        <span>API Secret / Key</span>
                    </label>
                    <Input
                        type="password"
                        value={current.apiKey}
                        onChange={(e) => updateField('apiKey', e.target.value)}
                        placeholder="MTN MoMo API Secret Key"
                        className="h-10 text-xs font-medium border-gray-200 font-mono"
                    />
                </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-[11px] font-medium text-gray-600 flex items-center justify-between">
                <span>Currency: <strong className="text-gray-900">{current.currency}</strong></span>
                <span>Target Environment: <strong className="text-gray-900">{current.targetEnvironment}</strong></span>
            </div>
        </Card>
    );
}

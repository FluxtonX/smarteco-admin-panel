"use client";

import { useEffect, useState, useRef } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
    Play, StopCircle, RefreshCw, Trash2, 
    AlertTriangle, Shield, CheckCircle2, XCircle, 
    Terminal, Info, BarChart3, Database, Calendar, 
    User, ArrowLeft, Loader2
} from "lucide-react";
import { userService, UserProfile } from "@/services/user.service";
import { simulationService, SimulationSession } from "@/services/simulation.service";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SCENARIOS = [
    { id: 'full_e2e', name: 'Full End-to-End Simulation', desc: 'Runs the complete business lifecycle from registration, bin IoT fill sync, collector assignment, completed status updates, payments webhooks, and dashboard stats.' },
    { id: 'user_flow', name: 'User Flow Simulation', desc: 'Simulates user registration, authentication, and manually scheduling waste pickups.' },
    { id: 'admin_flow', name: 'Admin Flow Simulation', desc: 'Simulates administrator logging in, viewing system dashboard, listing users, and managing devices.' },
    { id: 'api_flow', name: 'API Endpoint Simulation', desc: 'Tests public, health, and validation endpoints under positive/negative flows.' },
    { id: 'db_sync', name: 'Database Synchronization', desc: 'Verifies database persistence matching returned API payloads.' },
    { id: 'error_handling', name: 'Error Handling Validation', desc: 'Checks that unauthorized requests, duplicate entries, and invalid state transitions are correctly rejected.' },
];

export default function SimulationDashboardPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [sessions, setSessions] = useState<SimulationSession[]>([]);
    const [activeSession, setActiveSession] = useState<SimulationSession | null>(null);
    const [selectedScenario, setSelectedScenario] = useState('full_e2e');
    const [isStarting, setIsStarting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [clearConfirmId, setClearConfirmId] = useState("");
    const [showClearModal, setShowClearModal] = useState(false);
    const [sessionToClear, setSessionToClear] = useState<SimulationSession | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const terminalEndRef = useRef<HTMLDivElement>(null);

    // 1. Authenticate user role
    useEffect(() => {
        async function checkAuth() {
            try {
                const data = await userService.getProfile();
                setProfile(data);
                if (data.role !== 'ADMIN' || data.subRole !== 'Super Admin') {
                    // Unauthorized redirection
                    window.location.href = "/dashboard";
                } else {
                    setLoading(false);
                    loadSessions();
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                window.location.href = "/login";
            }
        }
        checkAuth();
    }, []);

    // 2. Load sessions
    async function loadSessions() {
        try {
            const list = await simulationService.getSessions();
            setSessions(list);

            // Set running session if exists
            const running = list.find(s => s.status === 'RUNNING' || s.status === 'PENDING');
            if (running) {
                setActiveSession(running);
            }
        } catch (err) {
            console.error("Failed to load simulation sessions:", err);
        }
    }

    // 3. Poll active session
    useEffect(() => {
        let timer: any;
        if (activeSession && (activeSession.status === 'RUNNING' || activeSession.status === 'PENDING')) {
            timer = setInterval(async () => {
                try {
                    const latest = await simulationService.getSession(activeSession.id);
                    setActiveSession(latest);
                    // Refresh the main list
                    loadSessions();

                    if (latest.status !== 'RUNNING' && latest.status !== 'PENDING') {
                        // Finished
                        setActiveSession(null);
                    }
                } catch (err) {
                    console.error("Polling failed:", err);
                    setActiveSession(null);
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [activeSession]);

    // 4. Auto scroll terminal
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeSession?.logs]);

    // 5. Simulation Action Handlers
    const handleStart = async () => {
        setIsStarting(true);
        try {
            const res = await simulationService.start(selectedScenario);
            if (res.success) {
                setActiveSession(res.data);
                loadSessions();
            }
        } catch (err) {
            console.error("Failed to start simulation:", err);
        } finally {
            setIsStarting(false);
        }
    };

    const handleCancel = async (id: string) => {
        setIsCancelling(true);
        try {
            await simulationService.cancel(id);
            setActiveSession(null);
            loadSessions();
        } catch (err) {
            console.error("Failed to cancel simulation:", err);
        } finally {
            setIsCancelling(false);
        }
    };

    const triggerClearData = (session: SimulationSession) => {
        setSessionToClear(session);
        setClearConfirmId("");
        setShowClearModal(true);
    };

    const handleClearData = async () => {
        if (!sessionToClear || clearConfirmId !== sessionToClear.id) return;
        setIsClearing(true);
        try {
            const res = await simulationService.clear(sessionToClear.id);
            if (res.success) {
                setShowClearModal(false);
                setSessionToClear(null);
                loadSessions();
            }
        } catch (err) {
            console.error("Failed to clear simulation data:", err);
        } finally {
            setIsClearing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F8F9FA]">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Securing Simulation Context...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
                    
                    {/* Header */}
                    <div className="flex items-center space-x-4">
                        <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-primary-green">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight uppercase flex items-center">
                                <Shield className="w-6 h-6 mr-2 text-primary-green" /> E2E Business Simulation
                            </h1>
                            <p className="text-[12px] md:text-sm text-gray-500 font-bold mt-1">
                                Secure Sandbox environment to validate operations, database mutations, and notifications.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                        {/* Left Column: Controls & Selectors */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="border-none shadow-xl bg-white rounded-2xl">
                                <CardHeader className="border-b border-gray-50 px-6 py-4">
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center">
                                        <Play className="w-4 h-4 mr-2 text-primary-green" /> Launch Scenario
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Select Scenario</Label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {SCENARIOS.map(sc => (
                                                <button
                                                    key={sc.id}
                                                    onClick={() => !activeSession && setSelectedScenario(sc.id)}
                                                    disabled={!!activeSession}
                                                    className={cn(
                                                        "text-left p-3.5 rounded-xl border transition-all text-sm group",
                                                        selectedScenario === sc.id
                                                            ? "border-primary-green bg-green-50/40 shadow-sm"
                                                            : "border-gray-100 hover:border-gray-200 bg-white",
                                                        activeSession && "opacity-60 cursor-not-allowed"
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "font-bold block transition-colors",
                                                        selectedScenario === sc.id ? "text-primary-green" : "text-gray-700"
                                                    )}>
                                                        {sc.name}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-medium leading-relaxed block mt-1">
                                                        {sc.desc}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {activeSession ? (
                                        <Button
                                            onClick={() => handleCancel(activeSession.id)}
                                            disabled={isCancelling}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl transition-all shadow-md flex items-center justify-center"
                                        >
                                            {isCancelling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <StopCircle className="w-4 h-4 mr-2" />}
                                            Cancel Simulation
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleStart}
                                            disabled={isStarting}
                                            className="w-full bg-primary-green hover:bg-green-600 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center"
                                        >
                                            {isStarting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                            Start Simulation Run
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Session History */}
                            <Card className="border-none shadow-xl bg-white rounded-2xl">
                                <CardHeader className="border-b border-gray-50 px-6 py-4">
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center">
                                        <Database className="w-4 h-4 mr-2 text-primary-green" /> Session History & Cleanup
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 overflow-hidden">
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                        {sessions.length === 0 ? (
                                            <p className="text-xs text-gray-400 italic text-center py-4">No simulation history found.</p>
                                        ) : (
                                            sessions.map(s => (
                                                <div key={s.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                                    <div className="min-w-0">
                                                        <span className="font-mono text-[10px] text-gray-400 font-bold block">{s.id.substring(0, 8).toUpperCase()}</span>
                                                        <span className="text-xs font-bold text-gray-700 block truncate mt-0.5">{s.scenario.replace('_', ' ').toUpperCase()}</span>
                                                        <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                                                            {new Date(s.startedAt).toLocaleTimeString()} · {s.completedSteps}/{s.totalSteps} steps
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 shrink-0">
                                                        <span className={cn(
                                                            "text-[9px] font-bold px-2 py-0.5 rounded-[4px] uppercase border",
                                                            s.status === 'PASSED' && "bg-green-50 border-green-200 text-green-700",
                                                            s.status === 'FAILED' && "bg-red-50 border-red-200 text-red-700",
                                                            s.status === 'RUNNING' && "bg-blue-50 border-blue-200 text-blue-700 animate-pulse",
                                                            s.status === 'CANCELLED' && "bg-gray-100 border-gray-300 text-gray-500",
                                                            s.status === 'CLEARED' && "bg-purple-50 border-purple-200 text-purple-700"
                                                        )}>
                                                            {s.status}
                                                        </span>
                                                        {s.status !== 'CLEARED' && s.status !== 'RUNNING' && s.status !== 'PENDING' && (
                                                            <button
                                                                onClick={() => triggerClearData(s)}
                                                                className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                                                                title="Clear created records"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Terminal Logs, Progress, Final Reports */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Live Progress Card */}
                            {(activeSession || sessions[0]?.status === 'PASSED' || sessions[0]?.status === 'FAILED') && (
                                <Card className="border-none shadow-xl bg-white rounded-2xl p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1.5 uppercase">
                                                <span>Active Progress</span>
                                                <span className="text-primary-green font-bold">{(activeSession || sessions[0])?.progress || 0}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary-green rounded-full transition-all duration-300"
                                                    style={{ width: `${(activeSession || sessions[0])?.progress || 0}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6 shrink-0 md:border-l md:border-gray-100 md:pl-6">
                                            <div className="text-center">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Completed</p>
                                                <p className="text-lg font-bold text-gray-900 mt-0.5">{(activeSession || sessions[0])?.completedSteps || 0}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Steps</p>
                                                <p className="text-lg font-bold text-gray-900 mt-0.5">{(activeSession || sessions[0])?.totalSteps || 0}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Errors</p>
                                                <p className={cn(
                                                    "text-lg font-bold mt-0.5",
                                                    ((activeSession || sessions[0])?.errors?.length ?? 0) > 0 ? "text-red-600" : "text-gray-900"
                                                )}>
                                                    {(activeSession || sessions[0])?.errors?.length || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Terminal Logs */}
                            <Card className="border-none shadow-xl bg-white rounded-2xl flex flex-col h-[380px]">
                                <CardHeader className="border-b border-gray-50 px-6 py-4 flex items-center justify-between shrink-0">
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center">
                                        <Terminal className="w-4 h-4 mr-2 text-primary-green" /> Terminal Logs
                                    </CardTitle>
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                </CardHeader>
                                <CardContent className="p-0 flex-1 overflow-hidden bg-gray-950 font-mono text-xs text-gray-100 flex flex-col">
                                    <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                                        {!(activeSession || sessions[0]) ? (
                                            <p className="text-gray-500 italic text-center py-12">Logs will display here once simulation starts.</p>
                                        ) : (
                                            (activeSession || sessions[0]).logs.map((l, index) => (
                                                <div key={index} className="flex items-start space-x-2 leading-relaxed">
                                                    <span className="text-gray-600 shrink-0 select-none">[{l.timestamp.substring(11, 19)}]</span>
                                                    <span className={cn(
                                                        "font-bold shrink-0 select-none",
                                                        l.level === 'SUCCESS' && "text-green-400",
                                                        l.level === 'INFO' && "text-blue-400",
                                                        l.level === 'WARN' && "text-orange-400",
                                                        l.level === 'ERROR' && "text-red-400"
                                                    )}>
                                                        [{l.level}]
                                                    </span>
                                                    <span className="break-all whitespace-pre-wrap">{l.message}</span>
                                                </div>
                                            ))
                                        )}
                                        <div ref={terminalEndRef} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Final Report Card */}
                            {(activeSession || sessions[0])?.finalResult && (
                                <Card className="border-none shadow-xl bg-white rounded-2xl">
                                    <CardHeader className="border-b border-gray-50 px-6 py-4">
                                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center">
                                            <BarChart3 className="w-4 h-4 mr-2 text-primary-green" /> Final Simulation Report
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                                <div className="flex items-center justify-center space-x-1.5 mt-2">
                                                    {(activeSession || sessions[0])?.status === 'PASSED' ? (
                                                        <>
                                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                            <span className="font-bold text-green-700">PASSED</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-5 h-5 text-red-600" />
                                                            <span className="font-bold text-red-700">FAILED</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total steps</p>
                                                <p className="text-xl font-bold text-gray-800 mt-2">
                                                    {(activeSession || sessions[0])?.finalResult?.totalTests}
                                                </p>
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Passed Steps</p>
                                                <p className="text-xl font-bold text-green-600 mt-2">
                                                    {(activeSession || sessions[0])?.finalResult?.passed}
                                                </p>
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Failed Steps</p>
                                                <p className={cn(
                                                    "text-xl font-bold mt-2",
                                                    ((activeSession || sessions[0])?.finalResult?.failed ?? 0) > 0 ? "text-red-600" : "text-gray-800"
                                                )}>
                                                    {(activeSession || sessions[0])?.finalResult?.failed}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Created records detail */}
                                        <div className="mt-6 pt-6 border-t border-gray-50 space-y-3">
                                            <h4 className="text-xs font-bold text-gray-900 uppercase">Created sandbox records:</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-gray-500">
                                                <div className="p-3 bg-green-50/20 rounded-xl border border-green-50 flex items-center justify-between">
                                                    <span>Users Created</span>
                                                    <span className="font-mono text-primary-green text-sm">{(activeSession || sessions[0])?.finalResult?.createdRecords?.users?.length || 0}</span>
                                                </div>
                                                <div className="p-3 bg-green-50/20 rounded-xl border border-green-50 flex items-center justify-between">
                                                    <span>Bins Instantiated</span>
                                                    <span className="font-mono text-primary-green text-sm">{(activeSession || sessions[0])?.finalResult?.createdRecords?.bins?.length || 0}</span>
                                                </div>
                                                <div className="p-3 bg-green-50/20 rounded-xl border border-green-50 flex items-center justify-between">
                                                    <span>Pickups Scheduled</span>
                                                    <span className="font-mono text-primary-green text-sm">{(activeSession || sessions[0])?.finalResult?.createdRecords?.pickups?.length || 0}</span>
                                                </div>
                                                <div className="p-3 bg-green-50/20 rounded-xl border border-green-50 flex items-center justify-between">
                                                    <span>Payments Processed</span>
                                                    <span className="font-mono text-primary-green text-sm">{(activeSession || sessions[0])?.finalResult?.createdRecords?.payments?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Error fixes recommendations */}
                                        {((activeSession || sessions[0])?.errors?.length ?? 0) > 0 && (
                                            <div className="mt-6 p-4 bg-red-50/50 rounded-2xl border border-red-100 space-y-3">
                                                <h4 className="text-xs font-bold text-red-800 uppercase flex items-center">
                                                    <AlertTriangle className="w-4 h-4 mr-2" /> Error & Diagnostic Information
                                                </h4>
                                                <div className="text-xs space-y-2 text-red-700 leading-relaxed font-semibold">
                                                    {(activeSession || sessions[0])?.errors.map((e: any, i: number) => (
                                                        <div key={i} className="p-2.5 bg-white rounded-lg border border-red-100">
                                                            <p className="font-bold">Step: {e.step}</p>
                                                            <p className="mt-1 font-mono text-[11px] text-gray-700 break-all">{e.error}</p>
                                                            <p className="mt-2 text-primary-green font-bold">Recommended fix: Check if server is running, configurations are loaded, and the local DB is seeded.</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Safety Clear Data Confirmation Modal */}
            {showClearModal && sessionToClear && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 border border-gray-100 overflow-hidden relative">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 uppercase">Confirm Data Cleanup</h3>
                        </div>

                        <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                            You are about to delete all sandbox users, pickups, bins, payments, and audit logs created during this simulation session. Unrelated production data will not be affected.
                        </p>

                        <div className="my-5 p-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs space-y-1">
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold">SESSION ID:</span>
                                <span className="font-mono font-bold text-gray-700 select-all">{sessionToClear.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold">SCENARIO:</span>
                                <span className="font-bold text-gray-700 uppercase">{sessionToClear.scenario.replace('_', ' ')}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Type Session ID to Confirm</Label>
                            <input
                                type="text"
                                placeholder={sessionToClear.id}
                                value={clearConfirmId}
                                onChange={(e) => setClearConfirmId(e.target.value)}
                                className="w-full h-11 px-3 border border-gray-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-700"
                            />
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <Button
                                onClick={() => { setShowClearModal(false); setSessionToClear(null); }}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold h-11 rounded-xl transition-all"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleClearData}
                                disabled={clearConfirmId !== sessionToClear.id || isClearing}
                                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold h-11 rounded-xl transition-all shadow-md"
                            >
                                {isClearing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                Clear Data
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

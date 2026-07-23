import { apiGet, apiPost } from '../lib/api-client';

export interface SimulationLog {
    timestamp: string;
    level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
    message: string;
}

export interface SimulationSession {
    id: string;
    startedBy: string;
    startedAt: string;
    status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED' | 'CANCELLED' | 'CLEARED';
    scenario: string;
    progress: number;
    completedSteps: number;
    totalSteps: number;
    logs: SimulationLog[];
    errors: any[];
    finalResult: {
        totalTests: number;
        passed: number;
        failed: number;
        warnings: number;
        apiTests: number;
        databaseTests: number;
        createdRecords: {
            users: string[];
            pickups: string[];
            bins: string[];
            payments: string[];
        };
    } | null;
}

export const simulationService = {
    start: async (scenario: string): Promise<{ success: boolean; data: SimulationSession }> => {
        const response: any = await apiPost('/simulation/start', { scenario });
        return response;
    },

    getSessions: async (): Promise<SimulationSession[]> => {
        const response: any = await apiGet('/simulation/sessions');
        return response?.data ?? response ?? [];
    },

    getSession: async (id: string): Promise<SimulationSession> => {
        const response: any = await apiGet(`/simulation/sessions/${id}`);
        return response?.data ?? response;
    },

    cancel: async (id: string): Promise<{ success: boolean; data: SimulationSession }> => {
        const response: any = await apiPost(`/simulation/sessions/${id}/cancel`, {});
        return response;
    },

    clear: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response: any = await apiPost(`/simulation/sessions/${id}/clear`, {});
        return response;
    }
};

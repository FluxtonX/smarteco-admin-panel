import { apiGet, apiPost } from "@/lib/api-client";

export interface HealthStatus {
    status: "UP" | "DOWN";
    timestamp: string;
}

export const systemService = {
    /** GET /api/v1/health */
    async checkHealth(): Promise<HealthStatus> {
        try {
            const res = await apiGet<{ status: string; timestamp: string }>('/health');
            return {
                status: res.status === 'UP' ? 'UP' : 'DOWN',
                timestamp: res.timestamp
            };
        } catch (e) {
            return { status: 'DOWN', timestamp: new Date().toISOString() };
        }
    },

    /** POST /api/v1/whatsapp/send */
    async sendWhatsApp(phone: string, message: string): Promise<boolean> {
        try {
            const res = await apiPost<{ success: boolean }>('/whatsapp/send', { phone, message });
            return res.success;
        } catch (e) {
            return false;
        }
    },

    /** POST /api/v1/ussd/callback (Simulation) */
    async simulateUssd(sessionId: string, phoneNumber: string, text: string): Promise<any> {
        return apiPost('/ussd/callback', { sessionId, phoneNumber, text });
    },

    /** POST /api/v1/whatsapp/webhook (Simulation) */
    async simulateWhatsAppWebhook(from: string, body: string): Promise<any> {
        return apiPost('/whatsapp/webhook', { 
            message: {
                from,
                text: { body }
            }
        });
    }
};

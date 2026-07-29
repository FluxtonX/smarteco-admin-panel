import { apiGet, apiPost, apiPostText } from "@/lib/api-client";

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
    async sendWhatsApp(phone: string, message: string): Promise<{ success: boolean; message?: string }> {
        try {
            const res = await apiPost<{ success: boolean; data?: any; message?: string }>('/whatsapp/send', {
                to: phone,
                message
            });
            return { success: res.success !== false, message: res.message || "Message processed by gateway" };
        } catch (e: any) {
            return { success: false, message: e.message || "WhatsApp gateway error" };
        }
    },

    /** POST /api/v1/ussd/callback (Simulation) */
    async simulateUssd(sessionId: string, phoneNumber: string, text: string): Promise<string> {
        try {
            const responseText = await apiPostText('/ussd/callback', {
                sessionId,
                phoneNumber,
                text,
                serviceCode: '*123#'
            });
            return responseText;
        } catch (e: any) {
            throw new Error(e.message || "USSD simulation failed");
        }
    },

    /** POST /api/v1/whatsapp/webhook (Simulation) */
    async simulateWhatsAppWebhook(from: string, body: string): Promise<any> {
        return apiPost('/whatsapp/webhook', {
            From: from,
            Body: body,
            MessageSid: `SM_${Date.now()}`
        });
    }
};

import { apiGet, apiPost } from '@/lib/api-client';

export interface PaymentStat {
    label: string;
    value: string;
    trend: string;
    trendType: 'up' | 'down';
    iconType: 'revenue' | 'success' | 'failed' | 'pending';
    subtext: string;
}

export interface RevenueDayData {
    day: string;
    amount: number;
}

export interface RevenueWasteData {
    name: string;
    value: number;
    color: string;
}

export interface TransactionRecord {
    id: string;
    momoId: string;
    user: string;
    amount: string;
    method: 'MTN MoMo' | 'Airtel Money';
    status: 'In Progress' | 'Completed' | 'Pending' | 'Failed';
    timestamp: string;
    webhook: 'Delivered' | 'Pending' | 'Failed';
}

interface PaymentApiResponse {
    success: boolean;
    data: any[];
}

interface PaymentPayload {
    amount: number;
    currency?: string;
    phone: string;
    method: string;
}

export const paymentService = {
    initiatePayment: async (payload: PaymentPayload) => {
        return apiPost('/payments', payload);
    },

    checkPaymentStatus: async (paymentId: string) => {
        return apiGet(`/payments/${paymentId}/status`);
    },

    simulateMomoWebhook: async (payload: any) => {
        return apiPost('/payments/webhook/momo', payload);
    },

    simulateAirtelWebhook: async (payload: any) => {
        return apiPost('/payments/webhook/airtel', payload);
    },

    getTransactions: async (): Promise<TransactionRecord[]> => {
        try {
            const res = await apiGet<PaymentApiResponse>('/payments');
            if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                return res.data.map((txn: any) => ({
                    id: txn.id || `TXN-${Math.floor(Math.random() * 99999)}`,
                    momoId: txn.transactionId || 'MOMO-PENDING',
                    user: txn.user ? `${txn.user.firstName || ''} ${txn.user.lastName || ''}`.trim() || txn.user.phone : (txn.phone || 'Anonymous'),
                    amount: `${(txn.amount || 0).toLocaleString()} RWF`,
                    method: String(txn.method).toLowerCase().includes('airtel') ? 'Airtel Money' : 'MTN MoMo',
                    status: (txn.status === 'SUCCESS' || txn.status === 'COMPLETED' ? 'Completed' : 
                             txn.status === 'FAIL' || txn.status === 'FAILED' ? 'Failed' : 
                             txn.status === 'PENDING' ? 'Pending' : 'Completed') as any,
                    timestamp: txn.createdAt ? new Date(txn.createdAt).toISOString().slice(0, 16).replace('T', ' ') : new Date().toISOString(),
                    webhook: (txn.status === 'SUCCESS' || txn.status === 'COMPLETED') ? 'Delivered' : 'Pending'
                }));
            }
        } catch (e) {
            console.error("Backend /payments unreached:", e);
        }
        return [];
    },

    getStats: async (): Promise<PaymentStat[]> => {
        let totalRevenueVal = 0;
        let successfulCount = 0;
        let failedCount = 0;
        let pendingCount = 0;

        try {
            const res = await apiGet<{ success: boolean; data: any }>('/admin/analytics/revenue');
            if (res.success && res.data) {
                const d = res.data;
                totalRevenueVal = d.totalRevenueRWF ?? d.totalAmount ?? 0;
                successfulCount = d.totalTransactions ?? d.successfulCount ?? 0;
            }
        } catch (e) {}

        try {
            if (totalRevenueVal === 0) {
                const dashRes = await apiGet<{ success: boolean; data: any }>('/admin/dashboard');
                if (dashRes.success && dashRes.data?.revenue?.totalRWF) {
                    totalRevenueVal = dashRes.data.revenue.totalRWF;
                }
            }
        } catch (e) {}

        const liveTxns = await paymentService.getTransactions();
        const completedTxns = liveTxns.filter(t => t.status === 'Completed');
        const calculatedSum = completedTxns.reduce((acc, curr) => {
            const val = parseInt(curr.amount.replace(/\D/g, '')) || 0;
            return acc + val;
        }, 0);

        if (successfulCount === 0) {
            successfulCount = completedTxns.length;
        }
        failedCount = liveTxns.filter(t => t.status === 'Failed').length;
        pendingCount = liveTxns.filter(t => t.status === 'Pending').length;

        if (totalRevenueVal === 0 && calculatedSum > 0) {
            totalRevenueVal = calculatedSum;
        }

        return [
            {
                label: "Total Revenue",
                value: `${totalRevenueVal.toLocaleString()} RWF`,
                trend: "Live",
                trendType: "up",
                iconType: "revenue",
                subtext: "Live revenue"
            },
            {
                label: "Successful",
                value: `${successfulCount}`,
                trend: "100%",
                trendType: "up",
                iconType: "success",
                subtext: "payment success"
            },
            {
                label: "Failed",
                value: `${failedCount}`,
                trend: "0%",
                trendType: "down",
                iconType: "failed",
                subtext: "Requires attention"
            },
            {
                label: "Pending",
                value: `${pendingCount}`,
                trend: "0",
                trendType: "up",
                iconType: "pending",
                subtext: "In verification"
            },
        ];
    },

    getRevenueByDay: async (): Promise<RevenueDayData[]> => {
        const daysMap: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        try {
            const res = await apiGet<{ success: boolean; data: any }>('/admin/analytics/revenue');
            if (res.success && res.data && Array.isArray(res.data.dailyRevenue) && res.data.dailyRevenue.length > 0) {
                return res.data.dailyRevenue;
            }
        } catch (e) {}

        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
            day,
            amount: daysMap[day] || 0
        }));
    },

    getRevenueByWaste: async (): Promise<RevenueWasteData[]> => {
        return [
            { name: "Organic", value: 40, color: "#22C55E" },
            { name: "Recyclable", value: 30, color: "#3B82F6" },
            { name: "E-Waste", value: 15, color: "#8B5CF6" },
            { name: "Glass", value: 10, color: "#10B981" },
            { name: "Hazardous", value: 5, color: "#EF4444" },
        ];
    }
};

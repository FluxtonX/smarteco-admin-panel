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

const mockStats: PaymentStat[] = [
    { label: "Total Revenue (Week)", value: "4.5M RWF", trend: "+23%", trendType: "up", iconType: "revenue", subtext: "from last week" },
    { label: "Successful Transactions", value: "3", trend: "60.0%", trendType: "up", iconType: "success", subtext: "success rate" },
    { label: "Failed Transactions", value: "1", trend: "Requires", trendType: "down", iconType: "failed", subtext: "attention" },
    { label: "Pending", value: "1", trend: "", trendType: "up", iconType: "pending", subtext: "" },
];

const mockRevenueDay: RevenueDayData[] = [
    { day: "Mon", amount: 450000 },
    { day: "Tue", amount: 520000 },
    { day: "Wed", amount: 680000 },
    { day: "Thu", amount: 600000 },
    { day: "Fri", amount: 720000 },
    { day: "Sat", amount: 880000 },
    { day: "Sun", amount: 620000 },
];

const mockRevenueWaste: RevenueWasteData[] = [
    { name: "Organic", value: 34, color: "#22C55E" },
    { name: "Recyclable", value: 26, color: "#3B82F6" },
    { name: "E-Waste", value: 17, color: "#8B5CF6" },
    { name: "Glass", value: 12, color: "#10B981" },
    { name: "Hazardous", value: 11, color: "#EF4444" },
];

const mockTransactions: TransactionRecord[] = [
    { id: "TXN-001234", momoId: "MOMO-123456", user: "Jean Pierre", amount: "2,500 RWF", method: "MTN MoMo", status: "Completed", timestamp: "2024-02-24 09:15", webhook: "Delivered" },
    { id: "TXN-001235", momoId: "AIRTEL-234567", user: "Marie Uwase", amount: "1,800 RWF", method: "Airtel Money", status: "Completed", timestamp: "2024-02-24 08:45", webhook: "Delivered" },
    { id: "TXN-001236", momoId: "MOMO-345678", user: "Green Solutions", amount: "5,000 RWF", method: "MTN MoMo", status: "Pending", timestamp: "2024-02-24 10:30", webhook: "Pending" },
    { id: "TXN-001237", momoId: "AIRTEL-456789", user: "Aline Mutoni", amount: "1,200 RWF", method: "Airtel Money", status: "Failed", timestamp: "2024-02-24 11:00", webhook: "Failed" },
];

export const paymentService = {
    getStats: async (): Promise<PaymentStat[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockStats), 300));
    },
    getRevenueByDay: async (): Promise<RevenueDayData[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockRevenueDay), 400));
    },
    getRevenueByWaste: async (): Promise<RevenueWasteData[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockRevenueWaste), 400));
    },
    getTransactions: async (): Promise<TransactionRecord[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockTransactions), 500));
    }
};

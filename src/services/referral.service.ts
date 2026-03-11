export interface ReferralStat {
    label: string;
    value: string;
    trend: string;
    trendType: 'up' | 'down';
    iconType: 'referrals' | 'valid' | 'pending' | 'bonus';
    subtext: string;
}

export interface ReferralPerformanceData {
    week: string;
    referrals: number;
    bonus: number;
}

export interface ReferralRecord {
    id: string;
    referrer: string;
    referrerPhone: string;
    referralCode: string;
    referredUser: string;
    status: 'Valid' | 'Pending' | 'Disputed';
    bonus: string;
    date: string;
}

const mockStats: ReferralStat[] = [
    { label: "Total Referrals", value: "5", trend: "+15%", trendType: "up", iconType: "referrals", subtext: "this month" },
    { label: "Valid Referrals", value: "3", trend: "60.0%", trendType: "up", iconType: "valid", subtext: "success rate" },
    { label: "Pending Approval", value: "1", trend: "", trendType: "up", iconType: "pending", subtext: "" },
    { label: "Total Bonus Issued", value: "300 pts", trend: "", trendType: "up", iconType: "bonus", subtext: "" },
];

const mockPerformance: ReferralPerformanceData[] = [
    { week: "Week 1", referrals: 2200, bonus: 0 },
    { week: "Week 2", referrals: 3200, bonus: 0 },
    { week: "Week 3", referrals: 2400, bonus: 0 },
    { week: "Week 4", referrals: 3600, bonus: 0 },
];

const mockReferrals: ReferralRecord[] = [
    { id: "REF-001", referrer: "Jean Pierre", referrerPhone: "+250 788 123 456", referralCode: "ECOJB2024", referredUser: "Marie Uwase", status: "Valid", bonus: "100 pts", date: "2024-02-20" },
    { id: "REF-002", referrer: "Marie Uwase", referrerPhone: "+250 788 234 567", referralCode: "ECOJB2024", referredUser: "Samuel Nkurunziza", status: "Valid", bonus: "100 pts", date: "2024-02-21" },
    { id: "REF-003", referrer: "Aline Mutoni", referrerPhone: "+250 788 345 678", referralCode: "ECOJB2024", referredUser: "Patrick Habimana", status: "Pending", bonus: "--", date: "2024-02-23" },
    { id: "REF-004", referrer: "Green Solutions Ltd", referrerPhone: "+250 788 456 789", referralCode: "ECOJB2024", referredUser: "David Mugisha", status: "Disputed", bonus: "--", date: "2024-02-22" },
    { id: "REF-005", referrer: "Samuel", referrerPhone: "+250 788 567 890", referralCode: "ECOJB2024", referredUser: "Amani", status: "Valid", bonus: "100 pts", date: "2024-02-24" },
];

export const referralService = {
    getStats: async (): Promise<ReferralStat[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockStats), 300));
    },
    getPerformance: async (): Promise<ReferralPerformanceData[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockPerformance), 400));
    },
    getReferrals: async (): Promise<ReferralRecord[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockReferrals), 500));
    }
};

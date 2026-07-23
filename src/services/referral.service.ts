import { apiGet } from '@/lib/api-client';

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

interface ReferredUser {
    firstName: string | null;
    lastName: string | null;
    joinedAt: string;
    firstPickupCompleted: boolean;
}

interface ReferralInfoData {
    referralCode: string;
    referralLink: string;
    totalReferred: number;
    pointsEarned: number;
    referredUsers: ReferredUser[];
}

interface GetReferralInfoResponse {
    success: boolean;
    data: ReferralInfoData;
}

export const referralService = {
    async getReferralData(): Promise<GetReferralInfoResponse['data']> {
        try {
            const res = await apiGet<GetReferralInfoResponse>('/users/me/referral');
            if (res.success && res.data && Array.isArray(res.data.referredUsers)) {
                return res.data;
            }
        } catch (e) {
            console.warn("Backend /users/me/referral unreached:", e);
        }
        return {
            referralCode: "N/A",
            referralLink: "",
            totalReferred: 0,
            pointsEarned: 0,
            referredUsers: []
        };
    },

    async getStats(): Promise<ReferralStat[]> {
        const data = await this.getReferralData();

        const validCount = data.referredUsers.filter((u) => u.firstPickupCompleted).length;
        const pendingCount = data.referredUsers.filter((u) => !u.firstPickupCompleted).length;
        const successRate = data.totalReferred > 0
            ? ((validCount / data.totalReferred) * 100).toFixed(1)
            : '0.0';

        return [
            {
                label: 'Total Referrals',
                value: String(data.totalReferred),
                trend: '',
                trendType: 'up',
                iconType: 'referrals',
                subtext: 'registered via your code',
            },
            {
                label: 'Valid Referrals',
                value: String(validCount),
                trend: `${successRate}%`,
                trendType: 'up',
                iconType: 'valid',
                subtext: 'success rate',
            },
            {
                label: 'Pending Approval',
                value: String(pendingCount),
                trend: '',
                trendType: 'up',
                iconType: 'pending',
                subtext: 'no pickup yet',
            },
            {
                label: 'Total Bonus Issued',
                value: `${data.pointsEarned} pts`,
                trend: '',
                trendType: 'up',
                iconType: 'bonus',
                subtext: 'EcoPoints earned',
            },
        ];
    },

    async getPerformance(): Promise<ReferralPerformanceData[]> {
        const data = await this.getReferralData();

        const now = new Date();
        const weeks: ReferralPerformanceData[] = Array.from({ length: 4 }, (_, i) => ({
            week: `Week ${i + 1}`,
            referrals: 0,
            bonus: 0,
        }));

        for (const user of data.referredUsers) {
            const joined = new Date(user.joinedAt);
            const diffDays = Math.floor((now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24));
            const weekIndex = Math.min(Math.floor(diffDays / 7), 3);
            const slot = 3 - weekIndex;
            if (slot >= 0 && slot < 4) {
                weeks[slot].referrals += 1;
                if (user.firstPickupCompleted) weeks[slot].bonus += 100;
            }
        }

        return weeks;
    },

    async getReferrals(): Promise<ReferralRecord[]> {
        const data = await this.getReferralData();

        return data.referredUsers.map((user, idx) => {
            const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown';
            return {
                id: `REF-${String(idx + 1).padStart(3, '0')}`,
                referrer: 'Me',
                referrerPhone: '',
                referralCode: data.referralCode,
                referredUser: fullName,
                status: user.firstPickupCompleted ? 'Valid' : 'Pending',
                bonus: user.firstPickupCompleted ? '100 pts' : '--',
                date: new Date(user.joinedAt).toISOString().split('T')[0],
            };
        });
    },
};

/**
 * Referral Service — Real API Integration
 * Calls GET /api/v1/users/me/referral
 */

import { apiGet } from '@/lib/api-client';

// ─── Frontend display interfaces (used by referral page components) ───────────

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

// ─── Backend response shape ───────────────────────────────────────────────────

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

// ─── Service ─────────────────────────────────────────────────────────────────

export const referralService = {
    /**
     * GET /api/v1/users/me/referral
     * Fetches referral code, link, counts, points earned and list of referred users.
     * Maps the backend response into the display interfaces expected by the UI components.
     */
    async getReferralData(): Promise<GetReferralInfoResponse['data']> {
        const res = await apiGet<GetReferralInfoResponse>('/users/me/referral');
        return res.data;
    },

    /**
     * Returns summary stat cards mapped from the live API response.
     */
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

    /**
     * Returns weekly performance chart data.
     * Groups referred users by their join week (last 4 weeks).
     */
    async getPerformance(): Promise<ReferralPerformanceData[]> {
        const data = await this.getReferralData();

        // Build 4-week buckets from today backwards
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
            const slot = 3 - weekIndex; // most recent = Week 4
            if (slot >= 0 && slot < 4) {
                weeks[slot].referrals += 1;
                if (user.firstPickupCompleted) weeks[slot].bonus += 100;
            }
        }

        return weeks;
    },

    /**
     * Returns table rows for the referred users list.
     */
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

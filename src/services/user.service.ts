/**
 * User Service — Real API Integration
 * Calls GET /api/v1/users/me, PATCH /api/v1/users/me, PUT /api/v1/users/me/fcm-token
 */

import { apiGet, apiPatch, apiPut, apiPost } from '@/lib/api-client';

// ─── Response Types (matches backend shape) ───────────────────────────────────

export interface UserProfile {
    id: string;
    phone: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    userType: 'RESIDENTIAL' | 'BUSINESS';
    role: string;
    referralCode: string | null;
    avatarUrl: string | null;
    isActive: boolean;
    ecoPoints: number;
    ecoTier: 'ECO_STARTER' | 'ECO_WARRIOR' | 'ECO_CHAMPION';
    tierMultiplier: number;
    totalPickups: number;
    memberSince: string;
}

export interface UpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    userType?: 'RESIDENTIAL' | 'BUSINESS';
    avatarUrl?: string;
}

// Legacy interface kept for compatibility with the existing UserTable component
export interface UserRecord {
    id: string;
    name: string;
    phone: string;
    type: string;
    tier: string;
    points: string;
    pickups: number;
    status: 'Active' | 'Suspended';
    location: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

interface GetProfileResponse {
    success: boolean;
    data: UserProfile;
}

interface UpdateProfileResponse {
    success: boolean;
    message: string;
    data: Omit<UserProfile, 'ecoPoints' | 'ecoTier' | 'tierMultiplier' | 'totalPickups' | 'memberSince' | 'isActive'>;
}

interface UpdateFcmTokenResponse {
    success: boolean;
    message: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const userService = {
    /**
     * GET /api/v1/users/me
     * Returns the currently authenticated admin's own profile.
     */
    async getProfile(): Promise<UserProfile> {
        const res = await apiGet<GetProfileResponse>('/users/me');
        return res.data;
    },

    /**
     * PATCH /api/v1/users/me
     * Updates profile fields for the authenticated user.
     * Only provided fields are updated (all optional).
     */
    async updateProfile(payload: UpdateProfilePayload): Promise<UpdateProfileResponse['data']> {
        const res = await apiPatch<UpdateProfileResponse>('/users/me', payload);
        return res.data;
    },

    /**
     * PUT /api/v1/users/me/fcm-token
     * Updates the FCM push notification token.
     * Call on app startup or when the FCM token refreshes.
     */
    async updateFcmToken(fcmToken: string): Promise<{ success: boolean; message: string }> {
        const res = await apiPut<UpdateFcmTokenResponse>('/users/me/fcm-token', { fcmToken });
        return res;
    },

    /**
     * GET /api/v1/admin/users
     * Admin-only endpoint to list all users in the system.
     */
    async getUsers(): Promise<UserRecord[]> {
        const res = await apiGet<{ success: boolean; data: any[] }>('/admin/users');
        if (res.success && res.data) {
            return res.data.map(u => ({
                id: u.id,
                name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.phone,
                phone: u.phone,
                type: u.userType === 'RESIDENTIAL' ? 'Residential' : 'Business',
                tier: u.ecoTier === 'ECO_STARTER' ? 'Eco Starter' : u.ecoTier === 'ECO_WARRIOR' ? 'Eco Warrior' : 'Eco Champion',
                points: (u.ecoPoints || 0).toLocaleString(),
                pickups: u.totalPickups || 0,
                status: u.isActive ? 'Active' : 'Suspended',
                location: u.homeAddress || 'Kigali'
            }));
        }
        return [];
    },

    /**
     * PATCH /api/v1/admin/users/{id}
     * Admin-only endpoint to update user status or details.
     */
    async toggleUserStatus(userId: string): Promise<boolean> {
        // Fetch current user record to toggle status
        const users = await this.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return false;

        const newStatus = user.status === 'Active' ? false : true;
        const res = await apiPatch<{ success: boolean }>(`/admin/users/${userId}`, {
            isActive: newStatus
        });
        return res.success;
    },

    async createUser(userData: any): Promise<boolean> {
        const res = await apiPost<{ success: boolean }>('/admin/users', userData);
        return res.success;
    },
};

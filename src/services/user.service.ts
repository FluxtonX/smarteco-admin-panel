import { apiGet, apiDelete, apiPost, apiPatch } from '../lib/api-client';

export interface UserProfile {
    id: string;
    phone: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    userType: string;
    role: string;
    subRole?: string | null;
    avatarUrl: string | null;
    ecoPoints: number;
    ecoTier: string;
    totalPickups: number;
}

export interface UserRecord {
    id: string;       // Display ID (e.g. USR-A1B2C)
    rawId: string;    // Actual UUID for API requests
    name: string;
    firstName?: string;
    lastName?: string;
    phone: string;
    email?: string;
    location: string;
    type: "Residential" | "Business";
    tier: string;
    points: number;
    pickups: number;
    status: "Active" | "Suspended";
}

export interface DashboardStats {
    users: {
        total: number;
        residential: number;
        business: number;
        active: number;
        suspended: number;
        newThisWeek: number;
        tierDistribution: {
            ECO_STARTER: number;
            ECO_WARRIOR: number;
            ECO_CHAMPION: number;
        };
    };
    pickups: {
        totalCompleted: number;
        todayScheduled: number;
        todayCompleted: number;
    };
    revenue: {
        totalRWF: number;
        thisMonthRWF: number;
        todayRWF: number;
    };
    collectors: {
        total: number;
        avgRating: number;
    };
}

function mapTier(ecoTier?: string): string {
    if (!ecoTier) return 'Eco Starter';
    switch (ecoTier.toUpperCase().replace(/\s+/g, '_')) {
        case 'ECO_CHAMPION': return 'Eco Champion';
        case 'ECO_WARRIOR': return 'Eco Warrior';
        default: return 'Eco Starter';
    }
}

export const userService = {
    getProfile: async (): Promise<UserProfile> => {
        const response: any = await apiGet('/users/me');
        return response.data;
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<boolean> => {
        try {
            const res: any = await apiPatch('/users/me', data);
            return res?.success ?? true;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    },

    createUser: async (data: any): Promise<boolean> => {
        try {
            const res: any = await apiPost('/admin/users', data);
            return res?.success ?? true;
        } catch (error) {
            console.error('Failed to create user:', error);
            throw error;
        }
    },

    getUsers: async (): Promise<UserRecord[]> => {
        try {
            const response: any = await apiGet('/admin/users');
            if (response && (response.success || Array.isArray(response.data) || Array.isArray(response))) {
                const list = Array.isArray(response) ? response : (response.data ?? []);
                return list.map((u: any) => {
                    const fullName = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.phone || 'Resident';
                    return {
                        id: `USR-${String(u.id).slice(0, 6).toUpperCase()}`,
                        rawId: u.id,
                        name: fullName,
                        firstName: u.firstName || '',
                        lastName: u.lastName || '',
                        phone: u.phone || 'No Phone',
                        email: u.email || '',
                        location: u.defaultAddress || u.location || 'Kigali, Rwanda',
                        type: u.userType === 'BUSINESS' ? 'Business' : 'Residential',
                        tier: mapTier(u.ecoTier || u.tier),
                        points: u.ecoPoints ?? 0,
                        pickups: u.totalPickups ?? 0,
                        status: u.isActive === false ? 'Suspended' : 'Active',
                    };
                });
            }
        } catch (error) {
            console.warn('Backend /admin/users API unreached:', error);
        }
        return [];
    },

    getDashboardStats: async (): Promise<DashboardStats | null> => {
        try {
            const response: any = await apiGet('/admin/dashboard');
            const stats = response?.data || response;
            if (stats && stats.users) {
                return stats;
            }
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        }
        return null;
    },

    toggleUserStatus: async (rawId: string): Promise<boolean> => {
        try {
            const res: any = await apiPatch(`/admin/users/${rawId}/toggle-status`, {});
            return res?.success ?? true;
        } catch (error) {
            console.error(`Failed to toggle status for user ${rawId}:`, error);
            return false;
        }
    },

    updateUser: async (rawId: string, updates: Partial<UserRecord>): Promise<boolean> => {
        try {
            const payload: any = {};
            if (updates.firstName !== undefined) payload.firstName = updates.firstName;
            if (updates.lastName !== undefined) payload.lastName = updates.lastName;
            if (updates.name !== undefined) {
                const parts = updates.name.trim().split(' ');
                payload.firstName = parts[0] || '';
                payload.lastName = parts.slice(1).join(' ') || '';
            }
            if (updates.type !== undefined) payload.userType = updates.type.toUpperCase();
            if (updates.tier !== undefined) payload.tier = updates.tier;
            if (updates.points !== undefined) payload.ecoPoints = Number(updates.points);
            if (updates.status !== undefined) payload.isActive = updates.status === 'Active';
            if (updates.phone !== undefined) payload.phone = updates.phone;
            if (updates.email !== undefined) payload.email = updates.email;

            const res: any = await apiPatch(`/admin/users/${rawId}`, payload);
            return res?.success ?? true;
        } catch (error) {
            console.error(`Failed to update user ${rawId}:`, error);
            return false;
        }
    },

    deleteUser: async (rawId: string): Promise<boolean> => {
        try {
            const res: any = await apiDelete(`/admin/users/${rawId}`);
            return res?.success ?? true;
        } catch (error) {
            console.error(`Failed to delete user ${rawId}:`, error);
            return false;
        }
    }
};

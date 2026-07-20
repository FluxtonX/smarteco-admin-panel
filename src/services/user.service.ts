import { apiGet, apiDelete, apiPost, apiPatch } from '../lib/api-client';

export interface UserProfile {
    id: string;
    phone: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    userType: string;
    role: string;
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

const MOCK_USERS: UserRecord[] = [
    {
        id: "USR-A1B2C3",
        rawId: "a1b2c3d4-0001-4000-8000-000000000001",
        name: "Jean Baptiste",
        firstName: "Jean",
        lastName: "Baptiste",
        phone: "+250 788 123 456",
        email: "jean.baptiste@smarteco.rw",
        location: "KN 4 Ave, Nyarugenge",
        type: "Residential",
        tier: "Eco Champion",
        points: 450,
        pickups: 32,
        status: "Active"
    },
    {
        id: "USR-D4E5F6",
        rawId: "a1b2c3d4-0002-4000-8000-000000000002",
        name: "Kigali Heights Commercial",
        firstName: "Kigali Heights",
        lastName: "Commercial",
        phone: "+250 788 987 654",
        email: "operations@kigaliheights.rw",
        location: "KG 7 Ave, Kacyiru",
        type: "Business",
        tier: "Eco Champion",
        points: 1250,
        pickups: 84,
        status: "Active"
    },
    {
        id: "USR-G7H8I9",
        rawId: "a1b2c3d4-0003-4000-8000-000000000003",
        name: "Marie Claire Uwimana",
        firstName: "Marie Claire",
        lastName: "Uwimana",
        phone: "+250 783 112 233",
        email: "marie.claire@gmail.com",
        location: "KG 11 Ave, Remera",
        type: "Residential",
        tier: "Eco Warrior",
        points: 210,
        pickups: 15,
        status: "Active"
    },
    {
        id: "USR-J1K2L3",
        rawId: "a1b2c3d4-0004-4000-8000-000000000004",
        name: "Hotel des Mille Collines",
        firstName: "Hotel Mille",
        lastName: "Collines",
        phone: "+250 788 555 444",
        email: "sustainability@millecollines.rw",
        location: "KN 2 Ave, Nyarugenge",
        type: "Business",
        tier: "Eco Warrior",
        points: 780,
        pickups: 48,
        status: "Active"
    },
    {
        id: "USR-M4N5O6",
        rawId: "a1b2c3d4-0005-4000-8000-000000000005",
        name: "Emmanuel Nzeyimana",
        firstName: "Emmanuel",
        lastName: "Nzeyimana",
        phone: "+250 782 999 888",
        email: "emmanuel.n@yahoo.com",
        location: "KG 17 Ave, Kimironko",
        type: "Residential",
        tier: "Eco Starter",
        points: 45,
        pickups: 4,
        status: "Suspended"
    },
    {
        id: "USR-P7Q8R9",
        rawId: "a1b2c3d4-0006-4000-8000-000000000006",
        name: "Inyange Foods Ltd",
        firstName: "Inyange",
        lastName: "Foods",
        phone: "+250 788 333 222",
        email: "recycling@inyange.rw",
        location: "KK 6 Ave, Gikondo",
        type: "Business",
        tier: "Eco Champion",
        points: 1890,
        pickups: 112,
        status: "Active"
    },
    {
        id: "USR-S1T2U3",
        rawId: "a1b2c3d4-0007-4000-8000-000000000007",
        name: "Aline Mutesi",
        firstName: "Aline",
        lastName: "Mutesi",
        phone: "+250 781 444 777",
        email: "aline.mutesi@gmail.com",
        location: "KN 20 Ave, Nyamirambo",
        type: "Residential",
        tier: "Eco Starter",
        points: 20,
        pickups: 2,
        status: "Active"
    },
    {
        id: "USR-V4W5X6",
        rawId: "a1b2c3d4-0008-4000-8000-000000000008",
        name: "Kicukiro Green Hub",
        firstName: "Kicukiro",
        lastName: "Green Hub",
        phone: "+250 788 666 111",
        email: "kicukiro.hub@smarteco.rw",
        location: "KK 15 Rd, Kicukiro",
        type: "Business",
        tier: "Eco Warrior",
        points: 340,
        pickups: 22,
        status: "Suspended"
    }
];

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
            const list = Array.isArray(response) ? response : (response?.data ?? []);
            if (list.length > 0) {
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
            console.warn('Backend /admin/users API unavailable, using fallback mock users:', error);
        }
        return MOCK_USERS;
    },

    getDashboardStats: async (): Promise<DashboardStats | null> => {
        try {
            const response: any = await apiGet('/admin/dashboard');
            const stats = response?.data || response;
            if (stats && stats.users) {
                return stats;
            }
        } catch (error) {
            console.warn('Backend dashboard stats unavailable:', error);
        }
        return null;
    },

    deleteUser: async (rawId: string): Promise<boolean> => {
        try {
            await apiDelete(`/admin/users/${rawId}`);
            return true;
        } catch (error) {
            console.warn(`Backend delete call failed for ${rawId}, updating local state:`, error);
            return true;
        }
    },

    updateUserAdmin: async (rawId: string, data: Partial<UserRecord>): Promise<boolean> => {
        try {
            const payload: any = {};
            if (data.name) {
                const parts = data.name.trim().split(' ');
                payload.firstName = parts[0];
                payload.lastName = parts.slice(1).join(' ');
            }
            if (data.firstName) payload.firstName = data.firstName;
            if (data.lastName) payload.lastName = data.lastName;
            if (data.phone) payload.phone = data.phone;
            if (data.email) payload.email = data.email;
            if (data.type) payload.userType = data.type === 'Business' ? 'BUSINESS' : 'RESIDENTIAL';
            if (data.tier) payload.tier = data.tier.toUpperCase().replace(/\s+/g, '_');
            if (data.points !== undefined) payload.ecoPoints = data.points;
            if (data.status) payload.isActive = data.status === 'Active';

            const res: any = await apiPatch(`/admin/users/${rawId}`, payload);
            return res?.success ?? true;
        } catch (error) {
            console.warn(`Backend update user ${rawId} failed, applying local update:`, error);
            return true;
        }
    },

    toggleUserStatus: async (rawId: string): Promise<boolean> => {
        try {
            const res: any = await apiPatch(`/admin/users/${rawId}/toggle-status`, {});
            return res?.success ?? true;
        } catch (error) {
            console.warn(`Backend toggle status for ${rawId} failed:`, error);
            return true;
        }
    }
};

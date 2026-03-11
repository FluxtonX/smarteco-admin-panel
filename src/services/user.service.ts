/**
 * Mock Service for User Management
 */

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

export const userService = {
    async getUsers(): Promise<UserRecord[]> {
        await new Promise(resolve => setTimeout(resolve, 700));
        return [
            { id: "USR-001", name: "Jean Pierre Mugisha", phone: "+250 788 123 456", type: "Residential", tier: "Eco Warrior", points: "1,250", pickups: 2, status: "Active", location: "Kigali North" },
            { id: "USR-002", name: "Marie Uwase", phone: "+250 788 234 567", type: "Business", tier: "Eco Champion", points: "3,450", pickups: 5, status: "Active", location: "Kigali East" },
            { id: "USR-003", name: "Samuel Nkurunziza", phone: "+250 788 345 678", type: "Residential", tier: "Eco Starter", points: "450", pickups: 1, status: "Active", location: "Kigali West" },
            { id: "USR-004", name: "Doreen Umutoni", phone: "+250 788 456 789", type: "Residential", tier: "Eco Warrior", points: "150", pickups: 0, status: "Suspended", location: "Kigali South" },
        ];
    },

    async toggleUserStatus(userId: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`User ${userId} status toggled`);
        return true;
    },

    async createUser(userData: any): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log('User created:', userData);
        return true;
    }
};

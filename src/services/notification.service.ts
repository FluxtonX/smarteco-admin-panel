import { apiGet, apiPatch } from "@/lib/api-client";

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: "info" | "warning" | "error" | "success";
    isRead: boolean;
    createdAt: string;
}

export const notificationService = {
    async getNotifications(): Promise<Notification[]> {
        const response = await apiGet<{ success: boolean; data: any[] }>("/notifications");
        if (response.success) {
            return response.data.map(n => ({
                id: n.id,
                title: n.title || "System Notification",
                message: n.message,
                type: n.type || "info",
                isRead: n.isRead || false,
                createdAt: n.createdAt,
            }));
        }
        return [];
    },

    async markAsRead(id: string): Promise<boolean> {
        const response = await apiPatch<{ success: boolean }>(`/notifications/${id}/read`, {});
        return response.success;
    },

    async markAllAsRead(): Promise<boolean> {
        const response = await apiPatch<{ success: boolean }>("/notifications/read-all", {});
        return response.success;
    }
};

export type AdminRole =
    | "Super Admin"
    | "Operations Manager"
    | "Finance Admin"
    | "IoT Supervisor"
    | "Support Agent";

export interface PermissionRule {
    module: string;
    route: string;
    allowedRoles: AdminRole[];
}

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
    "Super Admin": [
        "/dashboard",
        "/users",
        "/collectors",
        "/pickups",
        "/bins",
        "/rewards",
        "/payments",
        "/referrals",
        "/reports",
        "/settings",
        "/admin",
        "/audit",
    ],
    "Operations Manager": [
        "/dashboard",
        "/users",
        "/collectors",
        "/pickups",
        "/bins",
        "/reports",
        "/audit",
    ],
    "Finance Admin": [
        "/dashboard",
        "/rewards",
        "/payments",
        "/referrals",
        "/reports",
    ],
    "IoT Supervisor": [
        "/dashboard",
        "/bins",
        "/reports",
    ],
    "Support Agent": [
        "/dashboard",
        "/users",
        "/pickups",
        "/audit",
    ],
};

const STORAGE_ROLE_KEY = "smarteco_admin_role";

export function getCurrentUserRole(): AdminRole {
    if (typeof window === "undefined") return "Super Admin";
    const savedRole = localStorage.getItem(STORAGE_ROLE_KEY) as AdminRole | null;
    if (savedRole && ROLE_PERMISSIONS[savedRole]) {
        return savedRole;
    }
    return "Super Admin";
}

export function setCurrentUserRole(role: AdminRole) {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_ROLE_KEY, role);
    }
}

export function hasRoutePermission(role: AdminRole, href: string): boolean {
    if (role === "Super Admin") return true;
    const allowedRoutes = ROLE_PERMISSIONS[role] || [];
    return allowedRoutes.includes(href);
}

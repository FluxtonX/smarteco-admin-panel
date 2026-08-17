export type AdminRole =
    | "Super Admin"
    | "SUPER_ADMIN"
    | "Operations Manager"
    | "OPERATIONS_MANAGER"
    | "Finance Admin"
    | "FINANCE_ADMIN"
    | "IoT Supervisor"
    | "IOT_SUPERVISOR"
    | "Support Agent"
    | "SUPPORT_AGENT";

export const ROLE_PERMISSIONS: Record<string, string[]> = {
    "Super Admin": [
        "/dashboard",
        "/users",
        "/collectors",
        "/pickups",
        "/bins",
        "/sorting",
        "/rewards",
        "/payments",
        "/referrals",
        "/reports",
        "/settings",
        "/admin",
    ],
    "SUPER_ADMIN": [
        "/dashboard",
        "/users",
        "/collectors",
        "/pickups",
        "/bins",
        "/sorting",
        "/rewards",
        "/payments",
        "/referrals",
        "/reports",
        "/settings",
        "/admin",
    ],
    "Operations Manager": [
        "/dashboard",
        "/users",
        "/collectors",
        "/pickups",
        "/bins",
        "/sorting",
        "/rewards",
        "/reports",
    ],
    "OPERATIONS_MANAGER": [
        "/dashboard",
        "/users",
        "/collectors",
        "/pickups",
        "/bins",
        "/sorting",
        "/rewards",
        "/reports",
    ],
    "Finance Admin": [
        "/dashboard",
        "/payments",
        "/rewards",
        "/referrals",
        "/reports",
    ],
    "FINANCE_ADMIN": [
        "/dashboard",
        "/payments",
        "/rewards",
        "/referrals",
        "/reports",
    ],
    "IoT Supervisor": [
        "/dashboard",
        "/bins",
        "/sorting",
        "/reports",
    ],
    "IOT_SUPERVISOR": [
        "/dashboard",
        "/bins",
        "/sorting",
        "/reports",
    ],
    "Support Agent": [
        "/dashboard",
        "/users",
        "/pickups",
        "/rewards",
    ],
    "SUPPORT_AGENT": [
        "/dashboard",
        "/users",
        "/pickups",
        "/rewards",
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
    if (role === "Super Admin" || role === "SUPER_ADMIN") return true;
    const allowedRoutes = ROLE_PERMISSIONS[role] || [];
    return allowedRoutes.includes(href);
}

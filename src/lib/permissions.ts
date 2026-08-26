export type AdminRole =
    | "Super Admin"
    | "SUPER_ADMIN"
    | "Waste Management (COPED)"
    | "WASTE_MANAGEMENT_COPED"
    | "Operations Manager"
    | "OPERATIONS_MANAGER"
    | "Finance Admin"
    | "FINANCE_ADMIN"
    | "IoT Supervisor"
    | "IOT_SUPERVISOR"
    | "Support Agent"
    | "SUPPORT_AGENT"
    | "Customer"
    | "CUSTOMER";

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
    "Waste Management (COPED)": [
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
    ],
    "WASTE_MANAGEMENT_COPED": [
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
    ],
    "Operations Manager": [
        "/dashboard",
        "/users",
        "/collectors",
        "/pickups",
        "/bins",
        "/sorting",
        "/reports",
    ],
    "OPERATIONS_MANAGER": [
        "/dashboard",
        "/users",
        "/collectors",
        "/pickups",
        "/bins",
        "/sorting",
        "/reports",
    ],
    "Customer": [
        "/dashboard",
        "/collectors",
        "/bins",
        "/sorting",
        "/reports",
    ],
    "CUSTOMER": [
        "/dashboard",
        "/collectors",
        "/bins",
        "/sorting",
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
    const savedUser = localStorage.getItem("smarteco_user");
    if (savedUser) {
        try {
            const parsed = JSON.parse(savedUser);
            const role = parsed.subRole || parsed.role;
            if (role && ROLE_PERMISSIONS[role]) {
                return role as AdminRole;
            }
        } catch { }
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

export function isReadOnlyRole(role: AdminRole): boolean {
    return (
        role === "Operations Manager" ||
        role === "OPERATIONS_MANAGER" ||
        role === "Customer" ||
        role === "CUSTOMER"
    );
}

export function canCreateAccountType(currentRole: AdminRole, targetRole: string): boolean {
    if (currentRole === "Super Admin" || currentRole === "SUPER_ADMIN") return true;
    if (currentRole === "Waste Management (COPED)" || currentRole === "WASTE_MANAGEMENT_COPED") {
        const allowedTargets = [
            "Operations Manager",
            "OPERATIONS_MANAGER",
            "IoT Supervisor",
            "IOT_SUPERVISOR",
            "Finance Admin",
            "FINANCE_ADMIN",
            "Support Agent",
            "SUPPORT_AGENT",
            "Customer",
            "CUSTOMER",
        ];
        return allowedTargets.includes(targetRole);
    }
    return false;
}

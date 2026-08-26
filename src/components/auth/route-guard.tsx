"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUserRole, hasRoutePermission, AdminRole } from "@/lib/permissions";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const isPublicRoute = (path: string | null | undefined) => {
    if (!path) return false;
    const clean = path.replace(/\/$/, "") || "/";
    return clean === "/login" || clean === "/delete-account" || clean === "/expired" || clean.startsWith("/login");
};

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const [userRole, setUserRole] = useState<AdminRole>("Admin");

    useEffect(() => {
        if (!pathname) {
            setAuthorized(true);
            return;
        }

        // Check if route is public
        if (isPublicRoute(pathname)) {
            setAuthorized(true);
            return;
        }

        // Check authentication token
        const token = typeof window !== "undefined" ? localStorage.getItem("smarteco_token") : null;
        if (!token) {
            setAuthorized(false);
            router.push("/login");
            return;
        }

        // Check role permission
        const role = getCurrentUserRole();
        setUserRole(role);

        // Admins have unrestricted access to everything
        if (role === "Admin" || role === "ADMIN" || role === "Super Admin" || role === "SUPER_ADMIN") {
            setAuthorized(true);
            return;
        }

        // Normalize base pathname (e.g. /users/create -> /users)
        const cleanPath = pathname.replace(/\/$/, "") || "/";
        const baseRoute = "/" + (cleanPath.split("/")[1] || "");
        const isAllowed = hasRoutePermission(role, cleanPath) || hasRoutePermission(role, baseRoute);

        if (isAllowed) {
            setAuthorized(true);
        } else {
            setAuthorized(false);
        }
    }, [pathname, router]);

    // Render public pages immediately
    if (pathname && isPublicRoute(pathname)) {
        return <>{children}</>;
    }

    // Checking authentication/authorization state
    if (authorized === null) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#F8FAFB]">
                <div className="w-10 h-10 border-4 border-primary-green border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Access Denied Screen if user is logged in but doesn't have permission for this route
    if (!authorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFB] p-6 font-sans">
                <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 shadow-xl p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
                        <p className="text-sm text-gray-500">
                            Your account with role <span className="font-semibold text-gray-800">"{userRole}"</span> does not have authorization to access this module according to the Role Permission Matrix.
                        </p>
                    </div>
                    <div className="pt-2 flex gap-3 justify-center">
                        <Button
                            onClick={() => router.push("/dashboard")}
                            className="bg-primary-green hover:bg-[#15803D] text-white font-bold text-xs px-6 py-2.5 rounded-[6px]"
                        >
                            Return to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

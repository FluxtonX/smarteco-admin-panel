"use client";

import { RolePermissionMatrix } from "@/services/admin.service";
import { Card } from "@/components/ui/card";

interface RolePermissionMatrixProps {
    matrix: RolePermissionMatrix[];
}

const ROLE_COLUMNS: { key: keyof Omit<RolePermissionMatrix, "module">; label: string }[] = [
    { key: "superAdmin", label: "SUPER ADMIN" },
    { key: "operations", label: "OPERATIONS" },
    { key: "finance", label: "FINANCE" },
    { key: "iot", label: "IOT" },
    { key: "support", label: "SUPPORT" },
];

function PermissionDot({ granted }: { granted: boolean }) {
    return (
        <div className="flex items-center justify-center">
            <div
                className={`w-5 h-5 rounded-full ${granted
                        ? "bg-primary-green shadow-sm shadow-green-200"
                        : "bg-gray-200"
                    }`}
            />
        </div>
    );
}

export function RolePermissionMatrixTable({ matrix }: RolePermissionMatrixProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-[18px] font-bold text-gray-800 tracking-tight">Role Permission Matrix</h3>
            <Card className="border-gray-200 shadow-sm rounded-[4px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/80">
                                <th className="px-6 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    MODULE
                                </th>
                                {ROLE_COLUMNS.map(({ key, label }) => (
                                    <th
                                        key={key}
                                        className="px-6 py-3.5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {matrix.map((row) => (
                                <tr key={row.module} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-[13px] font-semibold text-gray-700">
                                        {row.module}
                                    </td>
                                    {ROLE_COLUMNS.map(({ key }) => (
                                        <td key={key} className="px-6 py-4">
                                            <PermissionDot granted={row[key] as boolean} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

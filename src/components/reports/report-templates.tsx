"use client";

import { Card } from "@/components/ui/card";
import {
    FileText,
    BarChart3,
    Users,
    Truck,
    PieChart,
    Activity
} from "lucide-react";
import { ReportTemplate } from "@/services/report.service";
import { cn } from "@/lib/utils";

interface TemplateGridProps {
    templates: ReportTemplate[];
}

export function ReportTemplatesGrid({ templates }: TemplateGridProps) {
    const getIcon = (icon: string) => {
        const className = "w-6 h-6";
        switch (icon) {
            case 'operations': return <FileText className={className} />;
            case 'financial': return <BarChart3 className={className} />;
            case 'user': return <Users className={className} />;
            case 'collector': return <Truck className={className} />;
            case 'waste': return <PieChart className={className} />;
            case 'iot': return <Activity className={className} />;
            default: return <FileText className={className} />;
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-[15px] font-bold text-[#1A1A1A]">Report Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <Card key={template.id} className="p-8 border-gray-100 shadow-sm rounded-[8px] flex flex-col items-center text-center space-y-4 group hover:shadow-md transition-all">
                        <div className={cn("p-4 rounded-[12px] transition-transform group-hover:scale-110", template.color.split(' ')[1])}>
                            <div className={template.color.split(' ')[0]}>
                                {getIcon(template.icon)}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[15px] font-bold text-[#1A1A1A]">{template.title}</h4>
                            <p className="text-[12px] font-medium text-gray-400 px-4">{template.description}</p>
                        </div>
                        <button className="px-6 py-2 text-[11px] font-bold bg-[#DCFCE7] text-[#166534] border border-[#166534]/20 hover:bg-[#bbf7d0] rounded-[2px] uppercase tracking-widest transition-all mt-2 shadow-sm">
                            Generate Report
                        </button>
                    </Card>
                ))}
            </div>
        </div>
    );
}

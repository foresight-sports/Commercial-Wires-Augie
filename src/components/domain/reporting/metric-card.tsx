import type { FC, ReactNode } from "react";
import { TrendDown01, TrendUp01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";

interface MetricCardProps {
    title: string;
    value: string;
    subtitle?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon?: FC<{ className?: string }>;
    iconColor?: "success" | "warning" | "error" | "gray" | "brand";
}

const iconColorClasses: Record<string, string> = {
    success: "bg-success-50 text-success-600",
    warning: "bg-warning-50 text-warning-600",
    error: "bg-error-50 text-error-600",
    gray: "bg-gray-50 text-gray-600",
    brand: "bg-brand-50 text-brand-600",
};

/**
 * Card for displaying a single metric/KPI.
 * Used on the reporting dashboard for key performance indicators.
 */
export const MetricCard: FC<MetricCardProps> = ({ title, value, subtitle, trend, icon: Icon, iconColor = "brand" }) => {
    return (
        <div className="flex flex-col rounded-lg border border-secondary bg-primary p-6 shadow-xs">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-tertiary">{title}</p>
                {Icon && (
                    <div className={cx("flex size-10 items-center justify-center rounded-lg", iconColorClasses[iconColor])}>
                        <Icon className="size-5" />
                    </div>
                )}
            </div>

            <div className="mt-4">
                <p className="text-display-sm font-semibold text-primary">{value}</p>
                {(subtitle || trend) && (
                    <div className="mt-2 flex items-center gap-2">
                        {trend && (
                            <div className={cx("flex items-center gap-1", trend.isPositive ? "text-success-600" : "text-error-600")}>
                                {trend.isPositive ? <TrendUp01 className="size-4" /> : <TrendDown01 className="size-4" />}
                                <span className="text-sm font-medium">{Math.abs(trend.value)}%</span>
                            </div>
                        )}
                        {subtitle && <p className="text-sm text-tertiary">{subtitle}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

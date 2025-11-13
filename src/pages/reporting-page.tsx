import type { FC } from "react";
import { BarChart01, Calendar, CurrencyDollar, TrendUp01 } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Button } from "@/components/base/buttons/button";
import { MetricCard } from "@/components/domain/reporting/metric-card";
import { useGetRevenueMetrics } from "@/graphql/queries/reporting.queries";
import { t } from "@/i18n/translations";
import { formatMoney, formatPercentage } from "@/utils/formatters";

/**
 * Reporting page - Business analytics and insights.
 * Displays key metrics, revenue trends, and utilization data.
 */
export const ReportingPage: FC = () => {
    // For now, use last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const { data: metrics, loading, error, refetch } = useGetRevenueMetrics("loc-001", startDate, endDate);

    return (
        <div className="flex h-full flex-col">
            {/* Page Header */}
            <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-display-xs font-semibold text-primary">{t("reporting.page.title")}</h1>
                        <p className="mt-1 text-md text-tertiary">{t("reporting.page.subtitle")}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                {loading && !metrics && (
                    <div className="flex h-full items-center justify-center">
                        <LoadingIndicator size="lg" />
                    </div>
                )}

                {error && (
                    <EmptyState
                        title={t("common.status.error")}
                        description={error.message}
                        action={
                            <Button color="primary" onClick={refetch}>
                                {t("common.status.tryAgain")}
                            </Button>
                        }
                    />
                )}

                {metrics && (
                    <div>
                        {/* Metrics Overview */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-primary">{t("reporting.overview.title")}</h2>
                            <p className="mt-1 text-sm text-tertiary">Last 7 days</p>

                            {/* Metrics Grid */}
                            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <MetricCard
                                    title={t("reporting.overview.metrics.revenue.title")}
                                    value={formatMoney(metrics.totalRevenue)}
                                    trend={{ value: 12.5, isPositive: true }}
                                    subtitle={t("reporting.overview.metrics.revenue.subtitle", { percentage: "+12.5" })}
                                    icon={CurrencyDollar}
                                    iconColor="success"
                                />
                                <MetricCard
                                    title={t("reporting.overview.metrics.bookings.title")}
                                    value={metrics.bookingCount.toString()}
                                    subtitle={t("reporting.overview.metrics.bookings.subtitle", { count: metrics.bookingCount })}
                                    icon={Calendar}
                                    iconColor="brand"
                                />
                                <MetricCard
                                    title={t("reporting.overview.metrics.utilization.title")}
                                    value={formatPercentage(metrics.bayUtilization)}
                                    subtitle={t("reporting.overview.metrics.utilization.subtitle")}
                                    icon={TrendUp01}
                                    iconColor="warning"
                                />
                                <MetricCard
                                    title={t("reporting.overview.metrics.avgBookingValue.title")}
                                    value={formatMoney(metrics.averageBookingValue)}
                                    subtitle={t("reporting.overview.metrics.avgBookingValue.subtitle")}
                                    icon={BarChart01}
                                    iconColor="gray"
                                />
                            </div>
                        </div>

                        {/* Revenue by Bay */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-primary">Revenue by Bay</h2>
                            <p className="mt-1 text-sm text-tertiary">Performance breakdown across all bays</p>

                            <div className="mt-4 overflow-hidden rounded-lg border border-secondary bg-primary shadow-xs">
                                <table className="w-full">
                                    <thead className="border-b border-secondary bg-secondary">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">Bay</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">Revenue</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">Bookings</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">Utilization</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-secondary">
                                        {metrics.revenueByBay.map((bay) => (
                                            <tr key={bay.bayId} className="hover:bg-secondary">
                                                <td className="px-6 py-4 text-sm font-medium text-primary">{bay.bayName}</td>
                                                <td className="px-6 py-4 text-sm text-secondary">{formatMoney(bay.amount)}</td>
                                                <td className="px-6 py-4 text-sm text-secondary">{bay.bookingCount}</td>
                                                <td className="px-6 py-4 text-sm text-secondary">{formatPercentage(bay.utilizationRate)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

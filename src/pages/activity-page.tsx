import type { FC } from "react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { RefreshCcw01, Search01 } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { useGetActivityLogs } from "@/graphql/queries/activity-log.queries";
import { useGetLocations } from "@/graphql/queries/locations.queries";
import type { ActivityType } from "@/graphql/types/activity-log.types";
import { t } from "@/i18n/translations";
import { formatDateTime, formatMoney, formatRelativeTime } from "@/utils/formatters";

const activityTypeConfig: Record<ActivityType, { label: string; color: "success" | "brand" | "warning" | "gray" }> = {
    BOOKING_CREATED: { label: "Booking", color: "brand" },
    BOOKING_CHECKED_IN: { label: "Check-in", color: "success" },
    BOOKING_COMPLETED: { label: "Check-out", color: "gray" },
    BOOKING_CANCELLED: { label: "Cancelled", color: "warning" },
};

/**
 * Activity page - Recent bookings and customer activity.
 * Shows a table of all recent activities like bookings, check-ins, and cancellations.
 */
export const ActivityPage: FC = () => {
    const navigate = useNavigate();
    const { data: activities, loading, error, refetch } = useGetActivityLogs("loc-001", 50);
    const { data: locations } = useGetLocations();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<ActivityType | "all">("all");
    const [selectedLocation, setSelectedLocation] = useState<string>("all");

    // Filter activities based on search, type, and location
    const filteredActivities = useMemo(() => {
        if (!activities) return [];

        return activities.filter((activity) => {
            // Search filter - search in customer name and email
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const customerName = `${activity.customer?.firstName || ""} ${activity.customer?.lastName || ""}`.toLowerCase();
                const customerEmail = activity.customer?.email?.toLowerCase() || "";
                if (!customerName.includes(searchLower) && !customerEmail.includes(searchLower)) {
                    return false;
                }
            }

            // Type filter
            if (selectedType !== "all" && activity.type !== selectedType) {
                return false;
            }

            // Location filter
            if (selectedLocation !== "all" && activity.booking.bay?.locationId !== selectedLocation) {
                return false;
            }

            return true;
        });
    }, [activities, searchQuery, selectedType, selectedLocation]);

    // Get unique activity types for filter dropdown
    const activityTypeOptions = useMemo(() => {
        return [
            { id: "all", label: "All Types" },
            ...Object.entries(activityTypeConfig).map(([type, config]) => ({
                id: type,
                label: config.label,
            })),
        ];
    }, []);

    // Get location options for filter dropdown
    const locationOptions = useMemo(() => {
        return [
            { id: "all", label: "All Locations" },
            ...(locations || []).map((location) => ({
                id: location.id,
                label: location.name,
            })),
        ];
    }, [locations]);

    return (
        <div className="flex h-full flex-col">
            {/* Page Header */}
            <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-display-xs font-semibold text-primary">{t("activity.page.title")}</h1>
                        <p className="mt-1 text-md text-tertiary">{t("activity.page.subtitle")}</p>
                    </div>
                    <Button color="secondary" size="md" iconLeading={RefreshCcw01} onClick={refetch} disabled={loading}>
                        {t("common.actions.refresh")}
                    </Button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="border-b border-secondary bg-primary px-4 py-4 md:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="flex-1">
                        <Input
                            placeholder="Search by customer name or email..."
                            icon={Search01}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            placeholder="Filter by Type"
                            selectedKey={selectedType}
                            onSelectionChange={(key) => setSelectedType(key as ActivityType | "all")}
                            items={activityTypeOptions}
                        >
                            {(item) => <Select.Item id={item.id} label={item.label} />}
                        </Select>
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            placeholder="Filter by Location"
                            selectedKey={selectedLocation}
                            onSelectionChange={(key) => setSelectedLocation(key as string)}
                            items={locationOptions}
                        >
                            {(item) => <Select.Item id={item.id} label={item.label} />}
                        </Select>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                {loading && !activities && (
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

                {filteredActivities && filteredActivities.length === 0 && (
                    <EmptyState
                        title={searchQuery || selectedType !== "all" || selectedLocation !== "all" ? "No matching activities" : t("activity.table.empty.title")}
                        description={
                            searchQuery || selectedType !== "all" || selectedLocation !== "all"
                                ? "Try adjusting your search or filters"
                                : t("activity.table.empty.description")
                        }
                    />
                )}

                {filteredActivities && filteredActivities.length > 0 && (
                    <div className="overflow-hidden rounded-lg border border-secondary bg-primary shadow-xs">
                        <table className="w-full">
                            <thead className="border-b border-secondary bg-secondary">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("activity.table.columns.timestamp")}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("activity.table.columns.type")}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("activity.table.columns.customer")}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("activity.table.columns.bay")}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("activity.table.columns.status")}</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-tertiary">{t("activity.table.columns.amount")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary">
                                {filteredActivities.map((activity) => {
                                    const config = activityTypeConfig[activity.type];
                                    const locationName =
                                        locations?.find((loc) => loc.id === activity.booking.bay?.locationId)?.name ||
                                        activity.booking.bay?.locationId ||
                                        "—";
                                    const customerName = `${activity.customer?.firstName || ""} ${activity.customer?.lastName || ""}`.trim();

                                    return (
                                        <tr key={activity.id} className="hover:bg-secondary">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-primary">{formatRelativeTime(activity.timestamp)}</div>
                                                <div className="text-xs text-tertiary">{formatDateTime(activity.timestamp)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge color={config.color} size="sm" type="pill-color">
                                                    {config.label}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {activity.customer ? (
                                                    <button
                                                        onClick={() => navigate(`/customers/${activity.customer?.id}`)}
                                                        className="text-left hover:underline"
                                                    >
                                                        <div className="text-sm font-medium text-primary">{customerName}</div>
                                                        <div className="text-xs text-tertiary">{activity.customer?.email}</div>
                                                    </button>
                                                ) : (
                                                    <div>
                                                        <div className="text-sm font-medium text-primary">—</div>
                                                        <div className="text-xs text-tertiary">—</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-secondary">{locationName}</td>
                                            <td className="px-6 py-4 text-sm text-secondary">
                                                {activity.booking.bay?.name || `Bay ${activity.booking.bayId}`}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge color="gray" size="sm" type="pill-color">
                                                    {activity.booking.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium text-primary">
                                                {formatMoney(activity.booking.totalPrice)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

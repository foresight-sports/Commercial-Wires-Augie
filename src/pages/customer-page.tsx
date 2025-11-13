import type { FC } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar01, CheckCircle, CreditCard01, DollarSign, RefreshCcw01 } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { useGetCustomer, useGetCustomerActivity } from "@/graphql/queries/customer.queries";
import { useGetLocations } from "@/graphql/queries/locations.queries";
import type { ActivityType } from "@/graphql/types/activity-log.types";
import { t } from "@/i18n/translations";
import { formatDate, formatDateTime, formatMoney } from "@/utils/formatters";

const activityTypeConfig: Record<ActivityType, { label: string; color: "success" | "brand" | "warning" | "gray" }> = {
    BOOKING_CREATED: { label: "Booking Created", color: "brand" },
    BOOKING_CHECKED_IN: { label: "Check-in", color: "success" },
    BOOKING_COMPLETED: { label: "Booking Completed", color: "success" },
    BOOKING_CANCELLED: { label: "Cancelled", color: "warning" },
};

/**
 * Customer page - Detailed view of a customer's profile and activity history.
 * Shows customer information, summary statistics, and activity history.
 */
export const CustomerPage: FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();
    const { data: customer, loading: customerLoading, error: customerError } = useGetCustomer(customerId || "");
    const { data: activities, loading: activitiesLoading, error: activitiesError, refetch } = useGetCustomerActivity(customerId || "");
    const { data: locations } = useGetLocations();

    if (customerLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <LoadingIndicator size="lg" />
            </div>
        );
    }

    if (customerError || !customer) {
        return (
            <div className="flex h-full items-center justify-center">
                <EmptyState
                    title="Customer not found"
                    description={customerError?.message || "The customer you're looking for doesn't exist."}
                    action={
                        <Button color="primary" onClick={() => navigate("/activity")}>
                            Back to Activity
                        </Button>
                    }
                />
            </div>
        );
    }

    // Calculate total bookings from activities
    const totalBookings = activities?.length || 0;
    const totalSpent = customer.totalSpent;
    const memberSince = customer.createdAt;

    return (
        <div className="flex h-full flex-col">
            {/* Page Header */}
            <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                <div className="flex items-center gap-4">
                    <Button
                        color="secondary"
                        size="md"
                        iconLeading={ArrowLeft}
                        onClick={() => navigate("/activity")}
                        aria-label="Go back"
                    />
                    <div className="flex-1">
                        <h1 className="text-display-xs font-semibold text-primary">
                            {customer.firstName} {customer.lastName}
                        </h1>
                        <p className="mt-1 text-md text-tertiary">{customer.email}</p>
                    </div>
                    <Button color="secondary" size="md" iconLeading={RefreshCcw01} onClick={refetch} disabled={activitiesLoading}>
                        {t("common.actions.refresh")}
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Total Bookings */}
                    <div className="rounded-lg border border-secondary bg-primary p-6 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-subtle">
                                <Calendar01 className="size-5 text-brand" />
                            </div>
                            <div>
                                <p className="text-sm text-tertiary">Total Bookings</p>
                                <p className="text-2xl font-semibold text-primary">{totalBookings}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Spend */}
                    <div className="rounded-lg border border-secondary bg-primary p-6 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-subtle">
                                <DollarSign className="size-5 text-success" />
                            </div>
                            <div>
                                <p className="text-sm text-tertiary">Total Spend</p>
                                <p className="text-2xl font-semibold text-primary">{formatMoney(totalSpent)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Membership */}
                    <div className="rounded-lg border border-secondary bg-primary p-6 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-subtle">
                                <CreditCard01 className="size-5 text-brand" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-tertiary">Membership</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <p className="text-lg font-semibold text-primary">Premium</p>
                                    <Badge color="success" size="sm" type="pill-color">
                                        Active
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold text-primary">Customer Details</h2>
                    <div className="rounded-lg border border-secondary bg-primary p-6 shadow-xs">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {customer.phone && (
                                <div>
                                    <p className="text-sm text-tertiary">Phone</p>
                                    <p className="mt-1 text-md font-medium text-primary">{customer.phone}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-tertiary">Member Since</p>
                                <p className="mt-1 text-md font-medium text-primary">{formatDate(memberSince)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity History */}
                <div>
                    <h2 className="mb-2 text-lg font-semibold text-primary">Activity History</h2>
                    <p className="mb-4 text-sm text-tertiary">Most recent activities listed first</p>

                    {activitiesLoading && !activities && (
                        <div className="flex items-center justify-center py-12">
                            <LoadingIndicator size="md" />
                        </div>
                    )}

                    {activitiesError && (
                        <EmptyState
                            title={t("common.status.error")}
                            description={activitiesError.message}
                            action={
                                <Button color="primary" onClick={refetch}>
                                    {t("common.status.tryAgain")}
                                </Button>
                            }
                        />
                    )}

                    {activities && activities.length === 0 && (
                        <EmptyState title="No activity found" description="This customer has no activity history yet." />
                    )}

                    {activities && activities.length > 0 && (
                        <div className="overflow-hidden rounded-lg border border-secondary bg-primary shadow-xs">
                            <table className="w-full">
                                <thead className="border-b border-secondary bg-secondary">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">Benefits Used</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">Timestamp</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-tertiary">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary">
                                    {activities.map((activity) => {
                                        const config = activityTypeConfig[activity.type];
                                        const bayName = activity.booking.bay?.name || `Bay ${activity.booking.bayId}`;
                                        const locationName =
                                            locations?.find((loc) => loc.id === activity.booking.bay?.locationId)?.name || "Location";
                                        const durationMinutes = Math.floor(
                                            (new Date(activity.booking.endTime).getTime() - new Date(activity.booking.startTime).getTime()) / 60000,
                                        );
                                        const hours = Math.floor(durationMinutes / 60);
                                        const minutes = durationMinutes % 60;
                                        const durationText = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}${minutes > 0 ? `, ${minutes} min` : ""}` : `${minutes} min`;

                                        const details =
                                            activity.type === "BOOKING_CREATED" || activity.type === "BOOKING_COMPLETED"
                                                ? `${bayName}, ${durationText}`
                                                : activity.type === "BOOKING_CHECKED_IN"
                                                  ? "Checked in"
                                                  : activity.type === "BOOKING_CANCELLED"
                                                    ? "Cancelled"
                                                    : formatMoney(activity.booking.totalPrice);

                                        // Determine if benefits were used (simplified logic - in production this would come from the booking data)
                                        // For now, randomly assign based on activity type
                                        const benefitsUsed = activity.type === "BOOKING_CREATED" && Math.random() > 0.7;

                                        return (
                                            <tr key={activity.id} className="hover:bg-secondary">
                                                <td className="px-6 py-4">
                                                    <Badge color={config.color} size="sm" type="pill-color">
                                                        {config.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-secondary">{locationName}</td>
                                                <td className="px-6 py-4 text-sm text-secondary">{details}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-primary">
                                                    {formatMoney(activity.booking.totalPrice)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {benefitsUsed ? (
                                                        <CheckCircle className="size-5 text-brand" />
                                                    ) : (
                                                        <span className="text-tertiary">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-secondary">{formatDateTime(activity.timestamp)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        color="secondary"
                                                        size="sm"
                                                        iconLeading={RefreshCcw01}
                                                        onClick={() => {
                                                            // Handle refund action
                                                            console.log("Refund for activity:", activity.id);
                                                        }}
                                                    >
                                                        Refund
                                                    </Button>
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
        </div>
    );
};


import type { FC } from "react";
import { AlertTriangle, CheckCircle, Clock, Tool01, User01, XCircle } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import type { Bay, BayStatus } from "@/graphql/types/activity.types";
import { t } from "@/i18n/translations";
import { cx } from "@/utils/cx";
import { calculateDuration, formatTime } from "@/utils/formatters";

interface BayStatusCardProps {
    bay: Bay;
}

const statusConfig: Record<BayStatus, { color: "success" | "brand" | "warning" | "gray"; icon: FC<{ className?: string }> }> = {
    AVAILABLE: { color: "success", icon: CheckCircle },
    IN_USE: { color: "brand", icon: Clock },
    MAINTENANCE: { color: "warning", icon: Tool01 },
    OFFLINE: { color: "gray", icon: XCircle },
};

/**
 * Card displaying the current status of a bay.
 * Shows booking information, device status, and quick actions.
 */
export const BayStatusCard: FC<BayStatusCardProps> = ({ bay }) => {
    const config = statusConfig[bay.status];
    const StatusIcon = config.icon;

    const hasDeviceIssues = bay.devices.some((d) => d.status === "ERROR" || d.status === "WARNING");

    return (
        <div
            className={cx(
                "flex flex-col rounded-lg border bg-primary p-5 shadow-xs transition-shadow hover:shadow-sm",
                bay.status === "MAINTENANCE" ? "border-warning-300" : "border-secondary",
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-md font-semibold text-primary">{bay.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                        <Badge color={config.color} size="sm" type="pill-color">
                            <StatusIcon className="size-3" />
                            {t(`activity.bayStatus.statuses.${bay.status.toLowerCase()}`)}
                        </Badge>
                        {hasDeviceIssues && (
                            <Badge color="warning" size="sm" type="pill-color">
                                <AlertTriangle className="size-3" />
                                Device Issue
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Current Booking */}
            {bay.currentBooking && (
                <div className="mt-4 rounded-md bg-secondary p-3">
                    <p className="text-xs font-medium text-tertiary">{t("activity.bayStatus.bayCard.currentBooking")}</p>
                    <div className="mt-1 flex items-center gap-2">
                        <User01 className="size-4 text-quaternary" />
                        <p className="text-sm font-medium text-secondary">
                            {bay.currentBooking.customer?.firstName} {bay.currentBooking.customer?.lastName}
                        </p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                        <Clock className="size-4 text-quaternary" />
                        <p className="text-sm text-tertiary">
                            {formatTime(bay.currentBooking.startTime)} - {formatTime(bay.currentBooking.endTime)}
                        </p>
                    </div>
                </div>
            )}

            {/* Next Booking */}
            {!bay.currentBooking && bay.nextBooking && (
                <div className="mt-4 rounded-md border border-secondary p-3">
                    <p className="text-xs font-medium text-tertiary">{t("activity.bayStatus.bayCard.nextBooking")}</p>
                    <div className="mt-1 flex items-center gap-2">
                        <User01 className="size-4 text-quaternary" />
                        <p className="text-sm font-medium text-secondary">
                            {bay.nextBooking.customer?.firstName} {bay.nextBooking.customer?.lastName}
                        </p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                        <Clock className="size-4 text-quaternary" />
                        <p className="text-sm text-tertiary">
                            {formatTime(bay.nextBooking.startTime)} ({calculateDuration(new Date(), bay.nextBooking.startTime)} min)
                        </p>
                    </div>
                </div>
            )}

            {/* Maintenance Note */}
            {bay.maintenanceNotes && (
                <div className="mt-4 rounded-md border border-warning-300 bg-warning-25 p-3">
                    <p className="text-xs font-medium text-warning-700">{t("activity.bayStatus.bayCard.maintenanceNote")}</p>
                    <p className="mt-1 text-sm text-warning-600">{bay.maintenanceNotes}</p>
                </div>
            )}

            {/* No Bookings */}
            {!bay.currentBooking && !bay.nextBooking && bay.status === "AVAILABLE" && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-tertiary">{t("activity.bayStatus.bayCard.noBookings")}</p>
                </div>
            )}

            {/* Device Count */}
            <div className="mt-4 border-t border-secondary pt-3">
                <p className="text-xs text-tertiary">
                    {bay.devices.length} {bay.devices.length === 1 ? "device" : "devices"}
                </p>
            </div>
        </div>
    );
};

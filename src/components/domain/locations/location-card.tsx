import type { FC } from "react";
import { ChevronRight, CpuChip01, Home05 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import type { Location } from "@/graphql/types/common.types";
import { t } from "@/i18n/translations";

interface LocationCardProps {
    location: Location;
}

/**
 * Card displaying a location summary.
 * Shows key information like address, bay count, and device count.
 */
export const LocationCard: FC<LocationCardProps> = ({ location }) => {
    return (
        <div className="flex flex-col rounded-lg border border-secondary bg-primary p-6 shadow-xs transition-shadow hover:shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary">{location.name}</h3>
                    <p className="mt-1 text-sm text-tertiary">
                        {location.address.city}, {location.address.state}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50">
                        <Home05 className="size-5 text-brand-600" />
                    </div>
                    <div>
                        <p className="text-xs text-tertiary">{t("locations.locationCard.bays", { count: location.bayCount })}</p>
                        <p className="text-lg font-semibold text-primary">{location.bayCount}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-gray-50">
                        <CpuChip01 className="size-5 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-xs text-tertiary">{t("locations.locationCard.devices", { count: location.activeDeviceCount })}</p>
                        <p className="text-lg font-semibold text-primary">{location.activeDeviceCount}</p>
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="mt-4 rounded-md border border-secondary bg-secondary p-3">
                <p className="text-xs font-medium text-tertiary">Address</p>
                <p className="mt-1 text-sm text-secondary">{location.address.street}</p>
                <p className="text-sm text-secondary">
                    {location.address.city}, {location.address.state} {location.address.postalCode}
                </p>
            </div>

            {/* Contact */}
            {(location.contactEmail || location.contactPhone) && (
                <div className="mt-3 space-y-1">
                    {location.contactEmail && <p className="text-sm text-tertiary">{location.contactEmail}</p>}
                    {location.contactPhone && <p className="text-sm text-tertiary">{location.contactPhone}</p>}
                </div>
            )}

            {/* Action */}
            <div className="mt-4 border-t border-secondary pt-4">
                <Button color="link-color" size="sm" iconTrailing={ChevronRight} className="w-full justify-between">
                    {t("locations.locationCard.viewDetails")}
                </Button>
            </div>
        </div>
    );
};

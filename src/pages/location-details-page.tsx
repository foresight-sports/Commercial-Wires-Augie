import type { FC } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "@untitledui/icons";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button } from "@/components/base/buttons/button";
import { Tabs } from "@/components/application/tabs/tabs";
import { useGetLocationDetails } from "@/graphql/queries/locations.queries";
import { t } from "@/i18n/translations";
import { LocationBayManagementTab } from "@/components/domain/locations/location-bay-management-tab";
import { LocationStaffTab } from "@/components/domain/locations/location-staff-tab";
import { LocationMembershipTab } from "@/components/domain/locations/location-membership-tab";
import { LocationServicesTab } from "@/components/domain/locations/location-services-tab";

/**
 * Location Details page - View detailed information about a specific location.
 * Shows Bay Management, Staff, Membership, and Services subsections.
 */
export const LocationDetailsPage: FC = () => {
    const { locationId } = useParams<{ locationId: string }>();
    const navigate = useNavigate();
    const { data: location, loading, error } = useGetLocationDetails(locationId || "");

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <LoadingIndicator size="lg" />
            </div>
        );
    }

    if (error || !location) {
        return (
            <div className="flex h-full items-center justify-center">
                <EmptyState
                    title={t("locations.details.error.title")}
                    description={error?.message || t("locations.details.error.description")}
                    action={
                        <Button color="primary" onPress={() => navigate("/locations")}>
                            {t("locations.details.error.backToLocations")}
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Page Header */}
            <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                <div className="flex items-center gap-4">
                    <Button
                        color="tertiary"
                        size="sm"
                        iconLeading={ArrowLeft}
                        onPress={() => navigate("/locations")}
                        className="shrink-0"
                    >
                        {t("locations.details.back")}
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-display-xs font-semibold text-primary">{location.name}</h1>
                        <p className="mt-1 text-md text-tertiary">
                            {location.address.city}, {location.address.state}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content with Tabs */}
            <div className="flex-1 overflow-auto">
                <Tabs defaultSelectedKey="bay-management" className="h-full">
                    <Tabs.List
                        items={[
                            { id: "bay-management", label: t("locations.details.tabs.bayManagement") },
                            { id: "staff", label: t("locations.details.tabs.staff") },
                            { id: "membership", label: t("locations.details.tabs.membership") },
                            { id: "services", label: t("locations.details.tabs.services") },
                        ]}
                        size="md"
                        type="underline"
                        fullWidth
                        className="border-b border-secondary px-4 md:px-8"
                    >
                        {(item) => <Tabs.Item id={item.id}>{item.label}</Tabs.Item>}
                    </Tabs.List>

                    <div className="px-4 py-6 md:px-8">
                        <Tabs.Panel id="bay-management">
                            <LocationBayManagementTab locationId={locationId || ""} />
                        </Tabs.Panel>
                        <Tabs.Panel id="staff">
                            <LocationStaffTab locationId={locationId || ""} />
                        </Tabs.Panel>
                        <Tabs.Panel id="membership">
                            <LocationMembershipTab locationId={locationId || ""} />
                        </Tabs.Panel>
                        <Tabs.Panel id="services">
                            <LocationServicesTab locationId={locationId || ""} />
                        </Tabs.Panel>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};


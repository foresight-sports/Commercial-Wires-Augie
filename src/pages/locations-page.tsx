import type { FC } from "react";
import { Plus } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Button } from "@/components/base/buttons/button";
import { LocationCard } from "@/components/domain/locations/location-card";
import { useGetLocations } from "@/graphql/queries/locations.queries";
import { t } from "@/i18n/translations";

/**
 * Locations page - Manage facilities, bays, and equipment.
 * Lists all locations and provides access to configuration.
 */
export const LocationsPage: FC = () => {
    const { data: locations, loading, error, refetch } = useGetLocations();

    return (
        <div className="flex h-full flex-col">
            {/* Page Header */}
            <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-display-xs font-semibold text-primary">{t("locations.page.title")}</h1>
                        <p className="mt-1 text-md text-tertiary">{t("locations.page.subtitle")}</p>
                    </div>
                    <Button color="primary" size="md" iconLeading={Plus}>
                        {t("locations.locationList.addLocation")}
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                {loading && !locations && (
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

                {locations && locations.length === 0 && (
                    <EmptyState
                        title={t("locations.locationList.empty.title")}
                        description={t("locations.locationList.empty.description")}
                        action={
                            <Button color="primary" iconLeading={Plus}>
                                {t("locations.locationList.empty.action")}
                            </Button>
                        }
                    />
                )}

                {locations && locations.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-primary">{t("locations.locationList.title")}</h2>
                        <p className="mt-1 text-sm text-tertiary">
                            {locations.length} {locations.length === 1 ? "location" : "locations"}
                        </p>

                        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {locations.map((location) => (
                                <LocationCard key={location.id} location={location} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

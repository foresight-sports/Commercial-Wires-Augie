import type { FC } from "react";
import { useState } from "react";
import { Plus } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Button } from "@/components/base/buttons/button";
import { LocationCard } from "@/components/domain/locations/location-card";
import { AddLocationModal, type LocationFormData } from "@/components/domain/locations/add-location-modal";
import { useGetLocations } from "@/graphql/queries/locations.queries";
import { t } from "@/i18n/translations";

/**
 * Settings > Locations page
 * Manage facility locations and their configurations.
 */
export const SettingsLocationsPage: FC = () => {
    const { data: locations, loading, error, refetch } = useGetLocations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<{ id: string; name: string; address: any; contactPhone?: string; contactEmail?: string; timezone: string } | null>(null);

    const handleAddLocation = (locationData: LocationFormData) => {
        // TODO: Implement mutation to add location
        console.log("Adding location:", locationData);
        refetch();
    };

    const handleUpdateLocation = (locationId: string, locationData: LocationFormData) => {
        // TODO: Implement mutation to update location
        console.log("Updating location:", locationId, locationData);
        refetch();
    };

    const handleEditLocation = (location: { id: string; name: string; address: any; contactPhone?: string; contactEmail?: string; timezone: string }) => {
        setEditingLocation(location);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLocation(null);
    };

    return (
        <>
            <div className="flex h-full flex-col">
                <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-display-xs font-semibold text-primary">{t("settings.locations.title")}</h1>
                            <p className="mt-1 text-md text-tertiary">{t("settings.locations.subtitle")}</p>
                        </div>
                        <Button color="primary" size="md" iconLeading={Plus} onPress={() => setIsModalOpen(true)}>
                            {t("settings.locations.addLocation")}
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                    {loading && !locations && (
                        <div className="flex h-full items-center justify-center">
                            <LoadingIndicator size="lg" />
                        </div>
                    )}

                    {error && (
                        <EmptyState>
                            <EmptyState.Content>
                                <EmptyState.Title>{t("common.status.error")}</EmptyState.Title>
                                <EmptyState.Description>{error.message}</EmptyState.Description>
                            </EmptyState.Content>
                            <EmptyState.Footer>
                                <Button color="primary" onPress={refetch}>
                                    {t("common.status.tryAgain")}
                                </Button>
                            </EmptyState.Footer>
                        </EmptyState>
                    )}

                    {locations && locations.length === 0 && (
                        <EmptyState>
                            <EmptyState.Content>
                                <EmptyState.Title>{t("settings.locations.empty.title")}</EmptyState.Title>
                                <EmptyState.Description>{t("settings.locations.empty.description")}</EmptyState.Description>
                            </EmptyState.Content>
                            <EmptyState.Footer>
                                <Button color="primary" iconLeading={Plus} onPress={() => setIsModalOpen(true)}>
                                    {t("settings.locations.empty.action")}
                                </Button>
                            </EmptyState.Footer>
                        </EmptyState>
                    )}

                    {locations && locations.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-primary">{t("settings.locations.listTitle")}</h2>
                            <p className="mt-1 text-sm text-tertiary">
                                {locations.length} {locations.length === 1 ? "location" : "locations"}
                            </p>

                            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {locations.map((location) => (
                                    <div key={location.id} onClick={() => handleEditLocation(location)} className="cursor-pointer">
                                        <LocationCard location={location} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddLocationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAdd={handleAddLocation}
                onUpdate={handleUpdateLocation}
                location={editingLocation || undefined}
            />
        </>
    );
};


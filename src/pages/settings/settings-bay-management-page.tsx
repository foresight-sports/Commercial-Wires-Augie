import type { FC } from "react";
import { useState } from "react";
import { Plus } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Button } from "@/components/base/buttons/button";
import { AddBayModal, type BayFormData } from "@/components/domain/bays/add-bay-modal";
import { BayLocationGroup } from "@/components/domain/bays/bay-location-group";
import { useGetBaysByLocation } from "@/graphql/queries/bays.queries";
import { useGetLocations } from "@/graphql/queries/locations.queries";
import type { Bay } from "@/graphql/types/activity.types";
import { t } from "@/i18n/translations";

/**
 * Settings > Bay Management page
 * Configure simulator bays, devices, and equipment.
 */
export const SettingsBayManagementPage: FC = () => {
    const { data: baysByLocation, loading, error, refetch } = useGetBaysByLocation();
    const { data: locations } = useGetLocations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBay, setEditingBay] = useState<Bay | null>(null);

    const handleAddBay = (bayData: BayFormData) => {
        // TODO: Implement mutation to add bay
        console.log("Adding bay:", bayData);
        refetch();
    };

    const handleUpdateBay = (bayId: string, bayData: BayFormData) => {
        // TODO: Implement mutation to update bay
        console.log("Updating bay:", bayId, bayData);
        refetch();
    };

    const handleEditBay = (bay: Bay) => {
        setEditingBay(bay);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBay(null);
    };

    const allBays = baysByLocation ? Object.values(baysByLocation).flat() : [];
    const hasBays = allBays.length > 0;

    return (
        <>
            <div className="flex h-full flex-col">
                <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-display-xs font-semibold text-primary">{t("settings.bayManagement.title")}</h1>
                            <p className="mt-1 text-md text-tertiary">{t("settings.bayManagement.subtitle")}</p>
                        </div>
                        <Button color="primary" size="md" iconLeading={Plus} onPress={() => setIsModalOpen(true)}>
                            {t("settings.bayManagement.addBay")}
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                    {loading && !baysByLocation && (
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

                    {!loading && !hasBays && (
                        <EmptyState>
                            <EmptyState.Content>
                                <EmptyState.Title>{t("settings.bayManagement.empty.title")}</EmptyState.Title>
                                <EmptyState.Description>{t("settings.bayManagement.empty.description")}</EmptyState.Description>
                            </EmptyState.Content>
                            <EmptyState.Footer>
                                <Button color="primary" iconLeading={Plus} onPress={() => setIsModalOpen(true)}>
                                    {t("settings.bayManagement.empty.action")}
                                </Button>
                            </EmptyState.Footer>
                        </EmptyState>
                    )}

                    {hasBays && locations && (
                        <div className="space-y-6">
                            {Object.entries(baysByLocation || {}).map(([locationId, bays]) => {
                                const location = locations.find((loc) => loc.id === locationId);
                                if (!location) return null;

                                return <BayLocationGroup key={locationId} location={location} bays={bays} onEditBay={handleEditBay} />;
                            })}
                        </div>
                    )}
                </div>
            </div>

            <AddBayModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAdd={handleAddBay}
                onUpdate={handleUpdateBay}
                bay={
                    editingBay
                        ? {
                              id: editingBay.id,
                              name: editingBay.name,
                              locationId: editingBay.locationId,
                              simulatorType: editingBay.simulatorType,
                              simulatorTypeOther: editingBay.simulatorTypeOther,
                              maxPlayersPerReservation: editingBay.maxPlayersPerReservation,
                              notes: editingBay.notes,
                              isOperational: editingBay.isOperational,
                          }
                        : undefined
                }
            />
        </>
    );
};


import type { FC } from "react";
import { useState } from "react";
import { Edit03, Plus } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { AddMembershipModal, type MembershipFormData } from "@/components/domain/membership/add-membership-modal";
import { useGetMembershipTiers } from "@/graphql/queries/membership.queries";
import { useGetLocations } from "@/graphql/queries/locations.queries";
import type { MembershipTier } from "@/graphql/types/membership.types";
import { t } from "@/i18n/translations";

/**
 * Settings > Membership page
 * Configure membership plans, tiers, and benefits.
 */
export const SettingsMembershipPage: FC = () => {
    const { data: membershipTiers, loading, error, refetch } = useGetMembershipTiers();
    const { data: locations } = useGetLocations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMembership, setEditingMembership] = useState<MembershipTier | null>(null);

    const handleAddMembership = (membershipData: MembershipFormData) => {
        // TODO: Implement mutation to add membership tier
        console.log("Adding membership tier:", membershipData);
        refetch();
    };

    const handleUpdateMembership = (membershipId: string, membershipData: MembershipFormData) => {
        // TODO: Implement mutation to update membership tier
        console.log("Updating membership tier:", membershipId, membershipData);
        refetch();
    };

    const handleEditMembership = (membership: MembershipTier) => {
        setEditingMembership(membership);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMembership(null);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatLength = (months: number) => {
        if (months === 1) return "1 month";
        return `${months} months`;
    };

    const getLocationNames = (locationIds: string[]) => {
        if (!locations) return [];
        const allLocationIds = locations.map((loc) => loc.id);
        if (locationIds.length === allLocationIds.length) {
            return [t("settings.membership.table.allLocations")];
        }
        return locationIds.map((id) => locations.find((loc) => loc.id === id)?.name || id);
    };

    const getKeyBenefits = (membership: MembershipTier): string[] => {
        const benefits: string[] = [];
        if (membership.benefits.freeSimulatorTime?.enabled) {
            benefits.push(`${membership.benefits.freeSimulatorTime.hoursPerMonth}h free`);
        }
        if (membership.benefits.advanceBookingWindow?.enabled) {
            benefits.push(`${membership.benefits.advanceBookingWindow.daysInAdvance}d advance`);
        }
        if (membership.benefits.freeLessons?.enabled) {
            benefits.push(`${membership.benefits.freeLessons.numberOfLessons} lessons`);
        }
        if (membership.benefits.discountStructure?.enabled && membership.benefits.discountStructure.discountValue) {
            if (membership.benefits.discountStructure.discountType === "PERCENTAGE_DISCOUNT") {
                benefits.push(`${membership.benefits.discountStructure.discountValue}% off`);
            } else {
                benefits.push(`$${membership.benefits.discountStructure.discountValue} off`);
            }
        }
        return benefits;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "success";
            case "INACTIVE":
                return "gray";
            case "DRAFT":
                return "warning";
            default:
                return "gray";
        }
    };

    return (
        <>
            <div className="flex h-full flex-col">
                <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-display-xs font-semibold text-primary">{t("settings.membership.title")}</h1>
                            <p className="mt-1 text-md text-tertiary">{t("settings.membership.subtitle")}</p>
                        </div>
                        <Button color="primary" size="md" iconLeading={Plus} onPress={() => setIsModalOpen(true)}>
                            {t("settings.membership.addPlan")}
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                    {loading && !membershipTiers && (
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

                    {membershipTiers && membershipTiers.length === 0 && (
                        <EmptyState>
                            <EmptyState.Content>
                                <EmptyState.Title>{t("settings.membership.empty.title")}</EmptyState.Title>
                                <EmptyState.Description>{t("settings.membership.empty.description")}</EmptyState.Description>
                            </EmptyState.Content>
                            <EmptyState.Footer>
                                <Button color="primary" iconLeading={Plus} onPress={() => setIsModalOpen(true)}>
                                    {t("settings.membership.empty.action")}
                                </Button>
                            </EmptyState.Footer>
                        </EmptyState>
                    )}

                    {membershipTiers && membershipTiers.length > 0 && (
                        <div>
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-primary">{t("settings.membership.table.title")}</h2>
                                <p className="mt-1 text-sm text-tertiary">{t("settings.membership.table.subtitle")}</p>
                            </div>

                            <div className="overflow-hidden rounded-lg border border-secondary bg-primary shadow-xs">
                                <table className="w-full">
                                    <thead className="border-b border-secondary bg-secondary">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("settings.membership.table.columns.planName")}</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("settings.membership.table.columns.initiationFee")}</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("settings.membership.table.columns.price")}</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("settings.membership.table.columns.length")}</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("settings.membership.table.columns.availableLocations")}</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("settings.membership.table.columns.keyBenefits")}</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("settings.membership.table.columns.status")}</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-tertiary">{t("settings.membership.table.columns.actions")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-secondary">
                                        {membershipTiers.map((tier) => {
                                            const keyBenefits = getKeyBenefits(tier);
                                            const locationNames = getLocationNames(tier.availableLocationIds);
                                            return (
                                                <tr key={tier.id} className="hover:bg-secondary">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-primary">{tier.planName}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-secondary">{formatCurrency(tier.initiationFee)}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-secondary">{formatCurrency(tier.price)}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-secondary">{formatLength(tier.lengthMonths)}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {locationNames.map((name, idx) => (
                                                                <Badge key={idx} color="gray" size="sm" type="pill-color">
                                                                    {name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {keyBenefits.slice(0, 3).map((benefit, idx) => (
                                                                <Badge key={idx} color="gray" size="sm" type="pill-color">
                                                                    {benefit}
                                                                </Badge>
                                                            ))}
                                                            {keyBenefits.length > 3 && (
                                                                <Badge color="gray" size="sm" type="pill-color">
                                                                    +{keyBenefits.length - 3} more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge color={getStatusColor(tier.status)} size="sm" type="pill-color">
                                                            {tier.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <ButtonUtility
                                                                size="sm"
                                                                color="tertiary"
                                                                icon={Edit03}
                                                                aria-label={t("common.actions.edit")}
                                                                onClick={() => handleEditMembership(tier)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddMembershipModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAdd={handleAddMembership}
                onUpdate={handleUpdateMembership}
                membership={editingMembership || undefined}
            />
        </>
    );
};


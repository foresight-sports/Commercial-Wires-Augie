import type { FC } from "react";
import React, { useState, useEffect } from "react";
import { XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Form } from "@/components/base/form/form";
import { HintText } from "@/components/base/input/hint-text";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { Toggle } from "@/components/base/toggle/toggle";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { useGetLocations } from "@/graphql/queries/locations.queries";
import { useGetMembershipTiers } from "@/graphql/queries/membership.queries";
import type {
    MembershipTier,
    MembershipBenefits,
    DiscountType,
    PeakAccessType,
    MembershipStatus,
} from "@/graphql/types/membership.types";
import { t } from "@/i18n/translations";

interface AddMembershipModalProps {
    /** Whether the modal is open */
    isOpen?: boolean;
    /** Callback when modal should close */
    onClose?: () => void;
    /** Callback when membership tier is added */
    onAdd?: (membershipData: MembershipFormData) => void;
    /** Callback when membership tier is updated */
    onUpdate?: (membershipId: string, membershipData: MembershipFormData) => void;
    /** Existing membership tier data for edit mode */
    membership?: MembershipTier;
}

export interface MembershipFormData {
    planName: string;
    initiationFee: number;
    price: number;
    lengthMonths: number;
    status: MembershipStatus;
    availableLocationIds: string[];
    benefits: MembershipBenefits;
}

/**
 * Modal for adding or editing a membership tier.
 * Follows UntitledUI design principles and form patterns.
 */
export const AddMembershipModal: FC<AddMembershipModalProps> = ({ isOpen, onClose, onAdd, onUpdate, membership }) => {
    const { data: locations } = useGetLocations();
    const { data: existingTiers } = useGetMembershipTiers();
    const isEditMode = !!membership;

    const [templateId, setTemplateId] = useState<string | null>(null);
    const [formData, setFormData] = useState<MembershipFormData>(() => {
        if (membership) {
            return {
                planName: membership.planName,
                initiationFee: membership.initiationFee,
                price: membership.price,
                lengthMonths: membership.lengthMonths,
                status: membership.status,
                availableLocationIds: [...membership.availableLocationIds],
                benefits: JSON.parse(JSON.stringify(membership.benefits)), // Deep copy
            };
        }
        return getDefaultFormData();
    });

    function getDefaultFormData(): MembershipFormData {
        return {
            planName: "",
            initiationFee: 0,
            price: 0,
            lengthMonths: 1,
            status: "ACTIVE",
            availableLocationIds: [],
            benefits: {},
        };
    }

    // Handle template selection
    useEffect(() => {
        if (templateId && templateId !== "scratch" && existingTiers) {
            const template = existingTiers.find((tier) => tier.id === templateId);
            if (template) {
                setFormData({
                    planName: "",
                    initiationFee: template.initiationFee,
                    price: template.price,
                    lengthMonths: template.lengthMonths,
                    status: "ACTIVE",
                    availableLocationIds: [...template.availableLocationIds],
                    benefits: JSON.parse(JSON.stringify(template.benefits)), // Deep copy
                });
            }
        } else if (templateId === "scratch") {
            setFormData(getDefaultFormData());
        }
    }, [templateId, existingTiers]);

    // Update form when membership changes (for edit mode)
    useEffect(() => {
        if (membership && isOpen) {
            setFormData({
                planName: membership.planName,
                initiationFee: membership.initiationFee,
                price: membership.price,
                lengthMonths: membership.lengthMonths,
                status: membership.status,
                availableLocationIds: [...membership.availableLocationIds],
                benefits: JSON.parse(JSON.stringify(membership.benefits)), // Deep copy
            });
            setTemplateId(null);
        } else if (!membership && isOpen) {
            setFormData(getDefaultFormData());
            setTemplateId("scratch");
        }
    }, [membership, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && membership) {
            onUpdate?.(membership.id, formData);
        } else {
            onAdd?.(formData);
        }
        if (!isEditMode) {
            setFormData(getDefaultFormData());
            setTemplateId("scratch");
        }
        onClose?.();
    };

    const updateField = <K extends keyof MembershipFormData>(field: K, value: MembershipFormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateBenefits = (field: keyof MembershipBenefits, value: any) => {
        setFormData((prev) => ({
            ...prev,
            benefits: {
                ...prev.benefits,
                [field]: value,
            },
        }));
    };

    const toggleLocation = (locationId: string) => {
        setFormData((prev) => {
            const newLocationIds = prev.availableLocationIds.includes(locationId)
                ? prev.availableLocationIds.filter((id) => id !== locationId)
                : [...prev.availableLocationIds, locationId];
            return {
                ...prev,
                availableLocationIds: newLocationIds,
            };
        });
    };

    const selectAllLocations = () => {
        const allLocationIds = locations?.map((loc) => loc.id) || [];
        setFormData((prev) => ({
            ...prev,
            availableLocationIds: allLocationIds,
        }));
    };

    const templateOptions = [
        { id: "scratch", label: t("settings.membership.modal.template.scratch") },
        ...(existingTiers?.map((tier) => ({ id: tier.id, label: tier.planName })) || []),
    ];

    const discountTypeOptions = [
        { id: "FIXED_REDUCTION", label: t("settings.membership.modal.discountTypes.fixedReduction") },
        { id: "FLAT_BOOKING_RATE", label: t("settings.membership.modal.discountTypes.flatBookingRate") },
        { id: "PERCENTAGE_DISCOUNT", label: t("settings.membership.modal.discountTypes.percentageDiscount") },
    ];

    const peakAccessTypeOptions = [
        { id: "PEAK_HOURS_ONLY", label: t("settings.membership.modal.peakAccessTypes.peakHoursOnly") },
        { id: "OFF_PEAK_HOURS_ONLY", label: t("settings.membership.modal.peakAccessTypes.offPeakHoursOnly") },
        { id: "BOTH_PEAK_OFF_PEAK", label: t("settings.membership.modal.peakAccessTypes.bothPeakOffPeak") },
    ];

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={(open) => !open && onClose?.()}>
            <Modal className="w-full max-w-2xl rounded-xl border border-secondary bg-primary shadow-lg">
                <Dialog className="flex max-h-[90vh] flex-col">
                    {/* Header */}
                    <div className="shrink-0 w-full">
                        <div className="flex w-full items-start justify-between px-4 py-4 sm:px-6">
                            <div className="flex-1 min-w-0 pr-4">
                                <h2 className="text-lg font-semibold text-primary">
                                    {isEditMode ? t("settings.membership.modal.editTitle") : t("settings.membership.modal.title")}
                                </h2>
                                <p className="mt-1 text-sm text-tertiary">
                                    {isEditMode ? t("settings.membership.modal.editSubtitle") : t("settings.membership.modal.subtitle")}
                                </p>
                            </div>
                            <div className="shrink-0">
                                <ButtonUtility
                                    size="sm"
                                    color="tertiary"
                                    icon={XClose}
                                    onClick={onClose}
                                    aria-label={t("common.actions.close")}
                                />
                            </div>
                        </div>
                        <div className="border-b border-secondary" />
                    </div>

                    {/* Form Content - Scrollable */}
                    <Form onSubmit={handleSubmit} className="flex min-h-0 w-full flex-1 flex-col">
                        <div className="flex-1 w-full overflow-y-auto px-4 py-6 sm:px-6">
                            <div className="space-y-6">
                                {/* Start from Template (Optional) - Only show in add mode */}
                                {!isEditMode && (
                                    <div className="space-y-2">
                                        <Label>{t("settings.membership.modal.template.label")}</Label>
                                        <Select
                                            selectedKey={templateId || "scratch"}
                                            onSelectionChange={(key) => setTemplateId(key as string)}
                                            items={templateOptions}
                                        >
                                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                        </Select>
                                        <HintText>{t("settings.membership.modal.template.hint")}</HintText>
                                    </div>
                                )}

                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-md font-semibold text-primary">{t("settings.membership.modal.basicInfo.title")}</h3>

                                    <div className="space-y-2">
                                        <Label isRequired>{t("settings.membership.modal.basicInfo.planName")}</Label>
                                        <Input
                                            value={formData.planName}
                                            onChange={(value) => updateField("planName", value)}
                                            placeholder={t("settings.membership.modal.basicInfo.planNamePlaceholder")}
                                            isRequired
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{t("settings.membership.modal.basicInfo.initiationFee")}</Label>
                                        <Input
                                            type="number"
                                            value={formData.initiationFee.toString()}
                                            onChange={(value) => updateField("initiationFee", parseFloat(value) || 0)}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label isRequired>{t("settings.membership.modal.basicInfo.price")}</Label>
                                        <Input
                                            type="number"
                                            value={formData.price.toString()}
                                            onChange={(value) => updateField("price", parseFloat(value) || 0)}
                                            placeholder="0"
                                            isRequired
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label isRequired>{t("settings.membership.modal.basicInfo.lengthMonths")}</Label>
                                        <Input
                                            type="number"
                                            value={formData.lengthMonths.toString()}
                                            onChange={(value) => updateField("lengthMonths", parseInt(value) || 1)}
                                            placeholder="1"
                                            isRequired
                                        />
                                    </div>
                                </div>

                                {/* Membership Benefits */}
                                <div className="space-y-6">
                                    <h3 className="text-md font-semibold text-primary">{t("settings.membership.modal.benefits.title")}</h3>

                                    {/* Free/Included Simulator Time */}
                                    <div className="space-y-3 rounded-lg border border-secondary bg-secondary/30 p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Label className="text-sm font-medium">{t("settings.membership.modal.benefits.freeSimulatorTime.label")}</Label>
                                                <HintText>{t("settings.membership.modal.benefits.freeSimulatorTime.hint")}</HintText>
                                            </div>
                                            <Toggle
                                                isSelected={formData.benefits.freeSimulatorTime?.enabled || false}
                                                onChange={(isSelected) =>
                                                    updateBenefits("freeSimulatorTime", {
                                                        enabled: isSelected,
                                                        hoursPerMonth: formData.benefits.freeSimulatorTime?.hoursPerMonth || 4,
                                                    })
                                                }
                                            />
                                        </div>
                                        {formData.benefits.freeSimulatorTime?.enabled && (
                                            <div className="space-y-2">
                                                <Label>{t("settings.membership.modal.benefits.freeSimulatorTime.hoursPerMonth")}</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.benefits.freeSimulatorTime.hoursPerMonth.toString()}
                                                    onChange={(value) =>
                                                        updateBenefits("freeSimulatorTime", {
                                                            ...formData.benefits.freeSimulatorTime,
                                                            hoursPerMonth: parseInt(value) || 0,
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Advance Booking Window */}
                                    <div className="space-y-3 rounded-lg border border-secondary bg-secondary/30 p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Label className="text-sm font-medium">{t("settings.membership.modal.benefits.advanceBooking.label")}</Label>
                                                <HintText>{t("settings.membership.modal.benefits.advanceBooking.hint")}</HintText>
                                            </div>
                                            <Toggle
                                                isSelected={formData.benefits.advanceBookingWindow?.enabled || false}
                                                onChange={(isSelected) =>
                                                    updateBenefits("advanceBookingWindow", {
                                                        enabled: isSelected,
                                                        daysInAdvance: formData.benefits.advanceBookingWindow?.daysInAdvance || 14,
                                                    })
                                                }
                                            />
                                        </div>
                                        {formData.benefits.advanceBookingWindow?.enabled && (
                                            <div className="space-y-2">
                                                <Label>{t("settings.membership.modal.benefits.advanceBooking.daysInAdvance")}</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.benefits.advanceBookingWindow.daysInAdvance.toString()}
                                                    onChange={(value) =>
                                                        updateBenefits("advanceBookingWindow", {
                                                            ...formData.benefits.advanceBookingWindow,
                                                            daysInAdvance: parseInt(value) || 0,
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Free Lessons / Coaching */}
                                    <div className="space-y-3 rounded-lg border border-secondary bg-secondary/30 p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Label className="text-sm font-medium">{t("settings.membership.modal.benefits.freeLessons.label")}</Label>
                                                <HintText>{t("settings.membership.modal.benefits.freeLessons.hint")}</HintText>
                                            </div>
                                            <Toggle
                                                isSelected={formData.benefits.freeLessons?.enabled || false}
                                                onChange={(isSelected) =>
                                                    updateBenefits("freeLessons", {
                                                        enabled: isSelected,
                                                        numberOfLessons: formData.benefits.freeLessons?.numberOfLessons || 2,
                                                    })
                                                }
                                            />
                                        </div>
                                        {formData.benefits.freeLessons?.enabled && (
                                            <div className="space-y-2">
                                                <Label>{t("settings.membership.modal.benefits.freeLessons.numberOfLessons")}</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.benefits.freeLessons.numberOfLessons.toString()}
                                                    onChange={(value) =>
                                                        updateBenefits("freeLessons", {
                                                            ...formData.benefits.freeLessons,
                                                            numberOfLessons: parseInt(value) || 0,
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Peak vs Off-Peak Access Rules */}
                                    <div className="space-y-3 rounded-lg border border-secondary bg-secondary/30 p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Label className="text-sm font-medium">{t("settings.membership.modal.benefits.peakAccess.label")}</Label>
                                                <HintText>{t("settings.membership.modal.benefits.peakAccess.hint")}</HintText>
                                            </div>
                                            <Toggle
                                                isSelected={formData.benefits.peakAccessRules?.enabled || false}
                                                onChange={(isSelected) =>
                                                    updateBenefits("peakAccessRules", {
                                                        enabled: isSelected,
                                                        accessType: formData.benefits.peakAccessRules?.accessType || "BOTH_PEAK_OFF_PEAK",
                                                        guestRatePerHour: formData.benefits.peakAccessRules?.guestRatePerHour || 25,
                                                    })
                                                }
                                            />
                                        </div>
                                        {formData.benefits.peakAccessRules?.enabled && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>{t("settings.membership.modal.benefits.peakAccess.accessType")}</Label>
                                                    <Select
                                                        selectedKey={formData.benefits.peakAccessRules.accessType}
                                                        onSelectionChange={(key) =>
                                                            updateBenefits("peakAccessRules", {
                                                                ...formData.benefits.peakAccessRules,
                                                                accessType: key as PeakAccessType,
                                                            })
                                                        }
                                                        items={peakAccessTypeOptions}
                                                    >
                                                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>{t("settings.membership.modal.benefits.peakAccess.guestRatePerHour")}</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.benefits.peakAccessRules.guestRatePerHour?.toString() || ""}
                                                        onChange={(value) =>
                                                            updateBenefits("peakAccessRules", {
                                                                ...formData.benefits.peakAccessRules,
                                                                guestRatePerHour: parseFloat(value) || 0,
                                                            })
                                                        }
                                                        placeholder="25"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Discount Structure */}
                                    <div className="space-y-3 rounded-lg border border-secondary bg-secondary/30 p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Label className="text-sm font-medium">{t("settings.membership.modal.benefits.discount.label")}</Label>
                                                <HintText>{t("settings.membership.modal.benefits.discount.hint")}</HintText>
                                            </div>
                                            <Toggle
                                                isSelected={formData.benefits.discountStructure?.enabled || false}
                                                onChange={(isSelected) =>
                                                    updateBenefits("discountStructure", {
                                                        enabled: isSelected,
                                                        discountType: formData.benefits.discountStructure?.discountType,
                                                        discountValue: formData.benefits.discountStructure?.discountValue || 0,
                                                    })
                                                }
                                            />
                                        </div>
                                        {formData.benefits.discountStructure?.enabled && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>{t("settings.membership.modal.benefits.discount.discountType")}</Label>
                                                    <Select
                                                        selectedKey={formData.benefits.discountStructure.discountType || null}
                                                        onSelectionChange={(key) =>
                                                            updateBenefits("discountStructure", {
                                                                ...formData.benefits.discountStructure,
                                                                discountType: key as DiscountType,
                                                            })
                                                        }
                                                        placeholder={t("settings.membership.modal.benefits.discount.discountTypePlaceholder")}
                                                        items={discountTypeOptions}
                                                    >
                                                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                                    </Select>
                                                </div>
                                                {formData.benefits.discountStructure.discountType && (
                                                    <div className="space-y-2">
                                                        <Label>
                                                            {formData.benefits.discountStructure.discountType === "PERCENTAGE_DISCOUNT"
                                                                ? t("settings.membership.modal.benefits.discount.percentage")
                                                                : t("settings.membership.modal.benefits.discount.amount")}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            value={formData.benefits.discountStructure.discountValue?.toString() || ""}
                                                            onChange={(value) =>
                                                                updateBenefits("discountStructure", {
                                                                    ...formData.benefits.discountStructure,
                                                                    discountValue: parseFloat(value) || 0,
                                                                })
                                                            }
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Maximum Reservations or Time Booked */}
                                    <div className="space-y-3 rounded-lg border border-secondary bg-secondary/30 p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Label className="text-sm font-medium">{t("settings.membership.modal.benefits.maxReservations.label")}</Label>
                                                <HintText>{t("settings.membership.modal.benefits.maxReservations.hint")}</HintText>
                                            </div>
                                            <Toggle
                                                isSelected={formData.benefits.maxReservations?.enabled || false}
                                                onChange={(isSelected) =>
                                                    updateBenefits("maxReservations", {
                                                        enabled: isSelected,
                                                        maxActiveReservations: formData.benefits.maxReservations?.maxActiveReservations || 4,
                                                    })
                                                }
                                            />
                                        </div>
                                        {formData.benefits.maxReservations?.enabled && (
                                            <div className="space-y-2">
                                                <Label>{t("settings.membership.modal.benefits.maxReservations.maxActiveReservations")}</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.benefits.maxReservations.maxActiveReservations.toString()}
                                                    onChange={(value) =>
                                                        updateBenefits("maxReservations", {
                                                            ...formData.benefits.maxReservations,
                                                            maxActiveReservations: parseInt(value) || 0,
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Maximum Daily Usage */}
                                    <div className="space-y-3 rounded-lg border border-secondary bg-secondary/30 p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Label className="text-sm font-medium">{t("settings.membership.modal.benefits.maxDailyUsage.label")}</Label>
                                                <HintText>{t("settings.membership.modal.benefits.maxDailyUsage.hint")}</HintText>
                                            </div>
                                            <Toggle
                                                isSelected={formData.benefits.maxDailyUsage?.enabled || false}
                                                onChange={(isSelected) =>
                                                    updateBenefits("maxDailyUsage", {
                                                        enabled: isSelected,
                                                        maxHoursPerDay: formData.benefits.maxDailyUsage?.maxHoursPerDay || 2,
                                                    })
                                                }
                                            />
                                        </div>
                                        {formData.benefits.maxDailyUsage?.enabled && (
                                            <div className="space-y-2">
                                                <Label>{t("settings.membership.modal.benefits.maxDailyUsage.maxHoursPerDay")}</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.benefits.maxDailyUsage.maxHoursPerDay.toString()}
                                                    onChange={(value) =>
                                                        updateBenefits("maxDailyUsage", {
                                                            ...formData.benefits.maxDailyUsage,
                                                            maxHoursPerDay: parseInt(value) || 0,
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Location Availability */}
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-md font-semibold">{t("settings.membership.modal.locationAvailability.title")}</Label>
                                        <HintText>{t("settings.membership.modal.locationAvailability.hint")}</HintText>
                                    </div>
                                    <div className="space-y-3">
                                        <Button type="button" color="secondary" size="sm" onPress={selectAllLocations}>
                                            {t("settings.membership.modal.locationAvailability.selectAll")}
                                        </Button>
                                        <div className="space-y-2">
                                            {locations?.map((location) => (
                                                <Checkbox
                                                    key={location.id}
                                                    isSelected={formData.availableLocationIds.includes(location.id)}
                                                    onChange={(isSelected) => {
                                                        if (isSelected) {
                                                            toggleLocation(location.id);
                                                        } else {
                                                            toggleLocation(location.id);
                                                        }
                                                    }}
                                                >
                                                    {location.name}
                                                    {location.address.city && location.address.state && (
                                                        <span className="text-sm text-tertiary">
                                                            {" "}
                                                            {location.address.city}, {location.address.state} {location.address.postalCode}
                                                        </span>
                                                    )}
                                                </Checkbox>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex shrink-0 justify-end gap-3 border-t border-secondary px-4 py-4 sm:px-6">
                            <Button type="button" color="secondary" onPress={onClose}>
                                {t("common.actions.cancel")}
                            </Button>
                            <Button type="submit" color="primary">
                                {isEditMode ? t("common.actions.save") : t("settings.membership.modal.addButton")}
                            </Button>
                        </div>
                    </Form>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};


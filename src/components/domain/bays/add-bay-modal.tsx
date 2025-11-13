import type { FC } from "react";
import React, { useState } from "react";
import { XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Form } from "@/components/base/form/form";
import { HintText } from "@/components/base/input/hint-text";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";
import { Toggle } from "@/components/base/toggle/toggle";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { useGetLocations } from "@/graphql/queries/locations.queries";
import type { SimulatorType } from "@/graphql/types/activity.types";
import { t } from "@/i18n/translations";

interface AddBayModalProps {
    /** Whether the modal is open */
    isOpen?: boolean;
    /** Callback when modal should close */
    onClose?: () => void;
    /** Callback when bay is added */
    onAdd?: (bayData: BayFormData) => void;
    /** Callback when bay is updated */
    onUpdate?: (bayId: string, bayData: BayFormData) => void;
    /** Existing bay data for edit mode */
    bay?: {
        id: string;
        name: string;
        locationId: string;
        simulatorType?: SimulatorType;
        simulatorTypeOther?: string;
        maxPlayersPerReservation?: number;
        notes?: string;
        isOperational?: boolean;
    };
}

export interface BayFormData {
    name: string;
    locationId: string;
    simulatorType: SimulatorType;
    simulatorTypeOther?: string;
    maxPlayersPerReservation: number;
    notes?: string;
    isOperational: boolean;
}

const simulatorTypeOptions = [
    { id: "FORESIGHT", label: "Foresight" },
    { id: "OTHER", label: "Other" },
];

/**
 * Modal for adding or editing a bay.
 * Follows UntitledUI design principles and form patterns.
 */
export const AddBayModal: FC<AddBayModalProps> = ({ isOpen, onClose, onAdd, onUpdate, bay }) => {
    const { data: locations } = useGetLocations();
    const isEditMode = !!bay;

    const [formData, setFormData] = useState<BayFormData>(() => {
        if (bay) {
            return {
                name: bay.name,
                locationId: bay.locationId,
                simulatorType: bay.simulatorType || "FORESIGHT",
                simulatorTypeOther: bay.simulatorTypeOther || "",
                maxPlayersPerReservation: bay.maxPlayersPerReservation || 4,
                notes: bay.notes || "",
                isOperational: bay.isOperational ?? true,
            };
        }
        return {
            name: "",
            locationId: "",
            simulatorType: "FORESIGHT",
            simulatorTypeOther: "",
            maxPlayersPerReservation: 4,
            notes: "",
            isOperational: true,
        };
    });

    // Update form when bay changes (for edit mode)
    React.useEffect(() => {
        if (bay && isOpen) {
            setFormData({
                name: bay.name,
                locationId: bay.locationId,
                simulatorType: bay.simulatorType || "FORESIGHT",
                simulatorTypeOther: bay.simulatorTypeOther || "",
                maxPlayersPerReservation: bay.maxPlayersPerReservation || 4,
                notes: bay.notes || "",
                isOperational: bay.isOperational ?? true,
            });
        } else if (!bay && isOpen) {
            // Reset for add mode
            setFormData({
                name: "",
                locationId: "",
                simulatorType: "FORESIGHT",
                simulatorTypeOther: "",
                maxPlayersPerReservation: 4,
                notes: "",
                isOperational: true,
            });
        }
    }, [bay, isOpen]);

    const locationOptions =
        locations?.map((loc) => ({
            id: loc.id,
            label: loc.name,
        })) || [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && bay) {
            onUpdate?.(bay.id, formData);
        } else {
            onAdd?.(formData);
        }
        // Reset form only if not in edit mode
        if (!isEditMode) {
            setFormData({
                name: "",
                locationId: "",
                simulatorType: "FORESIGHT",
                simulatorTypeOther: "",
                maxPlayersPerReservation: 4,
                notes: "",
                isOperational: true,
            });
        }
        onClose?.();
    };

    const updateField = (field: keyof BayFormData, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={(open) => !open && onClose?.()}>
            <Modal className="w-full max-w-2xl rounded-xl border border-secondary bg-primary shadow-lg">
                <Dialog className="flex max-h-[90vh] flex-col">
                    {/* Header */}
                    <div className="shrink-0 w-full">
                        <div className="flex w-full items-start justify-between px-4 py-4 sm:px-6">
                            <div className="flex-1 min-w-0 pr-4">
                                <h2 className="text-lg font-semibold text-primary">
                                    {isEditMode ? t("settings.bayManagement.modal.editTitle") : t("settings.bayManagement.modal.title")}
                                </h2>
                                <p className="mt-1 text-sm text-tertiary">
                                    {isEditMode ? t("settings.bayManagement.modal.editSubtitle") : t("settings.bayManagement.modal.subtitle")}
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
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Bay Name */}
                                    <div className="space-y-2">
                                        <Label isRequired>{t("settings.bayManagement.modal.fields.bayName")}</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(value) => updateField("name", value)}
                                            placeholder={t("settings.bayManagement.modal.placeholders.bayName")}
                                            isRequired
                                        />
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <Select
                                            label={t("settings.bayManagement.modal.fields.location")}
                                            selectedKey={formData.locationId}
                                            onSelectionChange={(key) => updateField("locationId", key as string)}
                                            placeholder={t("settings.bayManagement.modal.placeholders.location")}
                                            items={locationOptions}
                                            isRequired
                                        >
                                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                        </Select>
                                    </div>
                                </div>

                                {/* Simulator Type */}
                                <div className="space-y-2">
                                    <Select
                                        label={t("settings.bayManagement.modal.fields.simulatorType")}
                                        selectedKey={formData.simulatorType}
                                        onSelectionChange={(key) => updateField("simulatorType", key as string)}
                                        items={simulatorTypeOptions}
                                        isRequired
                                    >
                                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                    </Select>
                                    {formData.simulatorType === "OTHER" && (
                                        <div className="mt-2">
                                            <Input
                                                value={formData.simulatorTypeOther || ""}
                                                onChange={(value) => updateField("simulatorTypeOther", value)}
                                                placeholder={t("settings.bayManagement.modal.placeholders.simulatorTypeOther")}
                                                isRequired
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Max Players per Reservation */}
                                <div className="space-y-2">
                                    <Label isRequired>{t("settings.bayManagement.modal.fields.maxPlayers")}</Label>
                                    <Input
                                        value={String(formData.maxPlayersPerReservation)}
                                        onChange={(value) => updateField("maxPlayersPerReservation", parseInt(value) || 4)}
                                        placeholder={t("settings.bayManagement.modal.placeholders.maxPlayers")}
                                        type="number"
                                        isRequired
                                    />
                                    <HintText>{t("settings.bayManagement.modal.hints.maxPlayers")}</HintText>
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <TextArea
                                        label={t("settings.bayManagement.modal.fields.notes")}
                                        value={formData.notes || ""}
                                        onChange={(value) => updateField("notes", value)}
                                        placeholder={t("settings.bayManagement.modal.placeholders.notes")}
                                        rows={4}
                                    />
                                </div>

                                {/* Operational Status */}
                                <div className="space-y-2">
                                    <Label>{t("settings.bayManagement.modal.fields.operationalStatus")}</Label>
                                    <Toggle
                                        isSelected={formData.isOperational}
                                        onChange={(isSelected) => updateField("isOperational", isSelected)}
                                        label={formData.isOperational ? t("settings.bayManagement.modal.status.on") : t("settings.bayManagement.modal.status.off")}
                                    />
                                    <HintText>{t("settings.bayManagement.modal.hints.operationalStatus")}</HintText>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex shrink-0 justify-end gap-3 border-t border-secondary px-4 py-4 sm:px-6">
                            <Button type="button" color="secondary" onPress={onClose}>
                                {t("common.actions.cancel")}
                            </Button>
                            <Button type="submit" color="primary">
                                {isEditMode ? t("common.actions.save") : t("settings.bayManagement.modal.addButton")}
                            </Button>
                        </div>
                    </Form>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};



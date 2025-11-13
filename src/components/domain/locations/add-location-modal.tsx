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
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "@/components/application/modals/modal";
import type { LocationStatus } from "@/graphql/types/common.types";
import { t } from "@/i18n/translations";

interface AddLocationModalProps {
    /** Whether the modal is open */
    isOpen?: boolean;
    /** Callback when modal should close */
    onClose?: () => void;
    /** Callback when location is added */
    onAdd?: (locationData: LocationFormData) => void;
    /** Callback when location is updated */
    onUpdate?: (locationId: string, locationData: LocationFormData) => void;
    /** Existing location data for edit mode */
    location?: {
        id: string;
        name: string;
        address: {
            street: string;
            city: string;
            state: string;
            postalCode: string;
        };
        contactPhone?: string;
        contactEmail?: string;
        timezone: string;
        status?: LocationStatus;
    };
}

export interface LocationFormData {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
    email: string;
    website?: string;
    timezone: string;
    operatingHours: string;
    status: LocationStatus;
}

/**
 * Modal for adding or editing a location.
 * Follows UntitledUI design principles and form patterns.
 */
export const AddLocationModal: FC<AddLocationModalProps> = ({ isOpen, onClose, onAdd, onUpdate, location }) => {
    const isEditMode = !!location;

    const [formData, setFormData] = useState<LocationFormData>(() => {
        if (location) {
            return {
                name: location.name,
                street: location.address.street,
                city: location.address.city,
                state: location.address.state,
                postalCode: location.address.postalCode,
                phone: location.contactPhone || "",
                email: location.contactEmail || "",
                website: "",
                timezone: location.timezone,
                operatingHours: "9:00 AM - 11:00 PM", // Default, could be stored in location
                status: location.status || "ACTIVE",
            };
        }
        return {
            name: "",
            street: "",
            city: "",
            state: "",
            postalCode: "",
            phone: "",
            email: "",
            website: "",
            timezone: "EST (UTC-5)",
            operatingHours: "9:00 AM - 11:00 PM",
            status: "ACTIVE",
        };
    });

    // Update form when location changes (for edit mode)
    React.useEffect(() => {
        if (location && isOpen) {
            setFormData({
                name: location.name,
                street: location.address.street,
                city: location.address.city,
                state: location.address.state,
                postalCode: location.address.postalCode,
                phone: location.contactPhone || "",
                email: location.contactEmail || "",
                website: "",
                timezone: location.timezone,
                operatingHours: "9:00 AM - 11:00 PM",
                status: location.status || "ACTIVE",
            });
        } else if (!location && isOpen) {
            // Reset for add mode
            setFormData({
                name: "",
                street: "",
                city: "",
                state: "",
                postalCode: "",
                phone: "",
                email: "",
                website: "",
                timezone: "EST (UTC-5)",
                operatingHours: "9:00 AM - 11:00 PM",
                status: "ACTIVE",
            });
        }
    }, [location, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && location) {
            onUpdate?.(location.id, formData);
        } else {
            onAdd?.(formData);
        }
        // Reset form only if not in edit mode
        if (!isEditMode) {
            setFormData({
                name: "",
                street: "",
                city: "",
                state: "",
                postalCode: "",
                phone: "",
                email: "",
                website: "",
                timezone: "EST (UTC-5)",
                operatingHours: "9:00 AM - 11:00 PM",
                status: "ACTIVE",
            });
        }
        onClose?.();
    };

    const updateField = (field: keyof LocationFormData, value: string) => {
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
                                    {isEditMode ? t("settings.locations.modal.editTitle") : t("settings.locations.modal.title")}
                                </h2>
                                <p className="mt-1 text-sm text-tertiary">
                                    {isEditMode ? t("settings.locations.modal.editSubtitle") : t("settings.locations.modal.subtitle")}
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
                            {/* Location Name */}
                            <div className="space-y-2">
                                <Label isRequired>{t("settings.locations.modal.fields.name")}</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(value) => updateField("name", value)}
                                    placeholder={t("settings.locations.modal.placeholders.name")}
                                    isRequired
                                />
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label isRequired>{t("settings.locations.modal.fields.address")}</Label>
                                <Input
                                    value={formData.street}
                                    onChange={(value) => updateField("street", value)}
                                    placeholder={t("settings.locations.modal.placeholders.address")}
                                    isRequired
                                />
                            </div>

                            {/* City, State, ZIP */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label isRequired>{t("settings.locations.modal.fields.city")}</Label>
                                    <Input
                                        value={formData.city}
                                        onChange={(value) => updateField("city", value)}
                                        placeholder={t("settings.locations.modal.placeholders.city")}
                                        isRequired
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label isRequired>{t("settings.locations.modal.fields.state")}</Label>
                                    <Input
                                        value={formData.state}
                                        onChange={(value) => updateField("state", value)}
                                        placeholder={t("settings.locations.modal.placeholders.state")}
                                        isRequired
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label isRequired>{t("settings.locations.modal.fields.postalCode")}</Label>
                                    <Input
                                        value={formData.postalCode}
                                        onChange={(value) => updateField("postalCode", value)}
                                        placeholder={t("settings.locations.modal.placeholders.postalCode")}
                                        isRequired
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <Label isRequired>{t("settings.locations.modal.fields.phone")}</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(value) => updateField("phone", value)}
                                    placeholder={t("settings.locations.modal.placeholders.phone")}
                                    type="tel"
                                    isRequired
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label isRequired>{t("settings.locations.modal.fields.email")}</Label>
                                <Input
                                    value={formData.email}
                                    onChange={(value) => updateField("email", value)}
                                    placeholder={t("settings.locations.modal.placeholders.email")}
                                    type="email"
                                    isRequired
                                />
                            </div>

                            {/* Website URL */}
                            <div className="space-y-2">
                                <Label>{t("settings.locations.modal.fields.website")}</Label>
                                <Input
                                    value={formData.website || ""}
                                    onChange={(value) => updateField("website", value)}
                                    placeholder={t("settings.locations.modal.placeholders.website")}
                                    type="url"
                                />
                                <HintText>{t("settings.locations.modal.hints.website")}</HintText>
                            </div>

                            {/* Time Zone */}
                            <div className="space-y-2">
                                <Label isRequired>{t("settings.locations.modal.fields.timezone")}</Label>
                                <Input
                                    value={formData.timezone}
                                    onChange={(value) => updateField("timezone", value)}
                                    placeholder={t("settings.locations.modal.placeholders.timezone")}
                                    isRequired
                                />
                                <HintText>{t("settings.locations.modal.hints.timezone")}</HintText>
                            </div>

                            {/* Operating Hours */}
                            <div className="space-y-2">
                                <Label isRequired>{t("settings.locations.modal.fields.operatingHours")}</Label>
                                <Input
                                    value={formData.operatingHours}
                                    onChange={(value) => updateField("operatingHours", value)}
                                    placeholder={t("settings.locations.modal.placeholders.operatingHours")}
                                    isRequired
                                />
                                <HintText>{t("settings.locations.modal.hints.operatingHours")}</HintText>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Select
                                    label={t("settings.locations.modal.fields.status")}
                                    selectedKey={formData.status}
                                    onSelectionChange={(key) => updateField("status", key as string)}
                                    items={[
                                        { id: "ACTIVE", label: t("settings.locations.modal.status.active") },
                                        { id: "INACTIVE", label: t("settings.locations.modal.status.inactive") },
                                    ]}
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                                <HintText>{t("settings.locations.modal.hints.status")}</HintText>
                            </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex shrink-0 justify-end gap-3 border-t border-secondary px-4 py-4 sm:px-6">
                            <Button type="button" color="secondary" onPress={onClose}>
                                {t("common.actions.cancel")}
                            </Button>
                            <Button type="submit" color="primary">
                                {isEditMode ? t("common.actions.save") : t("settings.locations.modal.addButton")}
                            </Button>
                        </div>
                    </Form>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};


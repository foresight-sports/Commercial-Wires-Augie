import type { FC } from "react";
import React, { useState } from "react";
import { Camera01, XClose } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { FileTrigger } from "@/components/base/file-upload-trigger/file-upload-trigger";
import { Form } from "@/components/base/form/form";
import { HintText } from "@/components/base/input/hint-text";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { useGetLocations } from "@/graphql/queries/locations.queries";
import type { StaffStatus, UserRole } from "@/graphql/types/common.types";
import { t } from "@/i18n/translations";

interface AddStaffModalProps {
    /** Whether the modal is open */
    isOpen?: boolean;
    /** Callback when modal should close */
    onClose?: () => void;
    /** Callback when staff member is added */
    onAdd?: (staffData: StaffFormData) => void;
    /** Callback when staff member is updated */
    onUpdate?: (staffId: string, staffData: StaffFormData) => void;
    /** Existing staff data for edit mode */
    staff?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        role: string;
        assignedLocationId?: string;
        status?: string;
        avatar?: string;
    };
}

export interface StaffFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    assignedLocationId: string;
    status: StaffStatus;
    avatar?: string | File;
}

const roleOptions = [
    { id: "OWNER", label: "Owner" },
    { id: "MANAGER", label: "Manager" },
    { id: "STAFF", label: "Staff" },
    { id: "COACH", label: "Coach" },
];

const statusOptions = [
    { id: "ACTIVE", label: "Active" },
    { id: "INACTIVE", label: "Inactive" },
    { id: "PENDING", label: "Pending" },
];

/**
 * Modal for adding or editing a staff member.
 * Follows UntitledUI design principles and form patterns.
 */
export const AddStaffModal: FC<AddStaffModalProps> = ({ isOpen, onClose, onAdd, onUpdate, staff }) => {
    const { data: locations } = useGetLocations();
    const isEditMode = !!staff;

    const [formData, setFormData] = useState<StaffFormData>(() => {
        if (staff) {
            return {
                firstName: staff.firstName,
                lastName: staff.lastName,
                email: staff.email,
                phone: staff.phone || "",
                role: staff.role as UserRole,
                assignedLocationId: staff.assignedLocationId || "",
                status: (staff.status as StaffStatus) || "ACTIVE",
                avatar: staff.avatar,
            };
        }
        return {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            role: "STAFF",
            assignedLocationId: "",
            status: "ACTIVE",
        };
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(staff?.avatar || null);

    // Update form when staff changes (for edit mode)
    React.useEffect(() => {
        if (staff && isOpen) {
            setFormData({
                firstName: staff.firstName,
                lastName: staff.lastName,
                email: staff.email,
                phone: staff.phone || "",
                role: staff.role as UserRole,
                assignedLocationId: staff.assignedLocationId || "",
                status: (staff.status as StaffStatus) || "ACTIVE",
                avatar: staff.avatar,
            });
            setAvatarPreview(staff.avatar || null);
        } else if (!staff && isOpen) {
            // Reset for add mode
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                role: "STAFF",
                assignedLocationId: "",
                status: "ACTIVE",
            });
            setAvatarPreview(null);
        }
    }, [staff, isOpen]);

    const handleAvatarSelect = (files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, avatar: file }));
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const locationOptions =
        locations?.map((loc) => ({
            id: loc.id,
            label: loc.name,
        })) || [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && staff) {
            onUpdate?.(staff.id, formData);
        } else {
            onAdd?.(formData);
        }
        // Reset form only if not in edit mode
        if (!isEditMode) {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                role: "STAFF",
                assignedLocationId: "",
                status: "ACTIVE",
            });
        }
        onClose?.();
    };

    const updateField = (field: keyof StaffFormData, value: string) => {
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
                                    {isEditMode ? t("settings.staff.modal.editTitle") : t("settings.staff.modal.title")}
                                </h2>
                                <p className="mt-1 text-sm text-tertiary">
                                    {isEditMode ? t("settings.staff.modal.editSubtitle") : t("settings.staff.modal.subtitle")}
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
                            {/* Photo Upload */}
                            <div className="space-y-2">
                                <Label>{t("settings.staff.modal.fields.photo")}</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        size="lg"
                                        src={avatarPreview || undefined}
                                        initials={formData.firstName && formData.lastName ? `${formData.firstName[0]}${formData.lastName[0]}` : undefined}
                                    />
                                    <FileTrigger
                                        acceptedFileTypes={["image/*"]}
                                        allowsMultiple={false}
                                        onSelect={handleAvatarSelect}
                                    >
                                        <Button color="secondary" size="sm" iconLeading={Camera01}>
                                            {avatarPreview ? t("settings.staff.modal.changePhoto") : t("settings.staff.modal.uploadPhoto")}
                                        </Button>
                                    </FileTrigger>
                                </div>
                                <HintText>{t("settings.staff.modal.hints.photo")}</HintText>
                            </div>

                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label isRequired>{t("settings.staff.modal.fields.fullName")}</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        value={formData.firstName}
                                        onChange={(value) => updateField("firstName", value)}
                                        placeholder={t("settings.staff.modal.placeholders.firstName")}
                                        isRequired
                                    />
                                    <Input
                                        value={formData.lastName}
                                        onChange={(value) => updateField("lastName", value)}
                                        placeholder={t("settings.staff.modal.placeholders.lastName")}
                                        isRequired
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label isRequired>{t("settings.staff.modal.fields.email")}</Label>
                                <Input
                                    value={formData.email}
                                    onChange={(value) => updateField("email", value)}
                                    placeholder={t("settings.staff.modal.placeholders.email")}
                                    type="email"
                                    isRequired
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <Label isRequired>{t("settings.staff.modal.fields.phone")}</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(value) => updateField("phone", value)}
                                    placeholder={t("settings.staff.modal.placeholders.phone")}
                                    type="tel"
                                    isRequired
                                />
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <Select
                                    label={t("settings.staff.modal.fields.role")}
                                    selectedKey={formData.role}
                                    onSelectionChange={(key) => updateField("role", key as string)}
                                    placeholder={t("settings.staff.modal.placeholders.role")}
                                    items={roleOptions}
                                    isRequired
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                            </div>

                            {/* Assigned Location */}
                            <div className="space-y-2">
                                <Select
                                    label={t("settings.staff.modal.fields.assignedLocation")}
                                    selectedKey={formData.assignedLocationId}
                                    onSelectionChange={(key) => updateField("assignedLocationId", key as string)}
                                    placeholder={t("settings.staff.modal.placeholders.assignedLocation")}
                                    items={locationOptions}
                                    isRequired
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Select
                                    label={t("settings.staff.modal.fields.status")}
                                    selectedKey={formData.status}
                                    onSelectionChange={(key) => updateField("status", key as string)}
                                    items={statusOptions}
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                                <HintText>{t("settings.staff.modal.hints.status")}</HintText>
                            </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex shrink-0 justify-end gap-3 border-t border-secondary px-4 py-4 sm:px-6">
                            <Button type="button" color="secondary" onPress={onClose}>
                                {t("common.actions.cancel")}
                            </Button>
                            <Button type="submit" color="primary">
                                {isEditMode ? t("common.actions.save") : t("settings.staff.modal.addButton")}
                            </Button>
                        </div>
                    </Form>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};


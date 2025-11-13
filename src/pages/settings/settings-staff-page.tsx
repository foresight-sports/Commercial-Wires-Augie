import type { FC } from "react";
import { useState } from "react";
import { Edit03, Plus, Trash01 } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { AddStaffModal, type StaffFormData } from "@/components/domain/staff/add-staff-modal";
import { useGetStaff } from "@/graphql/queries/staff.queries";
import { t } from "@/i18n/translations";

/**
 * Settings > Staff page
 * Manage staff members, roles, and permissions.
 */
export const SettingsStaffPage: FC = () => {
    const { data: staff, loading, error, refetch } = useGetStaff();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<{ id: string; firstName: string; lastName: string; email: string; phone?: string; role: string; assignedLocationId?: string; status?: string; avatar?: string } | null>(null);

    const handleAddStaff = (staffData: StaffFormData) => {
        // TODO: Implement mutation to add staff
        console.log("Adding staff:", staffData);
        refetch();
    };

    const handleUpdateStaff = (staffId: string, staffData: StaffFormData) => {
        // TODO: Implement mutation to update staff
        console.log("Updating staff:", staffId, staffData);
        refetch();
    };

    const handleEditStaff = (staffMember: { id: string; firstName: string; lastName: string; email: string; phone?: string; role: string; assignedLocationId?: string; status?: string }) => {
        setEditingStaff(staffMember);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStaff(null);
    };

    const getRoleLabel = (role: string) => {
        return t(`settings.staff.roles.${role.toLowerCase()}`);
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "ACTIVE":
                return "success";
            case "INACTIVE":
                return "gray";
            case "PENDING":
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
                            <h1 className="text-display-xs font-semibold text-primary">{t("settings.staff.title")}</h1>
                            <p className="mt-1 text-md text-tertiary">{t("settings.staff.subtitle")}</p>
                        </div>
                        <Button color="primary" size="md" iconLeading={Plus} onPress={() => setIsModalOpen(true)}>
                            {t("settings.staff.addStaff")}
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                    {loading && !staff && (
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

                    {staff && staff.length === 0 && (
                        <EmptyState>
                            <EmptyState.Content>
                                <EmptyState.Title>{t("settings.staff.empty.title")}</EmptyState.Title>
                                <EmptyState.Description>{t("settings.staff.empty.description")}</EmptyState.Description>
                            </EmptyState.Content>
                            <EmptyState.Footer>
                                <Button color="primary" iconLeading={Plus} onPress={() => setIsModalOpen(true)}>
                                    {t("settings.staff.empty.action")}
                                </Button>
                            </EmptyState.Footer>
                        </EmptyState>
                    )}

                    {staff && staff.length > 0 && (
                        <div className="overflow-hidden rounded-lg border border-secondary bg-primary shadow-xs">
                            <table className="w-full">
                                <thead className="border-b border-secondary bg-secondary">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("settings.staff.table.columns.name")}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("settings.staff.table.columns.email")}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("settings.staff.table.columns.role")}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">{t("settings.staff.table.columns.status")}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-tertiary">{t("settings.staff.table.columns.actions")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary">
                                    {staff.map((item) => (
                                        <tr key={item.id} className="hover:bg-secondary cursor-pointer" onClick={() => handleEditStaff(item)}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {item.avatar && (
                                                        <img src={item.avatar} alt="" className="size-10 rounded-full" />
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-primary">
                                                            {item.firstName} {item.lastName}
                                                        </div>
                                                        {item.phone && <div className="text-sm text-tertiary">{item.phone}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-secondary">{item.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge color="gray" size="sm" type="pill-color">
                                                    {getRoleLabel(item.role)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge color={getStatusColor(item.status)} size="sm" type="pill-color">
                                                    {item.status || "ACTIVE"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-2">
                                                    <ButtonUtility
                                                        size="sm"
                                                        color="tertiary"
                                                        icon={Edit03}
                                                        aria-label={t("common.actions.edit")}
                                                        onClick={() => handleEditStaff(item)}
                                                    />
                                                    <ButtonUtility size="sm" color="tertiary" icon={Trash01} aria-label={t("common.actions.delete")} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <AddStaffModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAdd={handleAddStaff}
                onUpdate={handleUpdateStaff}
                staff={editingStaff || undefined}
            />
        </>
    );
};

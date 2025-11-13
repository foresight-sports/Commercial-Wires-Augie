import type { FC } from "react";
import { Toggle } from "@/components/base/toggle/toggle";
import { t } from "@/i18n/translations";

interface RolePermission {
    id: string;
    label: string;
    enabled: boolean;
}

interface RoleDefinition {
    id: string;
    name: string;
    description: string;
    permissions: RolePermission[];
}

const roleDefinitions: RoleDefinition[] = [
    {
        id: "OWNER",
        name: t("settings.roleAccess.roles.owner.name"),
        description: t("settings.roleAccess.roles.owner.description"),
        permissions: [
            { id: "manageLocations", label: t("settings.roleAccess.permissions.manageLocations"), enabled: true },
            { id: "manageStaff", label: t("settings.roleAccess.permissions.manageStaff"), enabled: true },
            { id: "addEditBays", label: t("settings.roleAccess.permissions.addEditBays"), enabled: true },
            { id: "addEditMemberships", label: t("settings.roleAccess.permissions.addEditMemberships"), enabled: true },
            { id: "addEditPricing", label: t("settings.roleAccess.permissions.addEditPricing"), enabled: true },
            { id: "addEditServices", label: t("settings.roleAccess.permissions.addEditServices"), enabled: true },
            { id: "viewReports", label: t("settings.roleAccess.permissions.viewReports"), enabled: true },
            { id: "editBanking", label: t("settings.roleAccess.permissions.editBanking"), enabled: true },
        ],
    },
    {
        id: "MANAGER",
        name: t("settings.roleAccess.roles.manager.name"),
        description: t("settings.roleAccess.roles.manager.description"),
        permissions: [
            { id: "manageBookings", label: t("settings.roleAccess.permissions.manageBookings"), enabled: true },
            { id: "manageLocalStaff", label: t("settings.roleAccess.permissions.manageLocalStaff"), enabled: true },
            { id: "addEditBays", label: t("settings.roleAccess.permissions.addEditBays"), enabled: true },
            { id: "addEditMemberships", label: t("settings.roleAccess.permissions.addEditMemberships"), enabled: true },
            { id: "addEditPricing", label: t("settings.roleAccess.permissions.addEditPricing"), enabled: true },
            { id: "addEditServices", label: t("settings.roleAccess.permissions.addEditServices"), enabled: true },
            { id: "viewReports", label: t("settings.roleAccess.permissions.viewReports"), enabled: true },
            { id: "editCorporateSettings", label: t("settings.roleAccess.permissions.editCorporateSettings"), enabled: false },
        ],
    },
    {
        id: "STAFF",
        name: t("settings.roleAccess.roles.staff.name"),
        description: t("settings.roleAccess.roles.staff.description"),
        permissions: [
            { id: "manageBookings", label: t("settings.roleAccess.permissions.manageBookings"), enabled: true },
            { id: "viewReports", label: t("settings.roleAccess.permissions.viewReports"), enabled: true },
            { id: "manageLocalStaff", label: t("settings.roleAccess.permissions.manageLocalStaff"), enabled: false },
            { id: "addEditBays", label: t("settings.roleAccess.permissions.addEditBays"), enabled: false },
            { id: "addEditMemberships", label: t("settings.roleAccess.permissions.addEditMemberships"), enabled: false },
            { id: "addEditPricing", label: t("settings.roleAccess.permissions.addEditPricing"), enabled: false },
            { id: "addEditServices", label: t("settings.roleAccess.permissions.addEditServices"), enabled: false },
            { id: "editCorporateSettings", label: t("settings.roleAccess.permissions.editCorporateSettings"), enabled: false },
        ],
    },
    {
        id: "COACH",
        name: t("settings.roleAccess.roles.coach.name"),
        description: t("settings.roleAccess.roles.coach.description"),
        permissions: [
            { id: "manageBookings", label: t("settings.roleAccess.permissions.manageBookings"), enabled: true },
            { id: "manageLocalStaff", label: t("settings.roleAccess.permissions.manageLocalStaff"), enabled: true },
            { id: "addEditBays", label: t("settings.roleAccess.permissions.addEditBays"), enabled: true },
            { id: "addEditMemberships", label: t("settings.roleAccess.permissions.addEditMemberships"), enabled: true },
            { id: "addEditPricing", label: t("settings.roleAccess.permissions.addEditPricing"), enabled: true },
            { id: "addEditServices", label: t("settings.roleAccess.permissions.addEditServices"), enabled: true },
            { id: "viewReports", label: t("settings.roleAccess.permissions.viewReports"), enabled: true },
            { id: "editCorporateSettings", label: t("settings.roleAccess.permissions.editCorporateSettings"), enabled: false },
        ],
    },
];

/**
 * Settings > Role Access page
 * View role definitions and permissions (read-only).
 */
export const SettingsRoleAccessPage: FC = () => {
    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                <div>
                    <h1 className="text-display-xs font-semibold text-primary">{t("settings.roleAccess.title")}</h1>
                    <p className="mt-1 text-md text-tertiary">{t("settings.roleAccess.subtitle")}</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                <div className="space-y-6">
                    {roleDefinitions.map((role) => (
                        <div key={role.id} className="rounded-lg border border-secondary bg-primary p-6 shadow-xs">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-primary">{role.name}</h2>
                                <p className="mt-1 text-sm text-tertiary">{role.description}</p>
                            </div>

                            <div className="space-y-3">
                                {role.permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center justify-between">
                                        <span className="text-sm text-secondary">{permission.label}</span>
                                        <Toggle isSelected={permission.enabled} isDisabled size="sm" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

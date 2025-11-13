import type { FC } from "react";
import { Edit03 } from "@untitledui/icons";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import type { Bay } from "@/graphql/types/activity.types";
import type { Location } from "@/graphql/types/common.types";
import { t } from "@/i18n/translations";

interface BayLocationGroupProps {
    location: Location;
    bays: Bay[];
    onEditBay?: (bay: Bay) => void;
}

/**
 * Component to display bays grouped by location.
 * Shows a location card with a table of bays underneath.
 */
export const BayLocationGroup: FC<BayLocationGroupProps> = ({ location, bays, onEditBay }) => {
    const getSimulatorTypeDisplay = (bay: Bay): string => {
        if (bay.simulatorType === "FORESIGHT") {
            return "Foresight";
        }
        return bay.simulatorTypeOther || "Other";
    };

    return (
        <div className="rounded-lg border border-secondary bg-primary shadow-xs">
            {/* Location Header */}
            <div className="border-b border-secondary px-6 py-4">
                <h3 className="text-lg font-semibold text-primary">{location.name}</h3>
                <p className="mt-1 text-sm text-tertiary">
                    {bays.length} {bays.length === 1 ? "Bay" : "Bays"}
                </p>
            </div>

            {/* Bays Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-secondary bg-secondary">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">
                                {t("settings.bayManagement.table.columns.bayName")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">
                                {t("settings.bayManagement.table.columns.simulatorType")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">
                                {t("settings.bayManagement.table.columns.maxPlayers")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-tertiary">
                                {t("settings.bayManagement.table.columns.notes")}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-tertiary">
                                {t("settings.bayManagement.table.columns.actions")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary">
                        {bays.map((bay) => (
                            <tr key={bay.id} className="hover:bg-secondary">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-primary">{bay.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-secondary">{getSimulatorTypeDisplay(bay)}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-secondary">{bay.maxPlayersPerReservation || 4}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-secondary">{bay.notes || "-"}</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <ButtonUtility
                                        size="sm"
                                        color="tertiary"
                                        icon={Edit03}
                                        aria-label={t("common.actions.edit")}
                                        onClick={() => onEditBay?.(bay)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};



import type { FC } from "react";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button } from "@/components/base/buttons/button";
import { t } from "@/i18n/translations";

/**
 * Settings > Banking page
 * Configure payment methods, bank accounts, and financial settings.
 */
export const SettingsBankingPage: FC = () => {
    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                <div>
                    <h1 className="text-display-xs font-semibold text-primary">{t("settings.banking.title")}</h1>
                    <p className="mt-1 text-md text-tertiary">{t("settings.banking.subtitle")}</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                <EmptyState>
                    <EmptyState.Content>
                        <EmptyState.Title>{t("settings.banking.empty.title")}</EmptyState.Title>
                        <EmptyState.Description>{t("settings.banking.empty.description")}</EmptyState.Description>
                    </EmptyState.Content>
                    <EmptyState.Footer>
                        <Button color="primary">{t("settings.banking.empty.action")}</Button>
                    </EmptyState.Footer>
                </EmptyState>
            </div>
        </div>
    );
};


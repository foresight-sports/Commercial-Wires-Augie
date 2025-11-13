import type { FC } from "react";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button } from "@/components/base/buttons/button";
import { t } from "@/i18n/translations";

/**
 * Settings > Pricing page
 * Configure pricing rules, rates, and packages.
 */
export const SettingsPricingPage: FC = () => {
    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                <div>
                    <h1 className="text-display-xs font-semibold text-primary">{t("settings.pricing.title")}</h1>
                    <p className="mt-1 text-md text-tertiary">{t("settings.pricing.subtitle")}</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                <EmptyState>
                    <EmptyState.Content>
                        <EmptyState.Title>{t("settings.pricing.empty.title")}</EmptyState.Title>
                        <EmptyState.Description>{t("settings.pricing.empty.description")}</EmptyState.Description>
                    </EmptyState.Content>
                    <EmptyState.Footer>
                        <Button color="primary">{t("settings.pricing.empty.action")}</Button>
                    </EmptyState.Footer>
                </EmptyState>
            </div>
        </div>
    );
};


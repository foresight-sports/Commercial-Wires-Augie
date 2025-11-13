import type { FC } from "react";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button } from "@/components/base/buttons/button";
import { Plus } from "@untitledui/icons";
import { t } from "@/i18n/translations";

/**
 * Settings > Policies page
 * Manage terms of service, privacy policy, and facility policies.
 */
export const SettingsPoliciesPage: FC = () => {
    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-display-xs font-semibold text-primary">{t("settings.policies.title")}</h1>
                        <p className="mt-1 text-md text-tertiary">{t("settings.policies.subtitle")}</p>
                    </div>
                    <Button color="primary" size="md" iconLeading={Plus}>
                        {t("settings.policies.addPolicy")}
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                <EmptyState>
                    <EmptyState.Content>
                        <EmptyState.Title>{t("settings.policies.empty.title")}</EmptyState.Title>
                        <EmptyState.Description>{t("settings.policies.empty.description")}</EmptyState.Description>
                    </EmptyState.Content>
                    <EmptyState.Footer>
                        <Button color="primary" iconLeading={Plus}>
                            {t("settings.policies.empty.action")}
                        </Button>
                    </EmptyState.Footer>
                </EmptyState>
            </div>
        </div>
    );
};


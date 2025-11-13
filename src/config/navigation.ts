import { BarChart01, Home01, LifeBuoy01, MarkerPin01, Settings01 } from "@untitledui/icons";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { t } from "@/i18n/translations";

/**
 * Primary navigation items for the application.
 * These will be displayed in the sidebar navigation.
 */
export const primaryNavigation: NavItemType[] = [
    {
        label: t("common.navigation.reporting"),
        href: "/reporting",
        icon: BarChart01,
    },
    {
        label: t("common.navigation.activity"),
        href: "/activity",
        icon: Home01,
    },
    {
        label: t("common.navigation.locations"),
        href: "/locations",
        icon: MarkerPin01,
    },
];

/**
 * Footer navigation items for the application.
 * These will be displayed above the account card in the sidebar.
 */
export const footerNavigation: NavItemType[] = [
    {
        label: "Settings",
        href: "/settings",
        icon: Settings01,
    },
    {
        label: "Support",
        href: "/support",
        icon: LifeBuoy01,
    },
];

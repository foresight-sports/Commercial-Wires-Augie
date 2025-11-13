import type { FC } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router";
import {
    Bank,
    Building02,
    File06,
    Image01,
    MarkerPin01,
    Settings01,
    Shield03,
    Tag01,
    Users01,
    Zap,
} from "@untitledui/icons";
import { NavItemBase } from "@/components/application/app-navigation/base-components/nav-item";
import { t } from "@/i18n/translations";
import { cx } from "@/utils/cx";

interface SettingsNavItem {
    label: string;
    href: string;
    icon: FC<{ className?: string }>;
}

const settingsNavItems: SettingsNavItem[] = [
    {
        label: t("settings.navigation.locations"),
        href: "/settings/locations",
        icon: MarkerPin01,
    },
    {
        label: t("settings.navigation.staff"),
        href: "/settings/staff",
        icon: Users01,
    },
    {
        label: t("settings.navigation.bayManagement"),
        href: "/settings/bay-management",
        icon: Zap,
    },
    {
        label: t("settings.navigation.membership"),
        href: "/settings/membership",
        icon: Building02,
    },
    {
        label: t("settings.navigation.pricing"),
        href: "/settings/pricing",
        icon: Tag01,
    },
    {
        label: t("settings.navigation.services"),
        href: "/settings/services",
        icon: Settings01,
    },
    {
        label: t("settings.navigation.banking"),
        href: "/settings/banking",
        icon: Bank,
    },
    {
        label: t("settings.navigation.branding"),
        href: "/settings/branding",
        icon: Image01,
    },
    {
        label: t("settings.navigation.policies"),
        href: "/settings/policies",
        icon: File06,
    },
    {
        label: t("settings.navigation.roleAccess"),
        href: "/settings/role-access",
        icon: Shield03,
    },
];

/**
 * Settings page layout with sidebar navigation for subsections.
 * Follows UntitledUI navigation patterns and design principles.
 */
export const SettingsPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Redirect to first subsection if on base /settings route
    useEffect(() => {
        if (location.pathname === "/settings") {
            navigate("/settings/locations", { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <div className="flex h-full">
            {/* Settings Sidebar Navigation */}
            <aside className="hidden w-64 flex-shrink-0 border-r border-secondary bg-primary lg:block">
                <div className="sticky top-0 flex h-full flex-col overflow-y-auto px-4 py-6">
                    <div className="mb-6">
                        <h1 className="text-display-xs font-semibold text-primary">{t("settings.page.title")}</h1>
                        <p className="mt-1 text-sm text-tertiary">{t("settings.page.subtitle")}</p>
                    </div>

                    <nav className="flex-1">
                        <ul className="flex flex-col gap-0.5">
                            {settingsNavItems.map((item) => {
                                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
                                const Icon = item.icon;

                                return (
                                    <li key={item.href}>
                                        <NavItemBase
                                            type="link"
                                            href={item.href}
                                            icon={Icon}
                                            current={isActive}
                                        >
                                            {item.label}
                                        </NavItemBase>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Mobile Navigation - Tabs */}
            <div className="lg:hidden w-full border-b border-secondary bg-primary">
                <div className="overflow-x-auto">
                    <div className="flex gap-1 px-4 py-3">
                        {settingsNavItems.map((item) => {
                            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.href}
                                    onClick={() => navigate(item.href)}
                                    className={cx(
                                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary_alt text-secondary"
                                            : "text-tertiary hover:bg-secondary hover:text-secondary",
                                    )}
                                >
                                    <Icon className="size-4" />
                                    <span className="whitespace-nowrap">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Settings Content */}
            <main className="flex min-w-0 flex-1 flex-col overflow-auto bg-secondary">
                <div className="flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};


import type { ReactNode } from "react";
import { useState } from "react";
import { Menu01, SearchLg, XClose } from "@untitledui/icons";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Input } from "@/components/base/input/input";
import { ForesightLogo } from "@/components/foundations/logo/foresight-logo";
import { t } from "@/i18n/translations";
import { cx } from "@/utils/cx";
import { MobileNavigationHeader } from "../base-components/mobile-header";
import { NavAccountCard } from "../base-components/nav-account-card";
import { NavItemBase } from "../base-components/nav-item";
import { NavItemButton } from "../base-components/nav-item-button";
import { NavList } from "../base-components/nav-list";
import type { NavItemType } from "../config";

interface SidebarNavigationToggleableProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** List of items to display. */
    items: NavItemType[];
    /** List of footer items to display. */
    footerItems?: NavItemType[];
    /** Feature card to display. */
    featureCard?: ReactNode;
    /** Whether to show the account card. */
    showAccountCard?: boolean;
    /** Whether to hide the right side border. */
    hideBorder?: boolean;
    /** Additional CSS classes to apply to the sidebar. */
    className?: string;
}

export const SidebarNavigationToggleable = ({
    activeUrl,
    items,
    footerItems = [],
    featureCard,
    showAccountCard = true,
    hideBorder = false,
    className,
}: SidebarNavigationToggleableProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const EXPANDED_WIDTH = 296;
    const COLLAPSED_WIDTH = 68;
    const currentWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

    const content = (
        <aside
            style={
                {
                    "--width": `${currentWidth}px`,
                } as React.CSSProperties
            }
            className={cx(
                "flex h-full w-full max-w-full flex-col justify-between overflow-auto bg-primary pt-4 transition-all duration-300 lg:w-(--width) lg:pt-6",
                !hideBorder && "border-secondary md:border-r",
                className,
            )}
        >
            {/* Header Section */}
            <div className={cx("flex flex-col gap-5", isCollapsed ? "items-center px-3" : "px-4 lg:px-5")}>
                <div className={cx("flex items-center", isCollapsed ? "flex-col gap-3" : "justify-between")}>
                    <div className={cx("flex items-center gap-3", isCollapsed && "flex-col")}>
                        <ForesightLogo className={cx("text-brand-600", isCollapsed ? "h-8" : "h-7")} />
                        {!isCollapsed && <span className="text-lg font-semibold text-primary">{t("common.app.name")}</span>}
                    </div>
                    {!isCollapsed && (
                        <ButtonUtility
                            size="md"
                            color="tertiary"
                            tooltip="Collapse sidebar"
                            icon={XClose}
                            onClick={() => setIsCollapsed(true)}
                            aria-label="Collapse sidebar"
                        />
                    )}
                </div>

                {isCollapsed ? (
                    <ButtonUtility
                        size="md"
                        color="tertiary"
                        tooltip="Expand sidebar"
                        icon={Menu01}
                        onClick={() => setIsCollapsed(false)}
                        aria-label="Expand sidebar"
                    />
                ) : (
                    <Input shortcut size="sm" aria-label="Search" placeholder="Search" icon={SearchLg} />
                )}
            </div>

            {/* Main Navigation */}
            {isCollapsed ? (
                <ul className="mt-4 flex flex-col gap-0.5 px-3">
                    {items.map((item) => (
                        <li key={item.label}>
                            <NavItemButton size="md" current={item.href === activeUrl} href={item.href} label={item.label || ""} icon={item.icon} />
                        </li>
                    ))}
                </ul>
            ) : (
                <NavList activeUrl={activeUrl} items={items} />
            )}

            {/* Footer Section */}
            <div className={cx("mt-auto flex flex-col gap-4 py-4", isCollapsed ? "items-center px-3" : "px-2 lg:px-4 lg:py-6")}>
                {footerItems.length > 0 && (
                    <ul className={cx("flex flex-col", isCollapsed ? "gap-0.5" : "")}>
                        {footerItems.map((item) => (
                            <li key={item.label} className={cx(isCollapsed ? "" : "py-0.5")}>
                                {isCollapsed ? (
                                    <NavItemButton size="md" current={item.href === activeUrl} href={item.href} label={item.label || ""} icon={item.icon} />
                                ) : (
                                    <NavItemBase badge={item.badge} icon={item.icon} href={item.href} type="link" current={item.href === activeUrl}>
                                        {item.label}
                                    </NavItemBase>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {!isCollapsed && featureCard}

                {showAccountCard && <NavAccountCard isCollapsed={isCollapsed} />}
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile header navigation */}
            <MobileNavigationHeader>{content}</MobileNavigationHeader>

            {/* Desktop sidebar navigation */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex">{content}</div>

            {/* Placeholder to take up physical space because the real sidebar has `fixed` position. */}
            <div
                style={{
                    paddingLeft: currentWidth,
                }}
                className="invisible hidden transition-all duration-300 lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block"
            />
        </>
    );
};

import type { FC, ReactNode } from "react";
import { useLocation } from "react-router";
import { SidebarNavigationToggleable } from "@/components/application/app-navigation/sidebar-navigation/sidebar-toggleable";
import { footerNavigation, primaryNavigation } from "@/config/navigation";

interface AppLayoutProps {
    children: ReactNode;
}

/**
 * Main application layout with toggleable sidebar navigation.
 * Used for all authenticated pages (Activity, Reporting, Locations).
 * The sidebar can be collapsed/expanded with a button click.
 */
export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
    const location = useLocation();

    return (
        <div className="flex h-dvh">
            <SidebarNavigationToggleable items={primaryNavigation} footerItems={footerNavigation} activeUrl={location.pathname} />
            <main className="flex min-w-0 flex-1 flex-col overflow-auto bg-secondary">
                <div className="flex-1">{children}</div>
            </main>
        </div>
    );
};

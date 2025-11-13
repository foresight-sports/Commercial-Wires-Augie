import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppLayout } from "@/layouts/app-layout";
import { ActivityPage } from "@/pages/activity-page";
import { CustomerPage } from "@/pages/customer-page";
import { LocationsPage } from "@/pages/locations-page";
import { NotFound } from "@/pages/not-found";
import { ReportingPage } from "@/pages/reporting-page";
import { SettingsPage } from "@/pages/settings-page";
import { SettingsBankingPage } from "@/pages/settings/settings-banking-page";
import { SettingsBayManagementPage } from "@/pages/settings/settings-bay-management-page";
import { SettingsBrandingPage } from "@/pages/settings/settings-branding-page";
import { SettingsLocationsPage } from "@/pages/settings/settings-locations-page";
import { SettingsMembershipPage } from "@/pages/settings/settings-membership-page";
import { SettingsPoliciesPage } from "@/pages/settings/settings-policies-page";
import { SettingsPricingPage } from "@/pages/settings/settings-pricing-page";
import { SettingsRoleAccessPage } from "@/pages/settings/settings-role-access-page";
import { SettingsServicesPage } from "@/pages/settings/settings-services-page";
import { SettingsStaffPage } from "@/pages/settings/settings-staff-page";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <RouteProvider>
                    <Routes>
                        {/* Redirect root to reporting */}
                        <Route path="/" element={<Navigate to="/reporting" replace />} />

                        {/* Main application routes */}
                        <Route
                            path="/activity"
                            element={
                                <AppLayout>
                                    <ActivityPage />
                                </AppLayout>
                            }
                        />
                        <Route
                            path="/customers/:customerId"
                            element={
                                <AppLayout>
                                    <CustomerPage />
                                </AppLayout>
                            }
                        />
                        <Route
                            path="/reporting"
                            element={
                                <AppLayout>
                                    <ReportingPage />
                                </AppLayout>
                            }
                        />
                        <Route
                            path="/locations"
                            element={
                                <AppLayout>
                                    <LocationsPage />
                                </AppLayout>
                            }
                        />

                        {/* Settings routes */}
                        <Route
                            path="/settings"
                            element={
                                <AppLayout>
                                    <SettingsPage />
                                </AppLayout>
                            }
                        >
                            <Route path="locations" element={<SettingsLocationsPage />} />
                            <Route path="staff" element={<SettingsStaffPage />} />
                            <Route path="bay-management" element={<SettingsBayManagementPage />} />
                            <Route path="membership" element={<SettingsMembershipPage />} />
                            <Route path="pricing" element={<SettingsPricingPage />} />
                            <Route path="services" element={<SettingsServicesPage />} />
                            <Route path="banking" element={<SettingsBankingPage />} />
                            <Route path="branding" element={<SettingsBrandingPage />} />
                            <Route path="policies" element={<SettingsPoliciesPage />} />
                            <Route path="role-access" element={<SettingsRoleAccessPage />} />
                        </Route>

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </RouteProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
);

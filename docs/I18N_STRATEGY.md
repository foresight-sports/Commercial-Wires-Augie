# Internationalization (i18n) Strategy

## Overview

This application is being built with internationalization in mind from day one. While we may not implement a full i18n library immediately, the codebase structure ensures easy integration when needed.

## Goals

1. **Zero hardcoded strings**: All user-facing text must be externalizable
2. **Locale-aware formatting**: Dates, times, numbers, and currency respect user locale
3. **RTL support ready**: Architecture supports right-to-left languages
4. **Minimal refactoring**: When we add i18n library, changes should be minimal
5. **Type-safe translations**: TypeScript should catch missing or incorrect keys

## Recommended Library

**react-i18next** is the recommended choice when ready to implement:

- Industry standard for React i18n
- Excellent TypeScript support
- Namespace organization
- Lazy loading for large translation files
- Interpolation and pluralization
- Integration with date/number formatting libraries

## Translation File Structure

### Directory Organization

```
src/i18n/
├── locales/
│   ├── en/
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── activity.json
│   │   ├── reporting.json
│   │   ├── locations.json
│   │   └── validation.json
│   ├── es/
│   │   ├── common.json
│   │   ├── auth.json
│   │   └── ...
│   ├── fr/
│   └── de/
├── config.ts              # i18n configuration
└── index.ts               # Export translations and utilities
```

### Translation Namespaces

#### Common (Shared Across App)

```json
// src/i18n/locales/en/common.json
{
    "app": {
        "name": "Foresight Bay Management",
        "tagline": "Golf simulator facility management"
    },
    "navigation": {
        "activity": "Activity",
        "reporting": "Reporting",
        "locations": "Locations",
        "profile": "My Profile",
        "accountSettings": "Account Settings",
        "teamManagement": "Team Management",
        "billing": "Billing",
        "logout": "Log Out"
    },
    "actions": {
        "save": "Save",
        "cancel": "Cancel",
        "delete": "Delete",
        "edit": "Edit",
        "create": "Create",
        "search": "Search",
        "filter": "Filter",
        "export": "Export",
        "refresh": "Refresh",
        "viewDetails": "View Details",
        "close": "Close",
        "confirm": "Confirm",
        "back": "Back",
        "next": "Next",
        "finish": "Finish"
    },
    "status": {
        "loading": "Loading...",
        "saving": "Saving...",
        "success": "Success",
        "error": "Error",
        "noResults": "No results found",
        "tryAgain": "Try again"
    },
    "time": {
        "today": "Today",
        "yesterday": "Yesterday",
        "tomorrow": "Tomorrow",
        "thisWeek": "This Week",
        "thisMonth": "This Month",
        "lastMonth": "Last Month",
        "custom": "Custom Range"
    }
}
```

#### Authentication

```json
// src/i18n/locales/en/auth.json
{
    "login": {
        "title": "Log in to your account",
        "subtitle": "Welcome back! Please enter your details.",
        "email": "Email",
        "password": "Password",
        "rememberMe": "Remember me",
        "forgotPassword": "Forgot password?",
        "submit": "Log in",
        "noAccount": "Don't have an account?",
        "signUp": "Sign up"
    },
    "createAccount": {
        "title": "Create your account",
        "subtitle": "Get started with Foresight Bay Management",
        "businessName": "Business Name",
        "yourName": "Your Name",
        "email": "Email",
        "password": "Password",
        "confirmPassword": "Confirm Password",
        "submit": "Create Account",
        "hasAccount": "Already have an account?",
        "logIn": "Log in",
        "terms": "By creating an account, you agree to our {{termsLink}} and {{privacyLink}}",
        "termsOfService": "Terms of Service",
        "privacyPolicy": "Privacy Policy"
    },
    "errors": {
        "invalidCredentials": "Invalid email or password",
        "emailInUse": "This email is already in use",
        "weakPassword": "Password must be at least 8 characters",
        "passwordMismatch": "Passwords do not match"
    }
}
```

#### Activity Domain

```json
// src/i18n/locales/en/activity.json
{
    "page": {
        "title": "Activity",
        "subtitle": "Real-time bay status and today's schedule"
    },
    "bayStatus": {
        "title": "Bay Status",
        "subtitle": "Current availability across all bays",
        "statuses": {
            "available": "Available",
            "inUse": "In Use",
            "maintenance": "Maintenance",
            "offline": "Offline"
        },
        "bayCard": {
            "currentBooking": "Current Booking",
            "nextBooking": "Next Booking",
            "customerName": "Customer",
            "timeRemaining": "{{minutes}} min remaining",
            "startsIn": "Starts in {{minutes}} min",
            "maintenanceNote": "Maintenance Note",
            "deviceStatus": "Device Status",
            "noBookings": "No bookings scheduled"
        },
        "actions": {
            "createBooking": "Create Booking",
            "viewDetails": "View Details",
            "markMaintenance": "Mark for Maintenance",
            "markAvailable": "Mark as Available",
            "extendBooking": "Extend Booking"
        }
    },
    "schedule": {
        "title": "Today's Schedule",
        "subtitle": "All bookings for {{date}}",
        "empty": {
            "title": "No bookings today",
            "description": "Create a booking to get started",
            "action": "Create First Booking"
        },
        "filters": {
            "allBays": "All Bays",
            "allStatuses": "All Statuses",
            "searchPlaceholder": "Search by customer or bay..."
        },
        "table": {
            "time": "Time",
            "bay": "Bay",
            "customer": "Customer",
            "duration": "Duration",
            "status": "Status",
            "source": "Source",
            "actions": "Actions"
        },
        "bookingStatuses": {
            "scheduled": "Scheduled",
            "inProgress": "In Progress",
            "completed": "Completed",
            "cancelled": "Cancelled",
            "noShow": "No Show"
        },
        "bookingSources": {
            "walkIn": "Walk-in",
            "online": "Online",
            "phone": "Phone",
            "recurring": "Recurring"
        }
    },
    "createBooking": {
        "title": "Create Booking",
        "selectBay": "Select Bay",
        "selectCustomer": "Select Customer",
        "newCustomer": "New Customer",
        "dateTime": "Date & Time",
        "startTime": "Start Time",
        "duration": "Duration",
        "notes": "Notes (Optional)",
        "notesPlaceholder": "Add any special requests or notes...",
        "pricing": "Pricing",
        "basePrice": "Base Price",
        "total": "Total",
        "actions": {
            "create": "Create Booking",
            "cancel": "Cancel"
        },
        "success": "Booking created successfully",
        "conflict": "This time slot is not available"
    }
}
```

#### Reporting Domain

```json
// src/i18n/locales/en/reporting.json
{
    "page": {
        "title": "Reporting",
        "subtitle": "Business analytics and insights"
    },
    "overview": {
        "title": "Overview",
        "dateRange": "Date Range",
        "metrics": {
            "revenue": {
                "title": "Total Revenue",
                "subtitle": "{{percentage}}% from last period"
            },
            "bookings": {
                "title": "Total Bookings",
                "subtitle": "{{count}} bookings"
            },
            "utilization": {
                "title": "Bay Utilization",
                "subtitle": "Average across all bays"
            },
            "avgBookingValue": {
                "title": "Avg. Booking Value",
                "subtitle": "Per booking"
            }
        }
    },
    "revenueReport": {
        "title": "Revenue Report",
        "byDay": "Revenue by Day",
        "byBay": "Revenue by Bay",
        "byCustomer": "Revenue by Customer",
        "chart": {
            "xAxis": "Date",
            "yAxis": "Revenue ({{currency}})",
            "tooltip": "{{date}}: {{amount}}"
        },
        "export": {
            "pdf": "Export as PDF",
            "csv": "Export as CSV",
            "excel": "Export as Excel"
        }
    },
    "utilizationReport": {
        "title": "Bay Utilization",
        "overallRate": "Overall Utilization Rate",
        "peakHours": "Peak Hours",
        "byBay": "Utilization by Bay",
        "heatmap": {
            "title": "Hourly Utilization Heatmap",
            "xAxis": "Hour of Day",
            "yAxis": "Day of Week"
        }
    },
    "customerReport": {
        "title": "Customer Analytics",
        "totalCustomers": "Total Customers",
        "newThisMonth": "New This Month",
        "topCustomers": "Top Customers by Revenue",
        "lifetimeValue": "Avg. Lifetime Value"
    }
}
```

#### Locations Domain

```json
// src/i18n/locales/en/locations.json
{
    "page": {
        "title": "Locations",
        "subtitle": "Manage facilities, bays, and equipment"
    },
    "locationList": {
        "title": "Your Locations",
        "addLocation": "Add Location",
        "empty": {
            "title": "No locations yet",
            "description": "Add your first location to get started",
            "action": "Add Location"
        }
    },
    "locationDetail": {
        "tabs": {
            "overview": "Overview",
            "bays": "Bays",
            "devices": "Devices",
            "settings": "Settings"
        },
        "overview": {
            "info": "Location Information",
            "address": "Address",
            "contact": "Contact",
            "hours": "Operating Hours",
            "timezone": "Timezone",
            "totalBays": "Total Bays",
            "activeDevices": "Active Devices"
        }
    },
    "bayConfiguration": {
        "title": "Bay Configuration",
        "addBay": "Add Bay",
        "bayName": "Bay Name",
        "bayNumber": "Bay Number",
        "assignedDevices": "Assigned Devices",
        "pricing": "Pricing",
        "baseRate": "Base Hourly Rate",
        "peakRate": "Peak Hourly Rate",
        "maintenanceSchedule": "Maintenance Schedule",
        "actions": {
            "save": "Save Configuration",
            "delete": "Delete Bay"
        }
    },
    "deviceInventory": {
        "title": "Device Inventory",
        "addDevice": "Add Device",
        "table": {
            "type": "Type",
            "manufacturer": "Manufacturer",
            "model": "Model",
            "serial": "Serial Number",
            "bay": "Assigned Bay",
            "status": "Status",
            "lastCalibration": "Last Calibration"
        },
        "deviceTypes": {
            "launchMonitor": "Launch Monitor",
            "projector": "Projector",
            "sensor": "Sensor",
            "computer": "Computer"
        },
        "deviceStatuses": {
            "operational": "Operational",
            "warning": "Warning",
            "error": "Error",
            "offline": "Offline"
        }
    }
}
```

#### Validation Messages

```json
// src/i18n/locales/en/validation.json
{
    "required": "{{field}} is required",
    "email": "Please enter a valid email address",
    "phone": "Please enter a valid phone number",
    "minLength": "{{field}} must be at least {{min}} characters",
    "maxLength": "{{field}} must be no more than {{max}} characters",
    "min": "{{field}} must be at least {{min}}",
    "max": "{{field}} must be no more than {{max}}",
    "date": {
        "invalid": "Please enter a valid date",
        "past": "Date cannot be in the past",
        "future": "Date cannot be in the future",
        "range": "End date must be after start date"
    },
    "time": {
        "invalid": "Please enter a valid time",
        "businessHours": "Time must be during business hours"
    },
    "currency": "Please enter a valid amount",
    "unique": "{{field}} must be unique"
}
```

## Implementation Patterns

### Temporary Translation Function (Pre-i18n)

Until we integrate react-i18next, use a simple translation object:

```typescript
// src/i18n/translations.ts
// Import all English translations
import activity from "./locales/en/activity.json";
import auth from "./locales/en/auth.json";
import common from "./locales/en/common.json";
import locations from "./locales/en/locations.json";
import reporting from "./locales/en/reporting.json";
import validation from "./locales/en/validation.json";

export const translations = {
    common,
    auth,
    activity,
    reporting,
    locations,
    validation,
};

// Simple type-safe translation function
export function t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
        value = value[k];
        if (value === undefined) {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }

    if (typeof value !== "string") {
        console.warn(`Translation key is not a string: ${key}`);
        return key;
    }

    // Simple interpolation
    if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
            return String(params[param] ?? match);
        });
    }

    return value;
}

// Usage in components:
// import { t } from '@/i18n/translations';
// <h1>{t('activity.page.title')}</h1>
// <p>{t('activity.bayStatus.bayCard.timeRemaining', { minutes: 15 })}</p>
```

### Component Usage Example

```tsx
import { t } from "@/i18n/translations";

export const BayStatusCard = ({ bay }: { bay: Bay }) => {
    return (
        <div className="border-secondary bg-primary rounded-lg border p-6">
            <div className="flex items-center justify-between">
                <h3>{bay.name}</h3>
                <Badge color={getStatusColor(bay.status)}>{t(`activity.bayStatus.statuses.${bay.status.toLowerCase()}`)}</Badge>
            </div>

            {bay.currentBooking && (
                <div className="mt-4">
                    <p className="text-tertiary text-sm">{t("activity.bayStatus.bayCard.currentBooking")}</p>
                    <p>
                        {bay.currentBooking.customer?.firstName} {bay.currentBooking.customer?.lastName}
                    </p>
                </div>
            )}

            <Button size="sm" className="mt-4">
                {t("common.actions.viewDetails")}
            </Button>
        </div>
    );
};
```

## Date & Time Formatting

Use `Intl.DateTimeFormat` for locale-aware formatting:

```typescript
// src/utils/formatters.ts

export const formatDate = (date: Date | string, locale: string = "en-US"): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(dateObj);
};

export const formatTime = (date: Date | string, locale: string = "en-US"): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true, // Make this configurable based on locale
    }).format(dateObj);
};

export const formatDateTime = (date: Date | string, locale: string = "en-US"): string => {
    return `${formatDate(date, locale)} at ${formatTime(date, locale)}`;
};

export const formatRelativeTime = (date: Date | string, locale: string = "en-US"): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    return formatDate(dateObj, locale);
};
```

## Number & Currency Formatting

```typescript
// src/utils/formatters.ts (continued)

export const formatCurrency = (amount: number, currency: string = "USD", locale: string = "en-US"): string => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export const formatNumber = (value: number, locale: string = "en-US", options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(locale, options).format(value);
};

export const formatPercentage = (value: number, locale: string = "en-US", decimals: number = 1): string => {
    return new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value / 100);
};
```

## Future: Full i18n Implementation

When ready to implement react-i18next:

```typescript
// src/i18n/config.ts
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import authEN from "./locales/en/auth.json";
// Import translations
import commonEN from "./locales/en/common.json";

// ... etc

i18n.use(LanguageDetector) // Detect user language
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        supportedLngs: ["en", "es", "fr", "de"],
        ns: ["common", "auth", "activity", "reporting", "locations", "validation"],
        defaultNS: "common",
        resources: {
            en: {
                common: commonEN,
                auth: authEN,
                // ... etc
            },
            // Add other languages
        },
        interpolation: {
            escapeValue: false, // React already escapes
        },
        react: {
            useSuspense: false, // Set to true with Suspense boundaries
        },
    });

export default i18n;
```

Component usage with react-i18next:

```tsx
import { useTranslation } from "react-i18next";

export const BayStatusCard = ({ bay }: { bay: Bay }) => {
    const { t } = useTranslation("activity");

    return (
        <div>
            <h3>{t("bayStatus.title")}</h3>
            <Badge>{t(`bayStatus.statuses.${bay.status.toLowerCase()}`)}</Badge>
            <p>{t("bayStatus.bayCard.timeRemaining", { minutes: 15 })}</p>
        </div>
    );
};
```

## Best Practices

1. **Always use translation keys**: Never hardcode user-facing strings
2. **Meaningful keys**: Use descriptive, hierarchical keys (domain.feature.element)
3. **Avoid concatenation**: Use interpolation instead
4. **Handle plurals properly**: Use i18n pluralization features
5. **Context-aware translations**: Same word may need different translations in different contexts
6. **Test with long text**: Some languages (German, French) can be 30% longer
7. **Externalize all text**: Including placeholders, tooltips, aria-labels
8. **Keep translations in sync**: Use TypeScript to enforce all languages have same keys

## RTL Support (Future)

When adding RTL languages (Arabic, Hebrew):

```css
/* src/styles/globals.css */

[dir="rtl"] {
    direction: rtl;
}

/* Mirror horizontal spacing and positioning */
[dir="rtl"] .ml-4 {
    margin-right: 1rem;
    margin-left: 0;
}
```

Use logical properties in Tailwind v4 where possible (they auto-flip for RTL):

- `ms-4` instead of `ml-4` (margin-inline-start)
- `pe-4` instead of `pr-4` (padding-inline-end)

---

This strategy ensures the application is internationalization-ready from day one.

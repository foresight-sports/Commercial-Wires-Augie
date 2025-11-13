import activity from "./locales/en/activity.json";
import common from "./locales/en/common.json";
import locations from "./locales/en/locations.json";
import reporting from "./locales/en/reporting.json";
import settings from "./locales/en/settings.json";

export const translations = {
    common,
    activity,
    reporting,
    locations,
    settings,
};

/**
 * Simple type-safe translation function for development.
 * This will be replaced with react-i18next when full i18n is implemented.
 *
 * @param key - Translation key in dot notation (e.g., "common.actions.save")
 * @param params - Optional parameters for interpolation
 */
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

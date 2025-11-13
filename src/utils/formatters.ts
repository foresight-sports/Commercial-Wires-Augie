import type { Money } from "@/graphql/types/common.types";

/**
 * Format a date in a locale-aware way
 */
export const formatDate = (date: Date | string, locale: string = "en-US"): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(dateObj);
};

/**
 * Format a time in a locale-aware way
 */
export const formatTime = (date: Date | string, locale: string = "en-US"): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(dateObj);
};

/**
 * Format a date and time together
 */
export const formatDateTime = (date: Date | string, locale: string = "en-US"): string => {
    return `${formatDate(date, locale)} at ${formatTime(date, locale)}`;
};

/**
 * Format a relative time (e.g., "5 minutes ago")
 */
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

/**
 * Format currency using locale-aware formatting
 */
export const formatCurrency = (amount: number, currency: string = "USD", locale: string = "en-US"): string => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

/**
 * Format Money type (convenience wrapper)
 */
export const formatMoney = (money: Money, locale: string = "en-US"): string => {
    return formatCurrency(money.amount, money.currency, locale);
};

/**
 * Format a number with locale-aware formatting
 */
export const formatNumber = (value: number, locale: string = "en-US", options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * Format a percentage
 */
export const formatPercentage = (value: number, locale: string = "en-US", decimals: number = 1): string => {
    return new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value / 100);
};

/**
 * Calculate duration in minutes between two dates
 */
export const calculateDuration = (startTime: Date | string, endTime: Date | string): number => {
    const start = typeof startTime === "string" ? new Date(startTime) : startTime;
    const end = typeof endTime === "string" ? new Date(endTime) : endTime;
    return Math.floor((end.getTime() - start.getTime()) / 60000);
};

/**
 * Format duration in hours and minutes
 */
export const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
};

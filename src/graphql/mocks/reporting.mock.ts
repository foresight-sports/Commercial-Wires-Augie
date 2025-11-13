import type { RevenueMetrics } from "../types/reporting.types";

export const mockRevenueMetrics: RevenueMetrics = {
    totalRevenue: { amount: 24580.0, currency: "USD" },
    bookingCount: 342,
    averageBookingValue: { amount: 71.87, currency: "USD" },
    bayUtilization: 68.5,
    revenueByDay: [
        { date: "2024-10-17", amount: { amount: 3240.0, currency: "USD" }, bookingCount: 45 },
        { date: "2024-10-18", amount: { amount: 3890.0, currency: "USD" }, bookingCount: 52 },
        { date: "2024-10-19", amount: { amount: 4120.0, currency: "USD" }, bookingCount: 58 },
        { date: "2024-10-20", amount: { amount: 3560.0, currency: "USD" }, bookingCount: 49 },
        { date: "2024-10-21", amount: { amount: 2980.0, currency: "USD" }, bookingCount: 41 },
        { date: "2024-10-22", amount: { amount: 3420.0, currency: "USD" }, bookingCount: 48 },
        { date: "2024-10-23", amount: { amount: 3370.0, currency: "USD" }, bookingCount: 49 },
    ],
    revenueByBay: [
        {
            bayId: "bay-001",
            bayName: "Bay 1",
            amount: { amount: 4120.0, currency: "USD" },
            bookingCount: 58,
            utilizationRate: 72.3,
        },
        {
            bayId: "bay-002",
            bayName: "Bay 2",
            amount: { amount: 3890.0, currency: "USD" },
            bookingCount: 55,
            utilizationRate: 68.1,
        },
        {
            bayId: "bay-003",
            bayName: "Bay 3 - Premium",
            amount: { amount: 4680.0, currency: "USD" },
            bookingCount: 52,
            utilizationRate: 75.8,
        },
        {
            bayId: "bay-004",
            bayName: "Bay 4",
            amount: { amount: 3720.0, currency: "USD" },
            bookingCount: 51,
            utilizationRate: 64.2,
        },
        {
            bayId: "bay-005",
            bayName: "Bay 5",
            amount: { amount: 3560.0, currency: "USD" },
            bookingCount: 49,
            utilizationRate: 61.5,
        },
        {
            bayId: "bay-006",
            bayName: "Bay 6 - Premium",
            amount: { amount: 4610.0, currency: "USD" },
            bookingCount: 77,
            utilizationRate: 79.4,
        },
    ],
};

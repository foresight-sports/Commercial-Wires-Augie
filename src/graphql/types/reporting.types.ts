import type { Money } from "./common.types";

export interface RevenueMetrics {
    totalRevenue: Money;
    bookingCount: number;
    averageBookingValue: Money;
    bayUtilization: number;
    revenueByDay: RevenueByPeriod[];
    revenueByBay: RevenueByBay[];
}

export interface RevenueByPeriod {
    date: string;
    amount: Money;
    bookingCount: number;
}

export interface RevenueByBay {
    bayId: string;
    bayName: string;
    amount: Money;
    bookingCount: number;
    utilizationRate: number;
}

export interface UtilizationMetrics {
    overallUtilization: number;
    peakHours: PeakHour[];
    bayUtilization: BayUtilization[];
}

export interface PeakHour {
    hour: number;
    utilizationRate: number;
    bookingCount: number;
}

export interface BayUtilization {
    bayId: string;
    bayName: string;
    utilizationRate: number;
    hoursBooked: number;
    hoursAvailable: number;
}

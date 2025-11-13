import { useQuery } from "../hooks/useQuery";
import { mockRevenueMetrics } from "../mocks/reporting.mock";
import type { RevenueMetrics } from "../types/reporting.types";

/**
 * Query to get revenue metrics for a date range.
 * In production, this would be a GraphQL query like:
 * query GetRevenueMetrics($locationId: ID, $startDate: Date!, $endDate: Date!) {
 *   revenueReport(locationId: $locationId, startDate: $startDate, endDate: $endDate) { ...MetricsFields }
 * }
 */
export function useGetRevenueMetrics(locationId: string | null, startDate: Date, endDate: Date) {
    return useQuery<RevenueMetrics>(`revenue-metrics-${locationId}-${startDate.toISOString()}-${endDate.toISOString()}`, async () => {
        // In production, this would filter by locationId and date range
        return mockRevenueMetrics;
    });
}

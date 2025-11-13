import { useQuery } from "../hooks/useQuery";
import { mockActivityLogs } from "../mocks/activity-log.mock";
import type { ActivityLog } from "../types/activity-log.types";

/**
 * Query to get recent activity logs for a location.
 * In production, this would be a GraphQL query like:
 * query GetActivityLogs($locationId: ID!, $limit: Int) {
 *   activityLogs(locationId: $locationId, limit: $limit) { ...ActivityLogFields }
 * }
 */
export function useGetActivityLogs(locationId: string, limit: number = 50) {
    return useQuery<ActivityLog[]>(
        `activity-logs-${locationId}-${limit}`,
        async () => {
            // In production, this would filter by locationId and apply limit
            // For now, return most recent activities sorted by timestamp
            return mockActivityLogs.slice(0, limit).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        },
        {
            pollInterval: 10000, // Refresh every 10 seconds for real-time feel
        },
    );
}

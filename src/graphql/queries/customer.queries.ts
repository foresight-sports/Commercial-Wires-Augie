import { useQuery } from "../hooks/useQuery";
import { mockCustomers } from "../mocks/activity.mock";
import { mockActivityLogs } from "../mocks/activity-log.mock";
import type { Customer } from "../types/activity.types";
import type { ActivityLog } from "../types/activity-log.types";

/**
 * Query to get customer details by ID.
 * In production, this would be a GraphQL query like:
 * query GetCustomer($customerId: ID!) {
 *   customer(id: $customerId) { ...CustomerFields }
 * }
 */
export function useGetCustomer(customerId: string) {
    return useQuery<Customer | undefined>(`customer-${customerId}`, async () => {
        return mockCustomers.find((customer) => customer.id === customerId);
    });
}

/**
 * Query to get activity logs for a specific customer.
 * In production, this would be a GraphQL query like:
 * query GetCustomerActivity($customerId: ID!, $limit: Int) {
 *   customerActivity(customerId: $customerId, limit: $limit) { ...ActivityLogFields }
 * }
 */
export function useGetCustomerActivity(customerId: string, limit: number = 50) {
    return useQuery<ActivityLog[]>(
        `customer-activity-${customerId}-${limit}`,
        async () => {
            return mockActivityLogs
                .filter((activity) => activity.customer?.id === customerId)
                .slice(0, limit)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        },
        {
            pollInterval: 10000, // Refresh every 10 seconds
        },
    );
}


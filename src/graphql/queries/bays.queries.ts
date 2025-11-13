import { useQuery } from "@/graphql/hooks/useQuery";
import { mockBays } from "../mocks/bays.mock";
import type { Bay } from "../types/activity.types";

/**
 * Query to get all bays for the account.
 * In production, this would be a GraphQL query like:
 * query GetBays { bays { ...BayFields } }
 */
export function useGetBays() {
    return useQuery<Bay[]>("bays", async () => {
        // Return all bays
        return mockBays;
    });
}

/**
 * Query to get bays grouped by location.
 * In production, this would be a GraphQL query with grouping.
 */
export function useGetBaysByLocation() {
    return useQuery<Record<string, Bay[]>>("baysByLocation", async () => {
        const bays = mockBays;
        const grouped: Record<string, Bay[]> = {};

        bays.forEach((bay) => {
            if (!grouped[bay.locationId]) {
                grouped[bay.locationId] = [];
            }
            grouped[bay.locationId].push(bay);
        });

        return grouped;
    });
}


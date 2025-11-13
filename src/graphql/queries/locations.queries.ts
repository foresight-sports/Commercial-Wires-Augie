import { useQuery } from "../hooks/useQuery";
import { mockLocations } from "../mocks/users.mock";
import type { Location } from "../types/common.types";

/**
 * Query to get all locations for the current account.
 * In production, this would be a GraphQL query like:
 * query GetLocations { locations { ...LocationFields } }
 */
export function useGetLocations() {
    return useQuery<Location[]>("locations", async () => {
        return mockLocations;
    });
}

/**
 * Query to get details for a specific location.
 */
export function useGetLocationDetails(locationId: string) {
    return useQuery<Location | undefined>(`location-${locationId}`, async () => {
        return mockLocations.find((loc) => loc.id === locationId);
    });
}

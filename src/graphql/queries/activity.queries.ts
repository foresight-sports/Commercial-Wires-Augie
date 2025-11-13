import { useQuery } from "../hooks/useQuery";
import { mockBays, mockBookings } from "../mocks/activity.mock";
import type { Bay, Booking } from "../types/activity.types";

/**
 * Query to get the current status of all bays for a location.
 * In production, this would be a GraphQL query like:
 * query GetBayStatus($locationId: ID!) { bays(locationId: $locationId) { ...BayFields } }
 */
export function useGetBayStatus(locationId: string) {
    return useQuery<Bay[]>(`bay-status-${locationId}`, async () => {
        return mockBays.filter((bay) => bay.locationId === locationId);
    });
}

/**
 * Query to get today's schedule of bookings for a location.
 * Includes polling to keep the data fresh.
 */
export function useGetTodaySchedule(locationId: string, date: Date) {
    return useQuery<Booking[]>(
        `today-schedule-${locationId}-${date.toISOString()}`,
        async () => {
            return mockBookings.filter((booking) => {
                const bookingDate = new Date(booking.startTime);
                return booking.bay && booking.bay.locationId === locationId && bookingDate.toDateString() === date.toDateString();
            });
        },
        {
            pollInterval: 30000, // Refresh every 30 seconds
        },
    );
}

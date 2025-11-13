# Mock Data Strategy

## Overview

This document outlines the approach for creating realistic mock data that will eventually be replaced by GraphQL queries from a live API. The mock data structure mirrors the expected GraphQL schema to minimize refactoring when integrating with the backend.

## Principles

1. **GraphQL-First**: Structure all mock data as if it's coming from GraphQL responses
2. **Type Safety**: Use TypeScript interfaces matching GraphQL types
3. **Realistic Data**: Use actual business scenarios, not "Test User 1"
4. **Edge Cases**: Include empty states, errors, boundary conditions
5. **Easy Swap**: Mock hooks should have identical APIs to real GraphQL hooks

## Mock Data Architecture

### Directory Structure

```
src/graphql/
├── types/
│   ├── activity.types.ts      # Bay, Booking, etc.
│   ├── reporting.types.ts     # Reports, Metrics, etc.
│   ├── locations.types.ts     # Location, Device, etc.
│   └── common.types.ts        # Shared types (User, Account, etc.)
├── mocks/
│   ├── activity.mock.ts
│   ├── reporting.mock.ts
│   ├── locations.mock.ts
│   └── users.mock.ts
├── hooks/
│   ├── useQuery.ts            # Mock useQuery hook
│   ├── useMutation.ts         # Mock useMutation hook
│   └── useSubscription.ts     # Mock useSubscription hook (future)
└── queries/
    ├── activity.queries.ts    # Query definitions (ready for real GraphQL)
    ├── reporting.queries.ts
    └── locations.queries.ts
```

## Type Definitions

### Core Types Example

```typescript
// src/graphql/types/common.types.ts

export type UserRole = "OWNER" | "MANAGER" | "STAFF";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    createdAt: string;
    lastLoginAt?: string;
}

export interface Account {
    id: string;
    name: string;
    owner: User;
    team: User[];
    locations: Location[];
    createdAt: string;
}

export interface Location {
    id: string;
    name: string;
    address: Address;
    timezone: string;
    bays: Bay[];
    contactEmail?: string;
    contactPhone?: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
```

### Activity Domain Types

```typescript
// src/graphql/types/activity.types.ts

export type BayStatus = "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "OFFLINE";
export type DeviceStatus = "OPERATIONAL" | "WARNING" | "ERROR" | "OFFLINE";
export type BookingStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
export type BookingSource = "WALK_IN" | "ONLINE" | "PHONE" | "RECURRING";
export type DeviceType = "LAUNCH_MONITOR" | "PROJECTOR" | "SENSOR" | "COMPUTER";

export interface Bay {
    id: string;
    name: string;
    number: number;
    locationId: string;
    status: BayStatus;
    devices: Device[];
    currentBooking?: Booking;
    nextBooking?: Booking;
    maintenanceNotes?: string;
}

export interface Device {
    id: string;
    type: DeviceType;
    manufacturer: string;
    model: string;
    serialNumber: string;
    firmwareVersion?: string;
    bayId?: string;
    status: DeviceStatus;
    lastCalibration?: string;
}

export interface Booking {
    id: string;
    bayId: string;
    bay?: Bay;
    customer?: Customer;
    startTime: string; // ISO 8601
    endTime: string; // ISO 8601
    status: BookingStatus;
    source: BookingSource;
    notes?: string;
    totalPrice: Money;
    createdBy: User;
    createdAt: string;
}

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    accountId: string;
    totalSpent: Money;
    lifetimeVisits: number;
    createdAt: string;
}

export interface Money {
    amount: number;
    currency: string; // ISO 4217 (USD, EUR, etc.)
}
```

### Reporting Domain Types

```typescript
// src/graphql/types/reporting.types.ts

export interface RevenueMetrics {
    totalRevenue: Money;
    bookingCount: number;
    averageBookingValue: Money;
    bayUtilization: number; // 0-100
    revenueByDay: RevenueByPeriod[];
    revenueByBay: RevenueByBay[];
}

export interface RevenueByPeriod {
    date: string; // ISO 8601 date
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
    hour: number; // 0-23
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
```

## Mock Data Generators

### Realistic Mock Data

```typescript
// src/graphql/mocks/activity.mock.ts
import type { Bay, Booking, Customer } from "../types/activity.types";

export const mockCustomers: Customer[] = [
    {
        id: "cust-001",
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@email.com",
        phone: "+1-555-0123",
        accountId: "acc-001",
        totalSpent: { amount: 2450.0, currency: "USD" },
        lifetimeVisits: 34,
        createdAt: "2024-01-15T08:00:00Z",
    },
    {
        id: "cust-002",
        firstName: "Sarah",
        lastName: "Thompson",
        email: "sarah.t@email.com",
        phone: "+1-555-0124",
        accountId: "acc-001",
        totalSpent: { amount: 1850.0, currency: "USD" },
        lifetimeVisits: 22,
        createdAt: "2024-02-08T10:30:00Z",
    },
    // ... more realistic customers
];

export const mockBays: Bay[] = [
    {
        id: "bay-001",
        name: "Bay 1",
        number: 1,
        locationId: "loc-001",
        status: "IN_USE",
        devices: [
            {
                id: "dev-001",
                type: "LAUNCH_MONITOR",
                manufacturer: "Foresight Sports",
                model: "GCQuad",
                serialNumber: "GCQ-2024-001",
                firmwareVersion: "2.5.1",
                bayId: "bay-001",
                status: "OPERATIONAL",
                lastCalibration: "2024-10-15T09:00:00Z",
            },
            {
                id: "dev-002",
                type: "PROJECTOR",
                manufacturer: "Epson",
                model: "LS12000",
                serialNumber: "EP-LS12-4567",
                bayId: "bay-001",
                status: "OPERATIONAL",
            },
        ],
        currentBooking: {
            id: "book-001",
            bayId: "bay-001",
            customer: mockCustomers[0],
            startTime: "2024-10-23T14:00:00Z",
            endTime: "2024-10-23T15:30:00Z",
            status: "IN_PROGRESS",
            source: "WALK_IN",
            totalPrice: { amount: 85.0, currency: "USD" },
            createdBy: mockUsers[1], // Staff member
            createdAt: "2024-10-23T13:55:00Z",
        },
        nextBooking: {
            id: "book-002",
            bayId: "bay-001",
            customer: mockCustomers[1],
            startTime: "2024-10-23T16:00:00Z",
            endTime: "2024-10-23T17:00:00Z",
            status: "SCHEDULED",
            source: "ONLINE",
            totalPrice: { amount: 60.0, currency: "USD" },
            createdBy: mockUsers[1],
            createdAt: "2024-10-22T19:30:00Z",
        },
    },
    {
        id: "bay-002",
        name: "Bay 2",
        number: 2,
        locationId: "loc-001",
        status: "AVAILABLE",
        devices: [
            {
                id: "dev-003",
                type: "LAUNCH_MONITOR",
                manufacturer: "Foresight Sports",
                model: "GC3",
                serialNumber: "GC3-2023-089",
                firmwareVersion: "2.4.8",
                bayId: "bay-002",
                status: "OPERATIONAL",
                lastCalibration: "2024-10-20T11:00:00Z",
            },
        ],
    },
    {
        id: "bay-003",
        name: "Bay 3 - Premium",
        number: 3,
        locationId: "loc-001",
        status: "MAINTENANCE",
        maintenanceNotes: "Projector bulb replacement scheduled for 2PM",
        devices: [
            {
                id: "dev-005",
                type: "LAUNCH_MONITOR",
                manufacturer: "Foresight Sports",
                model: "GCQuad",
                serialNumber: "GCQ-2024-002",
                firmwareVersion: "2.5.1",
                bayId: "bay-003",
                status: "OPERATIONAL",
                lastCalibration: "2024-10-18T10:00:00Z",
            },
            {
                id: "dev-006",
                type: "PROJECTOR",
                manufacturer: "Epson",
                model: "LS12000",
                serialNumber: "EP-LS12-4568",
                bayId: "bay-003",
                status: "ERROR",
            },
        ],
    },
    // ... more bays
];

// Export functions for dynamic data generation
export const generateMockBookingsForDate = (date: Date, locationId: string): Booking[] => {
    // Generate realistic booking patterns based on the date
    // More bookings on weekends, peak hours in evening, etc.
    return [];
};
```

## Mock Query Hooks

### Generic useQuery Hook

```typescript
// src/graphql/hooks/useQuery.ts
import { useEffect, useState } from "react";

interface QueryResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

interface QueryOptions {
    skip?: boolean;
    pollInterval?: number;
}

export function useQuery<T>(queryKey: string, fetcher: () => Promise<T>, options: QueryOptions = {}): QueryResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!options.skip);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        if (options.skip) return;

        setLoading(true);
        setError(null);

        try {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));

            const result = await fetcher();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Polling support
        if (options.pollInterval) {
            const interval = setInterval(fetchData, options.pollInterval);
            return () => clearInterval(interval);
        }
    }, [queryKey, options.skip, options.pollInterval]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}
```

### Domain-Specific Query Hooks

```typescript
// src/graphql/queries/activity.queries.ts
import { useQuery } from "../hooks/useQuery";
import { mockBays, mockBookings } from "../mocks/activity.mock";
import type { Bay, Booking } from "../types/activity.types";

export function useGetBayStatus(locationId: string) {
    return useQuery<Bay[]>(`bay-status-${locationId}`, async () => {
        // Filter bays by location
        return mockBays.filter((bay) => bay.locationId === locationId);
    });
}

export function useGetTodaySchedule(locationId: string, date: Date) {
    return useQuery<Booking[]>(
        `today-schedule-${locationId}-${date.toISOString()}`,
        async () => {
            // Return bookings for the given date and location
            return mockBookings.filter((booking) => {
                const bookingDate = new Date(booking.startTime);
                return booking.bay?.locationId === locationId && bookingDate.toDateString() === date.toDateString();
            });
        },
        {
            pollInterval: 30000, // Refresh every 30 seconds
        },
    );
}
```

### Mock Mutation Hook

```typescript
// src/graphql/hooks/useMutation.ts
import { useState } from "react";

interface MutationResult<T, V> {
    mutate: (variables: V) => Promise<T>;
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export function useMutation<T, V>(mutationFn: (variables: V) => Promise<T>): MutationResult<T, V> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = async (variables: V): Promise<T> => {
        setLoading(true);
        setError(null);

        try {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 200));

            const result = await mutationFn(variables);
            setData(result);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown error");
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { mutate, data, loading, error };
}
```

### Example Mutations

```typescript
// src/graphql/queries/activity.queries.ts (continued)
import { useMutation } from "../hooks/useMutation";

interface CreateBookingInput {
    bayId: string;
    customerId?: string;
    startTime: string;
    endTime: string;
    source: BookingSource;
    notes?: string;
}

export function useCreateBooking() {
    return useMutation<Booking, CreateBookingInput>(async (input) => {
        // Simulate creating a booking
        const newBooking: Booking = {
            id: `book-${Date.now()}`,
            bayId: input.bayId,
            startTime: input.startTime,
            endTime: input.endTime,
            status: "SCHEDULED",
            source: input.source,
            notes: input.notes,
            totalPrice: { amount: 60.0, currency: "USD" }, // Calculate in real app
            createdBy: mockUsers[1], // Current user in real app
            createdAt: new Date().toISOString(),
        };

        // In real app, this would trigger a GraphQL mutation
        // For now, we just return the mock booking
        return newBooking;
    });
}

interface UpdateBayStatusInput {
    bayId: string;
    status: BayStatus;
    notes?: string;
}

export function useUpdateBayStatus() {
    return useMutation<Bay, UpdateBayStatusInput>(async (input) => {
        // Find the bay and update it
        const bay = mockBays.find((b) => b.id === input.bayId);
        if (!bay) throw new Error("Bay not found");

        return {
            ...bay,
            status: input.status,
            maintenanceNotes: input.notes,
        };
    });
}
```

## Transition Strategy

When moving from mocks to real GraphQL:

1. **Install GraphQL client** (Apollo Client, URQL, etc.)
2. **Replace mock hooks** with real GraphQL hooks (same API)
3. **Keep types identical** (or generate from GraphQL schema)
4. **Update imports** in components (single line change)
5. **Test incrementally** (can run mocks and real API side-by-side)

### Example Transition

**Before (Mock)**:

```typescript
import { useGetBayStatus } from "@/graphql/queries/activity.queries";
```

**After (Real GraphQL)**:

```typescript
import { useGetBayStatus } from "@/graphql/queries/activity.queries";

// Same import!
// But now the hook uses real GraphQL instead of mocks
```

The implementation changes, but component code stays the same.

## Testing with Mock Data

### Benefits

1. **No backend dependency**: Frontend development proceeds independently
2. **Consistent test data**: Automated tests use same mocks
3. **Edge case coverage**: Easy to test error states, empty states, etc.
4. **Performance**: Instant responses during development

### Mock Data Variations

Create multiple versions for different scenarios:

```typescript
// src/graphql/mocks/scenarios.ts
import type { Bay } from "../types/activity.types";

export const scenarios = {
    allBaysAvailable: (): Bay[] => {
        return mockBays.map((bay) => ({ ...bay, status: "AVAILABLE" }));
    },

    allBaysBusy: (): Bay[] => {
        return mockBays.map((bay) => ({ ...bay, status: "IN_USE" }));
    },

    mixedStatuses: (): Bay[] => {
        return mockBays; // Default realistic mix
    },

    maintenanceAlert: (): Bay[] => {
        return mockBays.map((bay, i) => (i === 2 ? { ...bay, status: "MAINTENANCE", maintenanceNotes: "Urgent repair needed" } : bay));
    },
};
```

## Data Seeding for Development

Create a development-only route to switch between scenarios:

```typescript
// src/pages/dev-tools.tsx (only in development)

export const DevTools = () => {
  const [scenario, setScenario] = useState('mixedStatuses');

  return (
    <div className="p-8">
      <h1>Development Tools</h1>
      <select value={scenario} onChange={e => setScenario(e.target.value)}>
        <option value="mixedStatuses">Mixed Statuses</option>
        <option value="allBaysAvailable">All Available</option>
        <option value="allBaysBusy">All Busy</option>
        <option value="maintenanceAlert">Maintenance Alert</option>
      </select>
    </div>
  );
};
```

---

This strategy ensures smooth development now and seamless transition to production later.

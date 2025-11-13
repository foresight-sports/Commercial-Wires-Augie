import type { ActivityLog } from "../types/activity-log.types";
import { mockBays, mockBookings, mockCustomers } from "./activity.mock";
import { mockUsers } from "./users.mock";

export const mockActivityLogs: ActivityLog[] = [
    {
        id: "activity-001",
        type: "BOOKING_CHECKED_IN",
        timestamp: "2024-10-23T14:00:00Z",
        booking: mockBookings[0],
        customer: mockCustomers[0],
        performedBy: mockUsers[2], // Staff
    },
    {
        id: "activity-002",
        type: "BOOKING_CREATED",
        timestamp: "2024-10-23T13:55:00Z",
        booking: mockBookings[0],
        customer: mockCustomers[0],
        performedBy: mockUsers[2], // Staff
        notes: "Walk-in customer",
    },
    {
        id: "activity-003",
        type: "BOOKING_CHECKED_IN",
        timestamp: "2024-10-23T13:30:00Z",
        booking: mockBookings[2],
        customer: mockCustomers[2],
        performedBy: mockUsers[2], // Staff
    },
    {
        id: "activity-004",
        type: "BOOKING_CREATED",
        timestamp: "2024-10-23T10:20:00Z",
        booking: mockBookings[2],
        customer: mockCustomers[2],
        performedBy: mockUsers[1], // Manager
        notes: "Phone booking",
    },
    {
        id: "activity-005",
        type: "BOOKING_COMPLETED",
        timestamp: "2024-10-23T10:00:00Z",
        booking: {
            id: "book-past-001",
            bayId: "bay-002",
            customer: mockCustomers[3],
            startTime: "2024-10-23T08:00:00Z",
            endTime: "2024-10-23T10:00:00Z",
            status: "COMPLETED",
            source: "ONLINE",
            totalPrice: { amount: 120.0, currency: "USD" },
            createdBy: mockUsers[1],
            createdAt: "2024-10-22T18:00:00Z",
        },
        customer: mockCustomers[3],
        performedBy: mockUsers[2],
    },
    {
        id: "activity-006",
        type: "BOOKING_CREATED",
        timestamp: "2024-10-22T21:15:00Z",
        booking: mockBookings[3],
        customer: mockCustomers[3],
        performedBy: mockCustomers[3] as any, // Online self-booking
        notes: "Online booking",
    },
    {
        id: "activity-007",
        type: "BOOKING_CREATED",
        timestamp: "2024-10-22T19:30:00Z",
        booking: mockBookings[1],
        customer: mockCustomers[1],
        performedBy: mockCustomers[1] as any, // Online self-booking
        notes: "Online booking",
    },
    {
        id: "activity-008",
        type: "BOOKING_CANCELLED",
        timestamp: "2024-10-22T16:45:00Z",
        booking: {
            id: "book-cancelled-001",
            bayId: "bay-005",
            customer: mockCustomers[1],
            startTime: "2024-10-23T12:00:00Z",
            endTime: "2024-10-23T13:30:00Z",
            status: "CANCELLED",
            source: "ONLINE",
            totalPrice: { amount: 90.0, currency: "USD" },
            createdBy: mockUsers[1],
            createdAt: "2024-10-21T14:00:00Z",
        },
        customer: mockCustomers[1],
        performedBy: mockUsers[2],
        notes: "Customer called to cancel",
    },
    {
        id: "activity-009",
        type: "BOOKING_COMPLETED",
        timestamp: "2024-10-22T15:00:00Z",
        booking: {
            id: "book-past-002",
            bayId: "bay-006",
            customer: mockCustomers[2],
            startTime: "2024-10-22T13:00:00Z",
            endTime: "2024-10-22T15:00:00Z",
            status: "COMPLETED",
            source: "RECURRING",
            totalPrice: { amount: 120.0, currency: "USD" },
            createdBy: mockUsers[1],
            createdAt: "2024-10-15T10:00:00Z",
        },
        customer: mockCustomers[2],
        performedBy: mockUsers[2],
    },
    {
        id: "activity-010",
        type: "BOOKING_CREATED",
        timestamp: "2024-10-16T14:00:00Z",
        booking: mockBookings[4],
        customer: mockCustomers[2],
        performedBy: mockUsers[1], // Manager - recurring booking setup
        notes: "Weekly recurring booking",
    },
];

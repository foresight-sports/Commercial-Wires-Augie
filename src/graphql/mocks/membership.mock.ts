import type { MembershipTier } from "../types/membership.types";

export const mockMembershipTiers: MembershipTier[] = [
    {
        id: "membership-001",
        planName: "Basic",
        initiationFee: 0,
        price: 99,
        lengthMonths: 1,
        status: "ACTIVE",
        availableLocationIds: ["loc-001", "loc-002", "loc-003"], // All Locations
        benefits: {
            freeSimulatorTime: {
                enabled: true,
                hoursPerMonth: 4,
            },
            discountStructure: {
                enabled: true,
                discountType: "PERCENTAGE_DISCOUNT",
                discountValue: 10,
            },
        },
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
    },
    {
        id: "membership-002",
        planName: "Premium",
        initiationFee: 250,
        price: 199,
        lengthMonths: 6,
        status: "ACTIVE",
        availableLocationIds: ["loc-001", "loc-002", "loc-003"], // All Locations
        benefits: {
            freeSimulatorTime: {
                enabled: true,
                hoursPerMonth: 10,
            },
            advanceBookingWindow: {
                enabled: true,
                daysInAdvance: 14,
            },
            freeLessons: {
                enabled: true,
                numberOfLessons: 2,
            },
            discountStructure: {
                enabled: true,
                discountType: "PERCENTAGE_DISCOUNT",
                discountValue: 15,
            },
        },
        createdAt: "2024-01-20T10:00:00Z",
        updatedAt: "2024-01-20T10:00:00Z",
    },
    {
        id: "membership-003",
        planName: "Elite",
        initiationFee: 500,
        price: 299,
        lengthMonths: 12,
        status: "ACTIVE",
        availableLocationIds: ["loc-001", "loc-003"], // Downtown Golf Club, Metro Golf Lounge
        benefits: {
            freeSimulatorTime: {
                enabled: true,
                hoursPerMonth: 20,
            },
            advanceBookingWindow: {
                enabled: true,
                daysInAdvance: 30,
            },
            freeLessons: {
                enabled: true,
                numberOfLessons: 6,
            },
            peakAccessRules: {
                enabled: true,
                accessType: "BOTH_PEAK_OFF_PEAK",
                guestRatePerHour: 25,
            },
            discountStructure: {
                enabled: true,
                discountType: "PERCENTAGE_DISCOUNT",
                discountValue: 20,
            },
            maxReservations: {
                enabled: true,
                maxActiveReservations: 4,
            },
            maxDailyUsage: {
                enabled: true,
                maxHoursPerDay: 2,
            },
        },
        createdAt: "2024-02-01T10:00:00Z",
        updatedAt: "2024-02-01T10:00:00Z",
    },
];


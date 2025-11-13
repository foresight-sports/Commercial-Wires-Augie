export type MembershipStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export type DiscountType = "FIXED_REDUCTION" | "FLAT_BOOKING_RATE" | "PERCENTAGE_DISCOUNT";

export type PeakAccessType = "PEAK_HOURS_ONLY" | "OFF_PEAK_HOURS_ONLY" | "BOTH_PEAK_OFF_PEAK";

export interface MembershipTier {
    id: string;
    planName: string;
    initiationFee: number;
    price: number;
    lengthMonths: number;
    status: MembershipStatus;
    availableLocationIds: string[];
    benefits: MembershipBenefits;
    createdAt: string;
    updatedAt: string;
}

export interface MembershipBenefits {
    // Free/Included Simulator Time
    freeSimulatorTime?: {
        enabled: boolean;
        hoursPerMonth: number;
    };
    // Advance Booking Window
    advanceBookingWindow?: {
        enabled: boolean;
        daysInAdvance: number;
    };
    // Free Lessons / Coaching
    freeLessons?: {
        enabled: boolean;
        numberOfLessons: number;
    };
    // Peak vs Off-Peak Access Rules
    peakAccessRules?: {
        enabled: boolean;
        accessType: PeakAccessType;
        guestRatePerHour?: number;
    };
    // Discount Structure
    discountStructure?: {
        enabled: boolean;
        discountType?: DiscountType;
        discountValue?: number; // Percentage or fixed amount
    };
    // Maximum Reservations or Time Booked
    maxReservations?: {
        enabled: boolean;
        maxActiveReservations: number;
    };
    // Maximum Daily Usage
    maxDailyUsage?: {
        enabled: boolean;
        maxHoursPerDay: number;
    };
}


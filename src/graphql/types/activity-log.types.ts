import type { Booking, Customer } from "./activity.types";
import type { User } from "./common.types";

export type ActivityType = "BOOKING_CREATED" | "BOOKING_CHECKED_IN" | "BOOKING_COMPLETED" | "BOOKING_CANCELLED";

export interface ActivityLog {
    id: string;
    type: ActivityType;
    timestamp: string;
    booking: Booking;
    customer?: Customer;
    performedBy: User;
    notes?: string;
}

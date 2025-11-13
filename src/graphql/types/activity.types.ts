import type { Money, User } from "./common.types";

export type BayStatus = "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "OFFLINE";
export type DeviceStatus = "OPERATIONAL" | "WARNING" | "ERROR" | "OFFLINE";
export type BookingStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
export type BookingSource = "WALK_IN" | "ONLINE" | "PHONE" | "RECURRING";
export type DeviceType = "LAUNCH_MONITOR" | "PROJECTOR" | "SENSOR" | "COMPUTER";

export type SimulatorType = "FORESIGHT" | "OTHER";

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
    simulatorType?: SimulatorType;
    simulatorTypeOther?: string; // If simulatorType is "OTHER", this contains the actual type
    maxPlayersPerReservation?: number;
    notes?: string;
    isOperational?: boolean;
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
    startTime: string;
    endTime: string;
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

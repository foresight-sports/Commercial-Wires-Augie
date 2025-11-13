export type UserRole = "OWNER" | "MANAGER" | "STAFF" | "COACH";

export type StaffStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export type LocationStatus = "ACTIVE" | "INACTIVE";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    createdAt: string;
    lastLoginAt?: string;
    phone?: string;
    assignedLocationId?: string;
    status?: StaffStatus;
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
    bayCount: number;
    activeDeviceCount: number;
    contactEmail?: string;
    contactPhone?: string;
    status?: LocationStatus;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface Money {
    amount: number;
    currency: string;
}

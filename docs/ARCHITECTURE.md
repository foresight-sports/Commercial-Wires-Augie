# Architecture Documentation

## Application Overview

**Foresight Sports Bay Management System** is a B2B web application designed for golf simulator facilities to manage their operations, including bay status, bookings, scheduling, customer management, and business analytics.

## Core Domains

### 1. Activity

The operational hub for day-to-day facility management.

**Features:**

- **Bay Status Dashboard**: Real-time view of all simulator bays
    - Current status (Available, In Use, Maintenance, Offline)
    - Active booking information
    - Device health indicators
    - Quick actions (mark maintenance, extend booking, etc.)
- **Live Calendar**: Today's schedule and upcoming bookings
    - Timeline view by bay
    - Drag-and-drop rescheduling (future)
    - Walk-in booking creation
    - Booking conflicts and warnings

**User Stories:**

- As Staff, I need to see which bays are available right now
- As Manager, I need to quickly create a walk-in booking
- As Staff, I need to mark a bay as needing maintenance

### 2. Reporting

Business intelligence and analytics for facility performance.

**Features:**

- **Overview Dashboard**: Key metrics at a glance
    - Revenue (daily, weekly, monthly)
    - Bay utilization rates
    - Peak hours analysis
    - Customer acquisition and retention
- **Detailed Reports**: Deep-dive analytics
    - Revenue by bay, time period, customer type
    - Booking patterns and trends
    - Customer lifetime value
    - Maintenance costs and downtime
- **Export Capabilities**: PDF and CSV downloads

**User Stories:**

- As Owner, I need to see monthly revenue trends
- As Manager, I need to identify peak booking hours to optimize staffing
- As Owner, I need to compare performance across multiple locations

### 3. Locations

Configuration and management of physical facilities and equipment.

**Features:**

- **Facility Management**: Business location settings
    - Address, hours of operation, contact info
    - Timezone and locale settings
    - Facility images and descriptions
- **Bay Configuration**: Individual simulator bay setup
    - Bay naming and numbering
    - Device assignments (launch monitor, projector, sensors)
    - Pricing tiers and rules
    - Maintenance schedule
- **Equipment Inventory**: Hardware tracking
    - Launch monitor models and serial numbers
    - Firmware versions
    - Calibration dates
    - Service history

**User Stories:**

- As Owner, I need to add a new location to the system
- As Manager, I need to assign a replacement launch monitor to Bay 3
- As Owner, I need to set different pricing for premium bays

## Data Model (GraphQL Schema - Draft)

### Core Types

```graphql
type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    account: Account!
    avatar: String
    createdAt: DateTime!
    lastLoginAt: DateTime
}

enum UserRole {
    OWNER
    MANAGER
    STAFF
}

type Account {
    id: ID!
    name: String!
    locations: [Location!]!
    owner: User!
    team: [User!]!
    subscription: Subscription
    createdAt: DateTime!
}

type Location {
    id: ID!
    name: String!
    address: Address!
    timezone: String!
    bays: [Bay!]!
    operatingHours: OperatingHours!
    contactEmail: String
    contactPhone: String
}

type Bay {
    id: ID!
    name: String!
    number: Int!
    location: Location!
    status: BayStatus!
    devices: [Device!]!
    currentBooking: Booking
    nextBooking: Booking
    maintenanceNotes: String
}

enum BayStatus {
    AVAILABLE
    IN_USE
    MAINTENANCE
    OFFLINE
}

type Device {
    id: ID!
    type: DeviceType!
    manufacturer: String!
    model: String!
    serialNumber: String!
    firmwareVersion: String
    bay: Bay
    status: DeviceStatus!
    lastCalibration: DateTime
}

enum DeviceType {
    LAUNCH_MONITOR
    PROJECTOR
    SENSOR
    COMPUTER
}

enum DeviceStatus {
    OPERATIONAL
    WARNING
    ERROR
    OFFLINE
}

type Booking {
    id: ID!
    bay: Bay!
    customer: Customer
    startTime: DateTime!
    endTime: DateTime!
    status: BookingStatus!
    source: BookingSource!
    notes: String
    totalPrice: Money!
    createdBy: User!
}

enum BookingStatus {
    SCHEDULED
    IN_PROGRESS
    COMPLETED
    CANCELLED
    NO_SHOW
}

enum BookingSource {
    WALK_IN
    ONLINE
    PHONE
    RECURRING
}

type Customer {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String
    account: Account!
    bookings: [Booking!]!
    totalSpent: Money!
    lifetimeVisits: Int!
    createdAt: DateTime!
}

type Money {
    amount: Float!
    currency: String!
}
```

### Key Queries

```graphql
# Activity Domain
query GetBayStatus($locationId: ID!, $timestamp: DateTime) {
    bays(locationId: $locationId) {
        id
        name
        status
        currentBooking {
            ...BookingDetail
        }
        nextBooking {
            ...BookingDetail
        }
        devices {
            ...DeviceHealth
        }
    }
}

query GetTodaySchedule($locationId: ID!, $date: Date!) {
    bookings(locationId: $locationId, date: $date) {
        ...BookingDetail
    }
}

# Reporting Domain
query GetRevenueMetrics($locationId: ID, $startDate: Date!, $endDate: Date!) {
    revenueReport(locationId: $locationId, startDate: $startDate, endDate: $endDate) {
        totalRevenue
        bookingCount
        averageBookingValue
        bayUtilization
        revenueByDay {
            date
            amount
        }
        revenueByBay {
            bayName
            amount
        }
    }
}

# Locations Domain
query GetLocationDetails($locationId: ID!) {
    location(id: $locationId) {
        id
        name
        address {
            ...AddressFields
        }
        bays {
            ...BayConfiguration
        }
    }
}
```

### Key Mutations

```graphql
mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
        booking {
            ...BookingDetail
        }
        errors {
            field
            message
        }
    }
}

mutation UpdateBayStatus($bayId: ID!, $status: BayStatus!, $notes: String) {
    updateBayStatus(bayId: $bayId, status: $status, notes: $notes) {
        bay {
            ...BayDetail
        }
    }
}

mutation ConfigureBay($bayId: ID!, $input: BayConfigInput!) {
    configureBay(bayId: $bayId, input: $input) {
        bay {
            ...BayDetail
        }
    }
}
```

## Component Architecture

### Layout Hierarchy

```
App
├── AuthLayout (login, create account)
│   └── LoginPage
│   └── CreateAccountPage
└── AppLayout (authenticated routes)
    ├── SidebarNavigation
    ├── HeaderNavigation
    └── Routes
        ├── ActivityPage
        │   ├── BayStatusGrid
        │   └── TodaySchedule
        ├── ReportingPage
        │   ├── MetricsOverview
        │   └── DetailedReports
        └── LocationsPage
            ├── LocationList
            ├── BayConfiguration
            └── DeviceInventory
```

### Shared Components (Domain-Specific)

**Activity Components:**

- `BayStatusCard`: Individual bay status display
- `BookingCard`: Booking summary card
- `QuickActionButton`: Common bay actions
- `BayTimeline`: Visual timeline of bay schedule

**Reporting Components:**

- `MetricCard`: KPI display card
- `RevenueChart`: Line/bar charts for revenue data
- `UtilizationHeatmap`: Bay usage heatmap
- `ReportExportButton`: Export functionality

**Location Components:**

- `LocationCard`: Location summary
- `BayConfigForm`: Bay settings form
- `DeviceStatusIndicator`: Device health badge
- `OperatingHoursEditor`: Hours of operation editor

## State Management Strategy

### Authentication & User Context

```tsx
interface AuthContext {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
}
```

### Current Location Context

```tsx
interface LocationContext {
    currentLocation: Location | null;
    availableLocations: Location[];
    setCurrentLocation: (locationId: string) => void;
}
```

### Real-Time Data (Future)

- WebSocket connection for live bay status updates
- GraphQL subscriptions for booking changes
- Optimistic UI updates for mutations

## Internationalization Strategy

### Translation Namespace Structure

```
i18n/
├── en/
│   ├── common.json          # Shared across app
│   ├── auth.json            # Login, registration
│   ├── activity.json        # Activity domain
│   ├── reporting.json       # Reporting domain
│   ├── locations.json       # Locations domain
│   └── validation.json      # Form validation messages
├── es/
├── fr/
└── de/
```

### Translation Key Patterns

```json
{
    "activity": {
        "bayStatus": {
            "title": "Bay Status",
            "available": "Available",
            "inUse": "In Use",
            "maintenance": "Maintenance Required",
            "actions": {
                "viewDetails": "View Details",
                "createBooking": "Create Booking",
                "markMaintenance": "Mark for Maintenance"
            }
        }
    }
}
```

### Locale-Specific Formatting

- **Dates/Times**: Use `Intl.DateTimeFormat` with user's timezone
- **Currency**: Use `Intl.NumberFormat` with location's currency
- **Measurements**: Support imperial/metric based on locale

## Routing Structure

```
/                           → Redirect to /activity or /login
/login                      → Login page
/create-account             → Account creation flow
/forgot-password            → Password reset

/activity                   → Activity dashboard (default landing)
/activity/bay/:bayId        → Bay detail slideout/modal

/reporting                  → Reporting dashboard
/reporting/revenue          → Revenue details
/reporting/utilization      → Utilization details
/reporting/customers        → Customer analytics

/locations                  → Locations list
/locations/:locationId      → Location detail
/locations/:locationId/bays → Bay configuration
/locations/:locationId/devices → Device inventory

/profile                    → User profile
/account                    → Account settings
/team                       → Team management
/billing                    → Billing (Owner only)
```

## Security Considerations

### Role-Based Access

- Route guards check user role before rendering
- API requests include role validation
- UI elements conditionally render based on permissions

### Data Privacy

- Users only access data from their own account
- Location-scoped queries enforce access control
- Sensitive fields (billing, team emails) restricted by role

## Performance Optimization

### Code Splitting

```tsx
const ActivityPage = lazy(() => import("@/pages/activity-page"));
const ReportingPage = lazy(() => import("@/pages/reporting-page"));
const LocationsPage = lazy(() => import("@/pages/locations-page"));
```

### Data Fetching

- Prefetch next route's data on hover
- Cache GraphQL responses with appropriate TTL
- Implement pagination for large lists (bookings, customers)

### Bundle Size

- Tree-shake unused Untitled UI components
- Lazy-load heavy dependencies (charts, date pickers)
- Use dynamic imports for modals and slideovers

## Testing Strategy (Future)

### Unit Tests

- Pure functions and utilities (100% coverage)
- Custom hooks
- GraphQL query/mutation logic

### Integration Tests

- Component interactions
- Form submissions and validation
- Role-based rendering

### E2E Tests (Critical Paths)

- Login and authentication flow
- Create booking flow
- Generate and export report

## Deployment Considerations

### Environment Variables

```
VITE_API_URL=https://api.foresight.example.com/graphql
VITE_WS_URL=wss://api.foresight.example.com/graphql
VITE_SENTRY_DSN=...
```

### Build Optimization

- Vite production build with tree-shaking
- Minification and compression
- CDN for static assets

### Monitoring

- Error tracking (Sentry or similar)
- Analytics (PostHog, Mixpanel)
- Performance monitoring (Web Vitals)

---

This architecture is designed to scale from a single-location business to a multi-location enterprise operation.

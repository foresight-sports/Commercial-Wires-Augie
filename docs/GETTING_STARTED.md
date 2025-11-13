# Getting Started

## What We've Built

This is a comprehensive wireframe/prototype for the **Foresight Sports Bay Management Application**, built with production-quality code that's ready to evolve into the final product.

### Current Status ✅

The application is fully scaffolded with three main sections:

1. **Activity** - Real-time bay status dashboard
2. **Reporting** - Business analytics and insights
3. **Locations** - Facility and equipment management

## Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## What's Implemented

### ✅ Core Infrastructure

- **TypeScript Types**: Complete type definitions for all domains (Activity, Reporting, Locations)
- **Mock GraphQL Layer**: Hooks that simulate real GraphQL queries/mutations
- **i18n Structure**: Translation files and helper functions ready for react-i18next
- **Utility Functions**: Formatters for dates, times, currency, percentages
- **Navigation**: Sidebar navigation with three main sections
- **Layout System**: AppLayout wrapper for authenticated pages

### ✅ Activity Page (`/activity`)

**Features:**

- Real-time bay status grid
- Bay status cards showing:
    - Current booking information
    - Next booking preview
    - Device status indicators
    - Maintenance notes (when applicable)
- Status badges (Available, In Use, Maintenance, Offline)
- Device issue warnings
- Refresh functionality
- Loading and error states

**Mock Data:**

- 6 bays with realistic statuses
- 4 customers with booking history
- 18 devices across all bays
- Current and upcoming bookings

### ✅ Reporting Page (`/reporting`)

**Features:**

- Key metrics overview:
    - Total Revenue
    - Total Bookings
    - Bay Utilization
    - Average Booking Value
- Revenue by Bay table
- Trend indicators (up/down arrows)
- Last 7 days data view

**Mock Data:**

- 7 days of revenue data
- Per-bay performance metrics
- Utilization rates

### ✅ Locations Page (`/locations`)

**Features:**

- Location cards with:
    - Address information
    - Bay count
    - Active device count
    - Contact information
- Add location button (placeholder)
- Empty state

**Mock Data:**

- 1 sample location (Pine Hills Golf Center)

## Project Structure

```
src/
├── components/
│   ├── base/              # Untitled UI base components
│   ├── application/       # Untitled UI application components
│   ├── foundations/       # Icons, logos, patterns
│   └── domain/            # Custom business logic components
│       ├── activity/      # Bay status cards
│       ├── reporting/     # Metric cards
│       └── locations/     # Location cards
├── pages/                 # Route-level pages
│   ├── activity-page.tsx
│   ├── reporting-page.tsx
│   └── locations-page.tsx
├── layouts/               # Layout wrappers
│   └── app-layout.tsx     # Main app layout with sidebar
├── graphql/               # GraphQL layer
│   ├── types/             # TypeScript type definitions
│   ├── mocks/             # Mock data
│   ├── hooks/             # Mock query/mutation hooks
│   └── queries/           # Query definitions
├── i18n/                  # Internationalization
│   ├── locales/en/        # English translations
│   └── translations.ts    # Translation helper
├── utils/                 # Utility functions
│   ├── formatters.ts      # Date/currency/number formatting
│   └── cx.ts              # Class name utility
└── config/                # App configuration
    └── navigation.ts      # Navigation structure
```

## Key Technologies

- **React 19.1** - Latest React with new features
- **TypeScript 5.9** - Full type safety
- **Tailwind CSS v4.1** - Utility-first styling
- **Untitled UI React** - Production-ready component library
- **React Aria** - Accessibility primitives
- **React Router v7** - Client-side routing
- **Vite 7.1** - Lightning-fast build tool

## Mock Data Strategy

All data is currently mocked to simulate a real GraphQL API:

- **useQuery** hook simulates GraphQL queries with network delays
- **useMutation** hook simulates GraphQL mutations
- Easy swap: When ready, replace mock hooks with Apollo Client or URQL
- Component code stays the same when switching to real API

## Next Steps

### Immediate Enhancements

1. **Activity Page**
    - Add today's schedule table
    - Implement "Create Booking" modal
    - Add bay detail slideout
    - Time-based filtering

2. **Reporting Page**
    - Add date range picker
    - Revenue trend chart (use recharts or similar)
    - Utilization heatmap
    - Export functionality (PDF, CSV)

3. **Locations Page**
    - Location detail view
    - Bay configuration tab
    - Device inventory table
    - Add/edit location forms

### Additional Features

4. **Authentication**
    - Login page
    - Account creation flow
    - Role-based access control (Owner, Manager, Staff)

5. **User Profile**
    - Profile dropdown menu
    - Account settings page
    - Team management
    - Billing (Owner only)

6. **Enhanced Functionality**
    - Real-time updates (WebSocket)
    - Booking management (CRUD)
    - Customer management
    - Maintenance tracking
    - Notifications

### Production Readiness

7. **Replace Mocks with Real API**
    - Integrate GraphQL client (Apollo/URQL)
    - Connect to backend API
    - Handle authentication tokens
    - Error handling and retry logic

8. **Implement Full i18n**
    - Install react-i18next
    - Add additional languages
    - Locale-based formatting

9. **Testing**
    - Unit tests (Vitest)
    - Component tests (React Testing Library)
    - E2E tests (Playwright)

10. **Performance**
    - Code splitting
    - Image optimization
    - Bundle analysis
    - Caching strategies

## Design System

All components follow the **Untitled UI** design system:

- Consistent spacing and typography
- Semantic color tokens
- Accessible by default (WCAG 2.1 AA)
- Responsive (mobile-first)
- Dark mode ready

### Color Semantics

- `success` (green) - Available bays, operational devices
- `warning` (yellow) - Warnings, maintenance needed
- `error` (red) - Errors, offline devices
- `brand` - Primary actions, in-use status
- `gray` - Neutral tones

### Component Patterns

- **Cards** - Primary content containers
- **Badges** - Status indicators
- **Buttons** - Actions and navigation
- **Tables** - Data display
- **Empty States** - Helpful guidance when no data
- **Loading States** - Skeleton loaders and spinners

## Adding New Untitled UI Components

```bash
npx untitledui@latest add [component-name]
```

Browse available components at [untitledui.com/react](https://www.untitledui.com/react)

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and data models
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - UI/UX guidelines and patterns
- **[MOCK_DATA_STRATEGY.md](./MOCK_DATA_STRATEGY.md)** - Data layer approach
- **[I18N_STRATEGY.md](./I18N_STRATEGY.md)** - Internationalization plan
- **[.cursorrules](../.cursorrules)** - Development standards

## Development Workflow

1. **Create new pages**: Add to `src/pages/`
2. **Create domain components**: Add to `src/components/domain/[domain]/`
3. **Add routes**: Update `src/main.tsx`
4. **Add navigation items**: Update `src/config/navigation.ts`
5. **Create mock data**: Add to `src/graphql/mocks/`
6. **Create queries**: Add to `src/graphql/queries/`
7. **Add translations**: Update JSON files in `src/i18n/locales/en/`

## Tips for Success

### Keep it Clean

- Follow the established patterns
- Use TypeScript strictly
- No `any` types
- Meaningful component and variable names

### Think Production

- Write code you'd be proud to ship
- Add JSDoc comments to props
- Handle loading and error states
- Provide empty states

### Accessibility First

- Use semantic HTML
- Leverage React Aria components
- Provide ARIA labels
- Test keyboard navigation

### Performance Matters

- Use React.lazy() for code splitting
- Memoize expensive calculations
- Implement pagination for large lists
- Optimize images

## Questions?

Refer to the comprehensive documentation in the `docs/` folder or check:

- [Untitled UI React Docs](https://www.untitledui.com/react/docs)
- [React Router v7 Docs](https://reactrouter.com)
- [Tailwind CSS v4 Docs](https://tailwindcss.com)

---

**Remember**: This is not just a wireframe. This is the foundation of a production application.

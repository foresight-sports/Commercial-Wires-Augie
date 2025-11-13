# Design System Guidelines

## Overview

This application leverages **Untitled UI React** as its foundational design system, built on Tailwind CSS v4 and React Aria for accessibility. This document outlines how we extend and apply these components for the Foresight Sports Bay Management application.

## Brand Identity (To Be Customized)

### Color Palette

The Untitled UI theme system supports extensive customization through Tailwind CSS variables. For now, we use the default brand colors, but these should be replaced with Foresight Sports brand colors.

**Primary Brand Color** (Customizable):

- `brand-solid`: Main brand color for buttons, links, active states
- `brand-solid-hover`: Hover state

**Semantic Colors**:

- `success`: Green - Available bays, successful operations
- `warning`: Yellow - Warnings, maintenance required
- `error`: Red - Errors, offline bays, conflicts
- `gray`: Neutral tones for most UI elements

### Typography

Untitled UI uses a fluid typography scale that responds to viewport size.

**Font Stack**: System fonts for performance and native feel

```css
font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif;
```

**Scale**:

- `text-xs`: 12px - Captions, meta info
- `text-sm`: 14px - Body text, form fields
- `text-md`: 16px - Default body
- `text-lg`: 18px - Emphasis
- `text-xl`: 20px - Section headers
- `text-display-xs` through `text-display-2xl`: Page titles, hero sections

## Layout & Spacing

### Application Layout

**Desktop (≥1024px)**:

```
┌─────────────────────────────────────────────┐
│ Header Navigation (64px height)             │
├────────────┬────────────────────────────────┤
│            │                                │
│  Sidebar   │  Main Content Area             │
│  (280px)   │  (flexible)                    │
│            │                                │
│            │                                │
└────────────┴────────────────────────────────┘
```

**Mobile (<1024px)**:

- Hamburger menu reveals drawer navigation
- Header collapses to essential actions only
- Content takes full width

### Container Widths

- `max-w-container`: 1280px (global max-width for content)
- `max-w-page`: Use for page-level content areas
- Form widths: `max-w-md` (448px) for optimal readability

### Spacing Scale

Use Tailwind's default spacing scale consistently:

- `gap-2`: 8px - Tight groupings (form fields)
- `gap-4`: 16px - Standard component spacing
- `gap-6`: 24px - Section spacing
- `gap-8`: 32px - Major sections
- `gap-12`: 48px - Page-level divisions

## Component Patterns

### Bay Status Indicators

**Status Badge Colors**:

```tsx
const statusConfig = {
    AVAILABLE: { color: "success", label: "Available" },
    IN_USE: { color: "brand", label: "In Use" },
    MAINTENANCE: { color: "warning", label: "Maintenance" },
    OFFLINE: { color: "gray", label: "Offline" },
} as const;
```

**Usage**:

```tsx
<Badge color={statusConfig[bay.status].color} size="sm" type="modern">
    {statusConfig[bay.status].label}
</Badge>
```

### Device Health Indicators

```tsx
const deviceStatusConfig = {
    OPERATIONAL: { color: "success", icon: CheckCircle },
    WARNING: { color: "warning", icon: AlertTriangle },
    ERROR: { color: "error", icon: XCircle },
    OFFLINE: { color: "gray", icon: Minus },
} as const;
```

### Cards

**Standard Card Pattern**:

```tsx
<div className="border-secondary bg-primary rounded-lg border p-6 shadow-sm">{/* Card content */}</div>
```

**Interactive Card** (hover, clickable):

```tsx
<div className="border-secondary bg-primary cursor-pointer rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">{/* Card content */}</div>
```

### Data Tables

Use `<Table>` component from Untitled UI with these patterns:

**Features to Include**:

- Sortable columns
- Row selection for bulk actions
- Pagination (if >25 rows)
- Empty state with call-to-action
- Loading skeleton states

**Column Sizing**:

- Status columns: Fixed width (100-120px)
- Date/time columns: Fixed width (140-160px)
- Name/title columns: Flexible
- Action columns: Fixed right (80-100px)

### Forms

**Field Layout**:

```tsx
<div className="space-y-6">
    {" "}
    {/* Form container */}
    <div className="space-y-2">
        {" "}
        {/* Field group */}
        <Label>Field Label</Label>
        <Input />
        <HintText>Optional helper text</HintText>
    </div>
</div>
```

**Required Fields**:

- Use asterisk (\*) in label
- Clear error messages below field
- Error state styling from Untitled UI

**Form Actions**:

```tsx
<div className="border-secondary flex justify-end gap-3 border-t pt-6">
    <Button color="secondary">Cancel</Button>
    <Button color="primary" type="submit">
        Save Changes
    </Button>
</div>
```

### Modals vs. Slideovers

**Use Modals For**:

- Confirmations (delete, discard changes)
- Quick actions (create booking, mark maintenance)
- Small forms (2-4 fields)
- Max width: `max-w-lg`

**Use Slideovers For**:

- Detailed views (bay details, booking details)
- Multi-step flows
- Forms with 5+ fields
- Side-by-side comparison with main content

### Empty States

Always include:

1. Illustrative icon or image
2. Clear headline
3. Descriptive text
4. Primary action button (if applicable)

```tsx
<EmptyState
    icon={Calendar}
    title="No bookings scheduled"
    description="Create your first booking to get started"
    action={<Button iconLeading={Plus}>Create Booking</Button>}
/>
```

### Loading States

**Skeleton Loaders**: For predictable layouts

```tsx
<div className="animate-pulse">
    <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
    <div className="h-4 w-1/2 rounded bg-gray-200" />
</div>
```

**Spinner**: For actions and unpredictable waits

```tsx
<LoadingIndicator size="md" />
```

## Iconography

### Icon Library

Use `@untitledui/icons` (based on Lucide React) exclusively for consistency.

### Common Icons Mapping

**Navigation & Actions**:

- `Home01`: Dashboard/Activity
- `BarChart01`: Reporting
- `MarkerPin01`: Locations
- `Plus`: Create/Add
- `Edit03`: Edit
- `Trash01`: Delete
- `Settings01`: Settings

**Bay Status**:

- `CheckCircle`: Operational/Available
- `PlayCircle`: In Use
- `Tool01`: Maintenance
- `XCircle`: Offline/Error
- `AlertTriangle`: Warning

**Bookings**:

- `Calendar`: Schedule/Date
- `Clock`: Time
- `Users01`: Customer/Group
- `DollarSign`: Pricing

**Devices**:

- `Zap`: Launch Monitor
- `Monitor`: Projector/Screen
- `Cpu`: Computer/Processing
- `Radio`: Sensor/Signal

### Icon Sizing

- `size={16}`: Small (badges, inline text)
- `size={20}`: Standard (buttons, list items)
- `size={24}`: Large (headers, feature icons)
- `size={48}`: Featured icons (empty states)

## Responsive Behavior

### Breakpoints

```tsx
// Tailwind CSS breakpoints
sm: 640px   // Small tablets
md: 768px   // Large tablets
lg: 1024px  // Laptop
xl: 1280px  // Desktop
2xl: 1536px // Large desktop
```

### Mobile-First Patterns

**Hide on Mobile, Show on Desktop**:

```tsx
className = "hidden lg:block";
```

**Stack on Mobile, Row on Desktop**:

```tsx
className = "flex flex-col lg:flex-row";
```

**Responsive Tables**:

- Hide non-critical columns on mobile
- Use horizontal scroll for complex tables
- Consider card layout for mobile alternative

## Animation & Transitions

### Principles

- **Subtle and purposeful**: Enhance UX, don't distract
- **Fast**: 150-300ms for most transitions
- **Consistent**: Use same timing for similar actions

### Common Patterns

**Hover Transitions**:

```tsx
className = "transition-colors duration-200 hover:bg-secondary";
```

**Enter/Exit Animations** (for modals, dropdowns):

```tsx
// Handled by Untitled UI components automatically
// Uses Tailwind animate-in/animate-out utilities
```

**Loading Pulse**:

```tsx
className = "animate-pulse";
```

## Accessibility Requirements

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Clear focus indicators (handled by Untitled UI)
- Logical tab order

### ARIA Labels

```tsx
<Button aria-label="Delete booking" icon={Trash01} />
<Input aria-describedby="email-hint" />
```

### Color Contrast

- Minimum 4.5:1 for body text
- Minimum 3:1 for large text and UI components
- Don't rely on color alone to convey information

### Screen Readers

- Use semantic HTML
- Provide text alternatives for icons
- Announce dynamic content changes

## Dark Mode (Future)

The Untitled UI theme supports dark mode out of the box. When implementing:

1. Use semantic color tokens (e.g., `text-primary`, `bg-primary`)
2. Avoid hardcoded color values
3. Test all components in both modes
4. Provide user preference toggle in settings

## Best Practices

### Do's

✅ Use Untitled UI components as-is when possible
✅ Compose custom components from primitives
✅ Follow Tailwind's utility-first approach
✅ Use semantic color tokens
✅ Provide empty and error states
✅ Test responsive behavior at all breakpoints

### Don'ts

❌ Override Untitled UI component internals
❌ Use inline styles (except for dynamic values)
❌ Hardcode pixel values (use Tailwind scale)
❌ Forget loading and error states
❌ Ignore keyboard and screen reader users

## Resources

- [Untitled UI React Docs](https://www.untitledui.com/react/docs)
- [Untitled UI Icons](https://www.untitledui.com/react/resources/icons)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [React Aria Docs](https://react-spectrum.adobe.com/react-aria/)

---

This design system evolves with the application. Update this document as new patterns emerge.

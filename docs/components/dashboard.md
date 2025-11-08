# Dashboard Components Documentation

## Overview

The Dashboard module provides a comprehensive interface for users to explore and access AI agents, tools, and account settings. It consists of responsive, accessible components designed with mobile-first approach using shadcn/ui primitives and Tailwind CSS.

## Components

### 1. DashboardSidebar (`dashboard-sidebar.tsx`)

The primary navigation sidebar for the dashboard interface.

#### Features

- **Responsive Design**: Visible by default on desktop (1024px+) and tablet (768px+), hidden on mobile with toggle capability
- **Sections**: Organizes navigation into AI Agents, Tools, and Account sections
- **Active State Detection**: Highlights current page using pathname matching
- **User Footer**: Displays user avatar, email, and sign-out button
- **Smooth Interactions**: Auto-closes on mobile when navigating
- **Accessibility**: Proper ARIA labels, semantic HTML, keyboard navigation support

#### Props

```typescript
interface DashboardSidebarProps {
  user: User | undefined;
}
```

#### Usage

```tsx
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export function Layout({ user }) {
  return <DashboardSidebar user={user} />;
}
```

#### Styling Classes

- Uses Tailwind CSS for responsive layout
- Leverages `cn()` utility for conditional classes
- Implements smooth transitions and hover states
- Dark mode support via Tailwind's dark mode variants

### 2. ToolCard (`tool-card.tsx`)

Reusable card component for displaying AI agents and tools.

#### Features

- **Interactive Hover Effects**: Smooth animations on hover with scale and shadow
- **Badge Support**: Optional badge for "New", "Beta", or "Coming Soon" status
- **Icon Support**: Accepts Lucide React icons for visual identity
- **Disabled State**: Prevents interaction for unavailable tools
- **Accessibility**: Proper roles and ARIA labels for disabled items
- **Responsive**: Works seamlessly across all screen sizes

#### Props

```typescript
interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string | boolean;
  isDisabled?: boolean;
}
```

#### Usage

```tsx
import { ToolCard } from "@/components/dashboard/tool-card";
import { Bot } from "lucide-react";

export function MyTools() {
  return (
    <ToolCard
      title="Chat General"
      description="Access the chat general for intelligent conversations"
      href="/dashboard/agents/chat-general"
      icon={Bot}
      badge="New"
    />
  );
}
```

#### Badge Variants

- **"New"**: Green styling indicating recently added features
- **"Beta"**: Blue styling for features in beta testing
- **"Coming Soon"**: Yellow styling for planned features (disables interaction)
- **Boolean**: Renders without text when true

### 3. DashboardMenu (`dashboard-menu.tsx`)

Grid-based layout component organizing tools and agents into sections.

#### Features

- **Section Organization**: Separates AI Agents and Tools into distinct sections
- **Grid Layout**: Responsive 1-3 columns based on screen size
- **Section Headers**: Includes descriptions and feature badges
- **Quick Stats**: "Getting Started" guide with actionable tips
- **Conditional Rendering**: Shows/hides "Coming Soon" items based on prop

#### Props

```typescript
interface DashboardMenuProps {
  showComingSoon?: boolean; // Default: true
}
```

#### Usage

```tsx
import { DashboardMenu } from "@/components/dashboard/dashboard-menu";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardMenu showComingSoon={true} />
    </div>
  );
}
```

#### Layout Responsive Behavior

- **Mobile (< 768px)**: 1 column grid
- **Tablet (768px - 1024px)**: 2 columns
- **Desktop (> 1024px)**: 3 columns

### 4. SidebarRouter (`sidebar-router.tsx`)

Intelligent router component that switches between AppSidebar (for chat) and DashboardSidebar.

#### Features

- **Dynamic Sidebar Selection**: Routes to appropriate sidebar based on current pathname
- **Seamless Context Switching**: Transitions between chat and dashboard navigation
- **User Awareness**: Passes user context to both sidebar implementations

#### Props

```typescript
interface SidebarRouterProps {
  user: User | undefined;
}
```

#### Behavior

```
/dashboard/chat/* -> AppSidebar (chat history + messaging)
/dashboard/* -> DashboardSidebar (main dashboard navigation)
```

#### Usage

```tsx
import { SidebarRouter } from "@/components/dashboard/sidebar-router";

export function DashboardLayout({ user }) {
  return (
    <SidebarProvider>
      <SidebarRouter user={user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
```

## Data Structures

### Navigation Items (`nav-items.ts`)

Centralized configuration for all sidebar navigation.

#### NavItem Interface

```typescript
interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | boolean;
}
```

#### NavSection Interface

```typescript
interface NavSection {
  title: string;
  items: NavItem[];
}
```

#### Predefined Sections

**AI Agents**
- Chat General (New)
- Multi-Herramientas
- Chat RAG
- Multiagentes (Beta)

**Tools**
- Chat Usuarios
- Lista Tareas
- Storage (Coming Soon)

**Account**
- Perfil
- Configuración
- Métricas

#### Usage

```typescript
import {
  aiAgentsSection,
  toolsSection,
  accountSection,
  allSections,
} from "@/components/dashboard/nav-items";

// Use in components
allSections.map((section) => (
  <div key={section.title}>
    {section.items.map((item) => (
      // Render item
    ))}
  </div>
));
```

## Accessibility Features

### Keyboard Navigation

- All links and buttons accessible via Tab key
- Arrow keys supported for sidebar sections (via Radix primitives)
- Escape key closes mobile sidebar
- Focus indicators visible and properly styled

### Screen Reader Support

- Semantic HTML elements (`<nav>`, `<section>`, `<main>`)
- Proper heading hierarchy (h1 > h2 > h3)
- ARIA labels on icon-only buttons
- Alt text for user avatars
- Status messages for disabled items

### Visual Accessibility

- Color contrast meets WCAG AA standards (4.5:1 for text)
- Icons supplemented with text labels
- Clear focus indicators on interactive elements
- Sufficient touch targets (minimum 44px × 44px)
- Support for reduced motion preferences (Tailwind)

## Responsive Design

### Mobile (< 768px)

- Sidebar hidden by default, accessible via toggle button
- Single column grid layout
- Larger touch targets
- Full-width cards
- Optimized padding and spacing

### Tablet (768px - 1024px)

- Sidebar visible with collapsible icon-only mode
- Two-column grid layout
- Balanced spacing
- Improved readability

### Desktop (> 1024px)

- Sidebar fully visible
- Three-column grid layout
- Hover effects enhanced
- Maximum width container (max-w-6xl)

## Theming

### Color Scheme

All components support Tailwind CSS theming with automatic dark mode support:

- **Primary**: Brand primary color for CTAs and highlights
- **Accent**: Secondary interaction color for hovers
- **Destructive**: Sign-out button styling
- **Muted Foreground**: Secondary text and disabled states

### Customization

To customize theme colors, modify Tailwind configuration:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          // customize primary color scale
        },
        accent: {
          // customize accent color scale
        },
      },
    },
  },
};
```

## Integration with Layout

### Setup in `app/(dashboard)/layout.tsx`

```typescript
import { SidebarRouter } from "@/components/dashboard/sidebar-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <SidebarRouter user={session?.user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
```

### Setup in `app/(dashboard)/page.tsx`

```typescript
import { DashboardMenu } from "@/components/dashboard/dashboard-menu";

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <div className="border-b bg-background/50 backdrop-blur-sm sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">
            Explore AI agents and tools
          </p>
        </div>
      </div>
      <DashboardMenu showComingSoon={true} />
    </div>
  );
}
```

## Performance Optimizations

### Code Splitting

- Components are lazy-loadable via dynamic imports if needed
- No unnecessary re-renders with proper memoization
- Icons loaded from lucide-react (tree-shakeable)

### Image Optimization

- User avatars use `next/image` with Vercel CDN
- Proper sizing and srcset attributes
- Lazy loading for off-screen images

### Caching

- Navigation items are static data (can be cached)
- User data from session (server-side)
- CSS classes optimized by Tailwind's PurgeCSS

## Common Patterns

### Adding a New Section

```typescript
// 1. Update nav-items.ts
export const newSection: NavSection = {
  title: "New Section",
  items: [
    {
      label: "Item 1",
      href: "/dashboard/new/item-1",
      icon: IconName,
      badge: "New",
    },
    // ... more items
  ],
};

export const allSections = [
  aiAgentsSection,
  toolsSection,
  accountSection,
  newSection, // Add here
];

// 2. Update dashboard-sidebar.tsx to render the new section
{newSection.items.map((item) => (
  // Render item with same pattern
))}
```

### Customizing Card Styling

```typescript
// Modify ToolCard component
// Change className in Card component
className={cn(
  "group relative overflow-hidden transition-all duration-300",
  "hover:shadow-lg hover:border-primary/50",
  // Add custom classes
  "custom-class-here",
)}
```

### Adding Navigation Guards

```typescript
// In DashboardSidebar, wrap Link with conditional rendering
{item.href && canAccessRoute(item.href) ? (
  <Link href={item.href}>...</Link>
) : (
  <div aria-disabled="true">...</div>
)}
```

## Testing

### Unit Tests

Example test structure for ToolCard:

```typescript
import { render, screen } from "@testing-library/react";
import { ToolCard } from "./tool-card";
import { Bot } from "lucide-react";

describe("ToolCard", () => {
  it("renders with title and description", () => {
    render(
      <ToolCard
        title="Test Card"
        description="Test description"
        href="/test"
        icon={Bot}
      />
    );

    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("disables interaction when isDisabled is true", () => {
    render(
      <ToolCard
        title="Disabled"
        description="Disabled card"
        href="/test"
        icon={Bot}
        isDisabled={true}
      />
    );

    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      expect.stringContaining("not available")
    );
  });
});
```

### E2E Tests

```typescript
import { test, expect } from "@playwright/test";

test("dashboard sidebar navigation", async ({ page }) => {
  await page.goto("/dashboard");

  // Check sidebar is visible
  const sidebar = page.locator('[data-sidebar="sidebar"]');
  await expect(sidebar).toBeVisible();

  // Click navigation item
  await page.click('a[href="/dashboard/agents/chat-general"]');

  // Verify navigation
  await expect(page).toHaveURL("/dashboard/agents/chat-general");
});
```

## Migration Guide

### From Old Dashboard

If migrating from an existing dashboard structure:

1. **Update imports**: Replace old component imports with new ones
2. **Update routing**: Ensure routes match nav-items configuration
3. **Update styles**: Verify Tailwind configuration is compatible
4. **Test navigation**: Verify all links work correctly
5. **Check accessibility**: Run accessibility audit tools

## Troubleshooting

### Sidebar not showing on mobile

Ensure `SidebarProvider` has `defaultOpen` prop and cookie state is properly managed.

### Cards not responsive

Check Tailwind CSS is properly configured in `tailwind.config.ts` and responsive prefixes are available.

### Navigation not highlighting

Verify pathname matches exactly with `href` in nav-items. Use `usePathname()` hook to debug.

### Dark mode not working

Ensure `next-themes` is properly configured and `html` element has `suppressHydrationWarning` attribute.

## File Structure

```
components/
├── dashboard/
│   ├── nav-items.ts           # Navigation configuration
│   ├── tool-card.tsx          # Card component
│   ├── dashboard-sidebar.tsx  # Main sidebar
│   ├── dashboard-menu.tsx     # Grid menu
│   └── sidebar-router.tsx     # Sidebar switcher
├── ui/
│   ├── sidebar.tsx            # Base sidebar primitives
│   ├── card.tsx               # Card component
│   └── button.tsx             # Button component

hooks/
└── use-dashboard-context.ts   # Context hook (optional)

app/
└── (dashboard)/
    ├── layout.tsx             # Main layout
    └── page.tsx               # Dashboard page
```

## Future Enhancements

- Add breadcrumb navigation
- Implement search/filter for tools
- Add pinned tools functionality
- Create customizable dashboard layouts
- Add analytics and usage tracking
- Implement tool recommendations based on usage
- Add keyboard shortcuts help modal

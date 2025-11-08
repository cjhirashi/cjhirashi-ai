# Dashboard Components - Advanced Examples

## Table of Contents

1. [Custom Navigation Sections](#custom-navigation-sections)
2. [Dynamic Tool Availability](#dynamic-tool-availability)
3. [Advanced Styling](#advanced-styling)
4. [Integration Patterns](#integration-patterns)
5. [Performance Tips](#performance-tips)

## Custom Navigation Sections

### Adding a Premium Features Section

```typescript
// nav-items.ts
export const premiumSection: NavSection = {
  title: "Premium Features",
  items: [
    {
      label: "Advanced Analytics",
      href: "/dashboard/premium/analytics",
      icon: BarChart3,
      badge: "Pro",
    },
    {
      label: "Team Collaboration",
      href: "/dashboard/premium/teams",
      icon: Users,
      badge: "Pro",
    },
  ],
};

// Conditionally export based on feature flags
export const allSections = [
  aiAgentsSection,
  toolsSection,
  isPremiumEnabled ? premiumSection : null,
  accountSection,
].filter(Boolean);
```

### Creating a Dynamic Section

```typescript
// dashboard-sidebar.tsx
export function DashboardSidebar({ user }: DashboardSidebarProps) {
  // Dynamically determine available sections based on user role
  const getVisibleSections = () => {
    if (user?.role === "admin") {
      return [...allSections, adminSection];
    }
    return allSections.filter((s) => s.title !== "Admin");
  };

  const sections = getVisibleSections();

  return (
    <Sidebar>
      {sections.map((section) => (
        <SidebarGroup key={section.title}>
          {/* Render section items */}
        </SidebarGroup>
      ))}
    </Sidebar>
  );
}
```

## Dynamic Tool Availability

### Conditional Rendering Based on Permissions

```typescript
// tool-card.tsx - Enhanced with permission checking
interface ToolCardProps extends BaseCardProps {
  requiredPermission?: string;
  userPermissions?: string[];
}

export function ToolCard({
  title,
  requiredPermission,
  userPermissions = [],
  ...props
}: ToolCardProps) {
  const hasPermission = !requiredPermission ||
    userPermissions.includes(requiredPermission);

  return (
    <ToolCard
      {...props}
      isDisabled={!hasPermission}
      title={hasPermission ? title : `${title} (Locked)`}
    />
  );
}

// Usage
<ToolCard
  title="Enterprise Features"
  href="/dashboard/enterprise"
  requiredPermission="enterprise"
  userPermissions={user.permissions}
  icon={Zap}
/>
```

### Usage-Based Feature Availability

```typescript
// dashboard-menu.tsx - Show based on usage limits
interface DashboardMenuProps {
  userStats?: {
    messagesUsed: number;
    messagesLimit: number;
    toolsAccessible: number;
  };
}

export function DashboardMenu({ userStats }: DashboardMenuProps) {
  const hasReachedLimit = userStats &&
    userStats.messagesUsed >= userStats.messagesLimit;

  return (
    <div className="space-y-12">
      {/* Show warning if limit reached */}
      {hasReachedLimit && (
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
          <p className="font-semibold text-yellow-900 dark:text-yellow-200">
            You have reached your daily message limit
          </p>
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            Upgrade to Premium to increase your limits
          </p>
        </div>
      )}

      {/* Conditionally disable certain tools */}
      <section>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Tools</h2>
          {userStats?.toolsAccessible && (
            <span className="text-xs text-muted-foreground">
              {userStats.toolsAccessible} available
            </span>
          )}
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {toolsSection.items.map((item) => (
            <ToolCard
              key={item.href}
              {...item}
              isDisabled={
                hasReachedLimit &&
                item.label.includes("Advanced")
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
```

## Advanced Styling

### Custom Theme Integration

```typescript
// Create a theme variant system
const toolCardVariants = {
  default: "bg-card text-card-foreground",
  highlight: "bg-primary/5 border-primary/20",
  premium: "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20",
};

interface ToolCardProps {
  variant?: keyof typeof toolCardVariants;
}

// Usage
<ToolCard
  title="Premium Feature"
  variant="premium"
  badge="Pro"
  // ...
/>
```

### Custom Animation Effects

```typescript
// dashboard-menu.tsx - Add staggered entrance animation
"use client";

import { useEffect, useState } from "react";

export function DashboardMenu() {
  const [animateItems, setAnimateItems] = useState(false);

  useEffect(() => {
    setAnimateItems(true);
  }, []);

  return (
    <div className="space-y-12">
      {/* Animate section */}
      <section
        className={cn(
          "opacity-0 transition-opacity duration-500",
          animateItems && "opacity-100"
        )}
      >
        {/* Content */}
      </section>

      {/* Staggered card animations */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.href}
            className={cn(
              "opacity-0 transform translate-y-4 transition-all duration-500",
              animateItems &&
                "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <ToolCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Responsive Sidebar Variants

```typescript
// Create collapsible sections on smaller screens
export function DashboardSidebar() {
  const [expandedSections, setExpandedSections] = useState({
    agents: true,
    tools: true,
    account: true,
  });

  return (
    <Sidebar>
      {/* On mobile, allow collapsing sections */}
      <SidebarGroup>
        <button
          onClick={() =>
            setExpandedSections((prev) => ({
              ...prev,
              agents: !prev.agents,
            }))
          }
          className="flex w-full items-center justify-between"
        >
          <SidebarGroupLabel>AI Agents</SidebarGroupLabel>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expandedSections.agents && "rotate-180"
            )}
          />
        </button>

        {expandedSections.agents && (
          <SidebarGroupContent>
            {/* Items */}
          </SidebarGroupContent>
        )}
      </SidebarGroup>
    </Sidebar>
  );
}
```

## Integration Patterns

### With Authentication & Authorization

```typescript
// Integrate user roles and permissions
import { useSession } from "next-auth/react";

export function DashboardSidebar() {
  const { data: session } = useSession();

  const canAccessPremium = session?.user?.tier === "premium";
  const isAdmin = session?.user?.role === "admin";

  return (
    <Sidebar>
      {/* Show different sections based on user tier */}
      {canAccessPremium && (
        <SidebarGroup>
          {/* Premium features */}
        </SidebarGroup>
      )}

      {isAdmin && (
        <SidebarGroup>
          {/* Admin tools */}
        </SidebarGroup>
      )}
    </Sidebar>
  );
}
```

### With Analytics Tracking

```typescript
// Track user interactions with tools/agents
import { trackEvent } from "@/lib/analytics";

export function ToolCard({ title, href, ...props }: ToolCardProps) {
  const handleClick = () => {
    trackEvent("tool_accessed", {
      tool_name: title,
      tool_href: href,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <Link href={href} onClick={handleClick}>
      {/* Card content */}
    </Link>
  );
}
```

### With Search/Filter Functionality

```typescript
// dashboard-menu.tsx - Add search
"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DashboardMenu() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = useMemo(() => {
    return aiAgentsSection.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search agents and tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredAgents.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((item) => (
            <ToolCard key={item.href} {...item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No results found for "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
```

## Performance Tips

### 1. Memoize Navigation Items

```typescript
// Prevent unnecessary recalculations
import { useMemo } from "react";

export function DashboardSidebar() {
  const sections = useMemo(() => {
    return allSections.map((section) => ({
      ...section,
      items: section.items.filter(/* permission check */),
    }));
  }, [user?.permissions]);

  return <Sidebar>{/* Use sections */}</Sidebar>;
}
```

### 2. Lazy Load Tool Descriptions

```typescript
// Only load full descriptions on demand
interface ToolCardProps {
  title: string;
  description?: string | (() => Promise<string>);
}

export function ToolCard({ description, ...props }: ToolCardProps) {
  const [fullDesc, setFullDesc] = useState<string>();

  const handleMouseEnter = async () => {
    if (typeof description === "function" && !fullDesc) {
      const desc = await description();
      setFullDesc(desc);
    }
  };

  return (
    <Card onMouseEnter={handleMouseEnter}>
      <p>{fullDesc || description}</p>
    </Card>
  );
}
```

### 3. Virtual Scrolling for Large Lists

```typescript
// When you have many tools/agents
import { FixedSizeList } from "react-window";

export function LargeDashboardMenu({ items }: { items: NavItem[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={150}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ToolCard key={items[index].href} {...items[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### 4. Image Optimization

```typescript
// Optimize user avatars in sidebar footer
import Image from "next/image";

<Image
  src={`https://avatar.vercel.sh/${user.email}`}
  alt={user.email}
  width={32}
  height={32}
  className="rounded-full"
  priority={false}
  quality={75}
/>
```

## Testing Examples

### Unit Test for ToolCard

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToolCard } from "./tool-card";
import { Bot } from "lucide-react";

describe("ToolCard", () => {
  it("renders with badge", () => {
    render(
      <ToolCard
        title="Test"
        description="Test desc"
        href="/test"
        icon={Bot}
        badge="New"
      />
    );

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("disables interaction when disabled", () => {
    const { container } = render(
      <ToolCard
        title="Test"
        description="Test"
        href="/test"
        icon={Bot}
        isDisabled={true}
      />
    );

    const link = container.querySelector("a");
    expect(link).not.toBeInTheDocument();
  });

  it("navigates on click", async () => {
    const user = userEvent.setup();
    render(
      <ToolCard
        title="Test"
        description="Test"
        href="/test/path"
        icon={Bot}
      />
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/test/path");
  });
});
```

### E2E Test for Sidebar Navigation

```typescript
import { test, expect } from "@playwright/test";

test("dashboard sidebar navigation", async ({ page }) => {
  await page.goto("/dashboard");

  // Check all sections present
  const sidebar = page.locator('[data-sidebar="sidebar"]');
  await expect(sidebar).toBeVisible();

  // Navigate using sidebar
  await page.click('a[href="/dashboard/agents/chat-general"]');
  await expect(page).toHaveURL("/dashboard/agents/chat-general");

  // Check mobile toggle
  await page.setViewportSize({ width: 375, height: 667 });
  const sidebarTrigger = page.locator('[data-sidebar="trigger"]');
  await expect(sidebarTrigger).toBeVisible();
  await sidebarTrigger.click();
  await expect(sidebar).toBeVisible();
});
```

## Conclusion

These examples show advanced patterns for extending and customizing the Dashboard components. Start simple and add complexity as needed for your use case.

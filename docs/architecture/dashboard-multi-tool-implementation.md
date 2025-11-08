# Dashboard Multi-Tool Implementation Plan

**Date:** 2025-11-07
**Related:** [Dashboard Multi-Tool Architecture](./dashboard-multi-tool-architecture.md)
**Status:** Ready for Implementation

---

## Overview

This document provides a **step-by-step implementation plan** to transform the Chat SDK into a multi-tool dashboard. The plan is designed for **incremental, non-breaking changes** that can be deployed continuously.

---

## Implementation Phases

### Phase 1: Foundation (1-2 days)
Setup base structure without breaking existing functionality.

### Phase 2: Database Migration (1 day)
Extend database schema with new tables.

### Phase 3: Core Components (2-3 days)
Build reusable dashboard components.

### Phase 4: Agent Migration (2-3 days)
Restructure existing chat as "General Chat" agent.

### Phase 5: New Agents (3-5 days)
Implement Multi-Tools, Multi-Agent, and RAG agents.

### Phase 6: Independent Tools (3-4 days)
Build TODO List, User Chat, and File Storage.

### Phase 7: Polish & Testing (2-3 days)
Final integration, testing, and documentation.

**Total estimated time:** 14-21 days

---

## Detailed Implementation Steps

## Phase 1: Foundation Setup

### Step 1.1: Create Directory Structure

**Duration:** 30 minutes
**Risk:** Low
**Breaking:** No

```bash
# Create new directories
mkdir -p app/(dashboard)/agents/chat-general
mkdir -p app/(dashboard)/agents/multi-tools
mkdir -p app/(dashboard)/agents/multi-agent
mkdir -p app/(dashboard)/agents/rag
mkdir -p app/(dashboard)/tools/user-chat
mkdir -p app/(dashboard)/tools/todo-list
mkdir -p app/(dashboard)/tools/file-storage
mkdir -p app/(dashboard)/profile
mkdir -p app/(dashboard)/metrics

mkdir -p components/dashboard
mkdir -p components/agents/chat-general
mkdir -p components/agents/multi-tools
mkdir -p components/agents/multi-agent
mkdir -p components/agents/rag
mkdir -p components/tools/user-chat
mkdir -p components/tools/todo-list
mkdir -p components/tools/file-storage
mkdir -p components/profile
mkdir -p components/metrics

mkdir -p app/api/agents/multi-tools
mkdir -p app/api/agents/multi-agent
mkdir -p app/api/agents/rag
mkdir -p app/api/tools/todo
mkdir -p app/api/tools/user-chat
mkdir -p app/api/tools/storage
```

**Files to create:**
```
app/(dashboard)/agents/chat-general/page.tsx
app/(dashboard)/agents/multi-tools/page.tsx
app/(dashboard)/agents/multi-agent/page.tsx
app/(dashboard)/agents/rag/page.tsx
app/(dashboard)/tools/user-chat/page.tsx
app/(dashboard)/tools/todo-list/page.tsx
app/(dashboard)/tools/file-storage/page.tsx
app/(dashboard)/profile/page.tsx
app/(dashboard)/metrics/page.tsx
```

**Validation:**
- [ ] All directories created successfully
- [ ] No existing files overwritten
- [ ] Directory structure matches architecture document

---

### Step 1.2: Create Placeholder Pages

**Duration:** 1 hour
**Risk:** Low
**Breaking:** No

Create minimal placeholder pages for all new routes. These will be replaced in later phases.

**Template for placeholder pages:**

```typescript
// app/(dashboard)/agents/multi-tools/page.tsx
import { redirect } from "next/navigation";

export default function MultiToolsAgentPage() {
  // Temporary: redirect to existing chat until implementation
  redirect("/dashboard/chat");

  // Future implementation:
  // return <MultiToolsAgent />;
}
```

**Files to create:**
1. `app/(dashboard)/agents/multi-tools/page.tsx`
2. `app/(dashboard)/agents/multi-agent/page.tsx`
3. `app/(dashboard)/agents/rag/page.tsx`
4. `app/(dashboard)/tools/user-chat/page.tsx`
5. `app/(dashboard)/tools/todo-list/page.tsx`
6. `app/(dashboard)/tools/file-storage/page.tsx`
7. `app/(dashboard)/profile/page.tsx`

**Validation:**
- [ ] All placeholder pages redirect correctly
- [ ] No 404 errors when accessing new routes
- [ ] Existing `/dashboard/chat` still works

---

### Step 1.3: Rename Stats to Metrics

**Duration:** 15 minutes
**Risk:** Low
**Breaking:** Potentially (if external links exist)

**Actions:**
```bash
# Rename directory
mv app/(dashboard)/dashboard/stats app/(dashboard)/metrics

# Update internal references
# - Update any links in components
# - Update middleware if necessary
```

**Files to modify:**
- `app/(dashboard)/metrics/page.tsx` (review content)
- Any component linking to stats page

**Validation:**
- [ ] `/dashboard/metrics` works
- [ ] No broken links in app
- [ ] Middleware allows route

---

### Step 1.4: Create Navigation Types

**Duration:** 30 minutes
**Risk:** Low
**Breaking:** No

Create type definitions for navigation structure.

**File:** `lib/navigation/types.ts`

```typescript
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string; // e.g., "New", "Beta"
  requiresPremium?: boolean;
};

export type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
};

export type DashboardNavigation = {
  sections: NavSection[];
};
```

**File:** `lib/navigation/config.ts`

```typescript
import {
  MessageSquare,
  Wrench,
  Users,
  FileText,
  MessageCircle,
  CheckSquare,
  FolderOpen,
  User,
  Settings,
  BarChart,
} from "lucide-react";
import type { DashboardNavigation } from "./types";

export const dashboardNavigation: DashboardNavigation = {
  sections: [
    {
      id: "agents",
      label: "AI Agents",
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          id: "chat-general",
          label: "General Chat",
          href: "/dashboard/agents/chat-general",
          icon: MessageSquare,
          description: "Standard AI conversation",
        },
        {
          id: "multi-tools",
          label: "Multi-Tools",
          href: "/dashboard/agents/multi-tools",
          icon: Wrench,
          description: "AI with extended tools",
          badge: "New",
        },
        {
          id: "multi-agent",
          label: "Multi-Agent",
          href: "/dashboard/agents/multi-agent",
          icon: Users,
          description: "Coordinated multi-agent system",
          badge: "Beta",
          requiresPremium: true,
        },
        {
          id: "rag",
          label: "RAG Agent",
          href: "/dashboard/agents/rag",
          icon: FileText,
          description: "Document-enhanced chat",
          badge: "New",
        },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          id: "user-chat",
          label: "User Chat",
          href: "/dashboard/tools/user-chat",
          icon: MessageCircle,
          description: "Chat with other users",
        },
        {
          id: "todo-list",
          label: "TODO List",
          href: "/dashboard/tools/todo-list",
          icon: CheckSquare,
          description: "Task management",
        },
        {
          id: "file-storage",
          label: "File Storage",
          href: "/dashboard/tools/file-storage",
          icon: FolderOpen,
          description: "Manage your files",
        },
      ],
    },
    {
      id: "account",
      label: "Account",
      collapsible: false,
      items: [
        {
          id: "profile",
          label: "Profile",
          href: "/dashboard/profile",
          icon: User,
        },
        {
          id: "settings",
          label: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
        },
        {
          id: "metrics",
          label: "Metrics",
          href: "/dashboard/metrics",
          icon: BarChart,
        },
      ],
    },
  ],
};
```

**Validation:**
- [ ] Types compile without errors
- [ ] Navigation config exports correctly
- [ ] Icons import successfully

---

## Phase 2: Database Migration

### Step 2.1: Update Database Schema

**Duration:** 1 hour
**Risk:** Medium
**Breaking:** No (if done correctly)

**File:** `lib/db/schema.ts`

Add new tables and extend existing ones:

```typescript
// Add after existing tables

// Agent Type Classification
export const agentType = pgTable("AgentType", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("isActive").notNull().default(true),
});

export type AgentType = InferSelectModel<typeof agentType>;

// Extend Chat table (add migration separately)
// NOTE: This shows the desired state; migration handled in Step 2.2

// TODO List Items
export const todoItem = pgTable("TodoItem", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  priority: varchar("priority", { length: 10, enum: ["low", "medium", "high"] })
    .notNull()
    .default("medium"),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type TodoItem = InferSelectModel<typeof todoItem>;

// User-to-User Messages
export const userMessage = pgTable("UserMessage", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  fromUserId: uuid("fromUserId")
    .notNull()
    .references(() => user.id),
  toUserId: uuid("toUserId")
    .notNull()
    .references(() => user.id),
  content: text("content").notNull(),
  isRead: boolean("isRead").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type UserMessage = InferSelectModel<typeof userMessage>;

// File Storage
export const storedFile = pgTable("StoredFile", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  fileName: text("fileName").notNull(),
  fileType: text("fileType").notNull(),
  fileSize: integer("fileSize").notNull(), // in bytes
  blobUrl: text("blobUrl").notNull(),
  folder: text("folder"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type StoredFile = InferSelectModel<typeof storedFile>;
```

**Validation:**
- [ ] TypeScript compiles successfully
- [ ] No duplicate table names
- [ ] All foreign keys reference existing tables

---

### Step 2.2: Generate Database Migration

**Duration:** 30 minutes
**Risk:** Medium
**Breaking:** No (reversible)

```bash
# Generate migration
pnpm db:generate

# This creates: lib/db/migrations/XXXX_add_multi_tool_tables.sql
```

**Review generated SQL** before applying. Should include:
- CREATE TABLE for new tables
- Indexes for foreign keys
- No ALTER on existing tables yet (agentType field comes later)

**File:** `lib/db/migrations/XXXX_seed_agent_types.sql` (manual)

```sql
-- Seed agent types
INSERT INTO "AgentType" ("id", "name", "description", "isActive") VALUES
  ('chat-general', 'General Chat', 'Standard AI conversation', true),
  ('multi-tools', 'Multi-Tools Agent', 'AI with extended tool capabilities', true),
  ('multi-agent', 'Multi-Agent System', 'Coordinated multi-agent workflows', true),
  ('rag', 'RAG Agent', 'Retrieval-Augmented Generation with document context', true)
ON CONFLICT ("id") DO NOTHING;
```

**Apply migration:**
```bash
# Test in development
pnpm db:migrate

# Verify tables exist
pnpm db:studio
```

**Validation:**
- [ ] Migration applies without errors
- [ ] New tables appear in Drizzle Studio
- [ ] AgentType table has 4 rows
- [ ] Existing data unchanged

---

### Step 2.3: Add agentType Field to Chat

**Duration:** 30 minutes
**Risk:** High (modifies existing table)
**Breaking:** No (with backfill)

**This is a critical step - requires careful testing**

**File:** `lib/db/schema.ts`

```typescript
export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
  lastContext: jsonb("lastContext").$type<AppUsage | null>(),
  // NEW FIELD
  agentType: varchar("agentType", { length: 50 })
    .notNull()
    .default("chat-general")
    .references(() => agentType.id),
});
```

**Generate migration:**
```bash
pnpm db:generate
# Creates: XXXX_add_agent_type_to_chat.sql
```

**Expected migration SQL:**
```sql
-- Add column as nullable first
ALTER TABLE "Chat" ADD COLUMN "agentType" VARCHAR(50);

-- Backfill existing rows
UPDATE "Chat" SET "agentType" = 'chat-general' WHERE "agentType" IS NULL;

-- Make non-nullable and add default
ALTER TABLE "Chat" ALTER COLUMN "agentType" SET NOT NULL;
ALTER TABLE "Chat" ALTER COLUMN "agentType" SET DEFAULT 'chat-general';

-- Add foreign key
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_agentType_fkey"
  FOREIGN KEY ("agentType") REFERENCES "AgentType"("id");

-- Add index for common query
CREATE INDEX "idx_chat_user_agent" ON "Chat"("userId", "agentType");
```

**Apply migration:**
```bash
pnpm db:migrate
```

**Validation:**
- [ ] Migration succeeds
- [ ] All existing chats have `agentType = 'chat-general'`
- [ ] New chats default to `'chat-general'`
- [ ] No data loss

---

## Phase 3: Core Dashboard Components

### Step 3.1: Create Dashboard Menu Component

**Duration:** 2 hours
**Risk:** Low
**Breaking:** No

**File:** `components/dashboard/tool-card.tsx`

```typescript
"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ToolCardProps = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  requiresPremium?: boolean;
  className?: string;
};

export function ToolCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
  requiresPremium,
  className,
}: ToolCardProps) {
  return (
    <Link href={href} className="block">
      <Card className={cn(
        "transition-all hover:shadow-lg hover:border-primary/50",
        requiresPremium && "border-amber-500/30",
        className
      )}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <Icon className="h-8 w-8 text-primary" />
            {badge && <Badge variant="secondary">{badge}</Badge>}
          </div>
          <CardTitle className="mt-4">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {requiresPremium && (
          <CardContent>
            <Badge variant="outline" className="border-amber-500 text-amber-600">
              Premium
            </Badge>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
```

**File:** `components/dashboard/dashboard-menu.tsx`

```typescript
"use client";

import { dashboardNavigation } from "@/lib/navigation/config";
import { ToolCard } from "./tool-card";

export function DashboardMenu() {
  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Choose a tool or agent to get started
        </p>
      </div>

      {dashboardNavigation.sections.map((section) => (
        <section key={section.id} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{section.label}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {section.items.map((item) => (
              <ToolCard
                key={item.id}
                id={item.id}
                title={item.label}
                description={item.description || ""}
                href={item.href}
                icon={item.icon}
                badge={item.badge}
                requiresPremium={item.requiresPremium}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

**Validation:**
- [ ] Component renders without errors
- [ ] Cards display correctly
- [ ] Links navigate properly
- [ ] Responsive layout works

---

### Step 3.2: Update Dashboard Home Page

**Duration:** 15 minutes
**Risk:** Low
**Breaking:** Yes (changes default route behavior)

**File:** `app/(dashboard)/page.tsx`

```typescript
import { DashboardMenu } from "@/components/dashboard/dashboard-menu";

export default function DashboardPage() {
  return <DashboardMenu />;
}
```

**Remove redirect** to `/dashboard/chat`.

**Validation:**
- [ ] `/dashboard` shows menu grid
- [ ] No redirect loop
- [ ] All tool cards clickable

---

### Step 3.3: Create New Dashboard Sidebar

**Duration:** 3 hours
**Risk:** Medium
**Breaking:** No (replaces component)

**File:** `components/dashboard/sidebar-nav-section.tsx`

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { NavSection } from "@/lib/navigation/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

type SidebarNavSectionProps = {
  section: NavSection;
};

export function SidebarNavSection({ section }: SidebarNavSectionProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(section.defaultOpen ?? true);

  if (!section.collapsible) {
    return (
      <div className="mb-4">
        <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {section.label}
        </h3>
        <div className="space-y-1">
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link key={item.id} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size="sm"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="outline" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between" size="sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {section.label}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-1">
        {section.items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
                size="sm"
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
                {item.badge && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}
```

**File:** `components/dashboard/dashboard-sidebar.tsx`

```typescript
"use client";

import Link from "next/link";
import type { User } from "next-auth";
import { dashboardNavigation } from "@/lib/navigation/config";
import { SidebarNavSection } from "./sidebar-nav-section";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";

export function DashboardSidebar({ user }: { user: User | undefined }) {
  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row items-center justify-between px-2">
            <Link
              className="flex flex-row items-center gap-3"
              href="/dashboard"
            >
              <span className="cursor-pointer rounded-md px-2 font-semibold text-lg hover:bg-muted">
                Dashboard
              </span>
            </Link>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {dashboardNavigation.sections.map((section) => (
          <SidebarNavSection key={section.id} section={section} />
        ))}
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
```

**Validation:**
- [ ] Sidebar renders with all sections
- [ ] Collapsible sections work
- [ ] Active state highlights correctly
- [ ] User nav footer displays

---

### Step 3.4: Update Dashboard Layout

**Duration:** 30 minutes
**Risk:** Medium
**Breaking:** Yes (changes sidebar)

**File:** `app/(dashboard)/layout.tsx`

```typescript
import { cookies } from "next/headers";
import Script from "next/script";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "../(auth)/auth";

export const experimental_ppr = true;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
        <SidebarProvider defaultOpen={!isCollapsed}>
          <DashboardSidebar user={session?.user} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </DataStreamProvider>
    </>
  );
}
```

**Changes:**
- Replace `AppSidebar` with `DashboardSidebar`
- Keep everything else the same

**Validation:**
- [ ] Layout renders correctly
- [ ] Sidebar toggle works
- [ ] Cookie persistence works
- [ ] No console errors

---

## Phase 4: Migrate Chat to General Chat Agent

### Step 4.1: Copy Chat Routes to Agents

**Duration:** 30 minutes
**Risk:** Low
**Breaking:** No

```bash
# Copy existing chat implementation
cp -r app/(dashboard)/dashboard/chat/* app/(dashboard)/agents/chat-general/
```

**Files copied:**
- `page.tsx` (new chat)
- `[id]/page.tsx` (existing chat)

**No modifications needed yet** - these are exact copies.

**Validation:**
- [ ] `/dashboard/agents/chat-general` works
- [ ] `/dashboard/agents/chat-general/[id]` loads chats
- [ ] Original `/dashboard/chat` still works

---

### Step 4.2: Update Middleware Redirects

**Duration:** 30 minutes
**Risk:** Medium
**Breaking:** Yes (changes URLs)

**File:** `middleware.ts`

Update legacy route redirects:

```typescript
// Find section: "LEGACY ROUTES"
// Update to:

// 6. LEGACY ROUTES: Handle backward compatibility
if (pathname === "/chat" || pathname === "/dashboard/chat") {
  return NextResponse.redirect(new URL("/dashboard/agents/chat-general", request.url));
}

if (pathname.startsWith("/chat/")) {
  const chatId = pathname.replace("/chat/", "");
  return NextResponse.redirect(
    new URL(`/dashboard/agents/chat-general/${chatId}`, request.url)
  );
}

if (pathname.startsWith("/dashboard/chat/")) {
  const chatId = pathname.replace("/dashboard/chat/", "");
  return NextResponse.redirect(
    new URL(`/dashboard/agents/chat-general/${chatId}`, request.url)
  );
}
```

**Validation:**
- [ ] `/chat` → `/dashboard/agents/chat-general` (redirect)
- [ ] `/chat/abc` → `/dashboard/agents/chat-general/abc` (redirect)
- [ ] `/dashboard/chat` → `/dashboard/agents/chat-general` (redirect)
- [ ] Direct access to new routes works

---

### Step 4.3: Update Internal Links

**Duration:** 1 hour
**Risk:** Low
**Breaking:** No (due to redirects)

Search and replace in all components:

```typescript
// Find: "/dashboard/chat"
// Replace: "/dashboard/agents/chat-general"
```

**Files to update:**
- `components/dashboard/dashboard-sidebar.tsx`
- `components/sidebar-history-item.tsx`
- Any component with chat links

**Use global search:**
```bash
grep -r "/dashboard/chat" components/
grep -r "/dashboard/chat" app/
```

**Validation:**
- [ ] All internal links updated
- [ ] No broken links in app
- [ ] Chat history links work

---

### Step 4.4: Add Agent Type to Chat Creation

**Duration:** 1 hour
**Risk:** Low
**Breaking:** No

**Update chat creation logic** to include `agentType`.

**File:** `app/(dashboard)/agents/chat-general/page.tsx`

No changes needed - this route already creates chats correctly.

**File:** `app/api/chat/route.ts` (POST handler)

Update chat creation to include agent type:

```typescript
// Find chat creation logic
const chat = await db.insert(chatTable).values({
  id: chatId,
  userId: session.user.id,
  title: "New Chat", // Will be updated with AI-generated title
  visibility: visibility,
  createdAt: new Date(),
  agentType: "chat-general", // ADD THIS
}).returning();
```

**Better approach:** Extract agent type from request

```typescript
// In Zod schema (app/api/chat/schema.ts)
export const chatRequestSchema = z.object({
  chatId: z.string(),
  message: z.string(),
  selectedChatModel: z.string(),
  selectedVisibilityType: z.enum(["public", "private"]),
  agentType: z.enum(["chat-general", "multi-tools", "multi-agent", "rag"]).optional(),
});

// In route handler
const { chatId, message, selectedChatModel, selectedVisibilityType, agentType } = validatedData;

// Use in chat creation
agentType: agentType || "chat-general",
```

**Validation:**
- [ ] New chats have correct `agentType`
- [ ] Existing chats still work
- [ ] No database errors

---

### Step 4.5: Delete Old Chat Route

**Duration:** 15 minutes
**Risk:** Low
**Breaking:** No (due to redirects)

```bash
# Delete old chat directory
rm -rf app/(dashboard)/dashboard/chat
```

**Validation:**
- [ ] Redirects still work
- [ ] No 404 errors
- [ ] App compiles successfully

---

## Phase 5: Implement New Agents (Simplified)

### Step 5.1: Multi-Tools Agent (Placeholder)

**Duration:** 2 hours
**Risk:** Low
**Breaking:** No

**Goal:** Create functional multi-tools agent with extended tool set.

**File:** `app/(dashboard)/agents/multi-tools/page.tsx`

```typescript
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { auth } from "@/app/(auth)/auth";

export default async function MultiToolsAgentPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");

  return (
    <>
      <Chat
        autoResume={false}
        id={id}
        initialChatModel={modelIdFromCookie?.value || DEFAULT_CHAT_MODEL}
        initialMessages={[]}
        initialVisibilityType="private"
        isReadonly={false}
        key={id}
        agentType="multi-tools"
      />
      <DataStreamHandler />
    </>
  );
}
```

**File:** `app/(dashboard)/agents/multi-tools/[id]/page.tsx`

```typescript
import { notFound } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { getChatById } from "@/lib/db/queries";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { convertToUIMessages } from "@/lib/utils";

export default async function MultiToolsChatPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const chatId = params.id;

  const chat = await getChatById({ id: chatId });

  if (!chat || chat.userId !== session?.user?.id) {
    notFound();
  }

  // Verify it's a multi-tools chat
  if (chat.agentType !== "multi-tools") {
    notFound();
  }

  const messages = convertToUIMessages(chat.messages);

  return (
    <>
      <Chat
        autoResume={true}
        id={chatId}
        initialChatModel={chat.messages[0]?.chatModel || DEFAULT_CHAT_MODEL}
        initialMessages={messages}
        initialVisibilityType={chat.visibility}
        isReadonly={false}
        key={chatId}
        agentType="multi-tools"
      />
      <DataStreamHandler />
    </>
  );
}
```

**Note:** Requires updating `Chat` component to accept `agentType` prop.

**Validation:**
- [ ] Multi-tools page loads
- [ ] Can create new multi-tools chat
- [ ] Chat saved with correct agent type

---

### Step 5.2: Update Chat Component

**Duration:** 1 hour
**Risk:** Medium
**Breaking:** No

**File:** `components/chat.tsx`

Add `agentType` prop:

```typescript
type ChatProps = {
  // ... existing props
  agentType?: "chat-general" | "multi-tools" | "multi-agent" | "rag";
};

export function Chat({
  // ... existing props
  agentType = "chat-general",
}: ChatProps) {
  // Pass agentType to API call
  // In handleSubmit or equivalent:

  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      chatId: id,
      message: input,
      selectedChatModel,
      selectedVisibilityType,
      agentType, // ADD THIS
    }),
  });
}
```

**Validation:**
- [ ] Chat component compiles
- [ ] Agent type passed correctly
- [ ] Existing chats unaffected

---

### Step 5.3: Create Agent-Specific API Endpoints (Optional)

**Duration:** 2 hours per agent
**Risk:** Low
**Breaking:** No

**Alternative approach:** Instead of separate endpoints, extend `/api/chat` to handle all agent types (simpler).

**If separate endpoints desired:**

**File:** `app/api/agents/multi-tools/chat/route.ts`

```typescript
import { handleChatStream } from "@/lib/api/chat-handler";
import { auth } from "@/app/(auth)/auth";
import { multiToolsTools } from "@/lib/ai/tools/multi-tools";

export async function POST(request: Request) {
  const session = await auth();

  return handleChatStream({
    request,
    session,
    agentType: "multi-tools",
    tools: multiToolsTools, // Extended tool set
    systemPrompt: "You are a multi-tools AI agent...",
  });
}
```

**Validation:**
- [ ] API endpoint works
- [ ] Returns streaming response
- [ ] Correct tools available

---

### Step 5.4: Replicate for Other Agents

**Duration:** 4-6 hours
**Risk:** Low
**Breaking:** No

Repeat Steps 5.1-5.3 for:
- Multi-Agent (`/agents/multi-agent`)
- RAG Agent (`/agents/rag`)

**Differences:**
- **Multi-Agent**: May need coordinator UI, multiple model calls
- **RAG**: Needs document upload component, vector search integration

**Validation:**
- [ ] All agent types functional
- [ ] Each has unique features
- [ ] Agent type persisted correctly

---

## Phase 6: Independent Tools

### Step 6.1: TODO List Tool

**Duration:** 4 hours
**Risk:** Low
**Breaking:** No

**File:** `components/tools/todo-list/todo-item.tsx`

```typescript
"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { TodoItem } from "@/lib/db/schema";

type TodoItemProps = {
  item: TodoItem;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
};

export function TodoItemComponent({ item, onToggle, onDelete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
      <Checkbox
        checked={item.completed}
        onCheckedChange={(checked) => onToggle(item.id, checked as boolean)}
      />
      <div className="flex-1">
        <p className={item.completed ? "line-through text-muted-foreground" : ""}>
          {item.title}
        </p>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          setIsDeleting(true);
          await onDelete(item.id);
        }}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

**File:** `app/(dashboard)/tools/todo-list/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { TodoItemComponent } from "@/components/tools/todo-list/todo-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TodoItem } from "@/lib/db/schema";

export default function TodoListPage() {
  const { data: todos, mutate } = useSWR<TodoItem[]>("/api/tools/todo");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!title) return;

    const response = await fetch("/api/tools/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
      toast.success("TODO created");
      setTitle("");
      setDescription("");
      mutate();
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await fetch(`/api/tools/todo/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    mutate();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tools/todo/${id}`, { method: "DELETE" });
    toast.success("TODO deleted");
    mutate();
  };

  return (
    <div className="container max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">TODO List</h1>

      <div className="mb-6 space-y-3">
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={handleCreate}>Add TODO</Button>
      </div>

      <div className="space-y-2">
        {todos?.map((item) => (
          <TodoItemComponent
            key={item.id}
            item={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
```

**File:** `app/api/tools/todo/route.ts`

```typescript
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { todoItem } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todos = await db
    .select()
    .from(todoItem)
    .where(eq(todoItem.userId, session.user.id));

  return Response.json(todos);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, priority, dueDate } = await request.json();

  const [created] = await db
    .insert(todoItem)
    .values({
      userId: session.user.id,
      title,
      description,
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
    })
    .returning();

  return Response.json(created);
}
```

**File:** `app/api/tools/todo/[id]/route.ts`

```typescript
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { todoItem } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { completed } = await request.json();

  const [updated] = await db
    .update(todoItem)
    .set({ completed, updatedAt: new Date() })
    .where(
      and(
        eq(todoItem.id, params.id),
        eq(todoItem.userId, session.user.id)
      )
    )
    .returning();

  return Response.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db
    .delete(todoItem)
    .where(
      and(
        eq(todoItem.id, params.id),
        eq(todoItem.userId, session.user.id)
      )
    );

  return Response.json({ success: true });
}
```

**Validation:**
- [ ] TODO list displays
- [ ] Can create new TODOs
- [ ] Can toggle completion
- [ ] Can delete TODOs
- [ ] Only sees own TODOs

---

### Step 6.2: File Storage Tool (Simplified)

**Duration:** 3 hours
**Risk:** Low
**Breaking:** No

**File:** `app/(dashboard)/tools/file-storage/page.tsx`

```typescript
"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StoredFile } from "@/lib/db/schema";

export default function FileStoragePage() {
  const { data: files, mutate } = useSWR<StoredFile[]>("/api/tools/storage");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/tools/storage/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      toast.success("File uploaded");
      mutate();
    } else {
      toast.error("Upload failed");
    }

    setUploading(false);
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">File Storage</h1>

      <div className="mb-6">
        <Input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
        />
      </div>

      <div className="space-y-2">
        {files?.map((file) => (
          <div key={file.id} className="p-3 border rounded-lg">
            <p className="font-medium">{file.fileName}</p>
            <p className="text-sm text-muted-foreground">
              {(file.fileSize / 1024).toFixed(2)} KB
            </p>
            <Button
              variant="link"
              asChild
            >
              <a href={file.blobUrl} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**API routes similar to TODO** - omitted for brevity.

**Validation:**
- [ ] Can upload files
- [ ] Files listed correctly
- [ ] Download links work

---

### Step 6.3: User Chat Tool (Simplified)

**Duration:** 4 hours
**Risk:** Low
**Breaking:** No

**Placeholder implementation** - displays list of users and basic messaging.

**File:** `app/(dashboard)/tools/user-chat/page.tsx`

```typescript
"use client";

import { useState } from "react";
import useSWR from "swr";

export default function UserChatPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Chat</h1>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
}
```

**Validation:**
- [ ] Page loads
- [ ] Shows placeholder

---

## Phase 7: Polish & Testing

### Step 7.1: Update Profile Page

**Duration:** 2 hours
**Risk:** Low
**Breaking:** No

**File:** `app/(dashboard)/profile/page.tsx`

```typescript
import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <p className="text-muted-foreground">{session.user.email}</p>
        </div>

        {/* Add profile editing later */}
      </div>
    </div>
  );
}
```

**Validation:**
- [ ] Profile page loads
- [ ] Shows user email
- [ ] No errors

---

### Step 7.2: Update Metrics Page

**Duration:** 2 hours
**Risk:** Low
**Breaking:** No

Enhance existing stats page with multi-agent metrics.

**File:** `app/(dashboard)/metrics/page.tsx`

Add agent-specific usage stats.

**Validation:**
- [ ] Metrics page shows all data
- [ ] Charts render correctly

---

### Step 7.3: E2E Testing

**Duration:** 3 hours
**Risk:** Low
**Breaking:** No

**File:** `tests/e2e/dashboard-navigation.test.ts`

```typescript
import { test, expect } from "@playwright/test";

test("dashboard menu displays all tools", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page.locator("text=General Chat")).toBeVisible();
  await expect(page.locator("text=Multi-Tools")).toBeVisible();
  await expect(page.locator("text=TODO List")).toBeVisible();
});

test("can navigate to agent from dashboard", async ({ page }) => {
  await page.goto("/dashboard");

  await page.click("text=General Chat");
  await expect(page).toHaveURL(/\/dashboard\/agents\/chat-general/);
});

test("sidebar navigation works", async ({ page }) => {
  await page.goto("/dashboard");

  await page.click("text=TODO List");
  await expect(page).toHaveURL("/dashboard/tools/todo-list");

  await page.click("text=Profile");
  await expect(page).toHaveURL("/dashboard/profile");
});
```

**Run tests:**
```bash
pnpm test
```

**Validation:**
- [ ] All navigation tests pass
- [ ] No console errors
- [ ] Redirects work correctly

---

### Step 7.4: Documentation Updates

**Duration:** 2 hours
**Risk:** None
**Breaking:** No

**Update:** `CLAUDE.md`

Add new sections:
- Multi-tool dashboard structure
- Agent types and routing
- New tool APIs
- Database schema changes

**Update:** `docs/architecture/dashboard-multi-tool-architecture.md`

Mark as "Implemented" and add any deviation notes.

**Validation:**
- [ ] Documentation accurate
- [ ] Examples up to date
- [ ] Architecture diagrams match reality

---

## Rollback Plan

### If Issues Occur

**Phase 1-3 (Foundation):**
- Delete new directories
- Restore old `app-sidebar.tsx`
- Revert `app/(dashboard)/page.tsx` to redirect

**Phase 4 (Chat Migration):**
- Restore `app/(dashboard)/dashboard/chat/`
- Remove agent-specific chat routes
- Revert middleware changes

**Phase 5-6 (New Features):**
- Simply hide routes (404 or redirect)
- Database tables can remain (not breaking)

**Database Migration Rollback:**
```sql
-- Remove agentType field
ALTER TABLE "Chat" DROP COLUMN "agentType";

-- Drop new tables
DROP TABLE "StoredFile";
DROP TABLE "UserMessage";
DROP TABLE "TodoItem";
DROP TABLE "AgentType";
```

---

## Post-Implementation Checklist

### Functionality
- [ ] All routes accessible
- [ ] Sidebar navigation works
- [ ] Dashboard menu displays correctly
- [ ] Chat-general agent functional
- [ ] Multi-tools agent functional (if implemented)
- [ ] TODO list CRUD operations work
- [ ] File storage uploads/downloads work
- [ ] Profile page displays
- [ ] Metrics page displays
- [ ] Settings page unchanged

### Data Integrity
- [ ] Existing chats have `agentType = 'chat-general'`
- [ ] New chats assign correct agent type
- [ ] No data loss during migration
- [ ] User associations correct

### Performance
- [ ] Page load times acceptable
- [ ] No N+1 query issues
- [ ] Database indexes added
- [ ] Code splitting effective

### Security
- [ ] User can only access own data
- [ ] Agent type validated on backend
- [ ] File uploads secured
- [ ] TODO items user-scoped

### UX
- [ ] Mobile responsive
- [ ] Sidebar collapse works
- [ ] Active state highlights correct
- [ ] Loading states present
- [ ] Error messages clear

### Testing
- [ ] E2E tests pass
- [ ] Manual testing complete
- [ ] No console errors
- [ ] No TypeScript errors

### Documentation
- [ ] CLAUDE.md updated
- [ ] Architecture docs updated
- [ ] Implementation plan complete
- [ ] ADR created if necessary

---

## Timeline Summary

| Phase | Tasks | Duration | Dependencies |
|-------|-------|----------|--------------|
| **Phase 1** | Foundation setup | 1-2 days | None |
| **Phase 2** | Database migration | 1 day | Phase 1 |
| **Phase 3** | Core components | 2-3 days | Phase 1 |
| **Phase 4** | Agent migration | 2-3 days | Phases 2, 3 |
| **Phase 5** | New agents | 3-5 days | Phase 4 |
| **Phase 6** | Independent tools | 3-4 days | Phase 2 |
| **Phase 7** | Polish & testing | 2-3 days | All phases |

**Total:** 14-21 working days (2-4 weeks)

---

## Success Criteria

This implementation is successful when:

1. Users can access a dashboard menu showing all tools
2. Existing chat functionality works as "General Chat" agent
3. New agent types (Multi-Tools, Multi-Agent, RAG) are accessible
4. Independent tools (TODO, File Storage) are functional
5. Database correctly tracks agent types
6. No data loss or breaking changes to existing chats
7. All E2E tests pass
8. Documentation is up to date

---

## Notes

- **Incremental deployment** is key - each phase should be deployable
- **Feature flags** recommended for gradual rollout
- **Backward compatibility** maintained throughout
- **Database migrations** are reversible
- **Component reuse** maximized to reduce duplication

This plan provides a clear, step-by-step path to transform the Chat SDK into a comprehensive multi-tool dashboard while minimizing risk and maintaining system stability.

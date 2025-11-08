# Dashboard Multi-Tool Architecture

**Date:** 2025-11-07
**Status:** Proposed
**Author:** Architecture Designer Agent

---

## Executive Summary

This document outlines the architecture for transforming the current Chat SDK application from a single-purpose chat interface into a comprehensive **multi-tool dashboard** with multiple AI agents and independent tools.

### Key Changes

1. Transform `app/(dashboard)/` from a chat-only application to a dashboard hub
2. Introduce menu-based navigation with tool categorization
3. Support multiple AI agent types with isolated data contexts
4. Add independent productivity tools (Chat Usuarios, TODO List, File Storage)
5. Implement responsive sidebar navigation (collapsible desktop, hidden mobile)
6. Add user profile, settings, and usage metrics

---

## Current Architecture Analysis

### Existing Structure

```
app/
├── (auth)/                    # Authentication routes
│   ├── login/
│   ├── register/
│   └── api/auth/
├── (dashboard)/               # Current dashboard (chat-focused)
│   ├── layout.tsx            # Has AppSidebar + SidebarProvider
│   └── dashboard/
│       ├── page.tsx          # Redirects to /dashboard/chat
│       ├── chat/             # Chat routes
│       ├── documents/        # Documents page
│       ├── settings/         # Settings page
│       └── stats/            # Stats page
├── (public)/                  # Landing page
└── api/                       # API routes
    ├── chat/
    ├── document/
    ├── history/
    ├── vote/
    ├── files/upload/
    └── suggestions/
```

### Current Components (Reusable)

**Core Chat Components:**
- `components/chat.tsx` - Main chat interface
- `components/messages.tsx` - Message list with scroll
- `components/message.tsx` - Individual message bubble
- `components/multimodal-input.tsx` - Input with file upload
- `components/model-selector.tsx` - AI model selection

**Artifact System:**
- `components/artifact.tsx` - Artifact viewer
- `artifacts/code/`, `artifacts/text/`, `artifacts/sheet/`, `artifacts/image/`

**Sidebar Components:**
- `components/app-sidebar.tsx` - Current chat-focused sidebar
- `components/sidebar-history.tsx` - Chat history
- `components/sidebar-user-nav.tsx` - User navigation

**UI Primitives (shadcn/ui):**
- `components/ui/sidebar.tsx` - Base sidebar components
- `components/ui/button.tsx`, `components/ui/card.tsx`, etc.

### Current Database Schema

**Tables:**
- `User` - User accounts
- `Chat` - Conversations (userId, title, visibility)
- `Message_v2` - Chat messages
- `Document` - Artifacts
- `Vote_v2` - Message votes
- `Stream` - Resumable streams

---

## Proposed Architecture

### New Directory Structure

```
app/
├── (auth)/                         # No changes
├── (public)/                       # No changes
├── (dashboard)/
│   ├── layout.tsx                 # NEW: Dashboard layout with multi-tool sidebar
│   ├── page.tsx                   # NEW: Dashboard menu hub (tools grid)
│   │
│   ├── agents/                    # AI Agent Tools
│   │   ├── chat-general/         # General Chat (current chat functionality)
│   │   │   ├── page.tsx          # New chat
│   │   │   └── [id]/page.tsx     # Existing chat
│   │   ├── multi-tools/          # Multi-Tools Agent
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── multi-agent/          # Multi-Agent System
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── rag/                   # RAG Agent
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   │
│   ├── tools/                     # Independent Tools
│   │   ├── user-chat/            # Chat between users
│   │   │   └── page.tsx
│   │   ├── todo-list/            # TODO List
│   │   │   └── page.tsx
│   │   └── file-storage/         # File Storage
│   │       └── page.tsx
│   │
│   ├── profile/                   # User Profile
│   │   └── page.tsx
│   ├── settings/                  # Settings (already exists)
│   │   └── page.tsx
│   └── metrics/                   # Usage Metrics (rename from stats/)
│       └── page.tsx
│
└── api/
    ├── chat/                      # Existing chat API
    ├── agents/                    # NEW: Agent-specific APIs
    │   ├── multi-tools/
    │   ├── multi-agent/
    │   └── rag/
    ├── tools/                     # NEW: Independent tool APIs
    │   ├── user-chat/
    │   ├── todo/
    │   └── storage/
    ├── document/                  # Existing
    ├── history/                   # Existing (may need extension)
    ├── vote/                      # Existing
    ├── files/upload/              # Existing
    └── suggestions/               # Existing
```

### Component Architecture

```
components/
├── dashboard/                     # NEW: Dashboard-specific components
│   ├── dashboard-sidebar.tsx     # Multi-tool sidebar with navigation
│   ├── dashboard-menu.tsx        # Tool grid menu
│   ├── tool-card.tsx             # Individual tool card
│   └── sidebar-nav-item.tsx      # Navigation item component
│
├── agents/                        # NEW: Agent-specific components
│   ├── chat-general/             # Reuses existing chat components
│   ├── multi-tools/              # New agent UI
│   ├── multi-agent/              # New agent UI
│   └── rag/                       # New agent UI with document upload
│
├── tools/                         # NEW: Independent tool components
│   ├── user-chat/
│   ├── todo-list/
│   └── file-storage/
│
├── chat.tsx                       # EXISTING (reusable)
├── messages.tsx                   # EXISTING (reusable)
├── message.tsx                    # EXISTING (reusable)
├── multimodal-input.tsx          # EXISTING (reusable)
├── model-selector.tsx            # EXISTING (reusable)
├── artifact.tsx                   # EXISTING (reusable)
├── sidebar-user-nav.tsx          # EXISTING (reusable)
└── ui/                            # EXISTING (no changes)
```

---

## Database Schema Extensions

### New Tables

```typescript
// Agent Type Classification
export const agentType = pgTable("AgentType", {
  id: varchar("id", { length: 50 }).primaryKey(), // 'chat-general', 'multi-tools', 'multi-agent', 'rag'
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("isActive").notNull().default(true),
});

// Extended Chat Table (with agent type)
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
  agentType: varchar("agentType", { length: 50 })  // NEW FIELD
    .notNull()
    .default("chat-general")
    .references(() => agentType.id),
});

// TODO List Items
export const todoItem = pgTable("TodoItem", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  priority: varchar("priority", { enum: ["low", "medium", "high"] })
    .notNull()
    .default("medium"),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// User-to-User Chat Messages
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

// File Storage
export const storedFile = pgTable("StoredFile", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  fileName: text("fileName").notNull(),
  fileType: text("fileType").notNull(),
  fileSize: integer("fileSize").notNull(),
  blobUrl: text("blobUrl").notNull(), // Vercel Blob URL
  folder: text("folder"), // Optional folder organization
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// RAG Document Context (for RAG agent)
export const ragDocument = pgTable("RagDocument", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  chatId: uuid("chatId")
    .references(() => chat.id),
  fileName: text("fileName").notNull(),
  content: text("content").notNull(), // Extracted text content
  embedding: vector("embedding", { dimensions: 1536 }), // For vector search (optional)
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
```

### Migration Strategy

**Phase 1: Add agentType field to Chat table**
- Add nullable `agentType` field
- Backfill existing chats with `'chat-general'`
- Make field non-nullable with default

**Phase 2: Add new tables incrementally**
- `AgentType` (seed with initial types)
- `TodoItem`
- `UserMessage`
- `StoredFile`
- `RagDocument` (optional, phase 3)

---

## UI/UX Architecture

### Dashboard Layout Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Dashboard Layout (app/(dashboard)/layout.tsx)              │
│ ┌───────────────┬─────────────────────────────────────────┐ │
│ │               │                                         │ │
│ │  Sidebar      │  Main Content Area                      │ │
│ │  (collapsible)│  (SidebarInset)                        │ │
│ │               │                                         │ │
│ │  - Logo       │  {children}                            │ │
│ │  - Nav Items  │                                         │ │
│ │    · Agents   │  Rendered based on route:              │ │
│ │    · Tools    │  - /dashboard → Dashboard Menu         │ │
│ │    · Profile  │  - /agents/* → Agent Page              │ │
│ │    · Settings │  - /tools/* → Tool Page                │ │
│ │    · Metrics  │  - /profile → Profile Page             │ │
│ │               │  - etc.                                 │ │
│ │  - User Nav   │                                         │ │
│ └───────────────┴─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard Menu (Home Page)

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard Home                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AI Agents                                           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │  │
│  │  │ General  │ │  Multi   │ │  Multi   │ │  RAG   │  │  │
│  │  │  Chat    │ │  Tools   │ │  Agent   │ │ Agent  │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tools                                               │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐             │  │
│  │  │   User   │ │   TODO   │ │   File   │             │  │
│  │  │   Chat   │ │   List   │ │ Storage  │             │  │
│  │  └──────────┘ └──────────┘ └──────────┘             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Quick Stats                                         │  │
│  │  Messages: 150 | Tokens: 125K | Files: 23           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar Navigation Structure

```typescript
// Navigation structure
const navigation = {
  agents: [
    { id: 'chat-general', label: 'General Chat', icon: MessageSquare, href: '/dashboard/agents/chat-general' },
    { id: 'multi-tools', label: 'Multi-Tools', icon: Wrench, href: '/dashboard/agents/multi-tools' },
    { id: 'multi-agent', label: 'Multi-Agent', icon: Users, href: '/dashboard/agents/multi-agent' },
    { id: 'rag', label: 'RAG Agent', icon: FileText, href: '/dashboard/agents/rag' },
  ],
  tools: [
    { id: 'user-chat', label: 'User Chat', icon: MessageCircle, href: '/dashboard/tools/user-chat' },
    { id: 'todo-list', label: 'TODO List', icon: CheckSquare, href: '/dashboard/tools/todo-list' },
    { id: 'file-storage', label: 'File Storage', icon: FolderOpen, href: '/dashboard/tools/file-storage' },
  ],
  account: [
    { id: 'profile', label: 'Profile', icon: User, href: '/dashboard/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
    { id: 'metrics', label: 'Metrics', icon: BarChart, href: '/dashboard/metrics' },
  ],
};
```

### Responsive Behavior

**Desktop (>= 1024px):**
- Sidebar visible by default
- Collapsible via toggle button
- State persisted in cookie (`sidebar_state`)

**Tablet (768px - 1023px):**
- Sidebar collapsed by default
- Expands on hover or click
- State persisted

**Mobile (< 768px):**
- Sidebar hidden completely
- Accessible via hamburger menu
- Overlay mode when open
- Auto-closes on navigation

---

## Routing Architecture

### Route Pattern Design

**Pattern 1: Agent Routes**
```
/dashboard/agents/{agent-type}       → New conversation
/dashboard/agents/{agent-type}/[id]  → Existing conversation
```

**Pattern 2: Tool Routes**
```
/dashboard/tools/{tool-name}         → Tool interface
```

**Pattern 3: Account Routes**
```
/dashboard/profile
/dashboard/settings
/dashboard/metrics
```

### URL Examples

```
/dashboard                           → Dashboard menu
/dashboard/agents/chat-general       → New general chat
/dashboard/agents/chat-general/abc   → Existing chat conversation
/dashboard/agents/multi-tools        → New multi-tools session
/dashboard/agents/rag                → New RAG session
/dashboard/tools/todo-list           → TODO list interface
/dashboard/tools/file-storage        → File manager
/dashboard/profile                   → User profile
/dashboard/metrics                   → Usage metrics
```

---

## Component Reusability Matrix

### Existing Components

| Component | Chat General | Multi-Tools | Multi-Agent | RAG | User Chat | TODO | Storage |
|-----------|--------------|-------------|-------------|-----|-----------|------|---------|
| `chat.tsx` | ✅ Reuse | ✅ Reuse | ✅ Adapt | ✅ Adapt | ❌ New | ❌ N/A | ❌ N/A |
| `messages.tsx` | ✅ Reuse | ✅ Reuse | ✅ Adapt | ✅ Reuse | ✅ Adapt | ❌ N/A | ❌ N/A |
| `message.tsx` | ✅ Reuse | ✅ Reuse | ✅ Adapt | ✅ Reuse | ✅ Adapt | ❌ N/A | ❌ N/A |
| `multimodal-input.tsx` | ✅ Reuse | ✅ Reuse | ✅ Reuse | ✅ Reuse | ✅ Adapt | ❌ N/A | ❌ N/A |
| `model-selector.tsx` | ✅ Reuse | ✅ Reuse | ✅ Reuse | ✅ Reuse | ❌ N/A | ❌ N/A | ❌ N/A |
| `artifact.tsx` | ✅ Reuse | ✅ Reuse | ✅ Reuse | ✅ Reuse | ❌ N/A | ❌ N/A | ❌ N/A |
| `sidebar-user-nav.tsx` | ✅ Reuse | ✅ Reuse | ✅ Reuse | ✅ Reuse | ✅ Reuse | ✅ Reuse | ✅ Reuse |

**Legend:**
- ✅ **Reuse** - Use as-is
- ✅ **Adapt** - Minor modifications needed
- ❌ **New** - Create new component
- ❌ **N/A** - Not applicable

### New Components Required

1. **Dashboard Navigation**
   - `components/dashboard/dashboard-sidebar.tsx` - New multi-section sidebar
   - `components/dashboard/dashboard-menu.tsx` - Dashboard home menu grid
   - `components/dashboard/tool-card.tsx` - Tool card component
   - `components/dashboard/sidebar-nav-section.tsx` - Collapsible nav section

2. **Agent-Specific Components**
   - `components/agents/multi-tools/agent-chat.tsx` - Multi-tools agent interface
   - `components/agents/multi-agent/coordinator-view.tsx` - Multi-agent coordinator
   - `components/agents/rag/document-upload.tsx` - RAG document upload

3. **Tool Components**
   - `components/tools/user-chat/conversation-list.tsx` - User chat list
   - `components/tools/user-chat/message-thread.tsx` - User message thread
   - `components/tools/todo-list/todo-item.tsx` - TODO item component
   - `components/tools/todo-list/todo-list.tsx` - TODO list container
   - `components/tools/file-storage/file-browser.tsx` - File browser
   - `components/tools/file-storage/file-uploader.tsx` - File upload component

4. **Profile & Metrics**
   - `components/profile/profile-form.tsx` - Profile editor
   - `components/metrics/usage-charts.tsx` - Usage visualization

---

## Migration Path (Files & Folders)

### Phase 1: Restructure Routes (Non-Breaking)

**Move existing routes:**
```bash
# Current structure
app/(dashboard)/dashboard/chat/          → KEEP (will move in Phase 2)
app/(dashboard)/dashboard/documents/     → DELETE (legacy, not used)
app/(dashboard)/dashboard/stats/         → RENAME to metrics/
app/(dashboard)/dashboard/settings/      → KEEP
app/(dashboard)/dashboard/page.tsx       → MODIFY (redirect to /dashboard/chat → menu)

# Migration actions
1. Create: app/(dashboard)/agents/chat-general/
2. Copy: dashboard/chat/* → agents/chat-general/*
3. Create: app/(dashboard)/metrics/
4. Move: dashboard/stats/page.tsx → metrics/page.tsx
5. Delete: dashboard/documents/
```

**No breaking changes yet** - all existing routes continue to work.

### Phase 2: Create New Structure

**Create directories:**
```bash
mkdir app/(dashboard)/agents/multi-tools
mkdir app/(dashboard)/agents/multi-agent
mkdir app/(dashboard)/agents/rag
mkdir app/(dashboard)/tools/user-chat
mkdir app/(dashboard)/tools/todo-list
mkdir app/(dashboard)/tools/file-storage
mkdir app/(dashboard)/profile

mkdir components/dashboard
mkdir components/agents
mkdir components/tools
mkdir components/profile
mkdir components/metrics
```

**Create placeholder pages:**
- Each new route gets a minimal `page.tsx` with "Coming Soon" UI

### Phase 3: Migrate Chat to Agents

**Critical change:**
```bash
# Update all references from:
/dashboard/chat → /dashboard/agents/chat-general

# Files to update:
- middleware.ts (redirect rules)
- app/(dashboard)/layout.tsx
- components/app-sidebar.tsx → components/dashboard/dashboard-sidebar.tsx
- All internal links
```

### Phase 4: Update Sidebar

**Replace `app-sidebar.tsx`:**
```typescript
// Old: components/app-sidebar.tsx (chat-focused)
// New: components/dashboard/dashboard-sidebar.tsx (multi-tool)

// Changes:
- Add navigation sections (Agents, Tools, Account)
- Add collapsible groups
- Update routing logic
- Add active state detection
```

### Phase 5: Update Dashboard Home

**Transform `app/(dashboard)/page.tsx`:**
```typescript
// Old: redirect("/dashboard/chat")
// New: render <DashboardMenu /> with tool grid
```

### Phase 6: Database Migration

**Migration file: `add_agent_type_to_chat.sql`**
```sql
-- Add agentType field to Chat table
ALTER TABLE "Chat" ADD COLUMN "agentType" VARCHAR(50);

-- Create AgentType table
CREATE TABLE "AgentType" (
  "id" VARCHAR(50) PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- Seed agent types
INSERT INTO "AgentType" ("id", "name", "description", "isActive") VALUES
  ('chat-general', 'General Chat', 'Standard AI conversation', true),
  ('multi-tools', 'Multi-Tools Agent', 'AI with extended tool capabilities', true),
  ('multi-agent', 'Multi-Agent System', 'Coordinated multi-agent workflows', true),
  ('rag', 'RAG Agent', 'Retrieval-Augmented Generation with document context', true);

-- Backfill existing chats
UPDATE "Chat" SET "agentType" = 'chat-general' WHERE "agentType" IS NULL;

-- Make agentType non-nullable
ALTER TABLE "Chat" ALTER COLUMN "agentType" SET NOT NULL;
ALTER TABLE "Chat" ALTER COLUMN "agentType" SET DEFAULT 'chat-general';

-- Add foreign key constraint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_agentType_fkey"
  FOREIGN KEY ("agentType") REFERENCES "AgentType"("id");
```

---

## API Architecture

### Agent API Pattern

**Endpoint structure:**
```
POST /api/agents/{agent-type}/chat
DELETE /api/agents/{agent-type}/chat/[id]
GET /api/agents/{agent-type}/history
```

**Example: Multi-Tools Agent**
```typescript
// app/api/agents/multi-tools/chat/route.ts
export async function POST(request: Request) {
  // Similar to existing /api/chat route
  // But with multi-tools specific:
  // - Extended tool set
  // - Different system prompt
  // - Agent-specific rate limits
}
```

### Tool API Pattern

**Endpoint structure:**
```
GET /api/tools/todo         → List TODO items
POST /api/tools/todo        → Create TODO item
PATCH /api/tools/todo/[id]  → Update TODO item
DELETE /api/tools/todo/[id] → Delete TODO item
```

**Example: TODO API**
```typescript
// app/api/tools/todo/route.ts
export async function GET(request: Request) {
  const session = await auth();
  const todos = await db.select().from(todoItem).where(eq(todoItem.userId, session.user.id));
  return Response.json(todos);
}

export async function POST(request: Request) {
  const session = await auth();
  const { title, description, priority, dueDate } = await request.json();
  // Validate and insert
}
```

### Shared API Logic

**Reuse existing patterns:**
- `/api/chat` logic → Extract to `lib/api/chat-handler.ts`
- Reuse for all agent types with configuration options

```typescript
// lib/api/chat-handler.ts
export async function handleChatStream({
  agentType,
  chatId,
  messages,
  tools,
  systemPrompt,
  model,
}: ChatHandlerOptions) {
  // Unified chat handling logic
  // Used by all agent APIs
}
```

---

## Design Decisions & Trade-offs

### Decision 1: Route Group Structure

**Chosen:** `app/(dashboard)/agents/*` and `app/(dashboard)/tools/*`

**Alternatives considered:**
1. Flat structure: `/dashboard/chat-general`, `/dashboard/multi-tools`
2. Type-based grouping: `/dashboard/ai/chat-general`, `/dashboard/productivity/todo`

**Rationale:**
- Clear separation between AI agents and productivity tools
- Scalable: easy to add new agents/tools
- Intuitive URL structure
- Aligns with mental model: "agents" = AI, "tools" = utilities

**Trade-offs:**
- Slightly longer URLs
- More directory nesting

---

### Decision 2: Database Schema Extension vs. Separate Databases

**Chosen:** Single database with `agentType` discriminator

**Alternatives considered:**
1. Separate databases per agent type
2. Polymorphic tables with JSON configuration

**Rationale:**
- Simpler deployment and backup
- Easier cross-agent queries (e.g., "all user conversations")
- Reduced infrastructure complexity
- Agent type is a property, not a separate entity

**Trade-offs:**
- Larger main database
- Some agent-specific fields may be unused
- Need careful indexing for performance

---

### Decision 3: Component Reusability Strategy

**Chosen:** Reuse existing chat components with props for customization

**Alternatives considered:**
1. Duplicate components for each agent type
2. Create abstraction layer with render props

**Rationale:**
- DRY principle: avoid code duplication
- Consistent UX across agent types
- Easier maintenance and bug fixes
- Props provide sufficient flexibility

**Trade-offs:**
- Components may become more complex
- Risk of prop explosion (mitigate with composition)

---

### Decision 4: Sidebar Architecture

**Chosen:** Completely new sidebar component with multi-section navigation

**Alternatives considered:**
1. Extend existing `app-sidebar.tsx` with conditional rendering
2. Multiple sidebars swapped based on route

**Rationale:**
- Current sidebar is tightly coupled to chat history
- Clean separation of concerns
- Easier to test and maintain
- Allows for different sidebar states per section

**Trade-offs:**
- Initial development time
- Need to migrate existing functionality

---

## Performance Considerations

### Code Splitting

**Route-based splitting:**
- Each agent/tool loads only necessary code
- Shared components in common chunk
- Lazy-load heavy editors (CodeMirror, ProseMirror)

**Strategy:**
```typescript
// Example: Lazy load RAG agent components
const RagDocumentUpload = dynamic(() => import('@/components/agents/rag/document-upload'), {
  loading: () => <Skeleton />,
});
```

### Database Query Optimization

**Indexes to add:**
```sql
CREATE INDEX idx_chat_user_agent ON "Chat"("userId", "agentType");
CREATE INDEX idx_message_chat ON "Message_v2"("chatId");
CREATE INDEX idx_todo_user_completed ON "TodoItem"("userId", "completed");
CREATE INDEX idx_stored_file_user ON "StoredFile"("userId");
```

### Caching Strategy

**SWR caching:**
- Dashboard menu: cache tool cards
- Agent history: cache per agent type
- TODO list: optimistic updates
- File storage: cache file list

**Redis caching (optional):**
- User preferences
- Frequently accessed chat summaries
- Cross-user statistics

---

## Security Considerations

### Route Authorization

**Middleware updates:**
```typescript
// middleware.ts additions
const premiumAgentTypes = ['multi-agent', 'rag'];
const userPlan = await getUserPlan(token.userId);

if (premiumAgentTypes.includes(agentType) && userPlan === 'free') {
  return NextResponse.redirect('/dashboard?error=upgrade_required');
}
```

### Data Isolation

**Ensure:**
- User can only access their own chats (all agent types)
- TODO items are user-scoped
- File storage enforces user ownership
- User-to-user chat validates both parties

**Query pattern:**
```typescript
// Always include userId in WHERE clause
db.select()
  .from(chat)
  .where(and(
    eq(chat.userId, session.user.id),
    eq(chat.agentType, agentType)
  ));
```

---

## Testing Strategy

### Unit Tests

**Components:**
- Dashboard menu rendering
- Sidebar navigation state
- Tool cards click handlers
- Agent-specific components

**API Routes:**
- Agent chat endpoints
- TODO CRUD operations
- File upload/download
- User messaging

### Integration Tests

**Playwright E2E:**
```typescript
// tests/e2e/dashboard-navigation.test.ts
test('navigate between agents', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('text=Multi-Tools');
  await expect(page).toHaveURL('/dashboard/agents/multi-tools');
});

// tests/e2e/todo-list.test.ts
test('create and complete TODO', async ({ page }) => {
  await page.goto('/dashboard/tools/todo-list');
  await page.fill('input[name="title"]', 'Test task');
  await page.click('button:has-text("Add")');
  await expect(page.locator('text=Test task')).toBeVisible();
});
```

### Migration Testing

**Verify:**
1. Existing chat URLs redirect correctly
2. Old data loads in new structure
3. No broken links in sidebar
4. Agent type is set correctly for all chats

---

## Accessibility Requirements

### Keyboard Navigation

**Sidebar:**
- Tab through navigation items
- Enter/Space to activate
- Escape to close (mobile)

**Dashboard Menu:**
- Arrow keys to navigate tool cards
- Enter to select

**Compliance:**
- ARIA labels on all interactive elements
- Semantic HTML (`<nav>`, `<main>`, `<aside>`)
- Focus indicators
- Screen reader announcements

---

## Deployment & Rollout

### Feature Flags (Recommended)

```typescript
// lib/feature-flags.ts
export const features = {
  multiToolsDashboard: process.env.FEATURE_MULTI_TOOLS === 'true',
  ragAgent: process.env.FEATURE_RAG === 'true',
  userChat: process.env.FEATURE_USER_CHAT === 'true',
};

// Gradual rollout
if (!features.multiToolsDashboard) {
  redirect('/dashboard/chat'); // Old behavior
}
```

### Migration Checklist

**Pre-deployment:**
- [ ] Database migrations tested in staging
- [ ] All new routes have placeholder pages
- [ ] Existing routes continue to work
- [ ] E2E tests pass

**Deployment:**
- [ ] Deploy with feature flags OFF
- [ ] Run database migrations
- [ ] Enable feature flags incrementally
- [ ] Monitor error rates

**Post-deployment:**
- [ ] User feedback collection
- [ ] Performance monitoring
- [ ] Gradual rollout to all users

---

## Future Considerations

### Extensibility

**Plugin system (future):**
- Allow third-party agents
- Custom tool integration
- Marketplace for agent types

### Internationalization

**Prepare for:**
- Multi-language sidebar labels
- Localized agent system prompts
- Date/time formatting in TODO list

### Analytics

**Track:**
- Agent usage by type
- Tool engagement
- User journey flows
- Performance metrics per agent

---

## Summary

This architecture transforms the Chat SDK into a **comprehensive dashboard platform** while:

1. **Preserving existing functionality** - Chat continues to work as "General Chat" agent
2. **Enabling scalability** - Easy to add new agents and tools
3. **Maintaining performance** - Code splitting and caching strategies
4. **Ensuring security** - Proper authorization and data isolation
5. **Following best practices** - TypeScript, shadcn/ui, Next.js patterns

The migration can be done **incrementally**, minimizing risk and allowing for continuous deployment.

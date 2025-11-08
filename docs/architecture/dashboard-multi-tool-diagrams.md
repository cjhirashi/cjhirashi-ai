# Dashboard Multi-Tool Visual Diagrams

**Date:** 2025-11-07
**Related Documents:**
- [Architecture](./dashboard-multi-tool-architecture.md)
- [Implementation Plan](./dashboard-multi-tool-implementation.md)

---

## System Architecture Overview

### Current vs. Proposed Architecture

```
CURRENT ARCHITECTURE (Chat-Only)
═══════════════════════════════════════════════════════════

User Request → /dashboard → redirect → /dashboard/chat
                                            ↓
                                    ┌───────────────┐
                                    │  Chat Page    │
                                    │  - Messages   │
                                    │  - Input      │
                                    │  - History    │
                                    └───────────────┘
                                            ↓
                                    POST /api/chat
                                            ↓
                                    ┌───────────────┐
                                    │  Chat Table   │
                                    │  (no type)    │
                                    └───────────────┘


PROPOSED ARCHITECTURE (Multi-Tool Dashboard)
═══════════════════════════════════════════════════════════

User Request → /dashboard
        ↓
┌───────────────────────────────────────────────────────────┐
│                   Dashboard Menu                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  AI Agents                                          │  │
│  │  [General] [Multi-Tools] [Multi-Agent] [RAG]       │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Tools                                              │  │
│  │  [User Chat] [TODO List] [File Storage]            │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Account                                            │  │
│  │  [Profile] [Settings] [Metrics]                    │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
        │
        ├─→ /agents/chat-general → POST /api/chat (agentType: chat-general)
        ├─→ /agents/multi-tools → POST /api/chat (agentType: multi-tools)
        ├─→ /agents/rag         → POST /api/chat (agentType: rag)
        ├─→ /tools/todo-list    → GET/POST /api/tools/todo
        ├─→ /tools/file-storage → POST /api/tools/storage/upload
        └─→ /profile            → Profile Page

Database Tables:
┌────────────────┐  ┌─────────────┐  ┌──────────────┐
│ Chat           │  │ TodoItem    │  │ StoredFile   │
│ + agentType    │  │             │  │              │
└────────────────┘  └─────────────┘  └──────────────┘
```

---

## Navigation Flow Diagram

### User Journey Through Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: User Logs In                                           │
│  /login → Authenticate → Session Created                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Redirect to Dashboard                                  │
│  middleware.ts: authenticated users → /dashboard                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Dashboard Menu Displayed                               │
│                                                                 │
│  ┌──────────────────┬────────────────────────────────────────┐  │
│  │                  │                                        │  │
│  │   Sidebar        │         Main Content                   │  │
│  │   (Collapsible)  │                                        │  │
│  │                  │  ┌─────────────────────────────────┐   │  │
│  │   AI Agents      │  │   Tool Cards Grid               │   │  │
│  │   - General      │  │                                 │   │  │
│  │   - Multi-Tools  │  │  [Card] [Card] [Card] [Card]   │   │  │
│  │   - Multi-Agent  │  │  [Card] [Card] [Card]          │   │  │
│  │   - RAG          │  │  [Card] [Card] [Card]          │   │  │
│  │                  │  │                                 │   │  │
│  │   Tools          │  └─────────────────────────────────┘   │  │
│  │   - User Chat    │                                        │  │
│  │   - TODO List    │                                        │  │
│  │   - File Storage │                                        │  │
│  │                  │                                        │  │
│  │   Account        │                                        │  │
│  │   - Profile      │                                        │  │
│  │   - Settings     │                                        │  │
│  │   - Metrics      │                                        │  │
│  │                  │                                        │  │
│  └──────────────────┴────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
         User Clicks Tool Card or Sidebar Link
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Navigate to Selected Tool                              │
│                                                                 │
│  Option A: AI Agent (e.g., General Chat)                       │
│  ┌──────────────────┬────────────────────────────────────────┐  │
│  │   Sidebar        │   Chat Interface                       │  │
│  │   (shows history)│   - Messages                           │  │
│  │                  │   - Multimodal Input                   │  │
│  │                  │   - Model Selector                     │  │
│  └──────────────────┴────────────────────────────────────────┘  │
│                                                                 │
│  Option B: Tool (e.g., TODO List)                              │
│  ┌──────────────────┬────────────────────────────────────────┐  │
│  │   Sidebar        │   TODO Interface                       │  │
│  │   (navigation)   │   - Task List                          │  │
│  │                  │   - Add Task Form                      │  │
│  │                  │   - Filters                            │  │
│  └──────────────────┴────────────────────────────────────────┘  │
│                                                                 │
│  Option C: Account (e.g., Profile)                             │
│  ┌──────────────────┬────────────────────────────────────────┐  │
│  │   Sidebar        │   Profile Page                         │  │
│  │   (navigation)   │   - User Info                          │  │
│  │                  │   - Settings                           │  │
│  └──────────────────┴────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### Dashboard Layout Component Tree

```
app/(dashboard)/layout.tsx
│
├─ <SidebarProvider>
│   │
│   ├─ <DashboardSidebar user={session.user}>
│   │   │
│   │   ├─ <SidebarHeader>
│   │   │   └─ Logo Link (/dashboard)
│   │   │
│   │   ├─ <SidebarContent>
│   │   │   │
│   │   │   ├─ <SidebarNavSection section={agents}>
│   │   │   │   ├─ Collapsible Trigger "AI Agents"
│   │   │   │   └─ Collapsible Content
│   │   │   │       ├─ Link → General Chat
│   │   │   │       ├─ Link → Multi-Tools (badge: "New")
│   │   │   │       ├─ Link → Multi-Agent (badge: "Beta")
│   │   │   │       └─ Link → RAG (badge: "New")
│   │   │   │
│   │   │   ├─ <SidebarNavSection section={tools}>
│   │   │   │   ├─ Collapsible Trigger "Tools"
│   │   │   │   └─ Collapsible Content
│   │   │   │       ├─ Link → User Chat
│   │   │   │       ├─ Link → TODO List
│   │   │   │       └─ Link → File Storage
│   │   │   │
│   │   │   └─ <SidebarNavSection section={account}>
│   │   │       └─ Non-collapsible links
│   │   │           ├─ Link → Profile
│   │   │           ├─ Link → Settings
│   │   │           └─ Link → Metrics
│   │   │
│   │   └─ <SidebarFooter>
│   │       └─ <SidebarUserNav user={user}>
│   │           ├─ Avatar
│   │           ├─ User Email
│   │           └─ Sign Out Button
│   │
│   └─ <SidebarInset>
│       └─ {children} ← Page content rendered here
│
└─ <DataStreamProvider>
    └─ Wraps entire layout for streaming support
```

---

## Data Flow Architecture

### AI Agent Chat Flow (e.g., General Chat)

```
┌──────────────┐
│  User Types  │
│   Message    │
└──────┬───────┘
       │
       ↓
┌────────────────────────────────────────────────┐
│  Client: components/chat.tsx                   │
│  - handleSubmit()                              │
│  - Collects: chatId, message, model, agentType│
└────────────────┬───────────────────────────────┘
                 │
                 │ POST /api/chat
                 ↓
┌────────────────────────────────────────────────┐
│  Server: app/api/chat/route.ts                 │
│                                                │
│  1. Validate session (auth())                 │
│  2. Parse request (Zod schema)                │
│  3. Check rate limits (entitlements)          │
│  4. Get or create chat in DB                  │
└────────────────┬───────────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────┐
│  Database: Chat table                          │
│  INSERT or UPDATE                              │
│  - id, userId, title, agentType                │
└────────────────┬───────────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────┐
│  AI Processing: streamText()                   │
│                                                │
│  1. Load chat history from Message_v2          │
│  2. Convert to model messages                  │
│  3. Get system prompt (by agentType)           │
│  4. Get tools (by agentType)                   │
│  5. Stream response with dataStream            │
└────────────────┬───────────────────────────────┘
                 │
                 │ Server-Sent Events (SSE)
                 ↓
┌────────────────────────────────────────────────┐
│  Client: useChat hook                          │
│  - Receives stream chunks                      │
│  - Updates UI in real-time                     │
│  - Appends messages to message list            │
└────────────────┬───────────────────────────────┘
                 │
                 │ onFinish callback
                 ↓
┌────────────────────────────────────────────────┐
│  Server: Save to Database                      │
│                                                │
│  1. Insert user message → Message_v2           │
│  2. Insert assistant response → Message_v2     │
│  3. Update token usage → Chat.lastContext      │
└────────────────────────────────────────────────┘
```

### TODO List Tool Flow

```
┌──────────────┐
│  User Clicks │
│  "Add TODO"  │
└──────┬───────┘
       │
       ↓
┌────────────────────────────────────────────────┐
│  Client: app/(dashboard)/tools/todo-list/      │
│  - handleCreate()                              │
│  - Validates input                             │
└────────────────┬───────────────────────────────┘
                 │
                 │ POST /api/tools/todo
                 ↓
┌────────────────────────────────────────────────┐
│  Server: app/api/tools/todo/route.ts           │
│                                                │
│  1. Validate session                           │
│  2. Parse request body                         │
│  3. Insert into TodoItem table                 │
└────────────────┬───────────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────┐
│  Database: TodoItem table                      │
│  INSERT                                        │
│  - id, userId, title, description, completed   │
└────────────────┬───────────────────────────────┘
                 │
                 │ Response: created item
                 ↓
┌────────────────────────────────────────────────┐
│  Client: SWR mutate()                          │
│  - Refetch TODO list                           │
│  - Update UI                                   │
└────────────────────────────────────────────────┘
```

---

## Database Schema Relationships

### Entity Relationship Diagram

```
┌─────────────────────┐
│      User           │
│─────────────────────│
│ id (PK)             │
│ email               │
│ password            │
└──────┬──────────────┘
       │
       │ 1:N (one user has many...)
       │
       ├──────────────────────────────────────────────┐
       │                                              │
       ↓                                              ↓
┌─────────────────────┐                    ┌──────────────────────┐
│      Chat           │                    │     TodoItem         │
│─────────────────────│                    │──────────────────────│
│ id (PK)             │                    │ id (PK)              │
│ userId (FK)         │                    │ userId (FK)          │
│ title               │                    │ title                │
│ visibility          │                    │ description          │
│ createdAt           │                    │ completed            │
│ agentType (FK) ─────┼──┐                 │ priority             │
│ lastContext         │  │                 │ dueDate              │
└──────┬──────────────┘  │                 └──────────────────────┘
       │                 │
       │ 1:N             │
       │                 │
       ↓                 │
┌─────────────────────┐  │
│    Message_v2       │  │
│─────────────────────│  │
│ id (PK)             │  │
│ chatId (FK)         │  │
│ role                │  │
│ parts               │  │
│ attachments         │  │
│ createdAt           │  │
└─────────────────────┘  │
                         │
                         ↓
              ┌──────────────────────┐
              │     AgentType        │
              │──────────────────────│
              │ id (PK)              │
              │ name                 │
              │ description          │
              │ isActive             │
              └──────────────────────┘
                         │
                         │ Values:
                         │ - chat-general
                         │ - multi-tools
                         │ - multi-agent
                         │ - rag

User 1:N relationships:
- Chat (one user, many chats)
- TodoItem (one user, many todos)
- StoredFile (one user, many files)
- UserMessage (one user, many sent/received messages)

Chat 1:N relationships:
- Message_v2 (one chat, many messages)
- Vote_v2 (one chat, many votes)
- Stream (one chat, one resumable stream)

AgentType 1:N relationships:
- Chat (one agent type, many chats)
```

---

## Route Structure & URL Patterns

### Complete Routing Map

```
/                              → Public landing page
│
├─ /login                      → Login page
├─ /register                   → Registration page
│
└─ /dashboard                  → Dashboard menu (authenticated)
    │
    ├─ /agents                 → AI Agents section
    │   │
    │   ├─ /chat-general       → New general chat
    │   │   └─ /[id]           → Existing chat (id = chatId)
    │   │
    │   ├─ /multi-tools        → New multi-tools session
    │   │   └─ /[id]           → Existing multi-tools chat
    │   │
    │   ├─ /multi-agent        → New multi-agent session
    │   │   └─ /[id]           → Existing multi-agent chat
    │   │
    │   └─ /rag                → New RAG session
    │       └─ /[id]           → Existing RAG chat
    │
    ├─ /tools                  → Independent tools
    │   │
    │   ├─ /user-chat          → User-to-user messaging
    │   │   └─ /[id]           → (Optional) specific conversation
    │   │
    │   ├─ /todo-list          → TODO list interface
    │   │
    │   └─ /file-storage       → File management
    │
    ├─ /profile                → User profile
    ├─ /settings               → App settings
    └─ /metrics                → Usage metrics


Legacy Redirects (handled by middleware):
─────────────────────────────────────────
/chat                          → /dashboard/agents/chat-general
/chat/[id]                     → /dashboard/agents/chat-general/[id]
/dashboard/chat                → /dashboard/agents/chat-general
/dashboard/chat/[id]           → /dashboard/agents/chat-general/[id]


API Routes:
───────────
/api/auth/*                    → Authentication (NextAuth)
│
/api/chat                      → Universal chat endpoint (all agents)
│   POST   → Send message
│   DELETE → Delete chat
│
/api/chat/[id]/stream          → Resume interrupted stream
│
/api/agents/*                  → (Optional) Agent-specific endpoints
│   /multi-tools/chat
│   /multi-agent/chat
│   /rag/chat
│
/api/tools/*                   → Independent tool APIs
│   /todo
│   │   GET    → List TODOs
│   │   POST   → Create TODO
│   │
│   /todo/[id]
│   │   PATCH  → Update TODO
│   │   DELETE → Delete TODO
│   │
│   /user-chat
│   │   GET    → List conversations
│   │   POST   → Send message
│   │
│   /storage
│   │   GET    → List files
│   │
│   └─ /storage/upload
│       POST   → Upload file
│
/api/document                  → Document artifacts (existing)
/api/history                   → Chat history (existing, may extend)
/api/vote                      → Message voting (existing)
/api/files/upload              → File uploads for chat (existing)
/api/suggestions               → Document suggestions (existing)
```

---

## Middleware Authorization Flow

### Request Processing Pipeline

```
Incoming Request
       │
       ↓
┌──────────────────────────────────────────────────┐
│  Step 1: Playwright Health Check                │
│  /ping → return "pong" (bypass all auth)         │
└──────────────────────────────────────────────────┘
       │ (if not /ping)
       ↓
┌──────────────────────────────────────────────────┐
│  Step 2: Auth Routes Exception                   │
│  /api/auth/* → Allow (NextAuth handles)          │
└──────────────────────────────────────────────────┘
       │ (if not auth route)
       ↓
┌──────────────────────────────────────────────────┐
│  Step 3: Get JWT Token                           │
│  await getToken({ req, secret })                 │
└──────────────────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────────┐
│  Step 4: Public Routes Check                     │
│  /, /login, /register                            │
│                                                  │
│  Has token?                                      │
│  ├─ Yes & is guest → /register (complete signup)│
│  ├─ Yes & registered → /dashboard               │
│  └─ No → Allow access                            │
└──────────────────────────────────────────────────┘
       │ (if not public)
       ↓
┌──────────────────────────────────────────────────┐
│  Step 5: Dashboard Routes (/dashboard/*)        │
│                                                  │
│  Has token?                                      │
│  ├─ No → /login?returnUrl={pathname}             │
│  ├─ Yes & is guest → /register (force signup)   │
│  └─ Yes & registered → Allow                     │
└──────────────────────────────────────────────────┘
       │ (if not dashboard)
       ↓
┌──────────────────────────────────────────────────┐
│  Step 6: API Routes (/api/*)                     │
│                                                  │
│  Has token?                                      │
│  ├─ No → 401 Unauthorized                        │
│  ├─ Yes & is guest & restricted endpoint         │
│  │   → 403 Forbidden                             │
│  └─ Yes & registered → Allow                     │
└──────────────────────────────────────────────────┘
       │ (if not API)
       ↓
┌──────────────────────────────────────────────────┐
│  Step 7: Legacy Route Redirects                  │
│  /chat → /dashboard/agents/chat-general          │
│  /chat/[id] → /dashboard/agents/chat-general/[id]│
└──────────────────────────────────────────────────┘
       │ (if not legacy)
       ↓
┌──────────────────────────────────────────────────┐
│  Step 8: Default Allow                           │
│  (for static assets, etc.)                       │
└──────────────────────────────────────────────────┘
```

---

## Responsive Sidebar Behavior

### Layout Adaptation by Screen Size

```
DESKTOP (>= 1024px)
═══════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────┐
│ ┌──────────────┬────────────────────────────────────┐   │
│ │              │                                    │   │
│ │   Sidebar    │          Main Content              │   │
│ │   (visible)  │                                    │   │
│ │              │                                    │   │
│ │   200-280px  │          Flexible width            │   │
│ │              │                                    │   │
│ │              │                                    │   │
│ │   Toggle     │                                    │   │
│ │    ◀──       │                                    │   │
│ │              │                                    │   │
│ └──────────────┴────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

State: defaultOpen={!isCollapsed} (from cookie)
Behavior: Click toggle to collapse/expand
Persistence: Saved to cookie "sidebar_state"


DESKTOP COLLAPSED
═══════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────┐
│ ┌──┬──────────────────────────────────────────────────┐ │
│ │  │                                                  │ │
│ │S │              Main Content                        │ │
│ │I │                                                  │ │
│ │D │                                                  │ │
│ │E │              Full width                          │ │
│ │B │                                                  │ │
│ │A │                                                  │ │
│ │R │                                                  │ │
│ │  │                                                  │ │
│ │▶ │                                                  │ │
│ │  │                                                  │ │
│ └──┴──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

State: defaultOpen={false}
Behavior: Icons only, expand on hover
Width: 48-64px


TABLET (768px - 1023px)
═══════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────┐
│ ┌──┬──────────────────────────────────────────────────┐ │
│ │  │                                                  │ │
│ │☰ │              Main Content                        │ │
│ │  │                                                  │ │
│ └──┴──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

State: Collapsed by default
Behavior: Click hamburger → overlay sidebar slides in
Width: 280px (overlay)


MOBILE (< 768px)
═══════════════════════════════════════════════════════════

┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │ ☰  Dashboard                │ │  ← Header with hamburger
│ └─────────────────────────────┘ │
│                                 │
│                                 │
│      Main Content               │
│      (full width)               │
│                                 │
│                                 │
└─────────────────────────────────┘

Click hamburger ↓

┌─────────────────────────────────┐
│ ┌──────────────┬────────────────┤
│ │              │                │
│ │   Sidebar    │   Backdrop     │  ← Sidebar slides in
│ │   (overlay)  │   (dimmed)     │     from left
│ │              │                │
│ │   280px      │   Click to     │
│ │              │   close        │
│ │              │                │
│ │   [X] Close  │                │
│ │              │                │
│ └──────────────┴────────────────┤
└─────────────────────────────────┘

State: Hidden by default
Behavior: Hamburger menu → overlay sidebar
Auto-close: On navigation or backdrop click
```

---

## Migration Path Visualization

### Incremental Implementation Stages

```
STAGE 1: FOUNDATION (Non-Breaking)
═══════════════════════════════════════════════════════════
Current State:           Action:                  Result:
/dashboard/chat    →    Create new dirs      →   New routes exist
                        (no changes to chat)      but redirect back


STAGE 2: DATABASE EXTENSION
═══════════════════════════════════════════════════════════
Current Schema:         Migration:                New Schema:
Chat                →   Add agentType        →   Chat
 - id                    Backfill with             - id
 - userId                'chat-general'            - userId
 - title                                           - title
                                                   - agentType ✓

                        Create new tables:
                        - TodoItem
                        - UserMessage
                        - StoredFile


STAGE 3: SIDEBAR REPLACEMENT
═══════════════════════════════════════════════════════════
Current:                Action:                   New:
AppSidebar          →   Replace with         →   DashboardSidebar
 - Chat history          DashboardSidebar          - Multi-section nav
 - New chat button       - Agents section          - Collapsible groups
 - User nav              - Tools section           - Active state
                         - Account section


STAGE 4: ROUTE MIGRATION
═══════════════════════════════════════════════════════════
Old URL:                Redirect:                 New URL:
/dashboard/chat     →   middleware.ts        →   /dashboard/agents/
                                                  chat-general

All links updated:
- Internal components
- Sidebar navigation
- Dashboard menu


STAGE 5: NEW FEATURES
═══════════════════════════════════════════════════════════
Add incrementally:
1. Multi-Tools Agent
2. RAG Agent
3. TODO List Tool
4. File Storage Tool

Each can be deployed independently.


FINAL STATE: COMPLETE DASHBOARD
═══════════════════════════════════════════════════════════
/dashboard
    ├─ Menu with all tools
    ├─ Sidebar with categorized navigation
    ├─ Multiple agent types functional
    ├─ Independent tools operational
    └─ All data properly typed and isolated
```

---

## Security & Authorization Matrix

### Access Control by Route

```
┌──────────────────────────────┬──────────┬───────┬──────────┐
│ Route                        │  Guest   │ User  │ Premium  │
├──────────────────────────────┼──────────┼───────┼──────────┤
│ /                            │    ✓     │   ✓   │    ✓     │
│ /login                       │    ✓     │   ✗   │    ✗     │
│ /register                    │    ✓     │   ✗   │    ✗     │
├──────────────────────────────┼──────────┼───────┼──────────┤
│ /dashboard                   │    ✗     │   ✓   │    ✓     │
│ /dashboard/agents/*          │    ✗     │   ✓   │    ✓     │
│ /dashboard/tools/*           │    ✗     │   ✓   │    ✓     │
│ /dashboard/profile           │    ✗     │   ✓   │    ✓     │
│ /dashboard/settings          │    ✗     │   ✓   │    ✓     │
│ /dashboard/metrics           │    ✗     │   ✓   │    ✓     │
├──────────────────────────────┼──────────┼───────┼──────────┤
│ /api/chat (chat-general)     │    ✗     │   ✓   │    ✓     │
│ /api/chat (multi-tools)      │    ✗     │   ✓   │    ✓     │
│ /api/chat (multi-agent)      │    ✗     │   ✗   │    ✓     │ ← Premium only
│ /api/chat (rag)              │    ✗     │   ✓   │    ✓     │
├──────────────────────────────┼──────────┼───────┼──────────┤
│ /api/tools/todo              │    ✗     │   ✓   │    ✓     │
│ /api/tools/storage           │    ✗     │   ✓   │    ✓     │
│ /api/tools/user-chat         │    ✗     │   ✓   │    ✓     │
└──────────────────────────────┴──────────┴───────┴──────────┘

Legend:
✓ = Allowed
✗ = Denied (redirect or 403)

Data Isolation Rules:
───────────────────────
1. Users can ONLY access their own data
2. All queries MUST include userId filter
3. Agent type validated on both client and server
4. Premium features checked in middleware and API

Query Pattern Example:
db.select()
  .from(chat)
  .where(
    and(
      eq(chat.userId, session.user.id),  ← Always required
      eq(chat.agentType, requestedType)  ← Validate type
    )
  );
```

---

## Performance Optimization Strategy

### Code Splitting & Lazy Loading

```
Initial Bundle (Always Loaded)
═══════════════════════════════════════════════════════════
- Next.js core
- React runtime
- Dashboard layout
- Sidebar components
- Navigation config
- shadcn/ui base components (Button, Card, etc.)

Estimated: ~150KB gzipped


Route-Specific Bundles (Loaded on Demand)
═══════════════════════════════════════════════════════════

/dashboard/agents/chat-general:
├─ Chat component (~40KB)
├─ Messages component (~20KB)
├─ Multimodal input (~30KB)
├─ Model selector (~10KB)
└─ Artifact system (~80KB)
    └─ Lazy-loaded editors:
        ├─ CodeMirror (~120KB) - loaded when code artifact shown
        ├─ ProseMirror (~100KB) - loaded when text artifact shown
        └─ React Data Grid (~80KB) - loaded when sheet artifact shown

Total: ~100KB initial + editors on demand


/dashboard/tools/todo-list:
├─ TODO components (~15KB)
├─ Form inputs (~10KB)
└─ SWR (~5KB)

Total: ~30KB


/dashboard/tools/file-storage:
├─ File browser (~20KB)
├─ Upload component (~15KB)
└─ Vercel Blob client (~10KB)

Total: ~45KB


Optimization Techniques:
────────────────────────
1. Dynamic imports for heavy components
2. Prefetch links on hover
3. Bundle analysis with @next/bundle-analyzer
4. Tree shaking (automatic with Next.js)
5. Image optimization with next/image
```

---

## Summary

These diagrams provide:

1. **Visual representation** of current vs. proposed architecture
2. **User journey maps** through the dashboard
3. **Component hierarchy** showing relationships
4. **Data flow patterns** for agents and tools
5. **Database schema** with relationships
6. **Complete routing map** with all URL patterns
7. **Middleware authorization flow** for security
8. **Responsive layout** behavior across devices
9. **Migration stages** showing incremental deployment
10. **Security matrix** for access control
11. **Performance strategy** for optimization

Use these diagrams as a reference during implementation to ensure the architecture is followed correctly and all stakeholders understand the system design.

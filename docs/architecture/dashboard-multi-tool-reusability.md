# Component Reusability Analysis

**Date:** 2025-11-07
**Related:** [Architecture](./dashboard-multi-tool-architecture.md) | [Implementation](./dashboard-multi-tool-implementation.md)

---

## Overview

This document provides a detailed analysis of existing components and their reusability in the new multi-tool dashboard architecture. It identifies which components can be reused as-is, which need adaptation, and which must be created from scratch.

---

## Existing Components Inventory

### Core Chat Components (Currently in `components/`)

| Component | File | Lines | Dependencies | Current Usage |
|-----------|------|-------|--------------|---------------|
| **Chat** | `chat.tsx` | ~400 | messages, multimodal-input, artifact | Main chat interface |
| **Messages** | `messages.tsx` | ~200 | message, use-messages | Message list container |
| **Message** | `message.tsx` | ~300 | message-actions, markdown | Individual message bubble |
| **MultimodalInput** | `multimodal-input.tsx` | ~500 | preview-attachment, file upload | Chat input with files |
| **MessageActions** | `message-actions.tsx` | ~150 | vote API | Copy, vote buttons |
| **ModelSelector** | `model-selector.tsx` | ~100 | models config | AI model dropdown |
| **Artifact** | `artifact.tsx` | ~200 | artifact types | Artifact viewer |
| **ChatHeader** | `chat-header.tsx` | ~100 | visibility-selector | Chat title and controls |

### Sidebar Components

| Component | File | Lines | Dependencies | Current Usage |
|-----------|------|-------|--------------|---------------|
| **AppSidebar** | `app-sidebar.tsx` | ~140 | sidebar-history, sidebar-user-nav | Current chat sidebar |
| **SidebarHistory** | `sidebar-history.tsx` | ~200 | sidebar-history-item, SWR | Chat history list |
| **SidebarHistoryItem** | `sidebar-history-item.tsx` | ~150 | Link, dropdown | Individual history item |
| **SidebarUserNav** | `sidebar-user-nav.tsx` | ~100 | dropdown, sign-out | User menu in footer |

### Artifact System

| Component | Directory | Purpose | Reusable? |
|-----------|-----------|---------|-----------|
| **Code Artifact** | `artifacts/code/` | Python execution | Yes |
| **Text Artifact** | `artifacts/text/` | Rich text editor | Yes |
| **Sheet Artifact** | `artifacts/sheet/` | Spreadsheet editor | Yes |
| **Image Artifact** | `artifacts/image/` | Image viewer | Yes |

### Utility Components

| Component | File | Purpose | Reusable? |
|-----------|------|---------|-----------|
| **DataStreamHandler** | `data-stream-handler.tsx` | Stream processing | Yes |
| **DataStreamProvider** | `data-stream-provider.tsx` | Stream context | Yes |
| **ThemeProvider** | `theme-provider.tsx` | Theme management | Yes |
| **Toast** | `toast.tsx` | Notifications | Yes |

---

## Reusability Assessment

### Category 1: Reuse As-Is (No Changes)

These components work perfectly in the new architecture without modification:

#### 1.1 Messages & Message Display

**Components:**
- `components/messages.tsx`
- `components/message.tsx`
- `components/message-actions.tsx`
- `components/message-reasoning.tsx`
- `components/message-editor.tsx`

**Why reusable:**
- Agent-agnostic implementation
- Work with any message format
- No hardcoded routes or logic
- Use props for customization

**Usage in new architecture:**
```typescript
// In any agent page
import { Messages } from "@/components/messages";
import { Message } from "@/components/message";

// Works for chat-general, multi-tools, multi-agent, rag
<Messages messages={messages} />
```

#### 1.2 Input Components

**Components:**
- `components/multimodal-input.tsx`
- `components/preview-attachment.tsx`

**Why reusable:**
- Generic file handling
- No agent-specific logic
- Emits events, doesn't handle routing

**Usage:**
```typescript
// In any agent chat interface
import { MultimodalInput } from "@/components/multimodal-input";

<MultimodalInput
  input={input}
  setInput={setInput}
  handleSubmit={handleSubmit}
  isLoading={isLoading}
  attachments={attachments}
  setAttachments={setAttachments}
/>
```

#### 1.3 Artifact System

**Components:**
- `components/artifact.tsx`
- `artifacts/code/client.tsx`
- `artifacts/text/client.tsx`
- `artifacts/sheet/client.tsx`
- `artifacts/image/client.tsx`

**Why reusable:**
- Self-contained functionality
- No dependencies on chat context
- Work with any agent that supports artifacts

**Usage:**
```typescript
// Any agent can use artifacts
import { Artifact } from "@/components/artifact";

<Artifact
  document={document}
  kind={document.kind}
  isReadonly={isReadonly}
/>
```

#### 1.4 Utility & Provider Components

**Components:**
- `components/data-stream-handler.tsx`
- `components/data-stream-provider.tsx`
- `components/theme-provider.tsx`
- `components/toast.tsx`

**Why reusable:**
- Infrastructure components
- No UI coupling
- Work globally

#### 1.5 UI Primitives (shadcn/ui)

**All components in `components/ui/`:**
- `button.tsx`, `card.tsx`, `input.tsx`, etc.
- Fully reusable across entire app

---

### Category 2: Needs Minor Adaptation

These components require small changes to work with the new architecture:

#### 2.1 Chat Component

**File:** `components/chat.tsx`

**Required changes:**
1. Add `agentType` prop
2. Pass `agentType` to API call
3. Optionally support agent-specific tools

**Current signature:**
```typescript
type ChatProps = {
  id: string;
  initialMessages: UIMessage[];
  selectedChatModel: string;
  selectedVisibilityType: "public" | "private";
  isReadonly: boolean;
  autoResume?: boolean;
};
```

**New signature:**
```typescript
type ChatProps = {
  id: string;
  initialMessages: UIMessage[];
  selectedChatModel: string;
  selectedVisibilityType: "public" | "private";
  isReadonly: boolean;
  autoResume?: boolean;
  agentType?: "chat-general" | "multi-tools" | "multi-agent" | "rag"; // NEW
};
```

**Changes needed:**
```typescript
// Add to fetch call
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
```

**Effort:** 30 minutes
**Breaking:** No (defaults to "chat-general")

#### 2.2 Model Selector

**File:** `components/model-selector.tsx`

**Potential changes:**
1. Filter models by agent type (optional)
2. Show agent-specific model recommendations

**Current:** Shows all models

**Enhanced (optional):**
```typescript
type ModelSelectorProps = {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  agentType?: string; // NEW: filter models by agent
};

// Filter models
const availableModels = chatModels.filter(model => {
  if (!agentType) return true;
  return model.supportedAgents?.includes(agentType) ?? true;
});
```

**Effort:** 1 hour (if implemented)
**Breaking:** No (optional enhancement)

#### 2.3 Chat Header

**File:** `components/chat-header.tsx`

**Required changes:**
1. Display agent type badge
2. Optionally show agent-specific actions

**Enhancement:**
```typescript
type ChatHeaderProps = {
  chatId: string;
  selectedChatModel: string;
  selectedVisibilityType: "public" | "private";
  agentType?: string; // NEW
};

// In component
{agentType && agentType !== "chat-general" && (
  <Badge variant="outline">{agentType}</Badge>
)}
```

**Effort:** 30 minutes
**Breaking:** No

#### 2.4 Sidebar User Nav

**File:** `components/sidebar-user-nav.tsx`

**No changes needed**, but may want to add:
- Quick links to profile/settings
- Premium badge if applicable

**Effort:** 0 hours (optional enhancements)
**Breaking:** No

---

### Category 3: Major Refactoring Required

These components need significant changes or replacement:

#### 3.1 App Sidebar → Dashboard Sidebar

**Current:** `components/app-sidebar.tsx`
**New:** `components/dashboard/dashboard-sidebar.tsx`

**Why replace:**
- Current sidebar is chat-history focused
- New sidebar needs multi-section navigation
- Different structure (collapsible groups)
- Different data fetching patterns

**Reusable parts:**
- User nav footer (`SidebarUserNav`)
- Sidebar base components from shadcn/ui
- Logo/header pattern

**New implementation needed:**
- Navigation sections (Agents, Tools, Account)
- Collapsible groups
- Active state detection across different routes
- Icon + label structure

**Effort:** 3 hours
**Breaking:** Yes (replaces old sidebar)

#### 3.2 Sidebar History → Agent-Specific History

**Current:** `components/sidebar-history.tsx`
**Usage:** General chat history

**New requirement:**
- Filter history by agent type
- Show history only for current agent
- Separate history lists per agent

**Options:**

**Option A:** Extend existing component
```typescript
type SidebarHistoryProps = {
  user: User;
  agentType?: string; // NEW: filter by agent type
};

// In component
const { data: history } = useSWR(
  user ? `/api/history?agentType=${agentType || "all"}` : null
);
```

**Option B:** Create agent-specific history components
```typescript
// components/agents/chat-general/history.tsx
// components/agents/multi-tools/history.tsx
```

**Recommendation:** Option A (extend existing)

**Effort:** 2 hours
**Breaking:** No (backward compatible)

---

### Category 4: New Components Required

Components that don't exist and must be created:

#### 4.1 Dashboard Navigation Components

**New components:**

```
components/dashboard/
├── dashboard-sidebar.tsx        # Main sidebar with multi-section nav
├── dashboard-menu.tsx           # Tool grid on dashboard home
├── tool-card.tsx                # Individual tool card
├── sidebar-nav-section.tsx      # Collapsible nav section
└── sidebar-nav-item.tsx         # Navigation item component
```

**Purpose:** Enable multi-tool navigation

**Estimated effort:** 6 hours total

#### 4.2 Agent-Specific Components

**Chat-General:**
- No new components (reuses existing)

**Multi-Tools:**
```
components/agents/multi-tools/
├── multi-tools-chat.tsx         # Chat with extended tools
└── tool-palette.tsx             # (Optional) Tool selection UI
```

**Multi-Agent:**
```
components/agents/multi-agent/
├── coordinator-view.tsx         # Multi-agent coordinator
├── agent-card.tsx               # Individual agent status
└── agent-conversation.tsx       # Agent-to-agent chat view
```

**RAG Agent:**
```
components/agents/rag/
├── document-upload.tsx          # Upload documents for context
├── document-list.tsx            # Show uploaded documents
└── context-panel.tsx            # Display active context
```

**Estimated effort:** 12-16 hours total

#### 4.3 Independent Tool Components

**TODO List:**
```
components/tools/todo-list/
├── todo-list.tsx                # Main TODO interface
├── todo-item.tsx                # Individual TODO component
├── todo-form.tsx                # Add/edit form
└── todo-filters.tsx             # Filter by status/priority
```

**File Storage:**
```
components/tools/file-storage/
├── file-browser.tsx             # File list view
├── file-uploader.tsx            # Upload interface
├── file-item.tsx                # Individual file display
└── folder-tree.tsx              # (Optional) Folder navigation
```

**User Chat:**
```
components/tools/user-chat/
├── conversation-list.tsx        # List of user conversations
├── conversation-view.tsx        # Active conversation
├── message-thread.tsx           # Message history
└── user-search.tsx              # Find users to chat with
```

**Estimated effort:** 10-12 hours total

#### 4.4 Profile & Metrics Components

**Profile:**
```
components/profile/
├── profile-form.tsx             # Edit profile information
├── avatar-upload.tsx            # Profile picture upload
└── account-settings.tsx         # Account preferences
```

**Metrics:**
```
components/metrics/
├── usage-charts.tsx             # Chart components
├── stats-card.tsx               # Stat display cards
└── usage-breakdown.tsx          # Detailed usage table
```

**Estimated effort:** 6-8 hours total

---

## Reusability Strategy by Feature

### Chat-General Agent (Existing Chat)

```typescript
// Reused components (100% reuse):
import { Chat } from "@/components/chat";                    // ✓ Reuse
import { Messages } from "@/components/messages";            // ✓ Reuse
import { Message } from "@/components/message";              // ✓ Reuse
import { MultimodalInput } from "@/components/multimodal-input"; // ✓ Reuse
import { ModelSelector } from "@/components/model-selector"; // ✓ Reuse
import { Artifact } from "@/components/artifact";            // ✓ Reuse
import { DataStreamHandler } from "@/components/data-stream-handler"; // ✓ Reuse

// No new components needed
// Effort: Copy existing page files
```

### Multi-Tools Agent

```typescript
// Reused components (95% reuse):
import { Chat } from "@/components/chat";                    // ✓ Adapt (add agentType)
import { Messages } from "@/components/messages";            // ✓ Reuse
import { Message } from "@/components/message";              // ✓ Reuse
import { MultimodalInput } from "@/components/multimodal-input"; // ✓ Reuse
import { Artifact } from "@/components/artifact";            // ✓ Reuse

// New components:
import { ToolPalette } from "@/components/agents/multi-tools/tool-palette"; // ✗ New
```

### RAG Agent

```typescript
// Reused components (80% reuse):
import { Chat } from "@/components/chat";                    // ✓ Adapt
import { Messages } from "@/components/messages";            // ✓ Reuse
import { Message } from "@/components/message";              // ✓ Reuse

// New components:
import { DocumentUpload } from "@/components/agents/rag/document-upload"; // ✗ New
import { DocumentList } from "@/components/agents/rag/document-list";     // ✗ New
import { ContextPanel } from "@/components/agents/rag/context-panel";     // ✗ New
```

### TODO List Tool

```typescript
// Reused components (30% reuse):
import { Button } from "@/components/ui/button";             // ✓ Reuse
import { Input } from "@/components/ui/input";               // ✓ Reuse
import { Checkbox } from "@/components/ui/checkbox";         // ✓ Reuse

// New components (70%):
import { TodoList } from "@/components/tools/todo-list/todo-list";     // ✗ New
import { TodoItem } from "@/components/tools/todo-list/todo-item";     // ✗ New
import { TodoForm } from "@/components/tools/todo-list/todo-form";     // ✗ New
```

### File Storage Tool

```typescript
// Reused components (40% reuse):
import { Button } from "@/components/ui/button";             // ✓ Reuse
import { Input } from "@/components/ui/input";               // ✓ Reuse
import { Card } from "@/components/ui/card";                 // ✓ Reuse

// New components (60%):
import { FileBrowser } from "@/components/tools/file-storage/file-browser"; // ✗ New
import { FileUploader } from "@/components/tools/file-storage/file-uploader"; // ✗ New
```

---

## Component Migration Checklist

### Phase 1: No Changes Needed

- [x] `components/messages.tsx` - Works as-is
- [x] `components/message.tsx` - Works as-is
- [x] `components/message-actions.tsx` - Works as-is
- [x] `components/multimodal-input.tsx` - Works as-is
- [x] `components/artifact.tsx` - Works as-is
- [x] `artifacts/*/` - All artifact types work as-is
- [x] `components/ui/*` - All UI primitives work as-is
- [x] `components/data-stream-handler.tsx` - Works as-is
- [x] `components/sidebar-user-nav.tsx` - Works as-is

### Phase 2: Minor Adaptations

- [ ] `components/chat.tsx` - Add `agentType` prop
- [ ] `components/chat-header.tsx` - Show agent badge
- [ ] `components/model-selector.tsx` - (Optional) Filter by agent
- [ ] `components/sidebar-history.tsx` - Add agent type filter

### Phase 3: Major Refactoring

- [ ] Replace `components/app-sidebar.tsx` with `components/dashboard/dashboard-sidebar.tsx`

### Phase 4: New Component Development

**Dashboard Navigation:**
- [ ] `components/dashboard/dashboard-sidebar.tsx`
- [ ] `components/dashboard/dashboard-menu.tsx`
- [ ] `components/dashboard/tool-card.tsx`
- [ ] `components/dashboard/sidebar-nav-section.tsx`

**Agent Components:**
- [ ] Multi-tools agent components
- [ ] Multi-agent system components
- [ ] RAG agent components

**Tool Components:**
- [ ] TODO list components
- [ ] File storage components
- [ ] User chat components

**Profile & Metrics:**
- [ ] Profile components
- [ ] Metrics components

---

## Code Sharing Patterns

### Pattern 1: Prop-Based Customization

**Use when:** Component behavior varies slightly by context

**Example:**
```typescript
// chat.tsx
type ChatProps = {
  // ... existing props
  agentType?: "chat-general" | "multi-tools" | "multi-agent" | "rag";
  customTools?: Record<string, Tool>; // Agent-specific tools
};

export function Chat({ agentType = "chat-general", customTools, ...props }: ChatProps) {
  // Use agentType to customize behavior
}
```

### Pattern 2: Composition Over Inheritance

**Use when:** Different agents need different layouts

**Example:**
```typescript
// agents/multi-tools/page.tsx
import { Chat } from "@/components/chat";
import { ToolPalette } from "@/components/agents/multi-tools/tool-palette";

export default function MultiToolsPage() {
  return (
    <div className="flex">
      <Chat agentType="multi-tools" />
      <ToolPalette /> {/* Additional UI specific to multi-tools */}
    </div>
  );
}
```

### Pattern 3: Shared Hooks

**Use when:** Logic is reusable but UI differs

**Example:**
```typescript
// hooks/use-agent-chat.ts
export function useAgentChat(agentType: string) {
  const { messages, sendMessage, isLoading } = useChat({
    api: "/api/chat",
    body: { agentType },
  });

  return { messages, sendMessage, isLoading };
}

// Used in multiple agents
import { useAgentChat } from "@/hooks/use-agent-chat";

const { messages, sendMessage } = useAgentChat("multi-tools");
```

### Pattern 4: Render Props

**Use when:** Wrapper provides data, children customize UI

**Example:**
```typescript
// components/agents/agent-layout.tsx
type AgentLayoutProps = {
  agentType: string;
  children: (props: AgentLayoutRenderProps) => React.ReactNode;
};

export function AgentLayout({ agentType, children }: AgentLayoutProps) {
  const { history, isLoading } = useAgentHistory(agentType);

  return (
    <div className="agent-layout">
      <Sidebar history={history} />
      <main>{children({ isLoading, history })}</main>
    </div>
  );
}

// Usage
<AgentLayout agentType="rag">
  {({ isLoading, history }) => (
    <RagAgentInterface loading={isLoading} />
  )}
</AgentLayout>
```

---

## Estimated Development Time

### By Component Category

| Category | Components | Estimated Hours | Priority |
|----------|-----------|-----------------|----------|
| **No changes** | 15 components | 0 hours | - |
| **Minor adaptation** | 4 components | 3 hours | High |
| **Major refactor** | 1 component (sidebar) | 6 hours | High |
| **Dashboard nav** | 4 components | 6 hours | High |
| **Multi-tools agent** | 2 components | 4 hours | Medium |
| **Multi-agent system** | 3 components | 8 hours | Low |
| **RAG agent** | 3 components | 6 hours | Medium |
| **TODO list** | 4 components | 6 hours | Medium |
| **File storage** | 3 components | 5 hours | Medium |
| **User chat** | 4 components | 6 hours | Low |
| **Profile** | 3 components | 4 hours | Low |
| **Metrics** | 3 components | 4 hours | Low |

**Total estimated:** 58 hours (~7-8 working days)

### By Implementation Phase

| Phase | Focus | Hours | Days |
|-------|-------|-------|------|
| **Phase 1** | Foundation + Dashboard nav | 12 | 1.5 |
| **Phase 2** | Chat migration + Sidebar | 9 | 1 |
| **Phase 3** | Multi-tools + RAG agents | 10 | 1.5 |
| **Phase 4** | TODO + File storage | 11 | 1.5 |
| **Phase 5** | Remaining tools + Polish | 16 | 2 |

**Total:** 58 hours (~7.5 working days)

---

## Best Practices for Reusability

### 1. Keep Components Pure

```typescript
// Good: Pure, reusable
export function TodoItem({ item, onToggle, onDelete }: TodoItemProps) {
  return (
    <div>
      <Checkbox checked={item.completed} onCheckedChange={onToggle} />
      <span>{item.title}</span>
      <Button onClick={onDelete}>Delete</Button>
    </div>
  );
}

// Bad: Coupled to specific context
export function TodoItem({ itemId }: { itemId: string }) {
  const item = useTodo(itemId); // Fetching inside component
  const handleDelete = async () => {
    await fetch(`/api/todo/${itemId}`, { method: "DELETE" }); // API call inside
  };
  // ...
}
```

### 2. Use Props for Customization

```typescript
// Good: Configurable via props
type ChatProps = {
  agentType: string;
  tools?: Record<string, Tool>;
  systemPrompt?: string;
};

// Bad: Hardcoded behavior
function Chat() {
  const tools = { getWeather, createDocument }; // Always the same
}
```

### 3. Extract Shared Logic to Hooks

```typescript
// Good: Shared hook
export function useAgentHistory(agentType: string) {
  return useSWR(`/api/history?agentType=${agentType}`);
}

// Bad: Duplicate logic in each component
```

### 4. Favor Composition

```typescript
// Good: Composable
<AgentLayout>
  <AgentHeader />
  <AgentChat />
  <AgentSidebar />
</AgentLayout>

// Bad: Monolithic component with all logic
<MonolithicAgentComponent />
```

---

## Summary

### High Reusability (80%+)

**Chat-General Agent:**
- Reuses 100% of existing chat components
- Minimal changes needed
- Just copy routes and add `agentType`

**Multi-Tools Agent:**
- Reuses 95% of chat components
- Add tool palette component
- Easy to implement

### Medium Reusability (50-80%)

**RAG Agent:**
- Reuses 80% of chat components
- Needs document upload UI
- Moderate effort

**TODO List:**
- Reuses 30% (UI primitives)
- Mostly new business logic
- Independent from chat system

### Low Reusability (< 50%)

**Multi-Agent System:**
- Unique coordinator UI
- Complex agent orchestration
- Significant new development

**User Chat:**
- Different from AI chat
- User-to-user messaging
- Separate implementation

### Key Takeaways

1. **Existing chat components are highly reusable** - Most AI agents can use them with minimal changes
2. **UI primitives provide strong foundation** - shadcn/ui components reduce development time
3. **Independent tools require new components** - TODO, File Storage, User Chat are distinct features
4. **Sidebar is the biggest refactor** - Complete replacement needed for multi-section navigation
5. **Total effort is manageable** - ~58 hours for complete implementation

This reusability analysis ensures we maximize code reuse while clearly identifying where new development is needed.

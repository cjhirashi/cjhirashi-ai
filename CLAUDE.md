# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chat SDK is a Next.js 15 AI chatbot application using the Vercel AI SDK, featuring real-time streaming conversations, document artifacts (code, text, images, spreadsheets), and persistent chat history. The app uses xAI's Grok models (Grok Vision and Grok Reasoning) via Vercel AI Gateway.

## Development Commands

### Core Development
```bash
pnpm install              # Install dependencies
pnpm dev                  # Start dev server with Turbo (localhost:3000)
pnpm build                # Run migrations then build for production
pnpm start                # Start production server
```

### Linting & Formatting
```bash
pnpm lint                 # Check code with Ultracite (Biome wrapper)
pnpm format               # Auto-fix code with Ultracite
```

### Database Operations
```bash
pnpm db:generate          # Generate migrations from schema changes
pnpm db:migrate           # Run migrations (also runs during build)
pnpm db:studio            # Open Drizzle Studio UI
pnpm db:push              # Push schema changes directly (dev only)
pnpm db:pull              # Pull schema from remote DB
pnpm db:check             # Verify migration consistency
pnpm db:up                # Upgrade Drizzle
```

### Testing
```bash
pnpm test                 # Run Playwright e2e tests
```

## Architecture Overview

### App Router Structure

The application uses Next.js 15 App Router with route groups:

- **`app/(auth)/`** - Authentication routes (`/login`, `/register`) and API handlers (`/api/auth`)
  - Uses Auth.js v5 (NextAuth) with Credentials provider
  - Supports guest users (auto-created) and regular users
  - Session management with JWT tokens

- **`app/(chat)/`** - Main chat application routes
  - `/` - Chat homepage
  - `/chat/[id]` - Individual chat conversations
  - `/api/chat` - Streaming chat endpoint (POST for messages, DELETE for chat deletion)
  - `/api/document` - Document artifact operations
  - `/api/files/upload` - File upload to Vercel Blob
  - `/api/history` - Chat history operations
  - `/api/vote` - Message voting
  - `/api/suggestions` - Document edit suggestions

### Key Architectural Patterns

#### Streaming Architecture
- Chat responses use **Server-Sent Events (SSE)** via `streamText()` from AI SDK
- Responses transform through `JsonToSseTransformStream` for client consumption
- **Resumable streams** via Redis allow reconnection after network interruptions (requires `REDIS_URL`)
- Stream IDs tracked in `Stream` table for recovery

#### Authentication Flow
1. Middleware (`middleware.ts`) checks for JWT token on all routes
2. No token → redirect to `/api/auth/guest` (auto-creates guest user)
3. Guest users have limited entitlements (see `lib/ai/entitlements.ts`)
4. Regular users created via `/register` with email/password (bcrypt-hashed)

#### Chat Message Flow
1. Client sends message to `POST /api/chat` with `chatId`, `message`, `selectedChatModel`, `selectedVisibilityType`
2. Server validates session, checks rate limits (24h message count vs. entitlements)
3. Retrieves chat history from `Message_v2` table
4. Calls `streamText()` with:
   - System prompt (includes geolocation from Vercel Functions)
   - Conversation history converted to model messages
   - Tools: `getWeather`, `createDocument`, `updateDocument`, `requestSuggestions`
   - Smooth streaming with word-level chunking
5. Response streams to client with UI message parts
6. `onFinish` callback saves messages to DB and enriches with token usage (TokenLens)

#### Artifact System
The `artifacts/` directory contains specialized document types:
- **Code artifacts** (`artifacts/code/`) - Execute Python in sandboxed environment
- **Text artifacts** (`artifacts/text/`) - ProseMirror-based rich text editor
- **Sheet artifacts** (`artifacts/sheet/`) - React Data Grid for spreadsheets
- **Image artifacts** (`artifacts/image/`) - Image viewer/editor

Each artifact type has:
- Client component (`client.tsx`) for UI
- Server actions (`server.ts`) for mutations
- Type definitions

#### Database Schema (PostgreSQL + Drizzle ORM)

**Core Tables:**
- `User` - Users with email/password (guests have `guest-*` email pattern)
- `Chat` - Conversations with title, visibility, userId reference, lastContext (token usage)
- `Message_v2` - Messages with parts (multimodal), attachments, role
- `Document` - Generated artifacts with kind (text/code/image/sheet), versioned by (id, createdAt)
- `Suggestion` - Edit suggestions for documents with originalText/suggestedText
- `Vote_v2` - Message upvotes/downvotes
- `Stream` - Resumable stream tracking with chatId reference

**Deprecated Tables:** `Message`, `Vote` (legacy schema pre-message parts migration)

### AI Integration

#### Models Configuration (`lib/ai/models.ts` + `lib/ai/providers.ts`)
- **"chat-model"** → `xai/grok-2-vision-1212` (multimodal, vision + text)
- **"chat-model-reasoning"** → `xai/grok-3-mini` (with `<think>` reasoning extraction)
- **"title-model"** → `xai/grok-2-1212` (for auto-generating chat titles)
- **"artifact-model"** → `xai/grok-2-1212` (for document generation)

All models accessed via `gateway.languageModel()` (Vercel AI Gateway).

In test environment (`PLAYWRIGHT=True`), mocked models from `models.mock.ts` are used.

#### Tools/Functions
AI tools defined in `lib/ai/tools/`:
- `getWeather` - Fetches weather data (demo tool)
- `createDocument` - Generates new artifact (text/code/image/sheet)
- `updateDocument` - Modifies existing artifact
- `requestSuggestions` - Proposes edits with diff tracking

Tools are disabled for "chat-model-reasoning" (reasoning model).

#### System Prompts
Located in `lib/ai/prompts.ts`, includes:
- Model-specific instructions
- Request hints (geolocation: city, country, coordinates)
- Tool usage guidelines

#### Rate Limiting
Controlled by `lib/ai/entitlements.ts`:
- Guest users: 25 messages/day
- Regular users: 1000 messages/day

Enforced in `/api/chat` route by querying `getMessageCountByUserId()`.

### Component Architecture

#### UI Components (`components/ui/`)
Uses **shadcn/ui** pattern (Radix UI primitives + Tailwind CSS):
- Components are copy-paste style (not npm package)
- Configured via `components.json`
- Variants managed with `class-variance-authority`

#### Domain Components (`components/`)
- `chat.tsx` - Main chat container with message list and input
- `message.tsx` - Individual message bubble (user/assistant)
- `messages.tsx` - Message list with scroll management
- `artifact.tsx` - Artifact viewer with type switching
- `multimodal-input.tsx` - Chat input with file upload, voice input
- `code-editor.tsx` - CodeMirror integration
- `text-editor.tsx` - ProseMirror integration
- `sheet-editor.tsx` - React Data Grid integration
- `sidebar-history.tsx` - Chat history sidebar (uses SWR for fetching)
- `model-selector.tsx` - Dropdown for selecting AI model

#### Custom Hooks (`hooks/`)
- `use-chat-visibility.ts` - Manages chat visibility state
- `use-artifact.ts` - Artifact state management
- `use-auto-resume.ts` - Auto-reconnect for resumable streams
- `use-messages.tsx` - Message list state with SWR
- `use-scroll-to-bottom.tsx` - Auto-scroll behavior
- `use-mobile.ts` - Responsive breakpoint detection

### State Management

No global state library (Redux/Zustand). State managed via:
- **React Server Components** for data fetching
- **SWR** for client-side data fetching/caching (`use-messages`, sidebar history)
- **Custom hooks** for UI state
- **Server Actions** for mutations (prefixed with `"use server"`)

### Code Quality (Ultracite Rules)

The project enforces strict rules via **Ultracite** (Biome-powered):
- **Accessibility**: ARIA compliance, semantic HTML, keyboard navigation
- **TypeScript**: No `any`, explicit types, `import type` for types
- **React**: Hook rules, no array index keys, fragments over `<Fragment>`
- **Next.js**: No `<img>` (use `next/image`), no `<head>` outside `_document`
- **Code quality**: No unused vars/imports, no nested ternaries, prefer arrow functions

See `.cursor/rules/ultracite.mdc` for complete ruleset.

**Common violations to avoid:**
- Using `any` type
- Using `console.*` (production)
- Not using `const` for non-reassigned variables
- Array index as React keys
- Missing ARIA attributes
- Non-semantic HTML with click handlers

## Environment Variables

Required variables (see `.env.example`):

```bash
AUTH_SECRET=****              # NextAuth secret (openssl rand -base64 32)
AI_GATEWAY_API_KEY=****       # Required for non-Vercel deployments
BLOB_READ_WRITE_TOKEN=****    # Vercel Blob storage
POSTGRES_URL=****             # Neon PostgreSQL connection
REDIS_URL=****                # Optional: enables resumable streams
```

**Vercel deployments**: `AI_GATEWAY_API_KEY` not needed (uses OIDC tokens automatically)

## Common Development Tasks

### Adding a New AI Tool
1. Create tool file in `lib/ai/tools/my-tool.ts`:
```typescript
import { tool } from "ai";
import { z } from "zod";

export const myTool = tool({
  description: "Tool description for AI",
  parameters: z.object({
    param: z.string().describe("Parameter description"),
  }),
  execute: async ({ param }) => {
    // Tool logic
    return result;
  },
});
```

2. Add to tools object in `app/(chat)/api/chat/route.ts`:
```typescript
tools: {
  getWeather,
  createDocument: createDocument({ session, dataStream }),
  updateDocument: updateDocument({ session, dataStream }),
  requestSuggestions: requestSuggestions({ session, dataStream }),
  myTool, // Add here
},
```

3. Add to `experimental_activeTools` array (unless reasoning model)

### Adding a Database Migration
1. Modify schema in `lib/db/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Review generated SQL in `lib/db/migrations/`
4. Apply migration: `pnpm db:migrate`

**Note:** Migrations auto-run during `pnpm build`

### Adding a New Chat Model
1. Add model to `lib/ai/models.ts`:
```typescript
export const chatModels: ChatModel[] = [
  // ... existing models
  {
    id: "my-model",
    name: "My Model",
    description: "Model description",
  },
];
```

2. Add to provider in `lib/ai/providers.ts`:
```typescript
customProvider({
  languageModels: {
    "chat-model": gateway.languageModel("xai/grok-2-vision-1212"),
    // ... existing models
    "my-model": gateway.languageModel("provider/model-id"),
  },
})
```

3. Update entitlements if needed in `lib/ai/entitlements.ts`

### Working with Artifacts
- Artifacts are stored in `Document` table with composite primary key `(id, createdAt)`
- Each artifact has a `kind` field: `"text" | "code" | "image" | "sheet"`
- Client-side components in `artifacts/{kind}/client.tsx`
- Server actions in `artifacts/{kind}/server.ts`
- Use `createDocument` tool to generate, `updateDocument` to modify

### Testing
- E2E tests in `tests/e2e/`
- Tests use mocked AI models (see `lib/ai/models.mock.ts`)
- Run with `pnpm test` (sets `PLAYWRIGHT=True`)
- Tests require dev server running (auto-started by Playwright)

## Important Patterns

### Error Handling
Use custom `ChatSDKError` class (`lib/errors.ts`) for consistent error responses:
```typescript
// In API routes
return new ChatSDKError("unauthorized:chat").toResponse();
```

Error codes: `bad_request:api`, `unauthorized:chat`, `forbidden:chat`, `rate_limit:chat`, `offline:chat`

### Server Actions
- Mark with `"use server"` directive at top of file
- Used for mutations (create/update/delete operations)
- Import with `import { action } from "@/path/to/actions"`
- Example: `generateTitleFromUserMessage` in `app/(chat)/actions.ts`

### Type Safety
- All database types inferred from schema via `InferSelectModel<typeof table>`
- AI SDK types: `ChatMessage`, `UIMessage`, `ModelMessage`
- Convert between types:
  - DB → UI: `convertToUIMessages(dbMessages)`
  - UI → Model: `convertToModelMessages(uiMessages)`

### Middleware Behavior
- All routes protected by default (see `middleware.ts` config)
- Unauthenticated users redirected to guest auth
- Guest users can't access `/login` or `/register` if already authed
- `/api/auth/*` routes bypass middleware

### Next.js Config
- **Partial Prerendering (PPR)** enabled experimentally
- Remote images allowed from `avatar.vercel.sh`
- Turbopack used in dev mode (`--turbo`)

## Project Structure Philosophy

- **`app/`** - Next.js routes and API endpoints (framework layer)
- **`lib/`** - Business logic, utilities, database, AI config (reusable across routes)
- **`components/`** - UI components (presentation layer)
- **`artifacts/`** - Self-contained document system (feature module)
- **`hooks/`** - Reusable React hooks (UI logic)
- **`tests/`** - E2E tests with Playwright

This separation ensures testability and prevents circular dependencies.

## Documentation Structure

All technical documentation is organized in the `docs/` directory with a clear structure by purpose.

### Directory Organization

```
docs/
├── api/                 # API documentation and endpoints
├── architecture/        # System design and architecture
├── components/          # UI component documentation
├── database/            # Database schema and queries
├── decisions/           # Architecture Decision Records (ADRs)
├── guides/              # Tutorials and user guides
├── migrations/          # Migration guides and breaking changes
├── security/            # Security documentation
└── testing/             # Testing strategy and guides
```

### Documentation by Agent

Each specialized agent is responsible for creating documentation in specific directories:

| Agent | Directory | Content |
|-------|-----------|---------|
| Architecture Designer | `docs/architecture/` | System designs, implementation plans, diagrams |
| Auth & Security Specialist | `docs/security/` | Authentication flows, security checklists |
| Frontend Developer | `docs/components/`, `docs/guides/` | Component docs, design system |
| Backend Developer | `docs/api/`, `docs/database/` | API docs, schema, queries |
| Testing Specialist | `docs/testing/` | Testing strategy, how to run tests |
| Migration Specialist | `docs/migrations/` | Migration guides, breaking changes |
| Documentation Writer | All directories | README files, ADRs, tutorials |

### Key Documentation Files

- **`docs/README.md`** - Complete guide to documentation structure and conventions
- **`docs/decisions/`** - Architecture Decision Records (ADRs) for important technical decisions
  - Use template in `docs/decisions/template.md` when creating new ADRs
  - Document decisions about: technology choices, architectural patterns, major refactors
- **API Documentation** - Should include request/response examples, authentication, error codes
- **Component Documentation** - Props, usage examples, accessibility notes

### When to Create Documentation

**Always document:**
- New APIs and endpoints
- Architectural changes or refactors
- Security implementations
- Complex algorithms or business logic
- Migration guides for breaking changes

**Create ADRs for:**
- Choosing frameworks or libraries
- Major architectural patterns
- Database schema changes
- Authentication/authorization approaches
- Performance optimization strategies

See `docs/README.md` for complete documentation guidelines and conventions.

## Key Dependencies

- **Next.js 15** - App Router with RSC
- **React 19 RC** - Latest React features
- **AI SDK 5.x** - Vercel AI SDK for LLM integration
- **Drizzle ORM 0.34** - Type-safe database queries
- **Auth.js v5 beta** - NextAuth successor
- **Tailwind CSS 4** - Utility-first styling
- **ProseMirror** - Text editor framework
- **CodeMirror 6** - Code editor
- **React Data Grid** - Spreadsheet component
- **TokenLens** - Token usage tracking and cost calculation
- **Redis 5** - For resumable streams (optional)

## Deployment

Designed for **Vercel** deployment:
- Auto-runs migrations via `pnpm build`
- Uses Vercel Functions for serverless API
- Integrates with Vercel Blob, Postgres, Redis
- AI Gateway auth automatic on Vercel (OIDC tokens)

**Non-Vercel deployments:**
- Must set `AI_GATEWAY_API_KEY` manually
- Migrations must run before starting server
- Ensure Node.js version matches `package.json` engines (if specified)

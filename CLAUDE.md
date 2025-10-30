# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered chatbot application built with Next.js 15 using the AI SDK. It features a chat interface with artifact support (interactive documents, code execution, spreadsheets) and uses xAI's Grok models via Vercel AI Gateway.

## Development Commands

### Local Development
```bash
pnpm install              # Install dependencies
pnpm dev                  # Start development server (localhost:3000)
pnpm build                # Build for production (runs migrations first)
pnpm start                # Start production server
```

### Code Quality
```bash
pnpm lint                 # Check code with Ultracite (Biome-based linter)
pnpm format               # Auto-fix code issues
```

### Database
```bash
pnpm db:generate          # Generate migration files from schema changes
pnpm db:migrate           # Apply migrations to database
pnpm db:studio            # Open Drizzle Studio (database GUI)
pnpm db:push              # Push schema changes directly (dev only)
pnpm db:pull              # Pull schema from database
```

### Testing
```bash
pnpm test                 # Run Playwright tests (e2e and route tests)
```

## Code Standards

The project uses **Ultracite** (a Biome-based formatter/linter) with strict rules defined in `.cursor/rules/ultracite.mdc`. Key principles:

- Use TypeScript strict mode with explicit types
- Prefer `const` over `let`, never use `var`
- Use arrow functions over function expressions
- Import types with `import type`
- Export types with `export type`
- No `any` types, enums, namespaces, or non-null assertions
- Use `for-of` loops instead of `.forEach()`
- Follow accessibility standards (a11y rules)
- Next.js specific: use `next/image` instead of `<img>`, avoid `<head>` in components

## Architecture

### Next.js App Router Structure

The app uses Next.js 15's App Router with route groups:

- `app/(auth)/` - Authentication routes (login, register) and auth configuration
- `app/(chat)/` - Main chat interface and API routes
- `app/layout.tsx` - Root layout with theme provider

### AI Integration

**Model Configuration** (`lib/ai/providers.ts`):
- Uses Vercel AI Gateway to access xAI models
- `chat-model`: Grok Vision (multimodal with vision capabilities)
- `chat-model-reasoning`: Grok 3 Mini with chain-of-thought reasoning (uses `<think>` tags extracted via middleware)
- Test environment uses mock models from `models.mock.ts`

**System Prompts** (`lib/ai/prompts.ts`):
- Regular chat: Concise, friendly assistant with geolocation context
- Reasoning model: Same but without artifact support
- Artifact-specific prompts for code, text, and sheets

**Tools** (`lib/ai/tools/`):
- `getWeather`: Weather lookup using geolocation
- `createDocument`: Create artifacts (text, code, sheets, images)
- `updateDocument`: Modify existing artifacts
- `requestSuggestions`: Suggest improvements to documents

**Chat API Flow** (`app/(chat)/api/chat/route.ts`):
1. Validate request and check user authentication
2. Enforce rate limits based on user type (guest vs regular)
3. Load existing chat or create new one with generated title
4. Stream response using AI SDK's `streamText` with tools
5. Track token usage via TokenLens library
6. Save messages and usage stats to database

### Database Schema

Uses **Drizzle ORM** with PostgreSQL (`lib/db/schema.ts`):

- `User` - User accounts with email/password
- `Chat` - Chat sessions with title, visibility, and usage tracking
- `Message_v2` - Messages with parts (content blocks) and attachments
- `Vote_v2` - Message voting (upvote/downvote)
- `Document` - Artifacts created during chat (text, code, image, sheet)
- `Suggestion` - AI-generated suggestions for documents
- `Stream` - Stream IDs for resumable streaming

**Migration Pattern**: Schema uses `_v2` tables for messages and votes (deprecated versions exist for backward compatibility). The build process runs migrations automatically.

### Authentication

Uses **NextAuth.js v5** with two providers:

1. **Credentials**: Email/password for regular users
2. **Guest**: Auto-created guest accounts with email pattern matching `guestRegex`

User types (`guest` | `regular`) determine entitlements (message rate limits). Middleware (`middleware.ts`) enforces authentication on all routes except `/api/auth`, redirecting unauthenticated users to guest login.

### Frontend Components

**Key Components** (`components/`):
- `chat.tsx` - Main chat interface with message stream handling
- `artifact.tsx` - Artifact viewer (renders text, code, sheets, images)
- `message.tsx` - Individual message rendering with markdown/code support
- `app-sidebar.tsx` - Sidebar with chat history
- `data-stream-handler.tsx` - Handles real-time data streams from API

**Custom Hooks** (`hooks/`):
- `use-artifact.ts` - Manages artifact state and rendering
- `use-auto-resume.ts` - Auto-resume interrupted streams (requires Redis)
- `use-chat-visibility.ts` - Manages chat visibility (public/private)
- `use-messages.tsx` - Message list management
- `use-scroll-to-bottom.tsx` - Auto-scroll behavior

### Artifacts System

Artifacts are interactive documents rendered alongside chat:

- **Types**: `text`, `code`, `image`, `sheet` (defined in `components/artifact.tsx`)
- **Code Execution**: Python code artifacts run in a sandboxed environment
- **Storage**: Artifacts saved to `Document` table via tools
- **Real-time Updates**: Changes stream to UI via `updateDocument` tool

### Resumable Streams

The app supports resumable streaming (commented out in production):
- Requires Redis (`REDIS_URL` environment variable)
- Uses `resumable-stream` package to handle stream interruptions
- Stream IDs tracked in `Stream` table

## Environment Setup

Required environment variables (see `.env.example`):

```bash
AUTH_SECRET=              # Random secret for NextAuth (generate with openssl rand -base64 32)
AI_GATEWAY_API_KEY=       # Only needed for non-Vercel deployments
BLOB_READ_WRITE_TOKEN=    # Vercel Blob storage for file uploads
POSTGRES_URL=             # PostgreSQL connection string
REDIS_URL=                # Optional, for resumable streams
```

For Vercel deployments, AI Gateway uses OIDC tokens automatically. For local/non-Vercel deployments, set `AI_GATEWAY_API_KEY`.

## Testing

Tests use **Playwright** (`playwright.config.ts`):
- Test directory: `tests/`
- Two projects: `e2e` (end-to-end tests) and `routes` (API route tests)
- Tests run against local dev server on port 3000
- 240-second timeout for tests involving AI responses

## Key Patterns

### Error Handling
Use `ChatSDKError` class (`lib/errors.ts`) for standardized error responses:
```typescript
return new ChatSDKError("unauthorized:chat").toResponse();
```

### Database Queries
Database helpers in `lib/db/queries.ts` use Drizzle ORM. Always use provided helper functions rather than raw queries.

### Token Usage Tracking
The app uses **TokenLens** to track and display token usage:
- Catalog fetched and cached for 24 hours
- Usage enriched with cost/token data in `onFinish` callback
- Stored in `Chat.lastContext` field

### Message Parts
Messages use a "parts" structure (array of content blocks) instead of a single content string. Convert between UI messages and model messages using helpers in `lib/utils.ts`.

## Switching AI Providers

To use a different AI provider (e.g., OpenAI, Anthropic):

1. Install provider package: `pnpm add @ai-sdk/openai`
2. Update `lib/ai/providers.ts` to use the new provider
3. Update model IDs in `lib/ai/models.ts`
4. Set required environment variables for the provider

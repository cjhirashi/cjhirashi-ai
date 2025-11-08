# Chat Migration - Visual Guide

## Before & After - File Structure

### BEFORE MIGRATION

```
app/
├── (auth)/
│   ├── login/
│   ├── register/
│   └── api/auth/[...nextauth]/
│
├── (dashboard)/
│   ├── dashboard/
│   │   ├── chat/              ← USER VISITS /dashboard/chat
│   │   │   ├── page.tsx       ← NEW CHAT PAGE
│   │   │   └── [id]/
│   │   │       └── page.tsx   ← EXISTING CHAT PAGE
│   │   ├── documents/
│   │   ├── settings/
│   │   └── ...
│   ├── profile/
│   └── actions.ts
│
├── (public)/
│   └── page.tsx
│
└── api/
    ├── chat/                  ← USER SENDS MESSAGE TO /api/chat
    │   ├── route.ts
    │   ├── schema.ts
    │   └── [id]/
    │       └── stream/
    │           └── route.ts
    ├── document/
    │   └── route.ts
    ├── files/
    │   └── upload/
    │       └── route.ts
    ├── history/
    │   └── route.ts
    ├── vote/
    │   └── route.ts
    └── suggestions/
        └── route.ts
```

### AFTER MIGRATION

```
app/
├── (auth)/
│   ├── login/
│   ├── register/
│   └── api/auth/[...nextauth]/
│
├── (dashboard)/
│   ├── agents/                ← NEW: AGENTS SECTION
│   │   └── chat-general/      ← NEW: GENERAL CHAT AGENT
│   │       ├── page.tsx       ← MOVED: NEW CHAT PAGE
│   │       └── [id]/
│   │           └── page.tsx   ← MOVED: EXISTING CHAT PAGE
│   ├── dashboard/             ← OLD: STILL HERE (REDIRECTS)
│   │   ├── chat/              ← REDIRECTS TO /dashboard/agents/chat-general
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── documents/
│   │   ├── settings/
│   │   └── ...
│   ├── profile/
│   └── actions.ts
│
├── (public)/
│   └── page.tsx
│
└── api/
    ├── agents/                ← NEW: AGENTS API SECTION
    │   └── chat-general/      ← NEW: GENERAL CHAT AGENT API
    │       ├── chat/          ← NEW: CHAT ENDPOINT
    │       │   ├── route.ts
    │       │   ├── schema.ts
    │       │   └── [id]/
    │       │       └── stream/
    │       │           └── route.ts
    │       ├── document/
    │       │   └── route.ts
    │       ├── files/
    │       │   └── upload/
    │       │       └── route.ts
    │       ├── history/
    │       │   └── route.ts
    │       ├── vote/
    │       │   └── route.ts
    │       └── suggestions/
    │           └── route.ts
    ├── chat/                  ← OLD: STILL HERE (REDIRECTS)
    │   ├── route.ts           ← REDIRECTS TO /api/agents/chat-general/chat
    │   ├── schema.ts
    │   └── [id]/
    │       └── stream/
    │           └── route.ts
    ├── document/              ← OLD: STILL HERE (REDIRECTS)
    │   └── route.ts
    ├── files/                 ← OLD: STILL HERE (REDIRECTS)
    │   └── upload/
    │       └── route.ts
    ├── history/               ← OLD: STILL HERE (REDIRECTS)
    │   └── route.ts
    ├── vote/                  ← OLD: STILL HERE (REDIRECTS)
    │   └── route.ts
    └── suggestions/           ← OLD: STILL HERE (REDIRECTS)
        └── route.ts
```

**Key:** GREEN = NEW | GRAY = REDIRECTS | BLUE = UNCHANGED

---

## User Journey - Before & After

### BEFORE MIGRATION

```
User visits /dashboard/chat
        ↓
Middleware: No redirect, proceed
        ↓
Load: app/(dashboard)/dashboard/chat/page.tsx
        ↓
Render: <Chat /> component
        ↓
Send message to POST /api/chat
        ↓
API Handler: app/api/chat/route.ts
        ↓
Generate title, save chat, stream response
        ↓
Client receives message
        ↓
Fetch history from GET /api/history
        ↓
Display chat history
```

### AFTER MIGRATION (New User)

```
User visits /dashboard/agents/chat-general
        ↓
Middleware: No redirect, proceed
        ↓
Load: app/(dashboard)/agents/chat-general/page.tsx (NEW LOCATION)
        ↓
Render: <Chat /> component (same component, updated endpoint)
        ↓
Send message to POST /api/agents/chat-general/chat (NEW ENDPOINT)
        ↓
API Handler: app/api/agents/chat-general/chat/route.ts (NEW LOCATION)
        ↓
Generate title, save chat, stream response
        ↓
Client receives message
        ↓
Fetch history from GET /api/agents/chat-general/history (NEW ENDPOINT via redirect)
        ↓
Display chat history
```

### AFTER MIGRATION (Legacy User with Old Bookmark)

```
User visits /dashboard/chat (OLD BOOKMARK)
        ↓
Middleware: Detect /dashboard/chat
        ↓
Redirect 308: /dashboard/chat → /dashboard/agents/chat-general
        ↓
Load: app/(dashboard)/agents/chat-general/page.tsx (NEW LOCATION)
        ↓
Render: <Chat /> component
        ↓
Send message to POST /api/agents/chat-general/chat (UPDATED ENDPOINT)
        ↓
API Handler: app/api/agents/chat-general/chat/route.ts (NEW LOCATION)
        ↓
Generate title, save chat, stream response
        ↓
Client receives message
        ↓
Browser makes GET /api/history (OLD API) - But middleware redirects!
        ↓
Redirect 308: /api/history → /api/agents/chat-general/history
        ↓
API Handler processes the request at NEW LOCATION
        ↓
Display chat history
        ↓
✓ All transparent to user!
```

---

## Code Changes - Visual Diff

### Change 1: Component Endpoint

```diff
// components/chat.tsx

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    resumeStream,
  } = useChat<ChatMessage>({
    id,
    messages: initialMessages,
    experimental_throttle: 100,
    generateId: generateUUID,
    transport: new DefaultChatTransport({
-     api: "/api/chat",
+     api: "/api/agents/chat-general/chat",
      fetch: fetchWithErrorHandlers,
      prepareSendMessagesRequest(request) {
```

### Change 2: Import Fix

```diff
// app/api/chat/route.ts (or the new location after copying)

  import { geolocation } from "@vercel/functions";
  import {
    convertToModelMessages,
    createUIMessageStream,
    JsonToSseTransformStream,
    smoothStream,
    stepCountIs,
    streamText,
  } from "ai";
  import { unstable_cache as cache } from "next/cache";
  import { after } from "next/server";
  import {
    createResumableStreamContext,
    type ResumableStreamContext,
  } from "resumable-stream";
  import type { ModelCatalog } from "tokenlens/core";
  import { fetchModels } from "tokenlens/fetch";
  import { getUsage } from "tokenlens/helpers";
  import { auth, type UserType } from "@/app/(auth)/auth";
  import type { VisibilityType } from "@/components/visibility-selector";
  import { entitlementsByUserType } from "@/lib/ai/entitlements";
  import type { ChatModel } from "@/lib/ai/models";
  import { type RequestHints, systemPrompt } from "@/lib/ai/prompts";
  import { myProvider } from "@/lib/ai/providers";
  import { createDocument } from "@/lib/ai/tools/create-document";
  import { getWeather } from "@/lib/ai/tools/get-weather";
  import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
  import { updateDocument } from "@/lib/ai/tools/update-document";
  import { isProductionEnvironment } from "@/lib/constants";
  import {
    createStreamId,
    deleteChatById,
    getChatById,
    getMessageCountByUserId,
    getMessagesByChatId,
    saveChat,
    saveMessages,
    updateChatLastContextById,
  } from "@/lib/db/queries";
  import { ChatSDKError } from "@/lib/errors";
  import type { ChatMessage } from "@/lib/types";
  import type { AppUsage } from "@/lib/usage";
  import { convertToUIMessages, generateUUID } from "@/lib/utils";
- import { generateTitleFromUserMessage } from "../../actions";
+ import { generateTitleFromUserMessage } from "@/app/(dashboard)/actions";
  import { type PostRequestBody, postRequestBodySchema } from "./schema";
```

### Change 3: Middleware Redirects

```diff
// middleware.ts (added BEFORE the final return)

  // 5. API ROUTES: Require authentication
  if (pathname.startsWith("/api/")) {
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if guest trying to access protected endpoints
    const isGuest = guestRegex.test(token?.email ?? "");
    const guestRestrictedEndpoints = ["/api/document", "/api/files/upload"];

    if (
      isGuest &&
      guestRestrictedEndpoints.some((ep) => pathname.startsWith(ep))
    ) {
      return NextResponse.json(
        { error: "This feature requires a registered account" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

+ // 6. LEGACY ROUTE REDIRECTS: Maintain backward compatibility
+
+ // Dashboard route redirects
+ if (pathname === "/dashboard/chat") {
+   return NextResponse.redirect(
+     new URL("/dashboard/agents/chat-general", request.url),
+     { status: 308 }
+   );
+ }
+
+ if (pathname.startsWith("/dashboard/chat/")) {
+   const chatId = pathname.replace("/dashboard/chat/", "");
+   return NextResponse.redirect(
+     new URL(`/dashboard/agents/chat-general/${chatId}`, request.url),
+     { status: 308 }
+   );
+ }
+
+ // API endpoint redirects - Order matters! Check specific routes before general ones
+
+ // /api/chat/* routes (must be before /api/chat exact match)
+ if (pathname.startsWith("/api/chat/")) {
+   const rest = pathname.replace("/api/chat/", "");
+   const newUrl = new URL(`/api/agents/chat-general/chat/${rest}`, request.url);
+   newUrl.search = request.nextUrl.search;
+   return NextResponse.redirect(newUrl, { status: 308 });
+ }
+
+ // /api/chat exact match
+ if (pathname === "/api/chat") {
+   const newUrl = new URL("/api/agents/chat-general/chat", request.url);
+   newUrl.search = request.nextUrl.search;
+   return NextResponse.redirect(newUrl, { status: 308 });
+ }
+
+ // /api/document routes
+ if (pathname.startsWith("/api/document")) {
+   const newUrl = new URL("/api/agents/chat-general/document", request.url);
+   newUrl.search = request.nextUrl.search;
+   return NextResponse.redirect(newUrl, { status: 308 });
+ }
+
+ // /api/files/upload routes
+ if (pathname.startsWith("/api/files/upload")) {
+   const newUrl = new URL("/api/agents/chat-general/files/upload", request.url);
+   newUrl.search = request.nextUrl.search;
+   return NextResponse.redirect(newUrl, { status: 308 });
+ }
+
+ // /api/history routes
+ if (pathname.startsWith("/api/history")) {
+   const newUrl = new URL("/api/agents/chat-general/history", request.url);
+   newUrl.search = request.nextUrl.search;
+   return NextResponse.redirect(newUrl, { status: 308 });
+ }
+
+ // /api/vote routes
+ if (pathname.startsWith("/api/vote")) {
+   const newUrl = new URL("/api/agents/chat-general/vote", request.url);
+   newUrl.search = request.nextUrl.search;
+   return NextResponse.redirect(newUrl, { status: 308 });
+ }
+
+ // /api/suggestions routes
+ if (pathname.startsWith("/api/suggestions")) {
+   const newUrl = new URL("/api/agents/chat-general/suggestions", request.url);
+   newUrl.search = request.nextUrl.search;
+   return NextResponse.redirect(newUrl, { status: 308 });
+ }

  // 7. Default: Allow (for static assets, etc.)
  return NextResponse.next();
```

---

## Request Flow - Before vs After

### User sends a message

```
BEFORE MIGRATION:
┌─────────────────┐
│  Browser POST   │
│  /api/chat      │
└────────┬────────┘
         │
         ↓
┌─────────────────────┐
│  Middleware Check   │
│  (auth, etc)        │
└────────┬────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Route Handler                      │
│  app/api/chat/route.ts              │
│  → generateTitleFromUserMessage()    │
│  → saveChat() to DB                 │
│  → streamText() response            │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────┐
│  Response       │
│  Streamed data  │
└─────────────────┘

AFTER MIGRATION (Direct):
┌──────────────────────────┐
│  Browser POST            │
│  /api/agents/chat...     │
│  (component endpoint)    │
└────────┬─────────────────┘
         │
         ↓
┌─────────────────────┐
│  Middleware Check   │
│  (auth, etc)        │
└────────┬────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│  Route Handler                           │
│  app/api/agents/chat-general/chat/       │
│  route.ts                                │
│  → generateTitleFromUserMessage()         │
│  → saveChat() to DB                      │
│  → streamText() response                 │
└────────┬─────────────────────────────────┘
         │
         ↓
┌─────────────────┐
│  Response       │
│  Streamed data  │
└─────────────────┘

AFTER MIGRATION (Legacy using old bookmark):
┌─────────────────┐
│  Browser POST   │
│  /api/chat      │
│  (old endpoint) │
└────────┬────────┘
         │
         ↓
┌──────────────────────────┐
│  Middleware Check        │
│  (auth, etc) + REDIRECT  │
│  Detects /api/chat       │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│  308 Redirect Response           │
│  Location:                       │
│  /api/agents/chat-general/chat   │
└────────┬───────────────────────────┘
         │
         ↓
┌──────────────────────────┐
│  Browser Resends POST    │
│  /api/agents/chat...     │
└────────┬─────────────────┘
         │
         ↓
   [Same as Direct flow above]
```

---

## Rollback Flowchart

```
Something breaks?
    │
    ├─→ Type check error?
    │   └─→ Check import in route.ts
    │       └─→ Fix and rebuild
    │
    ├─→ Chat endpoint not found (404)?
    │   └─→ Verify: /api/agents/chat-general/chat exists
    │       └─→ Check component endpoint change
    │
    ├─→ Old routes not redirecting?
    │   └─→ Verify middleware redirects in place
    │       └─→ Check syntax of redirect code
    │
    └─→ Still broken?
        └─→ ROLLBACK:
            1. git checkout app/(dashboard)/dashboard/chat/
            2. git checkout app/api/chat/
            3. git checkout components/chat.tsx
            4. git checkout middleware.ts
            5. pnpm dev
            6. Investigate issue
```

---

## Migration Checklist - Visual

```
PHASE 1: PREPARATION
  ✓ Read all documentation
  ✓ Commit current changes
  ✓ Create backup branch

PHASE 2: FILE OPERATIONS
  □ Create new directories (7 dirs)
  □ Fix import in api/chat/route.ts (1 line change)
  □ Copy page files (2 files)
  □ Copy API route files (8 files)

PHASE 3: CODE CHANGES
  □ Update components/chat.tsx (1 line change)
  □ Update middleware.ts (~70 lines addition)

PHASE 4: VERIFICATION
  □ Type check: pnpm type-check
  □ Lint: pnpm lint
  □ Dev server: pnpm dev
  □ Test new route: /dashboard/agents/chat-general
  □ Test old redirect: /dashboard/chat
  □ Send message and verify Network tab
  □ Build: pnpm build
  □ Tests: pnpm test

PHASE 5: CLEANUP (Optional)
  □ Delete old dashboard/chat directory
  □ Delete old api/chat directory
  □ Delete old api/document directory
  □ Delete old api/files directory
  □ Delete old api/history directory
  □ Delete old api/vote directory
  □ Delete old api/suggestions directory

PHASE 6: MONITORING
  □ Monitor error logs for 24 hours
  □ Check for failed redirects (404s)
  □ Verify performance metrics
  □ Confirm no user complaints

PHASE 7: DOCUMENTATION
  □ Update team docs/wiki
  □ Announce migration to users
  □ Archive this guide for reference
```

---

## Success Indicators

✓ All green = Success!

```
Type Checking    ████████████████████ PASS
Linting          ████████████████████ PASS
Build            ████████████████████ PASS
Dev Server       ████████████████████ PASS
Chat Creation    ████████████████████ PASS
Message Sending  ████████████████████ PASS
Old URL Redirect ████████████████████ PASS
Old API Redirect ████████████████████ PASS
Tests            ████████████████████ PASS

Migration Status: ✓ COMPLETE
                  ✓ VERIFIED
                  ✓ STABLE
```

# Chat Restructuring Migration Plan

## Overview

This document outlines the migration from `/dashboard/chat` to `/dashboard/agents/chat-general` and corresponding API changes.

## Current Structure

```
app/(dashboard)/
├── dashboard/
│   └── chat/
│       ├── page.tsx (new chat)
│       └── [id]/page.tsx (existing chat)

app/api/
├── chat/
│   ├── route.ts
│   ├── schema.ts
│   └── [id]/stream/route.ts
├── document/route.ts
├── files/upload/route.ts
├── history/route.ts
├── vote/route.ts
└── suggestions/route.ts
```

## Target Structure

```
app/(dashboard)/
├── agents/
│   └── chat-general/
│       ├── layout.tsx (optional)
│       ├── page.tsx (new chat)
│       ├── [id]/page.tsx (existing chat)
│       └── actions.ts

app/api/agents/
└── chat-general/
    ├── chat/
    │   ├── route.ts
    │   ├── schema.ts
    │   └── [id]/stream/route.ts
    ├── document/route.ts
    ├── files/upload/route.ts
    ├── history/route.ts
    ├── vote/route.ts
    └── suggestions/route.ts
```

## Migration Steps

### Phase 1: Create New Directory Structure

1. Create directories:
   - `app/(dashboard)/agents/chat-general/[id]/`
   - `app/api/agents/chat-general/chat/[id]/stream/`
   - `app/api/agents/chat-general/document/`
   - `app/api/agents/chat-general/files/upload/`
   - `app/api/agents/chat-general/history/`
   - `app/api/agents/chat-general/vote/`
   - `app/api/agents/chat-general/suggestions/`

### Phase 2: Copy Page Files

1. Copy `app/(dashboard)/dashboard/chat/page.tsx` → `app/(dashboard)/agents/chat-general/page.tsx`
2. Copy `app/(dashboard)/dashboard/chat/[id]/page.tsx` → `app/(dashboard)/agents/chat-general/[id]/page.tsx`

### Phase 3: Move API Routes

1. Copy `app/api/chat/route.ts` → `app/api/agents/chat-general/chat/route.ts`
2. Copy `app/api/chat/schema.ts` → `app/api/agents/chat-general/chat/schema.ts`
3. Copy `app/api/chat/[id]/stream/route.ts` → `app/api/agents/chat-general/chat/[id]/stream/route.ts`
4. Copy `app/api/document/route.ts` → `app/api/agents/chat-general/document/route.ts`
5. Copy `app/api/files/upload/route.ts` → `app/api/agents/chat-general/files/upload/route.ts`
6. Copy `app/api/history/route.ts` → `app/api/agents/chat-general/history/route.ts`
7. Copy `app/api/vote/route.ts` → `app/api/agents/chat-general/vote/route.ts`
8. Copy `app/api/suggestions/route.ts` → `app/api/agents/chat-general/suggestions/route.ts`

### Phase 4: Copy Shared Actions

1. Copy `app/(dashboard)/actions.ts` → `app/(dashboard)/agents/chat-general/actions.ts`
   - Or keep in shared location and import from there

### Phase 5: Update API Route Imports

In the new chat API routes, update the import for actions:

**Old:**
```typescript
import { generateTitleFromUserMessage } from "../../actions";
```

**New (Option A - Shared location):**
```typescript
import { generateTitleFromUserMessage } from "@/app/(dashboard)/actions";
```

**New (Option B - Local copy):**
```typescript
import { generateTitleFromUserMessage } from "../actions";
```

### Phase 6: Update Component References

Update `components/chat.tsx` to use new API endpoint:

**Old:**
```typescript
api: "/api/chat",
```

**New:**
```typescript
api: "/api/agents/chat-general/chat",
```

### Phase 7: Update Middleware

Update `middleware.ts`:

1. Add new route protection for `/dashboard/agents/*`
2. Update legacy route redirects to point to new location
3. Update `/api/chat` endpoint references

**Changes in middleware.ts:**

1. Update guest user redirect:
```typescript
// OLD
return NextResponse.redirect(new URL("/api/auth/guest", request.url));

// NEW - No change needed in auth middleware, but dashboard protection applies
```

2. Add legacy route redirects:
```typescript
// LEGACY ROUTE REDIRECTS
if (pathname === "/dashboard/chat") {
  return NextResponse.redirect(
    new URL("/dashboard/agents/chat-general", request.url),
    { status: 308 }
  );
}

if (pathname.startsWith("/dashboard/chat/")) {
  const chatId = pathname.replace("/dashboard/chat/", "");
  return NextResponse.redirect(
    new URL(`/dashboard/agents/chat-general/${chatId}`, request.url),
    { status: 308 }
  );
}

// LEGACY API REDIRECTS
if (pathname === "/api/chat") {
  const newUrl = new URL("/api/agents/chat-general/chat", request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl, { status: 308 });
}

if (pathname.startsWith("/api/chat/")) {
  const rest = pathname.replace("/api/chat/", "");
  const newUrl = new URL(`/api/agents/chat-general/chat/${rest}`, request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl, { status: 308 });
}

if (pathname.startsWith("/api/document")) {
  const newUrl = new URL("/api/agents/chat-general/document", request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl, { status: 308 });
}

if (pathname.startsWith("/api/files/upload")) {
  const newUrl = new URL("/api/agents/chat-general/files/upload", request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl, { status: 308 });
}

if (pathname.startsWith("/api/history")) {
  const newUrl = new URL("/api/agents/chat-general/history", request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl, { status: 308 });
}

if (pathname.startsWith("/api/vote")) {
  const newUrl = new URL("/api/agents/chat-general/vote", request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl, { status: 308 });
}

if (pathname.startsWith("/api/suggestions")) {
  const newUrl = new URL("/api/agents/chat-general/suggestions", request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl, { status: 308 });
}
```

3. Update config matcher to include new routes:
```typescript
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/api/:path*",
    "/login",
    "/register",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

### Phase 8: Cleanup

1. Delete `app/(dashboard)/dashboard/chat/` directory
2. Delete `app/api/chat/` directory
3. Delete `app/api/document/` directory
4. Delete `app/api/files/upload/` directory (including parent)
5. Delete `app/api/history/` directory
6. Delete `app/api/vote/` directory
7. Delete `app/api/suggestions/` directory

Note: Only delete if no other features use these routes.

### Phase 9: Verification

1. Check for remaining references to old paths:
   ```bash
   grep -r "/api/chat" --include="*.ts" --include="*.tsx" app/
   grep -r "/dashboard/chat" --include="*.ts" --include="*.tsx" app/
   grep -r '"/api/document' --include="*.ts" --include="*.tsx" app/
   grep -r '"/api/files' --include="*.ts" --include="*.tsx" app/
   grep -r '"/api/history' --include="*.ts" --include="*.tsx" app/
   grep -r '"/api/vote' --include="*.ts" --include="*.tsx" app/
   grep -r '"/api/suggestions' --include="*.ts" --include="*.tsx" app/
   ```

2. Run type checking:
   ```bash
   pnpm type-check
   ```

3. Run linting:
   ```bash
   pnpm lint
   ```

4. Test in development:
   ```bash
   pnpm dev
   ```

## Redirect Strategy

The middleware will handle all legacy route redirects with HTTP 308 status codes to preserve the original request method and body. This ensures:

1. Bookmarked URLs continue to work
2. External links to old routes work
3. No SEO impact (308 is permanent but method-preserving)
4. Gradual migration period before removing old routes

## Breaking Changes

None. All legacy routes are redirected to new locations via middleware.

## Files Modified

### Components
- `components/chat.tsx` - Update API endpoint

### Middleware
- `middleware.ts` - Add redirects and update matcher

### Configuration
- None

## Files Created

See "Target Structure" section for complete list of new files.

## Files Deleted

- `app/(dashboard)/dashboard/chat/page.tsx`
- `app/(dashboard)/dashboard/chat/[id]/page.tsx`
- `app/api/chat/route.ts`
- `app/api/chat/schema.ts`
- `app/api/chat/[id]/stream/route.ts`
- `app/api/document/route.ts`
- `app/api/files/upload/route.ts`
- `app/api/history/route.ts`
- `app/api/vote/route.ts`
- `app/api/suggestions/route.ts`

## Verification Checklist

- [ ] New routes respond to requests
- [ ] Chat history loads correctly
- [ ] Messages send and receive properly
- [ ] Document artifacts work
- [ ] File uploads work
- [ ] Old routes redirect to new ones
- [ ] Middleware doesn't break authentication
- [ ] Guest users can still access chat
- [ ] Registered users can access dashboard
- [ ] No console errors or warnings
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Tests pass (if applicable)

## Implementation Order

1. Create new directory structure (Phase 1)
2. Copy page files (Phase 2)
3. Move API routes (Phase 3)
4. Update component references (Phase 6)
5. Update middleware (Phase 7)
6. Verify all updates (Phase 9)
7. Cleanup old files (Phase 8)

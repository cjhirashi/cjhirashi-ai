# Dashboard Restructure - Architecture Document

## Executive Summary

This document defines the architectural design for transforming the current authentication flow and routing structure from a guest-first model to a registration-required model with proper separation between public and authenticated areas.

**Current State**: All routes redirect to automatic guest creation (`/api/auth/guest`), with chat accessible at root `/`.

**Target State**: Public homepage at `/`, authenticated dashboard at `/dashboard/*`, with guest users required to register for access.

---

## 1. Directory Structure

### 1.1 Proposed Structure

```
app/
├── (public)/                          # Public routes (no auth required)
│   ├── layout.tsx                     # Public layout (minimal, no sidebar)
│   ├── page.tsx                       # Homepage (Hero + Features)
│   └── _components/                   # Public-specific components
│       ├── hero-section.tsx
│       ├── features-grid.tsx
│       └── cta-buttons.tsx
│
├── (auth)/                            # Authentication routes (existing)
│   ├── login/
│   │   └── page.tsx                   # Login page (KEEP AS IS)
│   ├── register/
│   │   └── page.tsx                   # Register page (KEEP AS IS)
│   ├── actions.ts                     # Auth actions (KEEP AS IS)
│   ├── auth.ts                        # NextAuth config (MODIFY)
│   ├── auth.config.ts                 # Auth config (KEEP AS IS)
│   └── api/
│       └── auth/
│           ├── [...nextauth]/
│           │   └── route.ts           # NextAuth handler (KEEP AS IS)
│           └── guest/
│               └── route.ts           # DELETE (no longer needed)
│
├── (dashboard)/                       # Authenticated routes (registered users only)
│   ├── layout.tsx                     # Dashboard layout (sidebar + header)
│   ├── dashboard/
│   │   ├── page.tsx                   # Dashboard home (redirect to /dashboard/chat)
│   │   ├── chat/
│   │   │   ├── page.tsx               # New chat (FROM current app/(chat)/page.tsx)
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Specific chat (FROM app/(chat)/chat/[id]/page.tsx)
│   │   ├── documents/
│   │   │   └── page.tsx               # Documents management (NEW)
│   │   ├── stats/
│   │   │   └── page.tsx               # Usage statistics (NEW)
│   │   └── settings/
│   │       └── page.tsx               # User settings (NEW)
│   ├── actions.ts                     # Dashboard server actions (MOVE from (chat)/actions.ts)
│   └── _components/                   # Dashboard-specific components
│       ├── dashboard-header.tsx
│       ├── dashboard-nav.tsx
│       └── stats/                     # Stats-related components
│           ├── usage-chart.tsx
│           └── stats-card.tsx
│
├── api/                               # API routes (KEEP IN PLACE)
│   ├── chat/
│   │   ├── route.ts                   # Chat creation endpoint
│   │   ├── [id]/
│   │   │   └── stream/
│   │   │       └── route.ts           # Chat streaming endpoint
│   │   └── schema.ts                  # Chat validation schemas
│   ├── document/
│   │   └── route.ts                   # Document operations
│   ├── files/
│   │   └── upload/
│   │       └── route.ts               # File upload endpoint
│   ├── history/
│   │   └── route.ts                   # Chat history endpoint
│   ├── suggestions/
│   │   └── route.ts                   # Suggestions endpoint
│   └── vote/
│       └── route.ts                   # Vote endpoint
│
├── layout.tsx                         # Root layout (theme, analytics)
├── globals.css                        # Global styles
└── favicon.ico

components/                            # Shared components (KEEP AS IS)
├── chat.tsx                           # Main chat component
├── app-sidebar.tsx                    # Sidebar component (MODIFY)
├── sidebar-user-nav.tsx               # User navigation (MODIFY)
├── auth-form.tsx                      # Auth form component
└── ui/                                # UI primitives
    └── ...

middleware.ts                          # Route protection (MAJOR CHANGES)
```

### 1.2 Key Structural Decisions

**Route Groups Explained**:

1. **`(public)/`** - Unauthenticated Area
   - No authentication required
   - Minimal layout (no sidebar, just header/footer)
   - Marketing/informational content
   - Routes: `/`, potentially `/about`, `/pricing`, etc.

2. **`(auth)/`** - Authentication Area
   - Login and registration flows
   - Guest creation removed
   - Routes: `/login`, `/register`

3. **`(dashboard)/`** - Authenticated Area
   - Requires registered user authentication
   - Full sidebar navigation
   - All chat and document functionality
   - Routes: `/dashboard`, `/dashboard/chat`, `/dashboard/chat/[id]`, etc.

**Why this structure?**
- Clear separation of concerns (public vs. authenticated)
- Next.js 15 route groups prevent URL pollution (parentheses don't appear in URLs)
- Easier to apply different layouts and middleware rules
- Scalable for future features (e.g., `/dashboard/projects`, `/dashboard/team`)

---

## 2. Authentication Flow Changes

### 2.1 Current Flow (Guest-First)

```
User Visits /
    ↓
Middleware: No session?
    ↓
Redirect to /api/auth/guest
    ↓
Create Guest User Automatically
    ↓
Set Session with guest-XXXX email
    ↓
Redirect back to /
    ↓
Show Chat Interface
```

### 2.2 New Flow (Registration-Required)

```
┌─────────────────────────────────────────────────────────────┐
│                     PUBLIC ROUTES                           │
│                                                              │
│  User Visits /                                              │
│      ↓                                                       │
│  Middleware: Check route group                              │
│      ↓                                                       │
│  Is (public) route? → YES → Allow access                   │
│      ↓                                                       │
│  Show Homepage (Hero + Features)                            │
│      ↓                                                       │
│  User clicks "Login" or "Get Started"                       │
│      ↓                                                       │
│  Navigate to /login or /register                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION ROUTES                       │
│                                                              │
│  /login or /register                                        │
│      ↓                                                       │
│  Middleware: Is (auth) route? → YES → Allow access         │
│      ↓                                                       │
│  User submits credentials                                   │
│      ↓                                                       │
│  Auth.js validates credentials                              │
│      ↓                                                       │
│  Success? → YES → Create session                            │
│      ↓                                                       │
│  Set JWT with user.id and user.type = "regular"            │
│      ↓                                                       │
│  Redirect to /dashboard                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   DASHBOARD ROUTES                           │
│                                                              │
│  User navigates to /dashboard/*                             │
│      ↓                                                       │
│  Middleware: Is (dashboard) route? → YES                    │
│      ↓                                                       │
│  Check session exists                                        │
│      ↓                                                       │
│  No session? → Redirect to /login (save returnUrl)         │
│      ↓                                                       │
│  Has session? → Check user.type                             │
│      ↓                                                       │
│  Is guest? → Redirect to /register (prompt upgrade)        │
│      ↓                                                       │
│  Is regular? → Allow access to dashboard                    │
│      ↓                                                       │
│  Render Dashboard with Sidebar + Content                    │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Authentication State Machine

```
┌─────────────┐
│ Unauthenticated │ ────────┐
└─────────────┘            │
       ↓                    │
  Register/Login            │
       ↓                    │
┌─────────────┐            │
│  Registered │            │
│    User     │            │
└─────────────┘            │
       ↓                    │
  Access Dashboard          │
       ↓                    │
   Use Features             │
       ↓                    │
  Sign Out ─────────────────┘
```

**Critical Change**: Guest users are completely removed from the authentication flow.

---

## 3. Middleware Logic

### 3.1 Current Middleware Behavior

```typescript
// Current: middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for /api/auth
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({...});

  // NO TOKEN? → Redirect to guest creation
  if (!token) {
    return NextResponse.redirect(
      new URL(`/api/auth/guest?redirectUrl=${redirectUrl}`, request.url)
    );
  }

  // Has token + not guest + on /login or /register? → Redirect to /
  const isGuest = guestRegex.test(token?.email ?? "");
  if (token && !isGuest && ["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
```

### 3.2 New Middleware Behavior

```typescript
// Proposed: middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Playwright health check
  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  // 2. Allow all /api/auth routes (login, register, session)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 3. PUBLIC ROUTES: Allow without authentication
  const publicRoutes = ["/", "/login", "/register"];
  if (publicRoutes.includes(pathname)) {
    const token = await getToken({...});

    // Already authenticated? Redirect away from auth pages
    if (token && ["/login", "/register"].includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // 4. DASHBOARD ROUTES: Require registered user authentication
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({...});

    // No session? → Login with return URL
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Session exists but is guest? → Force registration
    const isGuest = guestRegex.test(token?.email ?? "");
    if (isGuest) {
      const registerUrl = new URL("/register", request.url);
      registerUrl.searchParams.set("message", "Please register to access the dashboard");
      return NextResponse.redirect(registerUrl);
    }

    // Registered user → Allow access
    return NextResponse.next();
  }

  // 5. API ROUTES: Require any authentication (guest or registered)
  if (pathname.startsWith("/api/")) {
    const token = await getToken({...});

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if guest trying to access protected endpoints
    const isGuest = guestRegex.test(token?.email ?? "");
    const guestRestrictedEndpoints = [
      "/api/document",
      "/api/files/upload",
      // Add other endpoints that guests shouldn't access
    ];

    if (isGuest && guestRestrictedEndpoints.some(ep => pathname.startsWith(ep))) {
      return NextResponse.json(
        { error: "This feature requires a registered account" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  // 6. LEGACY ROUTES: Handle backward compatibility
  if (pathname.startsWith("/chat/")) {
    const chatId = pathname.replace("/chat/", "");
    return NextResponse.redirect(
      new URL(`/dashboard/chat/${chatId}`, request.url)
    );
  }

  // 7. Default: Allow (for static assets, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/chat/:path*",      // Legacy route handling
    "/api/:path*",
    "/login",
    "/register",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

### 3.3 Middleware Decision Matrix

| Route Pattern | No Session | Guest Session | Registered Session |
|--------------|------------|---------------|-------------------|
| `/` | Allow | Allow | Allow |
| `/login` | Allow | Redirect to `/dashboard` | Redirect to `/dashboard` |
| `/register` | Allow | Redirect to `/dashboard` | Redirect to `/dashboard` |
| `/dashboard/*` | Redirect to `/login?returnUrl=...` | Redirect to `/register?message=...` | Allow |
| `/api/chat/*` | 401 Error | Allow (limited) | Allow (full) |
| `/api/document/*` | 401 Error | 403 Error | Allow |
| `/chat/[id]` (legacy) | Redirect to `/login` | Redirect to `/register` | Redirect to `/dashboard/chat/[id]` |

---

## 4. Component Changes

### 4.1 Layout Hierarchy

```
Root Layout (app/layout.tsx)
├── Theme Provider
├── Analytics
└── Font Configuration
    │
    ├─── Public Layout (app/(public)/layout.tsx)
    │    ├── Simple Header
    │    └── Footer
    │
    ├─── Auth Layout (app/(auth)/login/page.tsx, register/page.tsx)
    │    └── Centered Form Container
    │
    └─── Dashboard Layout (app/(dashboard)/layout.tsx)
         ├── DataStreamProvider
         ├── SidebarProvider
         ├── AppSidebar (with user nav)
         └── SidebarInset (main content area)
```

### 4.2 Components to Modify

**`components/app-sidebar.tsx`**
- **Current**: Shows history, user nav
- **Changes**:
  - Add navigation items for `/dashboard/chat`, `/dashboard/documents`, `/dashboard/stats`, `/dashboard/settings`
  - Update history links to point to `/dashboard/chat/[id]`
  - Remove guest-specific UI elements

**`components/sidebar-user-nav.tsx`**
- **Current**: Shows "Guest" label, "Login to your account" action for guests
- **Changes**:
  - Remove guest detection logic (no guests in dashboard)
  - Always show user email
  - Update sign-out redirect from `/` to `/login`

**`components/chat.tsx`**
- **Current**: Used in `app/(chat)/page.tsx` and `app/(chat)/chat/[id]/page.tsx`
- **Changes**:
  - No code changes needed
  - Component is reusable and will work in new location

### 4.3 New Components to Create

**`app/(public)/_components/hero-section.tsx`**
- Purpose: Landing page hero with headline, description, CTA buttons
- Dependencies: `components/ui/button`
- Props: None (static content)

**`app/(public)/_components/features-grid.tsx`**
- Purpose: Feature showcase cards
- Dependencies: `components/ui/card`
- Props: None (static content)

**`app/(public)/_components/cta-buttons.tsx`**
- Purpose: Login/Register buttons
- Dependencies: `components/ui/button`, `next/link`
- Props: None

**`app/(dashboard)/dashboard/documents/page.tsx`**
- Purpose: Document/artifact management interface
- Dependencies: `@/lib/db/queries`, `components/document-preview`
- Functionality: List, view, edit, delete documents

**`app/(dashboard)/dashboard/stats/page.tsx`**
- Purpose: Usage statistics dashboard
- Dependencies: `@/lib/db/queries` (new stats queries needed)
- Functionality: Display message count, token usage, chat history

**`app/(dashboard)/dashboard/settings/page.tsx`**
- Purpose: User profile settings
- Dependencies: `app/(auth)/actions`, `components/auth-form`
- Functionality: Update email, password, preferences

---

## 5. Database Considerations

### 5.1 Current Schema

No changes required to the database schema. The existing tables are sufficient:

- `users` table: Supports both guest and regular users (email pattern identifies guests)
- `chats` table: Associated with `userId`
- `messages` table: Associated with `chatId`
- `documents` table: Associated with `userId`
- `votes` table: Associated with `chatId` and `messageId`
- `suggestions` table: Associated with `chatId` and `documentId`

### 5.2 Data Migration Strategy

**Guest User Handling**:

Option A (Recommended): **Soft Deprecation**
- Keep existing guest users in database
- Prevent new guest user creation
- Existing guest sessions redirect to registration
- Existing guest data remains accessible after registration (if user uses same device/browser)

Option B: **Data Purge**
- Identify and delete all guest users (`email LIKE 'guest-%'`)
- Cascade delete associated chats, messages, documents
- Only do this if guest data has no value

**Recommendation**: Use Option A. Guest users who created valuable chats can register and potentially recover their data if they're on the same device.

### 5.3 New Database Queries Needed

**File**: `lib/db/queries.ts`

```typescript
// New queries for statistics page
export async function getUserStats(userId: string) {
  // Return: total chats, total messages, total tokens used
}

export async function getUserDocuments(userId: string) {
  // Return: all documents with metadata
}

export async function getRecentActivity(userId: string, limit: number) {
  // Return: recent chats and messages
}
```

---

## 6. API Route Changes

### 6.1 Current API Protection

All API routes currently accept any authenticated user (guest or regular) except where explicitly checked.

### 6.2 New API Protection Strategy

**No changes required** to individual API route files. Protection is handled by middleware.

However, consider adding utility function for consistent auth checks:

**File**: `lib/auth/utils.ts` (NEW)

```typescript
import { auth } from "@/app/(auth)/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRegisteredUser() {
  const session = await requireAuth();
  if (session.user.type === "guest") {
    throw new Error("This feature requires a registered account");
  }
  return session;
}
```

Usage in API routes:

```typescript
// app/api/document/route.ts
export async function POST(request: Request) {
  const session = await requireRegisteredUser(); // Throws if guest or no session
  // ... rest of handler
}
```

---

## 7. Authentication Configuration Changes

### 7.1 Changes to `app/(auth)/auth.ts`

**Remove**: Guest credentials provider (lines 68-75)

```typescript
// DELETE THIS:
Credentials({
  id: "guest",
  credentials: {},
  async authorize() {
    const [guestUser] = await createGuestUser();
    return { ...guestUser, type: "guest" };
  },
}),
```

**Keep**: Regular credentials provider (email/password authentication)

### 7.2 Changes to `lib/db/queries.ts`

**Mark as Deprecated**: `createGuestUser()` function

```typescript
/**
 * @deprecated Guest users are no longer created automatically.
 * This function is kept for backward compatibility but should not be used.
 */
export async function createGuestUser() {
  // Implementation remains but is not called
}
```

### 7.3 Delete File

**`app/(auth)/api/auth/guest/route.ts`** - No longer needed

---

## 8. Backward Compatibility Strategy

### 8.1 URL Redirects

Handle legacy URLs gracefully in middleware:

```typescript
// /chat/123 → /dashboard/chat/123
if (pathname.startsWith("/chat/")) {
  const chatId = pathname.replace("/chat/", "");
  return NextResponse.redirect(
    new URL(`/dashboard/chat/${chatId}`, request.url)
  );
}
```

### 8.2 Shared Links

**Scenario**: User has shared chat link `/chat/abc123` before the migration.

**Solution**:
1. Middleware redirects to `/dashboard/chat/abc123`
2. If chat is `public` visibility, create a special public view route:
   - `/share/[id]` - Public view (read-only, no auth required)
   - Update `chats` table visibility check to allow public chats without auth

**New Route**: `app/(public)/share/[id]/page.tsx`

```typescript
// Allows public viewing of chats marked as "public"
export default async function PublicChatPage({ params }: { params: { id: string } }) {
  const chat = await getChatById({ id: params.id });

  if (!chat || chat.visibility !== "public") {
    notFound();
  }

  // Render read-only chat view
}
```

### 8.3 Session Migration

**Scenario**: Existing users with active guest sessions.

**Handling**:
1. Guest users redirect to `/register` when accessing `/dashboard/*`
2. Show banner: "You're using a guest account. Register to save your data."
3. After registration, attempt to associate guest data with new account (if email matches device)

---

## 9. Design Patterns Applied

### 9.1 Separation of Concerns

**Presentation Layer**:
- `app/(public)/` - Public-facing UI
- `app/(dashboard)/` - Authenticated UI
- `components/` - Reusable UI components

**Business Logic Layer**:
- `app/(auth)/actions.ts` - Authentication logic
- `app/(dashboard)/actions.ts` - Dashboard operations
- `lib/ai/` - AI/chat logic

**Data Access Layer**:
- `lib/db/queries.ts` - Database operations
- `lib/db/schema.ts` - Database schema

### 9.2 Authentication Patterns

**Pattern**: Middleware-based Route Protection
- Centralized authentication logic
- Consistent across all routes
- Easy to maintain and audit

**Pattern**: Session-based Authentication (NextAuth.js)
- Industry-standard JWT tokens
- Secure cookie storage
- CSRF protection built-in

### 9.3 Layout Composition

**Pattern**: Nested Layouts with Route Groups
- Minimizes code duplication
- Clear visual hierarchy
- Isolated layout logic per route group

---

## 10. Security Considerations

### 10.1 Authentication Flow Security

1. **No Automatic Account Creation**: Eliminates risk of unlimited guest account spam
2. **Session Validation**: All protected routes check session validity
3. **Guest Restriction**: Guests cannot access sensitive features (document management, file uploads)
4. **CSRF Protection**: NextAuth.js provides built-in CSRF tokens
5. **Secure Cookies**: Session cookies are `httpOnly`, `secure` (in production), and `sameSite=strict`

### 10.2 API Security

1. **Middleware Protection**: All API routes validated before handler execution
2. **Error Messages**: Generic error messages prevent information leakage
3. **Rate Limiting**: Consider adding rate limiting to API routes (not in scope)

### 10.3 Data Privacy

1. **User Isolation**: Each user can only access their own chats/documents
2. **Public Chat Validation**: Public chats require explicit visibility flag
3. **Token Security**: JWT secret stored in environment variables

---

## 11. Performance Implications

### 11.1 Middleware Performance

**Current**: Single token check per request

**New**: Multiple conditional checks per request

**Impact**: Negligible (< 5ms per request). Middleware runs on edge runtime.

**Optimization**: Cache public route list as constant.

### 11.2 Layout Rendering

**Current**: Single chat layout with sidebar

**New**: Three distinct layouts (public, auth, dashboard)

**Impact**: Minimal. Layouts are server components and render once per navigation.

### 11.3 Database Queries

**Current**: User session query + chat/message queries

**New**: Same + stats queries (new dashboard pages)

**Impact**: New stats page adds ~2-3 queries. Use React Suspense for loading states.

---

## 12. Testing Strategy

### 12.1 Middleware Testing

**Test Cases**:
1. Unauthenticated user accessing `/` → Allow
2. Unauthenticated user accessing `/dashboard` → Redirect to `/login`
3. Guest user accessing `/dashboard` → Redirect to `/register`
4. Registered user accessing `/dashboard` → Allow
5. Registered user accessing `/login` → Redirect to `/dashboard`
6. Legacy URL `/chat/123` → Redirect to `/dashboard/chat/123`
7. API request without auth → 401 error
8. Guest API request to `/api/document` → 403 error

### 12.2 E2E Testing

**Test Scenarios**:
1. New user registration flow (homepage → register → dashboard)
2. Existing user login flow (homepage → login → dashboard)
3. Guest session upgrade (visit dashboard as guest → redirected to register)
4. Chat creation and viewing in dashboard
5. Document management operations
6. Stats page data display
7. Settings page updates

### 12.3 Component Testing

**Components to Test**:
- Public homepage components (hero, features, CTA)
- Dashboard navigation
- User menu (without guest state)
- New dashboard pages (documents, stats, settings)

---

## 13. Migration Checklist

### Phase 1: Preparation
- [ ] Create `docs/architecture/` documentation
- [ ] Review and approve architecture
- [ ] Create feature branch `feature/dashboard-restructure`
- [ ] Set up test environment

### Phase 2: Structure Setup
- [ ] Create route group directories (`(public)`, `(dashboard)`)
- [ ] Create new layout files
- [ ] Create placeholder pages for new routes

### Phase 3: Middleware Changes
- [ ] Update `middleware.ts` with new logic
- [ ] Add backward compatibility redirects
- [ ] Test all route protection scenarios

### Phase 4: Component Migration
- [ ] Move chat pages to `app/(dashboard)/dashboard/chat/`
- [ ] Update imports and references
- [ ] Modify `app-sidebar.tsx` navigation
- [ ] Update `sidebar-user-nav.tsx` (remove guest logic)

### Phase 5: New Features
- [ ] Create public homepage components
- [ ] Create documents management page
- [ ] Create stats page (+ database queries)
- [ ] Create settings page

### Phase 6: Authentication Cleanup
- [ ] Remove guest credentials provider from `auth.ts`
- [ ] Delete `app/(auth)/api/auth/guest/route.ts`
- [ ] Mark `createGuestUser()` as deprecated
- [ ] Update auth flow tests

### Phase 7: Testing
- [ ] Run middleware tests
- [ ] Run E2E tests
- [ ] Manual QA of all flows
- [ ] Performance testing

### Phase 8: Deployment
- [ ] Deploy to staging
- [ ] Smoke test all features
- [ ] Deploy to production
- [ ] Monitor for errors

---

## 14. Risks and Mitigations

### Risk 1: Breaking Shared Chat Links

**Impact**: Users who shared `/chat/[id]` links before migration

**Mitigation**:
- Implement redirect from `/chat/*` to `/dashboard/chat/*` in middleware
- Create public share route for public chats (`/share/[id]`)
- Show clear error messages for private chats

**Status**: Mitigated

---

### Risk 2: Guest Users Losing Data

**Impact**: Existing guest users may lose their chats if they don't register

**Mitigation**:
- Do NOT delete guest users from database
- Show clear prompt to register when guest accesses dashboard
- Implement session-to-account migration logic (stretch goal)

**Status**: Mitigated

---

### Risk 3: Middleware Performance Degradation

**Impact**: Complex middleware logic could slow down all requests

**Mitigation**:
- Keep middleware logic minimal and performant
- Use early returns to avoid unnecessary checks
- Cache route pattern checks
- Monitor middleware execution time

**Status**: Low risk

---

### Risk 4: Breaking API Integrations

**Impact**: External services calling API routes may break if auth changes

**Mitigation**:
- API routes maintain same authentication behavior
- Only middleware changes affect routing, not API logic
- Document any API breaking changes
- Provide migration notice period (if applicable)

**Status**: Low risk

---

## 15. Future Enhancements

### Short Term (Post-MVP)

1. **Session-to-Account Migration**
   - Allow guests to "upgrade" their account and keep data
   - Implement guest chat ownership transfer

2. **Public Share Links**
   - Generate shareable links for public chats
   - Implement `/share/[id]` route for public viewing

3. **Dashboard Enhancements**
   - Add chart visualizations to stats page
   - Implement document search and filtering
   - Add export functionality for chats

### Long Term

1. **Team Collaboration**
   - Add organization/team support
   - Implement shared workspaces
   - Role-based access control (RBAC)

2. **Advanced Stats**
   - Cost tracking per user
   - Usage analytics dashboard
   - AI model performance metrics

3. **Mobile App**
   - Responsive dashboard design
   - Native mobile authentication
   - Offline support

---

## 16. Conclusion

This architecture transforms the application from a guest-first model to a registration-required model with clear separation between public and authenticated areas.

**Key Benefits**:
- Better security (no automatic account creation)
- Clear user journey (homepage → login → dashboard)
- Scalable structure (easy to add new dashboard features)
- Maintainable codebase (clear separation of concerns)
- Professional UX (proper onboarding flow)

**Implementation Effort**: Medium (estimated 16-24 developer hours)

**Risk Level**: Medium-Low (backward compatibility maintained, no database migrations)

**Recommended Approach**: Phased rollout with comprehensive testing at each phase.

---

## Document Metadata

- **Author**: Architecture Designer Agent
- **Created**: 2025-11-07
- **Version**: 1.0
- **Status**: Draft - Awaiting Approval
- **Related Documents**:
  - `dashboard-restructure-implementation.md` (implementation plan)
  - `dashboard-restructure-migration.md` (migration guide)

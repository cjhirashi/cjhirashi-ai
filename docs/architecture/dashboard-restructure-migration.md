# Dashboard Restructure - Migration Guide

## Overview

This guide details the migration strategy for transitioning from the current guest-first authentication model to the new registration-required dashboard model, with emphasis on backward compatibility and zero-downtime deployment.

**Migration Type**: In-place structural refactor with routing changes

**Downtime Required**: None (with proper deployment strategy)

**Data Migration Required**: No (database schema unchanged)

**User Impact**: Minimal (legacy URLs redirect automatically)

---

## Pre-Migration Checklist

### 1. Environment Preparation

**Development Environment**:
- [ ] Node.js 18+ installed
- [ ] pnpm 9.12+ installed
- [ ] PostgreSQL running
- [ ] `.env` file configured with valid `AUTH_SECRET`

**Database Backup**:
```bash
# Create backup before migration
pnpm db:pull                    # Pull current schema
pg_dump -U postgres -d chatbot > backup_pre_migration.sql
```

**Git Setup**:
```bash
# Ensure clean working directory
git status                      # Should show no uncommitted changes
git checkout dev
git pull origin dev
```

### 2. Dependency Verification

**Verify versions**:
```bash
# Check Next.js version (should be 15.3+)
npm list next

# Check NextAuth version (should be 5.0+)
npm list next-auth

# Check Drizzle ORM version
npm list drizzle-orm
```

**Install any missing dependencies**:
```bash
pnpm install
```

### 3. Test Current State

**Run existing tests**:
```bash
pnpm test
```

**Expected Result**: All tests should pass before starting migration.

**Manual smoke test**:
- [ ] Visit `/` → Chat interface loads
- [ ] Login works
- [ ] Register works
- [ ] Chat creation works
- [ ] Guest creation works (`/api/auth/guest`)

---

## Migration Strategy

### Option A: Direct Cutover (Recommended for Development)

**Scenario**: You're in development/staging and can afford brief downtime.

**Steps**:
1. Implement all changes in feature branch
2. Test thoroughly in development
3. Merge to staging
4. Test in staging
5. Merge to production with brief maintenance window

**Timeline**: 2-3 days

**Risk**: Low (all changes tested before production)

---

### Option B: Phased Rollout (Recommended for Production)

**Scenario**: You're in production with active users and need zero-downtime migration.

**Phases**:

1. **Phase 1**: Deploy new routes without removing old ones (1 day)
   - Add `(public)` and `(dashboard)` route groups
   - Keep `(chat)` routes functional
   - Update middleware to support both old and new routes

2. **Phase 2**: Soft deprecation of old routes (3-7 days)
   - Show banner on old routes: "This page has moved to /dashboard/chat"
   - Monitor traffic to old routes
   - Collect analytics on migration adoption

3. **Phase 3**: Redirect old routes to new routes (1 day)
   - Convert old routes to redirect pages
   - Monitor for broken links or issues

4. **Phase 4**: Complete cutover (1 day)
   - Remove old route code
   - Clean up deprecated functions
   - Celebrate successful migration

**Timeline**: 6-10 days

**Risk**: Very Low (gradual transition with rollback options at each phase)

---

## Detailed Migration Steps

### Step 1: Create Feature Branch

```bash
git checkout dev
git checkout -b feature/dashboard-restructure
```

### Step 2: Implement New Structure (Follow Implementation Plan)

**Reference**: See `dashboard-restructure-implementation.md` for detailed steps.

**Key Files to Create**:
- `app/(public)/layout.tsx`
- `app/(public)/page.tsx`
- `app/(public)/_components/hero-section.tsx`
- `app/(public)/_components/features-grid.tsx`
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/dashboard/chat/page.tsx`
- `app/(dashboard)/dashboard/chat/[id]/page.tsx`
- `app/(dashboard)/dashboard/documents/page.tsx`
- `app/(dashboard)/dashboard/stats/page.tsx`
- `app/(dashboard)/dashboard/settings/page.tsx`
- `app/(dashboard)/actions.ts`

**Key Files to Modify**:
- `middleware.ts` (major changes)
- `app/(auth)/auth.ts` (remove guest provider)
- `components/app-sidebar.tsx` (update navigation)
- `components/sidebar-user-nav.tsx` (remove guest UI)

**Key Files to Delete**:
- `app/(auth)/api/auth/guest/route.ts`

### Step 3: Database Preparation

**No schema changes required**. However, add new query functions:

**File**: `lib/db/queries.ts`

**Add**:
```typescript
export async function getDocumentsByUserId({ userId }: { userId: string }) {
  try {
    return await db
      .select()
      .from(document)
      .where(eq(document.userId, userId))
      .orderBy(desc(document.createdAt));
  } catch (error) {
    console.error("Failed to get documents by user ID", error);
    return [];
  }
}

export async function getMessageCountByUserId({ userId }: { userId: string }) {
  try {
    const chats = await db
      .select({ id: chat.id })
      .from(chat)
      .where(eq(chat.userId, userId));

    if (chats.length === 0) return 0;

    const chatIds = chats.map((c) => c.id);
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(message)
      .where(inArray(message.chatId, chatIds));

    return Number(result[0]?.count ?? 0);
  } catch (error) {
    console.error("Failed to get message count by user ID", error);
    return 0;
  }
}
```

**Add imports**:
```typescript
import { sql, inArray } from "drizzle-orm";
```

### Step 4: Middleware Migration Strategy

#### 4.1 Backward-Compatible Middleware (Transition Phase)

**File**: `middleware.ts` (Transition Version)

This version supports BOTH old and new routes during transition:

```typescript
import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isDevelopmentEnvironment } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Health check
  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  // Allow auth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  // PUBLIC ROUTES: Home and auth pages
  const publicRoutes = ["/"];
  const authRoutes = ["/login", "/register"];

  if (publicRoutes.includes(pathname) || authRoutes.includes(pathname)) {
    if (token && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // DASHBOARD ROUTES: New location (require registered user)
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isGuest = guestRegex.test(token?.email ?? "");
    if (isGuest) {
      const registerUrl = new URL("/register", request.url);
      registerUrl.searchParams.set(
        "message",
        "Please register to access the dashboard"
      );
      return NextResponse.redirect(registerUrl);
    }

    return NextResponse.next();
  }

  // LEGACY CHAT ROUTES: Redirect to new location
  if (pathname.startsWith("/chat/")) {
    const chatId = pathname.replace("/chat/", "");
    return NextResponse.redirect(
      new URL(`/dashboard/chat/${chatId}`, request.url)
    );
  }

  // OLD ROOT CHAT ROUTE: Handle based on auth status
  // This section is temporary during transition
  if (pathname === "/" && token) {
    // If someone tries to access old chat at root, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard/chat", request.url));
  }

  // API ROUTES
  if (pathname.startsWith("/api/")) {
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/chat/:path*",
    "/api/:path*",
    "/login",
    "/register",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

#### 4.2 Final Middleware (Post-Migration)

Once all users have migrated and old routes are removed, simplify to:

**File**: `middleware.ts` (Final Version)

```typescript
import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isDevelopmentEnvironment } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  // Public routes
  const publicRoutes = ["/"];
  const authRoutes = ["/login", "/register"];

  if (publicRoutes.includes(pathname) || authRoutes.includes(pathname)) {
    if (token && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Dashboard routes (protected)
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isGuest = guestRegex.test(token?.email ?? "");
    if (isGuest) {
      return NextResponse.redirect(new URL("/register", request.url));
    }

    return NextResponse.next();
  }

  // Legacy redirects (permanent)
  if (pathname.startsWith("/chat/")) {
    const chatId = pathname.replace("/chat/", "");
    return NextResponse.redirect(
      new URL(`/dashboard/chat/${chatId}`, request.url),
      { status: 301 } // Permanent redirect
    );
  }

  // API routes
  if (pathname.startsWith("/api/")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/chat/:path*",
    "/api/:path*",
    "/login",
    "/register",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

### Step 5: Handle Existing Guest Users

#### Scenario 1: Guest Users with Active Sessions

**Current State**: User has active guest session (cookie with `guest-XXXX` email)

**Migration Handling**:

1. **First visit after migration**:
   - Middleware detects guest session
   - If accessing `/dashboard/*` → Redirect to `/register`
   - Show message: "You're using a guest account. Register to save your data."

2. **Registration flow**:
   - User registers with new email
   - New user account created
   - Old guest session invalidated
   - New registered session created

3. **Data migration** (optional future enhancement):
   - Implement session-to-account migration
   - Transfer guest chats to registered account if same device/browser

**Implementation** (optional):

**File**: `lib/db/migrations/migrate-guest-to-user.ts`

```typescript
import { db } from "../db";
import { chat, document, user } from "../schema";
import { eq } from "drizzle-orm";

/**
 * Migrate guest user data to registered user account.
 * Call this after user registers with same device.
 */
export async function migrateGuestDataToUser({
  guestUserId,
  registeredUserId,
}: {
  guestUserId: string;
  registeredUserId: string;
}) {
  try {
    // Transfer chats
    await db
      .update(chat)
      .set({ userId: registeredUserId })
      .where(eq(chat.userId, guestUserId));

    // Transfer documents
    await db
      .update(document)
      .set({ userId: registeredUserId })
      .where(eq(document.userId, guestUserId));

    // Optionally delete guest user
    // await db.delete(user).where(eq(user.id, guestUserId));

    return { success: true };
  } catch (error) {
    console.error("Failed to migrate guest data", error);
    return { success: false, error };
  }
}
```

#### Scenario 2: Guest Users in Database (No Active Session)

**Current State**: Guest user records exist in database but no active sessions

**Migration Handling**:

**Option A**: Keep data (Recommended)
- Leave guest users in database
- They cannot login (no password set)
- Data preserved for potential future migration

**Option B**: Archive data
```sql
-- Create archive table
CREATE TABLE archived_guest_users AS
SELECT * FROM users WHERE email LIKE 'guest-%';

-- Delete from main table
DELETE FROM users WHERE email LIKE 'guest-%';
```

**Option C**: Purge data (Only if confirmed unnecessary)
```sql
-- DANGER: Irreversible. Only run if guest data has no value
DELETE FROM users WHERE email LIKE 'guest-%';
```

**Recommendation**: Use Option A. Storage is cheap, data loss is expensive.

### Step 6: Update Existing User Sessions

**No action required**. Existing registered users will:
1. Continue to work seamlessly
2. Be redirected from `/` to `/dashboard/chat` automatically
3. Have access to all new features immediately

**Session Migration**:
- JWT tokens remain valid
- No re-login required
- Cookies unchanged

### Step 7: Testing in Staging

**Deploy to staging**:
```bash
git push origin feature/dashboard-restructure

# Deploy to staging (method depends on hosting platform)
# Example for Vercel:
vercel --staging
```

**Test Scenarios**:

1. **New User Registration**:
   - [ ] Visit staging URL
   - [ ] Click "Get Started"
   - [ ] Complete registration
   - [ ] Verify redirect to `/dashboard`
   - [ ] Verify sidebar navigation works

2. **Existing User Login**:
   - [ ] Use existing test account
   - [ ] Login via `/login`
   - [ ] Verify redirect to `/dashboard`
   - [ ] Verify chat history loads
   - [ ] Verify all features work

3. **Legacy URL Handling**:
   - [ ] Visit `/chat/[existing-id]`
   - [ ] Verify redirect to `/dashboard/chat/[existing-id]`
   - [ ] Verify chat loads correctly

4. **Unauthenticated Access**:
   - [ ] Clear cookies
   - [ ] Visit staging URL
   - [ ] Verify homepage displays
   - [ ] Try to access `/dashboard` → Redirect to `/login`
   - [ ] Try to access `/dashboard/chat` → Redirect to `/login`

5. **API Protection**:
   - [ ] Clear cookies
   - [ ] Try to call `/api/chat` → 401 error
   - [ ] Login
   - [ ] Try to call `/api/chat` → Success

### Step 8: Production Deployment

#### Pre-Deployment

**Final checks**:
- [ ] All staging tests pass
- [ ] No console errors in staging
- [ ] Performance benchmarks met (Lighthouse score > 90)
- [ ] Database backup created
- [ ] Rollback plan documented
- [ ] Team notified of deployment

**Backup database**:
```bash
# Create production backup
pg_dump -U postgres -d chatbot_prod > backup_prod_pre_migration.sql

# Store in secure location
# Upload to S3 / Google Cloud Storage / etc.
```

#### Deployment Steps

**Option 1: Direct Deployment (Small Apps)**

```bash
# Merge feature branch
git checkout main
git merge feature/dashboard-restructure

# Deploy
git push origin main

# If using Vercel/Netlify, deployment is automatic
# If using custom hosting:
pnpm build
pm2 restart chatbot  # or equivalent
```

**Option 2: Blue-Green Deployment (Large Apps)**

```bash
# Deploy new version to separate environment
# Test in production-like environment
# Switch traffic to new environment
# Keep old environment running for quick rollback
```

#### Post-Deployment Monitoring

**Monitor for 24 hours**:

```bash
# Watch error logs
tail -f /var/log/chatbot/error.log

# Monitor HTTP status codes
# 200: OK
# 301: Redirect (expected for legacy URLs)
# 401: Unauthorized (expected for unauthenticated API calls)
# 404: Not Found (should be minimal)
# 500: Server Error (should be ZERO)
```

**Metrics to track**:
- [ ] Error rate (should be < 0.5%)
- [ ] Login success rate (should be > 95%)
- [ ] Registration conversion (monitor for drop-off)
- [ ] Page load times (should be < 2s)
- [ ] User complaints/feedback

**Analytics queries** (if using analytics platform):
```sql
-- Check 404 errors (should not spike)
SELECT path, COUNT(*) as count
FROM page_views
WHERE status = 404
  AND timestamp > NOW() - INTERVAL '1 day'
GROUP BY path
ORDER BY count DESC;

-- Check redirects (expected for legacy URLs)
SELECT from_path, to_path, COUNT(*) as count
FROM redirects
WHERE timestamp > NOW() - INTERVAL '1 day'
GROUP BY from_path, to_path
ORDER BY count DESC;

-- Check login success rate
SELECT
  COUNT(*) FILTER (WHERE status = 'success') as successful_logins,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_logins,
  ROUND(COUNT(*) FILTER (WHERE status = 'success') * 100.0 / COUNT(*), 2) as success_rate
FROM login_attempts
WHERE timestamp > NOW() - INTERVAL '1 day';
```

### Step 9: Communicate Changes to Users

#### Email Template (Optional)

**Subject**: New Features Available - Updated Dashboard Experience

**Body**:
```
Hi [User Name],

We've upgraded our AI Chatbot with exciting new features!

What's New:
- Brand new dashboard with improved navigation
- Document management center
- Usage statistics and analytics
- Enhanced settings page

Your existing chats and data are completely safe and unchanged.

Getting Started:
Visit [your-app-url.com] and log in to explore the new dashboard.

Need Help?
If you experience any issues, please contact support@example.com

Thanks for using [App Name]!
```

#### In-App Notification (Optional)

**Show banner on first login after migration**:

```typescript
// components/migration-banner.tsx
export function MigrationBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-blue-800">
          Welcome to the new dashboard! We've reorganized the app to make it easier to navigate.
          Your chats and data are exactly where you left them.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-blue-800 hover:text-blue-900"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
```

### Step 10: Post-Migration Cleanup

**Wait 7-14 days** after production deployment to ensure stability.

**Then**:

1. **Remove old route code**:
```bash
# Delete legacy chat routes
rm -rf "C:\PROYECTOS\APPS\cjhirashi-ai\app\(chat)"

# Commit
git add .
git commit -m "chore: Remove legacy (chat) route group"
git push origin main
```

2. **Remove deprecated functions**:

**File**: `lib/db/queries.ts`

```typescript
// DELETE (or keep if needed for data migration):
export async function createGuestUser() {
  // ...
}
```

3. **Clean up middleware**:

Remove transition code and legacy route handling if no longer needed.

4. **Update tests**:

Remove tests for legacy routes:

```bash
# Update test files to reflect new routes
# app/(chat)/* → app/(dashboard)/dashboard/chat/*
```

---

## Rollback Procedures

### Immediate Rollback (Within 1 hour of deployment)

**If critical issues occur**:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or force push previous version (DANGER: only if needed)
git reset --hard HEAD~1
git push origin main --force

# Restart application
pm2 restart chatbot  # or equivalent
```

**Verify rollback**:
- [ ] Homepage loads (old version)
- [ ] Chat works at `/`
- [ ] Login/Register work
- [ ] No errors in console

### Partial Rollback (Specific Features)

**If only one feature is broken** (e.g., stats page):

```bash
# Create hotfix branch
git checkout -b hotfix/disable-stats-page

# Disable broken feature
# e.g., hide navigation link, add "Coming Soon" page

# Deploy hotfix
git push origin hotfix/disable-stats-page
# Merge to main
```

### Database Rollback

**If database issues occur** (unlikely, as schema unchanged):

```bash
# Restore from backup
psql -U postgres -d chatbot_prod < backup_prod_pre_migration.sql

# Verify data integrity
psql -U postgres -d chatbot_prod -c "SELECT COUNT(*) FROM users;"
```

---

## Validation and Testing

### Pre-Migration Test Suite

**Create**: `tests/migration/pre-migration.test.ts`

```typescript
describe("Pre-Migration State", () => {
  test("Homepage shows chat interface", async () => {
    const response = await fetch("http://localhost:3000/");
    expect(response.status).toBe(200);
    // Add assertions for chat interface presence
  });

  test("Guest creation works", async () => {
    const response = await fetch("http://localhost:3000/api/auth/guest");
    expect(response.status).toBe(302); // Redirect
  });

  test("Chat at /chat/[id] loads", async () => {
    // Test existing chat URL
  });
});
```

**Run before migration**:
```bash
pnpm test tests/migration/pre-migration.test.ts
```

### Post-Migration Test Suite

**Create**: `tests/migration/post-migration.test.ts`

```typescript
describe("Post-Migration State", () => {
  test("Homepage shows marketing content", async () => {
    const response = await fetch("http://localhost:3000/");
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("Your AI Assistant");
  });

  test("Dashboard requires authentication", async () => {
    const response = await fetch("http://localhost:3000/dashboard", {
      redirect: "manual",
    });
    expect(response.status).toBe(307); // Redirect
    expect(response.headers.get("location")).toContain("/login");
  });

  test("Legacy chat URLs redirect", async () => {
    const response = await fetch("http://localhost:3000/chat/test-id", {
      redirect: "manual",
    });
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/dashboard/chat/test-id");
  });

  test("Guest API endpoint removed", async () => {
    const response = await fetch("http://localhost:3000/api/auth/guest");
    expect(response.status).toBe(404);
  });
});
```

**Run after migration**:
```bash
pnpm test tests/migration/post-migration.test.ts
```

### Manual QA Checklist

**Print and check off during QA**:

#### Homepage
- [ ] Visit `/` - Shows marketing homepage
- [ ] Hero section displays
- [ ] Features grid displays
- [ ] "Get Started" button → `/register`
- [ ] "Sign In" button → `/login`
- [ ] Header navigation works
- [ ] Footer displays

#### Authentication
- [ ] Registration form works
- [ ] Login form works
- [ ] Invalid credentials show error
- [ ] Successful login → `/dashboard`
- [ ] Logout works
- [ ] Return URL preserved during login

#### Dashboard
- [ ] Dashboard layout renders
- [ ] Sidebar navigation displays
- [ ] User menu shows correct email
- [ ] Chat link works
- [ ] Documents link works
- [ ] Stats link works
- [ ] Settings link works

#### Chat Functionality
- [ ] New chat creates UUID
- [ ] Message send works
- [ ] AI response streams correctly
- [ ] Chat history displays
- [ ] Existing chat loads by ID
- [ ] Chat switching works
- [ ] Model selector works

#### New Features
- [ ] Documents page loads
- [ ] Stats page displays correct data
- [ ] Settings page loads
- [ ] All pages require authentication

#### Legacy URLs
- [ ] `/chat/[id]` → Redirects to `/dashboard/chat/[id]`
- [ ] Redirect preserves chat ID
- [ ] Chat data loads after redirect

#### API Routes
- [ ] Unauthenticated API calls → 401
- [ ] Authenticated API calls work
- [ ] Guest API calls to protected endpoints → 403

#### Edge Cases
- [ ] Direct navigation to `/dashboard` when logged out
- [ ] Direct navigation to `/login` when logged in
- [ ] Browser back button works correctly
- [ ] Refresh page maintains state
- [ ] Multiple tabs stay in sync

---

## Common Issues and Solutions

### Issue 1: Middleware Redirect Loop

**Symptom**: Browser shows "Too many redirects" error

**Cause**: Middleware redirects to a route that triggers another redirect

**Solution**:
```typescript
// Ensure publicRoutes are excluded from authentication check
const publicRoutes = ["/", "/login", "/register"];
if (publicRoutes.includes(pathname)) {
  return NextResponse.next(); // Don't check auth for public routes
}
```

### Issue 2: Session Not Persisting

**Symptom**: User logs in but immediately redirected to login again

**Cause**: Cookie configuration issue

**Solution**:
```typescript
// In auth.ts, verify cookie settings
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: !isDevelopmentEnvironment,
      },
    },
  },
});
```

### Issue 3: 404 on New Routes

**Symptom**: Navigating to `/dashboard/chat` shows 404

**Cause**: Page file not created or build cache issue

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next
pnpm dev
```

### Issue 4: API Routes Returning 401

**Symptom**: All API calls fail with 401 even when logged in

**Cause**: Token not being sent or middleware not receiving token

**Solution**:
```typescript
// Check middleware token retrieval
const token = await getToken({
  req: request,
  secret: process.env.AUTH_SECRET,
  secureCookie: !isDevelopmentEnvironment,
});

// Debug log (remove in production)
console.log("Token:", token);
```

### Issue 5: Guest Users Can't Access Dashboard

**Symptom**: Guest users redirected to register but want to continue as guest

**Solution**: This is **expected behavior** in new architecture. Guest users must register. If business requirements change:

1. Update middleware to allow guests:
```typescript
// Remove guest check
if (pathname.startsWith("/dashboard")) {
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // REMOVED: Guest check
  return NextResponse.next();
}
```

2. Update UI to show guest-specific limitations:
```typescript
// In dashboard pages
if (session.user.type === "guest") {
  return <GuestLimitedView />;
}
```

---

## Performance Considerations

### Before Migration
- Measure baseline performance
- Homepage (chat) load time: ~1.5s
- Time to first byte (TTFB): ~200ms

### After Migration
- Expected performance:
  - Public homepage: < 1s (static content)
  - Dashboard load: ~1.5-2s (auth check + data fetch)
  - Chat message: < 500ms (excluding AI response)

### Optimization Tips

1. **Use React Suspense** for loading states:
```typescript
export default function DocumentsPage() {
  return (
    <Suspense fallback={<DocumentsSkeleton />}>
      <DocumentsList />
    </Suspense>
  );
}
```

2. **Implement caching** for stats queries:
```typescript
import { unstable_cache } from "next/cache";

const getCachedStats = unstable_cache(
  async (userId) => getUserStats(userId),
  ["user-stats"],
  { revalidate: 300 } // Cache for 5 minutes
);
```

3. **Optimize middleware**:
```typescript
// Cache public routes check
const PUBLIC_ROUTES = new Set(["/", "/login", "/register"]);

if (PUBLIC_ROUTES.has(pathname)) {
  // Fast path for public routes
  return NextResponse.next();
}
```

---

## Documentation Updates

### Update User Documentation

**File**: `docs/user-guide.md` (if exists)

Update:
- Screenshots showing new dashboard
- Navigation instructions
- New features (documents, stats, settings)
- Updated URLs

### Update Developer Documentation

**File**: `docs/developer-guide.md` (if exists)

Update:
- New route structure
- Middleware logic
- Authentication flow
- API route protection

### Update README

**File**: `README.md`

Add:
```markdown
## Recent Changes (v3.0)

We've restructured the application architecture:

- **Public Homepage**: Marketing content at `/`
- **Dashboard**: All features now at `/dashboard/*`
- **Authentication**: Registration required for dashboard access
- **Legacy URLs**: Old `/chat/*` URLs redirect automatically

See `docs/architecture/dashboard-restructure-architecture.md` for details.
```

---

## Success Criteria

The migration is considered successful when:

### Functional Criteria
- [ ] All new routes load without errors
- [ ] All existing features work in new locations
- [ ] Authentication flow functions correctly
- [ ] Legacy URLs redirect properly
- [ ] No data loss

### Performance Criteria
- [ ] Homepage loads in < 1s
- [ ] Dashboard loads in < 2s
- [ ] No increase in error rate
- [ ] No increase in API response times

### User Experience Criteria
- [ ] Users can find their chats
- [ ] No broken links
- [ ] Clear navigation
- [ ] Minimal confusion

### Technical Criteria
- [ ] All tests pass
- [ ] No console errors
- [ ] No security regressions
- [ ] Code follows project conventions
- [ ] Documentation updated

---

## Timeline Summary

### Development Phase
- Day 1: Implement structure and public pages (Phases 1-4)
- Day 2: Migrate chat and update middleware (Phases 5-7)
- Day 3: Create new dashboard pages and test (Phases 8-12)

### Staging Phase
- Day 4: Deploy to staging and comprehensive testing
- Day 5: Fix any issues found in staging
- Day 6: Final QA and stakeholder approval

### Production Phase
- Day 7: Deploy to production
- Day 8-14: Monitor and address any issues
- Day 15+: Post-migration cleanup

**Total**: 2-3 weeks from start to complete cleanup

---

## Support and Communication

### Team Communication

**Daily Standup Topics**:
- Migration progress update
- Blockers or issues
- Test results
- Timeline adjustments

**Stakeholder Updates**:
- Weekly email with progress summary
- Screenshots of new features
- Timeline confirmation

### User Support

**Prepare support team with**:
- FAQ document
- Common issues and solutions
- Escalation path for critical issues

**FAQ Draft**:

Q: Where did my chats go?
A: All your chats are safe! They're now in the Dashboard under the Chat section.

Q: Why do I need to register now?
A: We've improved security and added new features that require an account. Registration is quick and free.

Q: Can I still use the old URL?
A: Old URLs will automatically redirect to the new locations. We recommend updating any bookmarks.

Q: What happened to guest accounts?
A: Guest accounts are no longer available. Please register to access all features.

---

## Conclusion

This migration strategy prioritizes:
1. **Zero data loss**
2. **Minimal user disruption**
3. **Backward compatibility**
4. **Gradual rollout**
5. **Easy rollback**

By following this guide, the migration can be completed with high confidence and low risk.

---

## Document Metadata

- **Author**: Architecture Designer Agent
- **Created**: 2025-11-07
- **Version**: 1.0
- **Status**: Ready for Use
- **Related Documents**:
  - `dashboard-restructure-architecture.md` (architecture design)
  - `dashboard-restructure-implementation.md` (implementation steps)

# Fix: Infinite Session Refresh Loop in Login Page

**Date:** 2025-11-08
**Status:** Resolved
**Branch:** feature/dashboard-restructure
**Commit:** 64e02a6

## Problem Description

After successful login, users experienced an infinite loop of HTTP requests preventing navigation to the dashboard. The browser would remain on the login page with continuous network activity.

### Root Cause

The login page was incorrectly calling `updateSession()` immediately after a successful login attempt:

```typescript
// BEFORE (Problematic)
} else if (state.status === "success") {
  setIsSuccessful(true);
  updateSession();  // ← Causes infinite loop

  const searchParams = new URLSearchParams(window.location.search);
  const returnUrl = searchParams.get("returnUrl");

  if (returnUrl) {
    router.push(returnUrl);
  } else {
    router.push("/dashboard");
  }
}
```

### Why This Caused a Loop

1. User submits login credentials
2. `login()` server action calls `signIn("credentials", { redirect: false })`
3. Auth.js creates JWT session token and sets secure HTTP-only cookie
4. Action returns `{ status: "success" }` to client
5. `useEffect` hook triggers with `state.status === "success"`
6. `updateSession()` is called to refresh the session
7. `updateSession()` dispatches revalidation requests internally
8. Meanwhile, `router.push()` tries to navigate to `/dashboard`
9. Both operations trigger multiple fetch requests simultaneously
10. Middleware validates session on each request
11. Race condition between session refresh and navigation causes continuous requests

## Solution Implemented

### What Changed

**File:** `app/(auth)/login/page.tsx`

1. **Removed `useSession()` import** - No longer needed
2. **Removed `updateSession()` call** - Unnecessary after server-side session creation
3. **Simplified `useEffect` dependencies** - Changed from `[state.status, router, updateSession]` to `[state.status, router]`

```typescript
// AFTER (Fixed)
} else if (state.status === "success") {
  setIsSuccessful(true);
  // Session already created by server action - no need to refresh

  const searchParams = new URLSearchParams(window.location.search);
  const returnUrl = searchParams.get("returnUrl");

  if (returnUrl) {
    router.push(returnUrl);
  } else {
    router.push("/dashboard");
  }
}
```

### Why This Works

1. When `login()` server action calls `signIn("credentials", ...)`, Auth.js:
   - Validates credentials against the database
   - Creates a new JWT token
   - Sets the token in an HTTP-only cookie
   - Returns success to the client

2. No `updateSession()` call means:
   - No additional session revalidation requests
   - No race condition with router navigation
   - Clean, single navigation to `/dashboard`

3. Middleware validation happens naturally:
   - When user navigates to `/dashboard`, middleware checks for JWT token
   - Token is valid because it was set by `signIn()` on the server
   - User is authenticated and can access protected routes

## Authentication Flow (Corrected)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User submits email + password on login form               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         v
┌─────────────────────────────────────────────────────────────┐
│ 2. handleSubmit() calls formAction(FormData)                 │
│    (executes login() server action)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         v
┌─────────────────────────────────────────────────────────────┐
│ 3. login() server action validates and calls signIn()        │
│    - Auth.js creates JWT token                              │
│    - Sets HTTP-only cookie with token                       │
│    - Returns { status: "success" }                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         v
┌─────────────────────────────────────────────────────────────┐
│ 4. useEffect hook detects state.status === "success"        │
│    - Sets isSuccessful = true                               │
│    - Calls router.push("/dashboard") ONLY                   │
│    - NO updateSession() call!                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         v
┌─────────────────────────────────────────────────────────────┐
│ 5. Router navigates to /dashboard                           │
│    - Middleware validates JWT token in cookie               │
│    - Token is valid (created by signIn)                     │
│    - User sees dashboard                                    │
└─────────────────────────────────────────────────────────────┘
```

## Testing the Fix

### Manual Testing Steps

1. Start dev server: `pnpm dev`
2. Navigate to `http://localhost:3000/login`
3. Enter valid credentials
4. Submit the form
5. **Expected behavior:**
   - Button shows success state briefly
   - Navigation completes without delays
   - Browser navigates to `/dashboard` smoothly
   - No infinite request loops in Network tab

### Verification Checklist

- [x] Login page loads without errors
- [x] Successful login redirects to dashboard immediately
- [x] No infinite request loops in Network tab
- [x] Session is properly authenticated
- [x] Dashboard loads and displays user data
- [x] No console errors related to session management
- [x] Logout functionality still works correctly

## Why `updateSession()` Was Incorrect

The `updateSession()` function from `next-auth/react` is designed to:
- Refresh the session state on the client
- Revalidate the session if it has expired
- Fetch updated user information

However, in this context it's unnecessary because:
1. The session was JUST created by `signIn()` on the server
2. It's guaranteed to be fresh and valid
3. Calling it immediately after `signIn()` creates a race condition
4. The middleware will validate the token on the next request anyway

## Impact Assessment

### No Breaking Changes

This fix is a pure improvement with no breaking changes:
- No API changes
- No database schema changes
- No authentication logic changes
- Only removes unnecessary client-side session refresh logic

### Related Components

Verified no other files use `updateSession()`:
- `app/(auth)/login/page.tsx` ✓ Fixed
- Other auth files checked - no issues found

## Prevention

To prevent similar issues in the future:

1. **Understand Auth.js Flow:**
   - `signIn()` completes authentication server-side
   - Session is set before returning to client
   - No client-side refresh needed immediately after

2. **Avoid Race Conditions:**
   - Don't call `updateSession()` immediately after `signIn()`
   - Don't mix multiple async operations without coordination
   - Ensure dependency arrays in `useEffect` are minimal and necessary

3. **Use Server Actions:**
   - Prefer server-side `signIn()` over client-side updates
   - Trust server-side session creation
   - Only refresh sessions when necessary (token expiry, data stale)

## Files Modified

- `app/(auth)/login/page.tsx` - Removed `updateSession()` call and import

## Git Information

```bash
commit 64e02a6
Author: Claude <noreply@anthropic.com>
Date:   2025-11-08

    fix: Resolve infinite session refresh loop in login page

    The login page was calling updateSession() after successful authentication,
    which caused a race condition with router.push(). This triggered continuous
    session refresh requests in an infinite loop.

    Removed the unnecessary updateSession() call since:
    1. The server has already created and set the JWT session cookie
    2. The middleware will validate the session on the next request
    3. router.push() is sufficient to redirect to the dashboard
```

## References

- **Next-Auth Documentation:** https://authjs.dev/getting-started/session-management
- **Next.js Router:** https://nextjs.org/docs/app/api-reference/functions/use-router
- **Race Conditions in React:** https://react.dev/reference/react/useEffect#choosing-good-keys

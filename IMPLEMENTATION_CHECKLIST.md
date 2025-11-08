# Chat Migration - Implementation Checklist

**Date Started:** ________________
**Developer:** ________________
**Estimated Completion:** 1.5 hours

---

## PRE-IMPLEMENTATION

- [ ] Read `MIGRATION_EXECUTIVE_SUMMARY.md`
- [ ] Read `EXACT_CHANGES_REQUIRED.md`
- [ ] Understand the 3 code changes required
- [ ] Create feature branch: `git checkout -b feature/chat-restructure`
- [ ] Verify current state:
  - [ ] `git status` shows clean working directory
  - [ ] `pnpm test` passes
  - [ ] `pnpm build` succeeds
  - [ ] `pnpm type-check` passes
  - [ ] `pnpm lint` passes

---

## PHASE 1: CREATE DIRECTORY STRUCTURE

**Time Estimate:** 5 minutes

- [ ] Create: `app/(dashboard)/agents/chat-general/`
- [ ] Create: `app/(dashboard)/agents/chat-general/[id]/`
- [ ] Create: `app/api/agents/`
- [ ] Create: `app/api/agents/chat-general/`
- [ ] Create: `app/api/agents/chat-general/chat/`
- [ ] Create: `app/api/agents/chat-general/chat/[id]/`
- [ ] Create: `app/api/agents/chat-general/chat/[id]/stream/`
- [ ] Create: `app/api/agents/chat-general/document/`
- [ ] Create: `app/api/agents/chat-general/files/`
- [ ] Create: `app/api/agents/chat-general/files/upload/`
- [ ] Create: `app/api/agents/chat-general/history/`
- [ ] Create: `app/api/agents/chat-general/vote/`
- [ ] Create: `app/api/agents/chat-general/suggestions/`

**Verification:**
```bash
ls -la app/(dashboard)/agents/chat-general/
ls -la app/api/agents/chat-general/
# Should see all subdirectories created
```

---

## PHASE 2: FIX IMPORT & COPY FILES

**Time Estimate:** 10 minutes

### Step 1: Fix the Import
- [ ] Open `app/api/chat/route.ts`
- [ ] Find line 44: `import { generateTitleFromUserMessage } from "../../actions";`
- [ ] Change to: `import { generateTitleFromUserMessage } from "@/app/(dashboard)/actions";`
- [ ] Save file

### Step 2: Copy Page Files
- [ ] Copy: `app/(dashboard)/dashboard/chat/page.tsx`
  → `app/(dashboard)/agents/chat-general/page.tsx`
- [ ] Copy: `app/(dashboard)/dashboard/chat/[id]/page.tsx`
  → `app/(dashboard)/agents/chat-general/[id]/page.tsx`

### Step 3: Copy API Route Files
- [ ] Copy: `app/api/chat/route.ts`
  → `app/api/agents/chat-general/chat/route.ts`
  (Should now have the fixed import)
- [ ] Copy: `app/api/chat/schema.ts`
  → `app/api/agents/chat-general/chat/schema.ts`
- [ ] Copy: `app/api/chat/[id]/stream/route.ts`
  → `app/api/agents/chat-general/chat/[id]/stream/route.ts`
- [ ] Copy: `app/api/document/route.ts`
  → `app/api/agents/chat-general/document/route.ts`
- [ ] Copy: `app/api/files/upload/route.ts`
  → `app/api/agents/chat-general/files/upload/route.ts`
- [ ] Copy: `app/api/history/route.ts`
  → `app/api/agents/chat-general/history/route.ts`
- [ ] Copy: `app/api/vote/route.ts`
  → `app/api/agents/chat-general/vote/route.ts`
- [ ] Copy: `app/api/suggestions/route.ts`
  → `app/api/agents/chat-general/suggestions/route.ts`

**Verification:**
```bash
find app/(dashboard)/agents/chat-general/ -type f | wc -l
# Should show 2 (page.tsx and [id]/page.tsx)

find app/api/agents/chat-general/ -type f | wc -l
# Should show 8 files total
```

---

## PHASE 3: UPDATE COMPONENT ENDPOINT

**Time Estimate:** 5 minutes

- [ ] Open `components/chat.tsx`
- [ ] Find line 85 (in useChat section):
  ```typescript
  transport: new DefaultChatTransport({
    api: "/api/chat",
  ```
- [ ] Change `/api/chat` to `/api/agents/chat-general/chat`
- [ ] Save file

**Verification:**
```bash
grep -n "/api/agents/chat-general/chat" components/chat.tsx
# Should find the line you just changed
```

---

## PHASE 4: UPDATE MIDDLEWARE

**Time Estimate:** 30 minutes

- [ ] Open `middleware.ts`
- [ ] Locate the end of section 5 (API ROUTES: Require authentication)
- [ ] Find the line: `return NextResponse.next();` after that section
- [ ] **BEFORE** that line, insert the redirect block from `EXACT_CHANGES_REQUIRED.md` (section "Change 3")
- [ ] The new section should be labeled "6. LEGACY ROUTE REDIRECTS"
- [ ] Verify the code has been inserted correctly
- [ ] Save file

**Checklist for middleware addition:**
- [ ] Dashboard redirect: `/dashboard/chat` → `/dashboard/agents/chat-general`
- [ ] Dashboard ID redirect: `/dashboard/chat/[id]` → `/dashboard/agents/chat-general/[id]`
- [ ] API chat routes: `/api/chat/*` → `/api/agents/chat-general/chat/*`
- [ ] API document routes: `/api/document` → `/api/agents/chat-general/document`
- [ ] API files routes: `/api/files/upload` → `/api/agents/chat-general/files/upload`
- [ ] API history routes: `/api/history` → `/api/agents/chat-general/history`
- [ ] API vote routes: `/api/vote` → `/api/agents/chat-general/vote`
- [ ] API suggestions routes: `/api/suggestions` → `/api/agents/chat-general/suggestions`

**Verification:**
```bash
grep -n "LEGACY ROUTE REDIRECTS" middleware.ts
# Should find the section you added

grep -n "308" middleware.ts
# Should find multiple 308 status codes
```

---

## PHASE 5: VERIFICATION

**Time Estimate:** 20 minutes

### 5.1: Type Checking
- [ ] Run: `pnpm type-check`
- [ ] Result: ✓ PASS or ❌ FIX ERRORS
- [ ] If errors, check:
  - [ ] Import in `app/api/agents/chat-general/chat/route.ts`
  - [ ] API endpoint in `components/chat.tsx`

### 5.2: Linting
- [ ] Run: `pnpm lint`
- [ ] Result: ✓ PASS or ❌ FIX ERRORS
- [ ] If errors, fix or format: `pnpm format`

### 5.3: Build
- [ ] Run: `pnpm build`
- [ ] Result: ✓ PASS or ❌ FIX ERRORS
- [ ] If errors, review error messages and fix

### 5.4: Start Dev Server
- [ ] Run: `pnpm dev`
- [ ] Wait for: `ready - started server on 0.0.0.0:3000`
- [ ] Result: ✓ Server started or ❌ Server failed
- [ ] If failed, check console for errors

### 5.5: Test New Route
- [ ] Open browser: `http://localhost:3000/dashboard/agents/chat-general`
- [ ] Expected: Chat page loads
- [ ] Try: Type a message (don't send yet)
- [ ] Result: ✓ Page loaded and interactive

### 5.6: Test Message Sending
- [ ] Send a test message
- [ ] Check Browser DevTools → Network tab
- [ ] Look for: POST request to `/api/agents/chat-general/chat`
- [ ] Expected: Status 200 (success)
- [ ] Result: ✓ Message sent and response received

### 5.7: Test Old Route Redirect
- [ ] Open browser: `http://localhost:3000/dashboard/chat`
- [ ] Expected: Redirects to `/dashboard/agents/chat-general`
- [ ] Check: URL bar shows new URL
- [ ] Result: ✓ Redirect successful

### 5.8: Test Message History
- [ ] After sending a message, reload the page
- [ ] Expected: Message history loads
- [ ] Check Network tab: GET to `/api/agents/chat-general/history` (or redirect from `/api/history`)
- [ ] Result: ✓ History loaded

### 5.9: Test Chat Operations
- [ ] [ ] Create new chat at `/dashboard/agents/chat-general`
- [ ] [ ] Send multiple messages
- [ ] [ ] Verify chat saves to database
- [ ] [ ] Visit existing chat by ID: `/dashboard/agents/chat-general/[id]`
- [ ] [ ] Verify history loads
- [ ] [ ] Test old URL: `/dashboard/chat/[id]` (should redirect)

### 5.10: Run Tests
- [ ] Run: `pnpm test`
- [ ] Result: ✓ PASS or ⚠ WARNINGS/FAILURES
- [ ] If failures:
  - [ ] Check test files for hardcoded routes
  - [ ] Update tests if needed
  - [ ] Rerun: `pnpm test`

### 5.11: Browser Console Check
- [ ] Open DevTools: F12 → Console tab
- [ ] Expected: No errors, no warnings
- [ ] If errors/warnings, investigate and fix

### 5.12: Final Build
- [ ] Run: `pnpm build`
- [ ] Result: ✓ Build successful

---

## PHASE 6: CODE REVIEW (Optional but Recommended)

- [ ] Changes to review:
  - [ ] `components/chat.tsx` (1 line change)
  - [ ] `middleware.ts` (~70 lines added)
  - [ ] `app/api/agents/chat-general/chat/route.ts` (1 line import fix)

- [ ] Have another developer review:
  - [ ] [ ] Confirm API endpoint change is correct
  - [ ] [ ] Confirm middleware redirects are comprehensive
  - [ ] [ ] Confirm import is correct in chat route
  - [ ] [ ] Confirm no other references missed

---

## PHASE 7: COMMIT CHANGES

- [ ] Stage all changes:
  ```bash
  git add -A
  ```

- [ ] Review staged changes:
  ```bash
  git status
  git diff --cached
  ```

- [ ] Commit:
  ```bash
  git commit -m "feat: Restructure chat routes from /dashboard/chat to /dashboard/agents/chat-general

  - Move chat pages to agents/chat-general
  - Move all chat APIs to api/agents/chat-general/
  - Update component endpoint reference
  - Add middleware redirects for backward compatibility (HTTP 308)
  - Maintain zero breaking changes via permanent redirects"
  ```

- [ ] Verify commit:
  ```bash
  git log -1 --name-status
  ```

---

## PHASE 8: CLEANUP (Optional - Can be deferred)

**Note:** Only do this after running the migration in production for 2-4 weeks.

- [ ] Delete old directories (ONLY if you're sure redirects are working):
  - [ ] Delete: `app/(dashboard)/dashboard/chat/`
  - [ ] Delete: `app/api/chat/`
  - [ ] Delete: `app/api/document/`
  - [ ] Delete: `app/api/files/`
  - [ ] Delete: `app/api/history/`
  - [ ] Delete: `app/api/vote/`
  - [ ] Delete: `app/api/suggestions/`

- [ ] Verify still working after cleanup:
  - [ ] `pnpm build` succeeds
  - [ ] `pnpm dev` starts
  - [ ] Routes still work
  - [ ] Old redirects still work

- [ ] If cleanup breaks something:
  - [ ] Restore deleted files from git
  - [ ] Don't delete again until further investigation

---

## POST-IMPLEMENTATION

- [ ] All checklist items completed: ✓
- [ ] No console errors: ✓
- [ ] Type checking passes: ✓
- [ ] Linting passes: ✓
- [ ] Tests pass: ✓
- [ ] Build succeeds: ✓
- [ ] Dev server runs: ✓
- [ ] Chat functionality intact: ✓

---

## ROLLBACK PROCEDURE (If Needed)

If something breaks critically:

1. [ ] Stop the server: `Ctrl+C`
2. [ ] Revert changes:
   ```bash
   git reset --hard HEAD~1
   ```
3. [ ] Delete new directories (if cleanup was done):
   ```bash
   git checkout HEAD -- app/(dashboard)/agents/
   git checkout HEAD -- app/api/agents/
   ```
4. [ ] Restart server: `pnpm dev`
5. [ ] Verify: Old routes work again
6. [ ] Investigate: What went wrong?
7. [ ] Document: The issue and cause
8. [ ] Retry: With fix in place

---

## NOTES & OBSERVATIONS

```
Phase 1 Started: __________ Completed: __________
Phase 2 Started: __________ Completed: __________
Phase 3 Started: __________ Completed: __________
Phase 4 Started: __________ Completed: __________
Phase 5 Started: __________ Completed: __________
Phase 6 Started: __________ Completed: __________
Phase 7 Started: __________ Completed: __________
Phase 8 Started: __________ Completed: __________

Issues Encountered:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

Resolutions:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

Lessons Learned:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

Overall Assessment: [ ] SUCCESS  [ ] WITH ISSUES  [ ] FAILED
```

---

## SIGN-OFF

Developer Name: ________________________  Date: ______________

Reviewer Name: ________________________   Date: ______________

QA/Tester Name: ________________________  Date: ______________

---

## NEXT STEPS

- [ ] Merge feature branch to main: `git checkout main && git merge feature/chat-restructure`
- [ ] Push to remote: `git push origin main`
- [ ] Deploy to staging environment (if applicable)
- [ ] Monitor logs for errors/failed redirects
- [ ] Announce migration to team/users (if applicable)
- [ ] Schedule cleanup (Phase 8) for 2-4 weeks later
- [ ] Archive migration documentation

---

**TOTAL TIME SPENT:** __________ hours

**Date Completed:** __________________

**Status:** ✓ READY FOR PRODUCTION

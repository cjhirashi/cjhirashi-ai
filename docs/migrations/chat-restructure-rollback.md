# Chat Restructure Migration - Rollback Plan

**Date:** 2025-11-07
**Migration:** Chat restructure from `/dashboard/chat` to `/dashboard/agents/chat-general`
**Risk Level:** Low
**Estimated Rollback Time:** < 5 minutes

---

## When to Rollback

Execute this rollback procedure if you encounter:

### Critical Issues (Immediate Rollback)
- Users cannot send messages
- Chat page throws errors and doesn't load
- API endpoints return 500 errors
- Database corruption or data loss
- Authentication breaks
- Complete application failure

### Major Issues (Rollback Recommended)
- Significant performance degradation
- Chat history not loading for multiple users
- Redirects causing infinite loops
- Multiple users reporting broken functionality
- More than 10% error rate in monitoring

### Minor Issues (Consider Rollback)
- Some redirects not working correctly
- Intermittent errors affecting few users
- UI/UX issues with new routes
- Non-critical functionality broken

---

## Pre-Rollback Checklist

Before executing rollback:

1. **Document the Issue**
   - [ ] Take screenshots of errors
   - [ ] Copy error messages from console
   - [ ] Note which URLs are failing
   - [ ] Record what actions trigger the issue
   - [ ] Check server logs for errors

2. **Assess Impact**
   - [ ] How many users affected?
   - [ ] Is it blocking critical functionality?
   - [ ] Can it be fixed without rollback?
   - [ ] Is it a configuration issue?

3. **Communication**
   - [ ] Notify team of rollback decision
   - [ ] Set expectations for downtime (< 5 min)
   - [ ] Prepare status update for users if needed

---

## Rollback Procedure

### Method 1: Git Revert (Recommended)

**Use when:** Changes have been committed but issue discovered quickly

**Steps:**

1. **Stop the server**
   ```bash
   # Press Ctrl+C in the terminal running pnpm dev
   ```

2. **Check current commit**
   ```bash
   cd c:\PROYECTOS\APPS\cjhirashi-ai
   git log -1 --oneline
   # Should show: "feat: Restructure chat routes..."
   ```

3. **Create revert commit** (keeps history)
   ```bash
   git revert HEAD
   # This creates a new commit that undoes the migration
   ```

4. **OR reset to previous commit** (if not pushed)
   ```bash
   git reset --hard HEAD~1
   # CAUTION: This deletes the migration commit
   # Only use if changes NOT pushed to remote
   ```

5. **Verify rollback**
   ```bash
   git log -2 --oneline
   # Should show previous commits

   git status
   # Should show "nothing to commit, working tree clean"
   ```

6. **Restart server**
   ```bash
   pnpm dev
   ```

7. **Test old routes work**
   - Visit: `http://localhost:3000/dashboard/chat`
   - Send a message
   - Verify API at `/api/chat` responds
   - Check no errors in console

**Time:** 2-3 minutes

---

### Method 2: Manual Rollback

**Use when:** Need to rollback specific files without reverting entire commit

**Steps:**

#### Step 1: Restore `components/chat.tsx`

```bash
cd c:\PROYECTOS\APPS\cjhirashi-ai
```

Open `components/chat.tsx` and find line 85:

```typescript
// CURRENT (after migration)
api: "/api/agents/chat-general/chat",

// CHANGE BACK TO
api: "/api/chat",
```

**Verification:**
```bash
grep "/api/chat" components/chat.tsx
# Should find the line (not /api/agents/chat-general/chat)
```

#### Step 2: Restore `app/api/chat/route.ts`

Open `app/api/chat/route.ts` and find line 44:

```typescript
// CURRENT (after migration)
import { generateTitleFromUserMessage } from "@/app/(dashboard)/actions";

// CHANGE BACK TO
import { generateTitleFromUserMessage } from "../../actions";
```

**Verification:**
```bash
grep "../../actions" app/api/chat/route.ts
# Should find the relative import
```

#### Step 3: Remove Middleware Redirects

Open `middleware.ts` and:

1. Find section `// 6. CHAT RESTRUCTURE REDIRECTS` (around line 103)
2. Delete everything from that comment down to `// 7. LEGACY ROUTES` (around line 173)
3. Save the file

The middleware should go directly from:
```typescript
    return NextResponse.next();
  }

  // 6. LEGACY ROUTES: Handle backward compatibility  ← Should be section 6 again
  if (pathname === "/chat") {
```

**Verification:**
```bash
grep "CHAT RESTRUCTURE" middleware.ts
# Should find NOTHING (0 results)

grep -n "LEGACY ROUTES" middleware.ts
# Should show it's now section 6, not 7
```

#### Step 4: Delete New Directories

```bash
# Delete new page structure
rm -rf "app/(dashboard)/agents/chat-general"

# Delete new API structure
rm -rf "app/api/agents/chat-general"
```

**Verification:**
```bash
# These should NOT exist
ls "app/(dashboard)/agents/chat-general" 2>&1
# Should show: No such file or directory

ls "app/api/agents/chat-general" 2>&1
# Should show: No such file or directory

# These SHOULD exist
ls "app/(dashboard)/dashboard/chat"
# Should show: page.tsx  [id]/

ls "app/api/chat"
# Should show: route.ts  schema.ts  [id]/
```

#### Step 5: Restart and Test

```bash
pnpm dev
```

Test in browser:
- Visit: `http://localhost:3000/dashboard/chat`
- Should load WITHOUT redirect
- Send a message
- Check Network tab shows POST to `/api/chat` (NOT redirected)
- Verify no console errors

**Time:** 5-7 minutes

---

### Method 3: File Restore from Git

**Use when:** Want to restore specific files from previous commit

```bash
# Restore specific files to previous commit state
git checkout HEAD~1 -- components/chat.tsx
git checkout HEAD~1 -- middleware.ts
git checkout HEAD~1 -- app/api/chat/route.ts

# Delete new directories
rm -rf "app/(dashboard)/agents/chat-general"
rm -rf "app/api/agents/chat-general"

# Restart
pnpm dev
```

**Time:** 3-4 minutes

---

## Post-Rollback Verification

After rollback is complete, verify:

### 1. Application Functions
- [ ] Dev server starts without errors
- [ ] `/dashboard/chat` loads (no redirect)
- [ ] Can create new chat
- [ ] Can send messages
- [ ] Messages save to database
- [ ] Chat history loads
- [ ] Sidebar links work
- [ ] No console errors

### 2. API Endpoints Respond
```bash
# Test chat endpoint (should be /api/chat again)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"id":"test","message":"Hello"}'
# Should get response (even if auth error, endpoint exists)

# Test history endpoint
curl http://localhost:3000/api/history
# Should respond (not 404)
```

### 3. No Redirects Active
- [ ] `/dashboard/chat` does NOT redirect
- [ ] `/api/chat` does NOT redirect
- [ ] Middleware section 6 is "LEGACY ROUTES" again
- [ ] No "CHAT RESTRUCTURE" in middleware

### 4. File System State
- [ ] `app/(dashboard)/dashboard/chat/` exists
- [ ] `app/api/chat/` exists
- [ ] `app/(dashboard)/agents/chat-general/` does NOT exist
- [ ] `app/api/agents/chat-general/` does NOT exist

---

## Troubleshooting Rollback Issues

### Issue: Server won't start after rollback

**Symptoms:** `pnpm dev` throws errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
pnpm install

# Try again
pnpm dev
```

### Issue: Still seeing redirects after rollback

**Symptoms:** URLs still redirect even after middleware changes

**Solution:**
1. Check middleware.ts was saved correctly
2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Stop and restart dev server
4. Try incognito/private browsing window

### Issue: Import errors after rollback

**Symptoms:** TypeScript errors about missing imports

**Solution:**
```bash
# Verify file contents
cat app/api/chat/route.ts | grep "actions"
# Should show: import { generateTitleFromUserMessage } from "../../actions";

# If wrong, manually fix the import
# Then restart server
```

### Issue: 404 on old routes after rollback

**Symptoms:** `/dashboard/chat` returns 404

**Solution:**
```bash
# Verify old directories exist
ls app/(dashboard)/dashboard/chat/
ls app/api/chat/

# If missing, restore from git
git checkout HEAD~1 -- app/(dashboard)/dashboard/chat/
git checkout HEAD~1 -- app/api/chat/
git checkout HEAD~1 -- app/api/document/
git checkout HEAD~1 -- app/api/files/
git checkout HEAD~1 -- app/api/history/
git checkout HEAD~1 -- app/api/vote/
git checkout HEAD~1 -- app/api/suggestions/
```

---

## After Rollback: Next Steps

### 1. Immediate (< 1 hour)
- [ ] Verify application fully functional
- [ ] Test all major features
- [ ] Monitor error logs
- [ ] Notify team rollback is complete
- [ ] Update status page if applicable

### 2. Investigation (1-2 hours)
- [ ] Document what went wrong
- [ ] Analyze root cause
- [ ] Determine if migration should be retried
- [ ] Identify what needs to be fixed

### 3. Planning (1-2 days)
- [ ] Review migration approach
- [ ] Address issues found
- [ ] Update migration plan
- [ ] Test fixes in development
- [ ] Schedule retry if appropriate

### 4. Communication
- [ ] Document the rollback in project history
- [ ] Update team on lessons learned
- [ ] Include findings in retrospective
- [ ] Update migration documentation

---

## Prevention for Next Time

To avoid needing rollback in future:

1. **Better Testing**
   - Run full test suite before deploying
   - Test in staging environment first
   - Use feature flags for big changes
   - Have rollback plan ready before deployment

2. **Gradual Rollout**
   - Deploy to subset of users first
   - Monitor closely for first 24 hours
   - Have quick rollback prepared
   - Communicate changes clearly

3. **Better Monitoring**
   - Set up error tracking
   - Monitor API success rates
   - Track redirect performance
   - Alert on anomalies

---

## Rollback Decision Tree

```
Issue Detected
    ↓
Is it critical? (blocks core functionality)
    ↓                                    ↓
   YES                                  NO
    ↓                                    ↓
Can you fix in < 10 min?        Can you fix in < 30 min?
    ↓           ↓                       ↓           ↓
   YES         NO                      YES         NO
    ↓           ↓                       ↓           ↓
  Fix it    ROLLBACK              Try to fix    Monitor
                                       ↓
                              Fix doesn't work?
                                       ↓
                                   ROLLBACK
```

---

## Emergency Contacts

If rollback fails or causes additional issues:

1. **Check Documentation:**
   - This rollback plan
   - Original migration docs
   - Git history

2. **Restore Known Good State:**
   ```bash
   # Find last known good commit
   git log --oneline -10

   # Reset to that commit
   git reset --hard [commit-hash]
   ```

3. **Nuclear Option (Last Resort):**
   ```bash
   # Restore entire codebase to previous commit
   git reflog
   # Find the commit before migration started
   git reset --hard HEAD@{n}
   ```

---

## Rollback Checklist Summary

Quick reference for rollback execution:

- [ ] Stop server (Ctrl+C)
- [ ] Choose rollback method (git revert recommended)
- [ ] Execute rollback steps
- [ ] Delete new directories
- [ ] Restart server (pnpm dev)
- [ ] Test old routes work (no redirects)
- [ ] Verify chat functionality
- [ ] Check API endpoints respond
- [ ] Clear browser cache
- [ ] Document what happened
- [ ] Notify team
- [ ] Plan next steps

**Estimated Total Time:** 5-10 minutes

---

## Files Modified During Migration (For Reference)

Files that need rollback:
1. `components/chat.tsx` - Line 85
2. `app/api/chat/route.ts` - Line 44
3. `middleware.ts` - Lines 103-171 (added section)

Directories that need deletion:
1. `app/(dashboard)/agents/chat-general/`
2. `app/api/agents/chat-general/`

Original directories that must exist:
1. `app/(dashboard)/dashboard/chat/`
2. `app/api/chat/`
3. `app/api/document/`
4. `app/api/files/`
5. `app/api/history/`
6. `app/api/vote/`
7. `app/api/suggestions/`

---

**Remember:** Rollback is a safety measure, not a failure. Better to rollback and fix properly than to leave broken functionality in production.

**Last Updated:** 2025-11-07
**Status:** Ready for use if needed

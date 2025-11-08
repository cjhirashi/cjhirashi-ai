# Implementation Plan: API Routes Restoration

**Date**: 2025-11-07
**Priority**: CRITICAL - P0
**Estimated Time**: 45 minutes
**Risk Level**: Low (restoring known-good code)

---

## Overview

This plan provides step-by-step instructions to restore the deleted API endpoints and fix all broken import references, returning the application to a functional state.

---

## Pre-Execution Checklist

Before starting, verify:

- [ ] Git repository is clean (no uncommitted changes)
- [ ] Current branch is `dev`
- [ ] Development server is stopped
- [ ] You have commit `9d12ff6` in git history (contains deletion)
- [ ] You have commit `6130489~1` in git history (before deletion)

**Check git history**:
```bash
cd "C:\PROYECTOS\APPS\cjhirashi-ai"
git log --oneline | head -5
# Should show: 9d12ff6 fix: Remove legacy (chat) route group...
```

---

## Phase 1: Create Directory Structure

**Duration**: 2 minutes

### Step 1.1: Create API directories

```bash
cd "C:\PROYECTOS\APPS\cjhirashi-ai"

# Create all API directories
mkdir -p app/api/chat/[id]/stream
mkdir -p app/api/document
mkdir -p app/api/files/upload
mkdir -p app/api/history
mkdir -p app/api/suggestions
mkdir -p app/api/vote
```

**Expected result**:
```
app/api/
├── chat/
│   └── [id]/
│       └── stream/
├── document/
├── files/
│   └── upload/
├── history/
├── suggestions/
└── vote/
```

### Validation

```bash
ls -la app/api/
# Should show: chat, document, files, history, suggestions, vote
```

---

## Phase 2: Restore API Route Files

**Duration**: 10 minutes

### Step 2.1: Restore chat API routes

```bash
# Main chat endpoint (333 lines)
git show 6130489~1:app/\(chat\)/api/chat/route.ts > app/api/chat/route.ts

# Chat schema (28 lines)
git show 6130489~1:app/\(chat\)/api/chat/schema.ts > app/api/chat/schema.ts

# Stream resumption endpoint (113 lines)
git show 6130489~1:app/\(chat\)/api/chat/\[id\]/stream/route.ts > app/api/chat/[id]/stream/route.ts
```

**Validation**:
```bash
ls -la app/api/chat/
# Should show: route.ts, schema.ts, [id]/

wc -l app/api/chat/route.ts
# Should show: ~333 lines

wc -l app/api/chat/schema.ts
# Should show: ~28 lines
```

### Step 2.2: Restore document API

```bash
# Document operations (126 lines)
git show 6130489~1:app/\(chat\)/api/document/route.ts > app/api/document/route.ts
```

**Validation**:
```bash
wc -l app/api/document/route.ts
# Should show: ~126 lines
```

### Step 2.3: Restore file upload API

```bash
# File upload to Vercel Blob (68 lines)
git show 6130489~1:app/\(chat\)/api/files/upload/route.ts > app/api/files/upload/route.ts
```

**Validation**:
```bash
wc -l app/api/files/upload/route.ts
# Should show: ~68 lines
```

### Step 2.4: Restore history API

```bash
# Chat history operations (46 lines)
git show 6130489~1:app/\(chat\)/api/history/route.ts > app/api/history/route.ts
```

**Validation**:
```bash
wc -l app/api/history/route.ts
# Should show: ~46 lines
```

### Step 2.5: Restore suggestions API

```bash
# Document edit suggestions (37 lines)
git show 6130489~1:app/\(chat\)/api/suggestions/route.ts > app/api/suggestions/route.ts
```

**Validation**:
```bash
wc -l app/api/suggestions/route.ts
# Should show: ~37 lines
```

### Step 2.6: Restore vote API

```bash
# Message voting (75 lines)
git show 6130489~1:app/\(chat\)/api/vote/route.ts > app/api/vote/route.ts
```

**Validation**:
```bash
wc -l app/api/vote/route.ts
# Should show: ~75 lines
```

### Phase 2 Validation

**Check all files exist**:
```bash
find app/api -name "route.ts" -type f
# Should show 8 files:
# app/api/chat/route.ts
# app/api/chat/[id]/stream/route.ts
# app/api/document/route.ts
# app/api/files/upload/route.ts
# app/api/history/route.ts
# app/api/suggestions/route.ts
# app/api/vote/route.ts
```

**Check total lines restored**:
```bash
find app/api -name "route.ts" -o -name "schema.ts" | xargs wc -l
# Should show total: ~826 lines
```

---

## Phase 3: Restore Server Actions

**Duration**: 3 minutes

### Step 3.1: Check if actions.ts exists in dashboard

```bash
ls -la app/\(dashboard\)/actions.ts
```

**If file exists**: Check its content. If it's minimal (< 100 lines), proceed with restoration.

**If file doesn't exist**: Proceed with restoration.

### Step 3.2: Restore actions.ts

```bash
# Check what's in the deleted actions file
git show 6130489~1:app/\(chat\)/actions.ts | head -20

# If it contains saveChatModelAsCookie, restore it
git show 6130489~1:app/\(chat\)/actions.ts > app/\(dashboard\)/actions-restored.ts

# Compare with existing actions.ts
diff app/\(dashboard\)/actions.ts app/\(dashboard\)/actions-restored.ts

# If safe, merge or replace:
# OPTION A: Replace entirely (if current actions.ts is minimal)
mv app/\(dashboard\)/actions-restored.ts app/\(dashboard\)/actions.ts

# OPTION B: Manually merge if both files have important content
# (Open both files and combine manually)
```

**Validation**:
```bash
grep -n "saveChatModelAsCookie" app/\(dashboard\)/actions.ts
# Should find the function
```

---

## Phase 4: Fix Broken Imports

**Duration**: 15 minutes

### Step 4.1: Identify files with broken imports

```bash
# Search for old import path
grep -r "app/(chat)/actions" --include="*.ts" --include="*.tsx" .
```

**Expected files** (5 files):
1. `components/multimodal-input.tsx`
2. `components/model-selector.tsx`
3. `components/message-editor.tsx`
4. `hooks/use-chat-visibility.ts`
5. `CLAUDE.md`

### Step 4.2: Fix each file

**For each TypeScript file**:

```typescript
// OLD (broken):
import { saveChatModelAsCookie } from "@/app/(chat)/actions";

// NEW (fixed):
import { saveChatModelAsCookie } from "@/app/(dashboard)/actions";
```

**Manual update command** (or use your editor):
```bash
# For each file, use Edit tool to replace:
# OLD: @/app/(chat)/actions
# NEW: @/app/(dashboard)/actions
```

**Files to update**:

1. **`C:\PROYECTOS\APPS\cjhirashi-ai\components\multimodal-input.tsx`**
   - Line 21: Update import path

2. **`C:\PROYECTOS\APPS\cjhirashi-ai\components\model-selector.tsx`**
   - Find and update import path

3. **`C:\PROYECTOS\APPS\cjhirashi-ai\components\message-editor.tsx`**
   - Find and update import path

4. **`C:\PROYECTOS\APPS\cjhirashi-ai\hooks\use-chat-visibility.ts`**
   - Find and update import path

5. **`C:\PROYECTOS\APPS\cjhirashi-ai\CLAUDE.md`**
   - Lines 46-60: Update architecture documentation (already provided in analysis doc)

### Step 4.3: Validate no broken imports remain

```bash
# Should return nothing:
grep -r "app/(chat)/actions" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules
```

---

## Phase 5: TypeScript Compilation Check

**Duration**: 5 minutes

### Step 5.1: Build project

```bash
cd "C:\PROYECTOS\APPS\cjhirashi-ai"
pnpm build
```

**Expected result**: Build should complete without TypeScript errors.

**If errors occur**:
- Check error messages for import path issues
- Verify all files were updated in Phase 4
- Check for missing dependencies

### Step 5.2: Type check only (faster alternative)

```bash
pnpm exec tsc --noEmit
```

---

## Phase 6: Functional Testing

**Duration**: 10 minutes

### Step 6.1: Start development server

```bash
pnpm dev
```

**Expected output**:
```
▲ Next.js 15.3.0-canary.31
- Local:        http://localhost:3000
- Environments: .env

✓ Ready in 2.3s
```

### Step 6.2: Test API endpoint existence

Open a new terminal and run:

```bash
# Test each API endpoint (should return 401, NOT 404)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/chat
# Expected: 401 ✅ (route exists but unauthorized)

curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/document
# Expected: 401 ✅

curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/history
# Expected: 401 ✅

curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/vote
# Expected: 401 ✅

curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/suggestions
# Expected: 401 ✅

curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/files/upload
# Expected: 401 ✅
```

**If any return 404**: The route wasn't restored correctly. Check the file exists and server restarted.

### Step 6.3: Test UI flow (manual)

1. **Open browser**: Navigate to `http://localhost:3000`
2. **Click "Login"**: Should redirect to `/login` page
3. **Login with credentials**: Should redirect to `/dashboard/chat`
4. **Verify page loads**: Should see chat interface (not blank)
5. **Type a message**: "Hello, test message"
6. **Click send**: Should see loading indicator
7. **Verify response**: AI should respond (if env vars are configured)

**If page is blank**:
- Open browser DevTools Console (F12)
- Look for errors (especially 404 errors)
- Check Network tab for failed requests

**If chat doesn't respond**:
- Check if `AI_GATEWAY_API_KEY` is set in `.env`
- Check if `POSTGRES_URL` is set
- Check server console for errors

### Step 6.4: Test file upload (if applicable)

1. **In chat interface**: Click attachment icon (paperclip)
2. **Select a file**: Choose a small image or document
3. **Verify upload**: Should show preview
4. **Send message with attachment**: Should work

**If upload fails**:
- Check `BLOB_READ_WRITE_TOKEN` in `.env`
- Check `/api/files/upload` endpoint exists

### Step 6.5: Test voting (if applicable)

1. **After receiving AI response**: Hover over message
2. **Click thumbs up/down**: Should register vote
3. **Refresh page**: Vote should persist

**If voting fails**:
- Check browser console for errors
- Verify `/api/vote` endpoint exists

---

## Phase 7: Documentation Updates

**Duration**: 5 minutes

### Step 7.1: Update CLAUDE.md

Replace lines 46-60 in `CLAUDE.md` with the corrected architecture documentation (provided in analysis document).

**Key changes**:
- Remove references to `app/(chat)/`
- Add section for `app/api/` with all endpoints
- Update route descriptions for `(dashboard)`, `(public)`, `(auth)`

### Step 7.2: Create Architecture Decision Record (ADR)

```bash
mkdir -p docs/decisions
```

Create file: `docs/decisions/001-api-routes-location.md`

**Content** (provided in analysis document):
- Status: Accepted
- Context: API organization in Next.js 15
- Decision: All APIs in `app/api/`
- Consequences: Stability and separation of concerns

---

## Phase 8: Commit Changes

**Duration**: 5 minutes

### Step 8.1: Review changes

```bash
git status
# Should show:
# - New files: app/api/**/*.ts
# - Modified files: components/*.tsx, hooks/*.ts, CLAUDE.md, app/(dashboard)/actions.ts
# - New files: docs/architecture/*.md, docs/decisions/*.md
```

### Step 8.2: Stage changes

```bash
git add app/api/
git add app/\(dashboard\)/actions.ts
git add components/
git add hooks/
git add CLAUDE.md
git add docs/
```

### Step 8.3: Commit

```bash
git commit -m "fix: Restore deleted API routes to centralized app/api/ directory

PROBLEM:
- Commit 9d12ff6 deleted app/(chat)/ including all API endpoints
- Chat functionality completely broken (blank screen on /dashboard/chat)
- 8 API routes missing: /api/chat, /api/document, /api/history, /api/vote, /api/suggestions, /api/files/upload

ROOT CAUSE:
- Route groups in Next.js are transparent to URLs
- APIs should be in app/api/, not inside route groups
- Misunderstanding led to accidental deletion of business logic

SOLUTION:
- Restored all 8 API routes (826 lines) to app/api/ directory
- Fixed 5 broken import paths referencing deleted (chat)/actions
- Updated CLAUDE.md with correct architecture documentation
- Created ADR documenting API location best practices

TESTING:
- All API endpoints return 401 (not 404) when unauthenticated ✅
- TypeScript compilation succeeds ✅
- Chat interface loads and sends messages ✅
- File upload works ✅
- Voting works ✅

DOCUMENTATION:
- docs/architecture/api-routes-critical-analysis.md (full analysis)
- docs/architecture/api-restoration-implementation-plan.md (this plan)
- docs/decisions/001-api-routes-location.md (ADR)
- CLAUDE.md (updated architecture section)

Generated with Claude Code (https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Rollback Plan (If Something Goes Wrong)

If errors occur during implementation:

### Quick Rollback

```bash
# Discard all changes and start over
git reset --hard HEAD
git clean -fd
```

### Selective Rollback

```bash
# If only some files have issues, restore from git
git checkout HEAD -- app/api/
git checkout HEAD -- components/
```

---

## Success Criteria

**Phase 1-8 complete when**:

- [ ] All 8 API routes exist in `app/api/` directory
- [ ] Total ~826 lines of API code restored
- [ ] `app/(dashboard)/actions.ts` contains `saveChatModelAsCookie`
- [ ] Zero broken imports (grep returns nothing)
- [ ] TypeScript compilation succeeds
- [ ] Dev server starts without errors
- [ ] All API endpoints return 401 (not 404)
- [ ] Chat page loads (not blank)
- [ ] User can send message and receive response
- [ ] File upload works
- [ ] Voting works
- [ ] CLAUDE.md updated
- [ ] ADR created
- [ ] Changes committed to git

---

## Troubleshooting Guide

### Issue: git show returns empty content

**Symptom**: Restored files are empty or don't contain code.

**Cause**: Wrong commit hash or file path.

**Solution**:
```bash
# List all commits touching the file
git log --all --full-history -- "app/(chat)/api/chat/route.ts"

# Use the commit hash from BEFORE the deletion
git show <commit-hash>:app/\(chat\)/api/chat/route.ts | head -20
```

### Issue: TypeScript errors after restoration

**Symptom**: `pnpm build` fails with import errors.

**Cause**: Dependencies or types have changed since deletion.

**Solution**:
```bash
# Reinstall dependencies
pnpm install

# Check for missing types
pnpm exec tsc --noEmit
```

### Issue: 404 on API endpoints after restoration

**Symptom**: `curl` returns 404 instead of 401.

**Cause**: Server didn't reload or file naming issue.

**Solution**:
```bash
# Restart dev server
# Press Ctrl+C in terminal running pnpm dev
pnpm dev

# Verify file names (Next.js is case-sensitive)
ls -la app/api/chat/
# Must be: route.ts (lowercase)
```

### Issue: Page still blank after restoration

**Symptom**: `/dashboard/chat` shows blank screen.

**Cause**: Client-side error, check browser console.

**Solution**:
1. Open DevTools Console (F12)
2. Look for red error messages
3. Check Network tab for failed requests
4. Verify import paths are correct in components

### Issue: Merge conflicts in actions.ts

**Symptom**: Existing `app/(dashboard)/actions.ts` has different content.

**Cause**: File was modified after migration.

**Solution**:
```bash
# Save current version
cp app/\(dashboard\)/actions.ts app/\(dashboard\)/actions-current.ts

# Restore old version
git show 6130489~1:app/\(chat\)/actions.ts > app/\(dashboard\)/actions-old.ts

# Manually merge both files
# Keep functions from both that are needed
```

---

## Post-Implementation Tasks

After successful restoration:

1. **Run Playwright tests** (if available):
   ```bash
   pnpm test
   ```

2. **Deploy to staging** (if applicable):
   ```bash
   git push origin dev
   # Trigger deployment pipeline
   ```

3. **Monitor production** (if deploying):
   - Check error logs
   - Verify all API endpoints accessible
   - Monitor response times

4. **Create follow-up tasks**:
   - [ ] Add integration tests for API endpoints
   - [ ] Add pre-commit hooks to prevent API deletions
   - [ ] Update onboarding docs for new developers
   - [ ] Review other route groups for similar issues

---

## Time Tracking

| Phase | Task | Estimated Time | Notes |
|-------|------|----------------|-------|
| 1 | Create directories | 2 min | Simple mkdir commands |
| 2 | Restore API files | 10 min | 8 git show commands |
| 3 | Restore actions | 3 min | 1 git show + merge |
| 4 | Fix imports | 15 min | Update 5 files |
| 5 | Type check | 5 min | Build or tsc |
| 6 | Functional testing | 10 min | Manual UI testing |
| 7 | Documentation | 5 min | Update CLAUDE.md + ADR |
| 8 | Commit | 5 min | Git commit |
| **Total** | | **55 min** | Including testing |

**Fast path** (skip some testing): ~30 minutes
**Careful path** (thorough testing): ~55 minutes

---

## Conclusion

This implementation plan provides a systematic approach to restore the accidentally deleted API endpoints and return the application to a functional state. The process is low-risk because we're restoring known-good code from git history, not writing new code.

**Next Steps**:
1. Follow Phase 1-8 sequentially
2. Use the validation steps after each phase
3. If errors occur, consult Troubleshooting Guide
4. Mark checkboxes in Success Criteria as you complete them

**Questions or Issues**:
- Refer to `docs/architecture/api-routes-critical-analysis.md` for architectural context
- Check git history if file paths differ
- Test incrementally rather than all at once

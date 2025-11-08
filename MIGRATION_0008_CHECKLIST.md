# Migration 0008: Pre-Application Checklist

Use this checklist before applying migration 0008 to ensure everything is ready.

## Pre-Migration Checklist

### Environment Verification

- [ ] **Database connection configured**
  ```bash
  # Verify POSTGRES_URL is set
  echo $POSTGRES_URL
  ```

- [ ] **Development environment**
  ```bash
  # Check .env.local exists
  ls -la .env.local
  ```

- [ ] **Dependencies installed**
  ```bash
  pnpm install
  ```

- [ ] **TypeScript compiling**
  ```bash
  pnpm build
  ```

### Code Review

- [ ] **Schema changes reviewed**
  - File: `lib/db/schema.ts`
  - Changes: Chat.agentType field + 4 new tables + indexes

- [ ] **Query functions reviewed**
  - File: `lib/db/queries.ts`
  - Changes: 20+ new query functions with ownership validation

- [ ] **Migration SQL reviewed**
  - File: `lib/db/migrations/0008_ambiguous_dust.sql`
  - Verify: Tables, indexes, foreign keys

- [ ] **Seed script reviewed**
  - File: `lib/db/seed-agent-types.ts`
  - Verify: 4 agent types will be created

### Backup (Production Only)

- [ ] **Database backup created**
  ```bash
  # Neon provides automatic backups, but verify:
  # Go to Neon dashboard → Project → Backups
  ```

- [ ] **Backup tested (restore dry-run)**
  - Verify you can restore if needed

- [ ] **Rollback plan reviewed**
  - File: `MIGRATION_0008_INSTRUCTIONS.md` (Rollback section)

## Application Checklist

### Step 1: Apply Migration

- [ ] **Run migration**
  ```bash
  pnpm db:migrate
  ```

- [ ] **Verify success message**
  ```
  ✅ Migrations completed in XXX ms
  ```

- [ ] **Check for errors**
  - No errors should appear
  - If errors, check database connection

### Step 2: Seed Agent Types

- [ ] **Run seed script**
  ```bash
  pnpm db:seed
  ```

- [ ] **Verify success message**
  ```
  ✅ Seeded 4 agent types in XXX ms
  ```

- [ ] **Check for duplicate key errors**
  - Safe to ignore (means already seeded)

### Step 3: Verify Database

- [ ] **Open Drizzle Studio**
  ```bash
  pnpm db:studio
  ```

- [ ] **Verify Chat table**
  - [ ] Has `agentType` column
  - [ ] Existing records have `agentType = 'chat-general'`
  - [ ] Index `Chat_userId_agentType_idx` exists

- [ ] **Verify AgentType table**
  - [ ] Table exists
  - [ ] Has 4 records:
    - `chat-general` (General Chat)
    - `multi-tools` (Multi-Tools Agent)
    - `rag` (RAG Agent)
    - `multi-agent` (Multi-Agent System)

- [ ] **Verify TodoItem table**
  - [ ] Table exists
  - [ ] Index `TodoItem_userId_completed_idx` exists
  - [ ] Foreign key to User exists

- [ ] **Verify StoredFile table**
  - [ ] Table exists
  - [ ] Index `StoredFile_userId_idx` exists
  - [ ] Foreign key to User exists

- [ ] **Verify UserMessage table**
  - [ ] Table exists
  - [ ] Index `UserMessage_senderId_recipientId_idx` exists
  - [ ] Foreign keys to User (sender & recipient) exist

## Post-Migration Testing

### Functional Tests

- [ ] **Test agent type queries**
  ```typescript
  // In a server action or API route
  import { getActiveAgentTypes } from "@/lib/db/queries";
  const agentTypes = await getActiveAgentTypes();
  console.log("Agent types:", agentTypes.length); // Should be 4
  ```

- [ ] **Test chat with agent type**
  ```typescript
  import { saveChatWithAgentType } from "@/lib/db/queries";
  await saveChatWithAgentType({
    id: generateUUID(),
    userId: "test-user-id",
    title: "Test RAG Chat",
    visibility: "private",
    agentType: "rag",
  });
  ```

- [ ] **Test todo CRUD**
  ```typescript
  import { createTodoItem, getTodoItemsByUserId } from "@/lib/db/queries";

  const [todo] = await createTodoItem({
    userId: "test-user-id",
    title: "Test task",
    priority: "high",
  });

  const todos = await getTodoItemsByUserId({
    userId: "test-user-id",
    completed: false,
  });
  ```

- [ ] **Test file tracking**
  ```typescript
  import { createStoredFile, getStoredFilesByUserId } from "@/lib/db/queries";

  const [file] = await createStoredFile({
    userId: "test-user-id",
    fileName: "test.txt",
    fileSize: 1024,
    fileType: "text/plain",
    fileUrl: "https://example.com/test.txt",
  });

  const files = await getStoredFilesByUserId({
    userId: "test-user-id",
  });
  ```

- [ ] **Test user messaging**
  ```typescript
  import { createUserMessage, getConversationMessages } from "@/lib/db/queries";

  const [msg] = await createUserMessage({
    senderId: "user1-id",
    recipientId: "user2-id",
    content: "Test message",
  });

  const messages = await getConversationMessages({
    userId1: "user1-id",
    userId2: "user2-id",
  });
  ```

### Security Tests

- [ ] **Test ownership validation**
  ```typescript
  // Should throw ChatSDKError("unauthorized:database")
  try {
    await updateTodoItem({
      id: "someone-elses-todo",
      userId: "wrong-user-id",
      completed: true,
    });
  } catch (error) {
    console.log("✅ Ownership validation working");
  }
  ```

### Performance Tests

- [ ] **Test indexed queries**
  ```sql
  -- Run in Drizzle Studio SQL tab
  EXPLAIN ANALYZE
  SELECT * FROM "Chat"
  WHERE "userId" = 'test-user-id'
    AND "agentType" = 'chat-general';

  -- Should show index usage:
  -- Index Scan using Chat_userId_agentType_idx
  ```

## TypeScript Verification

- [ ] **No type errors**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Import new types**
  ```typescript
  import type {
    Chat,
    AgentType,
    TodoItem,
    StoredFile,
    UserMessage,
  } from "@/lib/db/schema";
  ```

- [ ] **Use new types in code**
  - Chat type now includes `agentType` field
  - All new types available

## Documentation Review

- [ ] **Read migration guide**
  - File: `MIGRATION_0008_INSTRUCTIONS.md`

- [ ] **Read query reference**
  - File: `docs/database/migration-0008-queries.md`

- [ ] **Read technical docs**
  - File: `lib/db/migrations/0008_README.md`

- [ ] **Read summary**
  - File: `MIGRATION_0008_SUMMARY.md`

## Rollback Test (Optional - Dev Only)

- [ ] **Test rollback SQL**
  ```sql
  -- In development environment only!
  -- Run the rollback SQL from MIGRATION_0008_INSTRUCTIONS.md
  -- Then re-apply migration to verify idempotency
  ```

## Production Deployment Checklist

### Pre-Deployment

- [ ] **All tests passing**
- [ ] **Migration verified in staging**
- [ ] **Backup verified**
- [ ] **Rollback plan ready**
- [ ] **Team notified of deployment**

### Deployment Window

- [ ] **Low traffic period selected**
- [ ] **Monitor ready (database metrics)**
- [ ] **Team on standby**

### During Deployment

- [ ] **Run migration**
  ```bash
  pnpm db:migrate
  ```

- [ ] **Run seed script**
  ```bash
  pnpm db:seed
  ```

- [ ] **Monitor database load**
  - Watch for index creation time
  - Check for locks

- [ ] **Verify application health**
  - Check existing features still work
  - Check new features accessible

### Post-Deployment

- [ ] **Smoke tests passed**
- [ ] **Error monitoring checked**
- [ ] **Performance metrics reviewed**
- [ ] **Team notified of success**

## Troubleshooting

### Migration fails

**Issue**: `Migration failed`

**Solutions**:
1. Check `POSTGRES_URL` is correct
2. Verify database connectivity
3. Check database user permissions
4. Review error message for specific issue

### Seed fails with duplicate key

**Issue**: `duplicate key value violates unique constraint`

**Solution**: Agent types already seeded. Safe to ignore or re-run.

### TypeScript errors

**Issue**: TypeScript can't find new types

**Solution**: Restart TypeScript server
```bash
# In VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Index creation slow

**Issue**: Index creation taking a long time

**Solution**: Normal for large datasets. Wait for completion.

### Ownership validation errors

**Issue**: `ChatSDKError("unauthorized:database")`

**Solution**: Verify you're passing the correct `userId` matching the resource owner.

## Final Sign-off

Before marking migration as complete:

- [ ] ✅ Migration applied successfully
- [ ] ✅ Seed data populated
- [ ] ✅ All verifications passed
- [ ] ✅ Tests passing
- [ ] ✅ Documentation reviewed
- [ ] ✅ No errors in logs
- [ ] ✅ Application functioning normally

---

## Quick Reference

**Apply Migration**:
```bash
pnpm db:migrate && pnpm db:seed
```

**Verify**:
```bash
pnpm db:studio
```

**Test**:
```bash
npx tsc --noEmit && pnpm test
```

**Rollback** (if needed):
See `MIGRATION_0008_INSTRUCTIONS.md` → Rollback section

---

**Migration Complete**: □ Yes □ No

**Date Applied**: _______________

**Applied By**: _______________

**Notes**: _______________________________________________

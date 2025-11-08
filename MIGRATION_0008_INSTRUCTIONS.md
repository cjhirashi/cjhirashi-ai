# Migration 0008: Agent Types and Extended Features - Application Instructions

## Overview

Migration **0008_ambiguous_dust** adds support for multiple agent types and extends the application with new feature tables for task management, file storage, and user messaging.

## What Changed

### 1. Schema Updates (`lib/db/schema.ts`)
- **Chat table**: Added `agentType` field (VARCHAR 50, default 'chat-general')
- **New tables**: AgentType, TodoItem, StoredFile, UserMessage
- **New indexes**: Optimized for common query patterns

### 2. Query Functions (`lib/db/queries.ts`)
- Added queries for all new tables
- Added agent-type-aware chat queries
- All queries include ownership validation

### 3. Supporting Files
- **Seed script**: `lib/db/seed-agent-types.ts`
- **Migration docs**: `lib/db/migrations/0008_README.md`

## Step-by-Step Application

### Step 1: Review Changes

Check the generated migration file:
```bash
cat lib/db/migrations/0008_ambiguous_dust.sql
```

Review the comprehensive documentation:
```bash
cat lib/db/migrations/0008_README.md
```

### Step 2: Apply Migration

**Option A - Development (Recommended):**
```bash
pnpm db:migrate
```

**Option B - Via Build (Production):**
```bash
pnpm build
```
> Migrations automatically run during build process

**Expected Output:**
```
⏳ Running migrations...
✅ Migrations completed in XXX ms
```

### Step 3: Seed Reference Data (REQUIRED)

Populate the AgentType table with initial agent types:
```bash
pnpm db:seed
```

**Expected Output:**
```
⏳ Seeding agent types...
✅ Seeded 4 agent types in XXX ms
```

This creates the following agent types:
- `chat-general` - General Chat
- `multi-tools` - Multi-Tools Agent
- `rag` - RAG Agent (Retrieval-Augmented Generation)
- `multi-agent` - Multi-Agent System

### Step 4: Verify Migration

Open Drizzle Studio to inspect the database:
```bash
pnpm db:studio
```

**Verification Checklist:**
- [ ] Chat table has `agentType` column
- [ ] Existing chats have `agentType = 'chat-general'`
- [ ] AgentType table exists with 4 records
- [ ] TodoItem table exists
- [ ] StoredFile table exists
- [ ] UserMessage table exists
- [ ] All indexes are created:
  - `Chat_userId_agentType_idx`
  - `TodoItem_userId_completed_idx`
  - `StoredFile_userId_idx`
  - `UserMessage_senderId_recipientId_idx`

### Step 5: Test Database Queries

The migration adds new query functions in `lib/db/queries.ts`. Test them:

```typescript
import {
  getActiveAgentTypes,
  getChatsByUserIdAndAgentType,
  createTodoItem,
  getTodoItemsByUserId,
  createStoredFile,
  getStoredFilesByUserId,
  createUserMessage,
  getConversationMessages,
} from "@/lib/db/queries";

// Test agent types
const agentTypes = await getActiveAgentTypes();
console.log("Agent types:", agentTypes);

// Test chat queries with agent type
const chats = await getChatsByUserIdAndAgentType({
  userId: "your-user-id",
  agentType: "chat-general",
});

// Test todo items
const [todo] = await createTodoItem({
  userId: "your-user-id",
  title: "Test task",
  priority: "high",
});

// Test stored files
const [file] = await createStoredFile({
  userId: "your-user-id",
  fileName: "test.txt",
  fileSize: 1024,
  fileType: "text/plain",
  fileUrl: "https://blob.vercel-storage.com/...",
});
```

## Migration Safety

### Backward Compatibility
✅ All existing Chat records automatically receive `agentType = 'chat-general'`
✅ Existing queries continue to work without modification
✅ Migration is idempotent (safe to re-run)

### Performance Impact
⚠️ Index creation on Chat table may take time with large datasets
💡 Recommend running during low-traffic periods for production

### Data Integrity
✅ All foreign keys properly reference User table
✅ Default values prevent constraint violations
✅ Ownership validation in all query functions

## Rollback (If Needed)

If you need to rollback this migration:

```sql
-- WARNING: This will delete all data in new tables!

-- Remove indexes
DROP INDEX IF EXISTS "Chat_userId_agentType_idx";
DROP INDEX IF EXISTS "TodoItem_userId_completed_idx";
DROP INDEX IF EXISTS "StoredFile_userId_idx";
DROP INDEX IF EXISTS "UserMessage_senderId_recipientId_idx";

-- Remove column
ALTER TABLE "Chat" DROP COLUMN IF EXISTS "agentType";

-- Drop tables (in order)
DROP TABLE IF EXISTS "UserMessage";
DROP TABLE IF EXISTS "TodoItem";
DROP TABLE IF EXISTS "StoredFile";
DROP TABLE IF EXISTS "AgentType";
```

## Using the New Features

### 1. Agent Type Support

**Save chat with specific agent type:**
```typescript
import { saveChatWithAgentType } from "@/lib/db/queries";

await saveChatWithAgentType({
  id: chatId,
  userId: session.user.id,
  title: "RAG Chat",
  visibility: "private",
  agentType: "rag", // or 'chat-general', 'multi-tools', 'multi-agent'
});
```

**Filter chats by agent type:**
```typescript
import { getChatsByUserIdAndAgentType } from "@/lib/db/queries";

const ragChats = await getChatsByUserIdAndAgentType({
  userId: session.user.id,
  agentType: "rag",
  limit: 50,
});
```

### 2. Todo Items

**Create todo:**
```typescript
import { createTodoItem } from "@/lib/db/queries";

const [todo] = await createTodoItem({
  userId: session.user.id,
  title: "Implement feature X",
  description: "Add support for...",
  priority: "high",
  dueDate: new Date("2025-12-31"),
});
```

**Get user's incomplete todos:**
```typescript
import { getTodoItemsByUserId } from "@/lib/db/queries";

const incompleteTodos = await getTodoItemsByUserId({
  userId: session.user.id,
  completed: false,
});
```

**Update todo:**
```typescript
import { updateTodoItem } from "@/lib/db/queries";

await updateTodoItem({
  id: todoId,
  userId: session.user.id,
  completed: true,
});
```

### 3. File Storage

**Track uploaded file:**
```typescript
import { createStoredFile } from "@/lib/db/queries";
import { put } from "@vercel/blob";

// Upload to Vercel Blob
const blob = await put(fileName, file, { access: "public" });

// Track in database
const [storedFile] = await createStoredFile({
  userId: session.user.id,
  fileName: file.name,
  fileSize: file.size,
  fileType: file.type,
  fileUrl: blob.url,
});
```

**Get user's files:**
```typescript
import { getStoredFilesByUserId } from "@/lib/db/queries";

const files = await getStoredFilesByUserId({
  userId: session.user.id,
  limit: 50,
  offset: 0,
});
```

### 4. User Messaging

**Send message:**
```typescript
import { createUserMessage } from "@/lib/db/queries";

const [message] = await createUserMessage({
  senderId: session.user.id,
  recipientId: recipientUserId,
  content: "Hello!",
  attachments: { files: [{ url: "...", type: "image" }] },
});
```

**Get conversation:**
```typescript
import { getConversationMessages } from "@/lib/db/queries";

const messages = await getConversationMessages({
  userId1: session.user.id,
  userId2: otherUserId,
  limit: 50,
});
```

**Mark as read:**
```typescript
import { markUserMessageAsRead } from "@/lib/db/queries";

await markUserMessageAsRead({
  id: messageId,
  userId: session.user.id,
});
```

## Type Exports

All new types are exported from `lib/db/schema.ts`:

```typescript
import type {
  Chat,          // Now includes agentType
  AgentType,     // New
  TodoItem,      // New
  StoredFile,    // New
  UserMessage,   // New
} from "@/lib/db/schema";
```

## Next Steps

After applying the migration:

1. **Update UI components** to use agent type selection
2. **Create server actions** for CRUD operations on new tables
3. **Add routes** for new features (todos, files, messaging)
4. **Implement authorization** middleware for new endpoints
5. **Add tests** for new query functions
6. **Update documentation** for new features

## Common Issues

### Issue: Migration fails with "column already exists"
**Solution**: The migration is idempotent. This error indicates it was partially applied. Check database state with `pnpm db:studio`.

### Issue: Seed script fails with "duplicate key"
**Solution**: Agent types already exist. Safe to ignore or re-run (uses `onConflictDoNothing`).

### Issue: TypeScript errors after migration
**Solution**: Restart TypeScript server. In VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Issue: Queries fail with "unauthorized:database"
**Solution**: All new queries validate ownership. Ensure you're passing the correct `userId` matching the resource owner.

## Support

- **Migration details**: `lib/db/migrations/0008_README.md`
- **Schema reference**: `lib/db/schema.ts`
- **Query examples**: `lib/db/queries.ts`
- **Drizzle docs**: https://orm.drizzle.team/

## Summary

This migration successfully:
- ✅ Added agent type support to Chat table
- ✅ Created 4 new feature tables
- ✅ Added performance indexes
- ✅ Backfilled existing data with defaults
- ✅ Maintained backward compatibility
- ✅ Provided comprehensive query functions

**Estimated Application Time**: 2-5 minutes (depending on database size)
**Breaking Changes**: None
**Required Actions**: Apply migration + seed agent types

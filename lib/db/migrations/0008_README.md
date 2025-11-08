# Migration 0008: Agent Types and Extended Features

**Migration File:** `0008_ambiguous_dust.sql`
**Created:** 2025-11-07
**Status:** Generated, pending application

## Overview

This migration introduces support for multiple agent types and extends the application with new feature tables for todos, file storage, inter-user messaging, and agent type management.

## Changes Summary

### 1. Modified Tables

#### Chat Table
- **Added Column:** `agentType` (VARCHAR 50, DEFAULT 'chat-general', NOT NULL)
- **Added Index:** `Chat_userId_agentType_idx` on (userId, agentType)
- **Purpose:** Discriminate between different agent types (chat-general, multi-tools, rag, multi-agent)
- **Backward Compatibility:** All existing chats automatically receive 'chat-general' as default value

### 2. New Tables

#### AgentType
Reference table for available agent types in the system.

**Columns:**
- `id` (VARCHAR 50, PRIMARY KEY) - Agent type identifier
- `name` (TEXT, NOT NULL) - Display name
- `description` (TEXT, NULLABLE) - Agent description
- `isActive` (BOOLEAN, DEFAULT true, NOT NULL) - Active status flag
- `createdAt` (TIMESTAMP, DEFAULT now(), NOT NULL) - Creation timestamp

**Initial Values:**
- `chat-general` - General Chat
- `multi-tools` - Multi-Tools Agent
- `rag` - RAG Agent
- `multi-agent` - Multi-Agent System

#### TodoItem
Task management functionality for users.

**Columns:**
- `id` (UUID, PRIMARY KEY) - Unique identifier
- `userId` (UUID, NOT NULL, FK → User.id) - Task owner
- `title` (TEXT, NOT NULL) - Task title
- `description` (TEXT, NULLABLE) - Task description
- `completed` (BOOLEAN, DEFAULT false, NOT NULL) - Completion status
- `priority` (VARCHAR, DEFAULT 'medium', NOT NULL) - Priority level: 'low' | 'medium' | 'high'
- `dueDate` (TIMESTAMP, NULLABLE) - Optional due date
- `createdAt` (TIMESTAMP, DEFAULT now(), NOT NULL) - Creation timestamp
- `updatedAt` (TIMESTAMP, DEFAULT now(), NOT NULL) - Last update timestamp

**Indexes:**
- `TodoItem_userId_completed_idx` on (userId, completed) - Optimize queries for user's tasks filtered by completion status

#### StoredFile
File storage tracking linked to Vercel Blob.

**Columns:**
- `id` (UUID, PRIMARY KEY) - Unique identifier
- `userId` (UUID, NOT NULL, FK → User.id) - File owner
- `fileName` (TEXT, NOT NULL) - Original filename
- `fileSize` (INTEGER, NOT NULL) - Size in bytes
- `fileType` (TEXT, NOT NULL) - MIME type
- `fileUrl` (TEXT, NOT NULL) - Vercel Blob URL
- `uploadedAt` (TIMESTAMP, DEFAULT now(), NOT NULL) - Upload timestamp

**Indexes:**
- `StoredFile_userId_idx` on (userId) - Optimize queries for user's file gallery

#### UserMessage
Direct messaging between users.

**Columns:**
- `id` (UUID, PRIMARY KEY) - Unique identifier
- `senderId` (UUID, NOT NULL, FK → User.id) - Message sender
- `recipientId` (UUID, NOT NULL, FK → User.id) - Message recipient
- `content` (TEXT, NOT NULL) - Message content
- `attachments` (JSONB, NULLABLE) - Optional file attachments metadata
- `isRead` (BOOLEAN, DEFAULT false, NOT NULL) - Read status
- `createdAt` (TIMESTAMP, DEFAULT now(), NOT NULL) - Creation timestamp
- `updatedAt` (TIMESTAMP, DEFAULT now(), NOT NULL) - Last update timestamp

**Indexes:**
- `UserMessage_senderId_recipientId_idx` on (senderId, recipientId) - Optimize conversation queries

## Migration Safety

### Idempotency
- All table creations use `CREATE TABLE IF NOT EXISTS`
- All index creations use `CREATE INDEX IF NOT EXISTS`
- Foreign key constraints use exception handling for duplicate objects
- Migration is safe to re-run without side effects

### Backward Compatibility
- The `agentType` column on Chat table has a default value ('chat-general')
- All existing Chat records will automatically receive this default value
- No breaking changes to existing queries that don't reference `agentType`

### Data Integrity
- All foreign keys properly reference User.id
- Default values prevent NULL constraint violations
- Timestamps use `DEFAULT now()` for automatic timestamping

## Performance Considerations

### Indexes Created
1. `Chat_userId_agentType_idx` - Improves filtered chat history queries
2. `TodoItem_userId_completed_idx` - Optimizes task list queries
3. `StoredFile_userId_idx` - Speeds up file gallery queries
4. `UserMessage_senderId_recipientId_idx` - Enhances conversation retrieval

**Impact:** Index creation on Chat table may take longer if many existing records exist. Recommend running during low-traffic periods for production deployments.

## Application Instructions

### 1. Apply Migration

**Development:**
```bash
pnpm db:migrate
```

**Production (via build):**
```bash
pnpm build
```
Migration runs automatically during build process.

### 2. Seed Agent Types (Required)

After applying the migration, populate the AgentType reference table:

```bash
npx tsx lib/db/seed-agent-types.ts
```

This seeds the following agent types:
- `chat-general` - General Chat
- `multi-tools` - Multi-Tools Agent
- `rag` - RAG Agent
- `multi-agent` - Multi-Agent System

### 3. Verify Migration

Check that all tables and indexes were created:

```bash
pnpm db:studio
```

Verify:
- [ ] Chat table has `agentType` column with default value
- [ ] All 4 new tables exist (AgentType, TodoItem, StoredFile, UserMessage)
- [ ] All indexes are present
- [ ] AgentType table has 4 records (after seeding)
- [ ] Existing Chat records have `agentType = 'chat-general'`

## Rollback Plan

Drizzle Kit does not generate automatic rollback migrations. To rollback this migration manually:

```sql
-- Remove indexes
DROP INDEX IF EXISTS "Chat_userId_agentType_idx";
DROP INDEX IF EXISTS "TodoItem_userId_completed_idx";
DROP INDEX IF EXISTS "StoredFile_userId_idx";
DROP INDEX IF EXISTS "UserMessage_senderId_recipientId_idx";

-- Remove column from Chat
ALTER TABLE "Chat" DROP COLUMN IF EXISTS "agentType";

-- Drop new tables (in order to avoid FK constraint violations)
DROP TABLE IF EXISTS "UserMessage";
DROP TABLE IF EXISTS "TodoItem";
DROP TABLE IF EXISTS "StoredFile";
DROP TABLE IF EXISTS "AgentType";
```

**WARNING:** Rollback will permanently delete all data in the new tables.

## Database Usage Examples

### Query Chats by Agent Type

```typescript
import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getChatsByAgentType({
  userId,
  agentType,
  limit = 50,
}: {
  userId: string;
  agentType: string;
  limit?: number;
}) {
  return await db
    .select()
    .from(chat)
    .where(
      and(
        eq(chat.userId, userId),
        eq(chat.agentType, agentType)
      )
    )
    .orderBy(desc(chat.createdAt))
    .limit(limit);
}
```

### Query User's Active Todos

```typescript
import { db } from "@/lib/db";
import { todoItem } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getActiveTodos(userId: string) {
  return await db
    .select()
    .from(todoItem)
    .where(
      and(
        eq(todoItem.userId, userId),
        eq(todoItem.completed, false)
      )
    )
    .orderBy(desc(todoItem.createdAt));
}
```

### Query User's Files

```typescript
import { db } from "@/lib/db";
import { storedFile } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getUserFiles({
  userId,
  limit = 50,
  offset = 0,
}: {
  userId: string;
  limit?: number;
  offset?: number;
}) {
  return await db
    .select()
    .from(storedFile)
    .where(eq(storedFile.userId, userId))
    .orderBy(desc(storedFile.uploadedAt))
    .limit(limit)
    .offset(offset);
}
```

### Query Conversation Messages

```typescript
import { db } from "@/lib/db";
import { userMessage } from "@/lib/db/schema";
import { eq, or, and, desc } from "drizzle-orm";

export async function getConversation({
  userId1,
  userId2,
  limit = 50,
}: {
  userId1: string;
  userId2: string;
  limit?: number;
}) {
  return await db
    .select()
    .from(userMessage)
    .where(
      or(
        and(
          eq(userMessage.senderId, userId1),
          eq(userMessage.recipientId, userId2)
        ),
        and(
          eq(userMessage.senderId, userId2),
          eq(userMessage.recipientId, userId1)
        )
      )
    )
    .orderBy(desc(userMessage.createdAt))
    .limit(limit);
}
```

## Testing Recommendations

### Unit Tests
- [ ] Test creating chats with different agentType values
- [ ] Test querying chats filtered by agentType
- [ ] Test CRUD operations for TodoItem
- [ ] Test file upload and StoredFile record creation
- [ ] Test sending/receiving UserMessage records

### Integration Tests
- [ ] Verify Chat.agentType defaults to 'chat-general' for new chats
- [ ] Verify existing chats were backfilled with 'chat-general'
- [ ] Verify AgentType reference data is seeded correctly
- [ ] Verify all foreign key constraints work properly
- [ ] Verify cascade behavior (if any) on user deletion

### Performance Tests
- [ ] Benchmark chat queries with agentType filter
- [ ] Benchmark todo queries with completion filter
- [ ] Verify index usage with EXPLAIN ANALYZE

## Related Files

### Schema Definition
- `lib/db/schema.ts` - Updated schema with new tables and types

### Type Exports
```typescript
import type {
  Chat,
  AgentType,
  TodoItem,
  StoredFile,
  UserMessage
} from "@/lib/db/schema";
```

### Migration Files
- `lib/db/migrations/0008_ambiguous_dust.sql` - SQL migration
- `lib/db/migrations/meta/0008_snapshot.json` - Schema snapshot
- `lib/db/migrations/meta/_journal.json` - Migration journal

## Next Steps

1. **Apply migration** using `pnpm db:migrate`
2. **Seed agent types** using `npx tsx lib/db/seed-agent-types.ts`
3. **Create queries** in `lib/db/queries.ts` for new tables
4. **Create server actions** for CRUD operations
5. **Update UI components** to leverage new features
6. **Add tests** for new functionality

## Notes

- This migration is **additive only** - no data is deleted or modified (except backfill)
- All new tables are independent features - can be implemented incrementally
- The `agentType` field enables future multi-agent architectures
- Consider adding ON DELETE CASCADE to foreign keys if appropriate for your use case
- TodoItem.updatedAt should be updated via triggers or application logic
- UserMessage.attachments JSONB structure should be documented separately

## Support

For questions or issues with this migration, refer to:
- Drizzle ORM Documentation: https://orm.drizzle.team/
- Project Documentation: `docs/database/`
- Migration Guide: `docs/migrations/`

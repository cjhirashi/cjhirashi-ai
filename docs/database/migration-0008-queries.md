# Migration 0008: Query Reference Guide

This document provides a quick reference for all query functions added in migration 0008.

## Table of Contents

- [Agent Type Queries](#agent-type-queries)
- [Chat Queries with Agent Type](#chat-queries-with-agent-type)
- [Todo Item Queries](#todo-item-queries)
- [Stored File Queries](#stored-file-queries)
- [User Message Queries](#user-message-queries)

---

## Agent Type Queries

### Get Active Agent Types

Retrieves all active agent types for UI display.

```typescript
import { getActiveAgentTypes } from "@/lib/db/queries";

const agentTypes = await getActiveAgentTypes();
// Returns: AgentType[]
// Sorted by: name (ascending)
```

**Use Case**: Populate agent type selector in chat creation UI

### Get Agent Type By ID

Retrieves a specific agent type by ID.

```typescript
import { getAgentTypeById } from "@/lib/db/queries";

const agentType = await getAgentTypeById({ id: "chat-general" });
// Returns: AgentType | null
```

**Use Case**: Validate agent type before creating/updating chat

---

## Chat Queries with Agent Type

### Save Chat with Agent Type

Creates a new chat with a specific agent type.

```typescript
import { saveChatWithAgentType } from "@/lib/db/queries";

await saveChatWithAgentType({
  id: "chat-uuid",
  userId: "user-uuid",
  title: "My RAG Chat",
  visibility: "private",
  agentType: "rag", // Optional, defaults to "chat-general"
});
```

**Parameters:**
- `id` (string) - Chat UUID
- `userId` (string) - Owner user UUID
- `title` (string) - Chat title
- `visibility` ("public" | "private") - Chat visibility
- `agentType?` (string) - Agent type ID (default: "chat-general")

**Use Case**: Create chat with specific agent capabilities

### Get Chats by User ID and Agent Type

Retrieves user's chats filtered by agent type.

```typescript
import { getChatsByUserIdAndAgentType } from "@/lib/db/queries";

const ragChats = await getChatsByUserIdAndAgentType({
  userId: "user-uuid",
  agentType: "rag",
  limit: 50, // Optional, default: 50
});
// Returns: Chat[]
// Sorted by: createdAt (descending)
```

**Use Case**: Display chats grouped by agent type in sidebar

### Update Chat Agent Type

Changes the agent type of an existing chat.

```typescript
import { updateChatAgentType } from "@/lib/db/queries";

await updateChatAgentType({
  chatId: "chat-uuid",
  agentType: "multi-tools",
});
```

**Use Case**: Allow users to switch chat to different agent

---

## Todo Item Queries

### Create Todo Item

Creates a new task for a user.

```typescript
import { createTodoItem } from "@/lib/db/queries";

const [todo] = await createTodoItem({
  userId: "user-uuid",
  title: "Implement feature X",
  description: "Add support for...", // Optional
  priority: "high", // "low" | "medium" | "high", default: "medium"
  dueDate: new Date("2025-12-31"), // Optional
});
// Returns: TodoItem[]
```

**Use Case**: AI agent creates tasks based on conversation

### Get Todo Items by User ID

Retrieves user's tasks, optionally filtered by completion status.

```typescript
import { getTodoItemsByUserId } from "@/lib/db/queries";

// Get all todos
const allTodos = await getTodoItemsByUserId({
  userId: "user-uuid",
  limit: 50, // Optional, default: 50
  offset: 0, // Optional, default: 0
});

// Get only incomplete todos
const incompleteTodos = await getTodoItemsByUserId({
  userId: "user-uuid",
  completed: false,
});

// Get only completed todos
const completedTodos = await getTodoItemsByUserId({
  userId: "user-uuid",
  completed: true,
});
// Returns: TodoItem[]
// Sorted by: createdAt (descending)
// Indexed on: (userId, completed)
```

**Use Case**: Display task list in dashboard

### Update Todo Item

Updates an existing task (validates ownership).

```typescript
import { updateTodoItem } from "@/lib/db/queries";

const [updated] = await updateTodoItem({
  id: "todo-uuid",
  userId: "user-uuid", // Required for ownership validation
  title: "Updated title", // Optional
  description: "New description", // Optional
  completed: true, // Optional
  priority: "low", // Optional
  dueDate: new Date("2026-01-15"), // Optional
});
// Returns: TodoItem[]
// Throws: ChatSDKError("unauthorized:database") if not owner
```

**Use Case**: User marks task as complete or updates details

### Delete Todo Item

Deletes a task (validates ownership).

```typescript
import { deleteTodoItem } from "@/lib/db/queries";

const [deleted] = await deleteTodoItem({
  id: "todo-uuid",
  userId: "user-uuid", // Required for ownership validation
});
// Returns: TodoItem[]
// Throws: ChatSDKError("unauthorized:database") if not owner
```

**Use Case**: User removes completed or cancelled tasks

---

## Stored File Queries

### Create Stored File

Tracks an uploaded file in the database.

```typescript
import { createStoredFile } from "@/lib/db/queries";
import { put } from "@vercel/blob";

// 1. Upload to Vercel Blob
const blob = await put("document.pdf", file, { access: "public" });

// 2. Track in database
const [storedFile] = await createStoredFile({
  userId: "user-uuid",
  fileName: "document.pdf",
  fileSize: 1048576, // bytes
  fileType: "application/pdf",
  fileUrl: blob.url,
});
// Returns: StoredFile[]
```

**Use Case**: Track files uploaded by users for reference

### Get Stored Files by User ID

Retrieves user's uploaded files.

```typescript
import { getStoredFilesByUserId } from "@/lib/db/queries";

const files = await getStoredFilesByUserId({
  userId: "user-uuid",
  limit: 50, // Optional, default: 50
  offset: 0, // Optional, default: 0
});
// Returns: StoredFile[]
// Sorted by: uploadedAt (descending)
// Indexed on: userId
```

**Use Case**: Display user's file gallery

### Get Stored File by ID

Retrieves a specific file by ID.

```typescript
import { getStoredFileById } from "@/lib/db/queries";

const file = await getStoredFileById({ id: "file-uuid" });
// Returns: StoredFile | null
```

**Use Case**: Get file details before download/display

### Delete Stored File

Deletes a file record (validates ownership).

```typescript
import { deleteStoredFile } from "@/lib/db/queries";
import { del } from "@vercel/blob";

// 1. Delete from database
const [deleted] = await deleteStoredFile({
  id: "file-uuid",
  userId: "user-uuid", // Required for ownership validation
});

// 2. Delete from Vercel Blob
await del(deleted.fileUrl);

// Returns: StoredFile[]
// Throws: ChatSDKError("unauthorized:database") if not owner
```

**Use Case**: User deletes uploaded files

---

## User Message Queries

### Create User Message

Sends a message from one user to another.

```typescript
import { createUserMessage } from "@/lib/db/queries";

const [message] = await createUserMessage({
  senderId: "sender-uuid",
  recipientId: "recipient-uuid",
  content: "Hello! How are you?",
  attachments: { // Optional JSONB
    files: [
      { url: "https://...", type: "image", name: "photo.jpg" }
    ]
  },
});
// Returns: UserMessage[]
```

**Use Case**: Direct messaging between users

### Get Conversation Messages

Retrieves messages in a conversation between two users.

```typescript
import { getConversationMessages } from "@/lib/db/queries";

const messages = await getConversationMessages({
  userId1: "user1-uuid",
  userId2: "user2-uuid",
  limit: 50, // Optional, default: 50
  offset: 0, // Optional, default: 0
});
// Returns: UserMessage[]
// Sorted by: createdAt (descending)
// Indexed on: (senderId, recipientId)
```

**Use Case**: Display conversation thread

**Note**: This query returns messages from userId1 to userId2 only. For a full conversation, you need to query both directions or use a custom query with `OR`.

### Mark User Message as Read

Marks a message as read (validates recipient).

```typescript
import { markUserMessageAsRead } from "@/lib/db/queries";

const [updated] = await markUserMessageAsRead({
  id: "message-uuid",
  userId: "recipient-uuid", // Must be the recipient
});
// Returns: UserMessage[]
// Throws: ChatSDKError("unauthorized:database") if not recipient
```

**Use Case**: Mark messages as read when user opens conversation

### Get Unread Message Count

Gets count of unread messages for a user.

```typescript
import { getUnreadMessageCount } from "@/lib/db/queries";

const count = await getUnreadMessageCount({
  userId: "user-uuid",
});
// Returns: number
```

**Use Case**: Display unread message badge in UI

### Delete User Message

Deletes a message (validates sender).

```typescript
import { deleteUserMessage } from "@/lib/db/queries";

const [deleted] = await deleteUserMessage({
  id: "message-uuid",
  userId: "sender-uuid", // Must be the sender
});
// Returns: UserMessage[]
// Throws: ChatSDKError("unauthorized:database") if not sender
```

**Use Case**: Allow users to delete sent messages

---

## Security Notes

All query functions that modify or delete data include **ownership validation**:

- `updateTodoItem` - Validates `userId` matches todo owner
- `deleteTodoItem` - Validates `userId` matches todo owner
- `deleteStoredFile` - Validates `userId` matches file owner
- `markUserMessageAsRead` - Validates `userId` matches recipient
- `deleteUserMessage` - Validates `userId` matches sender

**Always pass the authenticated user's ID** from the session:

```typescript
import { auth } from "@/app/(auth)/auth";

export async function myServerAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  // Use session.user.id for ownership validation
  await updateTodoItem({
    id: formData.get("todoId") as string,
    userId: session.user.id, // ✅ Correct
    completed: true,
  });
}
```

## Performance Considerations

### Indexed Queries (Fast)
These queries use indexes and will be fast even with large datasets:

- `getChatsByUserIdAndAgentType` - Uses `Chat_userId_agentType_idx`
- `getTodoItemsByUserId` (with `completed` filter) - Uses `TodoItem_userId_completed_idx`
- `getStoredFilesByUserId` - Uses `StoredFile_userId_idx`
- `getConversationMessages` - Uses `UserMessage_senderId_recipientId_idx`

### Pagination
Always use `limit` and `offset` for large result sets:

```typescript
// ✅ Good - Paginated
const todos = await getTodoItemsByUserId({
  userId: "user-uuid",
  limit: 20,
  offset: pageNumber * 20,
});

// ❌ Bad - Could return thousands of records
const todos = await getTodoItemsByUserId({
  userId: "user-uuid",
  // No limit!
});
```

## Error Handling

All queries throw `ChatSDKError` on failure:

```typescript
import { ChatSDKError } from "@/lib/errors";

try {
  await updateTodoItem({
    id: todoId,
    userId: session.user.id,
    completed: true,
  });
} catch (error) {
  if (error instanceof ChatSDKError) {
    if (error.code === "unauthorized:database") {
      return { error: "You don't have permission to update this todo" };
    }
    return { error: error.message };
  }
  return { error: "An unexpected error occurred" };
}
```

## Type Definitions

All return types are exported from `lib/db/schema.ts`:

```typescript
import type {
  AgentType,
  Chat,
  TodoItem,
  StoredFile,
  UserMessage,
} from "@/lib/db/schema";
```

## Related Documentation

- **Migration Guide**: `lib/db/migrations/0008_README.md`
- **Application Instructions**: `MIGRATION_0008_INSTRUCTIONS.md`
- **Schema Reference**: `lib/db/schema.ts`
- **Drizzle ORM Docs**: https://orm.drizzle.team/

import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  type SQL,
  sql,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { ArtifactKind } from "@/components/artifact";
import type { VisibilityType } from "@/components/visibility-selector";
import { ChatSDKError } from "../errors";
import type { AppUsage } from "../usage";
import { generateUUID } from "../utils";
import {
  agentType,
  type Chat,
  chat,
  type DBMessage,
  document,
  message,
  type Suggestion,
  storedFile,
  stream,
  suggestion,
  todoItem,
  type User,
  user,
  userMessage,
  vote,
} from "./schema";
import { generateHashedPassword } from "./utils";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getUser(email: string): Promise<User[]> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user by email"
    );
  }
}

export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);

  try {
    return await db.insert(user).values({ email, password: hashedPassword });
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to create user");
  }
}

/**
 * @deprecated Guest users are no longer created automatically.
 * This function is kept for backward compatibility with existing data.
 * Do not use in new code.
 */
export async function createGuestUser() {
  const email = `guest-${Date.now()}`;
  const password = generateHashedPassword(generateUUID());

  try {
    return await db.insert(user).values({ email, password }).returning({
      id: user.id,
      email: user.email,
    });
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create guest user"
    );
  }
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility,
    });
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));
    await db.delete(stream).where(eq(stream.chatId, id));

    const [chatsDeleted] = await db
      .delete(chat)
      .where(eq(chat.id, id))
      .returning();
    return chatsDeleted;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete chat by id"
    );
  }
}

export async function deleteAllChatsByUserId({ userId }: { userId: string }) {
  try {
    const userChats = await db
      .select({ id: chat.id })
      .from(chat)
      .where(eq(chat.userId, userId));

    if (userChats.length === 0) {
      return { deletedCount: 0 };
    }

    const chatIds = userChats.map((c) => c.id);

    await db.delete(vote).where(inArray(vote.chatId, chatIds));
    await db.delete(message).where(inArray(message.chatId, chatIds));
    await db.delete(stream).where(inArray(stream.chatId, chatIds));

    const deletedChats = await db
      .delete(chat)
      .where(eq(chat.userId, userId))
      .returning();

    return { deletedCount: deletedChats.length };
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete all chats by user id"
    );
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;

    const query = (whereCondition?: SQL<any>) =>
      db
        .select()
        .from(chat)
        .where(
          whereCondition
            ? and(whereCondition, eq(chat.userId, id))
            : eq(chat.userId, id)
        )
        .orderBy(desc(chat.createdAt))
        .limit(extendedLimit);

    let filteredChats: Chat[] = [];

    if (startingAfter) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, startingAfter))
        .limit(1);

      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${startingAfter} not found`
        );
      }

      filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
    } else if (endingBefore) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, endingBefore))
        .limit(1);

      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${endingBefore} not found`
        );
      }

      filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get chats by user id"
    );
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    if (!selectedChat) {
      return null;
    }

    return selectedChat;
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  }
}

export async function saveMessages({ messages }: { messages: DBMessage[] }) {
  try {
    return await db.insert(message).values(messages);
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to save messages");
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get messages by chat id"
    );
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === "up" })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === "up",
    });
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to vote message");
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get votes by chat id"
    );
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    return await db
      .insert(document)
      .values({
        id,
        title,
        kind,
        content,
        userId,
        createdAt: new Date(),
      })
      .returning();
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to save document");
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get documents by id"
    );
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get document by id"
    );
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp)
        )
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)))
      .returning();
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete documents by id after timestamp"
    );
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Suggestion[];
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to save suggestions"
    );
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get suggestions by document id"
    );
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message by id"
    );
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp))
      );

    const messageIds = messagesToDelete.map(
      (currentMessage) => currentMessage.id
    );

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(
          and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds))
        );

      return await db
        .delete(message)
        .where(
          and(eq(message.chatId, chatId), inArray(message.id, messageIds))
        );
    }
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete messages by chat id after timestamp"
    );
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat visibility by id"
    );
  }
}

export async function updateChatLastContextById({
  chatId,
  context,
}: {
  chatId: string;
  // Store merged server-enriched usage object
  context: AppUsage;
}) {
  try {
    return await db
      .update(chat)
      .set({ lastContext: context })
      .where(eq(chat.id, chatId));
  } catch (error) {
    console.warn("Failed to update lastContext for chat", chatId, error);
    return;
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - differenceInHours * 60 * 60 * 1000
    );

    const [stats] = await db
      .select({ count: count(message.id) })
      .from(message)
      .innerJoin(chat, eq(message.chatId, chat.id))
      .where(
        and(
          eq(chat.userId, id),
          gte(message.createdAt, twentyFourHoursAgo),
          eq(message.role, "user")
        )
      )
      .execute();

    return stats?.count ?? 0;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message count by user id"
    );
  }
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  try {
    await db
      .insert(stream)
      .values({ id: streamId, chatId, createdAt: new Date() });
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create stream id"
    );
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const streamIds = await db
      .select({ id: stream.id })
      .from(stream)
      .where(eq(stream.chatId, chatId))
      .orderBy(asc(stream.createdAt))
      .execute();

    return streamIds.map(({ id }) => id);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get stream ids by chat id"
    );
  }
}

export async function getDocumentsByUserId({ userId }: { userId: string }) {
  try {
    return await db
      .select()
      .from(document)
      .where(eq(document.userId, userId))
      .orderBy(desc(document.createdAt));
  } catch (_error) {
    console.error("Failed to get documents by user ID", _error);
    return [];
  }
}

export async function getTotalMessageCountByUserId({
  userId,
}: {
  userId: string;
}) {
  try {
    const chats = await db
      .select({ id: chat.id })
      .from(chat)
      .where(eq(chat.userId, userId));

    if (chats.length === 0) {
      return 0;
    }

    const chatIds = chats.map((c) => c.id);
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(message)
      .where(inArray(message.chatId, chatIds));

    return Number(result[0]?.count ?? 0);
  } catch (_error) {
    console.error("Failed to get total message count by user ID", _error);
    return 0;
  }
}

// =============================================================================
// Agent Type Queries
// =============================================================================

export async function getActiveAgentTypes() {
  try {
    return await db
      .select()
      .from(agentType)
      .where(eq(agentType.isActive, true))
      .orderBy(asc(agentType.name));
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get active agent types"
    );
  }
}

export async function getAgentTypeById({ id }: { id: string }) {
  try {
    const [selectedAgentType] = await db
      .select()
      .from(agentType)
      .where(eq(agentType.id, id));

    return selectedAgentType ?? null;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get agent type by id"
    );
  }
}

// =============================================================================
// Chat Queries with Agent Type Support
// =============================================================================

export async function saveChatWithAgentType({
  id,
  userId,
  title,
  visibility,
  agentType: agentTypeId,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
  agentType?: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility,
      agentType: agentTypeId ?? "chat-general",
    });
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to save chat with agent type"
    );
  }
}

export async function getChatsByUserIdAndAgentType({
  userId,
  agentType: agentTypeId,
  limit = 50,
}: {
  userId: string;
  agentType: string;
  limit?: number;
}) {
  try {
    return await db
      .select()
      .from(chat)
      .where(and(eq(chat.userId, userId), eq(chat.agentType, agentTypeId)))
      .orderBy(desc(chat.createdAt))
      .limit(limit);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get chats by user id and agent type"
    );
  }
}

export async function updateChatAgentType({
  chatId,
  agentType: agentTypeId,
}: {
  chatId: string;
  agentType: string;
}) {
  try {
    return await db
      .update(chat)
      .set({ agentType: agentTypeId })
      .where(eq(chat.id, chatId));
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat agent type"
    );
  }
}

// =============================================================================
// Todo Item Queries
// =============================================================================

export async function createTodoItem({
  userId,
  title,
  description,
  priority = "medium",
  dueDate,
}: {
  userId: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
}) {
  try {
    return await db
      .insert(todoItem)
      .values({
        userId,
        title,
        description,
        priority,
        dueDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create todo item"
    );
  }
}

export async function getTodoItemsByUserId({
  userId,
  completed,
  limit = 50,
  offset = 0,
}: {
  userId: string;
  completed?: boolean;
  limit?: number;
  offset?: number;
}) {
  try {
    const whereCondition =
      completed !== undefined
        ? and(eq(todoItem.userId, userId), eq(todoItem.completed, completed))
        : eq(todoItem.userId, userId);

    return await db
      .select()
      .from(todoItem)
      .where(whereCondition)
      .orderBy(desc(todoItem.createdAt))
      .limit(limit)
      .offset(offset);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get todo items by user id"
    );
  }
}

export async function updateTodoItem({
  id,
  userId,
  title,
  description,
  completed,
  priority,
  dueDate,
}: {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
}) {
  try {
    // Verify ownership
    const [existing] = await db
      .select()
      .from(todoItem)
      .where(eq(todoItem.id, id));

    if (!existing || existing.userId !== userId) {
      throw new ChatSDKError("unauthorized:database", "Unauthorized");
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      updates.title = title;
    }
    if (description !== undefined) {
      updates.description = description;
    }
    if (completed !== undefined) {
      updates.completed = completed;
    }
    if (priority !== undefined) {
      updates.priority = priority;
    }
    if (dueDate !== undefined) {
      updates.dueDate = dueDate;
    }

    return await db
      .update(todoItem)
      .set(updates)
      .where(eq(todoItem.id, id))
      .returning();
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update todo item"
    );
  }
}

export async function deleteTodoItem({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    // Verify ownership
    const [existing] = await db
      .select()
      .from(todoItem)
      .where(eq(todoItem.id, id));

    if (!existing || existing.userId !== userId) {
      throw new ChatSDKError("unauthorized:database", "Unauthorized");
    }

    return await db.delete(todoItem).where(eq(todoItem.id, id)).returning();
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete todo item"
    );
  }
}

// =============================================================================
// Stored File Queries
// =============================================================================

export async function createStoredFile({
  userId,
  fileName,
  fileSize,
  fileType,
  fileUrl,
}: {
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}) {
  try {
    return await db
      .insert(storedFile)
      .values({
        userId,
        fileName,
        fileSize,
        fileType,
        fileUrl,
        uploadedAt: new Date(),
      })
      .returning();
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create stored file"
    );
  }
}

export async function getStoredFilesByUserId({
  userId,
  limit = 50,
  offset = 0,
}: {
  userId: string;
  limit?: number;
  offset?: number;
}) {
  try {
    return await db
      .select()
      .from(storedFile)
      .where(eq(storedFile.userId, userId))
      .orderBy(desc(storedFile.uploadedAt))
      .limit(limit)
      .offset(offset);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get stored files by user id"
    );
  }
}

export async function getStoredFileById({ id }: { id: string }) {
  try {
    const [file] = await db
      .select()
      .from(storedFile)
      .where(eq(storedFile.id, id));

    return file ?? null;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get stored file by id"
    );
  }
}

export async function deleteStoredFile({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    // Verify ownership
    const [existing] = await db
      .select()
      .from(storedFile)
      .where(eq(storedFile.id, id));

    if (!existing || existing.userId !== userId) {
      throw new ChatSDKError("unauthorized:database", "Unauthorized");
    }

    return await db.delete(storedFile).where(eq(storedFile.id, id)).returning();
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete stored file"
    );
  }
}

// =============================================================================
// User Message Queries
// =============================================================================

export async function createUserMessage({
  senderId,
  recipientId,
  content,
  attachments,
}: {
  senderId: string;
  recipientId: string;
  content: string;
  attachments?: unknown;
}) {
  try {
    return await db
      .insert(userMessage)
      .values({
        senderId,
        recipientId,
        content,
        attachments,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create user message"
    );
  }
}

export async function getConversationMessages({
  userId1,
  userId2,
  limit = 50,
  offset = 0,
}: {
  userId1: string;
  userId2: string;
  limit?: number;
  offset?: number;
}) {
  try {
    return await db
      .select()
      .from(userMessage)
      .where(
        and(
          eq(userMessage.senderId, userId1),
          eq(userMessage.recipientId, userId2)
        )
      )
      .orderBy(desc(userMessage.createdAt))
      .limit(limit)
      .offset(offset);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get conversation messages"
    );
  }
}

export async function markUserMessageAsRead({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    // Verify the user is the recipient
    const [existing] = await db
      .select()
      .from(userMessage)
      .where(eq(userMessage.id, id));

    if (!existing || existing.recipientId !== userId) {
      throw new ChatSDKError("unauthorized:database", "Unauthorized");
    }

    return await db
      .update(userMessage)
      .set({ isRead: true, updatedAt: new Date() })
      .where(eq(userMessage.id, id))
      .returning();
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to mark user message as read"
    );
  }
}

export async function getUnreadMessageCount({ userId }: { userId: string }) {
  try {
    const [result] = await db
      .select({ count: count(userMessage.id) })
      .from(userMessage)
      .where(
        and(eq(userMessage.recipientId, userId), eq(userMessage.isRead, false))
      );

    return result?.count ?? 0;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get unread message count"
    );
  }
}

export async function deleteUserMessage({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    // Verify the user is the sender
    const [existing] = await db
      .select()
      .from(userMessage)
      .where(eq(userMessage.id, id));

    if (!existing || existing.senderId !== userId) {
      throw new ChatSDKError("unauthorized:database", "Unauthorized");
    }

    return await db
      .delete(userMessage)
      .where(eq(userMessage.id, id))
      .returning();
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete user message"
    );
  }
}

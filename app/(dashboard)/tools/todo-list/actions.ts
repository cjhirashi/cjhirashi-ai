"use server";

import { auth } from "@/app/(auth)/auth";
import {
  createTodoItem,
  deleteTodoItem,
  getTodoItemsByUserId,
  updateTodoItem,
} from "@/lib/db/queries";
import type { TodoItem } from "@/lib/db/schema";
import { ChatSDKError } from "@/lib/errors";

export async function getServerTodos({
  completed,
  limit = 50,
  offset = 0,
}: {
  completed?: boolean;
  limit?: number;
  offset?: number;
} = {}): Promise<TodoItem[]> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ChatSDKError("unauthorized:database", "Not authenticated");
    }

    return await getTodoItemsByUserId({
      userId: session.user.id,
      completed,
      limit,
      offset,
    });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      throw error;
    }
    throw new ChatSDKError("bad_request:database", "Failed to fetch todos");
  }
}

export async function createServerTodo({
  title,
  description,
  priority = "medium",
  dueDate,
}: {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
}): Promise<TodoItem[]> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ChatSDKError("unauthorized:database", "Not authenticated");
    }

    if (!title.trim()) {
      throw new ChatSDKError("bad_request:api", "Title is required");
    }

    return await createTodoItem({
      userId: session.user.id,
      title: title.trim(),
      description: description?.trim(),
      priority,
      dueDate,
    });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      throw error;
    }
    throw new ChatSDKError("bad_request:database", "Failed to create todo");
  }
}

export async function updateServerTodo({
  id,
  title,
  description,
  completed,
  priority,
  dueDate,
}: {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
}): Promise<TodoItem[]> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ChatSDKError("unauthorized:database", "Not authenticated");
    }

    return await updateTodoItem({
      id,
      userId: session.user.id,
      title,
      description,
      completed,
      priority,
      dueDate,
    });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      throw error;
    }
    throw new ChatSDKError("bad_request:database", "Failed to update todo");
  }
}

export async function deleteServerTodo({
  id,
}: {
  id: string;
}): Promise<TodoItem[]> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ChatSDKError("unauthorized:database", "Not authenticated");
    }

    return await deleteTodoItem({
      id,
      userId: session.user.id,
    });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      throw error;
    }
    throw new ChatSDKError("bad_request:database", "Failed to delete todo");
  }
}

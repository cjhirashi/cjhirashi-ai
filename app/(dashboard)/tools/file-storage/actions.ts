"use server";

import { auth } from "@/app/(auth)/auth";
import {
  createStoredFile,
  deleteStoredFile,
  getStoredFileById,
  getStoredFilesByUserId,
} from "@/lib/db/queries";
import type { StoredFile } from "@/lib/db/schema";
import { ChatSDKError } from "@/lib/errors";

export async function getServerFiles({
  limit = 50,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}): Promise<StoredFile[]> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ChatSDKError("unauthorized:database", "Not authenticated");
    }

    return await getStoredFilesByUserId({
      userId: session.user.id,
      limit,
      offset,
    });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      throw error;
    }
    throw new ChatSDKError("bad_request:database", "Failed to fetch files");
  }
}

export async function uploadServerFile({
  fileName,
  fileSize,
  fileType,
  fileUrl,
}: {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}): Promise<StoredFile> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ChatSDKError("unauthorized:database", "Not authenticated");
    }

    if (!fileName.trim()) {
      throw new ChatSDKError("bad_request:api", "File name is required");
    }

    if (fileSize <= 0) {
      throw new ChatSDKError("bad_request:api", "Invalid file size");
    }

    if (!fileUrl.trim()) {
      throw new ChatSDKError("bad_request:api", "File URL is required");
    }

    const [result] = await createStoredFile({
      userId: session.user.id,
      fileName: fileName.trim(),
      fileSize,
      fileType: fileType.trim(),
      fileUrl: fileUrl.trim(),
    });

    if (!result) {
      throw new ChatSDKError(
        "bad_request:database",
        "Failed to save file metadata"
      );
    }

    return result;
  } catch (error) {
    if (error instanceof ChatSDKError) {
      throw error;
    }
    throw new ChatSDKError("bad_request:database", "Failed to upload file");
  }
}

export async function deleteServerFile({
  id,
}: {
  id: string;
}): Promise<StoredFile> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new ChatSDKError("unauthorized:database", "Not authenticated");
    }

    // Verify file exists and belongs to user
    const file = await getStoredFileById({ id });

    if (!file) {
      throw new ChatSDKError("bad_request:database", "File not found");
    }

    if (file.userId !== session.user.id) {
      throw new ChatSDKError("unauthorized:database", "Unauthorized");
    }

    const [result] = await deleteStoredFile({
      id,
      userId: session.user.id,
    });

    if (!result) {
      throw new ChatSDKError("bad_request:database", "Failed to delete file");
    }

    return result;
  } catch (error) {
    if (error instanceof ChatSDKError) {
      throw error;
    }
    throw new ChatSDKError("bad_request:database", "Failed to delete file");
  }
}

import { geolocation } from "@vercel/functions";
import type { ChatMessage as UIChatMessage } from "ai";
import { auth, type UserType } from "@/app/(auth)/auth";
import { generateTitleFromUserMessage } from "@/app/(dashboard)/actions";
import type { VisibilityType } from "@/components/visibility-selector";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import type { ChatModel } from "@/lib/ai/models";
import { type RequestHints } from "@/lib/ai/prompts";
import { createChatStream } from "@/lib/ai/stream-handler";
import {
  createStreamId,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
  updateChatLastContextById,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";
import type { AppUsage } from "@/lib/usage";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import { type PostRequestBody, postRequestBodySchema } from "./schema";

export const maxDuration = 60;

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  try {
    const {
      id,
      message,
      selectedChatModel,
      selectedVisibilityType,
    }: {
      id: string;
      message: ChatMessage;
      selectedChatModel: ChatModel["id"];
      selectedVisibilityType: VisibilityType;
    } = requestBody;

    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const userType: UserType = session.user.type;

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
      return new ChatSDKError("rate_limit:chat").toResponse();
    }

    const chat = await getChatById({ id });

    if (chat) {
      if (chat.userId !== session.user.id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }
    } else {
      const title = await generateTitleFromUserMessage({
        message,
      });

      await saveChat({
        id,
        userId: session.user.id,
        title,
        visibility: selectedVisibilityType,
      });
    }

    const messagesFromDb = await getMessagesByChatId({ id });
    const uiMessages = [...convertToUIMessages(messagesFromDb), message];

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: "user",
          parts: message.parts,
          attachments: [],
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

    // Use stream handler for consistent chat streaming behavior
    return await createChatStream({
      chatId: id,
      streamId,
      selectedChatModel,
      uiMessages,
      session,
      requestHints,
      agentType: "multi-tools",
      onSaveMessages: async (messages: UIChatMessage[]) => {
        await saveMessages({
          messages: messages.map((currentMessage) => ({
            id: currentMessage.id,
            role: currentMessage.role as "user" | "assistant",
            parts: currentMessage.content || [],
            createdAt: new Date(),
            attachments: [],
            chatId: id,
          })),
        });
      },
      onUpdateChatContext: async (context: AppUsage) => {
        await updateChatLastContextById({
          chatId: id,
          context,
        });
      },
    });
  } catch (error) {
    const vercelId = request.headers.get("x-vercel-id");

    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    // Check for Vercel AI Gateway credit card error
    if (
      error instanceof Error &&
      error.message?.includes(
        "AI Gateway requires a valid credit card on file to service requests"
      )
    ) {
      return new ChatSDKError("offline:chat").toResponse();
    }

    console.error(
      `Error in multi-tools chat stream (vercel-id: ${vercelId}):`,
      error
    );
    return new ChatSDKError("bad_request:api").toResponse();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  try {
    const chat = await getChatById({ id });

    if (!chat) {
      return new ChatSDKError("bad_request:api").toResponse();
    }

    if (chat.userId !== session.user.id) {
      return new ChatSDKError("forbidden:chat").toResponse();
    }

    // Note: actual deletion would be implemented in DB layer
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}

import type { UIMessageStreamWriter } from "ai";
import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
import { unstable_cache as cache } from "next/cache";
import { after } from "next/server";
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from "resumable-stream";
import type { ModelCatalog } from "tokenlens/core";
import { fetchModels } from "tokenlens/fetch";
import { getUsage } from "tokenlens/helpers";
import type { Session } from "next-auth";
import { type RequestHints, systemPrompt } from "@/lib/ai/prompts";
import { getToolsConfig } from "@/lib/ai/tools-factory";
import type { AgentType } from "@/lib/ai/tools-factory";
import { myProvider } from "@/lib/ai/providers";
import { isProductionEnvironment } from "@/lib/constants";
import { updateChatLastContextById } from "@/lib/db/queries";
import type { ChatMessage } from "@/lib/types";
import type { AppUsage } from "@/lib/usage";
import { generateUUID } from "@/lib/utils";

let globalStreamContext: ResumableStreamContext | null = null;

const getTokenlensCatalog = cache(
  async (): Promise<ModelCatalog | undefined> => {
    try {
      return await fetchModels();
    } catch (err) {
      console.warn(
        "TokenLens: catalog fetch failed, using default catalog",
        err
      );
      return; // tokenlens helpers will fall back to defaultCatalog
    }
  },
  ["tokenlens-catalog"],
  { revalidate: 24 * 60 * 60 } // 24 hours
);

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      });
    } catch (error: any) {
      if (error.message.includes("REDIS_URL")) {
        console.log(
          " > Resumable streams are disabled due to missing REDIS_URL"
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export interface StreamHandlerOptions {
  chatId: string;
  streamId: string;
  selectedChatModel: string;
  uiMessages: ChatMessage[];
  session: Session;
  requestHints: RequestHints;
  agentType: AgentType;
  onSaveMessages: (messages: ChatMessage[]) => Promise<void>;
  onUpdateChatContext: (context: AppUsage) => Promise<void>;
}

/**
 * Creates a streaming response for chat messages
 * Handles tool configuration based on agent type
 * Manages token usage tracking and message persistence
 */
export async function createChatStream(
  options: StreamHandlerOptions
): Promise<Response> {
  const {
    chatId,
    streamId,
    selectedChatModel,
    uiMessages,
    session,
    requestHints,
    agentType,
    onSaveMessages,
    onUpdateChatContext,
  } = options;

  let finalMergedUsage: AppUsage | undefined;

  // Get tools configuration based on agent type
  const toolsConfig = getToolsConfig(agentType, session, null as any);
  const activeTools =
    selectedChatModel === "chat-model-reasoning"
      ? []
      : toolsConfig.activeTools;

  const stream = createUIMessageStream({
    execute: ({ writer: dataStream }) => {
      // Reinitialize tools with dataStream
      const tools = getToolsConfig(agentType, session, dataStream).tools;

      const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        system: systemPrompt({
          selectedChatModel,
          requestHints,
          agentType,
        }),
        messages: convertToModelMessages(uiMessages),
        stopWhen: stepCountIs(5),
        experimental_activeTools: activeTools,
        experimental_transform: smoothStream({ chunking: "word" }),
        tools,
        experimental_telemetry: {
          isEnabled: isProductionEnvironment,
          functionId: "stream-text",
        },
        onFinish: async ({ usage }) => {
          try {
            const providers = await getTokenlensCatalog();
            const modelId =
              myProvider.languageModel(selectedChatModel).modelId;
            if (!modelId) {
              finalMergedUsage = usage;
              dataStream.write({
                type: "data-usage",
                data: finalMergedUsage,
              });
              return;
            }

            if (!providers) {
              finalMergedUsage = usage;
              dataStream.write({
                type: "data-usage",
                data: finalMergedUsage,
              });
              return;
            }

            const summary = getUsage({ modelId, usage, providers });
            finalMergedUsage = { ...usage, ...summary, modelId } as AppUsage;
            dataStream.write({ type: "data-usage", data: finalMergedUsage });
          } catch (err) {
            console.warn("TokenLens enrichment failed", err);
            finalMergedUsage = usage;
            dataStream.write({ type: "data-usage", data: finalMergedUsage });
          }
        },
      });

      result.consumeStream();

      dataStream.merge(
        result.toUIMessageStream({
          sendReasoning: true,
        })
      );
    },
    generateId: generateUUID,
    onFinish: async ({ messages }) => {
      await onSaveMessages(messages);

      if (finalMergedUsage) {
        try {
          await onUpdateChatContext(finalMergedUsage);
        } catch (err) {
          console.warn("Unable to persist last usage for chat", chatId, err);
        }
      }
    },
    onError: () => {
      return "Oops, an error occurred!";
    },
  });

  const streamContext = getStreamContext();

  if (streamContext) {
    return new Response(
      await streamContext.resumableStream(streamId, () =>
        stream.pipeThrough(new JsonToSseTransformStream())
      )
    );
  }

  return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
}

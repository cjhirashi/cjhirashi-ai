import type { UIMessageStreamWriter } from "ai";
import type { Session } from "next-auth";
import { calculator } from "@/lib/ai/tools/calculator";
import { createDocument } from "@/lib/ai/tools/create-document";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
import { unitConverter } from "@/lib/ai/tools/unit-converter";
import { updateDocument } from "@/lib/ai/tools/update-document";
import { webSearch } from "@/lib/ai/tools/web-search";
import type { ChatMessage } from "@/lib/types";

export type AgentType = "chat-general" | "multi-tools";

export type ToolsConfig = {
  tools: Record<string, unknown>;
  activeTools: string[];
};

/**
 * Factory function to get the appropriate tools configuration based on agent type
 * Enables easy extension with new tool combinations for different agent types
 */
export function getToolsConfig(
  agentType: AgentType,
  session: Session,
  dataStream: UIMessageStreamWriter<ChatMessage>
): ToolsConfig {
  // Base tools available to all agents
  const baseTools = {
    getWeather,
    createDocument: createDocument({ session, dataStream }),
    updateDocument: updateDocument({ session, dataStream }),
    requestSuggestions: requestSuggestions({ session, dataStream }),
  };

  // Multi-tools agent extends base tools with additional utilities
  const multiToolsExtended = {
    ...baseTools,
    calculator,
    unitConverter,
    webSearch,
  };

  const configs: Record<AgentType, ToolsConfig> = {
    "chat-general": {
      tools: baseTools,
      activeTools: ["getWeather", "createDocument", "updateDocument", "requestSuggestions"],
    },
    "multi-tools": {
      tools: multiToolsExtended,
      activeTools: [
        "getWeather",
        "createDocument",
        "updateDocument",
        "requestSuggestions",
        "calculator",
        "unitConverter",
        "webSearch",
      ],
    },
  };

  return configs[agentType];
}

/**
 * Get active tools for a specific model within an agent type
 * Some models may have restrictions (e.g., reasoning model doesn't use tools)
 */
export function getActiveTools(
  agentType: AgentType,
  selectedModel: string
): string[] {
  const config = getToolsConfig(agentType, null as any, null as any);

  // Reasoning model doesn't use tools
  if (selectedModel === "chat-model-reasoning") {
    return [];
  }

  return config.activeTools;
}

# Multi-Tools Agent API Documentation

## Overview

The Multi-Tools Agent is an enhanced AI chat interface that extends the standard chat-general agent with additional utility tools for calculations, unit conversions, and web searches. It provides a comprehensive toolkit for users to interact with the AI across multiple use cases.

## Architecture

### Tools Configuration

The Multi-Tools Agent uses a factory pattern to manage tools based on agent type. This allows:
- Easy addition of new tools
- Clean separation of concerns
- Reusable tool factories for different agent types

#### Available Tools

1. **getWeather** - Fetches current weather information
   - Input: City name or coordinates (latitude/longitude)
   - Output: Temperature, humidity, forecast data
   - Uses: Open-Meteo API (free, no authentication required)

2. **createDocument** - Generates new artifacts (code, text, images, spreadsheets)
   - Input: Document title and kind (text, code, image, sheet)
   - Output: Document ID and initial content
   - Integration: Vercel Blob storage for artifacts

3. **updateDocument** - Modifies existing artifacts
   - Input: Document ID, updated content
   - Output: Updated document with versioning
   - Behavior: Stores document versions with timestamps

4. **requestSuggestions** - Proposes edits with diff tracking
   - Input: Document ID, suggestion prompt
   - Output: Edit suggestions with original/suggested text
   - Storage: Suggestion tracking in database

5. **calculator** - Mathematical expression evaluator
   - Input: Mathematical expression string
   - Output: Calculated result
   - Supported Operations: +, -, *, /, %, ^ (exponentiation)
   - Security: Safe evaluation with input validation

6. **unitConverter** - Unit measurement conversions
   - Input: Value, fromUnit, toUnit
   - Output: Converted value with symbols
   - Supported Categories:
     - Length: mm, cm, m, km, inch, foot, yard, mile
     - Weight: mg, g, kg, oz, lb, ton
     - Volume: ml, l, gallon-us, gallon-uk, cup-us, fl-oz-us
     - Temperature: C, F, K
     - Time: ms, s, min, h, d, w, month, y

7. **webSearch** - Web search results
   - Input: Search query string
   - Output: Title, URL, and snippet for each result
   - Note: Currently uses mock data; can be integrated with SerpAPI, Tavily, or Google Search API

## API Endpoints

### POST /api/agents/multi-tools/chat

Streaming chat endpoint with multi-tools support.

**Request Body:**
```typescript
{
  id: string (uuid);                           // Chat ID
  message: {
    id: string (uuid);                         // Message ID
    role: "user";
    parts: Array<{
      type: "text" | "file";
      text?: string;                           // For text parts
      mediaType?: "image/jpeg" | "image/png";  // For file parts
      name?: string;                           // For file parts
      url?: string;                            // For file parts
    }>;
  };
  selectedChatModel: "chat-model" | "chat-model-reasoning";
  selectedVisibilityType: "public" | "private";
  agentType: "multi-tools";
}
```

**Response:**
Server-Sent Events (SSE) stream with:
- Streaming text content
- Tool call notifications
- Data messages (usage, artifacts, etc.)
- Final message completion

**Tool Usage in Response:**
The response may include tool invocations:
```json
{
  "type": "tool-call",
  "toolName": "calculator",
  "args": { "expression": "2 + 2" }
}
```

### GET /api/agents/multi-tools/document

Retrieve artifact documents.

**Query Parameters:**
- `id` (string, required): Document ID

**Response:**
```json
[
  {
    id: string;
    kind: "text" | "code" | "image" | "sheet";
    content: string;
    createdAt: Date;
    userId: string;
  }
]
```

### POST /api/agents/multi-tools/document

Save or update document artifacts.

**Query Parameters:**
- `id` (string, required): Document ID

**Request Body:**
```json
{
  "kind": "text" | "code" | "image" | "sheet",
  "content": "document content"
}
```

### GET /api/agents/multi-tools/history

Retrieve chat history with pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Results per page (default: 20)

**Response:**
```json
{
  "chats": [
    {
      id: string;
      title: string;
      createdAt: Date;
      messageCount: number;
      visibility: "public" | "private";
    }
  ],
  "pagination": {
    page: number;
    limit: number;
    total: number;
  }
}
```

### POST /api/agents/multi-tools/vote

Vote on messages (upvote/downvote).

**Request Body:**
```json
{
  "chatId": "uuid",
  "messageId": "uuid",
  "type": "upvote" | "downvote"
}
```

### POST /api/agents/multi-tools/suggestions

Get edit suggestions for documents.

**Request Body:**
```json
{
  "documentId": "uuid",
  "prompt": "Improve this text by...",
  "kind": "text" | "code"
}
```

**Response:**
```json
{
  "suggestions": [
    {
      originalText: string;
      suggestedText: string;
      explanation: string;
    }
  ]
}
```

### POST /api/agents/multi-tools/files/upload

Upload files to Blob storage.

**Content-Type:** multipart/form-data

**Form Fields:**
- `file` (File, required): File to upload

**Response:**
```json
{
  "url": "https://vercel-blob-url/...",
  "pathname": "/...",
  "size": 1024
}
```

## Implementation Details

### Tool Factory Pattern

Located in `lib/ai/tools-factory.ts`:
```typescript
getToolsConfig(agentType: "chat-general" | "multi-tools", session, dataStream)
  -> { tools: Record<string, unknown>, activeTools: string[] }
```

This factory:
- Returns appropriate tool set for agent type
- Initializes tools with session and dataStream context
- Provides active tool names for model configuration

### Stream Handler

Located in `lib/ai/stream-handler.ts`:
```typescript
createChatStream(options: StreamHandlerOptions): Promise<Response>
```

Handles:
- Tool configuration based on agent type
- Message streaming via SSE
- Token usage tracking with TokenLens
- Message persistence to database
- Error handling and fallbacks

### System Prompt

Enhanced system prompt in `lib/ai/prompts.ts`:
- Base artifact guidance (same as chat-general)
- Multi-tools specific instructions
- Tool usage guidelines
- Context about available tools

## Component Integration

### Chat Component

File: `components/chat.tsx`

Props:
```typescript
interface ChatProps {
  agentType?: "chat-general" | "multi-tools";  // Determines API endpoint
  // ... other props
}
```

Behavior:
- Dynamically routes to `/api/agents/{agentType}/chat`
- Passes `agentType` in request body
- Otherwise identical to chat-general interface

## Database Schema

Multi-Tools Agent reuses the existing schema:
- `Chat` table: Conversation metadata
- `Message_v2` table: Message content with parts
- `Document` table: Generated artifacts
- `Suggestion` table: Edit suggestions
- `Vote_v2` table: Message votes

No schema migrations required.

## Error Handling

Standard error codes:
- `bad_request:api` - Invalid request parameters
- `unauthorized:chat` - No valid session
- `forbidden:chat` - User lacks permission
- `rate_limit:chat` - Daily message limit exceeded
- `offline:chat` - External service unavailable

Tool errors are handled gracefully:
- Tool execution failures don't crash the stream
- Error messages are returned to the user
- Stream continues to completion

## Performance Considerations

### Tool Execution

1. **Calculator** - O(1) with expression parsing
2. **Unit Converter** - O(1) table lookups
3. **Web Search** - O(n) where n = number of results (capped at 10)
4. **getWeather** - External API call (~200-500ms)
5. **Document operations** - Database write with blob storage

### Rate Limiting

- Guest users: 25 messages/day
- Regular users: 1000 messages/day
- Tool calls don't consume additional quota (included in message count)

### Pagination

- Chat history: 20 results per page
- Document versions: All versions returned by default
- Web search results: Limited to 10 results

## Security Considerations

### Input Validation

- All inputs validated via Zod schemas
- Expression parsing in calculator prevents code injection
- Unit converter validates unit names against whitelist
- File uploads scanned via Vercel Blob

### Authorization

- All endpoints require valid session
- User must own chat to read/write
- Document access tied to creating user

### Tool-Specific Security

**Calculator:**
- Only allows mathematical operators (+, -, *, /, %, ^)
- Rejects function calls and variable access
- Uses Function constructor with strict validation

**Unit Converter:**
- Validates unit names from predefined table
- Prevents numeric overflow with finite checks
- Supports standard conversion units only

**Web Search:**
- Limits query length to 200 characters
- Results capped at 10 items
- No sensitive data exposure

## Integration Guide

### Adding a New Tool

1. Create tool file: `lib/ai/tools/my-tool.ts`
```typescript
import { tool } from "ai";
import { z } from "zod";

export const myTool = tool({
  description: "Tool description",
  inputSchema: z.object({ /* schema */ }),
  execute: async (input) => { /* implementation */ }
});
```

2. Add to factory in `lib/ai/tools-factory.ts`:
```typescript
const multiToolsExtended = {
  ...baseTools,
  myTool,  // Add here
};
```

3. Add tool name to active tools:
```typescript
activeTools: [
  // ... existing tools
  "myTool"
]
```

### Custom Agent Types

Extend the factory to support new agent types:
```typescript
type AgentType = "chat-general" | "multi-tools" | "my-custom-agent";

const configs: Record<AgentType, ToolsConfig> = {
  // ... existing configs
  "my-custom-agent": {
    tools: { /* custom tool set */ },
    activeTools: [ /* custom active tools */ ]
  }
};
```

## Testing

### Manual Testing

1. Navigate to `/dashboard/agents/multi-tools`
2. Start a new chat
3. Try these prompts:
   - "What is 2 + 2 * 3?" (uses calculator)
   - "Convert 100 km to miles" (uses unitConverter)
   - "Create a Python script that..." (uses createDocument)
   - "Get current weather in London" (uses getWeather)

### Tool-Specific Tests

**Calculator:**
- Basic math: "2 + 2" → 4
- Order of operations: "2 + 3 * 4" → 14
- Exponentiation: "2^10" → 1024
- Error handling: "invalid expression" → error

**Unit Converter:**
- Distance: "5 km in miles" → 3.106856...
- Weight: "150 lb in kg" → 68.0388...
- Temperature: "32 F in C" → 0
- Error on mismatch: "5 km in kg" → error

**Web Search:**
- Common queries return structured results
- Results include title, URL, snippet

## Deployment

### Environment Variables

No new environment variables required. Uses existing:
- `AI_GATEWAY_API_KEY` - Vercel AI SDK
- `POSTGRES_URL` - Database
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob
- `REDIS_URL` - Resumable streams (optional)

### Build Process

1. Schema changes: Auto-migrated via `pnpm build`
2. No breaking changes to existing endpoints
3. Backward compatible with chat-general

### Monitoring

Log tool execution errors:
```typescript
console.warn(`Tool execution failed for ${toolName}:`, error);
```

Track tool usage:
- Tool calls appear in message parts
- TokenLens tracks input/output tokens
- Rate limiting counts all message types equally

## Future Enhancements

1. **Real Web Search Integration**
   - SerpAPI or Tavily for actual search results
   - Environment variable for API key
   - Result caching for common queries

2. **Tool Usage Analytics**
   - Track most-used tools per user
   - Performance metrics
   - Error rate monitoring

3. **Advanced Calculator**
   - Variable assignment support
   - Function definitions
   - Graph plotting capabilities

4. **Extended Unit Support**
   - Currency conversion
   - Digital storage units
   - Pressure and density

5. **Custom Tool Creation**
   - User-defined tool templates
   - Integration with user APIs
   - Workflow automation

## Related Files

- `lib/ai/tools/calculator.ts` - Calculator tool implementation
- `lib/ai/tools/unit-converter.ts` - Unit converter implementation
- `lib/ai/tools/web-search.ts` - Web search tool implementation
- `lib/ai/tools-factory.ts` - Tool factory and configuration
- `lib/ai/stream-handler.ts` - Streaming response handler
- `app/api/agents/multi-tools/chat/route.ts` - Main chat endpoint
- `components/chat.tsx` - Chat component with agentType support
- `lib/ai/prompts.ts` - System prompts including multi-tools

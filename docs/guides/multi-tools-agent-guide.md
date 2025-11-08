# Multi-Tools Agent Developer Guide

## Quick Start

### Access Multi-Tools Agent

1. Start development server:
```bash
pnpm dev
```

2. Navigate to:
```
http://localhost:3000/dashboard/agents/multi-tools
```

3. Create a new chat or access existing ones

### Test Each Tool

#### Calculator
```
Ask: "What is 2 + 2?"
Ask: "Calculate (100 * 5) / 2 + 10"
Ask: "What is 2 to the power of 8?"
Ask: "Calculate: 15 % 4"
```

Expected: AI uses calculator tool, returns result

#### Unit Converter
```
Ask: "Convert 100 kilometers to miles"
Ask: "How many ounces in 2 kilograms?"
Ask: "Convert 32 Fahrenheit to Celsius"
Ask: "Change 5 gallons to liters"
```

Expected: AI uses unitConverter tool with accurate conversions

#### Web Search
```
Ask: "Search for information about Python programming"
Ask: "Find weather news"
```

Expected: AI uses webSearch tool, returns results (currently mock data)

#### Document Tools
```
Ask: "Write a Python script to calculate factorials"
Ask: "Update that code to add error handling"
```

Expected: Creates/updates artifacts, streams content

#### Weather Tool
```
Ask: "What's the weather in London?"
Ask: "Get weather for San Francisco"
```

Expected: Uses getWeather tool, returns forecast

## Architecture Overview

### Key Files

#### Tools
- `lib/ai/tools/calculator.ts` - Safe math expression evaluator
- `lib/ai/tools/unit-converter.ts` - Measurement conversions
- `lib/ai/tools/web-search.ts` - Web search (extensible)

#### Configuration
- `lib/ai/tools-factory.ts` - Tool registration and factory
- `lib/ai/stream-handler.ts` - Streaming request handler
- `lib/ai/prompts.ts` - System prompts (multi-tools section)

#### API
- `app/api/agents/multi-tools/chat/route.ts` - Main chat endpoint
- `app/api/agents/multi-tools/chat/schema.ts` - Request validation
- Other endpoints copied from chat-general (document, vote, history, etc.)

#### UI
- `components/chat.tsx` - Modified to support agentType prop
- `app/(dashboard)/agents/multi-tools/page.tsx` - New chat page
- `app/(dashboard)/agents/multi-tools/[id]/page.tsx` - Existing chat page

### Data Flow

1. User types message in Chat component
2. Component detects agentType="multi-tools"
3. Message sent to `/api/agents/multi-tools/chat`
4. API validates request (Zod schema)
5. Checks authentication and rate limits
6. Creates chat/saves user message if new
7. Calls `createChatStream()` with agentType="multi-tools"
8. Stream handler retrieves multi-tools config from factory
9. Calls AI with multi-tools enabled
10. Model decides which tools to use
11. Tools execute (calculator, converter, etc.)
12. Results stream back to client
13. Client displays tool results and AI response
14. Messages and token usage saved to DB

## Adding a New Tool

### Step 1: Create Tool File

Create `lib/ai/tools/my-new-tool.ts`:

```typescript
import { tool } from "ai";
import { z } from "zod";

// Describe the tool
export const myNewTool = tool({
  description: "Clear description of what this tool does",
  inputSchema: z.object({
    param1: z.string().describe("What is param1?"),
    param2: z.number().describe("What is param2?"),
  }),
  execute: async ({ param1, param2 }) => {
    // Validate inputs (optional, Zod already validates schema)
    if (param1.length === 0) {
      return { error: "param1 cannot be empty" };
    }

    try {
      // Do the actual work
      const result = await doSomething(param1, param2);

      // Return success with data
      return {
        success: true,
        result,
        param1,
        param2,
      };
    } catch (error) {
      // Return error gracefully
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
```

### Step 2: Register in Factory

Edit `lib/ai/tools-factory.ts`:

```typescript
import { myNewTool } from "@/lib/ai/tools/my-new-tool";

export function getToolsConfig(
  agentType: AgentType,
  session: Session,
  dataStream: UIMessageStreamWriter<ChatMessage>
): ToolsConfig {
  const multiToolsExtended = {
    ...baseTools,
    calculator,
    unitConverter,
    webSearch,
    myNewTool,  // Add here
  };

  const configs: Record<AgentType, ToolsConfig> = {
    "chat-general": { /* ... */ },
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
        "myNewTool",  // Add here
      ],
    },
  };

  return configs[agentType];
}
```

### Step 3: Test the Tool

```bash
# Run dev server
pnpm dev

# Chat with: "Use my new tool to do [something]"
# Tool should execute and return results
```

### Step 4: Update Documentation

Add to `docs/api/multi-tools-agent.md`:

1. Add tool description in "Available Tools" section
2. Include input/output format
3. Note any dependencies

## Advanced: Tool with External API

If your tool needs an external API:

```typescript
import { tool } from "ai";
import { z } from "zod";

// Use environment variables for API keys
const API_KEY = process.env.MY_TOOL_API_KEY;

export const myApiTool = tool({
  description: "Tool that calls external API",
  inputSchema: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    // Validate API key exists
    if (!API_KEY) {
      return {
        error: "API key not configured",
        success: false,
      };
    }

    try {
      // Add retry logic for external calls
      const response = await fetch("https://api.example.com/endpoint", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        return {
          error: `API error: ${response.statusText}`,
          success: false,
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "API call failed",
        success: false,
      };
    }
  },
});
```

Add to `.env.example`:
```
MY_TOOL_API_KEY=your_api_key_here
```

## Advanced: Tool with Datastream

Some tools need to stream content to the client. Example from createDocument:

```typescript
type CreateDocumentProps = {
  session: Session;
  dataStream: UIMessageStreamWriter<ChatMessage>;
};

export const createDocument = ({ session, dataStream }: CreateDocumentProps) =>
  tool({
    description: "...",
    inputSchema: z.object({ /* ... */ }),
    execute: async ({ title, kind }) => {
      // Send data to client
      dataStream.write({
        type: "data-kind",
        data: kind,
        transient: true,
      });

      // Do work...

      return { id, title, kind };
    },
  });
```

In factory, tools with dataStream are initialized:
```typescript
const tools = getToolsConfig(agentType, session, dataStream).tools;
```

## Testing Tools

### Unit Test Template

Create `tests/tools/my-new-tool.test.ts`:

```typescript
import { myNewTool } from "@/lib/ai/tools/my-new-tool";

describe("myNewTool", () => {
  it("should handle valid input", async () => {
    const result = await myNewTool.execute({
      param1: "test",
      param2: 42,
    });

    expect(result.success).toBe(true);
    expect(result.result).toBeDefined();
  });

  it("should handle invalid input", async () => {
    const result = await myNewTool.execute({
      param1: "",
      param2: -1,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should handle errors gracefully", async () => {
    // Mock error scenario
    const result = await myNewTool.execute({
      param1: "error-trigger",
      param2: 0,
    });

    expect(result.success).toBe(false);
  });
});
```

Run tests:
```bash
pnpm test
```

## Common Issues & Solutions

### Tool Not Appearing in Chat

**Problem:** Tool is registered but AI never calls it

**Causes:**
1. Tool not in `activeTools` array
2. System prompt doesn't mention the tool
3. Tool description is unclear
4. Tool not in `tools` object

**Solution:**
- Check tools-factory.ts
- Review system prompt in prompts.ts
- Ensure tool description is clear and specific
- Verify tool is exported and imported

### Invalid Expression Errors

**Problem:** Tool returns "Invalid characters in expression"

**Cause:** Calculator only allows +, -, *, /, %, ^ operators

**Solution:** AI needs to convert user request to valid expression

**Example:** "What's 5 squared?" → "5^2"

### Unit Conversion Errors

**Problem:** Tool says "Cannot convert between different unit types"

**Cause:** Converting incompatible units (e.g., km to kg)

**Solution:** Check supported categories in unit-converter.ts

**Supported conversions:**
- Length → Length
- Weight → Weight
- Volume → Volume
- Temperature → Temperature
- Time → Time

### External API Timeouts

**Problem:** Tool hangs or times out

**Solution:** Add timeout to fetch calls

```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, { signal: controller.signal });
  // ...
} finally {
  clearTimeout(timeout);
}
```

## Environment Setup

### Required Variables

```bash
# .env or .env.local
AI_GATEWAY_API_KEY=...          # For non-Vercel environments
POSTGRES_URL=...                # PostgreSQL connection
BLOB_READ_WRITE_TOKEN=...       # Vercel Blob storage
REDIS_URL=...                   # Optional: resumable streams
```

### Optional for Custom Tools

```bash
# For web search integration
SERPAPI_API_KEY=...             # If using SerpAPI

# For other external services
MY_TOOL_API_KEY=...
```

## Performance Debugging

### Check Tool Execution Time

Add timing in tool:
```typescript
execute: async (input) => {
  const start = performance.now();

  // Do work...

  const duration = performance.now() - start;
  console.log(`Tool execution took ${duration}ms`);

  return result;
}
```

### Check TokenLens Metrics

TokenLens automatically tracks:
- Input tokens
- Output tokens
- Cost estimation
- Latency

Visible in chat UI after response completes.

### View Logs

```bash
# Dev server logs
pnpm dev

# Check browser console for client errors
# Check terminal for server errors
```

## Deployment Checklist

- [ ] Tool tested locally
- [ ] Tool added to factory
- [ ] Documentation updated
- [ ] Error handling covers all cases
- [ ] Input validation present
- [ ] External API has timeout
- [ ] No console.log in production code
- [ ] TypeScript types are correct
- [ ] Tests pass: `pnpm test`
- [ ] Linting passes: `pnpm lint`

## Getting Help

### Documentation
- API docs: `docs/api/multi-tools-agent.md`
- Architecture: `docs/architecture/multi-tools-agent-design.md`
- Tool examples: `lib/ai/tools/`

### Code Examples
- Calculator tool: `lib/ai/tools/calculator.ts`
- Unit converter: `lib/ai/tools/unit-converter.ts`
- Web search: `lib/ai/tools/web-search.ts`

### Community
- Check existing issues in repository
- Review PR discussions
- Consult architecture decision records

## Next Steps

1. Explore existing tools in `lib/ai/tools/`
2. Read through `lib/ai/tools-factory.ts`
3. Try adding a simple new tool
4. Test via chat interface
5. Update documentation
6. Submit for review

Happy tool building!

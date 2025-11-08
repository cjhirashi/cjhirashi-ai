# Multi-Tools Agent Architecture Design

## Overview

The Multi-Tools Agent extends the Chat SDK with a comprehensive toolkit for utility functions while maintaining full architectural compatibility with the existing chat-general system. It demonstrates the factory pattern and modular tool design for easy future expansion.

## Design Principles

1. **Minimal Code Duplication** - Reuse chat-general structure and components
2. **Pluggable Tools** - Factory pattern for easy tool addition
3. **Type Safety** - Full TypeScript with Zod validation
4. **Separation of Concerns** - Tools, streaming, and UI independent
5. **Backward Compatibility** - No breaking changes to existing APIs

## Architectural Components

### 1. Tool Factory System

**Location:** `lib/ai/tools-factory.ts`

```
getToolsConfig(agentType, session, dataStream)
  |
  +-- chat-general
  |   +-- getWeather
  |   +-- createDocument
  |   +-- updateDocument
  |   +-- requestSuggestions
  |
  +-- multi-tools
      +-- [base tools]
      +-- calculator
      +-- unitConverter
      +-- webSearch
```

**Design Rationale:**
- Centralized tool configuration
- Easy to add new agent types
- Minimal changes to API route handlers
- Tools initialized with required context (session, dataStream)

### 2. Streaming Handler

**Location:** `lib/ai/stream-handler.ts`

Abstracts streaming logic to handle:
- Tool configuration selection
- Message streaming via SSE
- Token usage enrichment
- Error handling

**Benefits:**
- Reusable across agent types
- Reduces duplicated code in route handlers
- Easier to test and debug

```typescript
createChatStream(options)
  |
  +-- Tool Factory initialization
  +-- StreamText with tools
  +-- TokenLens enrichment
  +-- Message persistence
  +-- Error handling
```

### 3. Component Integration

**Location:** `components/chat.tsx`

Modified to accept `agentType` prop:
```typescript
<Chat agentType="multi-tools" ... />
```

This enables:
- Dynamic API endpoint routing (`/api/agents/{agentType}/chat`)
- Single component for multiple agent implementations
- Minimal UI differences between agents

### 4. Database Continuity

**No schema changes required.** Existing tables support multi-tools:
- `Chat` - Stores conversations (no type field needed)
- `Message_v2` - Stores all message types uniformly
- `Document` - Artifacts for all agents
- `Vote_v2` - User feedback on any message
- `Suggestion` - Edit suggestions for any document

## Directory Structure

```
app/
  api/
    agents/
      chat-general/          [Existing]
        chat/
        document/
        files/
        history/
        suggestions/
        vote/
      multi-tools/           [New - mirrors chat-general]
        chat/
          route.ts           [NEW: extended with multi-tools]
          schema.ts          [NEW: agent-specific validation]
          [id]/stream/       [COPIED from chat-general]
        document/            [COPIED: generic]
        files/               [COPIED: generic]
        history/             [COPIED: generic]
        suggestions/         [COPIED: generic]
        vote/                [COPIED: generic]

  (dashboard)/
    agents/
      chat-general/          [Existing]
        page.tsx
        [id]/page.tsx
      multi-tools/           [New]
        page.tsx             [NEW: new chat interface]
        [id]/page.tsx        [NEW: existing chat interface]

lib/
  ai/
    tools/
      calculator.ts          [NEW]
      unit-converter.ts      [NEW]
      web-search.ts          [NEW]
      tools-factory.ts       [NEW: tool configuration]
      stream-handler.ts      [NEW: streaming abstraction]
    prompts.ts               [MODIFIED: added multi-tools prompt]

components/
  chat.tsx                   [MODIFIED: added agentType prop]

docs/
  api/
    multi-tools-agent.md     [NEW: API documentation]
  architecture/
    multi-tools-agent-design.md [NEW: this file]
```

## Data Flow

### Chat Message Flow (Multi-Tools)

```
User Input
  |
  v
Chat Component (/dashboard/agents/multi-tools/[id])
  |
  v
POST /api/agents/multi-tools/chat
  |
  v
Request Validation (Zod schema)
  |
  v
Session & Authorization Check
  |
  v
Rate Limiting Check
  |
  v
Message Persistence (save user message)
  |
  v
createChatStream()
  |
  +-- Tool Factory: getToolsConfig("multi-tools", ...)
  |   |
  |   +-- Multi-Tools Extended Tools
  |       +-- calculator
  |       +-- unitConverter
  |       +-- webSearch
  |       +-- [base tools]
  |
  +-- streamText() with tools
  |   |
  |   +-- Model Invocation
  |   +-- Tool Calls (if triggered)
  |   +-- Response Streaming
  |
  +-- TokenLens Enrichment
  |
  +-- Message Persistence (save AI response)
  |
  +-- Chat Context Update (token usage)
  |
  v
SSE Stream to Client
  |
  v
Chat Component (real-time display)
```

### Tool Execution Flow

```
Model Response Suggests Tool Use
  |
  v
AI SDK Tool Call Handler
  |
  v
Tool Factory Lookup
  |
  v
Tool Execution
  |
  +-- Input Validation (Zod)
  |
  +-- Error Handling
  |   |
  |   +-- Validation Error -> Return error message
  |   +-- Execution Error -> Return error message
  |   +-- Success -> Return result
  |
  v
Result Serialization
  |
  v
Stream to Client
```

## Error Handling Strategy

### Validation Errors

```
Invalid Input (Zod Parse Error)
  -> Bad Request (400)
  -> Return structured error
  -> Preserve request body in logs (if safe)
```

### Authorization Errors

```
No Session / Invalid Token
  -> Unauthorized (401)

User Lacks Permission
  -> Forbidden (403)

User Exceeded Rate Limit
  -> Rate Limited (429)
```

### Tool Execution Errors

```
Tool Fails (e.g., calculator invalid expression)
  -> Return error in tool result
  -> Stream continues
  -> AI can handle gracefully
  -> No stream interruption
```

### System Errors

```
Database Error / Streaming Error
  -> Log full error with request ID
  -> Return generic error to client
  -> Request ID in response headers
```

## Scalability Considerations

### Horizontal Scaling

- Stateless API endpoints (Redis for streams is optional)
- Tool execution doesn't require specialized infrastructure
- Calculator and converter are O(1)
- Web search capped at 10 results

### Tool Addition Impact

Adding a new tool:
1. Create tool file (~100-200 lines)
2. Add to tools-factory.ts (~3 lines)
3. Update active tools list (~1 line)
4. No API/component changes needed

### Database Optimization

All tools use existing tables. Indexes already optimized for:
- `Message_v2.chatId + createdAt` - Message queries
- `Chat.userId + createdAt` - User chats
- `Document.userId + kind` - Document queries

## Testing Strategy

### Unit Testing

1. **Tool Testing** - Each tool in isolation
   ```typescript
   describe("calculator", () => {
     it("evaluates expressions safely", () => {})
     it("rejects invalid input", () => {})
   })
   ```

2. **Factory Testing** - Tool configuration
   ```typescript
   describe("getToolsConfig", () => {
     it("returns multi-tools for multi-tools agent", () => {})
   })
   ```

3. **Stream Handler Testing** - Message streaming
   ```typescript
   describe("createChatStream", () => {
     it("handles tool calls", () => {})
   })
   ```

### Integration Testing

1. **End-to-End Flow**
   - POST /api/agents/multi-tools/chat
   - Verify SSE stream
   - Confirm tool execution
   - Check message persistence

2. **Multi-Tool Scenarios**
   - Calculator in context
   - Multiple tool calls in sequence
   - Tool errors and recovery

### Manual Testing

- Test each tool via chat interface
- Verify error messages are user-friendly
- Check token usage accuracy
- Test with different user types (guest/regular)

## Monitoring & Observability

### Logging

- Tool execution start/end with tool name
- Tool errors with full context
- Stream handler errors with request ID
- TokenLens enrichment failures (non-critical)

### Metrics

- Tools used per message (aggregate)
- Tool success rate per tool type
- Average tool execution time
- Streaming error rate

### Error Tracking

- Sentry integration for critical errors
- Tool validation failures logged
- Rate limit hits tracked per user

## Security Analysis

### Input Validation

✓ All inputs validated via Zod schemas
✓ Expression parser prevents code injection
✓ Unit names from whitelist only
✓ Search queries length limited

### Authorization

✓ Session required for all endpoints
✓ User ownership verified for chats/documents
✓ Rate limiting prevents abuse

### Data Isolation

✓ Users can only access own chats/documents
✓ No cross-user tool result leakage
✓ Proper error messages (don't leak details)

### External Services

⚠ Web search currently uses mock data
  - Real integration should validate API source
  - Results should be sanitized
  - Rate limit external API calls

⚠ Weather API (open-meteo) - public API
  - No authentication required
  - Rate limited by provider

## Performance Benchmarks (Target)

| Operation | Target | Notes |
|-----------|--------|-------|
| Calculator | <10ms | Local computation |
| Unit Converter | <10ms | Lookup table |
| Web Search | <100ms | Mock data; real would be slower |
| Get Weather | <500ms | External API call |
| Message Save | <50ms | Database write |
| Full Chat Stream | <1000ms | Varies by model response |

## Future Enhancement Paths

### Phase 2: Real Web Search

- Integrate SerpAPI or Tavily
- Cache common queries
- Add source attribution
- Dedup results across sources

### Phase 3: Advanced Tools

- Code execution (safe sandbox)
- File operations (upload/download)
- Data visualization
- API integrations

### Phase 4: Tool Marketplace

- Community tool registry
- User-created tools
- Tool versioning
- Rating/reviews system

## Related ADRs

- [ADR-001: Tool Factory Pattern](../decisions/001-tool-factory-pattern.md)
- [ADR-002: Agent Type Routing](../decisions/002-agent-type-routing.md)
- [ADR-003: Streaming Handler Abstraction](../decisions/003-streaming-handler-abstraction.md)

## Team Responsibilities

| Area | Owner | Backup |
|------|-------|--------|
| Tool Development | Backend | QA |
| API Integration | Backend | DevOps |
| Performance | DevOps | Backend |
| Documentation | Tech Writer | Backend |
| Security Review | Security Team | Backend Lead |

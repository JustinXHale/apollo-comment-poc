# AI Feedback Assistant Documentation

## Overview

The AI Feedback Assistant is a chatbot interface that helps designers and stakeholders analyze and summarize feedback comments across prototype versions. Built with PatternFly's chatbot components, it provides a familiar chat interface for querying comment data.

**Current Status**: Phase 1 (UI Only) ✅  
**Next Phase**: Phase 2 (MaaS Integration) 🚧

## Architecture

### Component Structure

```
src/app/components/ai/
├── AIContext.tsx           # State management and localStorage
├── AIChatPanel.tsx         # Chat UI with PatternFly components
├── AIAssistant.tsx         # Toggle button and panel container
└── index.ts                # Public exports
```

### Key Components

#### 1. AIContext (`AIContext.tsx`)

Manages all chatbot state and provides the React context:

```typescript
interface AIContextType {
  isChatbotVisible: boolean;      // Toggle state
  messages: AIMessage[];          // Chat history
  isLoading: boolean;             // Loading state
  toggleChatbot: () => void;      // Show/hide chatbot
  sendMessage: (content: string) => Promise<void>;  // Send user message
  clearHistory: () => void;       // Clear chat history
}
```

**localStorage Keys:**
- `apollo-ai-chat-history` - Persisted message history
- `apollo-ai-chatbot-visible` - Visibility state

#### 2. AIChatPanel (`AIChatPanel.tsx`)

The main chat interface built with PatternFly components:

- **Header**: Title with version badge and comment count
- **Content**: Message history with scrolling
- **Footer**: Input field and quick action buttons

**Quick Actions:**
- "Last 7 days" - Query recent feedback
- "This page only" - Filter to current route
- "Accessibility" - Find accessibility issues
- "High priority" - Show high-priority items

#### 3. AIAssistant (`AIAssistant.tsx`)

Container component that combines the floating toggle button and chat panel.

**Positioning:**
- Fixed position: bottom-right
- z-index: 1002 (above comment pins at 1000)

### Integration Points

The AI Assistant is integrated into `AppLayout.tsx`:

```typescript
<AIProvider>
  <Page>
    <CommentDrawer>...</CommentDrawer>
    <AIAssistant />  // Floating button + panel
  </Page>
</AIProvider>
```

### Data Access

The chat panel can access:
- **Comment threads**: via `useComments()` from CommentContext
- **Current version**: via `useVersion()` from VersionContext  
- **Current route**: via `useLocation()` from react-router

This allows the AI to analyze comments by:
- Time range (last 7 days, last week, etc.)
- Route/page (specific screens)
- Version (prototype iterations)
- Status (open, closed, synced)

## Phase 1: Current Implementation ✅

### What's Working

- ✅ Floating chatbot toggle (bottom-right corner)
- ✅ Chat panel with PatternFly components
- ✅ Message history persistence (localStorage)
- ✅ Quick action buttons
- ✅ Loading states
- ✅ Version and comment count display
- ✅ Welcome prompts with suggested queries
- ✅ Keyboard shortcuts (Enter to send, Shift+Enter for newline)
- ✅ Auto-scroll to latest message
- ✅ Light/dark theme support (inherited from PatternFly)

### Placeholder Behavior

Currently, the `sendMessage()` function returns a placeholder response after 1 second:

```typescript
"AI integration coming in Phase 2. This is a placeholder response."
```

## Phase 2: MaaS Integration ✅

### Implemented Features

1. **Real AI Responses**
   - Connect to Red Hat MaaS API
   - Use models like DeepSeek-R1, Granite, or Llama
   - Return actual analysis of comment data

2. **Advanced Queries**
   - Natural language understanding
   - Multi-turn conversations
   - Context-aware responses

3. **Smart Summarization**
   - Group comments by theme
   - Identify common issues
   - Prioritize by frequency/severity
   - Generate actionable insights

4. **Thread Linking**
   - Return relevant thread IDs
   - Highlight related comment pins
   - Jump to specific comments

5. **User Configuration**
   - Settings panel for MaaS credentials
   - Model selection
   - Default users' credentials with option to override

### What's New

- ✅ **Vercel Serverless Function** at `/api/ai-assistant.ts`
- ✅ **MaaS Integration** using llama-3-2-3b model
- ✅ **Context-Aware AI** - sends comment threads, version, and route to AI
- ✅ **Smart Prompting** - formats comment data for optimal AI analysis
- ✅ **Error Handling** - graceful degradation with user-friendly messages
- ✅ **Environment Configuration** - see `ENV_SETUP.md` for setup instructions

### Architecture

The AI assistant now works as follows:

1. **User sends query** → AIChatPanel component
2. **Collect context** → Get threads, version, route from React contexts
3. **API call** → POST to `/api/ai-assistant` with query + context
4. **Serverless function** → Formats prompt and calls MaaS API
5. **AI response** → Formatted message returned to chat
6. **Display** → Message shown in chat with timestamp

### Original Implementation Roadmap

#### Step 1: MaaS API Integration ✅

Created `/api/ai-assistant.ts` (Vercel format):

```typescript
const response = await fetch(process.env.MAAS_API_ENDPOINT, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.MAAS_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: process.env.MAAS_MODEL_NAME,
    messages: [
      {
        role: 'system',
        content: 'You are a UX feedback analyzer. Summarize design comments concisely, group by theme, and prioritize actionable items.'
      },
      {
        role: 'user',
        content: formatPromptWithComments(query, threads, version)
      }
    ]
  })
});
```

#### Step 2: Connect AIContext to CommentContext ✅

Updated `AIChatPanel.tsx` to pass actual comment data:

```typescript
const { threads } = useComments();
const { currentVersion } = useVersion();

// Filter threads for current version
const relevantThreads = threads.filter(t => t.version === currentVersion);

// Send to API
await sendMessage(inputValue, relevantThreads);
```

#### Step 3: Prompt Engineering

Design effective prompts for different query types:

**Time-based queries:**
```
"Analyze these 15 comments from the last 7 days. 
Group by: page, theme, and severity."
```

**Route-specific queries:**
```
"Summarize all feedback on the /dashboard page.
Focus on: usability issues, bugs, and feature requests."
```

**Accessibility queries:**
```
"Find all accessibility issues mentioned in these comments.
Check for: WCAG compliance, screen reader issues, keyboard navigation."
```

#### Step 4: Response Formatting

Parse AI responses and display with rich formatting:

- Use PatternFly cards for grouped results
- Add clickable links to jump to threads
- Highlight priority issues with badges
- Show metadata (page, date, author)

#### Step 5: Settings Panel

Create user settings for MaaS configuration:

```typescript
// src/app/components/ai/AISettings.tsx
- API endpoint input
- API key input (encrypted)
- Model selection dropdown
- Test connection button
```

## Testing Guide

### Testing Phase 1 (Current)

1. **Toggle Functionality**
   ```
   ✓ Click toggle button → panel opens
   ✓ Click toggle again → panel closes
   ✓ State persists on page refresh
   ```

2. **Chat Interface**
   ```
   ✓ Welcome message displays on first open
   ✓ Can type in input field
   ✓ Enter key sends message
   ✓ Shift+Enter creates newline
   ✓ Send button disabled when empty
   ✓ Message appears in history
   ✓ Placeholder response shows after 1s
   ```

3. **Quick Actions**
   ```
   ✓ Click quick action → populates input
   ✓ Quick actions show after first message
   ✓ All 4 quick actions work
   ```

4. **Persistence**
   ```
   ✓ Messages saved to localStorage
   ✓ Messages restored on page reload
   ✓ Visibility state persists
   ```

5. **Theming**
   ```
   ✓ Works in light theme
   ✓ Works in dark theme
   ✓ Matches PatternFly styling
   ```

6. **Responsive**
   ```
   ✓ Panel adapts to screen size
   ✓ Toggle visible on mobile
   ✓ No overlap with comment pins
   ```

### Testing Phase 2 (Future)

Will include:
- API connection testing
- Response accuracy validation
- Thread linking verification
- Performance with large datasets
- Error handling and retry logic

## API Reference

### `AIProvider`

Provides chatbot state to child components.

```typescript
import { AIProvider } from '@app/components/ai';

<AIProvider>
  {children}
</AIProvider>
```

### `useAIContext()`

Hook to access chatbot state and methods.

```typescript
import { useAIContext } from '@app/components/ai';

const { 
  isChatbotVisible, 
  messages, 
  isLoading,
  toggleChatbot,
  sendMessage,
  clearHistory 
} = useAIContext();
```

### `AIAssistant`

Main component with toggle and panel.

```typescript
import { AIAssistant } from '@app/components/ai';

<AIAssistant />
```

## Environment Variables

See `ENV_TEMPLATE.md` for configuration details.

Required for Phase 2:
```bash
MAAS_API_ENDPOINT=https://your-maas-endpoint.com
MAAS_API_KEY=your_api_key
MAAS_MODEL_NAME=model_name
```

## Troubleshooting

### Toggle Not Appearing

1. Check that `AIProvider` wraps the app
2. Verify z-index isn't being overridden
3. Check browser console for errors

### Messages Not Persisting

1. Check localStorage is enabled
2. Verify no localStorage quota exceeded
3. Check browser privacy settings

### Panel Not Opening

1. Verify `AIProvider` is properly configured
2. Check for JavaScript errors in console
3. Ensure PatternFly styles are loaded

## Future Enhancements

Beyond Phase 2:

1. **Export Summaries** - Download or share AI-generated reports
2. **Compare Versions** - Analyze changes between prototype versions
3. **Sentiment Analysis** - Gauge user sentiment from comments
4. **Auto-Categorization** - Automatically tag comments by type
5. **Trend Detection** - Identify emerging issues
6. **Multi-Language** - Support for non-English comments
7. **Voice Input** - Speak queries instead of typing
8. **Suggested Actions** - AI recommends next steps based on feedback

## Contributing

When contributing to the AI Assistant:

1. Follow PatternFly design guidelines
2. Maintain separation between UI (Phase 1) and AI logic (Phase 2)
3. Add tests for new features
4. Update this documentation
5. Ensure accessibility compliance

## Support

For questions or issues:
- Check this documentation
- Review PatternFly chatbot docs: https://www.patternfly.org/patternfly-ai/chatbot
- Check the MaaS dashboard: https://maas.apps.prod.rhoai.rh-aiservices-bu.com/

## License

Same as parent project.


# @apollo/commenting-system

A reusable React commenting system with GitHub/GitLab integration and AI-powered summarization.

## Features

- 📌 **Visual Comment Pins** - Click anywhere to add comment threads
- 🔄 **GitHub/GitLab Sync** - Two-way sync with issue trackers
- 🤖 **AI Summarization** - Powered by DeepSeek R1 via MaaS
- 📦 **Version Management** - Track comments across prototype versions
- 🎨 **PatternFly UI** - Built with PatternFly React components

## Installation

```bash
npm install @apollo/commenting-system
```

## Usage

### Basic Setup

```tsx
import {
  CommentProvider,
  VersionProvider,
  GitHubAuthProvider,
  GitLabAuthProvider,
  AIProvider,
  CommentOverlay,
  CommentDrawer,
  AIAssistant
} from '@apollo/commenting-system';

function App() {
  return (
    <GitHubAuthProvider>
      <GitLabAuthProvider>
        <VersionProvider>
          <CommentProvider>
            <AIProvider>
              <Router>
                <AppLayout>
                  <CommentDrawer selectedThreadId={selectedId} onThreadSelect={setSelectedId}>
                    <CommentOverlay selectedThreadId={selectedId} onThreadSelect={setSelectedId} />
                    <YourContent />
                  </CommentDrawer>
                  <AIAssistant />
                </AppLayout>
              </Router>
            </AIProvider>
          </CommentProvider>
        </VersionProvider>
      </GitLabAuthProvider>
    </GitHubAuthProvider>
  );
}
```

### API Configuration

Create a serverless function at `/api/ai-assistant.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Your MaaS API integration
  const response = await fetch(process.env.MAAS_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MAAS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.MAAS_MODEL_NAME,
      prompt: req.body.query
    })
  });
  
  const data = await response.json();
  return res.json({ message: data.text });
}
```

### Environment Variables

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_OWNER=your_github_org
GITHUB_REPO=your_repo_name

GITLAB_CLIENT_ID=your_gitlab_client_id
GITLAB_CLIENT_SECRET=your_gitlab_client_secret
GITLAB_PROJECT_ID=your_project_id

MAAS_API_ENDPOINT=your_maas_endpoint
MAAS_API_KEY=your_maas_key
MAAS_MODEL_NAME=deepseek-r1-qwen-14b
```

## Components

### Core Components

- **CommentOverlay** - Renders comment pins on the page
- **CommentDrawer** - Side panel for viewing/editing comments
- **CommentPin** - Individual comment pin component
- **AIAssistant** - AI chatbot toggle and panel

### Providers

- **CommentProvider** - Comment state and CRUD operations
- **VersionProvider** - Version management
- **GitHubAuthProvider** - GitHub authentication
- **GitLabAuthProvider** - GitLab authentication  
- **AIProvider** - AI chat state and API calls

## Types

```typescript
import type { Comment, Thread, AIMessage, GitHubResult } from '@apollo/commenting-system';
```

## Peer Dependencies

- @patternfly/react-core: ^6.0.0
- @patternfly/react-icons: ^6.0.0
- @patternfly/chatbot: ^6.0.0
- react: ^18.0.0
- react-dom: ^18.0.0
- react-router-dom: ^6.0.0 || ^7.0.0

## License

MIT


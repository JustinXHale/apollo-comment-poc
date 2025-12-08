# hale-commenting-system

A local-first React commenting system with localStorage persistence. Perfect for prototypes, design reviews, and local development.

## Features

- 📌 **Visual Comment Pins** - Click anywhere on your app to add comment threads
- 💾 **LocalStorage Persistence** - Comments persist across page refreshes
- 🔄 **Threaded Conversations** - Add multiple replies to each comment pin
- 📦 **Version Management** - Filter comments by prototype version
- 🎨 **PatternFly UI** - Built with PatternFly React components
- 🧙 **CLI Wizard** - Automated setup with `npx hale-commenting-system init`
- 🚀 **Zero Configuration** - No backend, no auth, no setup hassle

## Installation

```bash
npm install hale-commenting-system
```

## Quick Start

Run the interactive setup wizard:

```bash
npx hale-commenting-system init
```

This will:
1. Detect your React project
2. Auto-integrate the commenting system into your App component
3. You're done! Start your dev server and click anywhere to add comments

## How It Works

All comments are stored locally in your browser's localStorage. They persist across:
- Page refreshes
- Browser restarts
- Dev server restarts

Perfect for:
- Local prototyping
- Design reviews
- Quick feedback sessions
- Testing before adding a backend

## Usage

Once installed, the commenting system provides two modes:

### View Mode (Default)
- Click the "Show Pins" toggle to see existing comment pins
- Click on pins to view threads and replies
- Read-only, no editing

### Comment Mode
- Click "Enable Commenting" to enter edit mode
- Your cursor becomes a crosshair
- Click anywhere to create a new comment thread
- Click pins to add replies, edit, or delete

### Keyboard Shortcuts
- Press `Enter` in the comment textarea to submit
- Press `Esc` to close the comment drawer

## Manual Integration

If the CLI doesn't work for your project, you can manually integrate:

```tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  CommentProvider,
  CommentOverlay,
  CommentDrawer,
  VersionProvider
} from 'hale-commenting-system';

function App() {
  const [selectedThreadId, setSelectedThreadId] = React.useState<string | null>(null);

  return (
    <Router>
      <VersionProvider>
        <CommentProvider>
          <CommentDrawer 
            selectedThreadId={selectedThreadId} 
            onThreadSelect={setSelectedThreadId}
          >
            <CommentOverlay 
              selectedThreadId={selectedThreadId} 
              onThreadSelect={setSelectedThreadId}
            />
            {/* Your app content */}
          </CommentDrawer>
        </CommentProvider>
      </VersionProvider>
    </Router>
  );
}
```

## API

### `<CommentProvider>`
Root provider that manages comment state and localStorage persistence.

### `<CommentOverlay>`
Invisible overlay that handles click events for creating new comments.

**Props:**
- `selectedThreadId: string | null` - Currently selected thread ID
- `onThreadSelect: (id: string | null) => void` - Callback when a thread is selected

### `<CommentDrawer>`
Sidebar drawer that displays the selected thread and its replies.

**Props:**
- `selectedThreadId: string | null` - Thread to display
- `onThreadSelect: (id: string | null) => void` - Callback to close the drawer
- `children: React.ReactNode` - Your app content

### `useComments()` Hook

Access comment state and actions:

```tsx
import { useComments } from 'hale-commenting-system';

function MyComponent() {
  const {
    threads,              // All comment threads
    showPins,             // Whether pins are visible
    enableCommenting,     // Whether commenting mode is active
    toggleShowPins,       // Toggle pin visibility
    toggleEnableCommenting, // Toggle commenting mode
    addThread,            // Create a new thread
    addReply,             // Add a reply to a thread
    updateComment,        // Update a comment
    deleteComment,        // Delete a comment
    deleteThread,         // Delete a thread
    clearAllThreads,      // Clear all comments
    getThreadsForRoute    // Get comments for current route
  } = useComments();
}
```

## Version Management

The system supports filtering comments by version (useful for iterating on prototypes):

```tsx
import { VersionProvider, useVersion } from 'hale-commenting-system';

function App() {
  return (
    <VersionProvider>
      <CommentProvider>
        {/* Your app */}
      </CommentProvider>
    </VersionProvider>
  );
}

// In your component
function MyComponent() {
  const { currentVersion, setCurrentVersion } = useVersion();
  
  // Comments are automatically filtered by version
  return (
    <select value={currentVersion} onChange={(e) => setCurrentVersion(e.target.value)}>
      <option value="1">Version 1</option>
      <option value="2">Version 2</option>
      <option value="3">Version 3 (current)</option>
    </select>
  );
}
```

## TypeScript

The package includes full TypeScript definitions:

```tsx
import type { Thread, Comment } from 'hale-commenting-system';

interface Thread {
  id: string;
  x: number;
  y: number;
  route: string;
  comments: Comment[];
  version?: string;
}

interface Comment {
  id: string;
  author?: string;
  text: string;
  createdAt: string;
}
```

## Browser Compatibility

Works in all modern browsers that support:
- localStorage
- React 18+
- ES2020+

## Roadmap

This is the MVP (local-only) version. Future enhancements:
- [ ] Backend sync (GitHub Issues, GitLab, custom)
- [ ] OAuth authentication
- [ ] Real-time collaboration
- [ ] Export/import comments
- [ ] Comment notifications
- [ ] Rich text editing
- [ ] File attachments

## License

MIT

## Author

Justin Hale

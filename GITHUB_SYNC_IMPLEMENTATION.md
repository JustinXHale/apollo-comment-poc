# GitHub Sync Implementation Summary

## Overview

The Apollo comment system has been enhanced to sync with GitHub Issues. Each comment thread (pin) maps to a GitHub Issue, and each reply maps to a GitHub Issue comment. LocalStorage remains as an offline cache.

## What Was Implemented

### ✅ 1. GitHub API Service (`src/app/services/githubAdapter.ts`)

A new service that wraps all GitHub REST API calls:

- **`createIssue()`** - Creates a new GitHub Issue for a thread
- **`createComment()`** - Adds a comment to an existing Issue
- **`fetchIssues()`** - Retrieves all issues for a specific route
- **`fetchComments()`** - Retrieves all comments for an Issue
- **`closeIssue()`** - Closes an Issue (when thread is deleted)
- **`updateComment()`** - Updates an existing comment
- **`deleteComment()`** - Deletes a comment
- **`isGitHubConfigured()`** - Checks if GitHub credentials are set

**Error Handling:**
- All methods include try/catch blocks
- Graceful fallback to localStorage if GitHub is unavailable
- Console warnings when GitHub is not configured
- Network errors don't break the app

### ✅ 2. Updated Data Models

**Thread Interface:**
```typescript
export interface Thread {
  id: string;
  x: number;
  y: number;
  route: string;
  comments: Comment[];
  issueNumber?: number; // NEW: GitHub Issue number
  syncStatus?: 'synced' | 'local' | 'syncing' | 'error'; // NEW: Sync state
}
```

**Comment Interface:**
```typescript
export interface Comment {
  id: string;
  author?: string; // NEW: GitHub username
  text: string;
  createdAt: string;
  githubCommentId?: number; // NEW: GitHub comment ID
}
```

### ✅ 3. CommentContext Enhancements

**New Functions:**
- `syncFromGitHub(route: string)` - Fetches issues and comments from GitHub
- `isSyncing` - Boolean flag for sync status

**Updated Functions (now async):**
- `addReply()` - Creates GitHub comment after adding locally
- `updateComment()` - Updates GitHub comment after updating locally
- `deleteComment()` - Deletes GitHub comment after deleting locally
- `deleteThread()` - Closes GitHub Issue after deleting locally

**Sync Flow:**
1. **Optimistic Updates**: Changes apply to localStorage immediately
2. **Background Sync**: GitHub API calls happen asynchronously
3. **Status Updates**: `syncStatus` reflects current state

### ✅ 4. UI Enhancements (`CommentDrawer`)

**Sync Status Badge:**
- 🟢 **Synced** (green) - Successfully synced with GitHub
- ⚪ **Local Only** (grey) - GitHub not configured
- 🔵 **Syncing...** (blue) - Currently syncing
- 🔴 **Sync Error** (red) - Failed to sync

**GitHub Issue Link:**
- Clickable link to view issue on GitHub
- Shows issue number
- Opens in new tab

**Sync Button:**
- Manual refresh button in drawer header
- Disabled while syncing
- Shows spinner during sync

**Author Attribution:**
- Shows GitHub username for synced comments
- Format: `@username • Mar 15, 3:45 PM`

### ✅ 5. Auto-Sync on Route Change

- Automatically fetches GitHub issues when navigating to a new route
- Only runs if GitHub is configured
- Merges GitHub data with local-only threads

## How to Use

### Initial Setup

1. **Install axios** (already done):
   ```bash
   npm install axios
   ```

2. **Create `.env.local`** (see `GITHUB_SYNC_SETUP.md`):
   ```bash
   VITE_GITHUB_TOKEN=your_token_here
   VITE_GITHUB_OWNER=JustinXHale
   VITE_GITHUB_REPO=apollo-comment-poc
   ```

3. **Restart dev server**:
   ```bash
   npm run start:dev
   ```

### Testing the Integration

#### Test 1: Create a New Thread
1. Enable "Show Pins" and "Enable Commenting" toggles
2. Click anywhere on the page to create a pin
3. Add a comment in the sidebar
4. **Check GitHub**: New issue should appear at https://github.com/JustinXHale/apollo-comment-poc/issues
5. **Verify**: Issue has labels: `apollo-comment`, `route:/path`, `coords:x,y`

#### Test 2: Add Replies
1. Click an existing pin
2. Add a reply in the sidebar
3. **Check GitHub**: New comment should appear on the issue
4. **Verify**: Comment text matches

#### Test 3: Sync from GitHub
1. Open GitHub and manually add a comment to an issue
2. Click the sync button (↻) in the comment drawer
3. **Verify**: New comment appears in the sidebar

#### Test 4: Delete Thread
1. Click a pin to open its thread
2. Click "Delete Thread"
3. **Check GitHub**: Issue should be closed (not deleted)

#### Test 5: Offline Mode
1. Stop the dev server or disconnect internet
2. Create new pins/comments
3. **Verify**: Status shows "Local Only"
4. Reconnect and click sync
5. **Verify**: Local comments sync to GitHub

#### Test 6: Page Refresh
1. Create several threads with comments
2. Refresh the browser
3. **Verify**: All threads/comments reload from GitHub

## Data Flow Diagrams

### Creating a Thread
```
User clicks → addThread() → 
  ├─ Create local thread (immediate)
  ├─ Update UI (immediate)
  └─ GitHub.createIssue() (async)
      ├─ Success → Update issueNumber + syncStatus='synced'
      └─ Failure → Update syncStatus='error'
```

### Adding a Reply
```
User submits → addReply() →
  ├─ Add to local thread (immediate)
  ├─ Update UI (immediate)
  └─ GitHub.createComment(issueNumber) (async)
      ├─ Success → Update githubCommentId
      └─ Failure → Comment stays local-only
```

### Syncing from GitHub
```
syncFromGitHub(route) →
  ├─ GitHub.fetchIssues(route)
  ├─ For each issue:
  │   └─ GitHub.fetchComments(issueNumber)
  ├─ Convert to Thread objects
  ├─ Merge with local-only threads
  └─ Update state + localStorage
```

## Environment Variables

All GitHub config uses Vite environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GITHUB_TOKEN` | Personal Access Token | `ghp_abc123...` |
| `VITE_GITHUB_OWNER` | Repository owner | `JustinXHale` |
| `VITE_GITHUB_REPO` | Repository name | `apollo-comment-poc` |

**Access in code:**
```typescript
const token = import.meta.env.VITE_GITHUB_TOKEN;
```

## File Structure

```
src/
├── app/
│   ├── services/
│   │   └── githubAdapter.ts         ← NEW: GitHub API wrapper
│   ├── context/
│   │   └── CommentContext.tsx       ← UPDATED: Sync logic
│   └── components/
│       └── comments/
│           ├── CommentDrawer.tsx    ← UPDATED: Sync UI
│           ├── CommentOverlay.tsx   ← No changes
│           └── CommentPin.tsx       ← No changes
```

## Console Logging

Helpful logs for debugging:

- ✅ `Created GitHub Issue #123`
- ✅ `Added comment to Issue #123`
- ✅ `Fetched 5 issues for route: /dashboard`
- ✅ `Synced 5 threads from GitHub`
- ⚠️ `Missing GitHub token. GitHub sync disabled.`
- ❌ `Failed to create GitHub Issue: [error details]`

## Known Limitations

1. **Rate Limits**: GitHub API has rate limits (5000/hour for authenticated)
2. **No Real-time Sync**: Changes don't auto-sync from GitHub (manual refresh needed)
3. **No Conflict Resolution**: Last write wins (no merge conflicts)
4. **Issue Body Unused**: First comment is in issue body, but it's not editable
5. **Closed Issues Hidden**: Deleted threads close issues but they're not fetched again

## Future Enhancements (Not Implemented)

- [ ] Real-time sync with GitHub webhooks
- [ ] Conflict resolution for simultaneous edits
- [ ] Bulk sync button for all routes
- [ ] Offline queue for failed syncs
- [ ] User avatars from GitHub
- [ ] Reactions/emojis from GitHub
- [ ] Markdown rendering for comments
- [ ] Search within synced comments

## Troubleshooting

### Sync Status Stuck on "Syncing..."
- Check console for errors
- Verify network connectivity
- Check GitHub token permissions

### "Local Only" Despite Setting .env.local
- Restart dev server after creating `.env.local`
- Verify variable names match exactly (`VITE_` prefix required)
- Check for typos in token/owner/repo

### Changes Not Appearing in GitHub
- Check browser console for API errors
- Verify token has `repo` scope
- Check if repository exists and is accessible

### "Failed to create GitHub Issue"
- Verify repository name and owner are correct
- Check token hasn't expired
- Ensure token has write permissions

## Security Best Practices

1. ⚠️ **Never commit** `.env.local` to Git
2. 🔒 Use fine-grained tokens with minimum required permissions
3. 🔄 Rotate tokens periodically
4. 👁️ Monitor GitHub audit log for suspicious activity
5. 🚫 Don't share tokens in screenshots or logs

## Additional Resources

- **GitHub API Docs**: https://docs.github.com/rest
- **PatternFly React**: https://www.patternfly.org/components/all-components
- **Vite Env Variables**: https://vitejs.dev/guide/env-and-mode.html
- **Setup Guide**: `GITHUB_SYNC_SETUP.md`


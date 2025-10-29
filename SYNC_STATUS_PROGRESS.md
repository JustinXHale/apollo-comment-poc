# Sync Status Feature - Implementation Progress

## ✅ Completed

### 1. GitHub Adapter - Structured Results
- ✅ Added `GitHubResult<T>` interface with `{success, data, error}`
- ✅ Updated all methods to return `Promise<GitHubResult>`:
  - `createIssue()`
  - `createComment()`
  - `updateComment()`
  - `deleteComment()`
  - `closeIssue()`
- ✅ All methods now return structured results with error messages

### 2. Toaster Component
- ✅ Created `ToasterContext.tsx` with AlertGroup
- ✅ Implemented helper functions: `showSuccess()`, `showError()`, `showInfo()`, `showWarning()`
- ✅ Added auto-dismiss with configurable timeout
- ✅ Wrapped app with `ToasterProvider` in `src/app/index.tsx`

### 3. CommentContext Types
- ✅ Added `SyncStatus` type: `'synced' | 'local' | 'pending' | 'error'`
- ✅ Updated `Thread` interface with `syncStatus` and `syncError` fields
- ✅ Added `retrySync()` and `hasPendingSync` to context type
- ✅ Imported `GitHubResult` from githubAdapter

## 🚧 In Progress / TODO

### 4. CommentContext Implementation
- ⏳ Update `addThread()` to:
  - Set initial `syncStatus: 'pending'`
  - Call GitHub API with GitHubResult handling
  - Update to 'synced' or 'error' based on result
  - Store failed threads for retry
  
- ⏳ Update `addReply()` to handle GitHubResult
- ⏳ Update `updateComment()` to handle GitHubResult
- ⏳ Update `deleteComment()` to handle GitHubResult
- ⏳ Update `deleteThread()` to handle GitHubResult

- ⏳ Implement `retrySync()` helper:
  - Find all threads with `syncStatus === 'error'`
  - Retry GitHub API calls
  - Update status based on results

- ⏳ Implement `hasPendingSync` computed value:
  - `threads.some(t => t.syncStatus === 'pending')`

- ⏳ Wire toaster notifications:
  - Success: "💬 Comment saved to GitHub"
  - Error: "⚠️ Sync failed - will retry"

### 5. CommentDrawer - Sync Status Badges
- ⏳ Import `Label` or `Chip` from PatternFly
- ⏳ Display badge next to thread title:
  - Green ("Synced")
  - Grey ("Local only")
  - Blue ("Syncing...")
  - Red ("Sync failed")
- ⏳ Add tooltip with detailed status

### 6. CommentPin - Visual Feedback
- ⏳ Add CSS animation for `syncStatus === 'pending'`:
  - Pulse animation
  - Lighter opacity
- ⏳ Add warning icon (⚠️) overlay for `syncStatus === 'error'`
- ⏳ Solid appearance for `syncStatus === 'synced'`

### 7. AppLayout - Global Sync Indicator
- ⏳ Check `hasPendingSync` from CommentContext
- ⏳ Display spinner/icon in masthead when `hasPendingSync === true`
- ⏳ Tooltip: "Syncing comments with GitHub…"

## Implementation Plan

**Next Steps:**
1. Update CommentContext `addThread()` to use new flow
2. Update `addReply()`, `updateComment()`, `deleteComment()`, `deleteThread()`
3. Implement `retrySync()` helper
4. Add sync status badges to CommentDrawer
5. Add visual feedback to CommentPin
6. Add global sync indicator to AppLayout

**Files to Modify:**
- `src/app/context/CommentContext.tsx` (large changes)
- `src/app/components/comments/CommentDrawer.tsx`
- `src/app/components/comments/CommentPin.tsx`
- `src/app/AppLayout/AppLayout.tsx`

## Notes

- All GitHub API calls now return structured results
- Toaster is ready for notifications
- Need to wire everything together in CommentContext
- The syncStatus tracking will enable:
  - Visual feedback on pin state
  - Retry failed syncs
  - Display sync errors to users
  - Global sync indicator


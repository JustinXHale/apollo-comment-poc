# Threaded Comments System - Implementation Summary

## Overview
The comment system has been upgraded to support **threaded comments** - each pin now represents a **thread** that can contain multiple comments/replies, not just a single comment.

## Key Changes

### 1. Data Model Transformation

**Before (Single Comments):**
```typescript
Comment {
  id: string
  x: number
  y: number
  text: string
  createdAt: string
  route: string
}
```

**After (Threaded Model):**
```typescript
Thread {
  id: string
  x: number
  y: number
  route: string
  comments: Comment[]
}

Comment {
  id: string
  author?: string
  text: string
  createdAt: string
}
```

### 2. Automatic Migration
- Existing single comments automatically migrate to threads
- Old `apollo-comments` localStorage key converted to `apollo-threads`
- Each old comment becomes a thread with one comment inside
- Migration happens seamlessly on first load

### 3. Always-Clickable Pins
**New Behavior:**
- Pins are **always clickable**, even when commenting is disabled
- Clicking opens the sidebar in **read-only mode** when commenting off
- Clicking opens the sidebar in **editable mode** when commenting on

**Mode Matrix:**
| Show Pins | Enable Commenting | Pin Behavior | Sidebar |
|-----------|------------------|--------------|---------|
| OFF | OFF | Hidden | Closed |
| ON | OFF | **Clickable (read-only)** | View only |
| ON | ON | Clickable (editable) | Full edit |

### 4. Sidebar Features

#### Thread View
- Shows location coordinates: `(x, y)`
- Shows comment count
- Delete Thread button (when commenting enabled)

#### Comments List
- Each comment numbered: "Comment #1", "Comment #2", etc.
- Shows timestamp for each comment
- Edit/Delete buttons per comment (when commenting enabled)
- Cannot delete the last comment (must delete thread instead)

#### Add Reply
- "Add Reply" section at bottom (when commenting enabled)
- Textarea with Enter to submit
- Replies appear immediately in chronological order

### 5. Visual Pin Indicators
- **1 comment**: Shows comment icon
- **2+ comments**: Shows **number** instead of icon
  - Example: Pin shows "3" if thread has 3 comments
- Selected pin: Blue border and glow
- All pins: Red background (#C9190B)

## localStorage Keys

```
apollo-threads              // Main thread data
apollo-show-pins           // "true" | "false"
apollo-enable-commenting   // "true" | "false"
```

Old key `apollo-comments` is removed after migration.

## Usage Examples

### Example 1: Creating a Thread
1. Check both toggles: ☑ Show Pins + ☑ Enable Commenting
2. Click anywhere on page
3. **Sidebar opens automatically** with new thread
4. First comment is empty - type your text
5. Press Enter or click Save

### Example 2: Adding Replies
1. Click an existing pin
2. Sidebar shows the thread
3. Scroll to "Add Reply" section at bottom
4. Type your reply
5. Press Enter or click "Add Reply"
6. New comment appears in the list

### Example 3: Browse Mode (Read-Only)
1. Uncheck "Enable Commenting" (keep "Show Pins" checked)
2. Click any pin
3. **Sidebar opens in read-only mode**
4. You can see all comments but:
   - No Edit buttons
   - No Delete buttons  
   - No "Add Reply" section
   - No "Delete Thread" button

### Example 4: Editing a Comment
1. Enable commenting
2. Click a pin → sidebar opens
3. Find the comment you want to edit
4. Click "Edit" button
5. Modify text in textarea
6. Press Enter or click "Save"

### Example 5: Multi-Comment Thread
1. Create a thread
2. Add reply "First comment"
3. Add reply "Second comment"
4. Add reply "Third comment"
5. **Pin now shows "4"** (total comments including initial)
6. Sidebar shows all 4 comments chronologically

## Component Architecture

### CommentContext
- Manages `threads[]` array
- Methods:
  - `addThread(x, y, route)` → returns threadId
  - `addReply(threadId, text)` → adds comment to thread
  - `updateComment(threadId, commentId, text)`
  - `deleteComment(threadId, commentId)`
  - `deleteThread(threadId)` → removes entire thread
  - `clearAllThreads()` → removes everything
  - `getThreadsForRoute(route)` → filters by current route

### CommentPin
- Displays thread location as red circle
- Shows comment icon (1 comment) or number (2+ comments)
- Always clickable (no more `isInteractive` prop)
- Blue border when selected

### CommentOverlay
- Renders all pins for current route
- Handles click-to-create-thread
- Only allows creation when commenting enabled

### CommentDrawer
- Right-side drawer that shows selected thread
- Three sections:
  1. **Thread Info** - location, count, delete button
  2. **Comments List** - all comments with edit/delete
  3. **Add Reply** - new reply form (when commenting enabled)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Enter** | Save edit / Add reply |
| **Shift+Enter** | New line in textarea |
| **Escape** | Cancel edit |

## API Changes

### Old API (Removed)
```typescript
// ❌ These no longer exist
addComment(x, y, route): string
updateComment(id, text): void
deleteComment(id): void
clearAllComments(): void
getCommentsForRoute(route): Comment[]
comments: Comment[]
```

### New API (Current)
```typescript
// ✅ Use these instead
addThread(x, y, route): string
addReply(threadId, text): void
updateComment(threadId, commentId, text): void
deleteComment(threadId, commentId): void
deleteThread(threadId): void
clearAllThreads(): void
getThreadsForRoute(route): Thread[]
threads: Thread[]
```

## Migration Notes

### Automatic Conversion
If you have existing comments when upgrading:
1. System detects old `apollo-comments` key
2. Each comment converted to a thread with 1 comment
3. Saves to new `apollo-threads` key
4. Removes old key
5. No data loss

### Manual Migration (if needed)
```javascript
// Old format
{
  "id": "comment-123",
  "x": 350,
  "y": 200,
  "text": "My comment",
  "createdAt": "2025-10-29T12:00:00.000Z",
  "route": "/dashboard"
}

// New format
{
  "id": "comment-123",  // Same ID preserved
  "x": 350,
  "y": 200,
  "route": "/dashboard",
  "comments": [
    {
      "id": "comment-123-comment-0",
      "text": "My comment",
      "createdAt": "2025-10-29T12:00:00.000Z"
    }
  ]
}
```

## Benefits of Threading

### User Benefits
1. **Multiple comments per location** - Can have discussions
2. **Always viewable** - Can browse comments even when commenting disabled
3. **Visual count indicator** - See how many comments at a glance
4. **Chronological history** - Comments ordered by time
5. **Individual editing** - Edit any comment in a thread

### Developer Benefits
1. **Cleaner data model** - One thread object vs many comment objects
2. **Better organization** - Related comments grouped together
3. **Easier to extend** - Can add thread-level metadata
4. **Simpler UI** - One drawer instead of many popovers
5. **No positioning issues** - Drawer always in consistent location

## Testing Checklist

### Basic Threading
- [ ] Create thread with initial comment
- [ ] Add 2-3 replies to thread
- [ ] Pin shows correct number
- [ ] All comments appear in sidebar

### Edit/Delete
- [ ] Edit first comment
- [ ] Edit a reply
- [ ] Delete a reply (not last one)
- [ ] Delete entire thread
- [ ] Cannot delete when only 1 comment (must delete thread)

### Read-Only Mode
- [ ] Uncheck "Enable Commenting"
- [ ] Click pin → sidebar opens
- [ ] Can see all comments
- [ ] No Edit/Delete/Add Reply buttons visible

### Persistence
- [ ] Add thread with multiple replies
- [ ] Refresh page
- [ ] Pin shows correct number
- [ ] Click pin → all comments still there
- [ ] localStorage has `apollo-threads` key

### Migration
- [ ] If upgrading: Old comments convert to threads
- [ ] No data loss
- [ ] Old key removed
- [ ] New key created

### Route Filtering
- [ ] Add threads on multiple routes
- [ ] Each route shows only its threads
- [ ] Pin numbers correct per route
- [ ] Sidebar shows correct threads

## Future Enhancements (Not Implemented)

- User avatars per comment
- Comment reactions/likes
- @mentions
- Comment sorting/filtering
- Thread resolution status
- Export/import threads as JSON
- Backend sync
- Real-time collaboration
- Comment search

## Troubleshooting

### Pin shows wrong number
- Check browser console for errors
- Verify `thread.comments.length` in localStorage
- Try clearing and recreating thread

### Sidebar doesn't open
- Ensure "Show Pins" is checked
- Check browser console
- Verify `selectedThreadId` is set

### Comments not persisting
- Check localStorage is enabled
- Not in private/incognito mode?
- Check `apollo-threads` key exists
- Verify JSON is valid

### Migration issues
- Old comments might be corrupted
- Try: Clear localStorage, refresh, start fresh
- Check migration logic in CommentContext

## Summary

The threaded comment system provides:
✅ Multiple comments per pin  
✅ Always-clickable pins (read-only when commenting disabled)  
✅ Visual comment count indicators  
✅ Clean sidebar interface  
✅ Automatic migration from old format  
✅ Full route-specific filtering  
✅ Complete edit/delete functionality  
✅ localStorage persistence  

Everything works offline, no backend required.


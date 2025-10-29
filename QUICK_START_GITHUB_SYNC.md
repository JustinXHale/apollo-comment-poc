# 🚀 Quick Start: GitHub Sync

## Setup (5 minutes)

### 1. Get GitHub Token
1. Visit https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scope: ✅ `repo`
4. Copy token

### 2. Create `.env.local`
```bash
VITE_GITHUB_TOKEN=ghp_your_token_here
VITE_GITHUB_OWNER=JustinXHale
VITE_GITHUB_REPO=apollo-comment-poc
```

### 3. Restart Server
```bash
npm run start:dev
```

## ✅ Test Checklist

- [ ] 1. Create a pin → Check GitHub for new issue
- [ ] 2. Add a reply → Check GitHub for new comment
- [ ] 3. Refresh page → Comments reload from GitHub
- [ ] 4. Click sync button (↻) → Fetches latest from GitHub
- [ ] 5. Delete thread → Issue closes on GitHub
- [ ] 6. Work offline → Status shows "Local Only"

## 🎯 What to Look For

### In the UI
- **Sync Status Badge**: Green "Synced" = working
- **Issue Link**: Click to view on GitHub
- **Author Names**: Shows `@username` for synced comments
- **Sync Button**: Manual refresh (↻ icon)

### In GitHub
- **Issue Title**: `Comment Thread at (x, y)`
- **Labels**: `apollo-comment`, `route:/path`, `coords:x,y`
- **Comments**: Each reply appears as a comment
- **Closed Issues**: Deleted threads

### In Console
```
✅ Created GitHub Issue #123
✅ Added comment to Issue #123
✅ Synced 5 threads from GitHub
```

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| "Missing GitHub token" | Create `.env.local` and restart |
| Status stuck on "Local Only" | Verify token/owner/repo in `.env.local` |
| "Failed to create issue" | Check token has `repo` scope |
| Changes not syncing | Check console for errors, click sync button |

## 📁 Files Changed

- ✨ **NEW**: `src/app/services/githubAdapter.ts`
- 🔧 **UPDATED**: `src/app/context/CommentContext.tsx`
- 🔧 **UPDATED**: `src/app/components/comments/CommentDrawer.tsx`
- 🔧 **UPDATED**: `src/typings.d.ts`
- 📦 **ADDED**: `axios` npm package

## 🔗 Links

- [Full Implementation Guide](./GITHUB_SYNC_IMPLEMENTATION.md)
- [Setup Instructions](./GITHUB_SYNC_SETUP.md)
- [GitHub Repo](https://github.com/JustinXHale/apollo-comment-poc)

---

**Need help?** Check the console for detailed error messages.


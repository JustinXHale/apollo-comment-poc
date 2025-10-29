# GitHub Sync Setup for Apollo Comment System

This guide explains how to configure GitHub integration for the Apollo comment system.

## Prerequisites

- A GitHub account
- A GitHub repository where you want to store comment threads as Issues
- A GitHub Personal Access Token

## Setup Instructions

### 1. Create a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name: "Apollo Comment System"
4. Select the following scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't be able to see it again!)

### 2. Create `.env.local` File

In the root of this project, create a file named `.env.local`:

```bash
# GitHub Integration for Apollo Comment System

# Your GitHub Personal Access Token
VITE_GITHUB_TOKEN=ghp_your_token_here

# GitHub Repository Owner (username or organization)
VITE_GITHUB_OWNER=JustinXHale

# GitHub Repository Name
VITE_GITHUB_REPO=apollo-comment-poc
```

⚠️ **Important**: The `.env.local` file is ignored by Git to protect your credentials.

### 3. Restart Development Server

After creating `.env.local`, restart your development server:

```bash
npm run start:dev
```

## How It Works

### Thread → GitHub Issue Mapping

- **Each comment thread (pin)** creates a GitHub Issue
- Issue title: `Comment Thread at (x, y)`
- Issue body: Initial thread description
- Labels: `apollo-comment`, `route:/path/to/route`, `coords:x,y`

### Reply → GitHub Comment Mapping

- **Each reply** creates a GitHub Issue Comment
- Comments are synced bidirectionally

### Sync Behavior

1. **On App Load**: Fetches existing issues for the current route
2. **Create Thread**: Immediately creates a GitHub Issue
3. **Add Reply**: Immediately creates a GitHub Comment
4. **Delete Thread**: Closes the GitHub Issue
5. **Delete Comment**: Deletes the GitHub Comment

### Offline Mode

- If GitHub is not configured, comments work **locally only**
- Data persists in browser `localStorage`
- Sync status badge shows "Local Only"

## Sync Status Indicators

- 🟢 **Synced**: Thread/comment successfully synced with GitHub
- ⚪ **Local Only**: GitHub not configured or not yet synced
- 🔵 **Syncing...**: Currently syncing with GitHub
- 🔴 **Sync Error**: Failed to sync (check console for details)

## Testing

1. **Enable commenting** in the top toolbar
2. **Click anywhere** on a page to create a new pin
3. **Check GitHub**: A new issue should appear in your repo
4. **Add a reply**: It should appear as a comment on the issue
5. **Refresh the page**: Comments should reload from GitHub

## Troubleshooting

### "⚠️ Missing GitHub token" in console

- Create `.env.local` with your token
- Restart the dev server

### "❌ Failed to create GitHub Issue"

- Check token permissions (needs `repo` scope)
- Verify owner/repo names are correct
- Check GitHub API rate limits

### Comments not syncing

- Open browser DevTools → Console
- Look for GitHub API errors
- Verify network connectivity

## Security Notes

- ⚠️ **Never commit** `.env.local` to Git
- 🔒 Store tokens securely
- 🔄 Rotate tokens periodically
- 👥 Use fine-grained tokens for production

## Repository Configuration

Current default configuration:
- **Owner**: `JustinXHale`
- **Repo**: `apollo-comment-poc`
- **URL**: https://github.com/JustinXHale/apollo-comment-poc

To use a different repository, update the values in `.env.local`.


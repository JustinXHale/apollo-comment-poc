# Jira & Confluence MCP Setup Guide

## ✅ Step 1: Prerequisites - COMPLETED
- ✅ Podman is installed and running
- ✅ MCP Atlassian Docker image has been pulled

## 🔑 Step 2: Create Personal Access Tokens

You need to create Personal Access Tokens (PAT) for both Jira and Confluence.

### For Jira:
1. Log into your company's Jira instance
2. Click your avatar (top right) → **Profile** → **Personal Access Tokens**
3. Click **Create token**
4. Give it a name: `Cursor Integration`
5. Set an expiry date (recommended)
6. Click **Create** and **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### For Confluence:
1. Log into your company's Confluence instance
2. Click your avatar → **Profile** → **Personal Access Tokens**
3. Click **Create token**
4. Give it a name: `Cursor Integration`
5. Set an expiry date (recommended)
6. Click **Create** and **COPY THE TOKEN IMMEDIATELY**

## 🔧 Step 3: Configure Cursor

Once you have both tokens, you need to add the configuration to Cursor:

### Option A: Using Cursor Settings UI (Recommended)
1. Open Cursor
2. Go to **Settings** (⌘+,) → **Features** → **MCP**
3. Click **+ Add new global MCP server**
4. Copy the configuration from `.cursor-mcp-config.json` in this project
5. Replace the placeholder values:
   - `CONFLUENCE_URL`: Your company's Confluence URL
   - `CONFLUENCE_PERSONAL_TOKEN`: The token you created for Confluence
   - `JIRA_URL`: Your company's Jira URL
   - `JIRA_PERSONAL_TOKEN`: The token you created for Jira
6. Save the configuration
7. **Restart Cursor** for changes to take effect

### Option B: Manual Configuration File Edit
The configuration file is typically located at:
- macOS: `~/Library/Application Support/Cursor/User/globalStorage/settings.json`

Add the MCP server configuration from `.cursor-mcp-config.json` to this file.

## 🎯 Step 4: Test the Integration

Once Cursor restarts, test the integration by asking:

### Jira Examples:
- "Show me my current Jira tickets"
- "Search for all high-priority bugs in project XYZ"
- "Show me details of PROJ-123"
- "List all tickets assigned to me"

### Confluence Examples:
- "Summarize the Dashboard Design Specification page"
- "Search for documentation about API in our Confluence"
- "Show me the content of 'API Documentation' page"

## 🔒 Security Notes

- **DO NOT commit** `.cursor-mcp-config.json` with real tokens to Git
- The file has been added to `.gitignore` for safety
- Rotate tokens periodically for security
- Consider using a dedicated service account

## 🚀 Advanced Options

### Limit to Specific Jira Projects
Add this to the `env` section:
```json
"JIRA_PROJECTS_FILTER": "PROJ1,PROJ2,OPS"
```

### Disable Wait Behavior (faster, async)
Add this to the `env` section:
```json
"MCP_DISABLE_WAIT": "true"
```

## 📋 Configuration Template

The configuration template has been created at:
`.cursor-mcp-config.json`

## ❓ Troubleshooting

### "Cannot connect to MCP server"
- Ensure Podman is running: `podman machine list`
- Start if needed: `podman machine start podman-machine-default`
- Restart Cursor

### "Authentication failed"
- Verify your PAT tokens are correct
- Check token hasn't expired
- Ensure you have proper permissions in Jira/Confluence

### "SSL verification failed"
- If using self-signed certificates, you may need to set:
  ```json
  "CONFLUENCE_SSL_VERIFY": "false",
  "JIRA_SSL_VERIFY": "false"
  ```
  (Only use this if absolutely necessary and you trust the connection)

## 📚 What You Can Do

Once configured, you can:
- **Search & Query**: Find issues, tickets, documentation
- **Compare Code**: Check code against Jira specifications
- **Summarize**: Get AI summaries of Confluence pages
- **Create/Update** (if write permissions enabled): Create tickets, update status, add comments
- **Documentation**: Generate documentation based on code

---

**Next Steps:**
1. Create your Personal Access Tokens
2. Update `.cursor-mcp-config.json` with your real URLs and tokens
3. Add the configuration to Cursor Settings
4. Restart Cursor
5. Test with a simple query!



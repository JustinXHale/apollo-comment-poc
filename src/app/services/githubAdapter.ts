import axios from 'axios';

const API_BASE = 'https://api.github.com';

// Safely access environment variables using import.meta.env (Vite requirement)
const token = import.meta.env?.VITE_GITHUB_TOKEN;
const owner = import.meta.env?.VITE_GITHUB_OWNER;
const repo  = import.meta.env?.VITE_GITHUB_REPO;

// Debug logging (safe for production - doesn't expose full token)
console.log("🔧 GitHub Config Check:", {
  hasToken: !!token,
  tokenPrefix: token?.slice(0, 4) + '...',
  owner: owner || '(missing)',
  repo: repo || '(missing)'
});

if (!token && typeof window !== 'undefined') {
  console.warn('⚠️ Missing GitHub token. GitHub sync disabled. Configure .env.local with VITE_GITHUB_TOKEN.');
}

export const isGitHubConfigured = (): boolean => {
  return !!(token && owner && repo);
};

// Structured result type for GitHub API calls
export interface GitHubResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export const githubAdapter = {
  /**
   * Create a new GitHub Issue for a comment thread
   */
  async createIssue(title: string, body: string, route: string, x: number, y: number): Promise<GitHubResult> {
    if (!isGitHubConfigured()) {
      console.warn('GitHub not configured. Skipping issue creation.');
      return { success: false, error: 'GitHub not configured' };
    }

    try {
      // Debug: log config (without token)
      console.log('🔍 Creating issue:', { owner, repo, hasToken: !!token });
      
      // First, try to create issue
      const issueBody = {
        title,
        body: `${body}\n\n---\n**Metadata:**\n- Route: \`${route}\`\n- Coordinates: \`(${Math.round(x)}, ${Math.round(y)})\``,
      };

      const res = await axios.post(
        `${API_BASE}/repos/${owner}/${repo}/issues`,
        issueBody,
        {
          headers: { Authorization: `token ${token}` },
        }
      );
      console.log('✅ Created GitHub Issue #', res.data.number);
      
      // Try to add labels after creation (non-blocking)
      try {
        await axios.post(
          `${API_BASE}/repos/${owner}/${repo}/issues/${res.data.number}/labels`,
          { labels: ['apollo-comment', `route:${route}`, `coords:${Math.round(x)},${Math.round(y)}`] },
          { headers: { Authorization: `token ${token}` } }
        );
        console.log('✅ Added labels to Issue #', res.data.number);
      } catch (labelError) {
        console.warn('⚠️ Could not add labels (labels may not exist in repo)');
        // Continue anyway - issue was created successfully
      }
      
      return { success: true, data: res.data };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create issue';
      console.error('❌ Failed to create GitHub Issue:', {
        message: errorMessage,
        status: error?.response?.status,
        data: error?.response?.data,
        owner,
        repo,
        hasToken: !!token
      });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Add a comment to an existing GitHub Issue
   */
  async createComment(issueNumber: number, body: string): Promise<GitHubResult> {
    if (!isGitHubConfigured()) {
      console.warn('GitHub not configured. Skipping comment creation.');
      return { success: false, error: 'GitHub not configured' };
    }

    try {
      const res = await axios.post(
        `${API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
        { body },
        { headers: { Authorization: `token ${token}` } }
      );
      console.log(`✅ Added comment to Issue #${issueNumber}`);
      return { success: true, data: res.data };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create comment';
      console.error(`❌ Failed to add comment to Issue #${issueNumber}:`, errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Fetch all issues for a specific route
   */
  async fetchIssues(route: string) {
    if (!isGitHubConfigured()) {
      console.warn('GitHub not configured. Skipping issue fetch.');
      return [];
    }

    try {
      // Fetch all open issues (can't rely on labels that might not exist)
      const res = await axios.get(
        `${API_BASE}/repos/${owner}/${repo}/issues`,
        {
          headers: { Authorization: `token ${token}` },
          params: {
            state: 'open',
            creator: owner, // Only get issues created by the authenticated user
          },
        }
      );
      
      // Filter issues by route (check for route in body metadata or labels)
      const filteredIssues = res.data.filter((issue: any) => {
        // Check if route is in the body metadata
        if (issue.body && issue.body.includes(`Route: \`${route}\``)) {
          return true;
        }
        // Check if route is in labels (for backward compatibility)
        if (issue.labels && issue.labels.some((l: any) => {
          const labelName = typeof l === 'string' ? l : l.name;
          return labelName === `route:${route}`;
        })) {
          return true;
        }
        return false;
      });
      
      console.log(`✅ Fetched ${filteredIssues.length} issues for route: ${route}`);
      return filteredIssues;
    } catch (error) {
      console.error(`❌ Failed to fetch issues for route ${route}:`, error);
      return [];
    }
  },

  /**
   * Fetch all comments for a specific issue
   */
  async fetchComments(issueNumber: number) {
    if (!isGitHubConfigured()) {
      console.warn('GitHub not configured. Skipping comment fetch.');
      return [];
    }

    try {
      const res = await axios.get(
        `${API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
        { headers: { Authorization: `token ${token}` } }
      );
      console.log(`✅ Fetched ${res.data.length} comments for Issue #${issueNumber}`);
      return res.data;
    } catch (error) {
      console.error(`❌ Failed to fetch comments for Issue #${issueNumber}:`, error);
      return [];
    }
  },

  /**
   * Close a GitHub Issue (when deleting a thread)
   */
  async closeIssue(issueNumber: number): Promise<GitHubResult> {
    if (!isGitHubConfigured()) {
      console.warn('GitHub not configured. Skipping issue close.');
      return { success: false, error: 'GitHub not configured' };
    }

    try {
      const res = await axios.patch(
        `${API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}`,
        { state: 'closed' },
        { headers: { Authorization: `token ${token}` } }
      );
      console.log(`✅ Closed Issue #${issueNumber}`);
      return { success: true, data: res.data };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to close issue';
      console.error(`❌ Failed to close Issue #${issueNumber}:`, errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Update an existing comment on a GitHub Issue
   */
  async updateComment(commentId: number, body: string): Promise<GitHubResult> {
    if (!isGitHubConfigured()) {
      console.warn('GitHub not configured. Skipping comment update.');
      return { success: false, error: 'GitHub not configured' };
    }

    try {
      const res = await axios.patch(
        `${API_BASE}/repos/${owner}/${repo}/issues/comments/${commentId}`,
        { body },
        { headers: { Authorization: `token ${token}` } }
      );
      console.log(`✅ Updated comment #${commentId}`);
      return { success: true, data: res.data };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update comment';
      console.error(`❌ Failed to update comment #${commentId}:`, errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Delete a comment on a GitHub Issue
   */
  async deleteComment(commentId: number): Promise<GitHubResult> {
    if (!isGitHubConfigured()) {
      console.warn('GitHub not configured. Skipping comment deletion.');
      return { success: false, error: 'GitHub not configured' };
    }

    try {
      await axios.delete(
        `${API_BASE}/repos/${owner}/${repo}/issues/comments/${commentId}`,
        { headers: { Authorization: `token ${token}` } }
      );
      console.log(`✅ Deleted comment #${commentId}`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete comment';
      console.error(`❌ Failed to delete comment #${commentId}:`, errorMessage);
      return { success: false, error: errorMessage };
    }
  },
};


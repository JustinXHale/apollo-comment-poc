import axios from 'axios';

const API_BASE = '/.netlify/functions/github-api';

// Get stored OAuth token from localStorage
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('github_access_token');
  console.log('🔑 getStoredToken:', token ? 'Token found' : 'No token found');
  return token;
};

const getStoredUser = (): { login: string; avatar: string } | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('github_user');
  return userStr ? JSON.parse(userStr) : null;
};

// Store OAuth token and user info
export const storeGitHubAuth = (token: string, login: string, avatar: string) => {
  localStorage.setItem('github_access_token', token);
  localStorage.setItem('github_user', JSON.stringify({ login, avatar }));
};

// Clear OAuth token and user info
export const clearGitHubAuth = () => {
  localStorage.removeItem('github_access_token');
  localStorage.removeItem('github_user');
};

// Get current authenticated user
export const getAuthenticatedUser = () => {
  return getStoredUser();
};

export const isGitHubConfigured = (): boolean => {
  const token = getStoredToken();
  const owner = process.env.VITE_GITHUB_OWNER;
  const repo = process.env.VITE_GITHUB_REPO;
  console.log('🔍 isGitHubConfigured check:', { hasToken: !!token, owner, repo });
  return !!(token && owner && repo);
};

// Structured result type for GitHub API calls
export interface GitHubResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper to make authenticated GitHub API requests via proxy
async function makeGitHubRequest(
  method: string,
  endpoint: string,
  data?: any
): Promise<any> {
  const token = getStoredToken();
  if (!token) {
    throw new Error('Not authenticated with GitHub');
  }

  const response = await axios.post(API_BASE, {
    token,
    method,
    endpoint,
    data,
  });

  return response.data;
}

export const githubAdapter = {
  /**
   * Create a new GitHub Issue for a comment thread
   */
  async createIssue(title: string, body: string, route: string, x: number, y: number): Promise<GitHubResult> {
    console.log('🔵 createIssue called', { title, route, x, y });
    
    if (!isGitHubConfigured()) {
      console.warn('⚠️ GitHub not configured. Skipping issue creation.');
      return { success: false, error: 'Please sign in with GitHub' };
    }

    const owner = process.env.VITE_GITHUB_OWNER;
    const repo = process.env.VITE_GITHUB_REPO;
    console.log('🔵 GitHub config:', { owner, repo, hasToken: !!getStoredToken() });

    try {
      const issueBody = {
        title,
        body: `${body}\n\n---\n**Metadata:**\n- Route: \`${route}\`\n- Coordinates: \`(${Math.round(x)}, ${Math.round(y)})\``,
      };

      console.log('🔵 Calling makeGitHubRequest...');
      const issueData = await makeGitHubRequest('POST', `/repos/${owner}/${repo}/issues`, issueBody);
      console.log('✅ Created GitHub Issue #', issueData.number);

      // Try to add labels (non-blocking)
      try {
        await makeGitHubRequest(
          'POST',
          `/repos/${owner}/${repo}/issues/${issueData.number}/labels`,
          { labels: ['apollo-comment', `route:${route}`, `coords:${Math.round(x)},${Math.round(y)}`] }
        );
        console.log('✅ Added labels to Issue #', issueData.number);
      } catch (labelError) {
        console.warn('⚠️ Could not add labels (labels may not exist in repo)');
      }

      return { success: true, data: issueData };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create issue';
      console.error('❌ Failed to create GitHub Issue:', {
        message: errorMessage,
        error: error?.response?.data || error,
        status: error?.response?.status
      });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Add a comment to an existing GitHub Issue
   */
  async createComment(issueNumber: number, body: string): Promise<GitHubResult> {
    if (!isGitHubConfigured()) {
      return { success: false, error: 'Please sign in with GitHub' };
    }

    const owner = process.env.VITE_GITHUB_OWNER;
    const repo = process.env.VITE_GITHUB_REPO;

    try {
      const commentData = await makeGitHubRequest(
        'POST',
        `/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
        { body }
      );
      console.log(`✅ Added comment to Issue #${issueNumber}`);
      return { success: true, data: commentData };
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

    const owner = process.env.VITE_GITHUB_OWNER;
    const repo = process.env.VITE_GITHUB_REPO;

    try {
      const issues = await makeGitHubRequest(
        'GET',
        `/repos/${owner}/${repo}/issues?state=open`
      );

      // Filter issues by route
      const filteredIssues = issues.filter((issue: any) => {
        if (issue.body && issue.body.includes(`Route: \`${route}\``)) {
          return true;
        }
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
      return [];
    }

    const owner = process.env.VITE_GITHUB_OWNER;
    const repo = process.env.VITE_GITHUB_REPO;

    try {
      const comments = await makeGitHubRequest(
        'GET',
        `/repos/${owner}/${repo}/issues/${issueNumber}/comments`
      );
      console.log(`✅ Fetched ${comments.length} comments for Issue #${issueNumber}`);
      return comments;
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
      return { success: false, error: 'Please sign in with GitHub' };
    }

    const owner = process.env.VITE_GITHUB_OWNER;
    const repo = process.env.VITE_GITHUB_REPO;

    try {
      const issueData = await makeGitHubRequest(
        'PATCH',
        `/repos/${owner}/${repo}/issues/${issueNumber}`,
        { state: 'closed' }
      );
      console.log(`✅ Closed Issue #${issueNumber}`);
      return { success: true, data: issueData };
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
      return { success: false, error: 'Please sign in with GitHub' };
    }

    const owner = process.env.VITE_GITHUB_OWNER;
    const repo = process.env.VITE_GITHUB_REPO;

    try {
      const commentData = await makeGitHubRequest(
        'PATCH',
        `/repos/${owner}/${repo}/issues/comments/${commentId}`,
        { body }
      );
      console.log(`✅ Updated comment #${commentId}`);
      return { success: true, data: commentData };
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
      return { success: false, error: 'Please sign in with GitHub' };
    }

    const owner = process.env.VITE_GITHUB_OWNER;
    const repo = process.env.VITE_GITHUB_REPO;

    try {
      await makeGitHubRequest(
        'DELETE',
        `/repos/${owner}/${repo}/issues/comments/${commentId}`
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

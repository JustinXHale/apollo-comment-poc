import axios from 'axios';

const getApiBase = (): string => {
  if (typeof window === 'undefined') return '/api/gitlab-api';
  const isNetlify = window.location.hostname.includes('netlify.app');
  return isNetlify ? '/.netlify/functions/gitlab-api' : '/api/gitlab-api';
};

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gitlab_access_token');
};

export const isGitLabConfigured = (): boolean => {
  const token = getStoredToken();
  const projectPath = process.env.VITE_GITLAB_PROJECT_PATH;
  const baseUrl = process.env.VITE_GITLAB_BASE_URL || 'https://gitlab.com';
  return !!(token && projectPath && baseUrl);
};

export interface GitLabResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

async function makeGitLabRequest(
  method: string,
  endpoint: string,
  data?: any
): Promise<any> {
  const token = getStoredToken();
  if (!token) {
    throw new Error('Not authenticated with GitLab');
  }
  const baseUrl = process.env.VITE_GITLAB_BASE_URL || 'https://gitlab.com';
  const response = await axios.post(getApiBase(), {
    token,
    method,
    endpoint,
    data,
    baseUrl
  });
  return response.data;
}

const encodeProject = (p: string) => encodeURIComponent(p);

export const gitlabAdapter = {
  async createIssue(
    title: string,
    body: string,
    route: string,
    x: number,
    y: number,
    version?: string,
    iteration?: string
  ): Promise<GitLabResult> {
    if (!isGitLabConfigured()) {
      return { success: false, error: 'Please sign in with GitLab' };
    }

    try {
      const projectPath = process.env.VITE_GITLAB_PROJECT_PATH!;
      const labels = ['apollo-comment', `route:${route}`, `coords:${Math.round(x)},${Math.round(y)}`];
      if (version) labels.push(`version:${version}`);
      if (iteration) labels.push(`iteration:${iteration}`);

      const issue = await makeGitLabRequest(
        'POST',
        `/projects/${encodeProject(projectPath)}/issues`,
        { title, description: body, labels: labels.join(',') }
      );
      // Normalize iid as number like GitHub's issue.number
      return { success: true, data: { ...issue, number: issue.iid } };
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to create GitLab issue';
      return { success: false, error: message };
    }
  },

  async createComment(issueNumber: number, body: string): Promise<GitLabResult> {
    if (!isGitLabConfigured()) {
      return { success: false, error: 'Please sign in with GitLab' };
    }
    try {
      const projectPath = process.env.VITE_GITLAB_PROJECT_PATH!;
      const note = await makeGitLabRequest(
        'POST',
        `/projects/${encodeProject(projectPath)}/issues/${issueNumber}/notes`,
        { body }
      );
      return { success: true, data: note };
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to create GitLab comment';
      return { success: false, error: message };
    }
  },

  async updateComment(commentId: number, body: string): Promise<GitLabResult> {
    if (!isGitLabConfigured()) {
      return { success: false, error: 'Please sign in with GitLab' };
    }
    try {
      const projectPath = process.env.VITE_GITLAB_PROJECT_PATH!;
      const note = await makeGitLabRequest(
        'PUT',
        `/projects/${encodeProject(projectPath)}/notes/${commentId}`,
        { body }
      );
      return { success: true, data: note };
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to update GitLab comment';
      return { success: false, error: message };
    }
  },

  async deleteComment(commentId: number): Promise<GitLabResult> {
    if (!isGitLabConfigured()) {
      return { success: false, error: 'Please sign in with GitLab' };
    }
    try {
      const projectPath = process.env.VITE_GITLAB_PROJECT_PATH!;
      await makeGitLabRequest(
        'DELETE',
        `/projects/${encodeProject(projectPath)}/notes/${commentId}`
      );
      return { success: true };
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to delete GitLab comment';
      return { success: false, error: message };
    }
  },

  async closeIssue(issueNumber: number): Promise<GitLabResult> {
    if (!isGitLabConfigured()) {
      return { success: false, error: 'Please sign in with GitLab' };
    }
    try {
      const projectPath = process.env.VITE_GITLAB_PROJECT_PATH!;
      const issue = await makeGitLabRequest(
        'PUT',
        `/projects/${encodeProject(projectPath)}/issues/${issueNumber}`,
        { state_event: 'close' }
      );
      return { success: true, data: issue };
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to close GitLab issue';
      return { success: false, error: message };
    }
  },

  async fetchIssues(route: string) {
    if (!isGitLabConfigured()) {
      return [];
    }
    try {
      const projectPath = process.env.VITE_GITLAB_PROJECT_PATH!;
      const issues = await makeGitLabRequest(
        'GET',
        `/projects/${encodeProject(projectPath)}/issues?state=opened&per_page=100`
      );
      return (issues || []).filter((issue: any) => {
        const labels: string[] = issue.labels || [];
        const routeLabel = labels.some(l => l === `route:${route}`);
        const inBody = (issue.description || '').includes(`Route: \`${route}\``);
        return routeLabel || inBody;
      });
    } catch {
      return [];
    }
  },

  async fetchComments(issueNumber: number) {
    if (!isGitLabConfigured()) {
      return [];
    }
    try {
      const projectPath = process.env.VITE_GITLAB_PROJECT_PATH!;
      const notes = await makeGitLabRequest(
        'GET',
        `/projects/${encodeProject(projectPath)}/issues/${issueNumber}/notes?per_page=100`
      );
      return notes || [];
    } catch {
      return [];
    }
  }
};



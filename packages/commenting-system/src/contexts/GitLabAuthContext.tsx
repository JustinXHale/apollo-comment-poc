import * as React from 'react';

interface GitLabUser {
  username?: string;
  avatar?: string;
}

interface GitLabAuthContextType {
  user: GitLabUser | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  getToken: () => string | null;
}

const GitLabAuthContext = React.createContext<GitLabAuthContextType | undefined>(undefined);

const GITLAB_TOKEN_KEY = 'gitlab_access_token';
const GITLAB_USER_KEY = 'gitlab_user';

export const GitLabAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<GitLabUser | null>(null);

  // Load existing auth on mount
  React.useEffect(() => {
    try {
      const token = localStorage.getItem(GITLAB_TOKEN_KEY);
      const userStr = localStorage.getItem(GITLAB_USER_KEY);
      if (token && userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch {
      // ignore
    }
  }, []);

  // Handle OAuth callback shared route: #/auth-callback?gitlab_token=...&gitlab_username=...&gitlab_avatar=...
  React.useEffect(() => {
    const handleCallback = () => {
      const hash = window.location.hash;
      if (hash.includes('#/auth-callback')) {
        const params = new URLSearchParams(hash.split('?')[1]);
        const token = params.get('gitlab_token');
        const username = params.get('gitlab_username') || undefined;
        const avatar = params.get('gitlab_avatar') || undefined;
        if (token) {
          localStorage.setItem(GITLAB_TOKEN_KEY, token);
          const u: GitLabUser = { username, avatar };
          localStorage.setItem(GITLAB_USER_KEY, JSON.stringify(u));
          setUser(u);
          // redirect to home
          window.location.hash = '/';
        }
      }
    };
    handleCallback();
  }, []);

  const getToken = React.useCallback((): string | null => {
    try {
      return localStorage.getItem(GITLAB_TOKEN_KEY);
    } catch {
      return null;
    }
  }, []);

  const login = () => {
    const clientId = process.env.VITE_GITLAB_CLIENT_ID;
    const baseUrl = process.env.VITE_GITLAB_BASE_URL || 'https://gitlab.com';
    if (!clientId) {
      // eslint-disable-next-line no-alert
      alert('GitLab login is not configured (missing VITE_GITLAB_CLIENT_ID).');
      return;
    }
    const redirectUri = `${window.location.origin}/api/auth/callback`;
    const scope = encodeURIComponent('read_user api'); // api scope for issues/comments
    const url =
      `${baseUrl}/oauth/authorize?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code&scope=${scope}`;
    window.location.href = url;
  };

  const logout = () => {
    try {
      localStorage.removeItem(GITLAB_TOKEN_KEY);
      localStorage.removeItem(GITLAB_USER_KEY);
    } finally {
      setUser(null);
    }
  };

  return (
    <GitLabAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!getToken(),
        login,
        logout,
        getToken
      }}
    >
      {children}
    </GitLabAuthContext.Provider>
  );
};

export const useGitLabAuth = () => {
  const ctx = React.useContext(GitLabAuthContext);
  if (!ctx) {
    throw new Error('useGitLabAuth must be used within a GitLabAuthProvider');
  }
  return ctx;
};



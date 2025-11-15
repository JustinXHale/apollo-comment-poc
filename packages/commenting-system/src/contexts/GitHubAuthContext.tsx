import * as React from 'react';
import { storeGitHubAuth, clearGitHubAuth, getAuthenticatedUser } from '../services/githubAdapter';

interface GitHubUser {
  login: string;
  avatar: string;
}

interface GitHubAuthContextType {
  user: GitHubUser | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const GitHubAuthContext = React.createContext<GitHubAuthContextType | undefined>(undefined);

export const GitHubAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<GitHubUser | null>(null);

  // Check for stored authentication on mount
  React.useEffect(() => {
    const storedUser = getAuthenticatedUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Handle OAuth callback
  React.useEffect(() => {
    const handleOAuthCallback = () => {
      const hash = window.location.hash;
      if (hash.includes('#/auth-callback')) {
        const params = new URLSearchParams(hash.split('?')[1]);
        const token = params.get('token');
        const login = params.get('login');
        const avatar = params.get('avatar');

        if (token && login && avatar) {
          storeGitHubAuth(token, login, decodeURIComponent(avatar));
          setUser({ login, avatar: decodeURIComponent(avatar) });
          
          // Redirect to home page
          window.location.hash = '/';
        }
      }
    };

    handleOAuthCallback();
  }, []);

  const login = () => {
    // Build GitHub OAuth URL client-side (works locally and in production)
    const clientId = process.env.VITE_GITHUB_CLIENT_ID;
    if (!clientId) {
      // eslint-disable-next-line no-alert
      alert('GitHub login is not configured (missing VITE_GITHUB_CLIENT_ID).');
      return;
    }
    
    const redirectUri = `${window.location.origin}/api/github-oauth-callback`;
    const scope = 'public_repo'; // Read/write access to public repositories
    const githubAuthUrl = 
      `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}`;
    
    console.log('🔍 GitHub OAuth redirect:', { clientId: 'present', redirectUri });
    window.location.href = githubAuthUrl;
  };

  const logout = () => {
    clearGitHubAuth();
    setUser(null);
  };

  return (
    <GitHubAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </GitHubAuthContext.Provider>
  );
};

export const useGitHubAuth = () => {
  const context = React.useContext(GitHubAuthContext);
  if (context === undefined) {
    throw new Error('useGitHubAuth must be used within a GitHubAuthProvider');
  }
  return context;
};


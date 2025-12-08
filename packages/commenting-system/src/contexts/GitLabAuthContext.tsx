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

// Mock provider for local-only mode (no actual OAuth)
export const GitLabAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = {
    user: null,
    isAuthenticated: false,
    login: () => {
      console.log('GitLab login not available in local mode');
    },
    logout: () => {
      console.log('GitLab logout not available in local mode');
    },
    getToken: () => null,
  };

  return (
    <GitLabAuthContext.Provider value={value}>
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

import * as React from 'react';

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

// Mock provider for local-only mode (no actual OAuth)
export const GitHubAuthProvider: React.FC<{ children: React.ReactNode; config?: any }> = ({ children }) => {
  const value = {
    user: null,
    isAuthenticated: false,
    login: () => {
      console.log('GitHub login not available in local mode');
    },
    logout: () => {
      console.log('GitHub logout not available in local mode');
    },
  };

  return (
    <GitHubAuthContext.Provider value={value}>
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

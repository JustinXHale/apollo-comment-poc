import * as React from 'react';

interface VersionContextType {
  currentVersion: string;
  setCurrentVersion: (version: string) => void;
}

const VersionContext = React.createContext<VersionContextType | undefined>(undefined);

const VERSION_STORAGE_KEY = 'hale-current-version';

export const VersionProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVersion, setCurrentVersionState] = React.useState<string>(() => {
    try {
      const stored = localStorage.getItem(VERSION_STORAGE_KEY);
      return stored || '3'; // Default to version 3 (current)
    } catch (error) {
      console.error('Failed to load version from localStorage:', error);
      return '3';
    }
  });

  // Persist version to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(VERSION_STORAGE_KEY, currentVersion);
    } catch (error) {
      console.error('Failed to save version to localStorage:', error);
    }
  }, [currentVersion]);

  const setCurrentVersion = React.useCallback((version: string) => {
    setCurrentVersionState(version);
  }, []);

  const value = React.useMemo(
    () => ({
      currentVersion,
      setCurrentVersion,
    }),
    [currentVersion, setCurrentVersion]
  );

  return <VersionContext.Provider value={value}>{children}</VersionContext.Provider>;
};

export const useVersion = (): VersionContextType => {
  const context = React.useContext(VersionContext);
  if (!context) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return context;
};


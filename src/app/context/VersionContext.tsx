import * as React from 'react';

interface VersionContextType {
  currentVersion: string;
  currentIteration: string;
  setCurrentVersion: (version: string) => void;
  setCurrentIteration: (iteration: string) => void;
}

const VersionContext = React.createContext<VersionContextType | undefined>(undefined);

const VERSION_STORAGE_KEY = 'apollo-current-version';
const ITERATION_STORAGE_KEY = 'apollo-current-iteration';

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

  const [currentIteration, setCurrentIterationState] = React.useState<string>(() => {
    try {
      const stored = localStorage.getItem(ITERATION_STORAGE_KEY);
      return stored || '';
    } catch (error) {
      console.error('Failed to load iteration from localStorage:', error);
      return '';
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

  // Persist iteration to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(ITERATION_STORAGE_KEY, currentIteration);
    } catch (error) {
      console.error('Failed to save iteration to localStorage:', error);
    }
  }, [currentIteration]);

  const setCurrentVersion = React.useCallback((version: string) => {
    setCurrentVersionState(version);
  }, []);

  const setCurrentIteration = React.useCallback((iteration: string) => {
    setCurrentIterationState(iteration);
  }, []);

  const value = React.useMemo(
    () => ({
      currentVersion,
      currentIteration,
      setCurrentVersion,
      setCurrentIteration,
    }),
    [currentVersion, currentIteration, setCurrentVersion, setCurrentIteration]
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


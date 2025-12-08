import * as React from 'react';

export interface Comment {
  id: string;
  author?: string;
  text: string;
  createdAt: string;
}

export interface Thread {
  id: string;
  x: number;
  y: number;
  route: string;
  comments: Comment[];
  version?: string;
}

interface CommentContextType {
  threads: Thread[];
  showPins: boolean;
  enableCommenting: boolean;
  toggleShowPins: () => void;
  toggleEnableCommenting: () => void;
  addThread: (x: number, y: number, route: string, version?: string) => string;
  addReply: (threadId: string, text: string) => void;
  updateComment: (threadId: string, commentId: string, text: string) => void;
  deleteComment: (threadId: string, commentId: string) => void;
  deleteThread: (threadId: string) => void;
  clearAllThreads: () => void;
  getThreadsForRoute: (route: string, version?: string) => Thread[];
}

const CommentContext = React.createContext<CommentContextType | undefined>(undefined);

const STORAGE_KEY = 'hale-threads';
const SHOW_PINS_KEY = 'hale-show-pins';
const ENABLE_COMMENTING_KEY = 'hale-enable-commenting';

// Migration function to convert old Apollo comments to Hale threads
const migrateOldComments = (): Thread[] => {
  try {
    const oldThreadsKey = localStorage.getItem('apollo-threads');
    const oldCommentsKey = localStorage.getItem('apollo-comments');
    
    // Try apollo-threads first (newer format)
    if (oldThreadsKey) {
      const parsed = JSON.parse(oldThreadsKey);
      // Clean up sync-related fields
      const cleanThreads: Thread[] = parsed.map((t: any) => ({
        id: t.id,
        x: t.x,
        y: t.y,
        route: t.route,
        comments: t.comments.map((c: any) => ({
          id: c.id,
          text: c.text || '',
          createdAt: c.createdAt,
          author: c.author
        })),
        version: t.version
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanThreads));
      localStorage.removeItem('apollo-threads');
      return cleanThreads;
    }
    
    // Fallback to old apollo-comments format (oldest)
    if (oldCommentsKey) {
      const parsed = JSON.parse(oldCommentsKey);
      const threads: Thread[] = parsed.map((oldComment: any) => ({
        id: oldComment.id,
        x: oldComment.x,
        y: oldComment.y,
        route: oldComment.route,
        comments: [
          {
            id: `${oldComment.id}-comment-0`,
            text: oldComment.text || '',
            createdAt: oldComment.createdAt
          }
        ]
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
      localStorage.removeItem('apollo-comments');
      return threads;
    }
  } catch (error) {
    console.error('Failed to migrate old comments:', error);
  }
  return [];
};

export const CommentProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage with migration
  const [threads, setThreads] = React.useState<Thread[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Try to migrate old comments
      return migrateOldComments();
    } catch (error) {
      console.error('Failed to load threads from localStorage:', error);
      return [];
    }
  });

  const [showPins, setShowPins] = React.useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(SHOW_PINS_KEY);
      if (stored !== null) return stored === 'true';
      // Check old key for migration
      const oldKey = localStorage.getItem('apollo-show-pins');
      return oldKey === 'true';
    } catch (error) {
      return false;
    }
  });

  const [enableCommenting, setEnableCommenting] = React.useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(ENABLE_COMMENTING_KEY);
      if (stored !== null) return stored === 'true';
      // Check old key for migration
      const oldKey = localStorage.getItem('apollo-enable-commenting');
      return oldKey === 'true';
    } catch (error) {
      return false;
    }
  });

  // Persist threads to localStorage whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    } catch (error) {
      console.error('Failed to save threads to localStorage:', error);
    }
  }, [threads]);

  // Persist showPins to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(SHOW_PINS_KEY, String(showPins));
    } catch (error) {
      console.error('Failed to save showPins to localStorage:', error);
    }
  }, [showPins]);

  // Persist enableCommenting to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(ENABLE_COMMENTING_KEY, String(enableCommenting));
    } catch (error) {
      console.error('Failed to save enableCommenting to localStorage:', error);
    }
  }, [enableCommenting]);

  const toggleShowPins = React.useCallback(() => {
    setShowPins(prev => !prev);
  }, []);

  const toggleEnableCommenting = React.useCallback(() => {
    setEnableCommenting(prev => !prev);
  }, []);

  const addThread = React.useCallback((x: number, y: number, route: string, version?: string): string => {
    const threadId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newThread: Thread = {
      id: threadId,
      x,
      y,
      route,
      comments: [],
      version
    };
    setThreads(prev => [...prev, newThread]);
    return threadId;
  }, []);

  const addReply = React.useCallback((threadId: string, text: string) => {
    const commentId = `${threadId}-comment-${Date.now()}`;
    const newComment: Comment = {
      id: commentId,
      text,
      createdAt: new Date().toISOString()
    };

    setThreads(prev =>
      prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            comments: [...t.comments, newComment]
          };
        }
        return t;
      })
    );
  }, []);

  const updateComment = React.useCallback((threadId: string, commentId: string, text: string) => {
    setThreads(prev =>
      prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            comments: t.comments.map(c =>
              c.id === commentId ? { ...c, text } : c
            )
          };
        }
        return t;
      })
    );
  }, []);

  const deleteComment = React.useCallback((threadId: string, commentId: string) => {
    setThreads(prev =>
      prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            comments: t.comments.filter(c => c.id !== commentId)
          };
        }
        return t;
      })
    );
  }, []);

  const deleteThread = React.useCallback((threadId: string) => {
    setThreads(prev => prev.filter(t => t.id !== threadId));
  }, []);

  const clearAllThreads = React.useCallback(() => {
    setThreads([]);
  }, []);

  const getThreadsForRoute = React.useCallback((route: string, version?: string): Thread[] => {
    return threads.filter(thread => {
      const routeMatch = thread.route === route;
      // Treat legacy comments (without version) as Version 3 (current)
      const threadVersion = thread.version || '3';
      const versionMatch = !version || threadVersion === version;
      return routeMatch && versionMatch;
    });
  }, [threads]);

  const value = React.useMemo(
    () => ({
      threads,
      showPins,
      enableCommenting,
      toggleShowPins,
      toggleEnableCommenting,
      addThread,
      addReply,
      updateComment,
      deleteComment,
      deleteThread,
      clearAllThreads,
      getThreadsForRoute
    }),
    [threads, showPins, enableCommenting, toggleShowPins, toggleEnableCommenting, addThread, addReply, updateComment, deleteComment, deleteThread, clearAllThreads, getThreadsForRoute]
  );

  return <CommentContext.Provider value={value}>{children}</CommentContext.Provider>;
};

export const useComments = (): CommentContextType => {
  const context = React.useContext(CommentContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
};

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
}

interface CommentContextType {
  threads: Thread[];
  showPins: boolean;
  enableCommenting: boolean;
  toggleShowPins: () => void;
  toggleEnableCommenting: () => void;
  addThread: (x: number, y: number, route: string) => string;
  addReply: (threadId: string, text: string) => void;
  updateComment: (threadId: string, commentId: string, text: string) => void;
  deleteComment: (threadId: string, commentId: string) => void;
  deleteThread: (threadId: string) => void;
  clearAllThreads: () => void;
  getThreadsForRoute: (route: string) => Thread[];
}

const CommentContext = React.createContext<CommentContextType | undefined>(undefined);

const STORAGE_KEY = 'apollo-threads';
const SHOW_PINS_KEY = 'apollo-show-pins';
const ENABLE_COMMENTING_KEY = 'apollo-enable-commenting';

// Migration function to convert old comments to threads
const migrateOldComments = (): Thread[] => {
  try {
    const oldComments = localStorage.getItem('apollo-comments');
    if (oldComments) {
      const parsed = JSON.parse(oldComments);
      // Convert old single comments to threads
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
      // Save to new key
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
      // Remove old key
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
      return stored === 'true';
    } catch (error) {
      return false;
    }
  });

  const [enableCommenting, setEnableCommenting] = React.useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(ENABLE_COMMENTING_KEY);
      return stored === 'true';
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

  const addThread = React.useCallback((x: number, y: number, route: string): string => {
    const threadId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newThread: Thread = {
      id: threadId,
      x,
      y,
      route,
      comments: [
        {
          id: `${threadId}-comment-0`,
          text: '',
          createdAt: new Date().toISOString()
        }
      ]
    };
    setThreads(prev => [...prev, newThread]);
    return threadId;
  }, []);

  const addReply = React.useCallback((threadId: string, text: string) => {
    setThreads(prev =>
      prev.map(thread => {
        if (thread.id === threadId) {
          const newComment: Comment = {
            id: `${threadId}-comment-${thread.comments.length}`,
            text,
            createdAt: new Date().toISOString()
          };
          return {
            ...thread,
            comments: [...thread.comments, newComment]
          };
        }
        return thread;
      })
    );
  }, []);

  const updateComment = React.useCallback((threadId: string, commentId: string, text: string) => {
    setThreads(prev =>
      prev.map(thread => {
        if (thread.id === threadId) {
          return {
            ...thread,
            comments: thread.comments.map(comment =>
              comment.id === commentId ? { ...comment, text } : comment
            )
          };
        }
        return thread;
      })
    );
  }, []);

  const deleteComment = React.useCallback((threadId: string, commentId: string) => {
    setThreads(prev =>
      prev.map(thread => {
        if (thread.id === threadId) {
          return {
            ...thread,
            comments: thread.comments.filter(comment => comment.id !== commentId)
          };
        }
        return thread;
      })
    );
  }, []);

  const deleteThread = React.useCallback((threadId: string) => {
    setThreads(prev => prev.filter(thread => thread.id !== threadId));
  }, []);

  const clearAllThreads = React.useCallback(() => {
    setThreads([]);
  }, []);

  const getThreadsForRoute = React.useCallback((route: string): Thread[] => {
    return threads.filter(thread => thread.route === route);
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


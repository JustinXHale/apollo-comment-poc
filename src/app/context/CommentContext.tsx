import * as React from 'react';
import { githubAdapter, isGitHubConfigured, GitHubResult } from '@app/services/githubAdapter';

export type SyncStatus = 'synced' | 'local' | 'pending' | 'syncing' | 'error';

export interface Comment {
  id: string;
  author?: string;
  text: string;
  createdAt: string;
  githubCommentId?: number; // GitHub comment ID for syncing
}

export interface Thread {
  id: string;
  x: number;
  y: number;
  route: string;
  comments: Comment[];
  issueNumber?: number; // GitHub Issue number
  syncStatus: SyncStatus; // Sync state
  syncError?: string; // Error message if sync failed
}

interface CommentContextType {
  threads: Thread[];
  showPins: boolean;
  enableCommenting: boolean;
  toggleShowPins: () => void;
  toggleEnableCommenting: () => void;
  addThread: (x: number, y: number, route: string) => string;
  addReply: (threadId: string, text: string) => Promise<void>;
  updateComment: (threadId: string, commentId: string, text: string) => Promise<void>;
  deleteComment: (threadId: string, commentId: string) => Promise<void>;
  deleteThread: (threadId: string) => Promise<void>;
  clearAllThreads: () => void;
  getThreadsForRoute: (route: string) => Thread[];
  syncFromGitHub: (route: string) => Promise<void>;
  retrySync: () => Promise<void>;
  isSyncing: boolean;
  hasPendingSync: boolean;
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

  const [isSyncing, setIsSyncing] = React.useState<boolean>(false);

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
      comments: [], // Start with no comments
      syncStatus: 'local'
    };
    setThreads(prev => [...prev, newThread]);

    // Async GitHub sync (non-blocking)
    if (isGitHubConfigured()) {
      (async () => {
        setThreads(prev => prev.map(t => 
          t.id === threadId ? { ...t, syncStatus: 'syncing' as const } : t
        ));

        const issue = await githubAdapter.createIssue(
          `Comment Thread at (${Math.round(x)}, ${Math.round(y)})`,
          `Thread created on route: ${route}\n\n(Initial comment will be added as a reply)`,
          route,
          x,
          y
        );

        if (issue.success && issue.data) {
          setThreads(prev => prev.map(t => 
            t.id === threadId 
              ? { ...t, issueNumber: issue.data.number, syncStatus: 'synced' as const }
              : t
          ));
        } else {
          setThreads(prev => prev.map(t => 
            t.id === threadId ? { ...t, syncStatus: 'error' as const, syncError: issue.error } : t
          ));
        }
      })();
    }

    return threadId;
  }, []);

  const addReply = React.useCallback(async (threadId: string, text: string) => {
    const commentId = `${threadId}-comment-${Date.now()}`;
    const newComment: Comment = {
      id: commentId,
      text,
      createdAt: new Date().toISOString()
    };

    // Find thread BEFORE optimistic update (to get issueNumber)
    const thread = threads.find(t => t.id === threadId);

    // Optimistically add comment locally
    setThreads(prev =>
      prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            comments: [...t.comments, newComment],
            syncStatus: 'pending' as const // Mark as pending sync
          };
        }
        return t;
      })
    );

    // Sync to GitHub if configured and thread has an issue number
    if (isGitHubConfigured() && thread?.issueNumber) {
      const result = await githubAdapter.createComment(thread.issueNumber, text);
      if (result.success && result.data) {
        // Update comment with GitHub ID and mark synced
        setThreads(prev =>
          prev.map(t => {
            if (t.id === threadId) {
              return {
                ...t,
                syncStatus: 'synced' as const,
                comments: t.comments.map(c =>
                  c.id === commentId ? { ...c, githubCommentId: result.data.id } : c
                )
              };
            }
            return t;
          })
        );
      } else {
        // Mark as error if sync failed
        setThreads(prev =>
          prev.map(t =>
            t.id === threadId ? { ...t, syncStatus: 'error' as const, syncError: result.error } : t
          )
        );
      }
    }
  }, [threads]);

  const updateComment = React.useCallback(async (threadId: string, commentId: string, text: string) => {
    // Find thread and comment BEFORE optimistic update
    const thread = threads.find(t => t.id === threadId);
    const comment = thread?.comments.find(c => c.id === commentId);

    // Optimistically update locally
    setThreads(prev =>
      prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            syncStatus: 'pending' as const,
            comments: t.comments.map(c =>
              c.id === commentId ? { ...c, text } : c
            )
          };
        }
        return t;
      })
    );

    // Sync to GitHub if configured
    if (isGitHubConfigured() && comment?.githubCommentId) {
      const result = await githubAdapter.updateComment(comment.githubCommentId, text);
      if (result.success) {
        setThreads(prev =>
          prev.map(t => t.id === threadId ? { ...t, syncStatus: 'synced' as const } : t)
        );
      } else {
        setThreads(prev =>
          prev.map(t =>
            t.id === threadId ? { ...t, syncStatus: 'error' as const, syncError: result.error } : t
          )
        );
      }
    }
  }, [threads]);

  const deleteComment = React.useCallback(async (threadId: string, commentId: string) => {
    // Get thread and comment BEFORE deleting
    const thread = threads.find(t => t.id === threadId);
    const comment = thread?.comments.find(c => c.id === commentId);

    // Optimistically delete locally
    setThreads(prev =>
      prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            syncStatus: 'pending' as const,
            comments: t.comments.filter(c => c.id !== commentId)
          };
        }
        return t;
      })
    );

    // Sync to GitHub if configured
    if (isGitHubConfigured() && comment?.githubCommentId) {
      const result = await githubAdapter.deleteComment(comment.githubCommentId);
      if (result.success) {
        setThreads(prev =>
          prev.map(t => t.id === threadId ? { ...t, syncStatus: 'synced' as const } : t)
        );
      } else {
        setThreads(prev =>
          prev.map(t =>
            t.id === threadId ? { ...t, syncStatus: 'error' as const, syncError: result.error } : t
          )
        );
      }
    }
  }, [threads]);

  const deleteThread = React.useCallback(async (threadId: string) => {
    // Get thread BEFORE deleting
    const thread = threads.find(t => t.id === threadId);

    // Optimistically delete locally
    setThreads(prev => prev.filter(t => t.id !== threadId));

    // Close GitHub Issue if configured
    if (isGitHubConfigured() && thread?.issueNumber) {
      const result = await githubAdapter.closeIssue(thread.issueNumber);
      if (!result.success) {
        console.error('Failed to close GitHub issue:', result.error);
      }
    }
  }, [threads]);

  const clearAllThreads = React.useCallback(() => {
    setThreads([]);
  }, []);

  const getThreadsForRoute = React.useCallback((route: string): Thread[] => {
    return threads.filter(thread => thread.route === route);
  }, [threads]);

  const syncFromGitHub = React.useCallback(async (route: string) => {
    if (!isGitHubConfigured()) {
      console.log('GitHub not configured. Skipping sync.');
      return;
    }

    setIsSyncing(true);
    console.log(`🔄 Syncing threads from GitHub for route: ${route}`);

    try {
      const issues = await githubAdapter.fetchIssues(route);
      const newThreads: Thread[] = [];

      for (const issue of issues) {
        // Parse coordinates from issue body metadata or labels (for backward compatibility)
        let coords: number[] | null = null;
        
        // Try to parse from body metadata first
        if (issue.body) {
          const coordMatch = issue.body.match(/Coordinates: `\((\d+),\s*(\d+)\)`/);
          if (coordMatch) {
            coords = [parseInt(coordMatch[1]), parseInt(coordMatch[2])];
          }
        }
        
        // Fallback: try to parse from labels
        if (!coords) {
          const coordLabel = issue.labels.find((l: any) => 
            typeof l === 'string' ? l.startsWith('coords:') : l.name?.startsWith('coords:')
          );
          const coordString = typeof coordLabel === 'string' ? coordLabel : coordLabel?.name;
          if (coordString) {
            const coordParts = coordString.replace('coords:', '').split(',').map(Number);
            if (coordParts.length === 2) {
              coords = coordParts;
            }
          }
        }
        
        if (!coords || coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
          console.warn(`Skipping issue #${issue.number}: invalid or missing coords`);
          continue;
        }

        // Fetch comments for this issue
        const ghComments = await githubAdapter.fetchComments(issue.number);

        // Convert GitHub issue body to first comment
        const comments: Comment[] = [];
        
        // Add issue body as first comment if it exists
        if (issue.body) {
          comments.push({
            id: `issue-${issue.number}-body`,
            text: issue.body,
            createdAt: issue.created_at,
            author: issue.user?.login,
            githubCommentId: undefined // Body is not a comment
          });
        }

        // Add all GitHub comments
        ghComments.forEach((ghComment: any) => {
          comments.push({
            id: `comment-${ghComment.id}`,
            text: ghComment.body,
            createdAt: ghComment.created_at,
            author: ghComment.user?.login,
            githubCommentId: ghComment.id
          });
        });

        newThreads.push({
          id: `github-${issue.number}`,
          x: coords[0],
          y: coords[1],
          route,
          comments,
          issueNumber: issue.number,
          syncStatus: 'synced'
        });
      }

      // Merge with existing local-only threads
      setThreads(prev => {
        const localOnlyThreads = prev.filter(t => t.route === route && !t.issueNumber);
        const mergedThreads = [
          ...prev.filter(t => t.route !== route), // Keep threads from other routes
          ...newThreads, // Add synced threads
          ...localOnlyThreads // Keep local-only threads
        ];
        return mergedThreads;
      });

      console.log(`✅ Synced ${newThreads.length} threads from GitHub`);
    } catch (error) {
      console.error('Failed to sync from GitHub:', error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const retrySync = React.useCallback(async () => {
    // TODO: Implement retry logic for failed syncs
    console.log('Retry sync not yet implemented');
  }, []);

  const hasPendingSync = React.useMemo(() => {
    return threads.some(t => t.syncStatus === 'pending' || t.syncStatus === 'error');
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
      getThreadsForRoute,
      syncFromGitHub,
      retrySync,
      isSyncing,
      hasPendingSync
    }),
    [threads, showPins, enableCommenting, toggleShowPins, toggleEnableCommenting, addThread, addReply, updateComment, deleteComment, deleteThread, clearAllThreads, getThreadsForRoute, syncFromGitHub, retrySync, isSyncing, hasPendingSync]
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


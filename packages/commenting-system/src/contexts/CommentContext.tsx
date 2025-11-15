import * as React from 'react';
import { githubAdapter, isGitHubConfigured, GitHubResult } from '../services/githubAdapter';
import { gitlabAdapter, isGitLabConfigured } from '../services/gitlabAdapter';

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
  version?: string; // Version (e.g., "1", "2", "3")
  provider?: 'github' | 'gitlab';
}

interface CommentContextType {
  threads: Thread[];
  showPins: boolean;
  enableCommenting: boolean;
  toggleShowPins: () => void;
  toggleEnableCommenting: () => void;
  addThread: (x: number, y: number, route: string, version?: string) => string;
  addReply: (threadId: string, text: string) => Promise<void>;
  updateComment: (threadId: string, commentId: string, text: string) => Promise<void>;
  deleteComment: (threadId: string, commentId: string) => Promise<void>;
  deleteThread: (threadId: string) => Promise<void>;
  clearAllThreads: () => void;
  getThreadsForRoute: (route: string, version?: string) => Thread[];
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

  const addThread = React.useCallback((x: number, y: number, route: string, version?: string): string => {
    const threadId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newThread: Thread = {
      id: threadId,
      x,
      y,
      route,
      comments: [], // Start with no comments
      syncStatus: 'local',
      version
    };
    setThreads(prev => [...prev, newThread]);

    // Async remote sync (GitHub or GitLab) - non-blocking
    if (isGitHubConfigured() || isGitLabConfigured()) {
      (async () => {
        setThreads(prev => prev.map(t => 
          t.id === threadId ? { ...t, syncStatus: 'syncing' as const } : t
        ));

        // Create a readable page name from route
        const pageName = route === '/' ? 'Home page' : route.split('/').filter(Boolean).join(' > ') || 'Page';
        const versionStr = version ? ` [v${version}]` : '';
        // Prefer GitHub if configured, otherwise GitLab
        let createdProvider: 'github' | 'gitlab' | undefined;
        let createdNumber: number | undefined;
        let createError: string | undefined;

        if (isGitHubConfigured()) {
          const issue = await githubAdapter.createIssue(
            `💬 ${pageName} comment${versionStr}`,
            `Thread created on route: ${route}\n\nCoordinates: (${Math.round(x)}, ${Math.round(y)})\n\n**Version:** ${version || 'N/A'}\n\n(Initial comment will be added as a reply)`,
            route,
            x,
            y,
            version
          );
          if (issue.success && issue.data) {
            createdProvider = 'github';
            createdNumber = issue.data.number;
          } else {
            createError = issue.error;
          }
        } else if (isGitLabConfigured()) {
          const issue = await gitlabAdapter.createIssue(
            `💬 ${pageName} comment${versionStr}`,
            `Thread created on route: ${route}\n\nCoordinates: (${Math.round(x)}, ${Math.round(y)})\n\n**Version:** ${version || 'N/A'}\n\n(Initial comment will be added as a reply)`,
            route,
            x,
            y,
            version
          );
          if (issue.success && issue.data) {
            createdProvider = 'gitlab';
            createdNumber = issue.data.number;
          } else {
            createError = issue.error;
          }
        }

        if (createdNumber && createdProvider) {
          setThreads(prev => prev.map(t => 
            t.id === threadId 
              ? { ...t, issueNumber: createdNumber, provider: createdProvider, syncStatus: 'synced' as const }
              : t
          ));
        } else if (createError) {
          setThreads(prev => prev.map(t => 
            t.id === threadId ? { ...t, syncStatus: 'error' as const, syncError: createError } : t
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

    // Sync to remote provider if configured
    if (thread) {
      // If thread doesn't have an issue number, create one first
      if (!thread.issueNumber) {
        console.log('🔵 Thread has no issue number, creating remote issue first...');
        setThreads(prev => prev.map(t => 
          t.id === threadId ? { ...t, syncStatus: 'syncing' as const } : t
        ));

        // Create a readable page name from route
        const pageName = thread.route === '/' ? 'Home page' : thread.route.split('/').filter(Boolean).join(' > ') || 'Page';
        const versionStr = thread.version ? ` [v${thread.version}]` : '';

        let createdProvider: 'github' | 'gitlab' | undefined;
        let createdNumber: number | undefined;
        // Choose provider: preserve existing, else prefer GitHub, else GitLab
        const providerPref: ('github' | 'gitlab' | undefined) = thread.provider || (isGitHubConfigured() ? 'github' : (isGitLabConfigured() ? 'gitlab' : undefined));

        if (providerPref === 'github' && isGitHubConfigured()) {
          const issue = await githubAdapter.createIssue(
            `💬 ${pageName} comment${versionStr}`,
            `Thread created on route: ${thread.route}\n\nCoordinates: (${Math.round(thread.x)}, ${Math.round(thread.y)})\n\n**Version:** ${thread.version || 'N/A'}`,
            thread.route,
            thread.x,
            thread.y,
            thread.version
          );
          if (issue.success && issue.data) {
            createdProvider = 'github';
            createdNumber = issue.data.number;
          } else {
            console.error('❌ Failed to create GitHub issue:', issue.error);
          }
        } else if (providerPref === 'gitlab' && isGitLabConfigured()) {
          const issue = await gitlabAdapter.createIssue(
            `💬 ${pageName} comment${versionStr}`,
            `Thread created on route: ${thread.route}\n\nCoordinates: (${Math.round(thread.x)}, ${Math.round(thread.y)})\n\n**Version:** ${thread.version || 'N/A'}`,
            thread.route,
            thread.x,
            thread.y,
            thread.version
          );
          if (issue.success && issue.data) {
            createdProvider = 'gitlab';
            createdNumber = issue.data.number;
          } else {
            console.error('❌ Failed to create GitLab issue:', issue.error);
          }
        }

        if (createdNumber && createdProvider) {
          console.log('✅ Created remote issue #', createdNumber);
          // Update thread with issue number
          setThreads(prev => prev.map(t => 
            t.id === threadId 
              ? { ...t, issueNumber: createdNumber, provider: createdProvider, syncStatus: 'pending' as const }
              : t
          ));

          // Now sync all existing comments to the new issue
          const updatedThread = threads.find(t => t.id === threadId);
          if (updatedThread) {
            for (const comment of updatedThread.comments) {
              if (!comment.githubCommentId) {
                const commentResult = createdProvider === 'github'
                  ? await githubAdapter.createComment(createdNumber, comment.text)
                  : await gitlabAdapter.createComment(createdNumber, comment.text);
                if (commentResult.success && commentResult.data) {
                  setThreads(prev => prev.map(t => {
                    if (t.id === threadId) {
                      return {
                        ...t,
                        comments: t.comments.map(c =>
                          c.id === comment.id ? { ...c, githubCommentId: commentResult.data.id } : c
                        )
                      };
                    }
                    return t;
                  }));
                }
              }
            }
          }

          // Now add the new comment
          const result = createdProvider === 'github'
            ? await githubAdapter.createComment(createdNumber, text)
            : await gitlabAdapter.createComment(createdNumber, text);
          if (result.success && result.data) {
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
            setThreads(prev =>
              prev.map(t =>
                t.id === threadId ? { ...t, syncStatus: 'error' as const, syncError: result.error } : t
              )
            );
          }
        } else {
          setThreads(prev => prev.map(t => 
            t.id === threadId ? { ...t, syncStatus: 'error' as const, syncError: 'Failed to create remote issue' } : t
          ));
        }
      } else {
        // Thread already has an issue number, just add the comment to the selected provider
        const isGitHub = thread.provider === 'github';
        const isGitLab = thread.provider === 'gitlab';
        let result: GitHubResult;
        if (isGitHub && isGitHubConfigured()) {
          result = await githubAdapter.createComment(thread.issueNumber, text);
        } else if (isGitLab && isGitLabConfigured()) {
          result = await gitlabAdapter.createComment(thread.issueNumber, text);
        } else {
          return;
        }
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

    // Sync to remote if configured
    if (comment?.githubCommentId) {
      let ok = false;
      if (thread?.provider === 'github' && isGitHubConfigured()) {
        const result = await githubAdapter.updateComment(comment.githubCommentId, text);
        ok = !!result.success;
      } else if (thread?.provider === 'gitlab' && isGitLabConfigured()) {
        const result = await gitlabAdapter.updateComment(comment.githubCommentId, text);
        ok = !!result.success;
      }
      if (ok) {
        setThreads(prev =>
          prev.map(t => t.id === threadId ? { ...t, syncStatus: 'synced' as const } : t)
        );
      } else {
        setThreads(prev =>
          prev.map(t =>
            t.id === threadId ? { ...t, syncStatus: 'error' as const, syncError: 'Update failed' } : t
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

    // Sync to remote if configured
    if (comment?.githubCommentId) {
      let ok = false;
      if (thread?.provider === 'github' && isGitHubConfigured()) {
        const result = await githubAdapter.deleteComment(comment.githubCommentId);
        ok = !!result.success;
      } else if (thread?.provider === 'gitlab' && isGitLabConfigured()) {
        const result = await gitlabAdapter.deleteComment(comment.githubCommentId);
        ok = !!result.success;
      }
      if (ok) {
        setThreads(prev =>
          prev.map(t => t.id === threadId ? { ...t, syncStatus: 'synced' as const } : t)
        );
      } else {
        setThreads(prev =>
          prev.map(t =>
            t.id === threadId ? { ...t, syncStatus: 'error' as const, syncError: 'Delete failed' } : t
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

    // Close remote Issue if configured
    if (thread?.issueNumber) {
      if (thread.provider === 'github' && isGitHubConfigured()) {
        const result = await githubAdapter.closeIssue(thread.issueNumber);
        if (!result.success) {
          console.error('Failed to close GitHub issue:', result.error);
        }
      } else if (thread.provider === 'gitlab' && isGitLabConfigured()) {
        const result = await gitlabAdapter.closeIssue(thread.issueNumber);
        if (!(result as any).success) {
          console.error('Failed to close GitLab issue:', (result as any).error);
        }
      }
    }
  }, [threads]);

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

  const syncFromGitHub = React.useCallback(async (route: string) => {
    setIsSyncing(true);
    console.log(`🔄 Syncing threads from remote providers for route: ${route}`);
    try {
      const newThreads: Thread[] = [];

      // GitHub
      if (isGitHubConfigured()) {
        const issues = await githubAdapter.fetchIssues(route);
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
          provider: 'github',
          syncStatus: 'synced'
        });
        }
      }

      // GitLab
      if (isGitLabConfigured()) {
        const issues = await gitlabAdapter.fetchIssues(route);
        for (const issue of issues) {
          let coords: number[] | null = null;
          const labels: string[] = issue.labels || [];
          const coordLabel = labels.find((l: string) => l.startsWith('coords:'));
          if (coordLabel) {
            const parts = coordLabel.replace('coords:', '').split(',').map((n: string) => parseInt(n, 10));
            if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
              coords = parts as number[];
            }
          }
          if (!coords && issue.description) {
            const m = issue.description.match(/Coordinates:\s*`?\((\d+),\s*(\d+)\)`?/);
            if (m) coords = [parseInt(m[1], 10), parseInt(m[2], 10)];
          }
          if (!coords) {
            console.warn(`Skipping GitLab issue #${issue.iid}: invalid or missing coords`);
            continue;
          }
          const glComments = await gitlabAdapter.fetchComments(issue.iid);
          const comments: Comment[] = [];
          if (issue.description) {
            comments.push({
              id: `issue-${issue.iid}-body`,
              text: issue.description,
              createdAt: issue.created_at,
              author: issue.author?.username,
              githubCommentId: undefined
            });
          }
          glComments.forEach((note: any) => {
            comments.push({
              id: `comment-${note.id}`,
              text: note.body,
              createdAt: note.created_at,
              author: note.author?.username,
              githubCommentId: note.id
            });
          });

          newThreads.push({
            id: `gitlab-${issue.iid}`,
            x: coords[0],
            y: coords[1],
            route,
            comments,
            issueNumber: issue.iid,
            provider: 'gitlab',
            syncStatus: 'synced'
          });
        }
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

      console.log(`✅ Synced ${newThreads.length} threads from providers`);
    } catch (error) {
      console.error('Failed to sync from providers:', error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const retrySync = React.useCallback(async () => {
    console.log('🔄 Retrying sync for pending/error threads...');
    const threadsToSync = threads.filter(t => 
      (t.syncStatus === 'pending' || t.syncStatus === 'error') && !t.issueNumber
    );

    if (threadsToSync.length === 0) {
      console.log('No threads to sync');
      return;
    }

    if (!isGitHubConfigured()) {
      console.warn('GitHub not configured. Cannot retry sync.');
      return;
    }

    for (const thread of threadsToSync) {
      console.log(`🔵 Syncing thread ${thread.id}...`);
      
      // Set status to syncing
      setThreads(prev => prev.map(t => 
        t.id === thread.id ? { ...t, syncStatus: 'syncing' as const } : t
      ));

      // Create a readable page name from route
      const pageName = thread.route === '/' ? 'Home page' : thread.route.split('/').filter(Boolean).join(' > ') || 'Page';
      const versionStr = thread.version ? ` [v${thread.version}]` : '';
      
      const issue = await githubAdapter.createIssue(
        `💬 ${pageName} comment${versionStr}`,
        `Thread created on route: ${thread.route}\n\nCoordinates: (${Math.round(thread.x)}, ${Math.round(thread.y)})\n\n**Version:** ${thread.version || 'N/A'}`,
        thread.route,
        thread.x,
        thread.y,
        thread.version
      );

      if (issue.success && issue.data) {
        console.log('✅ Created GitHub issue #', issue.data.number);
        
        // Update thread with issue number
        setThreads(prev => prev.map(t => 
          t.id === thread.id 
            ? { ...t, issueNumber: issue.data.number }
            : t
        ));

        // Sync all comments to the new issue
        for (const comment of thread.comments) {
          if (!comment.githubCommentId) {
            const commentResult = await githubAdapter.createComment(issue.data.number, comment.text);
            if (commentResult.success && commentResult.data) {
              setThreads(prev => prev.map(t => {
                if (t.id === thread.id) {
                  return {
                    ...t,
                    comments: t.comments.map(c =>
                      c.id === comment.id ? { ...c, githubCommentId: commentResult.data.id } : c
                    )
                  };
                }
                return t;
              }));
            }
          }
        }

        // Mark as synced
        setThreads(prev => prev.map(t => 
          t.id === thread.id ? { ...t, syncStatus: 'synced' as const } : t
        ));
      } else {
        console.error('❌ Failed to create GitHub issue:', issue.error);
        setThreads(prev => prev.map(t => 
          t.id === thread.id ? { ...t, syncStatus: 'error' as const, syncError: issue.error } : t
        ));
      }
    }

    console.log('✅ Retry sync complete');
  }, [threads]);

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


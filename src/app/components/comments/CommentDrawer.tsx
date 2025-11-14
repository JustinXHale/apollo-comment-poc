import * as React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  Title,
  Button,
  TextArea,
  Card,
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  Divider,
  Label,
  Spinner
} from '@patternfly/react-core';
import { CommentIcon, TimesIcon, PlusCircleIcon, SyncAltIcon, GithubIcon, ExternalLinkAltIcon, RedoIcon, SparklesIcon } from '@patternfly/react-icons';
import { useComments } from '@app/context/CommentContext';
import { useVersion } from '@app/context/VersionContext';
import { useLocation } from 'react-router-dom';
import { isGitHubConfigured } from '@app/services/githubAdapter';
import { isGitLabConfigured } from '@app/services/gitlabAdapter';
import { useGitLabAuth } from '@app/contexts/GitLabAuthContext';
import { useAIContext } from '@app/components/ai';

interface CommentDrawerProps {
  children: React.ReactNode;
  selectedThreadId: string | null;
  onThreadSelect: (id: string | null) => void;
}

export const CommentDrawer: React.FunctionComponent<CommentDrawerProps> = ({
  children,
  selectedThreadId,
  onThreadSelect
}) => {
  const location = useLocation();
  const { 
    getThreadsForRoute, 
    addReply, 
    updateComment, 
    deleteComment,
    deleteThread,
    enableCommenting,
    syncFromGitHub,
    isSyncing,
    retrySync,
    hasPendingSync
  } = useComments();
  const { currentVersion } = useVersion();
  const { isAuthenticated: isGitLabAuthenticated } = useGitLabAuth();
  const { sendMessage, toggleChatbot, isChatbotVisible } = useAIContext();
  
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState('');
  const [replyText, setReplyText] = React.useState('');
  const replyTextAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const currentRouteThreads = getThreadsForRoute(location.pathname, currentVersion);
  const selectedThread = currentRouteThreads.find(t => t.id === selectedThreadId);
  const isDrawerOpen = selectedThreadId !== null && selectedThread !== undefined;
  const isUserAuthenticated = isGitHubConfigured() || isGitLabAuthenticated;

  // Auto-focus reply textarea when drawer opens and commenting is enabled
  React.useEffect(() => {
    if (!isDrawerOpen || !enableCommenting) return;
    
    // Small delay to ensure drawer animation completes
    const timer = setTimeout(() => {
      replyTextAreaRef.current?.focus();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isDrawerOpen, enableCommenting, selectedThreadId]);

  // Sync from providers on mount if configured
  React.useEffect(() => {
    if (isGitHubConfigured() || isGitLabConfigured()) {
      syncFromGitHub(location.pathname).catch(err => {
        console.error('Failed to sync from providers:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // Only re-run when route changes

  const handleEdit = (commentId: string, text: string) => {
    setEditingCommentId(commentId);
    setEditText(text);
  };

  const handleSave = async (threadId: string, commentId: string) => {
    await updateComment(threadId, commentId, editText);
    setEditingCommentId(null);
  };

  const handleAddReply = async () => {
    if (selectedThreadId && replyText.trim()) {
      await addReply(selectedThreadId, replyText);
      setReplyText('');
    }
  };

  const handleDeleteThread = async () => {
    if (selectedThreadId && window.confirm('Delete this entire thread and all its comments?')) {
      await deleteThread(selectedThreadId);
      onThreadSelect(null);
    }
  };

  const handleSummarizeThread = () => {
    if (!selectedThread) return;
    
    // Open chatbot if not already open
    if (!isChatbotVisible) {
      toggleChatbot();
    }
    
    // Send a summarization request for this specific thread
    const query = `Summarize the feedback in this thread (${selectedThread.comments.length} comments)`;
    sendMessage(query, {
      threads: [selectedThread], // Pass only this thread
      version: currentVersion || 'unknown',
      route: location.pathname
    });
  };

  const handleDeleteComment = async (threadId: string, commentId: string) => {
    if (window.confirm('Delete this comment?')) {
      await deleteComment(threadId, commentId);
    }
  };

  const handleSync = async () => {
    await syncFromGitHub(location.pathname);
  };

  const handleRetrySync = async () => {
    await retrySync();
  };

  const getSyncStatusLabel = (status?: 'synced' | 'local' | 'pending' | 'syncing' | 'error') => {
    switch (status) {
      case 'synced':
        return <Label color="green" icon={<GithubIcon />}>Synced</Label>;
      case 'local':
        return <Label color="grey">Local Only</Label>;
      case 'pending':
        return <Label color="blue" icon={<Spinner size="sm" />}>Pending...</Label>;
      case 'syncing':
        return <Label color="blue" icon={<Spinner size="sm" />}>Syncing...</Label>;
      case 'error':
        return <Label color="red">Sync Error</Label>;
      default:
        return null;
    }
  };

  const getIssueLink = (provider?: 'github' | 'gitlab', issueNumber?: number) => {
    if (!issueNumber || !provider) return null;
    try {
      if (provider === 'gitlab') {
        const baseUrl = process.env.VITE_GITLAB_BASE_URL || 'https://gitlab.com';
        const projectPath = process.env.VITE_GITLAB_PROJECT_PATH;
        if (!projectPath) return null;
        return `${baseUrl}/${projectPath}/-/issues/${issueNumber}`;
      } else {
        const owner = process.env.VITE_GITHUB_OWNER;
        const repo = process.env.VITE_GITHUB_REPO;
        if (!owner || !repo) return null;
        return `https://github.com/${owner}/${repo}/issues/${issueNumber}`;
      }
    } catch (error) {
      return null;
    }
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const panelContent = (
    <DrawerPanelContent isResizable defaultSize="400px" minSize="300px">
      <DrawerHead>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <Title headingLevel="h2" size="xl">
            <CommentIcon style={{ marginRight: '0.5rem', color: '#C9190B' }} />
            Thread
          </Title>
          {(isGitHubConfigured() || isGitLabConfigured()) && (
            <>
              <Button
                id="sync-github-button"
                variant="plain"
                size="sm"
                icon={<SyncAltIcon />}
                onClick={handleSync}
                isDisabled={isSyncing}
                aria-label="Sync with remote"
                title="Sync with remote"
              >
                {isSyncing ? <Spinner size="sm" /> : null}
              </Button>
              {hasPendingSync && (
                <Button
                  id="retry-sync-button"
                  variant="plain"
                  size="sm"
                  icon={<RedoIcon />}
                  onClick={handleRetrySync}
                  isDisabled={isSyncing}
                  aria-label="Retry sync for pending threads"
                  title="Retry sync for pending threads"
                />
              )}
            </>
          )}
        </div>
        <DrawerActions>
          <DrawerCloseButton onClick={() => onThreadSelect(null)} />
        </DrawerActions>
      </DrawerHead>
      <DrawerContentBody style={{ padding: '1rem' }}>
        {!selectedThread ? (
          <EmptyState>
            <CommentIcon style={{ fontSize: '3rem', color: 'var(--pf-v6-global--Color--200)', marginBottom: '1rem' }} />
            <Title headingLevel="h3" size="lg">
              No thread selected
            </Title>
            <EmptyStateBody>
              Click a pin to view its comments.
            </EmptyStateBody>
          </EmptyState>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Thread Info */}
            <Card isCompact>
              <CardBody>
                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <strong>Location:</strong> ({Math.round(selectedThread.x)}, {Math.round(selectedThread.y)})
                </div>
                {selectedThread.version && (
                  <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong>Version:</strong> {selectedThread.version}
                  </div>
                )}
                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <strong>Comments:</strong> {selectedThread.comments.length}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '0.875rem' }}>Status:</strong>
                  {getSyncStatusLabel(selectedThread.syncStatus)}
                </div>
                {selectedThread.issueNumber && (
                  <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <a 
                      href={getIssueLink(selectedThread.provider, selectedThread.issueNumber) || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <GithubIcon />
                      Issue #{selectedThread.issueNumber}
                      <ExternalLinkAltIcon style={{ fontSize: '0.75rem' }} />
                    </a>
                  </div>
                )}
                {/* AI Summarize Thread Button */}
                {selectedThread.comments.length > 0 && (
                  <Button
                    id={`ai-summarize-thread-${selectedThread.id}`}
                    variant="secondary"
                    size="sm"
                    icon={<SparklesIcon />}
                    onClick={handleSummarizeThread}
                    style={{ marginTop: '0.5rem' }}
                  >
                    AI Summarize Thread
                  </Button>
                )}
                {enableCommenting && isUserAuthenticated && (
                  <Button
                    id={`delete-thread-${selectedThread.id}`}
                    variant="danger"
                    size="sm"
                    icon={<TimesIcon />}
                    onClick={handleDeleteThread}
                    style={{ marginTop: '0.5rem', marginLeft: selectedThread.comments.length > 0 ? '0.5rem' : '0' }}
                  >
                    Delete Thread
                  </Button>
                )}
              </CardBody>
            </Card>

            <Divider />

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedThread.comments.length === 0 ? (
                <EmptyState>
                  <Title headingLevel="h4" size="md">
                    No comments yet
                  </Title>
                  <EmptyStateBody>
                    {enableCommenting 
                      ? 'Add a reply below to start the conversation.'
                      : 'Enable commenting to add replies.'}
                  </EmptyStateBody>
                </EmptyState>
              ) : (
                selectedThread.comments.map((comment, index) => (
                  <Card key={comment.id} isCompact>
                    <CardTitle>
                      Comment #{index + 1}
                      <div style={{ fontSize: '0.75rem', color: 'var(--pf-v6-global--Color--200)', fontWeight: 'normal' }}>
                        {comment.author && <span style={{ marginRight: '0.5rem' }}>@{comment.author}</span>}
                        {formatDate(comment.createdAt)}
                      </div>
                    </CardTitle>
                  <CardBody>
                    {editingCommentId === comment.id ? (
                      <>
                        <TextArea
                          id={`edit-comment-${comment.id}`}
                          value={editText}
                          onChange={(_event, value) => setEditText(value)}
                          rows={3}
                          style={{ marginBottom: '0.5rem' }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSave(selectedThread.id, comment.id);
                            }
                            if (e.key === 'Escape') {
                              setEditingCommentId(null);
                            }
                          }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button
                            id={`save-comment-${comment.id}`}
                            variant="primary"
                            size="sm"
                            onClick={() => handleSave(selectedThread.id, comment.id)}
                          >
                            Save
                          </Button>
                          <Button
                            id={`cancel-edit-${comment.id}`}
                            variant="link"
                            size="sm"
                            onClick={() => setEditingCommentId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>
                          {comment.text || <em style={{ color: 'var(--pf-v6-global--Color--200)' }}>No text</em>}
                        </div>
                        {enableCommenting && isUserAuthenticated && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button
                              id={`edit-comment-btn-${comment.id}`}
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEdit(comment.id, comment.text)}
                            >
                              Edit
                            </Button>
                            <Button
                              id={`delete-comment-btn-${comment.id}`}
                              variant="danger"
                              size="sm"
                              icon={<TimesIcon />}
                              onClick={() => handleDeleteComment(selectedThread.id, comment.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardBody>
                </Card>
              ))
              )}
            </div>

            {/* Add Reply */}
            {enableCommenting && isUserAuthenticated && (
              <>
                <Divider />
                <Card isCompact>
                  <CardTitle>
                    <PlusCircleIcon style={{ marginRight: '0.5rem' }} />
                    Add Reply
                  </CardTitle>
                  <CardBody>
                    <TextArea
                      ref={replyTextAreaRef}
                      id={`reply-textarea-${selectedThread.id}`}
                      value={replyText}
                      onChange={(_event, value) => setReplyText(value)}
                      placeholder="Enter your reply..."
                      rows={3}
                      style={{ marginBottom: '0.5rem' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddReply();
                        }
                      }}
                    />
                    <Button
                      id={`add-reply-${selectedThread.id}`}
                      variant="primary"
                      size="sm"
                      onClick={handleAddReply}
                      isDisabled={!replyText.trim()}
                    >
                      Add Reply
                    </Button>
                  </CardBody>
                </Card>
              </>
            )}
          </div>
        )}
      </DrawerContentBody>
    </DrawerPanelContent>
  );

  return (
    <Drawer isExpanded={isDrawerOpen} isInline position="right">
      <DrawerContent panelContent={panelContent}>
        <DrawerContentBody>{children}</DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

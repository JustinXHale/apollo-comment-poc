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
import { CommentIcon, TimesIcon, PlusCircleIcon, SyncAltIcon, GithubIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useComments } from '@app/context/CommentContext';
import { useLocation } from 'react-router-dom';
import { isGitHubConfigured } from '@app/services/githubAdapter';

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
    isSyncing
  } = useComments();
  
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState('');
  const [replyText, setReplyText] = React.useState('');
  const replyTextAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const currentRouteThreads = getThreadsForRoute(location.pathname);
  const selectedThread = currentRouteThreads.find(t => t.id === selectedThreadId);
  const isDrawerOpen = selectedThreadId !== null && selectedThread !== undefined;

  // Auto-focus reply textarea when drawer opens and commenting is enabled
  React.useEffect(() => {
    if (!isDrawerOpen || !enableCommenting) return;
    
    // Small delay to ensure drawer animation completes
    const timer = setTimeout(() => {
      replyTextAreaRef.current?.focus();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isDrawerOpen, enableCommenting, selectedThreadId]);

  // Sync from GitHub on mount if configured
  React.useEffect(() => {
    if (isGitHubConfigured()) {
      syncFromGitHub(location.pathname).catch(err => {
        console.error('Failed to sync from GitHub:', err);
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

  const handleDeleteComment = async (threadId: string, commentId: string) => {
    if (window.confirm('Delete this comment?')) {
      await deleteComment(threadId, commentId);
    }
  };

  const handleSync = async () => {
    await syncFromGitHub(location.pathname);
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

  const getGitHubLink = (issueNumber?: number) => {
    if (!issueNumber) return null;
    try {
      const owner = import.meta.env?.VITE_GITHUB_OWNER;
      const repo = import.meta.env?.VITE_GITHUB_REPO;
      if (!owner || !repo) return null;
      return `https://github.com/${owner}/${repo}/issues/${issueNumber}`;
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
          {isGitHubConfigured() && (
            <Button
              id="sync-github-button"
              variant="plain"
              size="sm"
              icon={<SyncAltIcon />}
              onClick={handleSync}
              isDisabled={isSyncing}
              aria-label="Sync with GitHub"
              title="Sync with GitHub"
            >
              {isSyncing ? <Spinner size="sm" /> : null}
            </Button>
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
                      href={getGitHubLink(selectedThread.issueNumber) || '#'} 
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
                {enableCommenting && (
                  <Button
                    id={`delete-thread-${selectedThread.id}`}
                    variant="danger"
                    size="sm"
                    icon={<TimesIcon />}
                    onClick={handleDeleteThread}
                    style={{ marginTop: '0.5rem' }}
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
                        {enableCommenting && (
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
            {enableCommenting && (
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

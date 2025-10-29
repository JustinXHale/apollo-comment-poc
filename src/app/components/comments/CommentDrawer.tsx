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
  Divider
} from '@patternfly/react-core';
import { CommentIcon, TimesIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { useComments } from '@app/context/CommentContext';
import { useLocation } from 'react-router-dom';

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
    enableCommenting 
  } = useComments();
  
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState('');
  const [replyText, setReplyText] = React.useState('');

  const currentRouteThreads = getThreadsForRoute(location.pathname);
  const selectedThread = currentRouteThreads.find(t => t.id === selectedThreadId);
  const isDrawerOpen = selectedThreadId !== null && selectedThread !== undefined;

  const handleEdit = (commentId: string, text: string) => {
    setEditingCommentId(commentId);
    setEditText(text);
  };

  const handleSave = (threadId: string, commentId: string) => {
    updateComment(threadId, commentId, editText);
    setEditingCommentId(null);
  };

  const handleAddReply = () => {
    if (selectedThreadId && replyText.trim()) {
      addReply(selectedThreadId, replyText);
      setReplyText('');
    }
  };

  const handleDeleteThread = () => {
    if (selectedThreadId && window.confirm('Delete this entire thread and all its comments?')) {
      deleteThread(selectedThreadId);
      onThreadSelect(null);
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
        <Title headingLevel="h2" size="xl">
          <CommentIcon style={{ marginRight: '0.5rem', color: '#C9190B' }} />
          Thread
        </Title>
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
                <div style={{ fontSize: '0.875rem' }}>
                  <strong>Comments:</strong> {selectedThread.comments.length}
                </div>
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
              {selectedThread.comments.map((comment, index) => (
                <Card key={comment.id} isCompact>
                  <CardTitle>
                    Comment #{index + 1}
                    <div style={{ fontSize: '0.75rem', color: 'var(--pf-v6-global--Color--200)', fontWeight: 'normal' }}>
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
                            {selectedThread.comments.length > 1 && (
                              <Button
                                id={`delete-comment-btn-${comment.id}`}
                                variant="danger"
                                size="sm"
                                icon={<TimesIcon />}
                                onClick={() => {
                                  if (window.confirm('Delete this comment?')) {
                                    deleteComment(selectedThread.id, comment.id);
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </CardBody>
                </Card>
              ))}
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

import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { CommentIcon } from '@patternfly/react-icons';
import { Thread } from '@app/context/CommentContext';

interface CommentPinProps {
  thread: Thread;
  onPinClick: () => void;
  isSelected?: boolean;
}

export const CommentPin: React.FunctionComponent<CommentPinProps> = ({ 
  thread, 
  onPinClick,
  isSelected = false
}) => {
  const commentCount = thread.comments.length;
  const hasText = thread.comments.some(c => c.text.trim().length > 0);

  return (
    <Button
      id={`comment-pin-${thread.id}`}
      variant="plain"
      aria-label={`Comment thread with ${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`}
      onClick={(e) => {
        e.stopPropagation();
        onPinClick();
      }}
      style={{
        position: 'absolute',
        left: `${thread.x}px`,
        top: `${thread.y}px`,
        transform: 'translate(-50%, -50%)',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#C9190B',
        color: 'white',
        border: isSelected ? '3px solid #0066CC' : '2px solid white',
        boxShadow: isSelected 
          ? '0 0 0 2px #0066CC, 0 4px 12px rgba(0, 0, 0, 0.4)'
          : '0 2px 8px rgba(0, 0, 0, 0.3)',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: isSelected ? 1001 : 1000,
        transition: 'all 0.2s ease',
        fontSize: commentCount > 1 ? '0.7rem' : undefined
      }}
    >
      {commentCount > 1 ? (
        <span style={{ fontWeight: 'bold' }}>{commentCount}</span>
      ) : (
        <CommentIcon />
      )}
    </Button>
  );
};


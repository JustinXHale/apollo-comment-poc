import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { CommentIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
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
  const isPending = thread.syncStatus === 'pending' || thread.syncStatus === 'syncing';
  const isError = thread.syncStatus === 'error';

  // Pulsing animation for pending syncs
  const pulseAnimation = isPending ? {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  } : {};

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      <Button
        id={`comment-pin-${thread.id}`}
        variant="plain"
        aria-label={`Comment thread with ${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}${isError ? ' - sync error' : ''}${isPending ? ' - syncing' : ''}`}
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
          backgroundColor: isError ? '#A30000' : isPending ? '#F0AB00' : '#C9190B',
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
          fontSize: commentCount > 1 ? '0.7rem' : undefined,
          ...pulseAnimation
        }}
      >
        {isError ? (
          <ExclamationTriangleIcon style={{ fontSize: '1rem' }} />
        ) : commentCount === 0 ? (
          <span style={{ fontWeight: 'bold', fontSize: '0.75rem' }}>0</span>
        ) : commentCount === 1 ? (
          <CommentIcon />
        ) : (
          <span style={{ fontWeight: 'bold' }}>{commentCount}</span>
        )}
      </Button>
    </>
  );
};


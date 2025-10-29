import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useComments } from '@app/context/CommentContext';
import { CommentPin } from './CommentPin';

interface CommentOverlayProps {
  selectedThreadId: string | null;
  onThreadSelect: (id: string) => void;
}

export const CommentOverlay: React.FunctionComponent<CommentOverlayProps> = ({
  selectedThreadId,
  onThreadSelect
}) => {
  const location = useLocation();
  const { showPins, enableCommenting, addThread, getThreadsForRoute } = useComments();
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const currentRouteThreads = React.useMemo(
    () => getThreadsForRoute(location.pathname),
    [getThreadsForRoute, location.pathname]
  );

  const handleOverlayClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!enableCommenting) return;

      // Only add thread if clicking the overlay itself, not a pin
      if (event.target === overlayRef.current) {
        const rect = overlayRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const newThreadId = addThread(x, y, location.pathname);
        
        // Auto-open the drawer for the newly created thread
        onThreadSelect(newThreadId);
      }
    },
    [enableCommenting, addThread, location.pathname, onThreadSelect]
  );

  // Don't render anything if showPins is false
  if (!showPins) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      id="comment-overlay"
      onClick={handleOverlayClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: enableCommenting ? 'auto' : 'none',
        cursor: enableCommenting ? 'crosshair' : 'default',
        zIndex: 999
      }}
    >
      {currentRouteThreads.map((thread) => (
        <div
          key={thread.id}
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          <CommentPin
            thread={thread}
            onPinClick={() => onThreadSelect(thread.id)}
            isSelected={thread.id === selectedThreadId}
          />
        </div>
      ))}
    </div>
  );
};


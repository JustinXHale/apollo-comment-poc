// Components
export { CommentOverlay } from './components/CommentOverlay';
export { CommentDrawer } from './components/CommentDrawer';
export { CommentPin } from './components/CommentPin';

// Contexts / Providers
export { CommentProvider, useComments } from './contexts/CommentContext';
export { VersionProvider, useVersion } from './contexts/VersionContext';
export { GitHubAuthProvider, useGitHubAuth } from './contexts/GitHubAuthContext';
export { GitLabAuthProvider, useGitLabAuth } from './contexts/GitLabAuthContext';

// Types
export type { 
  Comment, 
  Thread
} from './contexts/CommentContext';

// Components
export { CommentOverlay } from './components/CommentOverlay';
export { CommentDrawer } from './components/CommentDrawer';
export { CommentPin } from './components/CommentPin';
export { AIAssistant } from './components/AIAssistant';
export { AIChatPanel } from './components/AIChatPanel';

// Contexts / Providers
export { CommentProvider, useComments } from './contexts/CommentContext';
export { VersionProvider, useVersion } from './contexts/VersionContext';
export { GitHubAuthProvider, useGitHubAuth } from './contexts/GitHubAuthContext';
export { GitLabAuthProvider, useGitLabAuth } from './contexts/GitLabAuthContext';
export { AIProvider, useAIContext } from './contexts/AIContext';

// Services
export { 
  githubAdapter, 
  isGitHubConfigured
} from './services/githubAdapter';
export { 
  gitlabAdapter, 
  isGitLabConfigured 
} from './services/gitlabAdapter';

// Types
export type { 
  Comment, 
  Thread, 
  SyncStatus,
  AIMessage,
  GitHubResult
} from './types';


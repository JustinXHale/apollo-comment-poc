declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module '*.css';
declare module '*.wav';
declare module '*.mp3';
declare module '*.m4a';
declare module '*.rdf';
declare module '*.ttl';
declare module '*.pdf';

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN?: string;
  readonly VITE_GITHUB_OWNER?: string;
  readonly VITE_GITHUB_REPO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

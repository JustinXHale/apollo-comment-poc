import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'react-router-dom',
    '@patternfly/react-core',
    '@patternfly/react-icons',
    '@patternfly/chatbot'
  ],
  treeshake: true,
  minify: false
});


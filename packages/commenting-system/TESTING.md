# Testing the Apollo Commenting System CLI

## Local Testing

### 1. Build the Package

```bash
cd packages/commenting-system
npm run build
```

This will:
- Build the React library (`dist/`)
- Build the CLI (`cli/dist/`)

### 2. Test the CLI Locally

```bash
# Test help
node cli/dist/index.js --help

# Test init command help
node cli/dist/index.js init --help

# Test validate command
node cli/dist/index.js validate
```

### 3. Link for Global Testing

```bash
# In the commenting-system directory
npm link

# Now you can use it globally
apollo-comments --help
apollo-comments init
```

### 4. Test in a Real Project

```bash
# Clone a test PatternFly project
git clone https://github.com/patternfly/patternfly-react-seed test-install
cd test-install

# Install the linked package
npm link @apollo/commenting-system

# Run the wizard
apollo-comments init
```

## What the Init Command Does

1. **Detects project type** - Checks for React, PatternFly, Vite/Webpack
2. **Prompts for platform** - Auto-detects Vercel/Netlify or asks
3. **Prompts for GitHub OAuth** - Client ID, Secret, Owner, Repo
4. **Validates GitHub connection** - Tests API connectivity
5. **Validates repo access** - Checks if repo exists
6. **Generates serverless functions** - Creates `/api/` or `/netlify/functions/`
7. **Creates env files** - `.env.local`, `.env.example`
8. **Creates config file** - `apollo-comments.config.json`
9. **Prints setup instructions** - Shows how to add providers to App.tsx

## Expected Files After Running `init`

```
your-project/
├── api/  (or netlify/functions/)
│   ├── github-oauth-login.ts
│   └── github-oauth-callback.ts
├── .env.local (with secrets)
├── .env.example (template)
├── apollo-comments.config.json
└── .gitignore (updated)
```

## Testing the Validate Command

```bash
# After running init
apollo-comments validate
```

This checks:
- ✅ Configuration file exists
- ✅ Environment files exist
- ✅ Serverless functions exist
- ✅ GitHub API is accessible
- ✅ Repository is accessible

## Known Issues

- The React library currently has placeholder components
- You need to copy your actual commenting system components to `src/`
- The CLI doesn't yet support auto-injecting code into App.tsx (manual step required)

## Next Steps

1. Copy your actual commenting system components to `src/`
2. Test the full workflow in a clean PatternFly project
3. Publish to npm when ready


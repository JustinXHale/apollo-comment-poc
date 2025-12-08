# Quick Start: Testing Your CLI Wizard

## ✅ What We Just Built

You now have a **complete CLI scaffolding tool** for your Apollo Commenting System:

```
@apollo/commenting-system
└── CLI: apollo-comments init
```

Similar to:
- `npx create-react-app`
- `npx storybook init`
- `npx prisma init`

## 🧪 Test Workflow

### Step 1: Build & Link Locally

```bash
cd /Users/jxhale/Documents/github_repos/patternfly-react-seed/packages/commenting-system

# Build everything
npm run build

# Make it available globally on your machine
npm link
```

### Step 2: Create a Test Branch in a Clean Repo

```bash
# Option A: Use a PatternFly seed project
git clone https://github.com/patternfly/patternfly-react-seed apollo-comments-test
cd apollo-comments-test
git checkout -b test-commenting-install

# Option B: Use your own repo
cd /path/to/your/test/repo
git checkout -b test-commenting-install
```

### Step 3: Install the Package

```bash
# Install your locally linked package
npm link @apollo/commenting-system

# Or install from local path (alternative)
npm install /Users/jxhale/Documents/github_repos/patternfly-react-seed/packages/commenting-system
```

### Step 4: Run the Wizard

```bash
npx apollo-comments init
```

Or if linked globally:

```bash
apollo-comments init
```

### Step 5: Answer the Prompts

The wizard will:
1. ✅ Detect React + PatternFly
2. ✅ Ask for platform (Vercel/Netlify/Manual)
3. ✅ Prompt for GitHub OAuth credentials
4. ✅ Validate GitHub connectivity
5. ✅ Generate serverless functions
6. ✅ Create .env.local, .env.example
7. ✅ Create apollo-comments.config.json
8. ✅ Print integration instructions

### Step 6: Verify Generated Files

```bash
# Check what was created
ls -la api/  # or netlify/functions/
cat .env.local
cat apollo-comments.config.json

# Validate setup
apollo-comments validate
```

### Step 7: Integrate into Your App

Follow the printed instructions to add the providers to your `src/index.tsx` or `src/App.tsx`:

```tsx
import {
  CommentProvider,
  VersionProvider,
  GitHubAuthProvider,
  CommentOverlay,
  CommentDrawer
} from '@apollo/commenting-system';
import apolloCommentsConfig from './apollo-comments.config.json';
```

## 🎯 Expected Workflow Output

```bash
$ apollo-comments init

🚀 Apollo Commenting System Setup Wizard

✓ Detected: React with Webpack
✓ Detected vercel configuration
? Use vercel for serverless functions? Yes

📋 GitHub OAuth Configuration

? GitHub OAuth Client ID: Ov23li...
? GitHub OAuth Client Secret: ****
? Repository Owner: patternfly
? Repository Name: patternfly-react

✓ GitHub connection validated
✓ Repository access confirmed
✓ Issue labels documented
✓ Serverless functions created
✓ Environment files created
✓ Configuration file created

✓ Setup complete!

📝 Manual Setup Required:
... (integration instructions)

Next steps:
1. Review generated files
2. Add CommentProvider to App.tsx
3. Deploy serverless functions
4. Run: npm run dev
```

## 📦 Next: Publish to npm

Once you've tested locally and it works:

```bash
cd packages/commenting-system

# Update version if needed
npm version 1.0.0

# Publish to npm
npm publish --access public
```

Then anyone can:

```bash
npm install @apollo/commenting-system
npx apollo-comments init
```

## 🔧 Troubleshooting

**"Cannot find module 'ora'"**
- Run `cd cli && npm install` to install CLI dependencies

**"No package.json found"**
- Run the CLI from inside a React project directory

**"GitHub connection failed"**
- Check your internet connection
- GitHub API might be rate-limited

**"Repository not found"**
- Make sure the repo exists and is accessible
- Private repos will show a warning but still proceed

## 📝 Important Notes

### Current State

✅ **Complete**:
- CLI structure and commands
- Project detection
- Platform detection (Vercel/Netlify)
- GitHub OAuth prompts
- Serverless function generation
- Environment file creation
- Config file generation
- Validation command

⚠️ **Placeholder** (need your real code):
- React components in `src/components/`
- Context providers in `src/contexts/`
- Services in `src/services/`

### Next Steps for Production

1. **Copy your actual commenting system code** to `src/`
2. **Test the full integration** in a real app
3. **Add your actual components** (CommentOverlay, CommentDrawer, etc.)
4. **Test with real GitHub OAuth**
5. **Publish to npm**

## 🎉 Summary

You've successfully created:
- ✅ Full CLI scaffolding tool
- ✅ Interactive setup wizard
- ✅ Serverless function generator
- ✅ Environment configuration
- ✅ Validation tooling
- ✅ npm-ready package structure

This is **exactly** the onboarding experience you wanted - just like Storybook init!


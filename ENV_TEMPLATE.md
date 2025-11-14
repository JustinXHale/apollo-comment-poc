# Environment Variables Template

This file documents the environment variables needed for the application. Copy these to your `.env` file.

## GitHub OAuth Configuration
For enabling GitHub-based commenting and issue sync:

```bash
VITE_GITHUB_OWNER=your_github_username
VITE_GITHUB_REPO=your_repo_name
VITE_GITHUB_PAT=your_personal_access_token
```

## GitLab Configuration (Optional)
For enabling GitLab-based commenting and issue sync:

```bash
VITE_GITLAB_BASE_URL=https://gitlab.com
VITE_GITLAB_PROJECT_PATH=your_username/your_project
VITE_GITLAB_PAT=your_personal_access_token
```

## MaaS Configuration (AI Assistant - Phase 2)

Red Hat MaaS API configuration for AI-powered comment analysis.

Available models and endpoints: https://maas.apps.prod.rhoai.rh-aiservices-bu.com/

### Example using DeepSeek-R1-Qwen-14B model:

```bash
# MaaS API endpoint
MAAS_API_ENDPOINT=https://deepseek-r1-qwen-14b-w4a16-maas-apicast-production.apps.prod.rhoai.rh-aiservices-bu.com:443/v1/chat/completions

# Your MaaS API key (get from MaaS dashboard)
MAAS_API_KEY=your_api_key_here

# Model name to use
MAAS_MODEL_NAME=r1-qwen-14b-w4a16
```

### Alternative Models Available:

- **Granite-3.3-8B-Instruct**: `granite-3-3-8b-instruct`
- **Llama-3.2-3B**: `llama-3-2-3b`  
- **Llama-4-Scout-17B-16E-W4A16**: `llama-4-scout-17b-16e-w4a16`
- **Mistral-Small-24B-W8A8**: `mistral-small-24b-w8a8`
- **Granite-Vision-3.2-2b**: `granite-vision-3-2-2b`
- **Phi-4**: `phi-4`
- **Qwen2.5-VL-7B-Instruct**: `qwen2-5-vl-7b-instruct`

See the MaaS dashboard for the full list and model capabilities.

## Setup Instructions

1. Copy this template to create your `.env` file:
   ```bash
   cp ENV_TEMPLATE.md .env
   ```

2. Fill in your actual values in `.env`

3. **Never commit `.env` to version control** (it's in `.gitignore`)

4. For production deployment, set these as environment variables in your hosting platform (Vercel, Netlify, etc.)

## Notes

- MaaS integration is optional - the app works without it
- The AI Assistant (Phase 2) will allow users to configure their own MaaS credentials in app settings
- For local development, only the GitHub/GitLab credentials are required for commenting features


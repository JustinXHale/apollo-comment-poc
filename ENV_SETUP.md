# Environment Setup for AI Assistant

## Local Development

Create a `.env.local` file in the project root with the following variables:

```bash
# AI Assistant - MaaS Configuration

# MaaS API Endpoint
MAAS_API_ENDPOINT=https://maas.apps.prod.rhoai.rh-aiservices-bu.com/v1/chat/completions

# MaaS API Key (from your MaaS application)
MAAS_API_KEY=your_maas_api_key_here

# MaaS Model Name (e.g., llama-3-2-3b, granite-3-8b, deepseek-r1)
MAAS_MODEL_NAME=llama-3-2-3b
```

### Getting Your MaaS API Key

1. Go to https://maas.apps.prod.rhoai.rh-aiservices-bu.com/
2. Create or select your application
3. Copy the API key from your app settings
4. Paste it into your `.env.local` file

## Vercel Deployment

Add these environment variables in your Vercel project settings:

1. Go to your project on Vercel
2. Navigate to **Settings → Environment Variables**
3. Add the following variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `MAAS_API_ENDPOINT` | `https://maas.apps.prod.rhoai.rh-aiservices-bu.com/v1/chat/completions` | Production, Preview, Development |
| `MAAS_API_KEY` | Your MaaS API key | Production, Preview, Development |
| `MAAS_MODEL_NAME` | `llama-3-2-3b` | Production, Preview, Development |

4. Redeploy your application

## Testing Locally

### Option 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Run locally with serverless functions
vercel dev
```

This will:
- Start your app on `http://localhost:3000`
- Run serverless functions from `/api` directory
- Load variables from `.env.local`

### Option 2: Using Webpack Dev Server

```bash
npm run start:dev
```

**Note:** The API endpoints (`/api/ai-assistant`) won't work with this method. You'll need to use `vercel dev` to test the AI integration.

## Troubleshooting

### API Key Not Found
**Error:** `MaaS API configuration missing`

**Solution:** Make sure your `.env.local` file exists and contains `MAAS_API_KEY` and `MAAS_API_ENDPOINT`.

### CORS Errors
**Error:** `Failed to fetch` or CORS policy errors

**Solution:** 
- For local dev, use `vercel dev` instead of `npm run start:dev`
- For production, ensure your Vercel environment variables are set

### Wrong Model Response Format
**Error:** `No response received`

**Solution:** The MaaS API response format might differ. Check the actual response structure and adjust `/api/ai-assistant.ts` if needed.

## Environment Variable Priority

Vercel serverless functions check variables in this order:
1. `MAAS_API_ENDPOINT` (primary)
2. `VITE_MAAS_BASE_URL` (fallback)

For API key:
1. `MAAS_API_KEY` (primary)
2. `VITE_MAAS_API_KEY` (fallback)

## Security Notes

- ⚠️ **Never commit `.env.local` to git**
- ⚠️ API keys are only used in serverless functions (backend), never exposed to the browser
- ⚠️ All API calls go through `/api/ai-assistant` to keep credentials secure


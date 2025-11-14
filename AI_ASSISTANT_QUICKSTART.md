# AI Assistant Quick Start 🚀

## Phase 2 is Complete! ✅

Your AI-powered feedback assistant is now integrated with Red Hat MaaS (llama-3-2-3b).

## Setup Steps

### 1. Create `.env.local` file

In the project root, create a file named `.env.local`:

```bash
# AI Assistant - MaaS Configuration
MAAS_API_ENDPOINT=https://maas.apps.prod.rhoai.rh-aiservices-bu.com/v1/chat/completions
MAAS_API_KEY=your_actual_maas_api_key
MAAS_MODEL_NAME=llama-3-2-3b
```

**⚠️ Replace `your_actual_maas_api_key` with your real API key from MaaS!**

### 2. Test Locally

```bash
# Install Vercel CLI (if you haven't)
npm i -g vercel

# Run with serverless functions
vercel dev
```

Open `http://localhost:3000` and click the red AI chat icon in the bottom-right.

### 3. Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Then add environment variables in Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add `MAAS_API_ENDPOINT`, `MAAS_API_KEY`, `MAAS_MODEL_NAME`
3. Redeploy

## What Works Now

✅ **Real AI Responses** - Powered by llama-3-2-3b  
✅ **Context-Aware** - AI sees all your comment threads  
✅ **Smart Filtering** - Ask about specific time ranges, pages, or issues  
✅ **Natural Language** - Just type what you want to know  

## Example Questions

Try asking the AI:
- "What feedback was left in the last week?"
- "Show me all accessibility issues"
- "Which page has the most comments?"
- "What are the main navigation problems?"
- "Summarize all feedback on version 3.0"

## Architecture

```
User Question
    ↓
AIChatPanel (Frontend)
    ↓
/api/ai-assistant (Vercel Serverless Function)
    ↓
MaaS API (llama-3-2-3b)
    ↓
AI Response
    ↓
Display in Chat
```

## Files Changed

- ✅ `/api/ai-assistant.ts` - Serverless function for MaaS integration
- ✅ `src/app/components/ai/AIContext.tsx` - API call logic
- ✅ `src/app/components/ai/AIChatPanel.tsx` - Pass comment context
- ✅ `vercel.json` - API route configuration
- ✅ `ENV_SETUP.md` - Full environment setup guide
- ✅ `AI_ASSISTANT.md` - Updated documentation

## Troubleshooting

### "MaaS API configuration missing"
**Solution:** Make sure `.env.local` exists with all 3 variables

### API calls fail locally
**Solution:** Use `vercel dev` instead of `npm run start:dev`

### Empty responses
**Solution:** Check that your MaaS API key is valid and has access to llama-3-2-3b

### CORS errors
**Solution:** API calls go through `/api/ai-assistant` (serverless function), not directly to MaaS

## Next Steps

1. Test with real comment data
2. Adjust the AI system prompt if needed (in `/api/ai-assistant.ts`)
3. Try different models (granite-3-8b, deepseek-r1) by changing `MAAS_MODEL_NAME`
4. Add more quick action buttons for common queries

## Need More Info?

- **Full setup guide:** `ENV_SETUP.md`
- **Complete docs:** `AI_ASSISTANT.md`
- **MaaS platform:** https://maas.apps.prod.rhoai.rh-aiservices-bu.com/


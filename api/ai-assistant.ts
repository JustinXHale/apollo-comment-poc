import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * AI Assistant API Function - Vercel Serverless
 * 
 * Integrates with Red Hat MaaS API (llama-3-2-3b) to provide AI-powered feedback analysis
 * 
 * Expected request body:
 * {
 *   query: string,              // User's question
 *   threads: Thread[],          // Comment threads to analyze
 *   version: string,            // Current prototype version
 *   route?: string              // Optional: specific route to analyze
 * }
 * 
 * Expected response:
 * {
 *   message: string,            // AI-generated response
 *   threadIds?: string[],       // Related thread IDs
 *   timestamp: string           // Response timestamp
 * }
 */

interface Thread {
  id: string;
  version: string;
  route: string;
  position: { x: number; y: number };
  comments: Comment[];
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request body
    const { query, threads, version, route } = req.body;

    if (!query || !threads || !version) {
      return res.status(400).json({ 
        error: 'Missing required fields: query, threads, version' 
      });
    }

    // Format the prompt with comment data
    const formattedPrompt = formatPromptWithComments(query, threads, version, route);

    // Call MaaS API
    const maasEndpoint = process.env.MAAS_API_ENDPOINT || process.env.VITE_MAAS_BASE_URL;
    const maasApiKey = process.env.MAAS_API_KEY || process.env.VITE_MAAS_API_KEY;
    const maasModel = process.env.MAAS_MODEL_NAME || 'llama-3-2-3b';

    if (!maasEndpoint || !maasApiKey) {
      throw new Error('MaaS API configuration missing. Set MAAS_API_ENDPOINT and MAAS_API_KEY environment variables.');
    }

    const response = await fetch(maasEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${maasApiKey}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        model: maasModel,
        prompt: `You are a UX feedback analyzer helping designers understand user comments on their prototypes.

Your tasks:
- Summarize feedback concisely and actionably
- Group comments by theme (accessibility, navigation, visual design, etc.)
- Identify patterns and common issues
- Prioritize high-impact items
- Be brief and designer-friendly

${formattedPrompt}

Please provide a concise analysis:`,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MaaS API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Extract the AI response from completions API format
    const aiMessage = data.choices?.[0]?.text || data.text || 'No response from AI';

    return res.status(200).json({
      message: aiMessage.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Assistant API error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Format the user query with comment thread data for the AI prompt
 */
function formatPromptWithComments(
  query: string, 
  threads: Thread[], 
  version: string, 
  route?: string
): string {
  // Filter threads by version and optionally by route
  const relevantThreads = threads.filter(t => {
    if (t.version !== version) return false;
    if (route && t.route !== route) return false;
    return true;
  });

  // Build a structured summary of comments
  const commentSummary = relevantThreads.map((thread, idx) => {
    const threadComments = thread.comments
      .map(c => `  - ${c.author} (${new Date(c.timestamp).toLocaleDateString()}): "${c.content}"`)
      .join('\n');
    
    return `Thread ${idx + 1} (${thread.route}, ${thread.status}):
${threadComments}`;
  }).join('\n\n');

  const totalComments = relevantThreads.reduce((sum, t) => sum + t.comments.length, 0);

  return `User Query: "${query}"

Context:
- Version: ${version}
${route ? `- Page: ${route}` : '- Scope: All pages'}
- Total threads: ${relevantThreads.length}
- Total comments: ${totalComments}

Comment Data:
${commentSummary || 'No comments found matching the criteria.'}

Please analyze these comments and answer the user's query.`;
}


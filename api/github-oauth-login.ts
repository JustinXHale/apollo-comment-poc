import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID;
    
    // Get the base URL from the request
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || req.headers['x-forwarded-host'];
    const baseUrl = `${protocol}://${host}`;
    const redirectUri = `${baseUrl}/api/github-oauth-callback`;

    console.log('OAuth Login:', { clientId: clientId ? 'present' : 'missing', baseUrl, redirectUri });

    if (!clientId) {
      res.status(500).json({ error: 'GitHub OAuth not configured' });
      return;
    }

    // Redirect to GitHub OAuth
    // Scope: public_repo allows read/write access to public repositories only
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=public_repo`;

    res.redirect(302, githubAuthUrl);
  } catch (error: any) {
    console.error('OAuth login error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}


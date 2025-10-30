import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    console.log('OAuth login handler called');
    console.log('Environment variables:', {
      hasClientId: !!(process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID),
      env: Object.keys(process.env).filter(k => k.includes('GITHUB'))
    });
    
    const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID;
    
    if (!clientId) {
      console.error('Client ID not found');
      res.status(500).json({ error: 'GitHub OAuth not configured - missing client ID' });
      return;
    }

    // Get the base URL from the request
    const protocol = (req.headers['x-forwarded-proto'] as string) || 'https';
    const host = (req.headers.host || req.headers['x-forwarded-host']) as string;
    
    if (!host) {
      console.error('Host not found in headers');
      res.status(500).json({ error: 'Could not determine host' });
      return;
    }
    
    const baseUrl = `${protocol}://${host}`;
    const redirectUri = `${baseUrl}/api/github-oauth-callback`;

    console.log('OAuth Login:', { clientId: 'present', baseUrl, redirectUri });

    // Redirect to GitHub OAuth
    // Scope: public_repo allows read/write access to public repositories only
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=public_repo`;

    console.log('Redirecting to GitHub...');
    res.redirect(302, githubAuthUrl);
  } catch (error: any) {
    console.error('OAuth login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      stack: error.stack 
    });
  }
}


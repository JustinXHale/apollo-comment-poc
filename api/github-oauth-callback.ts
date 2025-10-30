import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const code = req.query.code as string;
    const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    console.log('OAuth Callback:', { 
      hasCode: !!code, 
      hasClientId: !!clientId, 
      hasClientSecret: !!clientSecret 
    });

    if (!code) {
      res.status(400).json({ error: 'No code provided' });
      return;
    }

    if (!clientId || !clientSecret) {
      res.status(500).json({ error: 'GitHub OAuth not configured properly' });
      return;
    }
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      throw new Error('No access token received');
    }

    // Get user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const user = userResponse.data;

    // Redirect back to the app with token in URL fragment (client-side only)
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || req.headers['x-forwarded-host'];
    const baseUrl = `${protocol}://${host}`;
    const redirectUrl = `${baseUrl}/#/auth-callback?token=${accessToken}&login=${user.login}&avatar=${encodeURIComponent(user.avatar_url)}`;

    console.log('Redirecting to:', redirectUrl);
    res.redirect(302, redirectUrl);
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    res.status(500).json({
      error: 'Failed to exchange code for token',
      details: error.message,
    });
  }
}


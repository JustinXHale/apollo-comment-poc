import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = req.query.code as string;
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'GitHub OAuth not configured properly' });
  }

  try {
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
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:8080';
    const redirectUrl = `${baseUrl}/#/auth-callback?token=${accessToken}&login=${user.login}&avatar=${encodeURIComponent(user.avatar_url)}`;

    res.redirect(302, redirectUrl);
  } catch (error: any) {
    console.error('OAuth callback error:', error.response?.data || error.message);
    return res.status(500).json({
      error: 'Failed to exchange code for token',
      details: error.response?.data || error.message,
    });
  }
}


import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const code = req.query.code as string;
    if (!code) {
      res.status(400).json({ error: 'Missing code parameter' });
      return;
    }

    const clientId = process.env.VITE_GITLAB_CLIENT_ID || process.env.GITLAB_CLIENT_ID;
    const clientSecret = process.env.VITE_GITLAB_CLIENT_SECRET || process.env.GITLAB_CLIENT_SECRET;
    const baseUrl = process.env.VITE_GITLAB_BASE_URL || 'https://gitlab.com';

    if (!clientId || !clientSecret) {
      res.status(500).json({ error: 'GitLab OAuth not configured (client id/secret missing)' });
      return;
    }

    const protocol = (req.headers['x-forwarded-proto'] as string) || 'https';
    const host = (req.headers.host || req.headers['x-forwarded-host']) as string;
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    // Exchange code for token
    const tokenResp = await axios.post(`${baseUrl}/oauth/token`, {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const accessToken = tokenResp.data?.access_token as string | undefined;
    if (!accessToken) {
      res.status(500).json({ error: 'No access token received from GitLab' });
      return;
    }

    // Fetch basic user info (optional, for header avatar)
    let username = '';
    let avatar = '';
    try {
      const userResp = await axios.get(`${baseUrl}/api/v4/user`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      username = userResp.data?.username || '';
      avatar = userResp.data?.avatar_url || '';
    } catch {
      // ignore user fetch errors
    }

    const appBase = `${protocol}://${host}`;
    const appRedirect = `${appBase}/#/auth-callback?gitlab_token=${encodeURIComponent(accessToken)}`
      + (username ? `&gitlab_username=${encodeURIComponent(username)}` : '')
      + (avatar ? `&gitlab_avatar=${encodeURIComponent(avatar)}` : '');

    res.redirect(302, appRedirect);
  } catch (error: any) {
    console.error('GitLab OAuth callback error:', error?.response?.data || error?.message || error);
    res.status(500).json({ error: 'GitLab OAuth callback failed', details: error?.message || 'unknown' });
  }
}



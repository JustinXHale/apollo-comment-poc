import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID;
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:8080';
  const redirectUri = `${baseUrl}/api/github-oauth-callback`;

  if (!clientId) {
    return res.status(500).json({ error: 'GitHub OAuth not configured' });
  }

  // Redirect to GitHub OAuth
  // Scope: public_repo allows read/write access to public repositories only
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=public_repo`;

  res.redirect(302, githubAuthUrl);
}


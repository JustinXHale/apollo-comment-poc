import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.URL || 'http://localhost:8080'}/.netlify/functions/github-oauth-callback`;

  if (!clientId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GitHub OAuth not configured' }),
    };
  }

  // Redirect to GitHub OAuth
  // Scope: public_repo allows read/write access to public repositories only
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=public_repo`;

  return {
    statusCode: 302,
    headers: {
      Location: githubAuthUrl,
    },
    body: '',
  };
};


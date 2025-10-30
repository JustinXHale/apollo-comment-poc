import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { token, method, endpoint, data } = req.body;

    if (!token) {
      res.status(401).json({ error: 'No authentication token provided' });
      return;
    }

    if (!endpoint) {
      res.status(400).json({ error: 'No endpoint provided' });
      return;
    }

    // Make the GitHub API request
    const response = await axios({
      method: method || 'GET',
      url: `https://api.github.com${endpoint}`,
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      data: data || undefined,
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('GitHub API proxy error:', error.response?.data || error.message);
    
    res.status(error.response?.status || 500).json({
      error: 'GitHub API request failed',
      message: error.response?.data?.message || error.message,
      details: error.response?.data,
    });
  }
}


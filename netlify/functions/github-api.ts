import { Handler } from '@netlify/functions';
import axios from 'axios';

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { token, method, endpoint, data } = JSON.parse(event.body || '{}');

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'No authentication token provided' }),
      };
    }

    if (!endpoint) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No endpoint provided' }),
      };
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error: any) {
    console.error('GitHub API proxy error:', error.response?.data || error.message);
    
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'GitHub API request failed',
        message: error.response?.data?.message || error.message,
        details: error.response?.data,
      }),
    };
  }
};


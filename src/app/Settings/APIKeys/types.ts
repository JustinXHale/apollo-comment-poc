export interface APIKey {
  id: string;
  name: string;
  description?: string;
  apiKey: string;
  owner: {
    type: 'User' | 'Group' | 'Service Account';
    name: string;
  };
  dateCreated: Date;
  dateLastUsed?: Date;
  limits?: {
    tokenRateLimit?: number; // tokens per minute
    requestRateLimit?: number; // requests per minute
    budgetLimit?: number;
    expirationDate?: Date;
  };
  assets: {
    modelEndpoints: string[];
    mcpServers: string[];
    vectorDatabases: string[];
    agents: string[];
  };
}

export interface Model {
  id: string;
  name: string;
  endpoint: string;
}

export interface MCPServer {
  id: string;
  name: string;
  tools: string[];
  endpoint: string;
}

export interface VectorDatabase {
  id: string;
  name: string;
  size: string;
}

export interface Agent {
  id: string;
  name: string;
  endpoint: string;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
}

export interface MetricData {
  timestamp: Date;
  value: number;
}

export interface APIKeyMetrics {
  totalRequests: number;
  successRate: number;
  totalTokens: number;
  totalCost: number;
  requestsOverTime: MetricData[];
}

export type TimeRange = '24h' | '7d' | '30d';

export interface CreateAPIKeyForm {
  name: string;
  description?: string;
  owner: {
    type: 'User' | 'Group' | 'Service Account';
    name: string;
  };
  limits?: {
    tokenRateLimit?: number;
    requestRateLimit?: number;
    budgetLimit?: number;
    expirationDate?: Date;
  };
  assets: {
    modelEndpoints: string[];
    mcpServers: string[];
    vectorDatabases: string[];
    agents: string[];
  };
}

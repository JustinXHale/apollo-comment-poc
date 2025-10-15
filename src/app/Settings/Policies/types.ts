export type PolicyType = 'AuthPolicy' | 'RateLimitPolicy' | 'TLSPolicy' | 'DNSPolicy';

export interface Policy {
  id: string;
  name: string;
  description: string;
  type: PolicyType;
  status: 'Active' | 'Inactive';
  gitSource?: string;
  targets: {
    groups: string[];
    users: string[];
    serviceAccounts: string[];
  };
  availableAssets: {
    models: string[]; // 'all' or specific model IDs
    mcpServers: string[]; // 'all' or specific MCP server IDs
  };
  limits: {
    tokenLimit?: {
      amount: number;
      period: 'minute' | 'hour' | 'day';
    };
    rateLimit?: {
      amount: number;
      period: 'minute' | 'hour' | 'day';
    };
    timeLimit?: {
      start: Date;
      end: Date;
    };
    quotaRenewalSchedule?: {
      startTime: 'dateCreated' | Date;
    };
    overLimitBehavior?: 'hard' | 'soft';
    softThrottlePercentage?: number;
  };
  dateCreated: Date;
  createdBy: string;
  yaml?: string;
}

export interface CreatePolicyForm {
  name: string;
  description: string;
  availableAssets: {
    models: string[];
    mcpServers: string[];
  };
  limits: {
    tokenLimit?: {
      amount: number;
      period: 'minute' | 'hour' | 'day';
    };
    rateLimit?: {
      amount: number;
      period: 'minute' | 'hour' | 'day';
    };
    timeLimit?: {
      start: Date;
      end: Date;
    } | null;
  };
  targets: {
    groups: string[];
    users: string[];
    serviceAccounts: string[];
  };
}


export interface Policy {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
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
  };
  dateCreated: Date;
  createdBy: string;
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


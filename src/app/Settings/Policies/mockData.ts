import { Policy } from './types';

// Available groups for policy targeting
export const mockGroups = [
  { id: 'dev-team', name: 'Development Team' },
  { id: 'qa-team', name: 'QA Team' },
  { id: 'data-science-team', name: 'Data Science Team' },
  { id: 'ml-engineers', name: 'ML Engineers' },
  { id: 'platform-team', name: 'Platform Team' },
  { id: 'research-team', name: 'Research Team' },
];

// Available users for policy targeting
export const mockUsers = [
  { id: 'john.doe', name: 'John Doe' },
  { id: 'jane.smith', name: 'Jane Smith' },
  { id: 'bob.johnson', name: 'Bob Johnson' },
  { id: 'alice.williams', name: 'Alice Williams' },
  { id: 'charlie.brown', name: 'Charlie Brown' },
];

// Available service accounts for policy targeting
export const mockServiceAccounts = [
  { id: 'prod-service-account', name: 'Production Service Account' },
  { id: 'dev-service-account', name: 'Development Service Account' },
  { id: 'ci-cd-service-account', name: 'CI/CD Service Account' },
  { id: 'monitoring-service-account', name: 'Monitoring Service Account' },
];

// Mock policies
export const mockPolicies: Policy[] = [
  {
    id: 'devs-rate-limit-standard',
    name: 'Developer Rate Limit Standard',
    description: 'Standard rate limiting for development teams: 1000 requests/minute, 50K tokens/minute',
    status: 'Active',
    targets: {
      groups: ['dev-team', 'qa-team'],
      users: ['john.doe'],
      serviceAccounts: ['dev-service-account'],
    },
    availableAssets: {
      models: ['all'],
      mcpServers: ['all'],
    },
    limits: {
      tokenLimit: {
        amount: 50000,
        period: 'minute',
      },
      rateLimit: {
        amount: 1000,
        period: 'minute',
      },
    },
    dateCreated: new Date('2025-01-10T10:00:00Z'),
    createdBy: 'admin',
  },
  {
    id: 'devs-budget-standard',
    name: 'Developer Budget Standard',
    description: 'Monthly budget cap of $500 for development API usage',
    status: 'Active',
    targets: {
      groups: ['dev-team'],
      users: [],
      serviceAccounts: [],
    },
    availableAssets: {
      models: ['all'],
      mcpServers: ['all'],
    },
    limits: {
      timeLimit: {
        start: new Date('2025-01-01T00:00:00Z'),
        end: new Date('2025-12-31T23:59:59Z'),
      },
    },
    dateCreated: new Date('2025-01-05T14:30:00Z'),
    createdBy: 'admin',
  },
  {
    id: 'prod-rate-limit-high',
    name: 'Production Rate Limit High',
    description: 'High throughput for production workloads: 10K requests/minute, 500K tokens/minute',
    status: 'Active',
    targets: {
      groups: ['platform-team'],
      users: [],
      serviceAccounts: ['prod-service-account'],
    },
    availableAssets: {
      models: ['gpt-oss-20b', 'granite-3.1b'],
      mcpServers: ['openshift', 'rhel'],
    },
    limits: {
      tokenLimit: {
        amount: 500000,
        period: 'minute',
      },
      rateLimit: {
        amount: 10000,
        period: 'minute',
      },
    },
    dateCreated: new Date('2025-01-08T09:15:00Z'),
    createdBy: 'platform-admin',
  },
  {
    id: 'security-data-classification',
    name: 'Security Data Classification',
    description: 'Restricts access to models based on data classification levels',
    status: 'Active',
    targets: {
      groups: ['dev-team', 'ml-engineers'],
      users: ['jane.smith', 'bob.johnson'],
      serviceAccounts: [],
    },
    availableAssets: {
      models: ['granite-3.1b', 'llama-7b'],
      mcpServers: ['all'],
    },
    limits: {},
    dateCreated: new Date('2025-01-12T16:45:00Z'),
    createdBy: 'security-admin',
  },
  {
    id: 'compliance-audit-logging',
    name: 'Compliance Audit Logging',
    description: 'Enhanced logging for compliance and audit requirements',
    status: 'Active',
    targets: {
      groups: ['platform-team'],
      users: [],
      serviceAccounts: ['prod-service-account', 'monitoring-service-account'],
    },
    availableAssets: {
      models: ['all'],
      mcpServers: ['all'],
    },
    limits: {
      timeLimit: {
        start: new Date('2025-01-01T00:00:00Z'),
        end: new Date('2026-01-01T00:00:00Z'),
      },
    },
    dateCreated: new Date('2025-01-15T11:20:00Z'),
    createdBy: 'compliance-admin',
  },
  {
    id: 'cost-optimization',
    name: 'Cost Optimization Policy',
    description: 'Automatic model selection based on cost-effectiveness for the task',
    status: 'Inactive',
    targets: {
      groups: ['data-science-team', 'research-team'],
      users: ['alice.williams'],
      serviceAccounts: [],
    },
    availableAssets: {
      models: ['all'],
      mcpServers: ['all'],
    },
    limits: {
      tokenLimit: {
        amount: 100000,
        period: 'day',
      },
      rateLimit: {
        amount: 2000,
        period: 'hour',
      },
    },
    dateCreated: new Date('2025-01-18T13:10:00Z'),
    createdBy: 'admin',
  },
];

// Utility functions
export const getPolicyById = (id: string): Policy | undefined => 
  mockPolicies.find(p => p.id === id);

export const getGroupById = (id: string) => 
  mockGroups.find(g => g.id === id);

export const getUserById = (id: string) => 
  mockUsers.find(u => u.id === id);

export const getServiceAccountById = (id: string) => 
  mockServiceAccounts.find(sa => sa.id === id);



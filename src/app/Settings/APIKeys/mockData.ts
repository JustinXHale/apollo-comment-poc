import { APIKey, Model, MCPServer, VectorDatabase, Agent, Policy, APIKeyMetrics } from './types';

// Available models
export const mockModels: Model[] = [
  { id: 'gpt-oss-20b', name: 'GPT-OSS 20B', endpoint: 'https://api.example.com/models/gpt-oss-20b' },
  { id: 'granite-3.1b', name: 'Granite 3.1B', endpoint: 'https://api.example.com/models/granite-3.1b' },
  { id: 'llama-7b', name: 'Llama 7B', endpoint: 'https://api.example.com/models/llama-7b' },
  { id: 'codellama-13b', name: 'CodeLlama 13B', endpoint: 'https://api.example.com/models/codellama-13b' },
  { id: 'mistral-7b', name: 'Mistral 7B', endpoint: 'https://api.example.com/models/mistral-7b' },
];

// Available MCP servers
export const mockMCPServers: MCPServer[] = [
  { 
    id: 'openshift', 
    name: 'OpenShift', 
    tools: ['pod-management', 'deployment-control', 'cluster-monitoring'],
    endpoint: 'https://mcp.example.com/openshift'
  },
  { 
    id: 'rhel', 
    name: 'RHEL', 
    tools: ['system-management', 'package-management', 'security-scanning'],
    endpoint: 'https://mcp.example.com/rhel'
  },
  { 
    id: 'ansible', 
    name: 'Ansible', 
    tools: ['playbook-execution', 'inventory-management', 'task-automation'],
    endpoint: 'https://mcp.example.com/ansible'
  },
  { 
    id: 'git', 
    name: 'Git', 
    tools: ['repository-management', 'branch-operations', 'commit-analysis'],
    endpoint: 'https://mcp.example.com/git'
  },
];

// Available vector databases
export const mockVectorDatabases: VectorDatabase[] = [
  { id: 'vectordb-1', name: 'Knowledge Base Vectors', size: '2.4 GB' },
  { id: 'vectordb-2', name: 'Document Embeddings', size: '1.8 GB' },
  { id: 'vectordb-3', name: 'Code Similarity Index', size: '3.2 GB' },
  { id: 'vectordb-4', name: 'Product Catalog Vectors', size: '892 MB' },
];

// Available agents
export const mockAgents: Agent[] = [
  { id: 'agent-1', name: 'Code Review Assistant', endpoint: 'https://agents.example.com/code-review' },
  { id: 'agent-2', name: 'Documentation Generator', endpoint: 'https://agents.example.com/doc-gen' },
  { id: 'agent-3', name: 'Bug Triage Agent', endpoint: 'https://agents.example.com/bug-triage' },
  { id: 'agent-4', name: 'Test Case Generator', endpoint: 'https://agents.example.com/test-gen' },
];

// Available policies
export const mockPolicies: Policy[] = [
  { id: 'devs-rate-limit-standard', name: 'Developer Rate Limit Standard', description: 'Standard rate limiting for development teams: 1000 requests/minute, 50K tokens/minute' },
  { id: 'devs-budget-standard', name: 'Developer Budget Standard', description: 'Monthly budget cap of $500 for development API usage' },
  { id: 'prod-rate-limit-high', name: 'Production Rate Limit High', description: 'High throughput for production workloads: 10K requests/minute, 500K tokens/minute' },
  { id: 'security-data-classification', name: 'Security Data Classification', description: 'Restricts access to models based on data classification levels' },
  { id: 'compliance-audit-logging', name: 'Compliance Audit Logging', description: 'Enhanced logging for compliance and audit requirements' },
  { id: 'cost-optimization', name: 'Cost Optimization Policy', description: 'Automatic model selection based on cost-effectiveness for the task' },
];

// Mock API keys
export const mockAPIKeys: APIKey[] = [
  {
    id: 'key-1',
    name: 'Development Team Key',
    description: 'Main API key for the development team to access models and tools',
    apiKey: 'sk-1234567890abcdef1234567890abcdef',
    owner: { type: 'Group', name: 'dev-team' },
    dateCreated: new Date('2024-01-15T10:30:00Z'),
    dateLastUsed: new Date('2024-01-20T15:45:00Z'),
    limits: {
      tokenRateLimit: 50000,
      requestRateLimit: 1000,
      budgetLimit: 500,
    },
    assets: {
      modelEndpoints: ['gpt-oss-20b', 'granite-3.1b', 'llama-7b'],
      mcpServers: ['openshift', 'ansible'],
      vectorDatabases: ['vectordb-1', 'vectordb-2'],
      agents: ['agent-1', 'agent-2'],
    },
  },
  {
    id: 'key-2',
    name: 'Production Workload Key',
    description: 'High-throughput key for production applications',
    apiKey: 'sk-abcdef1234567890abcdef1234567890',
    owner: { type: 'Service Account', name: 'prod-service-account' },
    dateCreated: new Date('2024-01-10T08:15:00Z'),
    dateLastUsed: new Date('2024-01-20T16:22:00Z'),
    limits: {
      tokenRateLimit: 500000,
      requestRateLimit: 10000,
      budgetLimit: 2000,
    },
    assets: {
      modelEndpoints: ['gpt-oss-20b', 'granite-3.1b', 'mistral-7b'],
      mcpServers: ['openshift', 'rhel'],
      vectorDatabases: ['vectordb-1', 'vectordb-3'],
      agents: ['agent-1', 'agent-3'],
    },
  },
  {
    id: 'key-3',
    name: 'Research Project Key',
    description: 'API key for ML research experiments',
    apiKey: 'sk-fedcba0987654321fedcba0987654321',
    owner: { type: 'User', name: 'john.doe' },
    dateCreated: new Date('2024-01-18T14:20:00Z'),
    dateLastUsed: new Date('2024-01-19T11:10:00Z'),
    limits: {
      tokenRateLimit: 25000,
      requestRateLimit: 500,
      budgetLimit: 200,
      expirationDate: new Date('2024-07-18T14:20:00Z'),
    },
    assets: {
      modelEndpoints: ['codellama-13b', 'mistral-7b'],
      mcpServers: ['git'],
      vectorDatabases: ['vectordb-4'],
      agents: ['agent-4'],
    },
  },
];

// Generate mock metrics data
const generateMetricsOverTime = (days: number): { timestamp: Date; value: number }[] => {
  const data: { timestamp: Date; value: number }[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const value = Math.floor(Math.random() * 1000) + 100; // Random requests between 100-1100
    data.push({ timestamp, value });
  }
  return data;
};

// Mock metrics for each API key
export const mockMetrics: Record<string, APIKeyMetrics> = {
  'key-1': {
    totalRequests: 45892,
    successRate: 98.2,
    totalTokens: 2340567,
    totalCost: 234.56,
    requestsOverTime: generateMetricsOverTime(30),
  },
  'key-2': {
    totalRequests: 158234,
    successRate: 99.7,
    totalTokens: 8923456,
    totalCost: 892.34,
    requestsOverTime: generateMetricsOverTime(30),
  },
  'key-3': {
    totalRequests: 12456,
    successRate: 97.8,
    totalTokens: 567890,
    totalCost: 56.79,
    requestsOverTime: generateMetricsOverTime(30),
  },
};

// Get policies applied to an API key
export const getAPIKeyPolicies = (keyId: string): Policy[] => {
  switch (keyId) {
    case 'key-1':
      return [mockPolicies[0], mockPolicies[1], mockPolicies[3]]; // dev-rate-limit, dev-budget, security
    case 'key-2':
      return [mockPolicies[2], mockPolicies[4], mockPolicies[5]]; // prod-rate-limit, audit-logging, cost-optimization
    case 'key-3':
      return [mockPolicies[0], mockPolicies[1]]; // dev-rate-limit, dev-budget
    default:
      return [];
  }
};

// Utility functions for getting data by ID
export const getModelById = (id: string): Model | undefined => mockModels.find(m => m.id === id);
export const getMCPServerById = (id: string): MCPServer | undefined => mockMCPServers.find(s => s.id === id);
export const getVectorDatabaseById = (id: string): VectorDatabase | undefined => mockVectorDatabases.find(v => v.id === id);
export const getAgentById = (id: string): Agent | undefined => mockAgents.find(a => a.id === id);
export const getAPIKeyById = (id: string): APIKey | undefined => mockAPIKeys.find(k => k.id === id);

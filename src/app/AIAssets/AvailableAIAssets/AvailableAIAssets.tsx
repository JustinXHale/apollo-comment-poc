import React from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Checkbox,
  CodeBlock,
  CodeBlockCode,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  FormHelperText,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  InputGroup,
  InputGroupItem,
  Label,
  LabelGroup,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection,
  Pagination,
  Popover,
  Progress,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Spinner,
  Tab,
  TabTitleText,
  Tabs,
  TextArea,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip
} from '@patternfly/react-core';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@patternfly/react-table';
import {
  CheckCircleIcon,
  CopyIcon,
  EllipsisVIcon,
  ExclamationCircleIcon,
  FilterIcon,
  InfoCircleIcon,
  OutlinedQuestionCircleIcon,
  ListIcon,
  OutlinedFolderIcon,
  PlayIcon,
  PlusCircleIcon,
  SearchIcon,
  ThIcon,
  ToolsIcon
} from '@patternfly/react-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { useFeatureFlags } from '../../utils/FeatureFlagsContext';
import { useUserProfile } from '../../utils/UserProfileContext';
import { mcpServerLogos } from '../MVPServers/mcpServerLogos';
import { modelLogos } from '../Models/modelLogos';
import { ModelDeploymentModal } from './ModelDeploymentModal';

// Types
interface PlaygroundModel {
  id: string;
  name: string;
  slug: string;
  endpoint: string;
  token: string;
}

// Resource Info Tooltip Component
const ResourceInfoTooltip: React.FunctionComponent<{
  resourceName: string;
  copiedItems: Set<string>;
  handleCopyWithFeedback: (text: string, itemId: string) => void;
}> = ({ resourceName, copiedItems, handleCopyWithFeedback }) => {
  const tooltipContent = (
    <div style={{ padding: '0.5rem', maxWidth: '300px' }}>
      <div style={{ marginBottom: '1rem' }}>
        The model ID is a unique identifier required to access this model directly.
      </div>
      
      <div>
        <label style={{ fontWeight: 'bold', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
          Model ID
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <TextInput
            value={resourceName}
            readOnly
            aria-label="Model ID"
            style={{ fontSize: '0.75rem', height: '28px' }}
          />
          <Tooltip content={copiedItems.has(`resource-name-${resourceName}`) ? 'Copied' : 'Copy model ID'}>
            <Button
              variant="plain"
              size="sm"
              aria-label="Copy model ID"
              onClick={() => handleCopyWithFeedback(resourceName, `resource-name-${resourceName}`)}
              style={{ padding: '4px' }}
            >
              {copiedItems.has(`resource-name-${resourceName}`) ? <CheckCircleIcon style={{ fontSize: '12px' }} /> : <CopyIcon style={{ fontSize: '12px' }} />}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      bodyContent={tooltipContent}
      position="right"
    >
      <Button
        variant="plain"
        size="sm"
        aria-label="Resource information"
        style={{ 
          padding: '2px',
          marginLeft: '4px',
          verticalAlign: 'middle'
        }}
      >
        <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: '#6A6E73' }} />
      </Button>
    </Popover>
  );
};

// Endpoint Popover Component
const EndpointPopover: React.FunctionComponent<{
  model: ModelAsset;
  copiedItems: Set<string>;
  handleCopyWithFeedback: (text: string, itemId: string) => void;
  type: 'internal' | 'external';
  generatedTokens?: Map<string, string>;
  isGeneratingToken?: Set<string>;
  onGenerateToken?: (modelId: string) => void;
  onClearGeneratedToken?: (modelId: string) => void;
  isMaaS?: boolean;
}> = ({ model, copiedItems, handleCopyWithFeedback, type, generatedTokens, isGeneratingToken, onGenerateToken, onClearGeneratedToken, isMaaS }) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const endpoint = type === 'internal' ? model.internalEndpoint : model.externalEndpoint;
  const token = type === 'internal' ? model.internalToken : model.externalToken;
  const endpointId = `${type}-endpoint-${model.id}`;
  const tokenId = `${type}-token-${model.id}`;

  const handlePopoverClose = () => {
    setIsPopoverOpen(false);
    // Clear generated token for MaaS models when popover closes
    if ((model.name === 'llama-3.1-8b-instruct' || model.name === 'Pixtral-Large-Instruct-2411-hf-quantized.w8a8') && type === 'external') {
      onClearGeneratedToken?.(model.id);
    }
  };

  const popoverContent = (
    <div style={{ padding: '0.5rem', width: '400px', minWidth: '400px' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ fontWeight: 'bold', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
          {isMaaS && type === 'external' ? 'MaaS route' : `${type === 'internal' ? 'Internal' : 'External'} Endpoint URL`}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <TextInput
            value={endpoint || ''}
            readOnly
            aria-label="Endpoint URL"
            style={{ fontSize: '0.75rem', height: '28px', fontFamily: 'monospace' }}
          />
          <Tooltip content={copiedItems.has(endpointId) ? 'Copied' : 'Copy endpoint'}>
            <Button
              variant="plain"
              size="sm"
              aria-label="Copy endpoint"
              onClick={() => handleCopyWithFeedback(endpoint!, endpointId)}
              style={{ padding: '4px' }}
            >
              {copiedItems.has(endpointId) ? <CheckCircleIcon style={{ fontSize: '12px' }} /> : <CopyIcon style={{ fontSize: '12px' }} />}
            </Button>
          </Tooltip>
        </div>
      </div>
      
      {type === 'external' && (
        <div>
          <label style={{ fontWeight: 'bold', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
            API Token
          </label>
          {(model.name === 'llama-3.1-8b-instruct' || model.name === 'Pixtral-Large-Instruct-2411-hf-quantized.w8a8') ? (
            // MaaS model token generation
            generatedTokens?.has(model.id) ? (
              <div>
                <Alert
                  variant="info"
                  title="Important: Copy and store this token"
                  isInline
                  style={{ marginBottom: '0.5rem' }}
                >
                  This token cannot be viewed again after you close this dialog.
                </Alert>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <TextInput
                    value={generatedTokens.get(model.id) || ''}
                    readOnly
                    aria-label="Generated API Token"
                    style={{ fontSize: '0.75rem', height: '28px', fontFamily: 'monospace' }}
                  />
                  <Tooltip content={copiedItems.has(tokenId) ? 'Copied' : 'Copy token'}>
                    <Button
                      variant="plain"
                      size="sm"
                      aria-label="Copy token"
                      onClick={() => handleCopyWithFeedback(generatedTokens.get(model.id)!, tokenId)}
                      style={{ padding: '4px' }}
                    >
                      {copiedItems.has(tokenId) ? <CheckCircleIcon style={{ fontSize: '12px' }} /> : <CopyIcon style={{ fontSize: '12px' }} />}
                    </Button>
                  </Tooltip>
                </div>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onGenerateToken?.(model.id)}
                isLoading={isGeneratingToken?.has(model.id)}
                isDisabled={isGeneratingToken?.has(model.id)}
              >
                {isGeneratingToken?.has(model.id) ? 'Generating...' : 'Generate API token'}
              </Button>
            )
          ) : (
            // Regular model token display
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TextInput
              value={token || ''}
              readOnly
              aria-label="API Token"
              style={{ fontSize: '0.75rem', height: '28px', fontFamily: 'monospace' }}
            />
            <Tooltip content={copiedItems.has(tokenId) ? 'Copied' : 'Copy token'}>
              <Button
                variant="plain"
                size="sm"
                aria-label="Copy token"
                onClick={() => handleCopyWithFeedback(token!, tokenId)}
                style={{ padding: '4px' }}
              >
                {copiedItems.has(tokenId) ? <CheckCircleIcon style={{ fontSize: '12px' }} /> : <CopyIcon style={{ fontSize: '12px' }} />}
              </Button>
            </Tooltip>
          </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Popover
      bodyContent={popoverContent}
      position="right"
      hasAutoWidth
      enableFlip={false}
      isVisible={isPopoverOpen}
      shouldOpen={() => setIsPopoverOpen(true)}
      shouldClose={handlePopoverClose}
    >
      <Button
        variant="link"
        onClick={() => setIsPopoverOpen(true)}
      >
        View
      </Button>
    </Popover>
  );
};

// MCP Endpoint Popover Component
const MCPEndpointPopover: React.FunctionComponent<{
  server: MCPServer;
  copiedItems: Set<string>;
  handleCopyWithFeedback: (text: string, itemId: string) => void;
}> = ({ server, copiedItems, handleCopyWithFeedback }) => {
  const endpoint = server.streamableEndpoint;
  const token = server.streamableToken;
  const endpointId = `streamable-endpoint-${server.id}`;
  const tokenId = `streamable-token-${server.id}`;

  const popoverContent = (
    <div style={{ padding: '0.5rem', maxWidth: '400px' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ fontWeight: 'bold', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
          Connection URL
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <TextInput
            value={endpoint || ''}
            readOnly
            aria-label="Streamable Endpoint URL"
            style={{ fontSize: '0.75rem', height: '28px', fontFamily: 'monospace' }}
          />
          <Tooltip content={copiedItems.has(endpointId) ? 'Copied' : 'Copy endpoint'}>
            <Button
              variant="plain"
              size="sm"
              aria-label="Copy endpoint"
              onClick={() => handleCopyWithFeedback(endpoint!, endpointId)}
              style={{ padding: '4px' }}
            >
              {copiedItems.has(endpointId) ? <CheckCircleIcon style={{ fontSize: '12px' }} /> : <CopyIcon style={{ fontSize: '12px' }} />}
            </Button>
          </Tooltip>
        </div>
      </div>
      
      {token && (
        <div>
          <label style={{ fontWeight: 'bold', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
            API Token
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TextInput
              value={token || ''}
              readOnly
              aria-label="API Token"
              style={{ fontSize: '0.75rem', height: '28px', fontFamily: 'monospace' }}
            />
            <Tooltip content={copiedItems.has(tokenId) ? 'Copied' : 'Copy token'}>
              <Button
                variant="plain"
                size="sm"
                aria-label="Copy token"
                onClick={() => handleCopyWithFeedback(token!, tokenId)}
                style={{ padding: '4px' }}
              >
                {copiedItems.has(tokenId) ? <CheckCircleIcon style={{ fontSize: '12px' }} /> : <CopyIcon style={{ fontSize: '12px' }} />}
              </Button>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Popover
      bodyContent={popoverContent}
      position="right"
    >
      <Button
        variant="link"
      >
        View
      </Button>
    </Popover>
  );
};

// Mock data types
interface ModelAsset {
  id: string;
  name: string;
  slug: string;
  internalEndpoint: string;
  internalToken?: string;
  externalEndpoint?: string;
  externalToken?: string;
  llsStatus: 'registered' | 'not-registered';
  useCase: string;
  description?: string;
  framework?: string;
  version?: string;
  logo: string;
  hasReasoning?: boolean;
  status: string;
  statusColor: string;
}

interface MCPServer {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  version: string;
  description: string;
  logo: string;
  slug: string;
  streamableEndpoint?: string;
  streamableToken?: string;
}

// Mock data
const mockModels: ModelAsset[] = [
  {
    id: '1',
    name: 'llama-3.1-8b-instruct',
    slug: 'llama-3-1-8b-instruct',
    internalEndpoint: 'http://llama-3-1-8b.demo-namespace.svc.cluster.local:8080/v1',
    internalToken: 'sk-internal-token-123',
    externalEndpoint: 'https://api.demo.openshift.ai/models/llama-3-1-8b/v1',
    externalToken: 'sk-external-token-456',
    llsStatus: 'registered',
    useCase: 'General chat',
    description: 'Meta Llama 3.1 8B parameter model optimized for instruction following',
    framework: 'vLLM',
    version: '3.1',
    logo: modelLogos['llama-3-1-8b-instruct'],
    hasReasoning: false,


    status: 'Running',
    statusColor: '#3e8635'
  },
  {
    id: '2',
    name: 'granite-7b-code:1.1',
    slug: 'granite-7b-code',
    internalEndpoint: 'http://granite-7b-code.demo-namespace.svc.cluster.local:8080/v1',
    internalToken: 'sk-internal-granite-789',
    externalEndpoint: 'https://api.demo.openshift.ai/models/granite-7b/v1',
    externalToken: 'sk-external-granite-xyz',
    llsStatus: 'not-registered',
    useCase: 'Code generation',
    description: 'IBM Granite 7B model specialized for code generation tasks',
    framework: 'TGI',
    version: '1.0',
    logo: modelLogos['granite-7b-code'],
    hasReasoning: false,


    status: 'Running',
    statusColor: '#3e8635'
  },
  {
    id: '3',
    name: 'mistral-7b-instruct:9.1.1',
    slug: 'mistral-7b-instruct',
    internalEndpoint: 'http://mistral-7b.demo-namespace.svc.cluster.local:8080/v1',
    internalToken: 'sk-internal-mistral-abc',
    externalEndpoint: 'https://api.demo.openshift.ai/models/mistral-7b/v1',
    externalToken: 'sk-external-mistral-def',
    llsStatus: 'registered',
    useCase: 'Multilingual, Reasoning',
    description: 'Mistral 7B instruction-tuned model for general purpose tasks',
    framework: 'vLLM',
    version: '0.1',
    logo: modelLogos['mistral-7b-instruct'],
    hasReasoning: true,


    status: 'Running',
    statusColor: '#3e8635'
  },
  {
    id: '4',
    name: 'gpt-oss-120b-FP8-Dynamic:1.4.0',
    slug: 'gpt-oss-120b-fp8-dynamic',
    internalEndpoint: 'http://gpt-oss-120b.demo-namespace.svc.cluster.local:8080/v1',
    internalToken: 'sk-internal-gpt-oss-120b-xyz',
    externalEndpoint: 'https://api.demo.openshift.ai/models/gpt-oss-120b/v1',
    externalToken: 'sk-external-gpt-oss-120b-abc',
    llsStatus: 'not-registered',
    useCase: 'Text generation',
    description: 'For production, general purpose, high reasoning use cases that fit into a single 80GB GPU (like NVIDIA H100 or AMD MI300X) (117B parameters with 5.1B active parameters)',
    framework: 'vLLM',
    version: '1.0',
    logo: modelLogos['generic-model-icon'],
    hasReasoning: true,


    status: 'Running',
    statusColor: '#3e8635'
  },
  {
    id: '5',
    name: 'Pixtral-Large-Instruct-2411-hf-quantized.w8a8',
    slug: 'pixtral-large-instruct-2411-hf-quantized-w8a8',
    internalEndpoint: 'http://pixtral-large.demo-namespace.svc.cluster.local:8080/v1',
    internalToken: 'sk-internal-pixtral-abc123',
    externalEndpoint: 'https://api.demo.openshift.ai/models/pixtral-large/v1',
    externalToken: 'sk-external-pixtral-789',
    llsStatus: 'not-registered',
    useCase: 'Vision, Multimodal',
    description: 'This model was obtained by quantizing the weights of neuralmagic/Pixtral-Large-Instruct-2411-hf to INT8 data type, ready for inference with vLLM >= 0.5.2.',
    framework: 'vLLM',
    version: '1.5.0',
    logo: modelLogos['generic-model-icon'],
    hasReasoning: true,
    status: 'Running',
    statusColor: '#3e8635'
  }
];

const mockMCPServers: MCPServer[] = [
  {
    id: '1',
    name: 'Kubernetes MCP Server',
    slug: 'mcp-kubernetes-server',
    status: 'Available',
    statusColor: '#3E8635',
    version: '0.1.11',
    description: 'Python-powered server that translates natural language into kubectl actions and provides cluster introspection to agents. Gives AI agents the ability to query pod health, describe resources, or perform dry-run actions across OpenShift or Kubernetes clusters.',
    logo: mcpServerLogos['mcp-kubernetes-server'],
    streamableEndpoint: 'https://api.demo.openshift.ai/mcp/kubernetes/stream',
    streamableToken: 'sk-k8s-stream-token-abc123'
  },
  {
    id: '2',
    name: 'Slack MCP Server',
    slug: 'slack-mcp-server',
    status: 'Available',
    statusColor: '#3E8635',
    version: '1.4.2',
    description: 'MIT-licensed server that lets AI agents post, read threads, DM users, and trigger Slack workflows; supports stdio + SSE, proxy mode, and fine-grained token scopes. Instant DevOps productivity tool.',
    logo: mcpServerLogos['slack-mcp-server'],
    streamableEndpoint: 'https://api.demo.openshift.ai/mcp/slack/stream',
    streamableToken: 'sk-slack-stream-token-def456'
  },
  {
    id: '3',
    name: 'ServiceNow MCP Server',
    slug: 'servicenow-mcp-server',
    status: 'Available',
    statusColor: '#3E8635',
    version: '2.1.0',
    description: 'Open-source repo and certified Store app; AI can query, create, or update incidents, change requests, catalog items, etc., with full OAuth support. Automates ticket triage and change-management chatbots.',
    logo: mcpServerLogos['servicenow-mcp-server'],
    streamableEndpoint: 'https://api.demo.openshift.ai/mcp/servicenow/stream',
    streamableToken: 'sk-servicenow-stream-token-jkl012'
  },
  {
    id: '4',
    name: 'Salesforce MCP Server',
    slug: 'salesforce-mcp-server',
    status: 'Available',
    statusColor: '#3E8635',
    version: '1.8.3',
    description: 'CLI-installable server that exposes SOQL querying, record CRUD, Apex code access, and schema introspection. Lets support or sales assistants pull account context, open cases, and update opportunities directly from AI prompts.',
    logo: mcpServerLogos['salesforce-mcp-server'],
    streamableEndpoint: 'https://api.demo.openshift.ai/mcp/salesforce/stream',
    streamableToken: 'sk-salesforce-stream-token-mno345'
  },
  {
    id: '5',
    name: 'Splunk MCP Server',
    slug: 'splunk-mcp-server',
    status: 'Available',
    statusColor: '#3E8635',
    version: '1.3.1',
    description: 'FastMCP-based tool that runs SPL queries, returns logs/metrics, and auto-scrubs sensitive data. Enables an AI SRE bot to explain spikes, correlate incidents, or draft post-mortems using live Splunk data.',
    logo: mcpServerLogos['splunk-mcp-server'],
    streamableEndpoint: 'https://api.demo.openshift.ai/mcp/splunk/stream',
    streamableToken: 'sk-splunk-stream-token-pqr678'
  },
  {
    id: '6',
    name: 'Dynatrace MCP Server',
    slug: 'dynatrace-mcp-server',
    status: 'Available',
    statusColor: '#3E8635',
    version: '2.0.4',
    description: 'Official Dynatrace-OSS project exposing DQL queries, problem feeds, and vulnerability data. Gives agents real-time service health, letting them recommend rollbacks or capacity fixes inside OpenShift.',
    logo: mcpServerLogos['dynatrace-mcp-server'],
    streamableEndpoint: 'https://api.demo.openshift.ai/mcp/dynatrace/stream',
    streamableToken: 'sk-dynatrace-stream-token-ghi789'
  },
  {
    id: '7',
    name: 'GitHub MCP Server',
    slug: 'github-mcp-server',
    status: 'Available',
    statusColor: '#3E8635',
    version: '1.2.5',
    description: 'GitHub-maintained server for listing repos, issues, PRs, commits and creating comments/branches. Fuels coding copilots that can open PRs, draft release notes, or review diffs while respecting repo permissions.',
    logo: mcpServerLogos['github-mcp-server'],
    streamableEndpoint: 'https://api.demo.openshift.ai/mcp/github/stream',
    streamableToken: 'sk-github-stream-token-stu901'
  },
  {
    id: '8',
    name: 'PostgreSQL MCP Server',
    slug: 'postgres-mcp-server',
    status: 'Available',
    statusColor: '#3E8635',
    version: '1.0.8',
    description: 'Read-only SQL querying with schema discovery, run in a container or as a Node service. Ideal for healthcare/finance use-cases that need tight RBAC, audit trails, and deterministic queries against clinical or financial databases.',
    logo: mcpServerLogos['postgres-mcp-server'],
    streamableEndpoint: 'https://api.demo.openshift.ai/mcp/postgres/stream',
    streamableToken: 'sk-postgres-stream-token-vwx234'
  },
  {
    id: '9',
    name: 'Zapier GitHub MCP',
    slug: 'zapier-mcp-server',
    status: 'Unavailable',
    statusColor: '#C9190B',
    version: '3.2.1',
    description: 'Hosted server that unlocks 7,000-plus SaaS actions via Zapier without writing glue code. Swiss-army-knife for quick PoCs: one endpoint gives agents access to calendars, Jira, NetSuite, etc., under Zapier&apos;s enterprise security model.',
    logo: mcpServerLogos['zapier-mcp-server'],
    streamableEndpoint: 'https://api.demo.openshift.ai/mcp/zapier/stream',
    streamableToken: 'sk-zapier-stream-token-yzab567'
  }
];

// Function to format model deployment names
const formatModelName = (name: string): string => {
  return name
    .replace(/:[0-9]+(\.[0-9]+)*$/, '') // Remove version numbers like :1.4.0, :1.1, :9.1.1
    .replace(/-/g, ' ') // Remove dashes
    .replace(/\bgpt\b/gi, 'GPT') // Capitalize GPT
    .replace(/\bgranite\b/gi, 'Granite') // Capitalize Granite
    .replace(/\bmistral\b/gi, 'Mistral'); // Capitalize Mistral
};

const AvailableAIAssets: React.FunctionComponent = () => {
  useDocumentTitle('AI asset endpoints');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { flags, selectedProject, setSelectedProject } = useFeatureFlags();
  const { userProfile } = useUserProfile();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isTokenModalOpen, setIsTokenModalOpen] = React.useState(false);
  const [selectedToken] = React.useState('');
  const [tokenType] = React.useState('');
  const [copiedItems, setCopiedItems] = React.useState<Set<string>>(new Set());
  const [mcpSortBy, setMcpSortBy] = React.useState<string>('name');
  const [mcpSortDirection, setMcpSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [modelsSortBy, setModelsSortBy] = React.useState<string>('name');
  const [modelsSortDirection, setModelsSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [modelsWithEndpoints, setModelsWithEndpoints] = React.useState<Set<string>>(new Set());
  const [isAddingToPlayground, setIsAddingToPlayground] = React.useState(false);
  const [configProgress, setConfigProgress] = React.useState(0);
  const [currentConfigStep, setCurrentConfigStep] = React.useState(0);
  const [configSteps, setConfigSteps] = React.useState([
    { label: 'Verifying model details', completed: false },
    { label: 'Checking model compatibility', completed: false },
    { label: 'Validating your configuration', completed: false }
  ]);
  const [modelsAddedToPlayground, setModelsAddedToPlayground] = React.useState<Set<string>>(new Set());
  const [isCreateEndpointModalOpen, setIsCreateEndpointModalOpen] = React.useState(false);
  const [selectedModelForEndpoint, setSelectedModelForEndpoint] = React.useState<{id: string, name: string}>({id: '', name: ''});
  const [isCreatingEndpoint] = React.useState(false);
  const [creationProgress] = React.useState(0);
  
  // MaaS token generation state
  const [generatedTokens, setGeneratedTokens] = React.useState<Map<string, string>>(new Map());
  const [isGeneratingToken, setIsGeneratingToken] = React.useState<Set<string>>(new Set());
  
  const [currentProgressMessage] = React.useState<string>('');
  const [isModelSelectionModalOpen, setIsModelSelectionModalOpen] = React.useState(false);
  const [selectedModelsForPlayground, setSelectedModelsForPlayground] = React.useState<Set<string>>(new Set());
  const [isModalFilterDropdownOpen, setIsModalFilterDropdownOpen] = React.useState(false);
  const [modalFilterBy, setModalFilterBy] = React.useState('name');
  const [modalSearchText, setModalSearchText] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [mcpCurrentPage, setMcpCurrentPage] = React.useState(1);
  const [mcpPerPage, setMcpPerPage] = React.useState(10);
  const [isProjectSelectOpen, setIsProjectSelectOpen] = React.useState(false);
  const [openKebabMenus, setOpenKebabMenus] = React.useState<Set<string>>(new Set());
  
  // Add Asset modal state
  type AssetType = 'Model' | 'MCP Server' | '';
  type ModelLocation = 'Internal' | 'External' | '';
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = React.useState(false);
  const [assetType, setAssetType] = React.useState<AssetType>('');
  const [isAssetTypeOpen, setIsAssetTypeOpen] = React.useState(false);
  const [modelLocation, setModelLocation] = React.useState<ModelLocation>('');
  const [isModelLocationOpen, setIsModelLocationOpen] = React.useState(false);
  const [externalProvider, setExternalProvider] = React.useState('');
  const [isExternalProviderOpen, setIsExternalProviderOpen] = React.useState(false);
  const [externalProviderAPIKey, setExternalProviderAPIKey] = React.useState('');
  const [selectedExternalModels, setSelectedExternalModels] = React.useState<Set<string>>(new Set());
  const [project, setProject] = React.useState('');
  const [isAddAssetProjectOpen, setIsAddAssetProjectOpen] = React.useState(false);
  const [modelDeployment, setModelDeployment] = React.useState('');
  const [isModelDeploymentOpen, setIsModelDeploymentOpen] = React.useState(false);
  const [mcpServer, setMcpServer] = React.useState('');
  const [isMcpServerOpen, setIsMcpServerOpen] = React.useState(false);
  const [tools, setTools] = React.useState('');
  const [isToolsOpen, setIsToolsOpen] = React.useState(false);
  const [assetDescription, setAssetDescription] = React.useState('');

  // Initialize state from localStorage
  React.useEffect(() => {
    // Initialize modelsAddedToPlayground from localStorage
    const playgroundModels = JSON.parse(localStorage.getItem('playgroundModels') || '[]');
    const playgroundModelIds = playgroundModels.map((m: PlaygroundModel) => m.id);
    setModelsAddedToPlayground(new Set(playgroundModelIds));
    
    // Initialize modelsWithEndpoints from localStorage  
    const modelsWithEndpointsFromStorage = JSON.parse(localStorage.getItem('modelsWithEndpoints') || '[]');
    setModelsWithEndpoints(new Set(modelsWithEndpointsFromStorage));
  }, []);

  // Check for configurePlayground URL parameter and auto-open modal
  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('configurePlayground') === 'true') {
      // Auto-open the model selection modal
      setIsModelSelectionModalOpen(true);
      // Don't pre-select any model when opening from empty state
      setSelectedModelsForPlayground(new Set());
      // Removed addingModelId state
      // Clear the URL parameter
      urlParams.delete('configurePlayground');
      const newUrl = `${location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location]);
  const [modelsViewMode, setModelsViewMode] = React.useState<'cards' | 'table'>('table');
  const [mcpViewMode, setMcpViewMode] = React.useState<'cards' | 'table'>('table');
  const [selectedMcpServers, setSelectedMcpServers] = React.useState<Set<string>>(new Set());
  const [isToolsModalOpen, setIsToolsModalOpen] = React.useState(false);
  const [selectedServerForTools, setSelectedServerForTools] = React.useState<MCPServer | null>(null);
  const [isDeploymentHelpPopoverOpen, setIsDeploymentHelpPopoverOpen] = React.useState(false);

  const [modelsCardAnimations, setModelsCardAnimations] = React.useState<boolean[]>([]);
  const [mcpCardAnimations, setMcpCardAnimations] = React.useState<boolean[]>([]);

  // Filter state for models
  const [modelsFilters, setModelsFilters] = React.useState<{
    name: string[];
    keyword: string[];
    useCase: string[];
    type: string[];
  }>({
    name: [],
    keyword: [],
    useCase: [],
    type: []
  });
  const [modelsFilterAttribute, setModelsFilterAttribute] = React.useState<'name' | 'keyword' | 'useCase'>('name');
  const [modelsFilterInput, setModelsFilterInput] = React.useState<string>('');
  const [modelsFilterDropdownOpen, setModelsFilterDropdownOpen] = React.useState<boolean>(false);
  
  // MaaS models filter state (separate from regular models)
  const [maasFilterAttribute, setMaasFilterAttribute] = React.useState<'name' | 'keyword' | 'useCase'>('name');
  const [maasFilterInput, setMaasFilterInput] = React.useState<string>('');
  const [maasFilterDropdownOpen, setMaasFilterDropdownOpen] = React.useState<boolean>(false);

  // Filter state for MCP servers
  const [mcpFilters, setMcpFilters] = React.useState<{
    name: string[];
    keyword: string[];
    description: string[];
  }>({
    name: [],
    keyword: [],
    description: []
  });
  const [mcpFilterAttribute, setMcpFilterAttribute] = React.useState<'name' | 'keyword' | 'description'>('name');
  const [mcpFilterInput, setMcpFilterInput] = React.useState<string>('');
  const [mcpFilterDropdownOpen, setMcpFilterDropdownOpen] = React.useState<boolean>(false);


  // Filter helper functions
  const addFilter = (category: 'models' | 'mcp', filterType: string, value: string) => {
    if (category === 'models') {
      setModelsFilters(prev => ({
        ...prev,
        [filterType]: [...prev[filterType as keyof typeof prev], value]
      }));
      setModelsFilterInput('');
      setCurrentPage(1); // Reset pagination when filters change
    } else {
      setMcpFilters(prev => ({
        ...prev,
        [filterType]: [...prev[filterType as keyof typeof prev], value]
      }));
      setMcpFilterInput('');
      setMcpCurrentPage(1); // Reset pagination when filters change
    }
  };

  const removeFilter = (category: 'models' | 'mcp', filterType: string, value: string) => {
    if (category === 'models') {
      setModelsFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType as keyof typeof prev].filter(item => item !== value)
      }));
      setCurrentPage(1); // Reset pagination when filters change
    } else {
      setMcpFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType as keyof typeof prev].filter(item => item !== value)
      }));
      setMcpCurrentPage(1); // Reset pagination when filters change
    }
  };

  const clearAllFilters = (category: 'models' | 'mcp') => {
    if (category === 'models') {
      setModelsFilters({ name: [], keyword: [], useCase: [], type: [] });
      setModelsFilterInput('');
      setCurrentPage(1); // Reset pagination when filters change
    } else {
      setMcpFilters({ name: [], keyword: [], description: [] });
      setMcpFilterInput('');
      setMcpCurrentPage(1); // Reset pagination when filters change
    }
  };

  const getFilterPlaceholder = (category: 'models' | 'mcp', attribute: string) => {
    if (category === 'models') {
      switch (attribute) {
        case 'name': return 'Filter by name';
        case 'keyword': return 'Filter by keyword...';
        case 'useCase': return 'Filter by use case...';
        case 'type': return 'Filter by type...';
        default: return 'Filter...';
      }
    } else {
      switch (attribute) {
        case 'name': return 'Filter by name';
        case 'keyword': return 'Filter by keyword...';
        case 'description': return 'Filter by description...';
        default: return 'Filter...';
      }
    }
  };

  // Helper functions for MaaS models
  const isMaaSModel = (model: ModelAsset) => {
    return model.name === 'llama-3.1-8b-instruct' || model.name === 'Pixtral-Large-Instruct-2411-hf-quantized.w8a8';
  };

  const getMaaSModels = () => {
    return mockModels.filter(isMaaSModel);
  };

  const getRegularModels = () => {
    return mockModels.filter(model => !isMaaSModel(model));
  };

  // Enhanced filter functions for regular models (excluding MaaS)
  const filteredModels = getRegularModels().filter(model => {
    // Project-based filtering
    const matchesProjectFilter = (() => {
      if (selectedProject === 'Project X') {
        // For Project X, show all models
        return true;
      } else if (selectedProject === 'Project Y') {
        // For Project Y, show granite-7b-code:1.1 and gpt-oss-120b-FP8-Dynamic:1.4.0 (MaaS models are in their own tab)
        return model.name === 'granite-7b-code:1.1' || 
               model.name === 'gpt-oss-120b-FP8-Dynamic:1.4.0';
      }
      // Default: show all models
      return true;
    })();

    // Name filters
    const matchesNameFilters = modelsFilters.name.length === 0 || 
      modelsFilters.name.some(filter => 
        model.name.toLowerCase().includes(filter.toLowerCase())
      );

    // Keyword filters (search in name, description, and use case)
    const matchesKeywordFilters = modelsFilters.keyword.length === 0 || 
      modelsFilters.keyword.some(filter => 
        model.name.toLowerCase().includes(filter.toLowerCase()) ||
        (model.description && model.description.toLowerCase().includes(filter.toLowerCase())) ||
        model.useCase.toLowerCase().includes(filter.toLowerCase())
      );

    // Use case filters
    const matchesUseCaseFilters = modelsFilters.useCase.length === 0 || 
      modelsFilters.useCase.some(filter => 
        model.useCase.toLowerCase().includes(filter.toLowerCase())
      );

    return matchesProjectFilter && matchesNameFilters && matchesKeywordFilters && matchesUseCaseFilters;
  });

  // Enhanced filter functions for MaaS models
  const filteredMaaSModels = getMaaSModels().filter(model => {
    // Project-based filtering - MaaS models are available in all projects
    const matchesProjectFilter = true;

    // Name filters
    const matchesNameFilters = modelsFilters.name.length === 0 || 
      modelsFilters.name.some(filter => model.name.toLowerCase().includes(filter.toLowerCase()));

    // Keyword filters
    const matchesKeywordFilters = modelsFilters.keyword.length === 0 || 
      modelsFilters.keyword.some(filter => 
        model.name.toLowerCase().includes(filter.toLowerCase()) ||
        (model.description?.toLowerCase() || '').includes(filter.toLowerCase()) ||
        model.useCase.toLowerCase().includes(filter.toLowerCase())
      );

    // Use case filters
    const matchesUseCaseFilters = modelsFilters.useCase.length === 0 || 
      modelsFilters.useCase.some(filter => model.useCase.toLowerCase().includes(filter.toLowerCase()));

    return matchesProjectFilter && matchesNameFilters && matchesKeywordFilters && matchesUseCaseFilters;
  });

  const filteredMCPServers = mockMCPServers.filter(server => {
    // Project-based filtering
    const matchesProjectFilter = (() => {
      if (selectedProject === 'Project X') {
        // For Project X, show all MCP servers
        return true;
      } else if (selectedProject === 'Project Y') {
        // For Project Y, show only Dynatrace and GitHub MCP servers
        return server.name === 'Dynatrace MCP Server' || server.name === 'GitHub MCP Server';
      }
      // Default: show all MCP servers
      return true;
    })();

    // Name filters
    const matchesNameFilters = mcpFilters.name.length === 0 || 
      mcpFilters.name.some(filter => 
        server.name.toLowerCase().includes(filter.toLowerCase())
      );

    // Keyword filters (search in name and description)
    const matchesKeywordFilters = mcpFilters.keyword.length === 0 || 
      mcpFilters.keyword.some(filter => 
        server.name.toLowerCase().includes(filter.toLowerCase()) ||
        server.description.toLowerCase().includes(filter.toLowerCase())
      );

    // Description filters
    const matchesDescriptionFilters = mcpFilters.description.length === 0 || 
      mcpFilters.description.some(filter => 
        server.description.toLowerCase().includes(filter.toLowerCase())
      );

    return matchesProjectFilter && matchesNameFilters && matchesKeywordFilters && matchesDescriptionFilters;
  });

  // Sorting functions for MCP servers
  const handleMcpSort = (column: string) => {
    if (mcpSortBy === column) {
      setMcpSortDirection(mcpSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setMcpSortBy(column);
      setMcpSortDirection('asc');
    }
  };



  const getSortedMcpServers = () => {
    return [...filteredMCPServers].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      if (mcpSortBy === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (mcpSortBy === 'status') {
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
      } else {
        return 0;
      }

      if (mcpSortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };

  // Sorting functions for Models
  const handleModelsSort = (column: string) => {
    if (modelsSortBy === column) {
      setModelsSortDirection(modelsSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setModelsSortBy(column);
      setModelsSortDirection('asc');
    }
  };



  const getSortedModels = () => {
    return [...filteredModels].sort((a, b) => {
      if (modelsSortBy === 'name') {
        const aValue = a.name.toLowerCase();
        const bValue = b.name.toLowerCase();
        return modelsSortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  };

  const getPaginatedModels = () => {
    const sortedModels = getSortedModels();
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    return sortedModels.slice(start, end);
  };

  // Similar functions for MaaS models
  const getSortedMaaSModels = () => {
    return [...filteredMaaSModels].sort((a, b) => {
      if (modelsSortBy === 'name') {
        const aValue = a.name.toLowerCase();
        const bValue = b.name.toLowerCase();
        return modelsSortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  };

  const getPaginatedMaaSModels = () => {
    const sortedModels = getSortedMaaSModels();
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    return sortedModels.slice(start, end);
  };

  const getPaginatedMcpServers = () => {
    const sortedServers = getSortedMcpServers();
    const start = (mcpCurrentPage - 1) * mcpPerPage;
    const end = start + mcpPerPage;
    return sortedServers.slice(start, end);
  };




  // Animation helper function
  const getCardAnimationStyle = (isVisible: boolean, index: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.4s ease-out ${index * 0.1}s, transform 0.4s ease-out ${index * 0.1}s`
  });

  // Handle models view mode change with animation
  const handleModelsViewModeChange = (mode: 'cards' | 'table') => {
    setModelsViewMode(mode);
    if (mode === 'cards') {
      const modelCount = getSortedModels().length;
      setModelsCardAnimations(new Array(modelCount).fill(false));
      setTimeout(() => {
        setModelsCardAnimations(new Array(modelCount).fill(true));
      }, 50);
    }
  };

  // Handle MCP view mode change with animation
  const handleMcpViewModeChange = (mode: 'cards' | 'table') => {
    setMcpViewMode(mode);
    if (mode === 'cards') {
      const mcpCount = getSortedMcpServers().length;
      setMcpCardAnimations(new Array(mcpCount).fill(false));
      setTimeout(() => {
        setMcpCardAnimations(new Array(mcpCount).fill(true));
      }, 50);
    }
  };

  const handleCopyWithFeedback = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems(prev => new Set(prev).add(itemId));
    setTimeout(() => {
      setCopiedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 2000); // Show "Copied" for 2 seconds
  };



  const handleCreateEndpoint = (modelId: string, modelName: string) => {
    setSelectedModelForEndpoint({id: modelId, name: modelName});
    setIsCreateEndpointModalOpen(true);
  };

  const handleConfirmCreateEndpoint = () => {
    setIsCreateEndpointModalOpen(false);
    // Add the model to the set that have external endpoints created
    setModelsWithEndpoints(prev => new Set(Array.from(prev).concat(selectedModelForEndpoint.id)));
    
    // Store models with endpoints in localStorage for playground access
    const currentModelsWithEndpoints = JSON.parse(localStorage.getItem('modelsWithEndpoints') || '[]');
    if (!currentModelsWithEndpoints.includes(selectedModelForEndpoint.id)) {
      currentModelsWithEndpoints.push(selectedModelForEndpoint.id);
      localStorage.setItem('modelsWithEndpoints', JSON.stringify(currentModelsWithEndpoints));
    }
    
    setSelectedModelForEndpoint({id: '', name: ''});
  };

  const handleCancelCreateEndpoint = () => {
    setIsCreateEndpointModalOpen(false);
    setSelectedModelForEndpoint({id: '', name: ''});
  };

  const handleOpenAddAssetModal = () => {
    setIsAddAssetModalOpen(true);
  };

  const handleCloseAddAssetModal = () => {
    setIsAddAssetModalOpen(false);
    // Reset form
    setAssetType('');
    setProject('');
    setModelDeployment('');
    setMcpServer('');
    setTools('');
    setAssetDescription('');
  };

  const handleAddAsset = () => {
    // Handle adding the asset here
    console.log('Adding asset:', { assetType, project, modelDeployment, mcpServer, tools, assetDescription });
    handleCloseAddAssetModal();
  };

  const isAddAssetFormValid = () => {
    if (!assetType || !assetDescription.trim()) return false;
    
    if (assetType === 'Model') {
      return project && modelDeployment;
    }
    
    if (assetType === 'MCP Server') {
      return mcpServer && tools;
    }
    
    return false;
  };

  const handleGenerateToken = async (modelId: string) => {
    setIsGeneratingToken(prev => {
      const newSet = new Set(prev);
      newSet.add(modelId);
      return newSet;
    });
    
    // Simulate token generation
    setTimeout(() => {
      const newToken = `sk-maas-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;
      setGeneratedTokens(prev => new Map(prev.set(modelId, newToken)));
      setIsGeneratingToken(prev => {
        const newSet = new Set(prev);
        newSet.delete(modelId);
        return newSet;
      });
    }, 1500);
  };

  const handleClearGeneratedToken = (modelId: string) => {
    setGeneratedTokens(prev => {
      const newMap = new Map(prev);
      newMap.delete(modelId);
      return newMap;
    });
  };

  const handleAddToPlayground = (modelId: string) => {
    console.log('Add to playground clicked for model ID:', modelId);
    const model = mockModels.find(m => m.id === modelId);
    console.log('Model details:', model?.name);
    console.log('Current modelsAddedToPlayground:', Array.from(modelsAddedToPlayground));
    
    // Removed addingModelId state
    // Pre-select the clicked model
    setSelectedModelsForPlayground(new Set([modelId]));
    // Show model selection modal first
    setIsModelSelectionModalOpen(true);
  };

  const handleModelSelectionToggle = (modelId: string) => {
    setSelectedModelsForPlayground(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelId)) {
        newSet.delete(modelId);
      } else {
        newSet.add(modelId);
      }
      return newSet;
    });
  };

  const handleConfigurePlayground = () => {
    // Close model selection modal and open status modal
    setIsModelSelectionModalOpen(false);
    setIsAddingToPlayground(true);
    setConfigProgress(0);
    setCurrentConfigStep(0);
    
    // Get selected model names for the configuration steps
    const selectedModelNames = Array.from(selectedModelsForPlayground)
      .map(id => mockModels.find(m => m.id === id)?.name)
      .filter(name => name)
      .join(', ');
    
    // Update configuration steps with model names
    setConfigSteps([
      { label: `Verifying ${selectedModelNames} details`, completed: false },
      { label: `Checking ${selectedModelNames} compatibility`, completed: false },
      { label: 'Validating your configuration', completed: false }
    ]);
    
    // Start the auto-configuration process
    startAutoConfiguration();
  };

  const handleCancelModelSelection = () => {
    setIsModelSelectionModalOpen(false);
    setSelectedModelsForPlayground(new Set());
    // Removed addingModelId state
    // Reset search when closing modal
    setModalSearchText('');
    setModalFilterBy('name');
  };

  // Filter models for the modal based on search text and filter type
  const getFilteredModalModels = () => {
    // Use all models (both regular and MaaS) for the modal
    let filteredModels = mockModels.filter(m => {
      // Always include the three specific models by name
      const isTargetModel = (m.name === 'gpt-oss-120b-FP8-Dynamic:1.4.0' || m.name === 'granite-7b-code:1.1' || m.name === 'Pixtral-Large-Instruct-2411-hf-quantized.w8a8');
      
      // Only show target models with not-registered status
      return isTargetModel && m.llsStatus === 'not-registered';
    });

    // Apply search filter
    if (modalSearchText.trim()) {
      const searchLower = modalSearchText.toLowerCase();
      filteredModels = filteredModels.filter(model => {
        if (modalFilterBy === 'name') {
          return model.name.toLowerCase().includes(searchLower);
        } else if (modalFilterBy === 'useCase') {
          return model.useCase.toLowerCase().includes(searchLower);
        }
        return true;
      });
    }

    console.log('All models:', mockModels.map(m => ({ id: m.id, name: m.name, llsStatus: m.llsStatus })));
    console.log('getFilteredModalModels result:', filteredModels.map(m => ({ id: m.id, name: m.name })));
    return filteredModels;
  };

  const startAutoConfiguration = () => {
    const steps = [
      { delay: 1000, progress: 33, message: 'Registering your deployed models' },
      { delay: 1500, progress: 66, message: 'Creating sample RAG vectorDB' },
      { delay: 1000, progress: 100, message: 'Validating your configuration' }
    ];

    let currentStep = 0;
    
    const processStep = () => {
      if (currentStep < steps.length) {
        setCurrentConfigStep(currentStep);
        
        setTimeout(() => {
          setConfigProgress(steps[currentStep].progress);
          currentStep++;
          
          if (currentStep < steps.length) {
            setTimeout(processStep, steps[currentStep - 1].delay);
          } else {
            // Configuration complete
            setTimeout(() => {
              handleConfirmAddToPlayground();
            }, 1000);
          }
        }, 500);
      }
    };
    
    processStep();
  };

  const handleConfirmAddToPlayground = () => {
    // Complete the addition
    setIsAddingToPlayground(false);
    
    // Add ALL selected models to the playground state, not just the initial one
    const selectedModelIds = Array.from(selectedModelsForPlayground);
    setModelsAddedToPlayground(prev => new Set([...Array.from(prev), ...selectedModelIds]));
    
    // Store added models in localStorage for playground access
    const currentPlaygroundModels = JSON.parse(localStorage.getItem('playgroundModels') || '[]');
    
    selectedModelIds.forEach(modelId => {
      const modelToAdd = mockModels.find(m => m.id === modelId);
      if (modelToAdd && !currentPlaygroundModels.some((m: PlaygroundModel) => m.id === modelToAdd.id)) {
        currentPlaygroundModels.push({
          id: modelToAdd.id,
          name: modelToAdd.name,
          slug: modelToAdd.slug,
          endpoint: modelToAdd.internalEndpoint,
          token: modelToAdd.internalToken
        });
      }
    });
    
    localStorage.setItem('playgroundModels', JSON.stringify(currentPlaygroundModels));
    
    // Removed addingModelId state
    setSelectedModelsForPlayground(new Set());
    setConfigProgress(0);
    setCurrentConfigStep(0);
  };

  const handleCancelAddToPlayground = () => {
    setIsAddingToPlayground(false);
    // Removed addingModelId state
    setConfigProgress(0);
    setCurrentConfigStep(0);
  };



  const handlePlayground = (assetId: string, assetType: 'model' | 'mcp') => {
    // Navigate to AI Playground with pre-selected asset
    if (assetType === 'model') {
      const model = mockModels.find(m => m.id === assetId);
      if (model) {
        // Add model to playground models if it's granite, gpt, or Pixtral (non-default models)
        if (model.name === 'granite-7b-code:1.1' || model.name === 'gpt-oss-120b-FP8-Dynamic:1.4.0' || model.name === 'Pixtral-Large-Instruct-2411-hf-quantized.w8a8') {
          const currentPlaygroundModels = JSON.parse(localStorage.getItem('playgroundModels') || '[]');
          
          // Check if model is already in the list
          if (!currentPlaygroundModels.some((m: PlaygroundModel) => m.id === model.id)) {
            currentPlaygroundModels.push({
              id: model.id,
              name: model.name,
              slug: model.slug,
              endpoint: model.internalEndpoint,
              token: model.internalToken
            });
            localStorage.setItem('playgroundModels', JSON.stringify(currentPlaygroundModels));
          }
        }
        
        navigate('/gen-ai-studio/ai-playground', { 
          state: { 
            preselectedModel: model.name,
            modelEndpoint: model.internalEndpoint,
            modelToken: model.internalToken
          }
        });
      }
    } else {
      const server = mockMCPServers.find(s => s.id === assetId);
      if (server) {
        // Get all currently selected MCP servers
        const selectedServerNames = Array.from(selectedMcpServers).map(serverId => {
          const selectedServer = mockMCPServers.find(s => s.id === serverId);
          return selectedServer?.name;
        }).filter(Boolean) as string[];
        
        // If no servers are selected, just preselect the clicked server
        // If servers are selected, include all selected servers
        const serversToPreselect = selectedServerNames.length > 0 
          ? selectedServerNames.includes(server.name) 
            ? selectedServerNames // Clicked server is already selected, use all selected
            : [...selectedServerNames, server.name] // Add clicked server to selected ones
          : [server.name]; // No servers selected, just use clicked server
        
        navigate('/gen-ai-studio/ai-playground', { 
          state: { 
            preselectedMCPs: serversToPreselect
          }
        });
      }
    }
  };



  // MCP Server selection handlers
  const handleMcpServerSelect = (serverId: string, isSelected: boolean) => {
    setSelectedMcpServers(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(serverId);
      } else {
        newSet.delete(serverId);
      }
      return newSet;
    });
  };

  const handleMcpSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allServerIds = getSortedMcpServers().map(server => server.id);
      setSelectedMcpServers(new Set(allServerIds));
    } else {
      setSelectedMcpServers(new Set());
    }
  };

  // Bulk selection function
  const getBulkSelectCheckboxState = () => {
    const totalServers = getSortedMcpServers().length;
    const selectedCount = selectedMcpServers.size;
    
    if (selectedCount === 0) return { checked: false };
    if (selectedCount === totalServers) return { checked: true };
    return { checked: false }; // Partial selection - treat as unchecked for simplicity
  };

  // Tools helper functions
  const getServerTools = (serverSlug: string) => {
    const serverToolsData: Record<string, Array<{name: string, description: string}>> = {
      'mcp-kubernetes-server': [
        { name: 'k8s_get', description: 'Get resources by name, label selector, or all resources in a namespace' },
        { name: 'k8s_describe', description: 'Describe a Kubernetes resource' },
        { name: 'k8s_list', description: 'List resources in a namespace or across all namespaces' },
        { name: 'k8s_logs', description: 'Print the logs for a container in a pod' },
        { name: 'k8s_top', description: 'Display resource (CPU/memory) usage for nodes or pods' },
        { name: 'k8s_events', description: 'List events in a namespace' },
        { name: 'k8s_apply', description: 'Apply a configuration to a resource by file name or stdin' },
        { name: 'k8s_create', description: 'Create a resource from a file or from stdin' },
        { name: 'k8s_scale', description: 'Scale a resource' },
        { name: 'k8s_expose', description: 'Expose a resource as a new Kubernetes service' },
        { name: 'k8s_rollout_status', description: 'Show the status of the rollout' },
        { name: 'k8s_exec_command', description: 'Execute a command in a container' },
        { name: 'k8s_port_forward', description: 'Forward one or more local ports to a pod' },
        { name: 'k8s_cordon', description: 'Mark a node as unschedulable' },
        { name: 'k8s_drain', description: 'Drain a node in preparation for maintenance' },
        { name: 'k8s_patch', description: 'Update fields of a resource' },
        { name: 'k8s_delete', description: 'Delete resources by name, label selector, or all resources in a namespace' }
      ],
      'slack-mcp-server': [
        { name: 'send_message', description: 'Send a message to a Slack channel or user' },
        { name: 'read_channel_history', description: 'Read recent messages from a Slack channel' },
        { name: 'send_direct_message', description: 'Send a direct message to a user' },
        { name: 'list_channels', description: 'List available channels' },
        { name: 'get_user_info', description: 'Get information about a Slack user' },
        { name: 'trigger_workflow', description: 'Trigger a Slack workflow' },
        { name: 'search_messages', description: 'Search for messages across channels' }
      ],
      'servicenow-mcp-server': [
        { name: 'create_incident', description: 'Create a new ServiceNow incident' },
        { name: 'update_incident', description: 'Update an existing incident' },
        { name: 'query_incidents', description: 'Query incidents based on criteria' },
        { name: 'create_change_request', description: 'Create a new change request' },
        { name: 'update_change_request', description: 'Update an existing change request' },
        { name: 'query_change_requests', description: 'Query change requests based on criteria' },
        { name: 'create_catalog_item', description: 'Create a service catalog item' },
        { name: 'query_catalog_items', description: 'Query service catalog items' },
        { name: 'assign_task', description: 'Assign a task to a user or group' }
      ],
      'salesforce-mcp-server': [
        { name: 'query_records', description: 'Query Salesforce records using SOQL' },
        { name: 'create_record', description: 'Create a new record in Salesforce' },
        { name: 'update_record', description: 'Update an existing Salesforce record' },
        { name: 'delete_record', description: 'Delete a Salesforce record' },
        { name: 'describe_object', description: 'Get metadata about a Salesforce object' },
        { name: 'execute_apex', description: 'Execute Apex code' },
        { name: 'search_records', description: 'Search records using SOSL' }
      ],
      'splunk-mcp-server': [
        { name: 'run_search', description: 'Execute a Splunk search query' },
        { name: 'get_search_results', description: 'Retrieve results from a completed search job' },
        { name: 'create_alert', description: 'Create a new Splunk alert' },
        { name: 'list_indexes', description: 'List available Splunk indexes' },
        { name: 'export_data', description: 'Export search results to various formats' }
      ],
      'dynatrace-mcp-server': [
        { name: 'query_dql', description: 'Execute DQL (Dynatrace Query Language) queries' },
        { name: 'get_problems', description: 'Retrieve current and historical problems' },
        { name: 'get_vulnerabilities', description: 'Get security vulnerability data' },
        { name: 'get_metrics', description: 'Retrieve performance metrics' },
        { name: 'get_entities', description: 'Query monitored entities' },
        { name: 'create_dashboard', description: 'Create a new Dynatrace dashboard' }
      ],
      'github-mcp-server': [
        { name: 'list_repositories', description: 'List repositories for the authenticated user' },
        { name: 'create_repository', description: 'Create a new repository' },
        { name: 'get_repository', description: 'Get details about a repository' },
        { name: 'list_issues', description: 'List issues for a repository' },
        { name: 'create_issue', description: 'Create a new issue' },
        { name: 'update_issue', description: 'Update an existing issue' },
        { name: 'list_pull_requests', description: 'List pull requests for a repository' },
        { name: 'create_pull_request', description: 'Create a new pull request' },
        { name: 'list_commits', description: 'List commits for a repository' },
        { name: 'create_branch', description: 'Create a new branch' },
        { name: 'create_comment', description: 'Create a comment on an issue or PR' }
      ],
      'postgres-mcp-server': [
        { name: 'execute_query', description: 'Execute a read-only SQL query' },
        { name: 'describe_table', description: 'Get table schema and metadata' },
        { name: 'list_tables', description: 'List all tables in the database' },
        { name: 'list_schemas', description: 'List all schemas in the database' },
        { name: 'get_table_stats', description: 'Get statistics about table data' }
      ],
      'zapier-mcp-server': [
        { name: 'trigger_zap', description: 'Trigger a Zapier automation' },
        { name: 'list_apps', description: 'List available Zapier app integrations' },
        { name: 'search_actions', description: 'Search for available actions across apps' },
        { name: 'get_app_info', description: 'Get information about a specific app' },
        { name: 'test_connection', description: 'Test connection to an integrated service' }
      ]
    };
    
    return serverToolsData[serverSlug] || [];
  };

  const getEnabledToolsCount = (serverSlug: string) => {
    const tools = getServerTools(serverSlug);
    return tools.length; // For now, assume all tools are enabled
  };

  const handleViewTools = (server: MCPServer) => {
    setSelectedServerForTools(server);
    setIsToolsModalOpen(true);
  };



  const renderStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'available' || statusLower === 'running') {
      return (
        <Label color="green" icon={<CheckCircleIcon />}>
          Active
        </Label>
      );
    } else if (statusLower === 'unavailable' || statusLower === 'stopped' || statusLower === 'error') {
      return (
        <Label color="red" icon={<ExclamationCircleIcon />}>
          Error
        </Label>
      );
    } else {
      return (
        <Label color="green" icon={<CheckCircleIcon />}>
          Active
        </Label>
      );
    }
  };

  const renderModelsTable = () => {
    if (getSortedModels().length === 0) {
      return (
        <EmptyState>
          <Title headingLevel="h4" size="lg">
            <SearchIcon className="pf-v5-u-mr-sm" />
            No models found
          </Title>
          <EmptyStateBody>
            {(modelsFilters.name.length > 0 || modelsFilters.keyword.length > 0 || modelsFilters.useCase.length > 0) ? 
              'No models match your filter criteria.' :
              'No models are currently available in this project.'
            }
          </EmptyStateBody>
          {(modelsFilters.name.length > 0 || modelsFilters.keyword.length > 0 || modelsFilters.useCase.length > 0) && (
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" onClick={() => clearAllFilters('models')}>
                  Clear filters
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          )}
        </EmptyState>
      );
    }

    return (
      <>
        <Table aria-label="Models table" style={{ tableLayout: 'fixed', width: '100%' }}>
          <Thead>
            <Tr>
              <Th 
                width={20}
                style={{ 
                  maxWidth: 0,
                  overflow: 'hidden'
                }}
                sort={{
                  sortBy: { index: 1, direction: modelsSortBy === 'name' ? modelsSortDirection : undefined },
                  onSort: () => handleModelsSort('name'),
                  columnIndex: 1
                }}
              >
                <div style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  minWidth: 0
                }}>Model name</div>
              </Th>
              <Th width={10}>Model ID</Th>
              <Th width={10}>Internal endpoint</Th>
              <Th width={10}>External endpoint</Th>
              <Th width={10}>Use Case</Th>
              <Th width={10}>Status</Th>
              <Th width={10}>Playground</Th>
              <Th width={5}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPaginatedModels().map((model) => (
              <Tr key={model.id}>
                <Td>
                                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {flags.enableModelDescriptionPages ? (
                          <Button
                            variant="link"
                            isInline
                            onClick={() => navigate(`/ai-assets/models/${model.slug}`)}
                            style={{ fontWeight: 'bold', padding: 0 }}
                          >
                            {formatModelName(model.name)}
                          </Button>
                        ) : (
                          <span style={{ fontWeight: 'bold' }}>
                            {formatModelName(model.name)}
                          </span>
                        )}
                        <ResourceInfoTooltip 
                          resourceName={model.name}
                          copiedItems={copiedItems}
                          handleCopyWithFeedback={handleCopyWithFeedback}
                        />
                      </div>
                      <Tooltip content={model.description || 'No description available'}>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--pf-v5-global--Color--200)',
                          marginTop: '0.25rem',
                          lineHeight: '1.3',
                          cursor: 'help',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {model.description || 'No description available'}
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </Td>
                <Td dataLabel="Internal endpoint">
                  <EndpointPopover 
                    model={model}
                    copiedItems={copiedItems}
                    handleCopyWithFeedback={handleCopyWithFeedback}
                    type="internal"
                    generatedTokens={generatedTokens}
                    isGeneratingToken={isGeneratingToken}
                    onGenerateToken={handleGenerateToken}
                    onClearGeneratedToken={handleClearGeneratedToken}
                  />
                </Td>
                <Td dataLabel="External endpoint">
                  {/* Mistral always shows View regardless of user role */}
                  {model.name === 'mistral-7b-instruct:9.1.1' && (
                    <EndpointPopover 
                      model={model}
                      copiedItems={copiedItems}
                      handleCopyWithFeedback={handleCopyWithFeedback}
                      type="external"
                      generatedTokens={generatedTokens}
                      isGeneratingToken={isGeneratingToken}
                      onGenerateToken={handleGenerateToken}
                      onClearGeneratedToken={handleClearGeneratedToken}
                    />
                  )}
                  {/* For other models, show based on user role */}
                  {(model.name === 'granite-7b-code:1.1' || model.name === 'gpt-oss-120b-FP8-Dynamic:1.4.0') && (
                    userProfile === 'AI Engineer' ? (
                      <Popover
                        bodyContent={
                          <div>
                            <div>No external endpoint has been configured</div>
                            <div>for this model.</div>
                          </div>
                        }
                        triggerAction="hover"
                      >
                        <Label variant="filled" color="grey" icon={<InfoCircleIcon />}>Not available</Label>
                      </Popover>
                    ) : (
                      !modelsWithEndpoints.has(model.id) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Button 
                        variant="link" 
                        onClick={() => handleCreateEndpoint(model.id, model.name)}
                      >
                            Edit deployment
                      </Button>
                          <Popover
                            bodyContent={
                              <div>
                                Edit your deployment and select &apos;Make deployed models available through an external route&apos;.
                              </div>
                            }
                          >
                            <Button variant="plain" aria-label="More info">
                              <OutlinedQuestionCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                            </Button>
                          </Popover>
                        </div>
                      )
                    )
                  )}
                </Td>
                <Td>
                  <div>
                    {model.useCase}
                  </div>
                </Td>
                <Td dataLabel="Status">
                  {renderStatusIcon(model.status)}
                </Td>
                <Td>
                  <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                    {(model.llsStatus === 'not-registered' && !modelsWithEndpoints.has(model.id) && !modelsAddedToPlayground.has(model.id)) && (
                      <FlexItem>
                        <Button 
                          variant="link" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToPlayground(model.id);
                          }}
                        >
                          <PlusCircleIcon style={{ marginRight: '0.25rem' }} />
                          Add to playground
                        </Button>
                      </FlexItem>
                    )}
                    {(model.llsStatus === 'registered' || modelsWithEndpoints.has(model.id) || modelsAddedToPlayground.has(model.id)) && (
                      <FlexItem>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayground(model.id, 'model');
                          }}
                        >
                          Try in playground
                        </Button>
                      </FlexItem>
                    )}
                  </Flex>
                </Td>
                <Td 
                  dataLabel="Actions" 
                  style={{ textAlign: 'right', width: '60px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dropdown
                    id={`model-actions-${model.id}`}
                    isOpen={openKebabMenus.has(`model-${model.id}`)}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) {
                        setOpenKebabMenus(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(`model-${model.id}`);
                          return newSet;
                        });
                      }
                    }}
                    popperProps={{ position: 'right' }}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        id={`model-menu-toggle-${model.id}`}
                        ref={toggleRef}
                        onClick={() => {
                          setOpenKebabMenus(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(`model-${model.id}`)) {
                              newSet.delete(`model-${model.id}`);
                            } else {
                              newSet.add(`model-${model.id}`);
                            }
                            return newSet;
                          });
                        }}
                        variant="plain"
                        aria-label={`Actions for ${model.name}`}
                        isExpanded={openKebabMenus.has(`model-${model.id}`)}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem
                        id={`remove-asset-${model.id}`}
                        key="remove"
                        onClick={() => {
                          console.log('Removing asset:', model.id);
                          setOpenKebabMenus(new Set());
                          // TODO: Implement actual remove functionality
                        }}
                      >
                        Remove asset
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Pagination
          itemCount={getSortedModels().length}
          perPage={perPage}
          page={currentPage}
          onSetPage={(_event, pageNumber) => setCurrentPage(pageNumber)}
          onPerPageSelect={(_event, newPerPage) => {
            setPerPage(newPerPage);
            setCurrentPage(1); // Reset to first page when changing items per page
          }}
          variant="bottom"
          perPageOptions={[
            { title: '5', value: 5 },
            { title: '10', value: 10 },
            { title: '20', value: 20 },
            { title: '50', value: 50 }
          ]}
        />
      </>
    );
  };

  const renderMCPTable = () => {
    if (getSortedMcpServers().length === 0) {
      return (
        <EmptyState>
          <Title headingLevel="h4" size="lg">
            <SearchIcon className="pf-v5-u-mr-sm" />
            No MCP servers found
          </Title>
          <EmptyStateBody>
            {(mcpFilters.name.length > 0 || mcpFilters.keyword.length > 0 || mcpFilters.description.length > 0) ? 
              'No MCP servers match your filter criteria.' :
              'No MCP servers are currently available in this project.'
            }
          </EmptyStateBody>
          {(mcpFilters.name.length > 0 || mcpFilters.keyword.length > 0 || mcpFilters.description.length > 0) && (
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" onClick={() => clearAllFilters('mcp')}>
                  Clear filters
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          )}
        </EmptyState>
      );
    }

    return (
      <>
        <Table aria-label="MCP Servers table" style={{ tableLayout: 'fixed', width: '100%' }}>
        <Thead>
          <Tr>
            <Th style={{ width: '1%', padding: '0.5rem 0.25rem' }}></Th>
            <Th 
              style={{ width: 'auto' }}
              sort={{
                sortBy: { index: 0, direction: mcpSortBy === 'name' ? mcpSortDirection : undefined },
                onSort: () => handleMcpSort('name'),
                columnIndex: 0
              }}
            >
              Name
            </Th>
            <Th 
              width={10}
              sort={{
                sortBy: { index: 1, direction: mcpSortBy === 'status' ? mcpSortDirection : undefined },
                onSort: () => handleMcpSort('status'),
                columnIndex: 1
              }}
            >
              Status
            </Th>
            <Th width={15}>Endpoint</Th>
            <Th width={10}>Tools</Th>
            <Th width={10}>Version</Th>
          </Tr>
        </Thead>
        <Tbody>
          {getPaginatedMcpServers().map((server) => (
            <Tr 
              key={server.id}
            >
              <Td style={{ width: '1%', padding: '0.5rem 0.25rem', verticalAlign: 'top' }}>
                <div style={{ paddingTop: '0.5rem' }}>
                  <Checkbox
                    isChecked={selectedMcpServers.has(server.id)}
                    onChange={(_event, checked) => handleMcpServerSelect(server.id, checked)}
                    aria-label={`Select ${server.name}`}
                    id={`select-mcp-${server.id}`}
                  />
                </div>
              </Td>
              <Td dataLabel="Name" style={{ verticalAlign: 'top' }}>
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {flags.enableMcpDetailsPage ? (
                        <Button
                          variant="link"
                          isInline
                          onClick={() => navigate(`/ai-assets/mvp-servers/${server.slug}`)}
                          style={{ fontWeight: 'bold', padding: 0, fontSize: '0.875rem' }}
                        >
                          {server.name}
                        </Button>
                      ) : (
                        <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                          {server.name}
                        </span>
                      )}
                    </div>
                    <Tooltip content={server.description}>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--pf-v5-global--Color--200)',
                        marginTop: '0.25rem',
                        lineHeight: '1.3',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'help'
                      }}>
                        {server.description}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </Td>
              <Td dataLabel="Status" style={{ verticalAlign: 'middle' }}>
                {renderStatusIcon(server.status)}
              </Td>
              <Td dataLabel="Streamable endpoint" style={{ verticalAlign: 'middle' }}>
                {server.streamableEndpoint && (
                  <MCPEndpointPopover 
                    server={server}
                    copiedItems={copiedItems}
                    handleCopyWithFeedback={handleCopyWithFeedback}
                  />
                )}
              </Td>
              <Td dataLabel="Tools" style={{ verticalAlign: 'middle' }}>
                <Tooltip content={`View ${getEnabledToolsCount(server.slug)} ${server.name} tools`}>
                  <Button
                    variant="link"
                    onClick={() => handleViewTools(server)}
                    aria-label={`View ${getEnabledToolsCount(server.slug)} ${server.name} tools`}
                    style={{ padding: 0, fontSize: '0.875rem' }}
                  >
                    {getEnabledToolsCount(server.slug)}
                  </Button>
                </Tooltip>
              </Td>
              <Td dataLabel="Version" style={{ verticalAlign: 'middle' }}>
                <span style={{ fontSize: '0.875rem' }}>{server.version}</span>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Pagination
        itemCount={getSortedMcpServers().length}
        perPage={mcpPerPage}
        page={mcpCurrentPage}
        onSetPage={(_event, pageNumber) => setMcpCurrentPage(pageNumber)}
        onPerPageSelect={(_event, newPerPage) => {
          setMcpPerPage(newPerPage);
          setMcpCurrentPage(1); // Reset to first page when changing items per page
        }}
        variant="bottom"
        perPageOptions={[
          { title: '5', value: 5 },
          { title: '10', value: 10 },
          { title: '20', value: 20 },
          { title: '50', value: 50 }
        ]}
      />
      </>
    );
  };

  const renderModelsCards = () => {
    if (getSortedModels().length === 0) {
      return (
        <EmptyState>
          <Title headingLevel="h4" size="lg">
            <SearchIcon className="pf-v5-u-mr-sm" />
            No models found
          </Title>
          <EmptyStateBody>
            {(modelsFilters.name.length > 0 || modelsFilters.keyword.length > 0 || modelsFilters.useCase.length > 0) ? 
              'No models match your filter criteria.' :
              'No models are currently available in this project.'
            }
          </EmptyStateBody>
          {(modelsFilters.name.length > 0 || modelsFilters.keyword.length > 0 || modelsFilters.useCase.length > 0) && (
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" onClick={() => clearAllFilters('models')}>
                  Clear filters
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          )}
        </EmptyState>
      );
    }

    return (
      <Grid hasGutter>
        {getSortedModels().map((model, index) => (
          <GridItem key={model.id} lg={4} md={6} sm={12}>
            <Card 
              isFullHeight
              onClick={flags.enableModelDescriptionPages ? () => navigate(`/ai-assets/models/${model.slug}`) : undefined}
              style={{ 
                cursor: flags.enableModelDescriptionPages ? 'pointer' : 'default',
                ...getCardAnimationStyle(modelsCardAnimations[index] || false, index)
              }}
            >
              <CardHeader>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">{model.name}</Title>
                </CardTitle>
              </CardHeader>
              <CardBody style={{ paddingTop: 0, paddingBottom: '0.5rem', flexGrow: 1 }}>
                <div className="pf-v5-u-mb-md">
                  <div className="pf-v5-u-font-size-sm pf-v5-u-color-200 pf-v5-u-mb-xs" style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.3'
                  }}>
                    {model.description || 'No description available'}
                  </div>
                </div>
                
                <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
                  <FlexItem>
                    <div className="pf-v5-u-font-size-sm">
                      <strong>Use Case:</strong> {model.useCase}
                    </div>
                  </FlexItem>
                </Flex>
                
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <EndpointPopover 
                    model={model}
                    copiedItems={copiedItems}
                    handleCopyWithFeedback={handleCopyWithFeedback}
                    type="internal"
                  />
                  
                  {(model.llsStatus === 'not-registered' && !modelsWithEndpoints.has(model.id) && !modelsAddedToPlayground.has(model.id)) && (
                    <Button 
                      variant="link" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToPlayground(model.id);
                      }}
                    >
                      <PlusCircleIcon style={{ marginRight: '0.25rem' }} />
                      Add to Playground
                    </Button>
                  )}
                  {(model.llsStatus === 'registered' || modelsWithEndpoints.has(model.id) || modelsAddedToPlayground.has(model.id)) && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayground(model.id, 'model');
                      }}
                    >
                      Try in playground
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
    );
  };

  // Render functions for MaaS models
  const renderMaaSModelsTable = () => {
    if (getSortedMaaSModels().length === 0) {
      return (
        <EmptyState>
          <Title headingLevel="h4" size="lg">
            <SearchIcon className="pf-v5-u-mr-sm" />
            No MaaS models found
          </Title>
          <EmptyStateBody>
            {(modelsFilters.name.length > 0 || modelsFilters.keyword.length > 0 || modelsFilters.useCase.length > 0 || modelsFilters.type.length > 0) ? 
              'No MaaS models match your filter criteria.' :
              'No MaaS models are currently available in this project.'
            }
          </EmptyStateBody>
          {(modelsFilters.name.length > 0 || modelsFilters.keyword.length > 0 || modelsFilters.useCase.length > 0 || modelsFilters.type.length > 0) && (
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" onClick={() => clearAllFilters('models')}>
                  Clear all filters
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          )}
        </EmptyState>
      );
    }

    return (
      <>
        <Table aria-label="MaaS Models table" style={{ tableLayout: 'fixed', width: '100%' }}>
          <Thead>
            <Tr>
              <Th 
                width={20}
                style={{ 
                  maxWidth: 0,
                  overflow: 'hidden'
                }}
                sort={{
                  sortBy: { index: 1, direction: modelsSortBy === 'name' ? modelsSortDirection : undefined },
                  onSort: () => handleModelsSort('name'),
                  columnIndex: 1
                }}
              >
                <div style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  minWidth: 0
                }}>Model name</div>
              </Th>
              <Th width={10}>Model ID</Th>
              <Th width={10}>External endpoint</Th>
              <Th width={10}>Status</Th>
              <Th width={10}>Playground</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getPaginatedMaaSModels().map((model) => (
              <Tr key={model.id}>
                <Td>
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {flags.enableModelDescriptionPages ? (
                          <Button
                            variant="link"
                            isInline
                            onClick={() => navigate(`/ai-assets/models/${model.slug}`)}
                            style={{ 
                              padding: 0, 
                              fontSize: 'inherit', 
                              fontWeight: 'bold',
                              textAlign: 'left',
                              justifyContent: 'flex-start',
                              height: 'auto',
                              minHeight: 'auto'
                            }}
                          >
                            {model.name}
                          </Button>
                        ) : (
                          <span style={{ fontWeight: 'bold' }}>{model.name}</span>
                        )}
                        <Label color="yellow" style={{ marginLeft: '0.5rem' }}>
                          MaaS
                        </Label>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6A6E73', marginTop: '0.25rem' }}>
                        {model.description}
                      </div>
                    </div>
                  </div>
                </Td>
                <Td dataLabel="External endpoint">
                  <EndpointPopover 
                    model={model}
                    copiedItems={copiedItems}
                    handleCopyWithFeedback={handleCopyWithFeedback}
                    type="external"
                    generatedTokens={generatedTokens}
                    isGeneratingToken={isGeneratingToken}
                    isMaaS={true}
                    onGenerateToken={handleGenerateToken}
                    onClearGeneratedToken={handleClearGeneratedToken}
                  />
                </Td>
                <Td dataLabel="Status">
                  <Label color="green" icon={<CheckCircleIcon />}>
                    Active
                  </Label>
                </Td>
                <Td dataLabel="Playground">
                  <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                    {/* Special logic for MaaS models */}
                    {model.name === 'llama-3.1-8b-instruct' && (
                      <FlexItem>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayground(model.id, 'model');
                          }}
                        >
                          Try in playground
                        </Button>
                      </FlexItem>
                    )}
                    {model.name === 'Pixtral-Large-Instruct-2411-hf-quantized.w8a8' && !modelsAddedToPlayground.has(model.id) && (
                      <FlexItem>
                        <Button 
                          variant="link" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToPlayground(model.id);
                          }}
                        >
                          <PlusCircleIcon style={{ marginRight: '0.25rem' }} />
                          Add to playground
                        </Button>
                      </FlexItem>
                    )}
                    {model.name === 'Pixtral-Large-Instruct-2411-hf-quantized.w8a8' && modelsAddedToPlayground.has(model.id) && (
                      <FlexItem>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayground(model.id, 'model');
                          }}
                        >
                          Try in playground
                        </Button>
                      </FlexItem>
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Pagination
          itemCount={getSortedMaaSModels().length}
          perPage={perPage}
          page={currentPage}
          onSetPage={(_event, pageNumber) => setCurrentPage(pageNumber)}
          onPerPageSelect={(_event, newPerPage) => {
            setPerPage(newPerPage);
            setCurrentPage(1); // Reset to first page when changing items per page
          }}
          variant="bottom"
          perPageOptions={[
            { title: '5', value: 5 },
            { title: '10', value: 10 },
            { title: '20', value: 20 }
          ]}
          isCompact
        />
      </>
    );
  };

  const renderMaaSModelsCards = () => {
    if (getSortedMaaSModels().length === 0) {
      return (
        <EmptyState>
          <Title headingLevel="h4" size="lg">
            <SearchIcon className="pf-v5-u-mr-sm" />
            No MaaS models found
          </Title>
          <EmptyStateBody>
            {(modelsFilters.name.length > 0 || modelsFilters.keyword.length > 0 || modelsFilters.useCase.length > 0 || modelsFilters.type.length > 0) ? 
              'No MaaS models match your filter criteria.' :
              'No MaaS models are currently available in this project.'
            }
          </EmptyStateBody>
          {(modelsFilters.name.length > 0 || modelsFilters.keyword.length > 0 || modelsFilters.useCase.length > 0 || modelsFilters.type.length > 0) && (
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" onClick={() => clearAllFilters('models')}>
                  Clear all filters
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          )}
        </EmptyState>
      );
    }

    return (
      <Grid hasGutter>
        {getSortedMaaSModels().map((model, index) => (
          <GridItem key={model.id} lg={4} md={6} sm={12}>
            <Card 
              isFullHeight
              onClick={flags.enableModelDescriptionPages ? () => navigate(`/ai-assets/models/${model.slug}`) : undefined}
              style={{ 
                cursor: flags.enableModelDescriptionPages ? 'pointer' : 'default',
                ...getCardAnimationStyle(modelsCardAnimations[index] || false, index)
              }}
            >
              <CardHeader>
                <CardTitle>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{model.name}</span>
                    <Label color="yellow">MaaS</Label>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6A6E73' }}>
                  {model.description}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <strong>Use Case:</strong> {model.useCase}
                  </div>
                  <Label color="green" icon={<CheckCircleIcon />}>
                    Active
                  </Label>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Special logic for MaaS models */}
                  {model.name === 'llama-3.1-8b-instruct' && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayground(model.id, 'model');
                      }}
                    >
                      Try in playground
                    </Button>
                  )}
                  {model.name === 'Pixtral-Large-Instruct-2411-hf-quantized.w8a8' && !modelsAddedToPlayground.has(model.id) && (
                    <Button 
                      variant="link" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToPlayground(model.id);
                      }}
                    >
                      <PlusCircleIcon style={{ marginRight: '0.25rem' }} />
                      Add to playground
                    </Button>
                  )}
                  {model.name === 'Pixtral-Large-Instruct-2411-hf-quantized.w8a8' && modelsAddedToPlayground.has(model.id) && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayground(model.id, 'model');
                      }}
                    >
                      Try in playground
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
    );
  };

  const renderMCPCards = () => {
    if (getSortedMcpServers().length === 0) {
      return (
        <EmptyState>
          <Title headingLevel="h4" size="lg">
            <SearchIcon className="pf-v5-u-mr-sm" />
            No MCP servers found
          </Title>
          <EmptyStateBody>
            {(mcpFilters.name.length > 0 || mcpFilters.keyword.length > 0 || mcpFilters.description.length > 0) ? 
              'No MCP servers match your filter criteria.' :
              'No MCP servers are currently available in this project.'
            }
          </EmptyStateBody>
          {(mcpFilters.name.length > 0 || mcpFilters.keyword.length > 0 || mcpFilters.description.length > 0) && (
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" onClick={() => clearAllFilters('mcp')}>
                  Clear filters
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          )}
        </EmptyState>
      );
    }

    return (
      <Grid hasGutter>
        {getSortedMcpServers().map((server, index) => (
          <GridItem key={server.id} lg={4} md={6} sm={12}>
            <Card 
              isFullHeight
              onClick={flags.enableMcpDetailsPage ? () => navigate(`/ai-assets/mvp-servers/${server.slug}`) : undefined}
              style={{ 
                cursor: flags.enableMcpDetailsPage ? 'pointer' : 'default',
                ...getCardAnimationStyle(mcpCardAnimations[index] || false, index)
              }}
            >
              <CardHeader>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">{server.name}</Title>
                </CardTitle>
              </CardHeader>
              <CardBody style={{ paddingTop: 0, paddingBottom: '0.5rem', flexGrow: 1 }}>
                <div className="pf-v5-u-mb-md">
                  <div style={{ marginBottom: '0.75rem' }}>
                    {renderStatusIcon(server.status)}
                  </div>
                  <div className="pf-v5-u-font-size-sm pf-v5-u-color-200">
                    {server.description}
                  </div>
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayground(server.id, 'mcp');
                    }}
                  >
                    Try in playground
                  </Button>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <PageSection>
        <Title headingLevel="h1" size="2xl">
          AI asset endpoints
        </Title>
        <div className="pf-v5-u-color-200 pf-v5-u-mt-sm">
          Browse endpoints for available models and MCP servers.
        </div>
      </PageSection>

      {/* Add Asset Button */}
      <PageSection style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
        <Button 
          variant="primary" 
          onClick={handleOpenAddAssetModal}
          id="add-asset-button"
        >
          Add asset
        </Button>
      </PageSection>

      <PageSection style={{ paddingTop: '0.5rem' }}>
        {/* Tabs */}
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_event, tabKey) => setActiveTabKey(tabKey)}
          aria-label="AI Assets tabs"
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>Models</TabTitleText>}
            aria-label="Models tab"
          >
            <div style={{ paddingTop: '1rem' }}>
              {/* Filters and Controls for Models */}
              <div 
                className="pf-v5-u-mb-lg"
                style={{ 
                  position: 'sticky',
                  top: '0',
                  zIndex: 100,
                  backgroundColor: '#ffffff',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid var(--pf-v5-global--BorderColor--100)'
                }}
              >
                <Toolbar>
                  <ToolbarContent>
                    <ToolbarGroup>
                      <ToolbarItem>
                        <InputGroup>
                          <InputGroupItem>
                            <Dropdown
                              isOpen={modelsFilterDropdownOpen}
                              onSelect={() => setModelsFilterDropdownOpen(false)}
                              onOpenChange={(isOpen: boolean) => setModelsFilterDropdownOpen(isOpen)}
                              toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => setModelsFilterDropdownOpen(!modelsFilterDropdownOpen)}
                                  isExpanded={modelsFilterDropdownOpen}
                                  style={{
                                    minWidth: '120px',
                                    backgroundColor: '#f0f0f0',
                                    borderRight: 'none',
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0
                                  }}
                                >
                                  <FilterIcon style={{ marginRight: '0.5rem' }} />
                                  {modelsFilterAttribute === 'name' && 'Name'}
                                  {modelsFilterAttribute === 'keyword' && 'Keyword'}
                                  {modelsFilterAttribute === 'useCase' && 'Use Case'}
                                </MenuToggle>
                              )}
                            >
                              <DropdownList>
                                <DropdownItem 
                                  key="name"
                                  onClick={() => {
                                    setModelsFilterAttribute('name');
                                    setModelsFilterInput('');
                                  }}
                                >
                                  Name
                                </DropdownItem>
                                <DropdownItem 
                                  key="keyword"
                                  onClick={() => {
                                    setModelsFilterAttribute('keyword');
                                    setModelsFilterInput('');
                                  }}
                                >
                                  Keyword
                                </DropdownItem>
                                <DropdownItem 
                                  key="useCase"
                                  onClick={() => {
                                    setModelsFilterAttribute('useCase');
                                    setModelsFilterInput('');
                                  }}
                                >
                                  Use Case
                                </DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </InputGroupItem>
                          <InputGroupItem isFill>
                            <SearchInput
                              placeholder={getFilterPlaceholder('models', modelsFilterAttribute)}
                              value={modelsFilterInput}
                              onChange={(_event, value) => setModelsFilterInput(value)}
                              onSearch={() => {
                                if (modelsFilterInput.trim()) {
                                  addFilter('models', modelsFilterAttribute, modelsFilterInput.trim());
                                }
                              }}
                              onClear={() => setModelsFilterInput('')}
                              style={{ 
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                minWidth: '300px'
                              }}
                            />
                          </InputGroupItem>
                        </InputGroup>
                      </ToolbarItem>

                    </ToolbarGroup>
                    {flags.enableCardTableViewSwitcher && (
                      <ToolbarGroup align={{ default: 'alignEnd' }}>
                        <ToolbarItem>
                          {/* View Toggle */}
                          <div style={{ display: 'flex' }}>
                            <Button
                              variant={modelsViewMode === 'cards' ? 'primary' : 'secondary'}
                              onClick={() => handleModelsViewModeChange('cards')}
                              style={{ 
                                fontSize: '0.75rem',
                                height: '2rem',
                                paddingLeft: '0.75rem',
                                paddingRight: '0.75rem',
                                marginRight: '0.25rem'
                              }}
                              icon={<ThIcon style={{ marginRight: '0.5rem' }} />}
                            >
                              Cards
                            </Button>
                            <Button
                              variant={modelsViewMode === 'table' ? 'primary' : 'secondary'}
                              onClick={() => handleModelsViewModeChange('table')}
                              style={{ 
                                fontSize: '0.75rem',
                                height: '2rem',
                                paddingLeft: '0.75rem',
                                paddingRight: '0.75rem'
                              }}
                              icon={<ListIcon style={{ marginRight: '0.5rem' }} />}
                            >
                              Table
                            </Button>
                          </div>
                        </ToolbarItem>
                      </ToolbarGroup>
                    )}
                    <ToolbarGroup align={{ default: 'alignEnd' }}>
                      <ToolbarItem>
                        {/* Deployment Help Link */}
                        <Popover
                          isVisible={isDeploymentHelpPopoverOpen}
                          shouldClose={() => setIsDeploymentHelpPopoverOpen(false)}
                          bodyContent={
                            <div style={{ padding: '1rem', maxWidth: '300px' }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                                To make a model deployment available:
                              </div>
                              <ol style={{ 
                                margin: 0, 
                                paddingLeft: '1.25rem',
                                fontSize: '0.875rem',
                                lineHeight: '1.4'
                              }}>
                                <li style={{ marginBottom: '0.5rem' }}>
                                  Go to your <strong>model deployments</strong> page
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                  Select <strong>&apos;Edit&apos;</strong> to update your deployment
                                </li>
                                <li>
                                  Check the box: <strong>&apos;Make this deployment available as an AI Asset&apos;</strong>
                                </li>
                              </ol>
                            </div>
                          }
                          position="bottom"
                        >
                          <Button
                            variant="link"
                            onClick={() => setIsDeploymentHelpPopoverOpen(!isDeploymentHelpPopoverOpen)}
                            style={{ fontSize: '0.875rem', padding: 0 }}
                          >
                            Don&apos;t see the model you&apos;re looking for?
                          </Button>
                        </Popover>
                      </ToolbarItem>
                      <ToolbarItem>
                        <Pagination
                          itemCount={getSortedModels().length}
                          perPage={perPage}
                          page={currentPage}
                          onSetPage={(_event, pageNumber) => setCurrentPage(pageNumber)}
                          onPerPageSelect={(_event, newPerPage) => {
                            setPerPage(newPerPage);
                            setCurrentPage(1);
                          }}
                          variant="top"
                          isCompact
                          perPageOptions={[
                            { title: '5', value: 5 },
                            { title: '10', value: 10 },
                            { title: '20', value: 20 },
                            { title: '50', value: 50 }
                          ]}
                        />
                      </ToolbarItem>
                    </ToolbarGroup>

                    {/* Active Filters Row */}
                    {(modelsFilters.name.length > 0 || modelsFilters.keyword.length > 0 || modelsFilters.useCase.length > 0 || modelsFilters.type.length > 0) && (
                      <ToolbarGroup>
                        <ToolbarItem variant="label-group">
                          <LabelGroup
                            categoryName="Active filters"
                            isClosable={false}
                            numLabels={modelsFilters.name.length + modelsFilters.keyword.length + modelsFilters.useCase.length + modelsFilters.type.length}
                          >
                            {modelsFilters.name.map(filter => (
                              <Label 
                                key={`name-${filter}`}
                                variant="outline"
                                onClose={() => removeFilter('models', 'name', filter)}
                              >
                                {filter}
                              </Label>
                            ))}
                            {modelsFilters.keyword.map(filter => (
                              <Label 
                                key={`keyword-${filter}`}
                                variant="outline"
                                onClose={() => removeFilter('models', 'keyword', filter)}
                              >
                                {filter}
                              </Label>
                            ))}
                            {modelsFilters.useCase.map(filter => (
                              <Label 
                                key={`useCase-${filter}`}
                                variant="outline"
                                onClose={() => removeFilter('models', 'useCase', filter)}
                              >
                                {filter}
                              </Label>
                            ))}
                          </LabelGroup>
                          <Button 
                            variant="link" 
                            onClick={() => clearAllFilters('models')}
                            size="sm"
                          >
                            Clear filters
                          </Button>
                        </ToolbarItem>
                      </ToolbarGroup>
                    )}
                  </ToolbarContent>
                </Toolbar>
              </div>
              <div style={{ marginTop: modelsViewMode === 'cards' ? '1.5rem' : '0' }}>
                {modelsViewMode === 'table' ? renderModelsTable() : renderModelsCards()}
              </div>
            </div>
          </Tab>
          <Tab
            eventKey={1}
            title={<TabTitleText>MCP servers</TabTitleText>}
            aria-label="MCP Servers tab"
          >
            <div style={{ paddingTop: '1rem' }}>
              {/* Filters and Controls for MCP Servers */}
              <div 
                className="pf-v5-u-mb-lg"
                style={{ 
                  position: 'sticky',
                  top: '0',
                  zIndex: 100,
                  backgroundColor: '#ffffff',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid var(--pf-v5-global--BorderColor--100)'
                }}
              >
                <Toolbar>
                  <ToolbarContent>
                    <ToolbarGroup>
                      <ToolbarItem>
                        {/* Bulk Selection */}
                        <InputGroup>
                          <InputGroupItem>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid var(--pf-v5-global--BorderColor--100)',
                              borderRadius: 'var(--pf-v5-global--BorderRadius--sm)',
                              height: '36px',
                              minWidth: '120px'
                            }}>
                              <Checkbox
                                isChecked={getBulkSelectCheckboxState().checked}
                                onChange={(_event, checked) => handleMcpSelectAll(checked)}
                                aria-label="Bulk select MCP servers"
                                id="bulk-select-mcp"
                              />
                              <span style={{ fontSize: '0.875rem' }}>
                                {selectedMcpServers.size} selected
                              </span>
                            </div>
                          </InputGroupItem>
                        </InputGroup>
                      </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                      <ToolbarItem>
                        <InputGroup>
                          <InputGroupItem>
                            <Dropdown
                              isOpen={mcpFilterDropdownOpen}
                              onSelect={() => setMcpFilterDropdownOpen(false)}
                              onOpenChange={(isOpen: boolean) => setMcpFilterDropdownOpen(isOpen)}
                              toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => setMcpFilterDropdownOpen(!mcpFilterDropdownOpen)}
                                  isExpanded={mcpFilterDropdownOpen}
                                  style={{
                                    minWidth: '120px',
                                    backgroundColor: '#f0f0f0',
                                    borderRight: 'none',
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0
                                  }}
                                >
                                  <FilterIcon style={{ marginRight: '0.5rem' }} />
                                  {mcpFilterAttribute === 'name' && 'Name'}
                                  {mcpFilterAttribute === 'keyword' && 'Keyword'}
                                  {mcpFilterAttribute === 'description' && 'Description'}
                                </MenuToggle>
                              )}
                            >
                              <DropdownList>
                                <DropdownItem 
                                  key="name"
                                  onClick={() => setMcpFilterAttribute('name')}
                                >
                                  Name
                                </DropdownItem>
                                <DropdownItem 
                                  key="keyword"
                                  onClick={() => setMcpFilterAttribute('keyword')}
                                >
                                  Keyword
                                </DropdownItem>
                                <DropdownItem 
                                  key="description"
                                  onClick={() => setMcpFilterAttribute('description')}
                                >
                                  Description
                                </DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </InputGroupItem>
                          <InputGroupItem isFill>
                            <SearchInput
                              placeholder={getFilterPlaceholder('mcp', mcpFilterAttribute)}
                              value={mcpFilterInput}
                              onChange={(_event, value) => setMcpFilterInput(value)}
                              onSearch={() => {
                                if (mcpFilterInput.trim()) {
                                  addFilter('mcp', mcpFilterAttribute, mcpFilterInput.trim());
                                }
                              }}
                              onClear={() => setMcpFilterInput('')}
                              style={{ 
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                minWidth: '300px'
                              }}
                            />
                          </InputGroupItem>
                        </InputGroup>
                      </ToolbarItem>

                      <ToolbarItem>
                        <Button 
                          variant="primary" 
                          isDisabled={selectedMcpServers.size === 0}
                          onClick={() => {
                            // Navigate to playground with selected MCP servers
                            const selectedServerNames = Array.from(selectedMcpServers).map(id => {
                              const server = mockMCPServers.find(s => s.id === id);
                              return server ? server.name : '';
                            }).filter(Boolean);
                            
                            navigate('/gen-ai-studio/ai-playground', { 
                              state: { 
                                preselectedMCPs: selectedServerNames
                              }
                            });
                          }}
                        >
                          <PlayIcon style={{ marginRight: '0.25rem' }} />
                          Try in playground
                        </Button>
                      </ToolbarItem>
                    </ToolbarGroup>
                    {flags.enableCardTableViewSwitcher && (
                      <ToolbarGroup align={{ default: 'alignEnd' }}>
                        <ToolbarItem>
                          {/* View Toggle */}
                          <div style={{ display: 'flex' }}>
                            <Button
                              variant={mcpViewMode === 'cards' ? 'primary' : 'secondary'}
                              onClick={() => handleMcpViewModeChange('cards')}
                              style={{ 
                                fontSize: '0.75rem',
                                height: '2rem',
                                paddingLeft: '0.75rem',
                                paddingRight: '0.75rem',
                                marginRight: '0.25rem'
                              }}
                              icon={<ThIcon style={{ marginRight: '0.5rem' }} />}
                            >
                              Cards
                            </Button>
                            <Button
                              variant={mcpViewMode === 'table' ? 'primary' : 'secondary'}
                              onClick={() => handleMcpViewModeChange('table')}
                              style={{ 
                                fontSize: '0.75rem',
                                height: '2rem',
                                paddingLeft: '0.75rem',
                                paddingRight: '0.75rem'
                              }}
                              icon={<ListIcon style={{ marginRight: '0.5rem' }} />}
                            >
                              Table
                            </Button>
                          </div>
                        </ToolbarItem>
                      </ToolbarGroup>
                    )}
                    <ToolbarGroup align={{ default: 'alignEnd' }}>
                      <ToolbarItem>
                        <Pagination
                          itemCount={getSortedMcpServers().length}
                          perPage={mcpPerPage}
                          page={mcpCurrentPage}
                          onSetPage={(_event, pageNumber) => setMcpCurrentPage(pageNumber)}
                          onPerPageSelect={(_event, newPerPage) => {
                            setMcpPerPage(newPerPage);
                            setMcpCurrentPage(1);
                          }}
                          variant="top"
                          isCompact
                          perPageOptions={[
                            { title: '5', value: 5 },
                            { title: '10', value: 10 },
                            { title: '20', value: 20 },
                            { title: '50', value: 50 }
                          ]}
                        />
                      </ToolbarItem>
                    </ToolbarGroup>
                    {/* Active Filters Row */}
                    {(mcpFilters.name.length > 0 || mcpFilters.keyword.length > 0 || mcpFilters.description.length > 0) && (
                      <ToolbarGroup>
                        <ToolbarItem variant="label-group">
                          <LabelGroup
                            categoryName="Active filters"
                            isClosable={false}
                            numLabels={mcpFilters.name.length + mcpFilters.keyword.length + mcpFilters.description.length}
                          >
                            {mcpFilters.name.map(filter => (
                              <Label 
                                key={`name-${filter}`}
                                variant="outline"
                                onClose={() => removeFilter('mcp', 'name', filter)}
                              >
                                {filter}
                              </Label>
                            ))}
                            {mcpFilters.keyword.map(filter => (
                              <Label 
                                key={`keyword-${filter}`}
                                variant="outline"
                                onClose={() => removeFilter('mcp', 'keyword', filter)}
                              >
                                {filter}
                              </Label>
                            ))}
                            {mcpFilters.description.map(filter => (
                              <Label 
                                key={`description-${filter}`}
                                variant="outline"
                                onClose={() => removeFilter('mcp', 'description', filter)}
                              >
                                {filter}
                              </Label>
                            ))}
                          </LabelGroup>
                          <Button 
                            variant="link" 
                            onClick={() => clearAllFilters('mcp')}
                            size="sm"
                          >
                            Clear filters
                          </Button>
                        </ToolbarItem>
                      </ToolbarGroup>
                    )}
                  </ToolbarContent>
                </Toolbar>
              </div>
              <div style={{ marginTop: mcpViewMode === 'cards' ? '1.5rem' : '0' }}>
                {mcpViewMode === 'table' ? renderMCPTable() : renderMCPCards()}
              </div>
            </div>
          </Tab>
        </Tabs>
      </PageSection>

      {/* Endpoint Creation Progress Modal */}
      <Modal
        variant={ModalVariant.small}
        title="Creating Endpoint"
        isOpen={isCreatingEndpoint}
        onClose={() => {}} // Prevent closing during creation
      >
        <ModalHeader>
          <Title headingLevel="h2" size="xl">
            Creating Endpoint
          </Title>
        </ModalHeader>
        <ModalBody>
          <div className="pf-v5-u-mb-lg">
            <div className="pf-v5-u-mb-md">{currentProgressMessage}</div>
            <Progress value={creationProgress} />
          </div>
        </ModalBody>
      </Modal>

      {/* Model Selection Modal */}
      <Modal
        variant={ModalVariant.large}
        title="Configure playground"
        isOpen={isModelSelectionModalOpen}
        onClose={handleCancelModelSelection}
      >
            <div style={{ paddingTop: '1rem' }}>
              {/* Filters and Controls for MaaS Models */}
              <div 
                className="pf-v5-u-mb-lg"
                style={{ 
                  position: 'sticky',
                  top: '0',
                  zIndex: 100,
                  backgroundColor: '#ffffff',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid var(--pf-v5-global--BorderColor--100)'
                }}
              >
                <Toolbar>
                  <ToolbarContent>
                    <ToolbarGroup>
                      <ToolbarItem>
                        <InputGroup>
                          <InputGroupItem>
                            <Dropdown
                              isOpen={maasFilterDropdownOpen}
                              onSelect={() => setMaasFilterDropdownOpen(false)}
                              onOpenChange={(isOpen: boolean) => setMaasFilterDropdownOpen(isOpen)}
                              toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => setMaasFilterDropdownOpen(!maasFilterDropdownOpen)}
                                  isExpanded={maasFilterDropdownOpen}
                                  style={{
                                    minWidth: '120px',
                                    backgroundColor: '#f0f0f0',
                                    borderRight: 'none',
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0
                                  }}
                                >
                                  <FilterIcon style={{ marginRight: '0.5rem' }} />
                                  {maasFilterAttribute === 'name' && 'Name'}
                                  {maasFilterAttribute === 'keyword' && 'Keyword'}
                                  {maasFilterAttribute === 'useCase' && 'Use Case'}
                                </MenuToggle>
                              )}
                            >
                              <DropdownList>
                                <DropdownItem 
                                  key="name"
                                  onClick={() => {
                                    setMaasFilterAttribute('name');
                                    setMaasFilterInput('');
                                  }}
                                >
                                  Name
                                </DropdownItem>
                                <DropdownItem 
                                  key="keyword"
                                  onClick={() => {
                                    setMaasFilterAttribute('keyword');
                                    setMaasFilterInput('');
                                  }}
                                >
                                  Keyword
                                </DropdownItem>
                                <DropdownItem 
                                  key="useCase"
                                  onClick={() => {
                                    setMaasFilterAttribute('useCase');
                                    setMaasFilterInput('');
                                  }}
                                >
                                  Use Case
                                </DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </InputGroupItem>
                          <InputGroupItem isFill>
                            <SearchInput
                              placeholder={getFilterPlaceholder('models', maasFilterAttribute)}
                              value={maasFilterInput}
                              onChange={(_event, value) => setMaasFilterInput(value)}
                              onSearch={() => {
                                if (maasFilterInput.trim()) {
                                  addFilter('models', maasFilterAttribute, maasFilterInput.trim());
                                }
                              }}
                              onClear={() => setMaasFilterInput('')}
                              style={{ 
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                minWidth: '300px'
                              }}
                            />
                          </InputGroupItem>
                        </InputGroup>
                      </ToolbarItem>

                    </ToolbarGroup>

                    <ToolbarGroup align={{ default: 'alignEnd' }}>
                      <ToolbarItem>
                        <Pagination
                          itemCount={getSortedMaaSModels().length}
                          perPage={perPage}
                          page={currentPage}
                          onSetPage={(_event, pageNumber) => setCurrentPage(pageNumber)}
                          onPerPageSelect={(_event, newPerPage) => {
                            setPerPage(newPerPage);
                            setCurrentPage(1);
                          }}
                          variant="top"
                          isCompact
                          perPageOptions={[
                            { title: '5', value: 5 },
                            { title: '10', value: 10 },
                            { title: '20', value: 20 }
                          ]}
                        />
                      </ToolbarItem>
                    </ToolbarGroup>

                    {flags.enableCardTableViewSwitcher && (
                      <ToolbarGroup align={{ default: 'alignEnd' }}>
                        <ToolbarItem>
                          {/* View Toggle */}
                          <div style={{ display: 'flex' }}>
                            <Button
                              variant={modelsViewMode === 'cards' ? 'primary' : 'secondary'}
                              onClick={() => handleModelsViewModeChange('cards')}
                              style={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                borderRight: 'none'
                              }}
                            >
                              <ThIcon style={{ marginRight: '0.25rem' }} />
                              Cards
                            </Button>
                            <Button
                              variant={modelsViewMode === 'table' ? 'primary' : 'secondary'}
                              onClick={() => handleModelsViewModeChange('table')}
                              style={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0
                              }}
                            >
                              <ListIcon style={{ marginRight: '0.25rem' }} />
                              Table
                            </Button>
                          </div>
                        </ToolbarItem>

                        <ToolbarItem>
                          <Pagination
                            itemCount={getSortedMaaSModels().length}
                            perPage={perPage}
                            page={currentPage}
                            onSetPage={(_event, pageNumber) => setCurrentPage(pageNumber)}
                            onPerPageSelect={(_event, newPerPage) => {
                              setPerPage(newPerPage);
                              setCurrentPage(1);
                            }}
                            variant="top"
                            isCompact
                            perPageOptions={[
                              { title: '5', value: 5 },
                              { title: '10', value: 10 },
                              { title: '20', value: 20 }
                            ]}
                          />
                        </ToolbarItem>
                      </ToolbarGroup>
                    )}
                  </ToolbarContent>
                </Toolbar>
              </div>
              
              {/* Active Filters Row - separate section underneath toolbar */}
              {(modelsFilters.name.length > 0 || modelsFilters.keyword.length > 0 || modelsFilters.useCase.length > 0 || modelsFilters.type.length > 0) && (
                <div style={{ 
                  padding: '0.75rem 1rem', 
                  borderBottom: '1px solid var(--pf-v5-global--BorderColor--100)',
                  backgroundColor: '#fafafa',
                  width: '100%',
                  display: 'block'
                }}>
                  <LabelGroup
                    categoryName="Active filters"
                    isClosable={false}
                    numLabels={modelsFilters.name.length + modelsFilters.keyword.length + modelsFilters.useCase.length + modelsFilters.type.length}
                  >
                    {modelsFilters.name.map(filter => (
                      <Label 
                        key={`name-${filter}`}
                        variant="outline"
                        onClose={() => removeFilter('models', 'name', filter)}
                      >
                        {filter}
                      </Label>
                    ))}
                    {modelsFilters.keyword.map(filter => (
                      <Label 
                        key={`keyword-${filter}`}
                        variant="outline"
                        onClose={() => removeFilter('models', 'keyword', filter)}
                      >
                        {filter}
                      </Label>
                    ))}
                    {modelsFilters.useCase.map(filter => (
                      <Label 
                        key={`useCase-${filter}`}
                        variant="outline"
                        onClose={() => removeFilter('models', 'useCase', filter)}
                      >
                        {filter}
                      </Label>
                    ))}
                  </LabelGroup>
                  <Button 
                    variant="link" 
                    onClick={() => clearAllFilters('models')}
                    size="sm"
                    style={{ marginLeft: '0.5rem' }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
              
              <div style={{ marginTop: '1.5rem' }}>
                {renderMCPCards()}
              </div>
            </div>
          </Tab>
        </Tabs>
      </PageSection>
        <ModalHeader>
          <Title headingLevel="h2" size="xl">
            Configure playground
          </Title>
        </ModalHeader>
        <ModalBody>
          <div style={{ marginBottom: '1.5rem' }}>
            <p>
              Choose the models you want to make available in this playground from your AI available assets. You can add additional models by making them available from the{' '}
              <Button 
                variant="link" 
                isInline 
                style={{ padding: 0, fontSize: 'inherit' }}
                onClick={() => navigate('/ai-assets/models')}
              >
                Model deployments page
              </Button>
              .
            </p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            {/* Filter and Selection Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Checkbox 
                id="select-all-models"
                isChecked={selectedModelsForPlayground.size === getFilteredModalModels().length && getFilteredModalModels().length > 0}
                onChange={() => {
                  const availableModels = getFilteredModalModels();
                  if (selectedModelsForPlayground.size === availableModels.length) {
                    setSelectedModelsForPlayground(new Set());
                  } else {
                    setSelectedModelsForPlayground(new Set(availableModels.map(m => m.id)));
                  }
                }}
              />
              
              <Dropdown
                isOpen={isModalFilterDropdownOpen}
                onSelect={(event, value) => {
                  setModalFilterBy(value as string);
                  setIsModalFilterDropdownOpen(false);
                }}
                onOpenChange={(isOpen) => setIsModalFilterDropdownOpen(isOpen)}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsModalFilterDropdownOpen(!isModalFilterDropdownOpen)}
                    isExpanded={isModalFilterDropdownOpen}
                    icon={<FilterIcon />}
                    style={{ minWidth: '120px' }}
                  >
                    {modalFilterBy === 'name' ? 'Name' : 'Use Case'}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem value="name">Name</DropdownItem>
                  <DropdownItem value="useCase">Use Case</DropdownItem>
                </DropdownList>
              </Dropdown>
              
              <div style={{ width: '200px' }}>
                <TextInput
                  type="search"
                  placeholder={modalFilterBy === 'name' ? 'Filter by name' : 'Filter by use case...'}
                  value={modalSearchText}
                  onChange={(_event, value) => setModalSearchText(value)}
                />
              </div>
              
              <span style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                {selectedModelsForPlayground.size} of {getFilteredModalModels().length} items selected
              </span>
              
              <div style={{ marginLeft: 'auto' }}>
                <Pagination
                  itemCount={getFilteredModalModels().length}
                  perPage={4}
                  page={1}
                  onSetPage={() => {}}
                  onPerPageSelect={() => {}}
                  isCompact
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
              Available models
            </Title>
            
            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th width={10}></Th>
                  <Th>Model name</Th>
                  <Th>Model ID</Th>
                  <Th>Description</Th>
                  <Th>Use Case</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {getFilteredModalModels()
                  .slice(0, 4)
                  .map((model) => (
                  <Tr key={model.id}>
                    <Td>
                      <Checkbox
                        id={`model-${model.id}`}
                        isChecked={selectedModelsForPlayground.has(model.id)}
                        onChange={() => handleModelSelectionToggle(model.id)}
                      />
                    </Td>
                    <Td>{model.name}</Td>
                    <Td style={{ maxWidth: '300px' }}>
                      <div style={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {model.description}
                      </div>
                    </Td>
                    <Td>{model.useCase}</Td>
                    <Td>
                      <Label color="green" icon={<CheckCircleIcon />}>
                        Active
                      </Label>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="primary" 
            onClick={handleConfigurePlayground}
            isDisabled={selectedModelsForPlayground.size === 0}
          >
            Configure
          </Button>
          <Button variant="link" onClick={handleCancelModelSelection}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Auto Config Modal */}
      <Modal
        variant={ModalVariant.medium}
        title="Configuring playground"
        isOpen={isAddingToPlayground}
        onClose={configProgress === 100 ? handleConfirmAddToPlayground : undefined}
      >
        <ModalHeader>
          <Title headingLevel="h2" size="xl">
            Configuring playground
          </Title>
        </ModalHeader>
        <ModalBody>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '1rem', color: '#6a6e73', marginBottom: '2rem' }}>
              Please wait while we automatically configure your playground
            </p>
          </div>


          {/* Completed steps */}
          <div style={{ marginBottom: '2rem' }}>
            {configSteps.map((step, index) => (
              <div key={index} style={{ marginBottom: '0.75rem' }}>
                {index < currentConfigStep ? (
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <CheckCircleIcon style={{ color: '#3E8635' }} />
                    </FlexItem>
                    <FlexItem>
                      <span style={{ color: '#6a6e73' }}>{step.label}</span>
                    </FlexItem>
                  </Flex>
                ) : index === currentConfigStep ? (
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <Spinner size="sm" />
                    </FlexItem>
                    <FlexItem>
                      <span style={{ color: '#151515', fontWeight: '500' }}>{step.label}</span>
                    </FlexItem>
                  </Flex>
                ) : (
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <span style={{ 
                        width: '16px', 
                        height: '16px', 
                        borderRadius: '50%', 
                        backgroundColor: '#f0f0f0',
                        display: 'inline-block'
                      }}></span>
                    </FlexItem>
                    <FlexItem>
                      <span style={{ color: '#6a6e73' }}>{step.label}</span>
                    </FlexItem>
                  </Flex>
                )}
              </div>
            ))}
          </div>

          {/* Progress status */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#151515', 
              marginBottom: '1rem',
              fontWeight: '500'
            }}>
              Configuring {Array.from(selectedModelsForPlayground).map(id => mockModels.find(m => m.id === id)?.name).filter(name => name).join(', ')} for playground - 2 minutes remaining
            </p>
            
            <Progress 
              value={configProgress}
              size="lg"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="secondary" 
            onClick={handleCancelAddToPlayground}
            isDisabled={configProgress > 0 && configProgress < 100}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Deploy Model Modal */}
      <ModelDeploymentModal
        isOpen={isCreateEndpointModalOpen}
        onClose={handleCancelCreateEndpoint}
        onDeploy={handleConfirmCreateEndpoint}
        selectedProject={selectedProject}
      />

      {/* Token Copy Modal */}
      <Modal
        variant={ModalVariant.small}
        title="Token Copied"
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      >
        <ModalHeader>
          <Title headingLevel="h2" size="xl">
            <CheckCircleIcon className="pf-v5-u-mr-sm pf-v5-u-success-color-100" />
            {tokenType} Copied
          </Title>
        </ModalHeader>
        <ModalBody>
          <div className="pf-v5-u-mb-md">
            The {tokenType.toLowerCase()} has been copied to your clipboard.
          </div>
          <CodeBlock>
            <CodeBlockCode>{selectedToken}</CodeBlockCode>
          </CodeBlock>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsTokenModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Tools Modal */}
      <Modal
        variant={ModalVariant.medium}
        title={selectedServerForTools ? `Available tools on the ${selectedServerForTools.name}` : 'Tools'}
        isOpen={isToolsModalOpen}
        onClose={() => setIsToolsModalOpen(false)}
      >
        <ModalHeader>
          <Title headingLevel="h2" size="xl">
            {selectedServerForTools ? `Available tools on the ${selectedServerForTools.name}` : 'Tools'}
          </Title>
        </ModalHeader>
        <ModalBody>
          {selectedServerForTools && (
            <>
              {(() => {
                const tools = getServerTools(selectedServerForTools.slug);
                if (tools.length === 0) {
                  return (
                    <EmptyState>
                      <Title headingLevel="h4" size="lg">
                        <ToolsIcon className="pf-v5-u-mr-sm" />
                        No tools available
                      </Title>
                      <EmptyStateBody>
                        This server doesn&apos;t have any tools configured.
                      </EmptyStateBody>
                    </EmptyState>
                  );
                }
                
                return (
                  <Flex direction={{ default: 'column' }}>
                    {tools.map((tool, index) => (
                      <React.Fragment key={index}>
                        <Flex 
                          alignItems={{ default: 'alignItemsCenter' }}
                          gap={{ default: 'gapMd' }}
                          style={{ padding: '0.5rem 0' }}
                        >
                          <FlexItem flex={{ default: 'flexNone' }} style={{ width: '200px' }}>
                            <div style={{ 
                              fontFamily: 'var(--pf-v5-global--FontFamily--monospace)', 
                              fontWeight: 'bold',
                              fontSize: '0.875rem'
                            }}>
                              {tool.name}
                            </div>
                          </FlexItem>
                          <FlexItem grow={{ default: 'grow' }}>
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: 'var(--pf-v5-global--Color--200)' 
                            }}>
                              {tool.description}
                            </div>
                          </FlexItem>
                        </Flex>
                        {index < tools.length - 1 && (
                          <Divider />
                        )}
                      </React.Fragment>
                    ))}
                  </Flex>
                );
              })()}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsToolsModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add Asset Modal */}
      <Modal
        isOpen={isAddAssetModalOpen}
        onClose={handleCloseAddAssetModal}
        aria-labelledby="add-asset-modal-title"
        aria-describedby="add-asset-modal-body"
        ouiaId="AddAssetModal"
        className="pf-m-md"
        appendTo={document.body}
      >
        <ModalHeader 
          title="Add asset" 
          labelId="add-asset-modal-title"
        />
        <ModalBody id="add-asset-modal-body">
          <Form>
            <FormGroup 
              label="Asset type" 
              fieldId="asset-type-select"
              isRequired
            >
              <Select
                id="asset-type-select"
                isOpen={isAssetTypeOpen}
                selected={assetType}
                onSelect={(_event, value) => {
                  setAssetType(value as AssetType);
                  setIsAssetTypeOpen(false);
                  // Reset conditional fields when asset type changes
                  setProject('');
                  setModelDeployment('');
                  setMcpServer('');
                  setTools('');
                }}
                onOpenChange={(isOpen) => setIsAssetTypeOpen(isOpen)}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsAssetTypeOpen(!isAssetTypeOpen)}
                    isExpanded={isAssetTypeOpen}
                    style={{ width: '100%' }}
                    id="asset-type-toggle"
                  >
                    {assetType || 'Select asset type'}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  <SelectOption value="Model" id="asset-type-model">
                    Model
                  </SelectOption>
                  <SelectOption value="MCP Server" id="asset-type-mcp-server">
                    MCP Server
                  </SelectOption>
                </SelectList>
              </Select>
            </FormGroup>

            {assetType === 'Model' && (
              <>
                <FormGroup 
                  label="Model location" 
                  fieldId="model-location-select"
                  isRequired
                >
                  <Select
                    id="model-location-select"
                    isOpen={isModelLocationOpen}
                    selected={modelLocation}
                    onSelect={(_event, value) => {
                      setModelLocation(value as ModelLocation);
                      setIsModelLocationOpen(false);
                      // Reset conditional fields when location changes
                      setProject('');
                      setModelDeployment('');
                      setExternalProvider('');
                      setExternalProviderAPIKey('');
                      setSelectedExternalModels(new Set());
                    }}
                    onOpenChange={(isOpen) => setIsModelLocationOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsModelLocationOpen(!isModelLocationOpen)}
                        isExpanded={isModelLocationOpen}
                        style={{ width: '100%' }}
                        id="model-location-toggle"
                      >
                        {modelLocation || 'Select model location'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Internal" id="location-internal">
                        Internal (on-cluster)
                      </SelectOption>
                      <SelectOption value="External" id="location-external">
                        External
                      </SelectOption>
                    </SelectList>
                  </Select>
                </FormGroup>

                {modelLocation === 'Internal' && (
                  <>
                    <FormGroup 
                      label="Project" 
                      fieldId="add-asset-project-select"
                      isRequired
                    >
                      <Select
                        id="add-asset-project-select"
                        isOpen={isAddAssetProjectOpen}
                        selected={project}
                        onSelect={(_event, value) => {
                          setProject(value as string);
                          setIsAddAssetProjectOpen(false);
                        }}
                        onOpenChange={(isOpen) => setIsAddAssetProjectOpen(isOpen)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsAddAssetProjectOpen(!isAddAssetProjectOpen)}
                            isExpanded={isAddAssetProjectOpen}
                            style={{ width: '100%' }}
                            id="add-asset-project-toggle"
                          >
                            {project || 'Select project'}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value="Project 1" id="add-asset-project-1">
                            Project 1
                          </SelectOption>
                          <SelectOption value="Project 2" id="add-asset-project-2">
                            Project 2
                          </SelectOption>
                          <SelectOption value="Project 3" id="add-asset-project-3">
                            Project 3
                          </SelectOption>
                        </SelectList>
                      </Select>
                    </FormGroup>

                    <FormGroup 
                      label="Model deployment" 
                      fieldId="add-asset-model-deployment-select"
                      isRequired
                    >
                      <Select
                        id="add-asset-model-deployment-select"
                        isOpen={isModelDeploymentOpen}
                        selected={modelDeployment}
                        onSelect={(_event, value) => {
                          setModelDeployment(value as string);
                          setIsModelDeploymentOpen(false);
                        }}
                        onOpenChange={(isOpen) => setIsModelDeploymentOpen(isOpen)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsModelDeploymentOpen(!isModelDeploymentOpen)}
                            isExpanded={isModelDeploymentOpen}
                            style={{ width: '100%' }}
                            id="add-asset-model-deployment-toggle"
                          >
                            {modelDeployment || 'Select model deployment'}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value="Model Deployment 1" id="add-asset-deployment-1">
                            Model Deployment 1
                          </SelectOption>
                          <SelectOption value="Model Deployment 2" id="add-asset-deployment-2">
                            Model Deployment 2
                          </SelectOption>
                          <SelectOption value="Model Deployment 3" id="add-asset-deployment-3">
                            Model Deployment 3
                          </SelectOption>
                        </SelectList>
                      </Select>
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem>
                            Adding this as an AI asset will make it available to other users outside of the namespace/project.
                          </HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                    </FormGroup>
                  </>
                )}

                {modelLocation === 'External' && (
                  <>
                    <FormGroup 
                      label="External provider" 
                      fieldId="external-provider-select"
                      isRequired
                    >
                      <Select
                        id="external-provider-select"
                        isOpen={isExternalProviderOpen}
                        selected={externalProvider}
                        onSelect={(_event, value) => {
                          setExternalProvider(value as string);
                          setIsExternalProviderOpen(false);
                        }}
                        onOpenChange={(isOpen) => setIsExternalProviderOpen(isOpen)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsExternalProviderOpen(!isExternalProviderOpen)}
                            isExpanded={isExternalProviderOpen}
                            style={{ width: '100%' }}
                            id="external-provider-toggle"
                          >
                            {externalProvider || 'Select external provider'}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value="OpenAI" id="provider-openai">
                            OpenAI
                          </SelectOption>
                          <SelectOption value="Anthropic" id="provider-anthropic">
                            Anthropic
                          </SelectOption>
                        </SelectList>
                      </Select>
                    </FormGroup>

                    <FormGroup 
                      label="API key" 
                      fieldId="external-provider-api-key"
                      isRequired
                    >
                      <TextInput
                        id="external-provider-api-key"
                        type="password"
                        value={externalProviderAPIKey}
                        onChange={(_event, value) => setExternalProviderAPIKey(value)}
                        placeholder="Enter your API key"
                      />
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem>
                            Your API key from {externalProvider || 'the external provider'} to authenticate requests.
                          </HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                    </FormGroup>

                    {externalProviderAPIKey && (
                      <FormGroup 
                        label="Available models" 
                        fieldId="external-models-select"
                        isRequired
                      >
                        <div style={{ 
                          border: '1px solid var(--pf-v5-global--BorderColor--100)', 
                          borderRadius: '4px', 
                          padding: '1rem',
                          maxHeight: '300px',
                          overflowY: 'auto'
                        }}>
                          <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6a6e73' }}>
                            Select the models you want to add as AI assets:
                          </p>
                          {externalProvider === 'OpenAI' && (
                            <>
                              <Checkbox
                                id="external-model-gpt4"
                                label="GPT-4"
                                description="Most capable model, best for complex tasks"
                                isChecked={selectedExternalModels.has('gpt-4')}
                                onChange={(_event, checked) => {
                                  setSelectedExternalModels(prev => {
                                    const newSet = new Set(prev);
                                    if (checked) {
                                      newSet.add('gpt-4');
                                    } else {
                                      newSet.delete('gpt-4');
                                    }
                                    return newSet;
                                  });
                                }}
                                style={{ marginBottom: '0.5rem' }}
                              />
                              <Checkbox
                                id="external-model-gpt4-turbo"
                                label="GPT-4 Turbo"
                                description="Fast and efficient variant of GPT-4"
                                isChecked={selectedExternalModels.has('gpt-4-turbo')}
                                onChange={(_event, checked) => {
                                  setSelectedExternalModels(prev => {
                                    const newSet = new Set(prev);
                                    if (checked) {
                                      newSet.add('gpt-4-turbo');
                                    } else {
                                      newSet.delete('gpt-4-turbo');
                                    }
                                    return newSet;
                                  });
                                }}
                                style={{ marginBottom: '0.5rem' }}
                              />
                              <Checkbox
                                id="external-model-gpt35-turbo"
                                label="GPT-3.5 Turbo"
                                description="Fast and cost-effective for simpler tasks"
                                isChecked={selectedExternalModels.has('gpt-3.5-turbo')}
                                onChange={(_event, checked) => {
                                  setSelectedExternalModels(prev => {
                                    const newSet = new Set(prev);
                                    if (checked) {
                                      newSet.add('gpt-3.5-turbo');
                                    } else {
                                      newSet.delete('gpt-3.5-turbo');
                                    }
                                    return newSet;
                                  });
                                }}
                              />
                            </>
                          )}
                          {externalProvider === 'Anthropic' && (
                            <>
                              <Checkbox
                                id="external-model-claude-3-opus"
                                label="Claude 3 Opus"
                                description="Most intelligent model for complex tasks"
                                isChecked={selectedExternalModels.has('claude-3-opus')}
                                onChange={(_event, checked) => {
                                  setSelectedExternalModels(prev => {
                                    const newSet = new Set(prev);
                                    if (checked) {
                                      newSet.add('claude-3-opus');
                                    } else {
                                      newSet.delete('claude-3-opus');
                                    }
                                    return newSet;
                                  });
                                }}
                                style={{ marginBottom: '0.5rem' }}
                              />
                              <Checkbox
                                id="external-model-claude-3-sonnet"
                                label="Claude 3 Sonnet"
                                description="Balanced performance and intelligence"
                                isChecked={selectedExternalModels.has('claude-3-sonnet')}
                                onChange={(_event, checked) => {
                                  setSelectedExternalModels(prev => {
                                    const newSet = new Set(prev);
                                    if (checked) {
                                      newSet.add('claude-3-sonnet');
                                    } else {
                                      newSet.delete('claude-3-sonnet');
                                    }
                                    return newSet;
                                  });
                                }}
                                style={{ marginBottom: '0.5rem' }}
                              />
                              <Checkbox
                                id="external-model-claude-3-haiku"
                                label="Claude 3 Haiku"
                                description="Fast and cost-effective for quick tasks"
                                isChecked={selectedExternalModels.has('claude-3-haiku')}
                                onChange={(_event, checked) => {
                                  setSelectedExternalModels(prev => {
                                    const newSet = new Set(prev);
                                    if (checked) {
                                      newSet.add('claude-3-haiku');
                                    } else {
                                      newSet.delete('claude-3-haiku');
                                    }
                                    return newSet;
                                  });
                                }}
                              />
                            </>
                          )}
                        </div>
                        <FormHelperText>
                          <HelperText>
                            <HelperTextItem>
                              Selected models will be added as AI assets and available for use.
                            </HelperTextItem>
                          </HelperText>
                        </FormHelperText>
                      </FormGroup>
                    )}
                  </>
                )}
              </>
            )}

            {assetType === 'MCP Server' && (
              <>
                <FormGroup 
                  label="MCP Server" 
                  fieldId="add-asset-mcp-server-select"
                  isRequired
                >
                  <Select
                    id="add-asset-mcp-server-select"
                    isOpen={isMcpServerOpen}
                    selected={mcpServer}
                    onSelect={(_event, value) => {
                      setMcpServer(value as string);
                      setIsMcpServerOpen(false);
                    }}
                    onOpenChange={(isOpen) => setIsMcpServerOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsMcpServerOpen(!isMcpServerOpen)}
                        isExpanded={isMcpServerOpen}
                        style={{ width: '100%' }}
                        id="add-asset-mcp-server-toggle"
                      >
                        {mcpServer || 'Select MCP server'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="MCP Server 1" id="add-asset-mcp-server-1">
                        MCP Server 1
                      </SelectOption>
                      <SelectOption value="MCP Server 2" id="add-asset-mcp-server-2">
                        MCP Server 2
                      </SelectOption>
                      <SelectOption value="MCP Server 3" id="add-asset-mcp-server-3">
                        MCP Server 3
                      </SelectOption>
                    </SelectList>
                  </Select>
                </FormGroup>

                <FormGroup 
                  label="Tools" 
                  fieldId="add-asset-tools-select"
                  isRequired
                >
                  <Select
                    id="add-asset-tools-select"
                    isOpen={isToolsOpen}
                    selected={tools}
                    onSelect={(_event, value) => {
                      setTools(value as string);
                      setIsToolsOpen(false);
                    }}
                    onOpenChange={(isOpen) => setIsToolsOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsToolsOpen(!isToolsOpen)}
                        isExpanded={isToolsOpen}
                        style={{ width: '100%' }}
                        id="add-asset-tools-toggle"
                      >
                        {tools || 'Select tools'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Tool 1" id="add-asset-tool-1">
                        Tool 1
                      </SelectOption>
                      <SelectOption value="Tool 2" id="add-asset-tool-2">
                        Tool 2
                      </SelectOption>
                      <SelectOption value="Tool 3" id="add-asset-tool-3">
                        Tool 3
                      </SelectOption>
                    </SelectList>
                  </Select>
                </FormGroup>
              </>
            )}

            <FormGroup 
              label="Description" 
              fieldId="add-asset-description-input"
              isRequired
            >
              <TextArea
                id="add-asset-description-input"
                value={assetDescription}
                onChange={(_event, value) => setAssetDescription(value)}
                placeholder="Provide details about the asset, relevant settings, quality of service details, contact information, etc."
                rows={4}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            key="add"
            variant="primary"
            onClick={handleAddAsset}
            isDisabled={!isAddAssetFormValid()}
            id="add-asset-submit-button"
          >
            Add AI asset
          </Button>
          <Button
            key="cancel"
            variant="link"
            onClick={handleCloseAddAssetModal}
            id="add-asset-cancel-button"
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

    </>
  );
};

export default AvailableAIAssets;
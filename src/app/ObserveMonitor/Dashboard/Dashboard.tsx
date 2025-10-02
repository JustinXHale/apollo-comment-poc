import * as React from 'react';
import { useMemo, useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Content,
  ContentVariants,
  Flex,
  FlexItem,
  Badge,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  TabContentBody,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { MultiTypeaheadSelect, MultiTypeaheadSelectOption } from '@patternfly/react-templates';
import { 
  Chart,
  ChartBar, 
  ChartLine, 
  ChartAxis, 
  ChartGroup, 
  ChartArea,
  ChartContainer,
  ChartThemeColor,
  ChartVoronoiContainer
} from '@patternfly/react-charts/victory';
import { TableIcon, KeyIcon, CubeIcon, CheckCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

// Mock data for the dashboard
const usageMetrics = {
  totalRequests: '13,733',
  errorRate: '2.12%',
  avgLatency: '127.8ms',
  totalCost: '540',
  totalToken: '249'
};

// Restructured data for better chart organization
const llmChatData = [
  { name: 'llm-7b-chat', x: 'User 1', y: 3 },
  { name: 'llm-7b-chat', x: 'User 2', y: 7 },
  { name: 'llm-7b-chat', x: 'User 3', y: 8 },
  { name: 'llm-7b-chat', x: 'User 4', y: 5 },
  { name: 'llm-7b-chat', x: 'User 5', y: 5 },
  { name: 'llm-7b-chat', x: 'User 6', y: 8 },
  { name: 'llm-7b-chat', x: 'User 7', y: 5 },
  { name: 'llm-7b-chat', x: 'User 8', y: 5 },
  { name: 'llm-7b-chat', x: 'User 9', y: 4 },
  { name: 'llm-7b-chat', x: 'User 10', y: 4 }
];

const mistralData = [
  { name: 'mistral-7b-instruct-v2', x: 'User 1', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 2', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 3', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 4', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 5', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 6', y: 2 },
  { name: 'mistral-7b-instruct-v2', x: 'User 7', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 8', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 9', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 10', y: 1 }
];

const stableDiffusionData = [
  { name: 'stable-diffusion-xl-beta', x: 'User 1', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 2', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 3', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 4', y: 1 },
  { name: 'stable-diffusion-xl-beta', x: 'User 5', y: 1 },
  { name: 'stable-diffusion-xl-beta', x: 'User 6', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 7', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 8', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 9', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 10', y: 0 }
];

const legendData = [
  { name: 'llm-7b-chat' }, 
  { name: 'mistral-7b-instruct-v2' }, 
  { name: 'stable-diffusion-xl-beta' }
];

// Model deployment table data
const modelDeploymentData = [
  {
    deployment: 'mistral-7b-instruct-v2',
    apiKey: 'Production API Key',
    apiKeyTag: 'MaaS',
    project: 'KonText PTE',
    runtime: 'vLLM',
    requests: '377962',
    latency: '199.56',
    errorRate: '3.98%',
    resources: 'GPU: V1 | CPU: 6/4',
    status: 'Running'
  },
  {
    deployment: 'stable-diffusion-xl-beta',
    apiKey: 'Dev API Key',
    apiKeyTag: 'MaaS',
    project: 'KonText PTE',
    runtime: 'KServer',
    requests: '377962',
    latency: '199.56',
    errorRate: '3.98%',
    resources: 'GPU: V1 | CPU: 7/3',
    status: 'Running'
  },
  {
    deployment: 'llama-70b-chat-v4',
    apiKey: 'Staging API Key',
    apiKeyTag: 'MaaS',
    project: 'KonText PTE',
    runtime: 'Bind',
    requests: '377962',
    latency: '199.56',
    errorRate: '3.98%',
    resources: 'GPU: 2/2 | CPU: 6/4',
    status: 'Scaling'
  },
  {
    deployment: 'mistral-7b-instruct-v2',
    apiKey: 'Test API Key',
    apiKeyTag: 'MaaS',
    project: 'KonText PTE',
    runtime: 'vLLM',
    requests: '377962',
    latency: '199.56',
    errorRate: '3.98%',
    resources: 'GPU: 2/2 | CPU: 6/7',
    status: 'Failed'
  },
  {
    deployment: 'mistral-7b-instruct-v2',
    apiKey: 'Analyst LLM API Key',
    apiKeyTag: 'MaaS',
    project: 'KonText PTE',
    runtime: 'vLLM',
    requests: '377962',
    latency: '199.56',
    errorRate: '3.98%',
    resources: 'GPU: 2/2 | CPU: 6/7',
    status: 'Degraded'
  }
];

// Line chart data for model metrics - organized by deployment
const modelMetricsData = {
  'mistral-7b-instruct-v2': {
    tokenThroughput: [
      { x: new Date('2024-10-01T00:00:00'), y: 180 },
      { x: new Date('2024-10-01T04:00:00'), y: 160 },
      { x: new Date('2024-10-01T08:00:00'), y: 140 },
      { x: new Date('2024-10-01T12:00:00'), y: 220 },
      { x: new Date('2024-10-01T16:00:00'), y: 260 },
      { x: new Date('2024-10-01T20:00:00'), y: 240 },
      { x: new Date('2024-10-02T00:00:00'), y: 200 }
    ],
    requestQueue: [
      { x: new Date('2024-10-01T00:00:00'), y: 5 },
      { x: new Date('2024-10-01T04:00:00'), y: 3 },
      { x: new Date('2024-10-01T08:00:00'), y: 2 },
      { x: new Date('2024-10-01T12:00:00'), y: 8 },
      { x: new Date('2024-10-01T16:00:00'), y: 12 },
      { x: new Date('2024-10-01T20:00:00'), y: 10 },
      { x: new Date('2024-10-02T00:00:00'), y: 6 }
    ],
    replicaCount: [
      { x: new Date('2024-10-01T00:00:00'), y: 2 },
      { x: new Date('2024-10-01T04:00:00'), y: 2 },
      { x: new Date('2024-10-01T08:00:00'), y: 1 },
      { x: new Date('2024-10-01T12:00:00'), y: 3 },
      { x: new Date('2024-10-01T16:00:00'), y: 4 },
      { x: new Date('2024-10-01T20:00:00'), y: 3 },
      { x: new Date('2024-10-02T00:00:00'), y: 3 }
    ],
    requestLatency: [
      { x: new Date('2024-10-01T00:00:00'), y: 180 },
      { x: new Date('2024-10-01T04:00:00'), y: 160 },
      { x: new Date('2024-10-01T08:00:00'), y: 140 },
      { x: new Date('2024-10-01T12:00:00'), y: 200 },
      { x: new Date('2024-10-01T16:00:00'), y: 240 },
      { x: new Date('2024-10-01T20:00:00'), y: 220 },
      { x: new Date('2024-10-02T00:00:00'), y: 190 }
    ]
  },
  'stable-diffusion-xl-beta': {
    tokenThroughput: [
      { x: new Date('2024-10-01T00:00:00'), y: 120 },
      { x: new Date('2024-10-01T04:00:00'), y: 110 },
      { x: new Date('2024-10-01T08:00:00'), y: 95 },
      { x: new Date('2024-10-01T12:00:00'), y: 140 },
      { x: new Date('2024-10-01T16:00:00'), y: 165 },
      { x: new Date('2024-10-01T20:00:00'), y: 155 },
      { x: new Date('2024-10-02T00:00:00'), y: 130 }
    ],
    requestQueue: [
      { x: new Date('2024-10-01T00:00:00'), y: 8 },
      { x: new Date('2024-10-01T04:00:00'), y: 6 },
      { x: new Date('2024-10-01T08:00:00'), y: 4 },
      { x: new Date('2024-10-01T12:00:00'), y: 12 },
      { x: new Date('2024-10-01T16:00:00'), y: 15 },
      { x: new Date('2024-10-01T20:00:00'), y: 13 },
      { x: new Date('2024-10-02T00:00:00'), y: 9 }
    ],
    replicaCount: [
      { x: new Date('2024-10-01T00:00:00'), y: 1 },
      { x: new Date('2024-10-01T04:00:00'), y: 1 },
      { x: new Date('2024-10-01T08:00:00'), y: 1 },
      { x: new Date('2024-10-01T12:00:00'), y: 2 },
      { x: new Date('2024-10-01T16:00:00'), y: 2 },
      { x: new Date('2024-10-01T20:00:00'), y: 2 },
      { x: new Date('2024-10-02T00:00:00'), y: 2 }
    ],
    requestLatency: [
      { x: new Date('2024-10-01T00:00:00'), y: 320 },
      { x: new Date('2024-10-01T04:00:00'), y: 290 },
      { x: new Date('2024-10-01T08:00:00'), y: 280 },
      { x: new Date('2024-10-01T12:00:00'), y: 340 },
      { x: new Date('2024-10-01T16:00:00'), y: 380 },
      { x: new Date('2024-10-01T20:00:00'), y: 365 },
      { x: new Date('2024-10-02T00:00:00'), y: 325 }
    ]
  },
  'llama-70b-chat-v4': {
    tokenThroughput: [
      { x: new Date('2024-10-01T00:00:00'), y: 220 },
      { x: new Date('2024-10-01T04:00:00'), y: 200 },
      { x: new Date('2024-10-01T08:00:00'), y: 185 },
      { x: new Date('2024-10-01T12:00:00'), y: 280 },
      { x: new Date('2024-10-01T16:00:00'), y: 320 },
      { x: new Date('2024-10-01T20:00:00'), y: 305 },
      { x: new Date('2024-10-02T00:00:00'), y: 260 }
    ],
    requestQueue: [
      { x: new Date('2024-10-01T00:00:00'), y: 3 },
      { x: new Date('2024-10-01T04:00:00'), y: 2 },
      { x: new Date('2024-10-01T08:00:00'), y: 1 },
      { x: new Date('2024-10-01T12:00:00'), y: 6 },
      { x: new Date('2024-10-01T16:00:00'), y: 9 },
      { x: new Date('2024-10-01T20:00:00'), y: 7 },
      { x: new Date('2024-10-02T00:00:00'), y: 4 }
    ],
    replicaCount: [
      { x: new Date('2024-10-01T00:00:00'), y: 3 },
      { x: new Date('2024-10-01T04:00:00'), y: 3 },
      { x: new Date('2024-10-01T08:00:00'), y: 2 },
      { x: new Date('2024-10-01T12:00:00'), y: 4 },
      { x: new Date('2024-10-01T16:00:00'), y: 5 },
      { x: new Date('2024-10-01T20:00:00'), y: 4 },
      { x: new Date('2024-10-02T00:00:00'), y: 4 }
    ],
    requestLatency: [
      { x: new Date('2024-10-01T00:00:00'), y: 140 },
      { x: new Date('2024-10-01T04:00:00'), y: 125 },
      { x: new Date('2024-10-01T08:00:00'), y: 115 },
      { x: new Date('2024-10-01T12:00:00'), y: 165 },
      { x: new Date('2024-10-01T16:00:00'), y: 195 },
      { x: new Date('2024-10-01T20:00:00'), y: 180 },
      { x: new Date('2024-10-02T00:00:00'), y: 155 }
    ]
  }
};

// Options for Multi-select dropdowns
const ApiKeyOptions = [
  { content: 'Production API Key', value: 'production' },
  { content: 'Dev API Key', value: 'dev' },
  { content: 'Staging API Key', value: 'staging' },
  { content: 'Test API Key', value: 'test' },
  { content: 'Analyst LLM API Key', value: 'analyst' }
];

const ModelOptions = [
  { content: 'mistral-7b-instruct-v2 (Production)', value: 'mistral-prod' },
  { content: 'stable-diffusion-xl-beta (Dev)', value: 'stable-dev' },
  { content: 'llama-70b-chat-v4 (Staging)', value: 'llama-staging' },
  { content: 'mistral-7b-instruct-v2 (Test)', value: 'mistral-test' },
  { content: 'mistral-7b-instruct-v2 (Analyst)', value: 'mistral-analyst' }
];

type SelectionsType = (string | number)[];

const usageTrendsData = {
  'llm-7b-chat': [
    { x: new Date('2024-06-01'), y: 0 },
    { x: new Date('2024-07-01'), y: 2 },
    { x: new Date('2024-08-01'), y: 7 },
    { x: new Date('2024-09-01'), y: 1 },
    { x: new Date('2024-10-01'), y: 6 },
    { x: new Date('2024-11-01'), y: 4 },
    { x: new Date('2024-12-01'), y: 9 },
    { x: new Date('2025-01-01'), y: 7 }
  ],
  'mistral-7b-instruct-v2': [
    { x: new Date('2024-06-01'), y: 0 },
    { x: new Date('2024-07-01'), y: 1 },
    { x: new Date('2024-08-01'), y: 6 },
    { x: new Date('2024-09-01'), y: 4 },
    { x: new Date('2024-10-01'), y: 6 },
    { x: new Date('2024-11-01'), y: 3 },
    { x: new Date('2024-12-01'), y: 4 },
    { x: new Date('2025-01-01'), y: 3 }
  ],
  'stable-diffusion-xl-beta': [
    { x: new Date('2024-06-01'), y: 0 },
    { x: new Date('2024-07-01'), y: 0.5 },
    { x: new Date('2024-08-01'), y: 4 },
    { x: new Date('2024-09-01'), y: 2 },
    { x: new Date('2024-10-01'), y: 4 },
    { x: new Date('2024-11-01'), y: 1 },
    { x: new Date('2024-12-01'), y: 2 },
    { x: new Date('2025-01-01'), y: 4 }
  ]
};

const Dashboard: React.FunctionComponent = () => {
  const [groupByOpen, setGroupByOpen] = React.useState(false);
  const [metricsOpen, setMetricsOpen] = React.useState(false);
  const [trendsOpen, setTrendsOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState('Models');
  
  // Multi-select states
  const [selectedApiKeys, setSelectedApiKeys] = useState<SelectionsType>(['production', 'dev', 'staging', 'test', 'analyst']);
  const [selectedModels, setSelectedModels] = useState<SelectionsType>(['mistral-prod', 'stable-dev', 'llama-staging', 'mistral-test', 'mistral-analyst']);

  // Initialize options with selected state
  const initialApiKeyOptions = useMemo<MultiTypeaheadSelectOption[]>(
    () => ApiKeyOptions.map((option) => ({ ...option, selected: selectedApiKeys.includes(option.value) })),
    [selectedApiKeys]
  );

  const initialModelOptions = useMemo<MultiTypeaheadSelectOption[]>(
    () => ModelOptions.map((option) => ({ ...option, selected: selectedModels.includes(option.value) })),
    [selectedModels]
  );

  // Create mapping objects for filtering
  const apiKeyValueToName = useMemo(() => {
    const mapping: { [key: string]: string } = {};
    ApiKeyOptions.forEach(option => {
      mapping[option.value] = option.content;
    });
    return mapping;
  }, []);

  const modelValueToDeployment = useMemo(() => {
    const mapping: { [key: string]: { deployment: string, apiKey: string } } = {};
    ModelOptions.forEach(option => {
      // Extract deployment name and API key from content like "mistral-7b-instruct-v2 (Production)"
      const match = option.content.match(/^(.+?)\s*\((.+)\)$/);
      if (match) {
        const deployment = match[1].trim();
        const apiKeyType = match[2].trim();
        mapping[option.value] = { 
          deployment, 
          apiKey: `${apiKeyType} API Key` 
        };
      }
    });
    return mapping;
  }, []);

  // Filter table data based on selections
  const filteredModelData = useMemo(() => {
    return modelDeploymentData.filter(model => {
      // Check if API key matches selection
      const apiKeyMatches = selectedApiKeys.some(selectedKey => 
        apiKeyValueToName[selectedKey as string] === model.apiKey
      );

      // Check if model deployment matches selection  
      const modelMatches = selectedModels.some(selectedModel => {
        const modelInfo = modelValueToDeployment[selectedModel as string];
        return modelInfo && 
               modelInfo.deployment === model.deployment && 
               modelInfo.apiKey === model.apiKey;
      });

      return apiKeyMatches && modelMatches;
    });
  }, [selectedApiKeys, selectedModels, apiKeyValueToName, modelValueToDeployment]);

  // Filter and aggregate chart data based on selections
  const filteredTokenThroughputData = useMemo(() => {
    const selectedDeployments = filteredModelData.map(model => model.deployment);
    
    // Aggregate data from all selected deployments
    const aggregatedData: { [key: string]: number } = {};
    
    selectedDeployments.forEach(deployment => {
      if (modelMetricsData[deployment]) {
        modelMetricsData[deployment].tokenThroughput.forEach(point => {
          const timeKey = point.x.getTime().toString();
          aggregatedData[timeKey] = (aggregatedData[timeKey] || 0) + point.y;
        });
      }
    });

    // Convert back to chart format
    return Object.entries(aggregatedData).map(([timeKey, value]) => ({
      x: new Date(parseInt(timeKey)),
      y: value
    })).sort((a, b) => a.x.getTime() - b.x.getTime());
  }, [filteredModelData]);

  const filteredRequestQueueData = useMemo(() => {
    const selectedDeployments = filteredModelData.map(model => model.deployment);
    
    const aggregatedData: { [key: string]: number } = {};
    
    selectedDeployments.forEach(deployment => {
      if (modelMetricsData[deployment]) {
        modelMetricsData[deployment].requestQueue.forEach(point => {
          const timeKey = point.x.getTime().toString();
          aggregatedData[timeKey] = (aggregatedData[timeKey] || 0) + point.y;
        });
      }
    });

    return Object.entries(aggregatedData).map(([timeKey, value]) => ({
      x: new Date(parseInt(timeKey)),
      y: value
    })).sort((a, b) => a.x.getTime() - b.x.getTime());
  }, [filteredModelData]);

  const filteredReplicaCountData = useMemo(() => {
    const selectedDeployments = filteredModelData.map(model => model.deployment);
    
    const aggregatedData: { [key: string]: number } = {};
    
    selectedDeployments.forEach(deployment => {
      if (modelMetricsData[deployment]) {
        modelMetricsData[deployment].replicaCount.forEach(point => {
          const timeKey = point.x.getTime().toString();
          aggregatedData[timeKey] = (aggregatedData[timeKey] || 0) + point.y;
        });
      }
    });

    return Object.entries(aggregatedData).map(([timeKey, value]) => ({
      x: new Date(parseInt(timeKey)),
      y: value
    })).sort((a, b) => a.x.getTime() - b.x.getTime());
  }, [filteredModelData]);

  const filteredRequestLatencyData = useMemo(() => {
    const selectedDeployments = filteredModelData.map(model => model.deployment);
    
    if (selectedDeployments.length === 0) return [];
    
    const aggregatedData: { [key: string]: { total: number, count: number } } = {};
    
    selectedDeployments.forEach(deployment => {
      if (modelMetricsData[deployment]) {
        modelMetricsData[deployment].requestLatency.forEach(point => {
          const timeKey = point.x.getTime().toString();
          if (!aggregatedData[timeKey]) {
            aggregatedData[timeKey] = { total: 0, count: 0 };
          }
          aggregatedData[timeKey].total += point.y;
          aggregatedData[timeKey].count += 1;
        });
      }
    });

    // Calculate average latency for each time point
    return Object.entries(aggregatedData).map(([timeKey, { total, count }]) => ({
      x: new Date(parseInt(timeKey)),
      y: Math.round(total / count)
    })).sort((a, b) => a.x.getTime() - b.x.getTime());
  }, [filteredModelData]);

  const getStatusBadge = (status: string) => {
    const baseStyle = {
      borderRadius: '16px',
      padding: '2px 8px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      fontWeight: '500',
      minHeight: '20px'
    };

    switch (status) {
      case 'Running':
        return (
          <span style={{ 
            ...baseStyle, 
            backgroundColor: '#3e8635', 
            color: '#ffffff',
            border: '1px solid #3e8635'
          }}>
            <CheckCircleIcon size={16} />
            Running
          </span>
        );
      case 'Scaling':
        return (
          <span style={{ 
            ...baseStyle, 
            backgroundColor: '#f0ad00', 
            color: '#151515',
            border: '1px solid #f0ad00'
          }}>
            <ExclamationTriangleIcon size={16} />
            Scaling
          </span>
        );
      case 'Failed':
        return (
          <span style={{ 
            ...baseStyle, 
            backgroundColor: '#c9190b', 
            color: '#ffffff',
            border: '1px solid #c9190b'
          }}>
            <ExclamationCircleIcon size={16} />
            Failed
          </span>
        );
      case 'Degraded':
        return (
          <span style={{ 
            ...baseStyle, 
            backgroundColor: '#c9190b', 
            color: '#ffffff',
            border: '1px solid #c9190b'
          }}>
            <ExclamationCircleIcon size={16} />
            Degraded
          </span>
        );
      default:
        return (
          <span style={{ 
            ...baseStyle, 
            backgroundColor: '#6a6e73', 
            color: '#ffffff',
            border: '1px solid #6a6e73'
          }}>
            {status}
          </span>
        );
    }
  };

  const onGroupByToggle = () => {
    setGroupByOpen(!groupByOpen);
  };

  const onMetricsToggle = () => {
    setMetricsOpen(!metricsOpen);
  };

  const onTrendsToggle = () => {
    setTrendsOpen(!trendsOpen);
  };

  return (
    <PageSection hasBodyWrapper={false}>
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
        {/* Header */}
        <FlexItem>
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
            <FlexItem>
              <Title headingLevel="h1" size="2xl">Observe &amp; monitor</Title>
            </FlexItem>
            <FlexItem>
              <Badge>Dashboard</Badge>
            </FlexItem>
          </Flex>
          <Content component={ContentVariants.p}>
            Monitor the health and performance of your AI workloads and infrastructure
          </Content>
        </FlexItem>

            {/* Tab Navigation */}
            <FlexItem>
              <Tabs
                activeKey={selectedTab}
                onSelect={(_event, eventKey) => setSelectedTab(eventKey as string)}
                aria-label="Dashboard view tabs"
              >
                <Tab
                  eventKey="Cluster"
                  title={<TabTitleText>Cluster</TabTitleText>}
                  aria-label="Cluster tab"
                />
                <Tab
                  eventKey="Models"
                  title={<TabTitleText>Models</TabTitleText>}
                  aria-label="Models tab"
                />
                <Tab
                  eventKey="Usage (MaaS)"
                  title={<TabTitleText>Usage (MaaS)</TabTitleText>}
                  aria-label="Usage MaaS tab"
                />
                <Tab
                  eventKey="Traces"
                  title={<TabTitleText>Traces</TabTitleText>}
                  aria-label="Traces tab"
                />
              </Tabs>
            </FlexItem>


        {/* Tab Content */}
        {selectedTab === 'Cluster' && (
          <FlexItem>
            <Card>
              <CardTitle>
                <Title headingLevel="h3" size="lg">Cluster Overview</Title>
              </CardTitle>
              <CardBody>
                <Content component={ContentVariants.p}>
                  This cluster monitoring functionality is out of scope. This section would typically show cluster-wide metrics, node health, resource utilization across the cluster, and infrastructure monitoring data.
                </Content>
              </CardBody>
            </Card>
          </FlexItem>
        )}

        {selectedTab === 'Models' && (
          <>
            {/* Model Inventory */}
            <FlexItem>
              <Card>
                <CardTitle>
                  <Title headingLevel="h3" size="lg">Model inventory</Title>
                </CardTitle>
                <CardBody>
                  <Content component={ContentVariants.p} style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                    View real-time performance metrics and monitor the health of your selected models.
                  </Content>
                  
                  {/* API Key and Model Selection */}
                  <Flex spaceItems={{ default: 'spaceItemsLg' }} style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                    <FlexItem>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Content component={ContentVariants.small}>Select API Key(s):</Content>
                        </FlexItem>
                        <FlexItem>
                          <MultiTypeaheadSelect
                            initialOptions={initialApiKeyOptions}
                            placeholder={selectedApiKeys.length === 0 ? "Select API Keys" : `${selectedApiKeys.length} selected`}
                            noOptionsFoundMessage={(filter) => `No API key was found for "${filter}"`}
                            onSelectionChange={(_ev, selections) => setSelectedApiKeys(selections)}
                          />
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Content component={ContentVariants.small}>Select model(s):</Content>
                        </FlexItem>
                        <FlexItem>
                          <MultiTypeaheadSelect
                            initialOptions={initialModelOptions}
                            placeholder={selectedModels.length === 0 ? "Select Models" : `${selectedModels.length} selected`}
                            noOptionsFoundMessage={(filter) => `No model was found for "${filter}"`}
                            onSelectionChange={(_ev, selections) => setSelectedModels(selections)}
                          />
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>

                  {/* Results Count */}
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                    <FlexItem>
                      <Content component={ContentVariants.small}>
                        Showing {filteredModelData.length} of {modelDeploymentData.length} deployments
                      </Content>
                    </FlexItem>
                  </Flex>

                  {/* Model Deployment Table */}
                  <Table aria-label="Model deployments table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th>Model deployment</Th>
                        <Th>API key</Th>
                        <Th>Project</Th>
                        <Th>Runtime</Th>
                        <Th>Total requests</Th>
                        <Th>Avg. Latency (ms)</Th>
                        <Th>Error rate</Th>
                        <Th>Resources</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredModelData.length === 0 ? (
                        <Tr>
                          <Td colSpan={9} style={{ textAlign: 'center', padding: 'var(--pf-t--global--spacer--lg)' }}>
                            <Content component={ContentVariants.p}>
                              No deployments match your current selection. Try adjusting your API key or model filters.
                            </Content>
                          </Td>
                        </Tr>
                      ) : (
                        filteredModelData.map((model, index) => (
                          <Tr key={index}>
                            <Td>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Button variant="link" style={{ padding: 0, fontSize: '14px', textAlign: 'left', fontWeight: 'normal' }}>
                                    {model.deployment}
                                  </Button>
                                </FlexItem>
                                <FlexItem>
                                  <Badge style={{ backgroundColor: '#f0ad00', color: '#ffffff', fontSize: '12px', padding: '2px 8px', minHeight: '20px' }}>{model.apiKeyTag}</Badge>
                                </FlexItem>
                              </Flex>
                            </Td>
                            <Td>
                              <Button variant="link" style={{ padding: 0, fontSize: '14px', textAlign: 'left', fontWeight: 'normal' }}>
                                {model.apiKey}
                              </Button>
                            </Td>
                            <Td>{model.project}</Td>
                            <Td>{model.runtime}</Td>
                            <Td>{model.requests}</Td>
                            <Td>{model.latency}</Td>
                            <Td>{model.errorRate}</Td>
                            <Td>{model.resources}</Td>
                            <Td>
                              {getStatusBadge(model.status)}
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </FlexItem>

            {/* Performance Charts */}
            <FlexItem>
              <Grid hasGutter>
                {/* Token throughput chart */}
                <GridItem span={6}>
                  <Card isFullHeight>
                    <CardTitle>
                      <Title headingLevel="h4" size="md">Token throughput</Title>
                    </CardTitle>
                    <CardBody>
                      {filteredTokenThroughputData.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                          <Content component={ContentVariants.p}>
                            No data available for current selection
                          </Content>
                        </div>
                      ) : (
                        <div style={{ height: '200px', width: '100%' }}>
                          <Chart
                            ariaDesc="Token throughput over time"
                            ariaTitle="Token throughput line chart"
                            containerComponent={
                              <ChartVoronoiContainer 
                                labels={({ datum }) => `${new Date(datum.x).toLocaleTimeString()}: ${datum.y}`} 
                                constrainToVisibleArea 
                              />
                            }
                            height={200}
                            padding={{
                              bottom: 40,
                              left: 50,
                              right: 50,
                              top: 20
                            }}
                            themeColor={ChartThemeColor.blue}
                          >
                            <ChartAxis dependentAxis showGrid />
                            <ChartAxis 
                              tickFormat={(x) => new Date(x).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                hour12: true 
                              })}
                            />
                            <ChartLine
                              data={filteredTokenThroughputData}
                              interpolation="monotoneX"
                            />
                          </Chart>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </GridItem>

                {/* Request queue length chart */}
                <GridItem span={6}>
                  <Card isFullHeight>
                    <CardTitle>
                      <Title headingLevel="h4" size="md">Request queue length</Title>
                    </CardTitle>
                    <CardBody>
                      {filteredRequestQueueData.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                          <Content component={ContentVariants.p}>
                            No data available for current selection
                          </Content>
                        </div>
                      ) : (
                        <div style={{ height: '200px', width: '100%' }}>
                          <Chart
                            ariaDesc="Request queue length over time"
                            ariaTitle="Request queue length line chart"
                            containerComponent={
                              <ChartVoronoiContainer 
                                labels={({ datum }) => `${new Date(datum.x).toLocaleTimeString()}: ${datum.y}`} 
                                constrainToVisibleArea 
                              />
                            }
                            height={200}
                            padding={{
                              bottom: 40,
                              left: 50,
                              right: 50,
                              top: 20
                            }}
                            themeColor={ChartThemeColor.orange}
                          >
                            <ChartAxis dependentAxis showGrid />
                            <ChartAxis 
                              tickFormat={(x) => new Date(x).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                hour12: true 
                              })}
                            />
                            <ChartLine
                              data={filteredRequestQueueData}
                              interpolation="monotoneX"
                            />
                          </Chart>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </GridItem>

                {/* Replica count chart */}
                <GridItem span={6}>
                  <Card isFullHeight>
                    <CardTitle>
                      <Title headingLevel="h4" size="md">Replica count</Title>
                    </CardTitle>
                    <CardBody>
                      {filteredReplicaCountData.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                          <Content component={ContentVariants.p}>
                            No data available for current selection
                          </Content>
                        </div>
                      ) : (
                        <div style={{ height: '200px', width: '100%' }}>
                          <Chart
                            ariaDesc="Replica count over time"
                            ariaTitle="Replica count line chart"
                            containerComponent={
                              <ChartVoronoiContainer 
                                labels={({ datum }) => `${new Date(datum.x).toLocaleTimeString()}: ${datum.y}`} 
                                constrainToVisibleArea 
                              />
                            }
                            height={200}
                            padding={{
                              bottom: 40,
                              left: 50,
                              right: 50,
                              top: 20
                            }}
                            themeColor={ChartThemeColor.green}
                          >
                            <ChartAxis dependentAxis showGrid />
                            <ChartAxis 
                              tickFormat={(x) => new Date(x).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                hour12: true 
                              })}
                            />
                            <ChartLine
                              data={filteredReplicaCountData}
                              interpolation="monotoneX"
                            />
                          </Chart>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </GridItem>

                {/* Request latency chart */}
                <GridItem span={6}>
                  <Card isFullHeight>
                    <CardTitle>
                      <Title headingLevel="h4" size="md">Request latency</Title>
                    </CardTitle>
                    <CardBody>
                      {filteredRequestLatencyData.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                          <Content component={ContentVariants.p}>
                            No data available for current selection
                          </Content>
                        </div>
                      ) : (
                        <div style={{ height: '200px', width: '100%' }}>
                          <Chart
                            ariaDesc="Request latency over time"
                            ariaTitle="Request latency line chart"
                            containerComponent={
                              <ChartVoronoiContainer 
                                labels={({ datum }) => `${new Date(datum.x).toLocaleTimeString()}: ${datum.y} ms`} 
                                constrainToVisibleArea 
                              />
                            }
                            height={200}
                            padding={{
                              bottom: 40,
                              left: 50,
                              right: 50,
                              top: 20
                            }}
                            themeColor={ChartThemeColor.purple}
                          >
                            <ChartAxis dependentAxis showGrid tickFormat={(x) => `${x} ms`} />
                            <ChartAxis 
                              tickFormat={(x) => new Date(x).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                hour12: true 
                              })}
                            />
                            <ChartLine
                              data={filteredRequestLatencyData}
                              interpolation="monotoneX"
                            />
                          </Chart>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </FlexItem>
          </>
        )}

        {selectedTab === 'Usage (MaaS)' && (
          <>
            {/* Usage Metrics */}
            <FlexItem>
              <Card>
                <CardTitle>
                  <Title headingLevel="h3" size="lg">Usage</Title>
                </CardTitle>
                <CardBody>
              <Grid hasGutter>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Content component={ContentVariants.small}>Total requests</Content>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.totalRequests}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Content component={ContentVariants.small}>Error Rate</Content>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.errorRate}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={3}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Content component={ContentVariants.small}>Avg. Latency</Content>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.avgLatency}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Content component={ContentVariants.small}>Total Cost</Content>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.totalCost}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={3}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Content component={ContentVariants.small}>Total Token</Content>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.totalToken}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        </FlexItem>

        {/* Charts Section - Side by Side */}
        <FlexItem>
          <Grid hasGutter>
            {/* Usage per Group Chart */}
            <GridItem span={6}>
              <Card isFullHeight>
                <CardTitle>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h3" size="lg">Usage per Group</Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Dropdown
                            onSelect={() => setGroupByOpen(false)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle ref={toggleRef} onClick={onGroupByToggle} isExpanded={groupByOpen}>
                                Group by: Users
                              </MenuToggle>
                            )}
                            isOpen={groupByOpen}
                          >
                            <DropdownList>
                              <DropdownItem value="users">Users</DropdownItem>
                              <DropdownItem value="models">Models</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </FlexItem>
                        <FlexItem>
                          <Dropdown
                            onSelect={() => setMetricsOpen(false)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle ref={toggleRef} onClick={onMetricsToggle} isExpanded={metricsOpen}>
                                Metrics: Tokens
                              </MenuToggle>
                            )}
                            isOpen={metricsOpen}
                          >
                            <DropdownList>
                              <DropdownItem value="tokens">Tokens</DropdownItem>
                              <DropdownItem value="requests">Requests</DropdownItem>
                              <DropdownItem value="cost">Cost</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Table view">
                            <TableIcon />
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="primary" aria-label="Export">
                            Export
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardTitle>
                <CardBody>
                  <div style={{ height: '400px', width: '100%' }}>
                    <Chart
                      ariaDesc="Average usage per user group"
                      ariaTitle="Usage per group bar chart"
                      containerComponent={
                        <ChartVoronoiContainer 
                          labels={({ datum }) => `${datum.name}: ${datum.y}`} 
                          constrainToVisibleArea 
                        />
                      }
                      domain={{ y: [0, 10] }}
                      domainPadding={{ x: [30, 25] }}
                      legendData={legendData}
                      legendOrientation="vertical"
                      legendPosition="right"
                      height={400}
                      padding={{
                        bottom: 50,
                        left: 50,
                        right: 160, // Adjusted for smaller width
                        top: 50
                      }}
                      themeColor={ChartThemeColor.multi}
                    >
                      <ChartAxis />
                      <ChartAxis dependentAxis showGrid />
                      <ChartGroup offset={11}>
                        <ChartBar data={llmChatData} />
                        <ChartBar data={mistralData} />
                        <ChartBar data={stableDiffusionData} />
                      </ChartGroup>
                    </Chart>
                  </div>
                </CardBody>
              </Card>
            </GridItem>

            {/* Usage Trends Chart */}
            <GridItem span={6}>
              <Card isFullHeight>
                <CardTitle>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h3" size="lg">Usage Trends</Title>
                    </FlexItem>
                    <FlexItem>
                      <Dropdown
                        onSelect={() => setTrendsOpen(false)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle ref={toggleRef} onClick={onTrendsToggle} isExpanded={trendsOpen}>
                            Last 6 months
                          </MenuToggle>
                        )}
                        isOpen={trendsOpen}
                      >
                        <DropdownList>
                          <DropdownItem value="6months">Last 6 months</DropdownItem>
                          <DropdownItem value="3months">Last 3 months</DropdownItem>
                          <DropdownItem value="1month">Last month</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </FlexItem>
                  </Flex>
                </CardTitle>
                <CardBody>
                  <div style={{ height: '400px', width: '100%' }}>
                    <Chart
                      ariaDesc="Usage trends over time"
                      ariaTitle="Model usage trends line chart"
                      containerComponent={
                        <ChartVoronoiContainer 
                          labels={({ datum }) => `${new Date(datum.x).toLocaleDateString()}: ${datum.y}`} 
                          constrainToVisibleArea 
                        />
                      }
                      domain={{ y: [0, 10] }}
                      legendData={legendData}
                      legendOrientation="vertical"
                      legendPosition="right"
                      height={400}
                      padding={{
                        bottom: 50,
                        left: 50,
                        right: 160, // Adjusted for smaller width
                        top: 50
                      }}
                      themeColor={ChartThemeColor.multi}
                    >
                      <ChartAxis dependentAxis showGrid tickFormat={(x) => `${x}`} />
                      <ChartAxis 
                        tickFormat={(x) => new Date(x).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <ChartArea
                        data={usageTrendsData['llm-7b-chat']}
                        interpolation="monotoneX"
                      />
                      <ChartLine
                        data={usageTrendsData['mistral-7b-instruct-v2']}
                        interpolation="monotoneX"
                      />
                      <ChartLine
                        data={usageTrendsData['stable-diffusion-xl-beta']}
                        interpolation="monotoneX"
                      />
                    </Chart>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </FlexItem>
        </>
        )}

        {selectedTab === 'Traces' && (
          <FlexItem>
            <Card>
              <CardTitle>
                <Title headingLevel="h3" size="lg">Traces & Logs</Title>
              </CardTitle>
              <CardBody>
    <Content component={ContentVariants.p}>
                  This trace analytics functionality is out of scope. This section would show distributed tracing data, request flows, service dependencies, and performance bottleneck analysis.
    </Content>
              </CardBody>
            </Card>
          </FlexItem>
        )}
      </Flex>
  </PageSection>
);
};

export { Dashboard };

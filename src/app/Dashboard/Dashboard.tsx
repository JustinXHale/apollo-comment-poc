import * as React from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants,
  Flex,
  FlexItem,
  Badge,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { 
  Chart,
  ChartBar, 
  ChartLine, 
  ChartAxis, 
  ChartGroup, 
  ChartArea,
  ChartContainer,
  ChartThemeColor
} from '@patternfly/react-charts/victory';
import { TableIcon } from '@patternfly/react-icons';

// Mock data for the dashboard
const overviewMetrics = {
  activeNodes: 8,
  activeModels: 4,
  cpuCores: 24,
  activeGPUs: 2,
  memory: '132 GB',
  networkRxTx: '12.5 MB/s'
};

const usageMetrics = {
  totalRequests: '13,733',
  errorRate: '2.12%',
  avgLatency: '127.8ms',
  totalCost: '540',
  totalToken: '249'
};

const usagePerGroupData = [
  { name: 'User 1', 'llm-7b-chat': 3, 'mistral-7b-instruct-v2': 1, 'stable-diffusion-xl-beta': 0 },
  { name: 'User 2', 'llm-7b-chat': 7, 'mistral-7b-instruct-v2': 1, 'stable-diffusion-xl-beta': 0 },
  { name: 'User 3', 'llm-7b-chat': 8, 'mistral-7b-instruct-v2': 1, 'stable-diffusion-xl-beta': 0 },
  { name: 'User 4', 'llm-7b-chat': 5, 'mistral-7b-instruct-v2': 1, 'stable-diffusion-xl-beta': 1 },
  { name: 'User 5', 'llm-7b-chat': 5, 'mistral-7b-instruct-v2': 1, 'stable-diffusion-xl-beta': 1 },
  { name: 'User 6', 'llm-7b-chat': 8, 'mistral-7b-instruct-v2': 2, 'stable-diffusion-xl-beta': 0 },
  { name: 'User 7', 'llm-7b-chat': 5, 'mistral-7b-instruct-v2': 1, 'stable-diffusion-xl-beta': 0 },
  { name: 'User 8', 'llm-7b-chat': 5, 'mistral-7b-instruct-v2': 1, 'stable-diffusion-xl-beta': 0 },
  { name: 'User 9', 'llm-7b-chat': 4, 'mistral-7b-instruct-v2': 1, 'stable-diffusion-xl-beta': 0 },
  { name: 'User 10', 'llm-7b-chat': 4, 'mistral-7b-instruct-v2': 1, 'stable-diffusion-xl-beta': 0 }
];

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
  const [selectedTab, setSelectedTab] = React.useState('Usage (MaaS)');

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
          <TextContent>
            <Text component={TextVariants.p}>
              Monitor the health and performance of your AI workloads and infrastructure
            </Text>
          </TextContent>
        </FlexItem>

        {/* Overview Section */}
        <FlexItem>
          <Card>
            <CardTitle>
              <Title headingLevel="h2" size="lg">Overview</Title>
            </CardTitle>
            <CardBody>
              <Grid hasGutter>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Text component={TextVariants.small}>Active nodes</Text>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h3" size="xl">{overviewMetrics.activeNodes}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Text component={TextVariants.small}>Active models</Text>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h3" size="xl">{overviewMetrics.activeModels}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Text component={TextVariants.small}>CPU cores</Text>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h3" size="xl">{overviewMetrics.cpuCores}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Text component={TextVariants.small}>Active GPUs</Text>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h3" size="xl">{overviewMetrics.activeGPUs}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Text component={TextVariants.small}>Memory</Text>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h3" size="xl">{overviewMetrics.memory}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Text component={TextVariants.small}>Network Rx/Tx</Text>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h3" size="xl">{overviewMetrics.networkRxTx}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
              </Grid>
              
              {/* Tab Navigation */}
              <div style={{ marginTop: '24px', borderBottom: '1px solid var(--pf-v5-global--BorderColor--100)' }}>
                <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                  <FlexItem>
                    <Button 
                      variant="plain" 
                      style={{ 
                        borderBottom: selectedTab === 'Cluster view' ? '2px solid var(--pf-v5-global--primary-color--100)' : 'none',
                        padding: '8px 0'
                      }}
                      onClick={() => setSelectedTab('Cluster view')}
                    >
                      Cluster view
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button 
                      variant="plain"
                      style={{ 
                        borderBottom: selectedTab === 'Model view' ? '2px solid var(--pf-v5-global--primary-color--100)' : 'none',
                        padding: '8px 0'
                      }}
                      onClick={() => setSelectedTab('Model view')}
                    >
                      Model view
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button 
                      variant="plain"
                      style={{ 
                        borderBottom: selectedTab === 'Usage (MaaS)' ? '2px solid var(--pf-v5-global--primary-color--100)' : 'none',
                        padding: '8px 0',
                        color: selectedTab === 'Usage (MaaS)' ? 'var(--pf-v5-global--primary-color--100)' : undefined
                      }}
                      onClick={() => setSelectedTab('Usage (MaaS)')}
                    >
                      Usage (MaaS)
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button 
                      variant="plain"
                      style={{ 
                        borderBottom: selectedTab === 'Traces' ? '2px solid var(--pf-v5-global--primary-color--100)' : 'none',
                        padding: '8px 0'
                      }}
                      onClick={() => setSelectedTab('Traces')}
                    >
                      Traces
                    </Button>
                  </FlexItem>
                </Flex>
              </div>
            </CardBody>
          </Card>
        </FlexItem>

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
                      <Text component={TextVariants.small}>Total requests</Text>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.totalRequests}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Text component={TextVariants.small}>Error Rate</Text>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.errorRate}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={3}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Text component={TextVariants.small}>Avg. Latency</Text>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.avgLatency}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Text component={TextVariants.small}>Total Cost</Text>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.totalCost}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={3}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Text component={TextVariants.small}>Total Token</Text>
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

        {/* Usage per Group Chart */}
        <FlexItem>
          <Card>
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
              <div style={{ height: '400px' }}>
                <Chart
                  ariaDesc="Usage per group bar chart"
                  ariaTitle="Usage distribution by user groups"
                  containerComponent={<ChartContainer responsive={true} />}
                  height={400}
                  padding={{ left: 80, top: 20, right: 50, bottom: 80 }}
                  themeColor={ChartThemeColor.multi}
                >
                  <ChartAxis dependentAxis />
                  <ChartAxis />
                  <ChartBar
                    data={usagePerGroupData.map(d => ({ x: d.name, y: d['llm-7b-chat'] }))}
                    barWidth={15}
                    style={{ data: { fill: 'var(--pf-t--chart--color--blue--300)' } }}
                  />
                  <ChartBar
                    data={usagePerGroupData.map(d => ({ x: d.name, y: d['mistral-7b-instruct-v2'] }))}
                    barWidth={15}
                    style={{ data: { fill: 'var(--pf-t--chart--color--teal--300)' } }}
                  />
                  <ChartBar
                    data={usagePerGroupData.map(d => ({ x: d.name, y: d['stable-diffusion-xl-beta'] }))}
                    barWidth={15}
                    style={{ data: { fill: 'var(--pf-t--chart--color--orange--300)' } }}
                  />
                </Chart>
              </div>
              <Flex spaceItems={{ default: 'spaceItemsSm' }} style={{ marginTop: '16px' }}>
                <FlexItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                    <FlexItem>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: 'var(--pf-t--chart--color--blue--300)', 
                        borderRadius: '2px' 
                      }}></div>
                    </FlexItem>
                    <FlexItem>
                      <Text component={TextVariants.small}>llm-7b-chat</Text>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                    <FlexItem>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: 'var(--pf-t--chart--color--teal--300)', 
                        borderRadius: '2px' 
                      }}></div>
                    </FlexItem>
                    <FlexItem>
                      <Text component={TextVariants.small}>mistral-7b-instruct-v2</Text>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                    <FlexItem>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: 'var(--pf-t--chart--color--orange--300)', 
                        borderRadius: '2px' 
                      }}></div>
                    </FlexItem>
                    <FlexItem>
                      <Text component={TextVariants.small}>stable-diffusion-xl-beta</Text>
                    </FlexItem>
                  </Flex>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </FlexItem>

        {/* Usage Trends Chart */}
        <FlexItem>
          <Card>
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
              <div style={{ height: '400px' }}>
                <Chart
                  ariaDesc="Usage trends over time line chart"
                  ariaTitle="Usage trends showing model usage over time"
                  containerComponent={<ChartContainer responsive={true} />}
                  height={400}
                  padding={{ left: 50, top: 20, right: 50, bottom: 80 }}
                  themeColor={ChartThemeColor.multi}
                >
                  <ChartAxis dependentAxis tickFormat={(x) => `${x}`} />
                  <ChartAxis 
                    tickFormat={(x) => new Date(x).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <ChartArea
                    data={usageTrendsData['llm-7b-chat']}
                    interpolation="monotoneX"
                    style={{ data: { fill: 'var(--pf-t--chart--color--blue--300)', fillOpacity: 0.3 } }}
                  />
                  <ChartLine
                    data={usageTrendsData['mistral-7b-instruct-v2']}
                    interpolation="monotoneX"
                    style={{ data: { stroke: 'var(--pf-t--chart--color--teal--300)', strokeWidth: 2 } }}
                  />
                  <ChartLine
                    data={usageTrendsData['stable-diffusion-xl-beta']}
                    interpolation="monotoneX"
                    style={{ data: { stroke: 'var(--pf-t--chart--color--orange--300)', strokeWidth: 2 } }}
                  />
                </Chart>
              </div>
              <Flex spaceItems={{ default: 'spaceItemsSm' }} style={{ marginTop: '16px' }}>
                <FlexItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                    <FlexItem>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: 'var(--pf-t--chart--color--blue--300)', 
                        borderRadius: '2px' 
                      }}></div>
                    </FlexItem>
                    <FlexItem>
                      <Text component={TextVariants.small}>llm-7b-chat</Text>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                    <FlexItem>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: 'var(--pf-t--chart--color--teal--300)', 
                        borderRadius: '2px' 
                      }}></div>
                    </FlexItem>
                    <FlexItem>
                      <Text component={TextVariants.small}>mistral-7b-instruct-v2</Text>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                    <FlexItem>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: 'var(--pf-t--chart--color--orange--300)', 
                        borderRadius: '2px' 
                      }}></div>
                    </FlexItem>
                    <FlexItem>
                      <Text component={TextVariants.small}>stable-diffusion-xl-beta</Text>
                    </FlexItem>
                  </Flex>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </FlexItem>
      </Flex>
    </PageSection>
  );
};

export { Dashboard };
